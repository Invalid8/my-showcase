import Link from "next/link";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link href={href} className="back-link">
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}
