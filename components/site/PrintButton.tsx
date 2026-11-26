"use client";

export function PrintButton() {
  return (
    <button type="button" className="text-link" onClick={() => window.print()}>
      Print
    </button>
  );
}
