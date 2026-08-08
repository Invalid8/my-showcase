"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "../../Icons";
import type { Track } from "./types";
import { formatTime, trackArtwork, trackId } from "./utils";

type NowPlayingCardProps = {
  track?: Track;
  isPlaying?: boolean;
  isBuffering?: boolean;
  progress?: number;
  duration?: number;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="flex items-baseline justify-between gap-3 border-t border-line py-2">
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[1.1px] text-muted">
          {label}
        </span>
        <span className="min-w-0 truncate text-right text-[12px] text-secondary">
          {value}
        </span>
      </div>
    </motion.div>
  );
}

function NowPlayingCard({
  track,
  isPlaying = false,
  isBuffering = false,
  progress = 0,
  duration,
  className = "",
}: NowPlayingCardProps) {
  const reduceMotion = useReducedMotion();
  const total = duration || track?.duration || 0;
  const artwork = track ? trackArtwork(track) : undefined;
  const key = track ? trackId(track) || track.url : "empty";

  const status = !track
    ? "Empty deck"
    : isBuffering
      ? "Buffering"
      : isPlaying
        ? "On the deck"
        : "Cued up";

  const rows = [
    track?.album ? { label: "Album", value: track.album } : null,
    track?.year ? { label: "Year", value: track.year } : null,
    track?.genre ? { label: "Genre", value: track.genre } : null,
    {
      label: "Length",
      value: total ? `${formatTime(progress)} / ${formatTime(total)}` : "--:--",
    },
  ].filter((row) => row !== null);

  return (
    <motion.aside
      layout={!reduceMotion}
      transition={{ duration: 0.4, ease: EASE }}
      className={`flex w-full flex-col gap-4 overflow-hidden rounded-[3px] border border-line bg-surface p-4 ${className}`}
    >
      <motion.div
        layout={!reduceMotion}
        className="relative min-h-[110px] w-full flex-1 overflow-hidden rounded-xs"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={key}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.06, filter: "blur(6px)" }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.02, filter: "blur(4px)" }
            }
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 bg-surface-raised bg-cover bg-center"
            style={
              artwork ? { backgroundImage: `url("${artwork}")` } : undefined
            }
          >
            {!artwork && (
              <span className="grid size-full place-items-center font-mono text-[9px] uppercase tracking-[1.1px] text-muted">
                No record
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div layout={!reduceMotion} className="min-w-0 shrink-0">
        <p className="font-mono text-[9px] uppercase tracking-[1.2px] text-label">
          {status}
        </p>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={key}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="mt-1 min-w-0 space-y-1"
          >
            <p
              title={track?.title}
              className="line-clamp-2 text-[15px] font-semibold leading-tight tracking-[-0.2px] text-primary"
            >
              {track?.title ?? "Nothing queued"}
            </p>
            <p
              title={track?.artist}
              className="truncate text-[12.5px] text-secondary"
            >
              {track?.artist ?? "Choose a record below"}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div layout={!reduceMotion} className="flex shrink-0 flex-col">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((row) => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
        </AnimatePresence>
      </motion.div>

      {track && (
        <motion.div layout={!reduceMotion} className="shrink-0">
          <Link
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[1.2px] text-secondary transition-colors duration-200 hover:text-accent"
          >
            Open in YouTube Music
            <ArrowUpRight className="size-2.5" />
          </Link>
        </motion.div>
      )}
    </motion.aside>
  );
}

export default NowPlayingCard;
