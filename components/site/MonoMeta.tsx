import type { ReactNode } from "react";
import { cn } from "@/utils";

export function MonoMeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mono-meta", className)}>{children}</div>;
}
