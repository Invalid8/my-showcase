import type { ReactNode } from "react";
import { BackLink } from "./BackLink";

export function PageHead({
  back,
  title,
  subtitle,
  line,
  children,
}: {
  back: { href: string; label: string };
  title: ReactNode;
  subtitle?: ReactNode;
  line?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <BackLink href={back.href}>{back.label}</BackLink>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {line && <p className="motto">{line}</p>}
      {children}
    </header>
  );
}
