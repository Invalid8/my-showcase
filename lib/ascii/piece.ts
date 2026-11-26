import { type Metrics, metrics } from "./metrics";
import type { Pointer } from "./pointer";
import { AGITATE, pick, SCRAMBLE } from "./random";

export type PieceOptions = {
  lines: string[];
  size?: number;
  className?: string;
  radius?: number;
};

export class Piece {
  readonly el: HTMLPreElement;
  readonly m: Metrics;
  readonly radius: number;
  x = 0;
  y = 0;
  cols = 0;
  rows = 0;
  private base: string[] = [];
  private energy = new Float32Array();
  private angle = new Float32Array();
  private revealAt = new Float32Array();

  constructor(
    stage: HTMLElement,
    { lines, size = 12, className = "", radius = 70 }: PieceOptions,
  ) {
    this.m = metrics(size);
    this.radius = radius;
    this.el = document.createElement("pre");
    this.el.className = `ascii ${className}`;
    this.el.style.fontSize = `${size}px`;
    stage.append(this.el);
    this.setLines(lines);
  }

  get width() {
    return this.cols * this.m.w;
  }

  get height() {
    return this.rows * this.m.h;
  }

  setLines(lines: string[]) {
    const cols = Math.max(...lines.map((l) => l.length));
    if (cols !== this.cols || lines.length !== this.rows) {
      this.cols = cols;
      this.rows = lines.length;
      const size = this.rows * this.cols;
      this.energy = new Float32Array(size);
      this.angle = new Float32Array(size);
      this.revealAt = new Float32Array(size);
    }
    this.base = lines.map((l) => l.padEnd(cols));
  }

  reveal(t0: number, spread = 900) {
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        this.revealAt[r * this.cols + c] =
          t0 + (c / this.cols) * spread + Math.random() * 380;
  }

  settle() {
    this.revealAt.fill(0);
  }

  place(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }

  draw(t: number, pointer: Pointer) {
    const { w, h } = this.m;
    const { rows, cols, radius } = this;
    const out = Array.from({ length: rows }, () =>
      new Array<string>(cols).fill(" "),
    );
    for (let r = 0; r < rows; r++) {
      const line = this.base[r];
      for (let c = 0; c < cols; c++) {
        const ch = line[c];
        if (ch === " ") continue;
        const i = r * cols + c;
        if (t < this.revealAt[i]) {
          out[r][c] = pick(SCRAMBLE);
          continue;
        }
        const dx = this.x + c * w + w / 2 - pointer.x;
        const dy = this.y + r * h + h / 2 - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        let e = this.energy[i] * 0.93;
        if (d < radius) {
          const k = 1 - d / radius;
          if (k > e) {
            e = k;
            this.angle[i] = Math.atan2(dy, dx);
          }
        }
        this.energy[i] = e;
        if (e > 0.06) {
          const push = e * e * 3.2;
          const nc = c + Math.round(Math.cos(this.angle[i]) * push);
          const nr = r + Math.round(Math.sin(this.angle[i]) * push * 0.55);
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            out[nr][nc] = Math.random() < e * 0.7 ? pick(AGITATE) : ch;
          }
          continue;
        }
        if (out[r][c] === " ") out[r][c] = ch;
      }
    }
    this.el.textContent = out.map((row) => row.join("")).join("\n");
  }
}
