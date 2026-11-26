import type { Pointer } from "./pointer";

const CYCLE = [".", "·", "+", "✦", "+", "·"];

type Mote = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  glyphAt: number;
  g: number;
  minX: number;
  maxX: number;
};

export class Dust {
  private readonly motes: Mote[] = [];

  constructor(
    stage: HTMLElement,
    {
      count,
      width,
      top,
      bottom,
      column,
    }: {
      count: number;
      width: number;
      top: number;
      bottom: number;
      column: number;
    },
  ) {
    const band = Math.max(60, (width - column) / 2 - 80);
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "ascii-dust";
      stage.append(el);
      const left = i % 2 === 0;
      this.motes.push({
        el,
        x: left ? 20 + Math.random() * band : width - 20 - Math.random() * band,
        y: top + Math.random() * (bottom - top),
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        glyphAt: 0,
        g: 0,
        minX: left ? 10 : width - band - 30,
        maxX: left ? band + 30 : width - 10,
      });
    }
  }

  step(t: number, pointer: Pointer) {
    for (const p of this.motes) {
      const fx = Math.sin(p.y / 140 + t / 3100 + p.phase) * 0.18;
      const fy = Math.cos(p.x / 160 + t / 2700 + p.phase) * 0.14 - 0.05;
      p.vx += (fx - p.vx) * 0.03;
      p.vy += (fy - p.vy) * 0.03;
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 110) {
        p.vx += (dx / d) * (110 - d) * 0.012;
        p.vy += (dy / d) * (110 - d) * 0.012;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < p.minX) p.vx += 0.05;
      if (p.x > p.maxX) p.vx -= 0.05;
      if (t > p.glyphAt) {
        p.g = (p.g + 1) % CYCLE.length;
        p.glyphAt = t + 900 + Math.random() * 2200;
        p.el.textContent = CYCLE[p.g];
      }
      p.el.style.opacity = (
        0.25 +
        0.45 * (0.5 + 0.5 * Math.sin(t / 1400 + p.phase))
      ).toFixed(2);
      p.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
    }
  }
}
