import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = `${siteConfig.name}, Frontend Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/inter-latin-400-normal.woff")),
    readFile(join(process.cwd(), "assets/fonts/inter-latin-700-normal.woff")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(160deg, #0A0A0A 0%, #141414 100%)",
        padding: 72,
        color: "#FAFAFA",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#8A8A8A",
        }}
      >
        <span>{siteConfig.name}</span>
        <span>Frontend Engineer</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          I build thoughtful interfaces for products people actually use.
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 24, color: "#A0A0A0" }}>
        {siteConfig.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
