"use client";

import { useCallback, useState } from "react";
import { playlist } from "@/utils/constants";
import Disc from "./Disc";
import NowPlayingCard from "./NowPlayingCard";
import Turnable from "./Turnable";
import type { Playlist } from "./types";
import { PLAYER_SIZE, useYouTubePlayer } from "./useYouTubePlayer";
import { trackArtwork, trackId } from "./utils";

type MusicPlayerProps = {
  source?: Playlist;
};

function MusicPlayer({ source = playlist }: MusicPlayerProps) {
  const tracks = source.tracks;
  const [index, setIndex] = useState<number | null>(null);
  const [volume, setVolume] = useState(80);
  const current = index === null ? undefined : tracks[index];

  const step = useCallback(
    (delta: number) => {
      setIndex((value) =>
        value === null
          ? value
          : (value + delta + tracks.length) % tracks.length,
      );
    },
    [tracks.length],
  );

  const onEnded = useCallback(() => step(1), [step]);

  const {
    containerRef,
    isPlaying,
    isBuffering,
    progress,
    duration,
    failed,
    toggle,
    keepPlaying,
  } = useYouTubePlayer({
    videoId: current ? trackId(current) : "",
    onEnded,
    volume,
  });

  const select = useCallback(
    (next: number) => {
      if (next === index) {
        toggle();
        return;
      }
      keepPlaying(true);
      setIndex(next);
    },
    [index, keepPlaying, toggle],
  );

  return (
    <section suppressHydrationWarning>
      <div className="content-box">
        <h2 className="font-mono text-[11px] uppercase tracking-[1.4px] text-label">
          Currently listening
        </h2>
        <p className="max-w-176.5 pt-4 text-[15.5px]/[25px] text-secondary">
          Usually somewhere in the background while I&rsquo;m working.
        </p>

        <div className="relative flex flex-col items-stretch gap-6 pt-12">
          <Turnable
            track={current}
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            progress={progress}
            duration={duration}
            volume={volume}
            onToggle={toggle}
            onVolumeChange={setVolume}
          />
          <NowPlayingCard
            className="min-[1440px]:absolute min-[1440px]:left-full min-[1440px]:top-12 min-[1440px]:ml-6 min-[1440px]:h-(--deck-height) min-[1440px]:w-66"
            track={current}
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            progress={progress}
            duration={duration}
          />
        </div>

        {failed && (
          <p className="pt-4 text-[13px] text-warm">
            This track can&rsquo;t be played here. Open it on YouTube Music
            instead.
          </p>
        )}
      </div>

      <div className="slider pt-14">
        <ul className="flex w-max gap-6.25 pe-4 ps-[max(16px,calc(50vw-406px))] md:pe-6 pb-5">
          {tracks.map((track, position) => {
            const isCurrent = position === index;

            return (
              <li key={trackId(track) || track.url}>
                <button
                  type="button"
                  onClick={() => select(position)}
                  aria-current={isCurrent}
                  aria-label={`${track.title} by ${track.artist}`}
                  className="block w-42 rounded-full outline-offset-4 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-accent motion-safe:hover:opacity-90"
                >
                  <Disc
                    artwork={trackArtwork(track)}
                    label={track.title}
                    spinning={isCurrent && (isPlaying || isBuffering)}
                    active={isCurrent}
                    grooves="coarse"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        ref={containerRef}
        aria-hidden="true"
        style={{ width: PLAYER_SIZE, height: PLAYER_SIZE }}
        className="pointer-events-none fixed left-0 top-0 -z-10 overflow-hidden opacity-0"
      />
    </section>
  );
}

export default MusicPlayer;
