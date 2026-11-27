import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { craftNumber, crafts } from "@/content/crafts";
import { TURNTABLE_FRAMES } from "@/lib/ascii/turntable";
import { Ascii, OgCard, ogFonts, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Craft";

async function accent(slug: string) {
  switch (slug) {
    case "drawer":
    case "agent-cursor": {
      const icon = await readFile(
        join(
          process.cwd(),
          `public/icons/${slug === "drawer" ? "baseband" : "cosmic"}.png`,
        ),
      );
      return (
        // biome-ignore lint/performance/noImgElement: ImageResponse renders plain img
        <img
          src={`data:image/png;base64,${icon.toString("base64")}`}
          width={96}
          height={96}
          style={{ borderRadius: 22 }}
          alt=""
        />
      );
    }
    case "heart":
      return <span style={{ fontSize: 120, color: "#e5484d" }}>♥</span>;
    case "motto":
      return <Ascii lines={["Mxqtpj ezvhe I wkvhgd ql eyfsa."]} size={28} />;
    default:
      return <Ascii lines={TURNTABLE_FRAMES[0]} size={10} />;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const craft = crafts.find((entry) => entry.slug === slug) ?? crafts[0];

  return new ImageResponse(
    <OgCard
      label={`Craft ${craftNumber(craft.slug)}`}
      title={craft.title}
      line={craft.line}
      accent={await accent(craft.slug)}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
