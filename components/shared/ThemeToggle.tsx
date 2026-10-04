"use client";

import { useTheme } from "next-themes";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="grid size-9 place-items-center rounded-full border border-line text-secondary transition-colors hover:border-line-strong hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-4"
        aria-hidden="true"
      >
        <path
          d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="hidden in-data-[theme=dark]:block"
        />
        <path
          d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.36-6.36-1.41 1.41M6.77 17.23l-1.41 1.41m0-13.41 1.41 1.41m9.9 9.9 1.41 1.41M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="in-data-[theme=dark]:hidden"
        />
      </svg>
    </button>
  );
}

export default ThemeToggle;
