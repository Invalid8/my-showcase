import type { Track } from "./types";

export function getVideoId(url: string): string {
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/(?:embed|shorts|live)\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return "";
}

export function trackId(track: Track): string {
  return track.id || getVideoId(track.url);
}

export function trackArtwork(track: Track): string | undefined {
  if (track.artwork) return track.artwork;

  const id = trackId(track);
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : undefined;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}
