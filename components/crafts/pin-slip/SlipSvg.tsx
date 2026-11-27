import { useId } from "react";
import {
  FADE_STOPS,
  FONT_SIZE,
  HATCH_GAP,
  INK,
  LOGO,
  LOGO_BOX,
  outline,
  PAPER_BOTTOM,
  PAPER_TOP,
  PAPER_WIDTH,
  PIN_SIZE,
  printJob,
  type Slip,
} from "./job";

export function SlipSvg({ slip }: { slip: Slip }) {
  const id = useId().replace(/:/g, "");
  const { ops, height } = printJob(slip);
  return (
    <svg
      viewBox={`0 0 ${PAPER_WIDTH} ${height}`}
      aria-hidden="true"
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
    >
      <defs>
        <linearGradient id={`${id}-paper`} x2="0" y2="1">
          <stop offset="0" stopColor={PAPER_TOP} />
          <stop offset="1" stopColor={PAPER_BOTTOM} />
        </linearGradient>
        <linearGradient id={`${id}-fade`}>
          {FADE_STOPS.map(([at, ink]) => (
            <stop
              key={at}
              offset={at}
              stopColor={`rgb(${ink * 255} ${ink * 255} ${ink * 255})`}
            />
          ))}
        </linearGradient>
        <mask id={`${id}-ink`} maskUnits="userSpaceOnUse">
          <rect width={PAPER_WIDTH} height={height} fill={`url(#${id}-fade)`} />
        </mask>
        <pattern
          id={`${id}-hatch`}
          width={HATCH_GAP}
          height={HATCH_GAP}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="0.8" height={HATCH_GAP} fill={INK} opacity="0.3" />
        </pattern>
      </defs>
      <path d={outline(height)} fill={`url(#${id}-paper)`} />
      <g mask={`url(#${id}-ink)`} fill={INK}>
        {ops.map((op, index) => {
          const key = `${op.kind}-${index}`;
          switch (op.kind) {
            case "text":
              return (
                <text
                  key={key}
                  x={op.x}
                  y={op.y}
                  fontSize={FONT_SIZE}
                  fontWeight={op.bold ? 700 : 400}
                  xmlSpace="preserve"
                >
                  {op.text}
                </text>
              );
            case "pin":
              return (
                <text
                  key={key}
                  x={op.x}
                  y={op.y}
                  fontSize={PIN_SIZE}
                  fontWeight={700}
                  textAnchor="middle"
                  xmlSpace="preserve"
                >
                  {op.text}
                </text>
              );
            case "logo": {
              const scale = op.height / LOGO_BOX.height;
              return (
                <path
                  key={key}
                  d={LOGO}
                  transform={`translate(${op.x} ${op.y - LOGO_BOX.y * scale}) scale(${scale})`}
                />
              );
            }
            case "band":
              return (
                <rect
                  key={key}
                  x={op.x}
                  y={op.y}
                  width={op.width}
                  height={op.height}
                  rx="4"
                  fill={`url(#${id}-hatch)`}
                  stroke={INK}
                  strokeOpacity="0.45"
                  strokeWidth="0.8"
                />
              );
            case "bars":
              return op.bars.map(([x, width]) => (
                <rect
                  key={`${key}-${x}`}
                  x={x}
                  y={op.y}
                  width={width}
                  height={op.height}
                />
              ));
            default:
              return null;
          }
        })}
      </g>
    </svg>
  );
}
