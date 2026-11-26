export type Pointer = { x: number; y: number };

export const FAR = -1e4;

export function trackPointer(stage: HTMLElement) {
  const pointer: Pointer = { x: FAR, y: FAR };
  const move = (e: PointerEvent) => {
    const rect = stage.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const leave = () => {
    pointer.x = FAR;
    pointer.y = FAR;
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  return {
    pointer,
    release() {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    },
  };
}

export function visibleBand(stage: HTMLElement) {
  const top = -stage.getBoundingClientRect().top;
  return { top, bottom: top + window.innerHeight };
}
