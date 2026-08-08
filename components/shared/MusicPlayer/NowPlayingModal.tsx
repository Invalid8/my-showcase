"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { Close } from "../../Icons";
import NowPlayingCard from "./NowPlayingCard";
import type { Track } from "./types";

type NowPlayingModalProps = {
  open: boolean;
  onClose: () => void;
  track?: Track;
  isPlaying?: boolean;
  isBuffering?: boolean;
  progress?: number;
  duration?: number;
};

function NowPlayingModal({
  open,
  onClose,
  track,
  isPlaying,
  isBuffering,
  progress,
  duration,
}: NowPlayingModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 grid place-items-center p-4 lg:hidden"
        >
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[320px]"
          >
            <h2 id={titleId} className="sr-only">
              {track ? `${track.title} by ${track.artist}` : "Now playing"}
            </h2>

            <NowPlayingCard
              className="max-h-[80svh] w-full overflow-y-auto shadow-2xl"
              track={track}
              isPlaying={isPlaying}
              isBuffering={isBuffering}
              progress={progress}
              duration={duration}
            />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 grid size-9 place-items-center rounded-full border border-line bg-surface text-secondary outline-offset-4 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Close />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NowPlayingModal;
