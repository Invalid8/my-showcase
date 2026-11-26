"use client";

import { type ReactNode, useState } from "react";

export function KindFilter({
  kinds,
  children,
}: {
  kinds: string[];
  children: ReactNode;
}) {
  const [kind, setKind] = useState("all");

  return (
    <div data-filter={kind}>
      <fieldset className="filters">
        <legend className="sr-only">Filter entries</legend>
        {["all", ...kinds].map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={kind === option}
            onClick={() => setKind(option)}
          >
            {option}
          </button>
        ))}
      </fieldset>
      {children}
    </div>
  );
}
