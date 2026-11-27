"use client";

import { useEffect, useId, useRef, useState } from "react";

const PLACES = 5;
const MAX = 10 ** PLACES - 1;
const STEP = 36;
const START = 1284;
const FLICK_PROJECTION = 0.35;
const PLACE_LIST = [0, 1, 2, 3, 4];
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function wheelPosition(shown: number, place: number) {
  const unit = 10 ** place;
  if (place === 0) return shown % 10;
  const base = Math.floor(shown / unit) % 10;
  const lower = shown % unit;
  const carry = Math.max(0, lower - (unit - 1));
  return base + carry;
}

const clamp = (value: number) => Math.min(MAX, Math.max(0, value));
const easeOut = (t: number) => 1 - (1 - t) ** 4;
const durationFor = (distance: number) =>
  Math.min(2600, 420 + 520 * Math.log10(distance + 1));

export function Counter() {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const drums = useRef<(HTMLDivElement | null)[]>([]);
  const blurs = useRef<(SVGFEGaussianBlurElement | null)[]>([]);
  const digits = useRef<(HTMLSpanElement | null)[][]>([]);
  const shown = useRef(0);
  const motion = useRef({ from: 0, to: 0, start: 0, duration: 0 });
  const drag = useRef<{
    y: number;
    from: number;
    last: number;
    at: number;
    speed: number;
  } | null>(null);
  const [target, setTarget] = useState(0);

  const goTo = (value: number, duration?: number) => {
    const to = Math.round(clamp(value));
    motion.current = {
      from: shown.current,
      to,
      start: performance.now(),
      duration: duration ?? durationFor(Math.abs(to - shown.current)),
    };
    setTarget(to);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const height = () => drums.current[0]?.offsetHeight ?? 1;
    const last = new Array(PLACES).fill(0);
    let previous = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const dt = Math.max(1, now - previous);
      previous = now;
      if (!drag.current) {
        const { from, to, start, duration } = motion.current;
        const t = still ? 1 : Math.min(1, (now - start) / duration);
        shown.current = from + (to - from) * easeOut(t);
      }
      const value = shown.current;
      const lit = Math.max(1, Math.floor(Math.log10(Math.max(1, value))) + 1);
      for (let place = 0; place < PLACES; place++) {
        const position = wheelPosition(value, place);
        let moved = Math.abs(position - last[place]);
        if (moved > 5) moved = 10 - moved;
        last[place] = position;
        const speed = (moved / dt) * 1000;
        blurs.current[place]?.setAttribute(
          "stdDeviation",
          `0 ${still ? 0 : Math.min(7, speed * 0.05).toFixed(2)}`,
        );
        const window = drums.current[place]?.parentElement?.parentElement;
        if (window) window.dataset.unlit = String(place >= lit);
        const radius = height() * 1.3;
        digits.current[place]?.forEach((span, digit) => {
          if (!span) return;
          const delta = ((digit - position + 15) % 10) - 5;
          const angle = delta * STEP;
          const facing = Math.cos((angle * Math.PI) / 180);
          span.style.opacity =
            Math.abs(angle) >= 90 ? "0" : String(0.12 + 0.88 * facing ** 2);
          span.style.transform = `translateZ(${-radius}px) rotateX(${-angle}deg) translateZ(${radius}px)`;
        });
      }
      frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || motion.current.to !== 0) return;
        motion.current = {
          from: 0,
          to: START,
          start: performance.now(),
          duration: durationFor(START),
        };
        setTarget(START);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    frame = requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      y: event.clientY,
      from: shown.current,
      last: shown.current,
      at: performance.now(),
      speed: 0,
    };
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag.current) return;
    const height = drums.current[0]?.offsetHeight ?? 1;
    const now = performance.now();
    const value = clamp(
      drag.current.from + (drag.current.y - event.clientY) / height,
    );
    const elapsed = Math.max(1, now - drag.current.at);
    drag.current.speed =
      drag.current.speed * 0.6 +
      ((value - drag.current.last) / elapsed) * 1000 * 0.4;
    drag.current.last = value;
    drag.current.at = now;
    shown.current = value;
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const { speed } = drag.current;
    drag.current = null;
    const coast = speed * FLICK_PROJECTION;
    goTo(shown.current + coast, 380 + Math.min(1600, Math.abs(coast) * 60));
  };

  return (
    <div className="counter-demo">
      <svg width="0" height="0" aria-hidden="true" className="counter-filters">
        {PLACE_LIST.map((place) => (
          <filter key={place} id={`${id}-blur-${place}`} x="0" y="-20%">
            <feGaussianBlur
              ref={(node) => {
                blurs.current[place] = node;
              }}
              stdDeviation="0 0"
            />
          </filter>
        ))}
      </svg>
      <div
        ref={root}
        className="counter"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`Counter at ${target.toLocaleString("en")}. Drag up or down to turn it.`}
      >
        {[...PLACE_LIST].reverse().map((place) => (
          <div
            key={place}
            className="counter-window"
            data-unlit={place > 0 ? "true" : undefined}
          >
            <div
              className="counter-blur"
              style={{ filter: `url(#${id}-blur-${place})` }}
            >
              <div
                className="counter-drum"
                ref={(node) => {
                  drums.current[place] = node;
                }}
              >
                {DIGITS.map((digit) => (
                  <span
                    key={digit}
                    ref={(node) => {
                      digits.current[place] ??= [];
                      digits.current[place][digit] = node;
                    }}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="counter-controls">
        <button
          type="button"
          className="mono-link"
          onClick={() => goTo(target + 1)}
        >
          +1
        </button>
        <button
          type="button"
          className="mono-link"
          onClick={() => goTo(target + 9)}
        >
          +9
        </button>
        <button
          type="button"
          className="mono-link"
          onClick={() => goTo(1000 + Math.floor(Math.random() * 60000))}
        >
          jump
        </button>
        <button type="button" className="mono-link" onClick={() => goTo(0)}>
          back to zero
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {target.toLocaleString("en")}
      </p>
    </div>
  );
}
