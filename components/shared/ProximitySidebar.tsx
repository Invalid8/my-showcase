"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type SectionKind = "title" | "subtitle" | "section" | "body";
type Side = "left" | "right";

export type ProximitySection = {
  id: string;
  label: string;
  kind?: SectionKind;
};

type ProximitySidebarProps = {
  sections?: ProximitySection[];
  side?: Side;
  container?: string;
  headings?: string;
};

const RADIUS = 40;
const MAX_DASH_WIDTH = 110;
const SCROLL_PULSE_RESET_DELAY = 80;

const kindByTag: Record<string, SectionKind> = {
  h1: "title",
  h2: "subtitle",
  h3: "section",
  h4: "body",
  h5: "body",
  h6: "body",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const readHeadings = (
  container: string,
  headings: string,
): ProximitySection[] => {
  const root = document.querySelector(container);
  if (!root) return [];

  const taken = new Set<string>();

  return Array.from(root.querySelectorAll<HTMLElement>(headings))
    .filter(
      (node) =>
        !node.closest(".proximity-sidebar") && !!node.textContent?.trim(),
    )
    .map((node) => {
      const label = (node.textContent ?? "").trim();
      let id = node.id;

      if (!id) {
        const base = slugify(label);
        id = base;
        let suffix = 2;
        while (taken.has(id) || document.getElementById(id)) {
          id = `${base}-${suffix++}`;
        }
        node.id = id;
      }

      taken.add(id);
      if (!node.style.scrollMarginTop) node.style.scrollMarginTop = "6rem";

      return {
        id,
        label,
        kind: kindByTag[node.tagName.toLowerCase()] ?? "body",
      };
    });
};

const sameSections = (a: ProximitySection[], b: ProximitySection[]) =>
  a.length === b.length &&
  a.every(
    (item, index) => item.id === b[index].id && item.kind === b[index].kind,
  );

const dashPresets: Record<
  SectionKind,
  { base: number; bump: number; className: string }
> = {
  title: { base: 40, bump: 70, className: "bg-foreground" },
  subtitle: { base: 36, bump: 64, className: "bg-foreground" },
  section: { base: 30, bump: 56, className: "bg-line-strong" },
  body: { base: 24, bump: 50, className: "bg-line-strong" },
};

const getSectionKind = (section: ProximitySection): SectionKind => {
  if (section.kind) return section.kind;
  if (typeof document === "undefined") return "body";
  const heading = document
    .getElementById(section.id)
    ?.querySelector("h1, h2, h3, h4, h5, h6");
  const tagName = heading?.tagName.toLowerCase();
  if (tagName === "h1") return "title";
  if (tagName === "h2") return "subtitle";
  if (tagName === "h3") return "section";
  return "body";
};

type DashProps = {
  active: boolean;
  mouseY: MotionValue<number>;
  onSelect: (id: string) => void;
  section: ProximitySection;
  sectionKind: SectionKind;
  side: Side;
  dashId: string;
  registerDash: (id: string, node: HTMLButtonElement | null) => void;
};

function Dash({
  active,
  mouseY,
  onSelect,
  section,
  sectionKind,
  side,
  dashId,
  registerDash,
}: DashProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const preset = dashPresets[sectionKind];

  useEffect(() => {
    registerDash(dashId, ref.current);
    return () => registerDash(dashId, null);
  }, [dashId, registerDash]);
  const distance = useTransform(mouseY, (y) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? y - (rect.top + rect.height / 2) : RADIUS;
  });
  const targetScale = useTransform(
    distance,
    [-RADIUS, 0, RADIUS],
    [
      preset.base / MAX_DASH_WIDTH,
      (preset.base + preset.bump) / MAX_DASH_WIDTH,
      preset.base / MAX_DASH_WIDTH,
    ],
    { clamp: true },
  );
  const scale = useSpring(targetScale, {
    stiffness: 320,
    damping: 34,
    mass: 0.7,
  });

  return (
    <button
      ref={ref}
      type="button"
      aria-current={active ? "location" : undefined}
      aria-label={`Go to ${section.label}`}
      title={section.label}
      className="group flex h-px w-[110px] items-center border-0 bg-transparent p-0 outline-none"
      onClick={() => onSelect(section.id)}
    >
      <motion.span
        className={`block transition-colors duration-150 group-focus-visible:ring-2 group-focus-visible:ring-accent ${active ? "bg-accent" : preset.className}`}
        style={{
          width: MAX_DASH_WIDTH,
          height: active ? 2 : 1,
          scaleX: scale,
          transformOrigin: side === "left" ? "left center" : "right center",
        }}
      />
    </button>
  );
}

function ProximitySidebar({
  sections,
  side = "left",
  container = "main",
  headings = "h1, h2, h3",
}: ProximitySidebarProps) {
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);
  const shouldReduceMotion = useReducedMotion();
  const dashRefs = useRef(new Map<string, HTMLButtonElement>());
  const pointerInside = useRef(false);
  const [detected, setDetected] = useState<ProximitySection[]>([]);
  const resolved = sections ?? detected;
  const [activeId, setActiveId] = useState(sections?.[0]?.id);
  const [inside, setInside] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    if (sections) return;

    const root = document.querySelector(container);
    if (!root) return;

    let frame = 0;
    const sync = () => {
      const next = readHeadings(container, headings);
      setDetected((current) => (sameSections(current, next) ? current : next));
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    sync();
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections, container, headings]);

  const registerDash = useCallback(
    (id: string, node: HTMLButtonElement | null) => {
      if (node) dashRefs.current.set(id, node);
      else dashRefs.current.delete(id);
    },
    [],
  );

  const pulseSection = useCallback(
    (id?: string) => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      const dash = id ? dashRefs.current.get(`${id}-0`) : undefined;
      if (dash)
        mouseY.set(dash.getBoundingClientRect().top + dash.offsetHeight / 2);

      if (pointerInside.current) return;

      resetTimer.current = window.setTimeout(() => {
        mouseY.set(Number.POSITIVE_INFINITY);
        resetTimer.current = null;
      }, SCROLL_PULSE_RESET_DELAY);
    },
    [mouseY],
  );

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const selectSection = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
      pulseSection(id);
    },
    [pulseSection, shouldReduceMotion],
  );

  useEffect(() => {
    const updateActiveSection = () => {
      const anchorY = window.innerHeight * 0.4;
      let nextId = resolved[0]?.id;
      let shortestDistance = Number.POSITIVE_INFINITY;

      for (const section of resolved) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const distance =
          rect.top <= anchorY && rect.bottom >= anchorY
            ? 0
            : Math.min(
                Math.abs(rect.top - anchorY),
                Math.abs(rect.bottom - anchorY),
              );
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nextId = section.id;
        }
      }

      setActiveId(nextId);
      if (!inside) pulseSection(nextId);
    };

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [inside, pulseSection, resolved]);

  if (!resolved.length) return null;

  return (
    <nav
      aria-label="Page sections"
      className={`proximity-sidebar pointer-events-none fixed inset-y-0 z-40 hidden h-screen items-center lg:flex ${
        side === "left" ? "left-0 justify-start" : "right-0 justify-end"
      }`}
    >
      <div
        className={`pointer-events-auto mx-8 flex flex-col gap-2 ${
          side === "left" ? "items-start" : "items-end"
        }`}
        onPointerMove={(event) => {
          pointerInside.current = true;
          setInside(true);
          mouseY.set(event.clientY);
        }}
        onPointerLeave={() => {
          pointerInside.current = false;
          setInside(false);
          mouseY.set(Number.POSITIVE_INFINITY);
        }}
      >
        {resolved.flatMap((section) => {
          const sectionKind = getSectionKind(section);

          return Array.from({ length: 5 }, (_, index) => (
            <Dash
              key={`${section.id}-${index}`}
              active={index === 0 && section.id === activeId}
              mouseY={mouseY}
              onSelect={selectSection}
              section={section}
              sectionKind={index === 0 ? sectionKind : "body"}
              side={side}
              dashId={`${section.id}-${index}`}
              registerDash={registerDash}
            />
          ));
        })}
      </div>
      <span className="sr-only">
        {inside ? "Section navigator active" : ""}
      </span>
    </nav>
  );
}

export default ProximitySidebar;
