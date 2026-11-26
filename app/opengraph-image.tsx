import { ImageResponse } from "next/og";
import { mottos, person } from "@/content/home";
import { Ascii, desertLines, OgFrame, og, ogFonts, ogSize } from "@/lib/og";

export const alt = `${person.name}, ${person.role}`;
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 86400;

const DAY = 86_400_000;

export default async function OpengraphImage() {
  return new ImageResponse(
    <OgFrame footer={<span />}>
      <div style={{ display: "flex", position: "absolute", top: 0, right: -9 }}>
        <Ascii lines={desertLines(168).slice(0, 22)} size={12} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 28,
          lineHeight: 1.35,
        }}
      >
        <span>{person.name}</span>
        <span style={{ color: og.muted }}>{person.role}</span>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Serif",
          fontStyle: "italic",
          fontSize: 46,
          marginTop: 24,
        }}
      >
        {mottos[Math.floor(Date.now() / DAY) % mottos.length]}
      </div>
    </OgFrame>,
    { ...size, fonts: await ogFonts() },
  );
}
