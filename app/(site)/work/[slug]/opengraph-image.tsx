import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { caseStudies } from "@/content/case-studies";
import { person } from "@/content/home";
import { Ascii, OgFrame, og, ogFonts, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Case study";

const SUN = [
  "    ---     |:::::::::",
  "            |:::::::::",
  "             \\::::::::",
  "              \\:::::::",
  "          /    '.:::::",
  "         /       '-.__",
  "        /             ",
];

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study =
    caseStudies.find((entry) => entry.slug === slug) ?? caseStudies[0];
  const icon = await readFile(join(process.cwd(), "public", study.icon));

  return new ImageResponse(
    <OgFrame
      footer={
        <span style={{ fontSize: 22, color: og.muted }}>{person.name}</span>
      }
    >
      <div style={{ display: "flex", position: "absolute", top: 0, right: -11 }}>
        <Ascii lines={SUN} size={16} />
      </div>
      {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain img */}
      <img
        src={`data:image/png;base64,${icon.toString("base64")}`}
        width={96}
        height={96}
        style={{ borderRadius: 22, marginBottom: 56 }}
        alt=""
      />
      <span
        style={{
          fontFamily: "Mono",
          fontSize: 20,
          letterSpacing: 4,
          color: og.faint,
        }}
      >
        CASE STUDY
      </span>
      <span style={{ fontSize: 64, marginTop: 14 }}>{study.name}</span>
      <div
        style={{
          display: "flex",
          fontFamily: "Serif",
          fontStyle: "italic",
          fontSize: 46,
          lineHeight: 1.2,
          maxWidth: 560,
        }}
      >
        {study.line}
      </div>
    </OgFrame>,
    { ...size, fonts: await ogFonts() },
  );
}
