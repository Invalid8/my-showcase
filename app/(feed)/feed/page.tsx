import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/shared/SiteFooter";
import { getPortfolioFeedItems } from "@/lib/portfolio-data";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Feeds — Daniel Fadamitan",
  description:
    "Notes on interface engineering, CSS, motion, and the details behind the work.",
};

async function page() {
  const feedItems = await getPortfolioFeedItems();

  return (
    <div>
      <main className="container-box min-h-[80svh]">
        <div className="px-6 pt-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[1.4px] text-label">
              <span>
                <Link href={"/"} className="hover:text-accent">
                  Home
                </Link>
              </span>{" "}
              - Daniel Fadamitan
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.05em]">
              Feeds
            </h1>
          </div>

          <div className="mt-5 divide-y divide-line">
            {feedItems.map((item, index) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group grid gap-5 py-7 sm:grid-cols-[120px_1fr_auto] sm:gap-8"
              >
                <time className="font-mono text-[10px] uppercase tracking-[1.1px] text-label">
                  {item.date}
                </time>
                <span>
                  <span className="block text-xl font-medium text-primary transition-colors group-hover:text-accent">
                    {item.title}
                  </span>
                  <span className="mt-3 block max-w-xl text-sm leading-6 text-secondary">
                    {item.description}
                  </span>
                  <span className="mt-3 block font-mono text-[10px] uppercase tracking-[1.1px] text-label">
                    {item.tags.join(" · ")}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default page;
