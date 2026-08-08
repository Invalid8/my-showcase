"use client";

import Link from "next/link";
import { ArrowUpRight } from "../../Icons";
import Disc from "./Disc";
import type { Track } from "./types";
import { formatTime, trackArtwork } from "./utils";

const ARM_PARKED = 129;
const ARM_START = 139.1;
const ARM_END = 151;

const METAL =
  "linear-gradient(180deg, #111111 0%, #9A9A9A 30%, #4E4E4E 62%, #151515 100%)";

export type TurnableProps = {
  track?: Track;
  isPlaying?: boolean;
  isBuffering?: boolean;
  progress?: number;
  duration?: number;
  volume?: number;
  disabled?: boolean;
  onToggle?: () => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
};

function Turnable({
  track,
  isPlaying = false,
  isBuffering = false,
  progress = 0,
  duration,
  volume = 80,
  disabled = false,
  onToggle,
  onVolumeChange,
  className = "",
}: TurnableProps) {
  const total = duration || track?.duration || 0;
  const ratio = total > 0 ? Math.min(progress / total, 1) : 0;
  const live = isPlaying || isBuffering;

  const armAngle = live
    ? ARM_START + (ARM_END - ARM_START) * ratio
    : ARM_PARKED;

  return (
    <div className={`flex w-full max-w-207 flex-col gap-7.5 ${className}`}>
      <div className="relative aspect-828/464 w-full overflow-hidden rounded-[3px] bg-[#0A0A0A]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 75% 75% at 72% 10%, #1A1A1A 0%, #0A0A0A 100%)",
          }}
        />

        <div
          className="absolute left-[7.005%] top-[6.034%] h-[87.93%] w-[85.99%] rounded-md"
          style={{
            backgroundImage:
              "linear-gradient(81.271deg, #212121 4.563%, #171717 50%, #111111 95.437%)",
            boxShadow:
              "0 14px 30px -10px rgba(0,0,0,0.9), 0 1px 0 0 rgba(255,255,255,0.18), 0 -1px 0 0 rgba(0,0,0,0.7)",
          }}
        />

        <div className="absolute left-[13.285%] top-[14.224%] aspect-square w-[39.13%] rounded-full bg-black opacity-75 blur-[5px]" />

        <div
          className="absolute left-[13.527%] top-[13.793%] aspect-square w-[38.647%] rounded-full"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg at 50% 50%, #9E9E9E 0%, #3E3E3E 10%, #7C7C7C 22%, #2E2E2E 33%, #8E8E8E 46%, #343434 58%, #868686 70%, #2A2A2A 83%, #9E9E9E 100%)",
          }}
        />

        <div
          className="absolute left-[14.493%] top-[15.517%] aspect-square w-[36.715%] rounded-full"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg at 50% 50%, #6E6E6E 0%, #282828 12%, #5C5C5C 26%, #222222 38%, #666666 50%, #262626 63%, #5A5A5A 76%, #202020 88%, #6E6E6E 100%)",
          }}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled || !track}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="absolute left-[16.063%] top-[18.319%] aspect-square w-[33.575%] rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed"
        >
          <Disc
            artwork={track ? trackArtwork(track) : undefined}
            label={track?.title ?? "Empty deck"}
            spinning={live}
            active
            grooves="fine"
          />
        </button>

        <div
          className="absolute left-[68.32%] top-[24.87%] h-[1.509%] w-[8.937%] origin-top-left rounded-full"
          style={{ backgroundImage: METAL, transform: "rotate(-40.9deg)" }}
        />

        <div
          className="absolute left-[64.855%] top-[18.75%] aspect-square w-[7.488%] rounded-full"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 62.5% 62.5% at 34% 28%, #565656 0%, #121212 100%)",
            boxShadow: "0 4px 9px 0 rgba(0,0,0,0.85)",
          }}
        />
        <div
          className="absolute left-[66.546%] top-[21.767%] aspect-square w-[4.106%] rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(60deg, #4A4A4A 13.397%, #232323 50%, #3A3A3A 86.603%)",
          }}
        />

        <div
          className="pointer-events-none absolute left-[69.0%] top-[26.25%] h-[2.155%] w-[35.628%] origin-top-left rounded-full transition-transform duration-700 ease-out"
          style={{
            backgroundImage: METAL,
            boxShadow: "2px 4px 7px 0 rgba(0,0,0,0.8)",
            transform: `rotate(${armAngle}deg)`,
          }}
        >
          <div className="absolute left-[80.88%] top-[-106%] h-[40%] w-[8.814%] rounded-full bg-[#6E6E6E]" />
          <div
            className="absolute left-[87.46%] top-[-56%] h-[220%] w-[15.593%] rounded-xs"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #3E3E3E 0%, #1A1A1A 60%, #0C0C0C 100%)",
              boxShadow: "2px 4px 7px 0 rgba(0,0,0,0.8)",
            }}
          />
          <div className="absolute left-[94.03%] top-[-35%] h-[130%] w-[6.78%] rounded-[1px] bg-[#0E0E0E]" />
          <div className="absolute left-[98.5%] top-1/2 aspect-square w-[1.695%] -translate-y-1/2 rounded-full bg-[#D4D4D4]" />
        </div>

        <div
          className="absolute left-[67.754%] top-[23.922%] aspect-square w-[1.691%] rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(60deg, #111111 13.397%, #9A9A9A 35.359%, #4E4E4E 58.785%, #151515 86.603%)",
          }}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled || !track}
          aria-label={isPlaying ? "Stop the record" : "Start the record"}
          className="absolute left-[10.87%] top-[76.51%] aspect-square w-[5.797%] rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg at 50% 50%, #4A4A4A 0%, #1E1E1E 25%, #464646 50%, #1C1C1C 75%, #4A4A4A 100%)",
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.8)",
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${live ? 130 : -40}deg)` }}
          >
            <div
              className="absolute left-1/2 top-1/2 aspect-square w-[70.8%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(60deg, #4A4A4A 13.397%, #232323 50%, #3A3A3A 86.603%)",
              }}
            />
            <div className="absolute left-[46.9%] top-[22.9%] h-[20.8%] w-[6.3%] rounded-full bg-[#B4B4B4]" />
          </div>
        </button>

        <div
          className="absolute left-[19.082%] top-[80.388%] aspect-square w-[0.725%] rounded-full transition-colors duration-300"
          style={{
            backgroundColor: live ? "#8FE327" : "#2C3D14",
            boxShadow: live ? "0 0 6px 1px rgba(143,227,39,0.4)" : "none",
          }}
        />

        <div className="absolute left-[82.971%] top-[42.241%] h-[37.069%] w-[4.106%]">
          <div
            className="absolute left-[26.47%] h-full w-[47.05%] rounded-full bg-[#070707]"
            style={{ boxShadow: "0 2px 3px 0 rgba(0,0,0,0.9)" }}
          />
          <div className="absolute left-[38.24%] top-[40.7%] h-[0.58%] w-[23.53%] bg-[#5A5A5A]" />

          <div
            className="pointer-events-none absolute left-0 h-[10.46%] w-full rounded-xs"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #6E6E6E 0%, #2A2A2A 50%, #4E4E4E 100%)",
              boxShadow: "2px 4px 7px 0 rgba(0,0,0,0.8)",
              top: `${(1 - volume / 100) * 89.54}%`,
            }}
          >
            <div className="absolute left-[35.3%] top-[44.4%] h-[11.1%] w-[11.8%] bg-[#C4C4C4]" />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            disabled={disabled}
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
            aria-label="Volume"
            className="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed"
            style={{ writingMode: "vertical-lr", direction: "rtl" }}
          />
        </div>

        <div className="absolute left-[83.333%] top-[32.328%] h-[0.647%] w-[3.382%] rounded-full bg-[#4A4A4A]" />
      </div>

      <div className="flex w-full flex-col gap-2.25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.75">
            <span
              className="size-1.25 shrink-0 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isPlaying ? "#8FE327" : "#3C3C3C" }}
            />
            <span className="font-mono text-[9.5px] uppercase tracking-[1.3px] text-label">
              {isBuffering ? "Buffering" : isPlaying ? "Now playing" : "Paused"}
            </span>
          </div>
          <span className="font-mono text-[9.5px] tracking-[0.8px] text-muted">
            {formatTime(progress)} / {total ? formatTime(total) : "--:--"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="truncate text-[15px] font-semibold tracking-[-0.2px] text-primary">
              {track?.title ?? "Nothing queued"}
            </span>
            <span className="h-px w-2.5 shrink-0 bg-line-strong" />
            <span className="truncate text-[13px] text-secondary">
              {track?.artist ?? "Choose a record below"}
            </span>
          </div>

          {track && (
            <Link
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.25 font-mono text-[9.5px] uppercase tracking-[1.2px] text-secondary transition-colors duration-200 hover:text-accent"
            >
              YouTube Music
              <ArrowUpRight className="size-2.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Turnable;
