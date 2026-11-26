import type { ReactNode } from "react";

export function Section({
  id,
  label,
  children,
}: {
  id: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="section"
      aria-labelledby={label ? `${id}-label` : undefined}
    >
      {label && (
        <h2 id={`${id}-label`} className="section-label">
          {label}
        </h2>
      )}
      {children}
    </section>
  );
}
