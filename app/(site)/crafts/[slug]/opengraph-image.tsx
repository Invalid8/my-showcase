import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO, LOGO_BOX } from "@/components/crafts/pin-slip/job";
import { craftNumber, crafts } from "@/content/crafts";
import { TURNTABLE_FRAMES } from "@/lib/ascii/turntable";
import { Ascii, OgCard, ogFonts, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Craft";

const ZIGZAG = `M0 0H190V6${Array.from({ length: 19 }, (_, i) => `L${185 - i * 10} 12L${180 - i * 10} 6`).join("")}Z`;

function OgSlip() {
  const ink = "#23252b";
  const line = {
    fontFamily: "Mono",
    fontSize: 13,
    color: ink,
    lineHeight: 1.5,
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 190,
        marginTop: -48,
        transform: "rotate(-2deg)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "40px 16px 14px",
          background: "linear-gradient(#f8f7f3, #efeee9)",
        }}
      >
        <svg
          aria-hidden="true"
          width={42}
          height={15}
          viewBox={`${LOGO_BOX.x} ${LOGO_BOX.y} ${LOGO_BOX.width} ${LOGO_BOX.height}`}
        >
          <path d={LOGO} fill={ink} />
        </svg>
        <span style={{ ...line, marginTop: 10 }}>PIN SLIP · PRIVATE</span>
        <span style={line}>--------------------</span>
        <span style={line}>TEMPORARY PIN</span>
        <span
          style={{
            ...line,
            fontSize: 34,
            lineHeight: 1.2,
            whiteSpace: "pre",
            marginTop: 6,
            alignSelf: "center",
          }}
        >
          4 7 2 9
        </span>
      </div>
      <svg aria-hidden="true" width={190} height={12} viewBox="0 0 190 12">
        <path d={ZIGZAG} fill="#efeee9" />
      </svg>
    </div>
  );
}

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
    case "pin-slip":
      return <OgSlip />;
    case "count-up":
      return <Ascii lines={["01284"]} size={88} />;
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
