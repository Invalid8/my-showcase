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
    let fit = () => {};

    const start = () => {
      const m = metrics(SIZE);
      const cols = () => Math.floor(stage.clientWidth / m.w);
      const desert = new Desert(cols(), m);
      const now = performance.now();
      const scene = new Piece(stage, {
        lines: desert.render(now),
        size: SIZE,
        className: "scene",
        radius: 52,
      });
      fit = () => {
        desert.resize(cols());
        scene.setLines(desert.render(performance.now()));
        scene.place(stage.clientWidth - scene.width, 0);
      };
      fit();

      if (prefersReducedMotion()) {
        scene.draw(now, { x: FAR, y: FAR });
        fit = () => {
          desert.resize(cols());
          scene.setLines(desert.render(0));
          scene.place(stage.clientWidth - scene.width, 0);
          scene.draw(0, { x: FAR, y: FAR });
        };
        return;
      }

      scene.reveal(now, 1400);
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

    let started = false;
    const observer = new ResizeObserver(() => {
      if (started) fit();
      else {
        started = true;
        start();
      }
    });
    document.fonts.ready.then(() => observer.observe(stage));

    return () => {
      observer.disconnect();
      cleanup();
      stage.replaceChildren();
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
