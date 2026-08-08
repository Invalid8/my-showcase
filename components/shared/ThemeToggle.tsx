"use client";

import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const nextDark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    setDark(nextDark);
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    window.localStorage.setItem("theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center rounded-full border border-line text-secondary transition-colors hover:border-line-strong hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-4"
        aria-hidden="true"
      >
        {dark ? (
          <path
            d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ) : (
          <path
            d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.36-6.36-1.41 1.41M6.77 17.23l-1.41 1.41m0-13.41 1.41 1.41m9.9 9.9 1.41 1.41M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}

export default ThemeToggle;
