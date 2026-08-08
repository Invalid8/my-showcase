"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { type ReactNode, useId, useState } from "react";
import { cn } from "@/utils";

export type PopIcon = {
  key: string;
  icon: ReactNode;
  label?: string;
  background?: string;
  foreground?: string;
};

type IconPopProps = {
  icons: PopIcon[];
  children: ReactNode;
  href?: string;
  className?: string;
  badgeClassName?: string;
  spread?: number;
  gap?: number;
  lift?: number;
};

const BADGE = 40;

function place(index: number, count: number, spread: number, gap: number) {
  const offset = index - (count - 1) / 2;

  return {
    x: offset * gap,
    y: Math.abs(offset) * 6,
    rotate: offset * spread,
  };
}

function IconPop({
  icons,
  children,
  href,
  className,
  badgeClassName,
  spread = 16,
  gap = 34,
  lift = 10,
}: IconPopProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const labelId = useId();

  const container: Variants = {
    rest: {},
    pop: {
      transition: { staggerChildren: 0.045, delayChildren: 0.02 },
    },
  };

  const content = (
    <>
      <motion.span
        aria-hidden="true"
        variants={container}
        initial="rest"
        animate={open ? "pop" : "rest"}
        className="pointer-events-none absolute bottom-full left-1/2 block h-0 w-0"
      >
        {icons.map((item, index) => {
          const target = place(index, icons.length, spread, gap);

          return (
            <motion.span
              key={item.key}
              variants={{
                rest: reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      x: 0,
                      y: 14,
                      rotate: 0,
                      scale: 0.45,
                    },
                pop: reduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      x: target.x,
                      y: target.y - lift,
                      rotate: target.rotate,
                      scale: 1,
                    },
              }}
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : {
                      type: "spring",
                      stiffness: 520,
                      damping: 21,
                      mass: 0.6,
                    }
              }
              style={{
                marginLeft: -BADGE / 2,
                width: BADGE,
                height: BADGE,
                backgroundColor: item.background ?? "var(--color-surface)",
                color: item.foreground ?? "var(--color-foreground)",
                zIndex: icons.length - Math.abs(index - (icons.length - 1) / 2),
              }}
              className={cn(
                "absolute bottom-0 left-0 grid place-items-center rounded-xl shadow-lg shadow-black/30 ring-1 ring-white/15",
                badgeClassName,
              )}
            >
              {item.icon}
            </motion.span>
          );
        })}
      </motion.span>

      {children}
    </>
  );

  const handlers = {
    onPointerEnter: () => setOpen(true),
    onPointerLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };

  const described = icons
    .map((item) => item.label)
    .filter(Boolean)
    .join(", ");

  if (href) {
    const external = /^https?:\/\//.test(href);

    return (
      <span className="relative inline-block">
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-describedby={described ? labelId : undefined}
          className={cn(
            "relative inline-block whitespace-nowrap text-foreground underline decoration-line-strong underline-offset-4 outline-offset-2 transition-colors duration-200 hover:text-accent hover:decoration-accent focus-visible:text-accent focus-visible:decoration-accent focus-visible:outline-2 focus-visible:outline-accent",
            className,
          )}
          {...handlers}
        >
          {content}
        </Link>
        {described && (
          <span id={labelId} className="sr-only">
            {described}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={cn("relative inline-block", className)} {...handlers}>
      {content}
    </span>
  );
}

export default IconPop;
