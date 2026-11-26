import type { Metadata } from "next";
import { PageHead } from "@/components/site/PageHead";
import { TextLink } from "@/components/site/TextLink";
import { dayMonth, year } from "@/lib/dates";
import {
  getPortfolioFeedItems,
  type PortfolioFeedItem,
} from "@/lib/portfolio-data";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 900;

export const metadata: Metadata = createPageMetadata({
  title: "Writing",
  description:
    "Notes on interface engineering, CSS, motion and the details behind the work.",
  path: "/writing",
});

function byYear(items: PortfolioFeedItem[]) {
  const groups = new Map<number | "Undated", PortfolioFeedItem[]>();
  for (const item of items) {
    const key = item.publishedAt ? year(item.publishedAt) : "Undated";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups];
}

export default async function WritingPage() {
  const items = await getPortfolioFeedItems();

  return (
    <>
      <PageHead
        back={{ href: "/", label: "Daniel Fadamitan" }}
        title="Writing"
        subtitle="Notes on interface engineering, CSS, motion and the details behind the work"
        line="Written down before my brain tidies it up."
      >
        <div className="mono-row">
          <a className="mono-link" href="/writing/rss.xml">
            rss ↗
          </a>
        </div>
      </PageHead>

      {byYear(items).map(([group, entries]) => (
        <section key={group} className="section" aria-label={String(group)}>
          <h2 className="mono-meta year-label">{group}</h2>
          <ol className="numbered">
            {entries.map((item) => (
              <li key={item.slug}>
                {item.publishedAt && (
                  <time className="num" dateTime={item.publishedAt}>
                    {dayMonth(item.publishedAt).toUpperCase()}
                  </time>
                )}
                <h3>
                  <TextLink href={item.href} arrow="forward">
                    {item.title}
                  </TextLink>
                </h3>
                <p>{item.description}</p>
                {item.tags.length > 0 && (
                  <div className="mono-meta">{item.tags.join(" · ")}</div>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
