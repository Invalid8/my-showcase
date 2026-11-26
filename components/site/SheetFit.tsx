"use client";

import { type ReactNode, useEffect, useRef } from "react";

const SHEET_WIDTH = 794;

export function SheetFit({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const scale = Math.min(1, entry.contentRect.width / SHEET_WIDTH);
      el.style.setProperty("--sheet-scale", String(scale));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} className="sheet-fit" suppressHydrationWarning>
      {children}
    </div>
  );
}
