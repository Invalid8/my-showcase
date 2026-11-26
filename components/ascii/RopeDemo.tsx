"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, subscribe } from "@/lib/ascii/loop";
import { trackPointer } from "@/lib/ascii/pointer";
import { Rope } from "@/lib/ascii/rope";

export function RopeDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const width = stage.clientWidth;
    const ropes = [0.2, 0.35, 0.5, 0.65, 0.8].map(
      (k, i) => new Rope(stage, width * k, 10 + ((i * 3) % 7)),
    );
    const { pointer, release } = trackPointer(stage);
    if (prefersReducedMotion()) {
      for (const rope of ropes)
        for (let i = 0; i < 60; i++) rope.step(0, pointer);
      release();
      return () => stage.replaceChildren();
    }
    const unsubscribe = subscribe((t) => {
      for (const rope of ropes) rope.step(t, pointer);
    });
    return () => {
      unsubscribe();
      release();
      stage.replaceChildren();
    };
  }, []);

  return <div ref={ref} className="demo-stage h-72" aria-hidden="true" />;
}
