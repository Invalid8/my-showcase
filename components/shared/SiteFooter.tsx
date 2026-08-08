"use client";

import Link from "next/link";
import { cn } from "@/utils";
import ThemeToggle from "./ThemeToggle";

function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mx-auto mt-20 w-full max-w-[812px] px-4 py-7 sm:px-0",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 text-xs text-secondary">
        <Link href="/" className="transition-colors hover:text-accent">
          © 2026 Daniel Fadamitan
        </Link>
        <ThemeToggle />
      </div>
    </footer>
  );
}

export default SiteFooter;
