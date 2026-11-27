"use client";

import { useEffect, useRef, useState } from "react";
import type { Engine, SlipState } from "./pin-slip/engine";
import {
  firstSlip,
  nextSlip,
  PAPER_HEIGHT,
  PAPER_WIDTH,
  type Slip,
} from "./pin-slip/job";
import { SlipSvg } from "./pin-slip/SlipSvg";

const RATIO = PAPER_HEIGHT / PAPER_WIDTH;

const LABEL: Record<SlipState, string> = {
  empty: "Print",
  printing: "Printing…",
  attached: "Tear it off",
  torn: "Print another",
};

const SAID: Record<SlipState, string> = {
  empty: "",
  printing: "Printing a PIN slip.",
  attached: "Printed. Drag the slip, or press Enter to tear it off.",
  torn: "Torn off. Press Enter to print another.",
};

const NUDGE: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function PinSlip() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rest = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);
  const slip = useRef<Slip>(firstSlip);
  const printed = useRef(0);
  const [live, setLive] = useState(false);
  const [state, setState] = useState<SlipState>("attached");

  useEffect(() => {
    const el = stage.current;
    const view = canvas.current;
    const box = rest.current;
    if (!el || !view || !box) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = false;
    let visible = false;
    let gone = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.2) seen = true;
        engine.current?.visible(visible);
        if (entry.intersectionRatio >= 0.5) engine.current?.print();
      },
      { threshold: [0, 0.2, 0.5] },
    );
    io.observe(el);

    import("./pin-slip/engine").then(async ({ createEngine }) => {
      const { paintSlip } = await import("./pin-slip/paint");
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-jetbrains-mono")
        .trim();
      const face = family.split(",")[0];
      await Promise.all([
        document.fonts.load(`400 12px ${face}`),
        document.fonts.load(`700 12px ${face}`),
      ]);
      if (gone) return;
      const start = seen ? "rest" : "empty";
      const made = createEngine({
        canvas: view,
        rest: box,
        ratio: RATIO,
        start,
        paint: (scale) => paintSlip(slip.current, scale, family),
        onState: setState,
      });
      if (!made) return;
      engine.current = made;
      made.visible(visible);
      setState(start === "rest" ? "attached" : "empty");
      setLive(true);
      const settled = el.getBoundingClientRect();
      const share = Math.min(settled.bottom, innerHeight) - settled.top;
      if (start === "empty" && share >= settled.height * 0.5) made.print();
    });

    const resize = new ResizeObserver(() => engine.current?.layout());
    resize.observe(el);
    const theme = new MutationObserver(() => engine.current?.redraw());
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    const redraw = () => engine.current?.redraw();
    scheme.addEventListener("change", redraw);

    return () => {
      gone = true;
      io.disconnect();
      resize.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", redraw);
      engine.current?.destroy();
      engine.current = null;
    };
  }, []);

  const act = () => {
    const current = engine.current;
    if (!current) return;
    if (state === "attached") current.tear();
    else if (state === "torn" || state === "empty") {
      if (state === "torn") {
        printed.current += 1;
        slip.current = nextSlip(printed.current);
      }
      current.print();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = engine.current;
    if (!current) return;
    const nudge = NUDGE[event.key];
    if (nudge) {
      event.preventDefault();
      current.nudge(...nudge);
    } else if (event.key === "Enter") {
      event.preventDefault();
      act();
    }
  };

  return (
    <div
      className="slip-demo"
      data-live={live || undefined}
      style={{ "--ratio": RATIO } as React.CSSProperties}
    >
      <div
        ref={stage}
        className="slip-stage"
        role="application"
        aria-label="A BAAS PIN slip hanging from a receipt printer. Drag it to bend it, pull hard to tear it off. Arrow keys sway it, Enter tears it off or prints another."
        tabIndex={live ? 0 : -1}
        onKeyDown={onKeyDown}
      >
        <div className="slip-printer" />
        <div ref={rest} className="slip-rest">
          <SlipSvg slip={firstSlip} />
        </div>
        <canvas ref={canvas} className="slip-canvas" />
        <div className="slip-teeth" />
      </div>
      {live && (
        <button
          type="button"
          className="mono-link slip-action"
          onClick={act}
          disabled={state === "printing"}
        >
          <span key={state}>{LABEL[state]}</span>
        </button>
      )}
      <p className="sr-only" aria-live="polite">
        {live ? SAID[state] : ""}
      </p>
    </div>
  );
}
