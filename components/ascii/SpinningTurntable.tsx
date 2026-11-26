"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, subscribe } from "@/lib/ascii/loop";
import { Notes } from "@/lib/ascii/notes";
import { Piece } from "@/lib/ascii/piece";
import { trackPointer } from "@/lib/ascii/pointer";
import { TURNTABLE_FRAME_MS, TURNTABLE_FRAMES } from "@/lib/ascii/turntable";

export function SpinningTurntable({ size = 8 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const piece = new Piece(stage, {
      lines: TURNTABLE_FRAMES[0],
      size,
      radius: 70,
    });
    piece.place((stage.clientWidth - piece.width) / 2, 24);
    stage.style.height = `${piece.height + 48}px`;
    const { pointer, release } = trackPointer(stage);
    if (prefersReducedMotion()) {
      piece.draw(0, pointer);
      release();
      return () => stage.replaceChildren();
    }
    piece.reveal(performance.now(), 900);
    const notes = new Notes(stage);
    let frame = 0;
    let lastSpin = 0;
    let lastText = 0;
    let nextNote = performance.now() + 1200;
    const unsubscribe = subscribe((t) => {
      if (t - lastSpin > TURNTABLE_FRAME_MS) {
        frame = (frame + 1) % TURNTABLE_FRAMES.length;
        piece.setLines(TURNTABLE_FRAMES[frame]);
        lastSpin = t;
      }
      if (t > nextNote) {
        notes.spawn(
          piece.x + piece.width * 0.62,
          piece.y + piece.height * 0.3,
          t,
        );
        nextNote = t + 1600 + Math.random() * 1400;
      }
      if (t - lastText > 33) {
        piece.draw(t, pointer);
        lastText = t;
      }
      notes.step(t);
    });
    return () => {
      unsubscribe();
      release();
      stage.replaceChildren();
    };
  }, [size]);

  return <div ref={ref} className="demo-stage" aria-hidden="true" />;
}
