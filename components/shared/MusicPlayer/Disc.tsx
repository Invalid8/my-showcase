"use client";

const GROOVES = {
  fine: [
    "repeating-radial-gradient(circle closest-side at 50% 50%, rgba(0,0,0,0.4) 0 0.6%, transparent 0.6% 2.9%, rgba(255,255,255,0.04) 2.9% 3.5%, transparent 3.5% 5.8%)",
    "radial-gradient(circle closest-side at 50% 50%, transparent 0 49%, rgba(255,255,255,0.02) 49% 81%, transparent 81%)",
  ].join(", "),
  coarse: [
    "radial-gradient(circle closest-side at 50% 50%, transparent 0 48.4%, rgba(255,255,255,0.03) 48.4% 49.4%, transparent 49.4% 60.9%, rgba(255,255,255,0.06) 60.9% 61.9%, transparent 61.9% 73.4%, rgba(255,255,255,0.06) 73.4% 74.4%, transparent 74.4% 85.9%, rgba(255,255,255,0.06) 85.9% 86.9%, transparent 86.9%)",
  ].join(", "),
} as const;

const BODY = {
  fine: "radial-gradient(ellipse 70% 70% at 42% 36%, #141414 0%, #050505 100%)",
  coarse:
    "radial-gradient(ellipse 65% 65% at 42% 36%, #1F1F1F 0%, #0A0A0A 100%)",
} as const;

const SHEEN = {
  fine: "linear-gradient(-128deg, transparent 14.379%, rgba(255,255,255,0.2) 25.778%, transparent 38.601%, transparent 61.399%, rgba(255,255,255,0.12) 74.222%, transparent 85.621%)",
  coarse:
    "linear-gradient(-125deg, rgba(255,255,255,0.08) 14.099%, transparent 53.59%, transparent 85.901%)",
} as const;

export type DiscProps = {
  artwork?: string;
  label?: string;
  spinning?: boolean;
  active?: boolean;
  revolution?: number;
  grooves?: keyof typeof GROOVES;
  className?: string;
};

function Disc({
  artwork,
  label,
  spinning = false,
  active = false,
  revolution = 1.8,
  grooves = "coarse",
  className = "",
}: DiscProps) {
  return (
    <div
      className={`relative aspect-square rounded-full ${className}`}
      style={{
        backgroundImage: BODY[grooves],
        boxShadow:
          grooves === "fine"
            ? "0 2px 5px 0 rgba(0,0,0,0.8)"
            : "0 6px 18px -4px rgba(0,0,0,0.8)",
      }}
    >
      <div
        className="absolute inset-0 rounded-full motion-safe:animate-spin motion-reduce:animate-none"
        style={{
          animationDuration: `${revolution}s`,
          animationTimingFunction: "linear",
          animationPlayState: spinning ? "running" : "paused",
          backgroundImage: GROOVES[grooves],
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-deep bg-cover bg-center"
          style={artwork ? { backgroundImage: `url("${artwork}")` } : undefined}
        >
          {!artwork && (
            <span className="grid size-full place-items-center px-2 text-center font-mono text-[0.5rem] uppercase leading-tight tracking-widest text-accent">
              {label}
            </span>
          )}
        </div>

        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            boxShadow: active
              ? "inset 0 0 0 1px rgba(143,227,39,0.45)"
              : "inset 0 0 0 1px rgba(255,255,255,0.12)",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              grooves === "fine"
                ? "linear-gradient(60deg, #C4C4C4 13.397%, #5A5A5A 53.66%, #8E8E8E 86.603%)"
                : "#0A0A0A",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ backgroundImage: SHEEN[grooves] }}
      />

      <div
        className="pointer-events-none absolute inset-[0.9%] rounded-full"
        style={{
          boxShadow: active
            ? "inset 0 0 0 1px rgba(143,227,39,0.6)"
            : "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}

export default Disc;
