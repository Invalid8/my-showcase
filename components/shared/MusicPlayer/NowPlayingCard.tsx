"use client";

import Link from "next/link";
import { ArrowUpRight } from "../../Icons";
import type { Track } from "./types";
import { formatTime, trackArtwork } from "./utils";

type NowPlayingCardProps = {
  track?: Track;
  isPlaying?: boolean;
  isBuffering?: boolean;
  progress?: number;
  duration?: number;
  className?: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-line py-2">
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[1.1px] text-muted">
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-[12px] text-secondary">
        {value}
      </span>
    </div>
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
  const total = duration || track?.duration || 0;
  const artwork = track ? trackArtwork(track) : undefined;

  return (
    <aside
      className={`flex w-full flex-col gap-4 overflow-hidden rounded-[3px] border border-line bg-surface p-4 ${className}`}
    >
      {artwork ? (
        <div
          className="min-h-[110px] w-full flex-1 rounded-xs bg-cover bg-center"
          style={{ backgroundImage: `url("${artwork}")` }}
        />
      ) : (
        <div className="grid min-h-[110px] w-full flex-1 place-items-center rounded-xs border border-line bg-surface-raised">
          <span className="font-mono text-[9px] uppercase tracking-[1.1px] text-muted">
            No record
          </span>
        </div>
      )}

      <div className="min-w-0 shrink-0 space-y-1">
        <p className="font-mono text-[9px] uppercase tracking-[1.2px] text-label">
          {!track
            ? "Empty deck"
            : isBuffering
              ? "Buffering"
              : isPlaying
                ? "On the deck"
                : "Cued up"}
        </p>
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
      </div>

      <div className="flex shrink-0 flex-col">
        {track?.album && <Row label="Album" value={track.album} />}
        {track?.year && <Row label="Year" value={track.year} />}
        {track?.genre && <Row label="Genre" value={track.genre} />}
        <Row
          label="Length"
          value={
            total ? `${formatTime(progress)} / ${formatTime(total)}` : "--:--"
          }
        />
      </div>

      {track && (
        <Link
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[1.2px] text-secondary transition-colors duration-200 hover:text-accent"
        >
          Open in YouTube Music
          <ArrowUpRight className="size-2.5" />
        </Link>
      )}
    </aside>
  );
}

export default NowPlayingCard;
