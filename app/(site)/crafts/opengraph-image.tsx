import { ImageResponse } from "next/og";
import { crafts } from "@/content/crafts";
import { TURNTABLE_FRAMES } from "@/lib/ascii/turntable";
import { Ascii, OgCard, ogFonts, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Crafts";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      label={`${crafts.length} crafts`}
      title="Crafts"
      line="Things I made because I wanted to see them move."
      accent={<Ascii lines={TURNTABLE_FRAMES[0]} size={10} />}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
