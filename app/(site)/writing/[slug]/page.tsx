import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Adjacent } from "@/components/site/Adjacent";
import { PageHead } from "@/components/site/PageHead";
import { longDate, readingMinutes } from "@/lib/dates";
import { renderMarkdown } from "@/lib/markdown";
import {
  getPortfolioFeedItem,
  getPortfolioFeedItems,
} from "@/lib/portfolio-data";
import {
  absoluteUrl,
  createPageMetadata,
  siteConfig,
  summarize,
} from "@/lib/seo";

export const revalidate = 900;

export async function generateStaticParams() {
  const items = await getPortfolioFeedItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioFeedItem(slug);
  if (!item) return {};

  return createPageMetadata({
    title: item.title,
    description: summarize(item.description || item.body || item.title),
    path: item.href,
    type: "article",
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
    tags: item.tags,
  });
}

export default async function ArticlePage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const [item, items] = await Promise.all([
    getPortfolioFeedItem(slug),
    getPortfolioFeedItems(),
  ]);
  if (!item) notFound();

  const body = item.body?.replace(/^\s*#\s+(.+)\n/, (heading, text: string) =>
    text.trim() === item.title ? "" : heading,
  );
  const index = items.findIndex((entry) => entry.slug === slug);
  const previous = items[index + 1];
  const next = items[index - 1];
  const author = {
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
  };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: item.title,
        description: summarize(item.description || item.title),
        url: absoluteUrl(item.href),
        mainEntityOfPage: absoluteUrl(item.href),
        datePublished: item.publishedAt,
        dateModified: item.updatedAt ?? item.publishedAt,
        keywords: item.tags.join(", "),
        image: absoluteUrl(siteConfig.defaultOgImage),
        author,
        publisher: author,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Writing",
            item: absoluteUrl("/writing"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: item.title,
            item: absoluteUrl(item.href),
          },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json">
        {JSON.stringify(schema).replace(/</g, "\\u003c")}
      </script>
      <PageHead
        back={{ href: "/writing", label: "Writing" }}
        title={item.title}
        subtitle={
          <>
            {item.publishedAt && (
              <time dateTime={item.publishedAt}>
                {longDate(item.publishedAt)}
              </time>
            )}
            {item.publishedAt && " · "}
            {readingMinutes(body)} min read
          </>
        }
        line={item.description}
      />
      {body && <div className="prose-feed">{await renderMarkdown(body)}</div>}
      <Adjacent
        label="More writing"
        previous={previous && { href: previous.href, title: previous.title }}
        next={next && { href: next.href, title: next.title }}
      />
    </article>
  );
}
