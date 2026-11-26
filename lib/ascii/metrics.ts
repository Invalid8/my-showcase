export type Metrics = { w: number; h: number };

const cache = new Map<number, Metrics>();

export const LINE_HEIGHT = 1.2;

export function metrics(size: number): Metrics {
  const hit = cache.get(size);
  if (hit) return hit;
  const probe = document.createElement("span");
  probe.className = "ascii";
  probe.style.cssText = `position:absolute;visibility:hidden;font-size:${size}px`;
  probe.textContent = "M".repeat(200);
  document.body.append(probe);
  const value = {
    w: probe.getBoundingClientRect().width / 200,
    h: size * LINE_HEIGHT,
  };
  probe.remove();
  cache.set(size, value);
  return value;
}
