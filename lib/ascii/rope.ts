import { type Metrics, metrics } from "./metrics";
import type { Pointer } from "./pointer";

type Point = { x: number; y: number; px: number; py: number };

export class Rope {
  private readonly m: Metrics;
  private readonly len: number;
  private readonly pts: Point[];
  private readonly spans: HTMLSpanElement[];

  constructor(
    stage: HTMLElement,
    private readonly anchor: number,
    segments: number,
    size = 12,
  ) {
    this.m = metrics(size);
    this.len = this.m.h * 0.95;
    this.pts = Array.from({ length: segments + 1 }, (_, i) => ({
      x: anchor,
      y: i * this.len,
      px: anchor,
      py: i * this.len,
    }));
    this.spans = this.pts.slice(1).map(() => {
      const span = document.createElement("span");
      span.className = "ascii-rope";
      span.style.fontSize = `${size}px`;
      stage.append(span);
      return span;
    });
  }

  get end() {
    return this.pts[this.pts.length - 1];
  }

  step(t: number, pointer: Pointer) {
    const n = this.pts.length;
    for (let i = 1; i < n; i++) {
      const p = this.pts[i];
      const vx = (p.x - p.px) * 0.96;
      const vy = (p.y - p.py) * 0.96;
      p.px = p.x;
      p.py = p.y;
      p.x += vx + Math.sin(t / 2300 + this.anchor) * 0.0009 * i;
      p.y += vy + 0.28;
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 64) p.x += (dx / d) * (64 - d) * 0.035;
    }
    for (let k = 0; k < 8; k++) {
      this.pts[0].x = this.anchor;
      this.pts[0].y = 0;
      for (let i = 0; i < n - 1; i++) {
        const a = this.pts[i];
        const b = this.pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const diff = (d - this.len) / d;
        if (i === 0) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else {
          a.x += dx * diff * 0.5;
          a.y += dy * diff * 0.5;
          b.x -= dx * diff * 0.5;
          b.y -= dy * diff * 0.5;
        }
      }
    }
    for (let i = 0; i < n - 1; i++) {
      const a = this.pts[i];
      const b = this.pts[i + 1];
      const ang = Math.atan2(b.x - a.x, b.y - a.y);
      const span = this.spans[i];
      span.textContent = Math.abs(ang) < 0.16 ? "|" : ang > 0 ? "\\" : "/";
      span.style.transform = `translate(${((a.x + b.x) / 2 - this.m.w / 2).toFixed(1)}px, ${((a.y + b.y) / 2 - this.m.h / 2).toFixed(1)}px)`;
    }
  }
}
