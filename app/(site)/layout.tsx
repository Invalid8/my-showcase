import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <main id="content" className="page column">
        {children}
      </main>
      <Footer />
    </div>
  );
}
