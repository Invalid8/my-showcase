import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { Desert } from "./ascii/desert/scene";

export const ogSize = { width: 1200, height: 630 };

const COLORS = {
  bg: "#0e0d0d",
  text: "#f2f2f2",
  muted: "#949494",
  faint: "#6e6e6e",
  ascii: "#4f4f4c",
};

const font = (file: string) =>
  readFile(join(process.cwd(), "assets/fonts", file));

export async function ogFonts() {
  const [inter, serif, mono] = await Promise.all([
    font("inter-latin-400-normal.woff"),
    font("instrument-serif-latin-400-italic.woff"),
    font("jetbrains-mono-latin-400-normal.woff"),
  ]);
  return [
    {
      name: "Inter",
      data: inter,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Serif",
      data: serif,
      weight: 400 as const,
      style: "italic" as const,
    },
    {
      name: "Mono",
      data: mono,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

export function desertLines(cols: number) {
  const desert = new Desert(cols, { w: 8, h: 16 });
  const far = { x: -1e4, y: -1e4 };
  for (let t = 0; t <= 9000; t += 50) desert.step(t, 50, far, { x: 0, y: 0 });
  return desert.render(9000);
}

export function Ascii({
  lines,
  size,
  color = COLORS.ascii,
}: {
  lines: string[];
  size: number;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Mono",
        fontSize: size,
        lineHeight: 1.2,
        whiteSpace: "pre",
        color,
      }}
    >
      {lines.join("\n")}
    </div>
  );
}

export function OgFrame({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: COLORS.bg,
        padding: "0 80px 56px",
        fontFamily: "Inter",
        color: COLORS.text,
        position: "relative",
      }}
    >
      {children}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 28,
        }}
      >
        {footer}
        <span style={{ fontFamily: "Mono", fontSize: 20, color: COLORS.faint }}>
          dalgoridim.com
        </span>
      </div>
    </div>
  );
}

export const og = COLORS;
