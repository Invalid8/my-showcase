import type { ReactNode } from "react";
import { cn } from "@/utils";

export function Column({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("column", className)}>{children}</div>;
}
