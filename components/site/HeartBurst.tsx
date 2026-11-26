"use client";

import { useRef } from "react";

export function HeartBurst() {
  const ref = useRef<HTMLButtonElement>(null);

  const burst = () => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { left, top, width } = el.getBoundingClientRect();
    for (let i = 0; i < 9; i++) {
      const heart = document.createElement("span");
      heart.className = "spark";
      heart.textContent = "♥︎";
      heart.style.left = `${left + width / 2}px`;
      heart.style.top = `${top}px`;
      document.body.append(heart);
      const drift = (Math.random() - 0.5) * 90;
      const rise = 70 + Math.random() * 70;
      const size = 0.6 + Math.random() * 0.7;
      heart
        .animate(
          [
            { transform: "translate(-50%, 0) scale(0.2)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${drift * 0.3}px), -24px) scale(${size * 1.25})`,
              opacity: 1,
              offset: 0.2,
            },
            {
              transform: `translate(calc(-50% + ${drift}px), -${rise}px) scale(${size})`,
              opacity: 0,
            },
          ],
          {
            duration: 900 + Math.random() * 500,
            delay: i * 35,
            easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
            fill: "backwards",
          },
        )
        .finished.then(() => heart.remove());
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className="heart"
      onClick={burst}
      aria-label="Love"
    >
      ♥
    </button>
  );
}
