"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "@/context/ScrollContext";

const TICKS = Array.from({ length: 48 }, (_, tick) => ({
  id: `tick-${tick}`,
  wide: tick % 2 === 1,
}));

const PITCH = 38;
const PERIOD = PITCH * 2;
const DRIFT = 0.18;

function ScrollRule() {
  const { scrollY } = useScroll();
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    let frame = 0;
    let painted = Number.NaN;

    const paint = () => {
      frame = 0;
      const offset = -((scrollY.current * DRIFT) % PERIOD);
      if (offset === painted) return;
      painted = offset;
      column.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrollY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-[52px] overflow-hidden lg:block"
    >
      <div
        ref={columnRef}
        className="absolute left-0 top-[-76px] flex flex-col gap-[37px]"
      >
        {TICKS.map((tick) => (
          <span
            key={tick.id}
            className={`h-px shrink-0 bg-line-strong ${tick.wide ? "w-[52px]" : "w-[26px]"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ScrollRule;
