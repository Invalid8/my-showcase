import { ImageResponse } from "next/og";
import { person } from "@/content/home";
import { Ascii, desertLines, OgFrame, og, ogFonts, ogSize } from "@/lib/og";

export const alt = `${person.name}, ${person.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <OgFrame footer={<span />}>
      <div style={{ display: "flex", position: "absolute", top: 28, left: 80 }}>
        <Ascii lines={desertLines(144).slice(0, 22)} size={12} />
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
          fontSize: 50,
          marginTop: 24,
        }}
      >
        Mostly tools I wanted to exist.
      </div>
    </OgFrame>,
    { ...size, fonts: await ogFonts() },
  );
}
