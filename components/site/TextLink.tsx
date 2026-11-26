import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils";

type Arrow = "external" | "forward";

const ARROWS: Record<Arrow, string> = { external: "↗", forward: "→" };

export function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href);
}

export function TextLink({
  href,
  children,
  arrow,
  dashed,
  className,
}: {
  href: string;
  children: ReactNode;
  arrow?: Arrow;
  dashed?: boolean;
  className?: string;
}) {
  const external = isExternal(href);
  const link = (
    <Link
      href={href}
      className={cn("text-link", dashed && "dashed", className)}
      {...(external && !href.startsWith("mailto:")
        ? { target: "_blank", rel: "noopener" }
        : {})}
    >
      {children}
    </Link>
  );

  if (!arrow) return link;

  return (
    <span className="link-group">
      {link}
      <span
        className={cn("link-arrow", arrow === "forward" && "forward")}
        aria-hidden="true"
      >
        {ARROWS[arrow]}
      </span>
    </span>
  );
}
