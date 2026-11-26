"use client";

import { useEffect, useRef } from "react";
import { Desert } from "@/lib/ascii/desert/scene";
import { prefersReducedMotion, subscribe } from "@/lib/ascii/loop";
import { metrics } from "@/lib/ascii/metrics";
import { Piece } from "@/lib/ascii/piece";
import { FAR, trackPointer, visibleBand } from "@/lib/ascii/pointer";
import { cn } from "@/utils";

const SIZE = 11;

export function DesertBand({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    let cleanup = () => {};

    const build = (replay: boolean) => {
      cleanup();
      stage.replaceChildren();
      const m = metrics(SIZE);
      const desert = new Desert(Math.floor(stage.clientWidth / m.w), m);
      const now = performance.now();
      const scene = new Piece(stage, {
        lines: desert.render(now),
        size: SIZE,
        className: "scene",
        radius: 52,
      });
      scene.place(stage.clientWidth - scene.width, 0);

      if (prefersReducedMotion()) {
        scene.settle();
        scene.draw(now, { x: FAR, y: FAR });
        cleanup = () => {};
        return;
      }

      if (replay) scene.reveal(now, 1400);
      else scene.settle();
      const { pointer, release } = trackPointer(stage);
      let lastText = 0;
      const unsubscribe = subscribe((t, dt) => {
        const band = visibleBand(stage);
        if (band.bottom < 0 || band.top > scene.height) return;
        desert.step(t, dt, pointer, scene);
        if (t - lastText > 33) {
          scene.setLines(desert.render(t));
          scene.draw(t, pointer);
          lastText = t;
        }
      });
      cleanup = () => {
        unsubscribe();
        release();
      };
    };

    let width = 0;
    const observer = new ResizeObserver(() => {
      if (stage.clientWidth === width) return;
      const replay = width === 0;
      width = stage.clientWidth;
      build(replay);
    });
    document.fonts.ready.then(() => observer.observe(stage));

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("desert-band", className)}
      aria-hidden="true"
    />
  );
}
