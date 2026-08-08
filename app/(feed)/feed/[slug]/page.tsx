import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProximitySidebar from "@/components/shared/ProximitySidebar";
import SiteFooter from "@/components/shared/SiteFooter";
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
import { cn } from "@/utils";
import ArticleBody from "./_components/ArticleBody";

type FeedArticleProps = {
  params: Promise<{ slug: string }>;
};

function FeedNavigation({
  activeSlug,
  items,
}: {
  activeSlug: string;
  items: Awaited<ReturnType<typeof getPortfolioFeedItems>>;
}) {
  return (
    <nav aria-label="Feed articles" className="space-y-4">
      {items.map((feed) => (
        <Link
          key={feed.slug}
          href={feed.href}
          className={cn(
            "block text-sm leading-5 transition-colors hover:text-accent",
            feed.slug === activeSlug ? "text-accent" : "text-secondary",
          )}
        >
          {feed.title}
        </Link>
      ))}
    </nav>
  );
}

export const revalidate = 900;

export async function generateStaticParams() {
  const items = await getPortfolioFeedItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: FeedArticleProps): Promise<Metadata> {
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

async function page({ params }: FeedArticleProps) {
  const { slug } = await params;
  const [item, feedItems] = await Promise.all([
    getPortfolioFeedItem(slug),
    getPortfolioFeedItems(),
  ]);
  if (!item) notFound();

  const index = feedItems.findIndex((feed) => feed.slug === slug);
  const previous = feedItems[index - 1];
  const next = feedItems[index + 1];

  const author = {
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
  };

  const articleSchema = {
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
            name: "Feeds",
            item: absoluteUrl("/feed"),
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
    <main className="min-h-screen px-6 pt-20">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data must be inlined as JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ProximitySidebar
        side="right"
        container="article"
        headings="h1, h2, h3"
      />
      <div className="mb-10 2xl:hidden max-w-[812px] mx-auto">
        <details className="group border-y border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-mono text-[10px] uppercase tracking-[1.4px] text-label [&::-webkit-details-marker]:hidden">
            <span>Feeds</span>
            <span className="flex items-center gap-3">
              <span className="text-muted">
                {String(feedItems.length).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className="text-base leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <div className="pb-5">
            <FeedNavigation activeSlug={item.slug} items={feedItems} />
          </div>
        </details>
      </div>

      <aside className="fixed left-12 top-20 z-10 hidden w-[180px] 2xl:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-mono text-[10px] uppercase tracking-[1.4px] text-label">
            Feeds
          </h2>
          <span className="font-mono text-[10px] text-muted">
            {String(feedItems.length).padStart(2, "0")}
          </span>
        </div>
        <FeedNavigation activeSlug={item.slug} items={feedItems} />
      </aside>

      <article className="container-box w-full min-w-0 text-[16px] leading-8 text-secondary">
        <div className="content-box">
          <ArticleBody
            title={item.title}
            description={item.description}
            date={item.date}
            tags={item.tags}
            body={item.body}
          />
          <nav
            aria-label="Adjacent feeds"
            className="mt-10 grid gap-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link href={previous.href} className="group">
                <span className="block font-mono text-[10px] uppercase tracking-[1.2px] text-label">
                  Previous feed
                </span>
                <span className="mt-2 block text-sm text-secondary transition-colors group-hover:text-accent">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={next.href} className="group text-left sm:text-right">
                <span className="block font-mono text-[10px] uppercase tracking-[1.2px] text-label">
                  Next feed
                </span>
                <span className="mt-2 block text-sm text-secondary transition-colors group-hover:text-accent">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>

          <SiteFooter />
        </div>
      </article>
    </main>
  );
}

export default page;
