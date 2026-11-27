import { ImageResponse } from "next/og";
import { caseStudies } from "@/content/case-studies";
import { Ascii, desertLines, OgCard, ogFonts, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Work";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      label={`${caseStudies.length} case studies`}
      title="Work"
      line="Products I started and saw through, and client work."
      accent={<Ascii lines={desertLines(60).slice(0, 14)} size={12} />}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
