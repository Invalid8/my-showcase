"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playlist } from "@/utils/constants";
import Disc from "./Disc";
import NowPlayingCard from "./NowPlayingCard";
import NowPlayingModal from "./NowPlayingModal";
import Turnable from "./Turnable";
import type { Playlist } from "./types";
import { PLAYER_SIZE, useYouTubePlayer } from "./useYouTubePlayer";
import { trackArtwork, trackId } from "./utils";

type MusicPlayerProps = {
  source?: Playlist;
  variant?: "stacked" | "side";
  showIntro?: boolean;
};

type FloatingPosition = {
  left: number;
  top: number;
};

const DESKTOP = "(min-width: 1024px)";

const getFloatingPosition = (section: HTMLElement): FloatingPosition => {
  const sectionRect = section.getBoundingClientRect();
  const cardWidth = Math.min(300, window.innerWidth - 32);
  const viewportLeft =
    Math.random() > 0.5 ? 24 : window.innerWidth - cardWidth - 24;
  const top = Math.max(
    24,
    Math.round(window.innerHeight * (0.14 + Math.random() * 0.42)),
  );

  return { left: viewportLeft - sectionRect.left, top: top - sectionRect.top };
};

function MusicPlayer({
  source = playlist,
  variant = "stacked",
  showIntro = true,
}: MusicPlayerProps) {
  const side = variant === "side";
  const [unplayable, setUnplayable] = useState<string[]>([]);
  const tracks = useMemo(
    () => source.tracks.filter((track) => !unplayable.includes(trackId(track))),
    [source.tracks, unplayable],
  );
  const [index, setIndex] = useState<number | null>(null);
  const [volume, setVolume] = useState(80);
  const [floatingPosition, setFloatingPosition] = useState<
    FloatingPosition | undefined
  >();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dragOffset = useRef<{ x: number; y: number } | undefined>(undefined);
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

  const onUnplayable = useCallback((id: string) => {
    setUnplayable((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }, []);

  useEffect(() => {
    if (index === null) return;
    if (!tracks.length) setIndex(null);
    else if (index >= tracks.length) setIndex(0);
  }, [index, tracks.length]);

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
    onUnplayable,
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

      if (!window.matchMedia(DESKTOP).matches) return;

      setFloatingPosition(
        (position) =>
          position ??
          (sectionRef.current
            ? getFloatingPosition(sectionRef.current)
            : undefined),
      );
    },
    [index, keepPlaying, toggle],
  );

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const sync = () => {
      if (query.matches) setDetailsOpen(false);
    };

    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const handleCardPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("a, button, input")) return;

      const rect = event.currentTarget.getBoundingClientRect();
      dragOffset.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handleCardPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragOffset.current) return;
      const section = sectionRef.current;
      if (!section) return;
      const sectionRect = section.getBoundingClientRect();

      setFloatingPosition({
        left: Math.max(
          16 - sectionRect.left,
          Math.min(
            window.innerWidth -
              event.currentTarget.offsetWidth -
              16 -
              sectionRect.left,
            event.clientX - sectionRect.left - dragOffset.current.x,
          ),
        ),
        top: event.clientY - sectionRect.top - dragOffset.current.y,
      });
    },
    [],
  );

  const handleCardPointerUp = useCallback(() => {
    dragOffset.current = undefined;
  }, []);

  const discs = (
    <ul
      className={
        side
          ? "flex gap-5 overflow-x-auto pb-4 pe-6 lg:fixed lg:inset-y-0 lg:left-[calc(50%+486px)] lg:z-30 lg:w-46 lg:flex-col lg:gap-6 lg:overflow-x-visible lg:overflow-y-auto lg:px-2 lg:py-6 lg:pb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          : "flex w-max gap-6.25 pe-4 ps-[max(16px,calc(50vw-406px))] md:pe-6 pb-5"
      }
    >
      {tracks.map((track, position) => {
        const isCurrent = position === index;

        return (
          <li key={trackId(track) || track.url} className="shrink-0">
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
  );

  return (
    <section ref={sectionRef} suppressHydrationWarning className="relative">
      <div className={side ? "" : "content-box"}>
        {showIntro && (
          <>
            <h2 className="font-mono text-sm uppercase tracking-[1.4px] text-label">
              Currently listening
            </h2>
            <p className="max-w-176.5 pt-4 text-[15.5px]/[25px] text-secondary">
              Usually somewhere in the background while I&rsquo;m working.
            </p>
          </>
        )}

        <div
          className={
            side
              ? "flex flex-col items-stretch gap-8 ps-[max(24px,calc(50vw-430px))] pe-0 lg:block lg:pe-24"
              : "flex flex-col items-stretch gap-6 pt-12"
          }
        >
          <Turnable
            track={current}
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            progress={progress}
            duration={duration}
            volume={volume}
            onToggle={toggle}
            onVolumeChange={setVolume}
            onShowDetails={() => setDetailsOpen(true)}
          />
          {current && floatingPosition && (
            <div
              className="absolute z-50 hidden w-[min(300px,calc(100vw-32px))] cursor-grab touch-none active:cursor-grabbing lg:block"
              style={floatingPosition}
              onPointerDown={handleCardPointerDown}
              onPointerMove={handleCardPointerMove}
              onPointerUp={handleCardPointerUp}
              onPointerCancel={handleCardPointerUp}
            >
              <NowPlayingCard
                className="h-[min(72vh,454px)] w-full shadow-2xl"
                track={current}
                isPlaying={isPlaying}
                isBuffering={isBuffering}
                progress={progress}
                duration={duration}
              />
            </div>
          )}

          {side && discs}
        </div>

        {failed && (
          <output className="block pt-4 text-[13px] text-warm">
            The player is having a moment. Try again shortly.
          </output>
        )}
      </div>

      {!side && <div className="slider pt-14">{discs}</div>}

      <NowPlayingModal
        open={detailsOpen && !!current}
        onClose={() => setDetailsOpen(false)}
        track={current}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        progress={progress}
        duration={duration}
      />

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
