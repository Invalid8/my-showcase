const BARS = 5;
const ROWS = 11;
const MID = 5;
const SHAPE = [0.45, 0.75, 1, 0.75, 0.45];

export function waveform(t: number, loud: number) {
  const grid = Array.from({ length: ROWS }, () =>
    new Array<string>(BARS * 4 - 2).fill(" "),
  );
  for (let b = 0; b < BARS; b++) {
    const n =
      0.5 + 0.5 * Math.sin(t / 420 + b * 1.9) * Math.sin(t / 1130 + b * 0.7);
    const half = Math.max(
      1,
      Math.round((1 + n * 4 * (0.6 + loud * 0.8)) * SHAPE[b]),
    );
    const x = b * 4;
    for (let r = MID - half; r <= MID + half; r++) {
      if (r < 0 || r >= ROWS) continue;
      const top = r === MID - half;
      const bottom = r === MID + half;
      grid[r][x] = top ? "v" : bottom ? "7" : "]";
      grid[r][x + 1] = top ? ";" : bottom ? "^" : "|";
    }
  }
  return grid.map((r) => r.join(""));
}
