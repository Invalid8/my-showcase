"use client";

import { useEffect, useRef, useState } from "react";

export function Loop({
  src,
  poster,
  label,
  phone,
}: {
  src: string;
  poster: string;
  label: string;
  phone?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [slow, setSlow] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (video.current) video.current.playbackRate = slow ? 0.5 : 1;
  }, [slow]);

  return (
    <div className={phone ? "loop phone" : "loop"}>
      <div className="loop-screen">
        <video
          ref={video}
          src={src}
          poster={poster}
          aria-label={label}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {!playing && (
          <button
            type="button"
            className="loop-play"
            onClick={() => video.current?.play()}
            aria-label={`Play: ${label}`}
          >
            ▶
          </button>
        )}
      </div>
      <button
        type="button"
        className="loop-speed"
        onClick={() => setSlow((value) => !value)}
        aria-pressed={slow}
      >
        <span className={slow ? undefined : "on"}>1×</span>
        <span className={slow ? "on" : undefined}>0.5×</span>
      </button>
    </div>
  );
}
