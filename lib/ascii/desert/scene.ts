import type { Metrics } from "../metrics";
import type { Pointer } from "../pointer";
import SPRITES from "./sprites.json";

type SpriteName = keyof typeof SPRITES;

export const DESERT_ROWS = 24;

const SKY = ".,'`";
const SUN_A = [
  "    ---     |:::::::::",
  "            |:::::::::",
  "             \\::::::::",
  "              \\:::::::",
  "          /    '.:::::",
  "         /       '-.__",
  "        /             ",
  "                     |",
  "                     |",
];
const SUN_B = [
  "   ----     |:::::::::",
  "            |:::::::::",
  "             \\::::::::",
  "              \\:::::::",
  "          /    '.:::::",
  "         /       '-.__",
  "        /             ",
  "       /             |",
  "                     |",
  "                     |",
];
const CLOUD = ["   .-~~-.", " .(      )-.", "(___________)"];
const FLOCK = [
  [0, 0],
  [4, 1],
  [8, 0],
  [3, -1],
];

type Grid = string[][];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function heightChar(frac: number, slope: number) {
  if (slope > 0.9) return "\\";
  if (slope < -0.9) return "/";
  if (frac < 0.5) return slope < -0.3 ? "'" : slope > 0.3 ? "`" : "-";
  if (frac < 0.8) return slope < -0.3 || slope > 0.3 ? "." : "-";
  return "_";
}

function blit(grid: Grid, lines: string[], col: number, row: number) {
  const cols = grid[0].length;
  for (let r = 0; r < lines.length; r++) {
    const y = row + r;
    if (y < 0 || y >= DESERT_ROWS) continue;
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const x = col + c;
      if (x < 0 || x >= cols || line[c] === " ") continue;
      grid[y][x] = line[c];
    }
  }
}

const widthOf = (lines: string[]) => Math.max(...lines.map((l) => l.length));

type Cactus = { sprite: SpriteName; col: number; bloom: number };

export class Desert {
  private readonly texture: string[][];
  private readonly cacti: Cactus[];
  private readonly clouds = [
    { x: 0, row: 2, speed: 0.0006 },
    { x: 0, row: 5, speed: 0.0004 },
  ];
  private readonly flock = { x: -20, row: 4, speed: 0.006 };
  private readonly lizard = {
    x: -30,
    state: "wait" as "wait" | "run",
    until: 4000,
    frame: 0,
  };
  private readonly bird = { x: -60, speed: 0.009, frame: 0, at: 0 };
  private readonly snake = { x: 0, speed: -0.0015, tongue: false };

  constructor(
    readonly cols: number,
    private readonly m: Metrics,
  ) {
    const r = seeded(42);
    this.texture = Array.from({ length: DESERT_ROWS }, () =>
      Array.from({ length: cols }, () =>
        r() < 0.07 ? SKY[Math.floor(r() * SKY.length)] : " ",
      ),
    );
    this.cacti = [
      { sprite: "cactus_big", col: Math.round(cols * 0.08), bloom: 0 },
      { sprite: "cactus_small", col: Math.round(cols * 0.72), bloom: 0 },
      { sprite: "cactus_small", col: Math.round(cols * 0.9), bloom: 0 },
    ];
    this.clouds[0].x = cols * 0.3;
    this.clouds[1].x = cols * 0.66;
    this.snake.x = cols * 0.35;
  }

  private near(x: number) {
    return 19.4 + 0.3 * Math.sin(x / 34 + 2);
  }

  private ground(x: number) {
    return Math.floor(this.near(x));
  }

  private distance(
    col: number,
    row: number,
    pointer: Pointer,
    origin: Pointer,
  ) {
    return Math.hypot(
      origin.x + col * this.m.w - pointer.x,
      origin.y + row * this.m.h - pointer.y,
    );
  }

  step(t: number, dt: number, pointer: Pointer, origin: Pointer) {
    const { cols } = this;
    const flee = (col: number, row: number) => {
      const d = this.distance(col, row, pointer, origin);
      return d < 140 ? 1 + ((140 - d) / 140) * 3 : 1;
    };

    for (const c of this.clouds) {
      c.x += c.speed * dt;
      if (c.x > cols + 4) c.x = -16;
    }

    const f = this.flock;
    f.x += f.speed * dt;
    if (f.x > cols + 10) {
      f.x = -30;
      f.row = 2 + Math.random() * 5;
    }

    const lz = this.lizard;
    const scare = flee(lz.x + 7, this.ground(lz.x + 7) - 1);
    if (lz.state === "wait" && (t > lz.until || scare > 1.5)) {
      lz.state = "run";
      lz.until = t + 500 + Math.random() * 700;
    }
    if (lz.state === "run") {
      lz.x += 0.028 * dt * Math.min(scare, 2.2);
      lz.frame = Math.floor(t / 70) % 2;
      if (t > lz.until) {
        lz.state = "wait";
        lz.until = t + 900 + Math.random() * 2600;
      }
    }
    if (lz.x > cols + 10) {
      lz.x = -20;
      lz.state = "wait";
      lz.until = t + 6000;
    }

    const bd = this.bird;
    bd.x += bd.speed * dt * flee(bd.x + 4, this.ground(bd.x + 4) - 3);
    if (t - bd.at > 110) {
      bd.frame ^= 1;
      bd.at = t;
    }
    if (bd.x > cols + 10) bd.x = -80;

    const sn = this.snake;
    sn.x += sn.speed * dt * flee(sn.x, this.ground(sn.x));
    if (sn.x < -20) sn.x = cols + 10;
    sn.tongue = Math.sin(t / 160) > 0.6;

    for (const c of this.cacti) {
      const lines = SPRITES[c.sprite];
      const mid = c.col + widthOf(lines) / 2;
      const top = this.ground(mid) - lines.length + 1;
      const close = this.distance(mid, top, pointer, origin) < 70;
      c.bloom = close
        ? Math.min(1, c.bloom + dt * 0.004)
        : Math.max(0, c.bloom - dt * 0.0006);
    }
  }

  render(t: number) {
    const { cols } = this;
    const g: Grid = Array.from({ length: DESERT_ROWS }, () =>
      new Array<string>(cols).fill(" "),
    );

    const sun = Math.sin(t / 1100) > 0 ? SUN_B : SUN_A;
    blit(
      g,
      sun.map((line, r) =>
        line.replace(/:/g, (_, c: number) =>
          Math.sin(t / 520 + (c + r * 3) * 1.3) > 0.72 ? "." : ":",
        ),
      ),
      cols - 22,
      0,
    );

    for (const cloud of this.clouds)
      blit(g, CLOUD, Math.round(cloud.x), cloud.row);

    const flap = Math.floor(t / 260) % 2;
    FLOCK.forEach(([dx, dy], i) => {
      const x = Math.round(this.flock.x + dx);
      const y = Math.round(this.flock.row + dy);
      if (x >= 0 && x < cols - 1 && y >= 0)
        g[y][x] = (flap + i) % 2 ? "v" : "^";
    });

    for (let c = 0; c < cols; c++) {
      const y = this.near(c);
      const row = Math.floor(y);
      const slope = this.near(c + 0.5) - this.near(c - 0.5);
      for (let r = row; r < DESERT_ROWS; r++) g[r][c] = " ";
      if (row < DESERT_ROWS) g[row][c] = heightChar(y - row, slope * 2);
      for (let r = row + 1; r < DESERT_ROWS; r++)
        if (this.texture[r][c] !== " ") g[r][c] = this.texture[r][c];
    }

    for (const c of this.cacti) {
      const lines = SPRITES[c.sprite];
      const top = this.ground(c.col + widthOf(lines) / 2) - lines.length + 1;
      blit(g, lines, c.col, top);
      if (c.bloom > 0.05 && top - 1 >= 0) {
        const tip = c.col + lines[0].indexOf("_");
        g[top - 1][tip] = c.bloom < 0.35 ? "." : c.bloom < 0.7 ? "o" : "@";
        if (c.bloom > 0.8) {
          g[top - 1][tip - 1] = "(";
          g[top - 1][tip + 1] = ")";
        }
      }
    }

    const sx = Math.round(this.snake.x);
    const len = 16;
    for (let i = 0; i < len; i++) {
      const x = sx + i;
      if (x < 0 || x >= cols) continue;
      let ch: string;
      if (i === 0) ch = "<";
      else if (i === 1) ch = ":";
      else if (i === len - 1) ch = "~";
      else {
        const w = Math.sin(t / 220 - i * 0.75);
        ch = w > 0.55 ? "^" : w > 0.15 ? "~" : w > -0.35 ? "-" : "_";
      }
      g[this.ground(x) - 1][x] = ch;
    }
    if (this.snake.tongue && sx - 1 >= 0 && sx - 1 < cols)
      g[this.ground(sx) - 1][sx - 1] = "-";

    const bird = SPRITES[this.bird.frame ? "bird_b" : "bird_a"];
    blit(
      g,
      bird,
      Math.round(this.bird.x),
      this.ground(this.bird.x + 4) - bird.length + 1,
    );

    const lizard = SPRITES[this.lizard.frame ? "lizard_b" : "lizard_a"];
    blit(
      g,
      lizard,
      Math.round(this.lizard.x),
      this.ground(this.lizard.x + 7) - lizard.length + 1,
    );

    return g.map((row) => row.join(""));
  }
}
