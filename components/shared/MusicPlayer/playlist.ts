import type { Playlist, Track } from "./types";

const API = "https://www.googleapis.com/youtube/v3";
const ITUNES = "https://itunes.apple.com/search";
const REVALIDATE = 3600;

const NOISE =
  /\s*[([](?:official\s*)?(?:music\s*)?(?:video|audio|lyric[s]?|visualizer|hd|hq|4k|mv|full\s*album|remaster(?:ed)?(?:\s*\d{4})?)[^)\]]*[)\]]/gi;

const UNAVAILABLE = new Set(["Deleted video", "Private video"]);

type PlaylistItem = {
  snippet?: {
    title?: string;
    videoOwnerChannelTitle?: string;
    thumbnails?: Record<string, { url?: string } | undefined>;
    resourceId?: { videoId?: string };
  };
};

type VideoItem = {
  id?: string;
  contentDetails?: { duration?: string };
};

function parseDuration(iso: string | undefined): number | undefined {
  const match = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!match) return undefined;

  const [, hours, minutes, seconds] = match;
  return (
    Number(hours ?? 0) * 3600 +
    Number(minutes ?? 0) * 60 +
    Math.round(Number(seconds ?? 0))
  );
}

function splitTitle(rawTitle: string, channel: string) {
  const title = rawTitle
    .replace(NOISE, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const topic = channel.replace(/\s*-\s*Topic$/i, "").trim();
  if (topic !== channel) {
    const prefix = new RegExp(
      `^${topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*-\\s*`,
      "i",
    );
    return { title: title.replace(prefix, "").trim() || title, artist: topic };
  }

  const dash = title.split(/\s+-\s+/);
  if (dash.length > 1) {
    const [artist, ...rest] = dash;
    return { title: rest.join(" - ").trim(), artist: artist.trim() };
  }

  return { title, artist: channel.replace(/\s*-\s*Topic$/i, "").trim() };
}

function pickThumbnail(
  thumbnails: Record<string, { url?: string } | undefined> | undefined,
  videoId: string,
): string {
  const best = thumbnails?.maxres?.url ?? thumbnails?.medium?.url;
  return best ?? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

type ITunesResult = {
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  artworkUrl100?: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function alike(a: string | undefined, b: string | undefined) {
  if (!a || !b) return false;
  const x = normalize(a);
  const y = normalize(b);
  return x === y || x.includes(y) || y.includes(x);
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  work: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await work(items[index]);
      }
    },
  );

  await Promise.all(runners);
  return results;
}

async function enrich(track: Track): Promise<Partial<Track>> {
  const term = encodeURIComponent(`${track.artist} ${track.title}`);
  const response = await fetch(
    `${ITUNES}?term=${term}&entity=song&limit=5&media=music`,
    { next: { revalidate: 86400 } },
  );
  if (!response.ok) return {};

  const body: { results?: ITunesResult[] } = await response.json();
  const hit = (body.results ?? []).find(
    (result) =>
      alike(result.trackName, track.title) &&
      alike(result.artistName, track.artist),
  );
  if (!hit) return {};

  return {
    title: hit.trackName || track.title,
    artist: hit.artistName || track.artist,
    album: hit.collectionName,
    genre: hit.primaryGenreName,
    year: hit.releaseDate?.slice(0, 4),
    artwork: hit.artworkUrl100?.replace("100x100bb", "600x600bb"),
  };
}

async function durations(ids: string[], key: string) {
  const map = new Map<string, number>();

  for (let start = 0; start < ids.length; start += 50) {
    const batch = ids.slice(start, start + 50);
    const response = await fetch(
      `${API}/videos?part=contentDetails&id=${batch.join(",")}&key=${key}`,
      { next: { revalidate: REVALIDATE } },
    );
    if (!response.ok) continue;

    const body: { items?: VideoItem[] } = await response.json();
    for (const item of body.items ?? []) {
      const seconds = parseDuration(item.contentDetails?.duration);
      if (item.id && seconds) map.set(item.id, seconds);
    }
  }

  return map;
}

export async function getPlaylist(
  playlistId: string,
  fallback: Playlist,
  limit = 24,
): Promise<Playlist> {
  const key = process.env.YOUTUBE_API_KEY;

  if (!key) {
    console.warn("[MusicPlayer] YOUTUBE_API_KEY is not set — using fallback.");
    return fallback;
  }

  try {
    const tracks: Track[] = [];
    let pageToken = "";

    while (tracks.length < limit) {
      const url = new URL(`${API}/playlistItems`);
      url.searchParams.set("part", "snippet");
      url.searchParams.set("playlistId", playlistId);
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("key", key);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const response = await fetch(url, { next: { revalidate: REVALIDATE } });
      if (!response.ok) {
        throw new Error(
          `playlistItems failed: ${response.status} ${await response.text()}`,
        );
      }

      const body: { items?: PlaylistItem[]; nextPageToken?: string } =
        await response.json();

      for (const item of body.items ?? []) {
        const videoId = item.snippet?.resourceId?.videoId;
        const rawTitle = item.snippet?.title ?? "";
        if (!videoId || UNAVAILABLE.has(rawTitle)) continue;

        const { title, artist } = splitTitle(
          rawTitle,
          item.snippet?.videoOwnerChannelTitle ?? "Unknown artist",
        );

        tracks.push({
          id: videoId,
          url: `https://music.youtube.com/watch?v=${videoId}&list=${playlistId}`,
          title: title || rawTitle,
          artist: artist || "Unknown artist",
          artwork: pickThumbnail(item.snippet?.thumbnails, videoId),
        });

        if (tracks.length >= limit) break;
      }

      pageToken = body.nextPageToken ?? "";
      if (!pageToken) break;
    }

    if (!tracks.length) return fallback;

    const lengths = await durations(
      tracks.map((track) => track.id as string),
      key,
    );

    const extras = await mapLimit(tracks, 4, (track) =>
      enrich(track).catch(() => ({})),
    );

    return {
      name: fallback.name,
      tracks: tracks.map((track, index) => ({
        ...track,
        ...extras[index],
        duration: lengths.get(track.id as string),
      })),
    };
  } catch (error) {
    console.warn("[MusicPlayer] Falling back to local playlist:", error);
    return fallback;
  }
}
