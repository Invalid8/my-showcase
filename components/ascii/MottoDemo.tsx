"use client";

import { useEffect, useRef, useState } from "react";
import { decoder } from "@/lib/ascii/decode";
import { prefersReducedMotion, subscribe } from "@/lib/ascii/loop";

export function MottoDemo({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const line = lines[index];
    if (prefersReducedMotion()) {
      el.textContent = line;
      return;
    }
    const decode = decoder(line, performance.now() - 300);
    const unsubscribe = subscribe((t) => {
      const { text, done } = decode(t);
      el.textContent = text;
      if (done) unsubscribe();
    });
    return unsubscribe;
  }, [index, lines]);

  return (
    <div className="decode-demo">
      <p ref={ref} className="text-primary" aria-live="polite">
        {lines[index]}
      </p>
      <button
        type="button"
        className="mono-link mt-4"
        onClick={() =>
          setIndex(
            (i) =>
              (i + 1 + Math.floor(Math.random() * (lines.length - 1))) %
              lines.length,
          )
        }
      >
        another line
      </button>
    </div>
  );
}
