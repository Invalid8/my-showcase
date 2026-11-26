import Link from "next/link";
import { HeartBurst } from "./HeartBurst";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/crafts", label: "Crafts" },
  { href: "/details", label: "Details" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Résumé" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <nav aria-label="Site">
        <span>
          Built with <HeartBurst />
        </span>
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="footer-end">
        <span>{new Date().getFullYear()}</span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
