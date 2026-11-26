export function ringing(lines: string[], t: number) {
  const k = Math.floor(t / 70) % 2;
  return lines.map(
    (l, i) =>
      (i < 3 ? (k ? ` ${l}` : `${l} `) : `${l} `) +
      (i === 1 ? (k ? "  ))" : "  )") : ""),
  );
}
