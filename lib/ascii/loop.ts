export type Task = (t: number, dt: number) => void;

const tasks = new Set<Task>();
let frame = 0;
let prev = 0;
let listening = false;

function tick(t: number) {
  const dt = Math.min(50, t - prev);
  prev = t;
  for (const task of tasks) task(t, dt);
  frame = requestAnimationFrame(tick);
}

function start() {
  if (frame || document.hidden || !tasks.size) return;
  prev = performance.now();
  frame = requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
}

export function subscribe(task: Task) {
  if (!listening) {
    listening = true;
    document.addEventListener("visibilitychange", () =>
      document.hidden ? stop() : start(),
    );
  }
  tasks.add(task);
  start();
  return () => {
    tasks.delete(task);
    if (!tasks.size) stop();
  };
}

export function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
