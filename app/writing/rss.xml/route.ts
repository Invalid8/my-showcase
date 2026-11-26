import { getPortfolioFeedItems } from "@/lib/portfolio-data";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const revalidate = 900;

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const items = await getPortfolioFeedItems();
  const entries = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${absoluteUrl(item.href)}</link>
      <guid>${absoluteUrl(item.href)}</guid>
      <description>${escapeXml(item.description)}</description>${
        item.publishedAt
          ? `\n      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>`
          : ""
      }
    </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} · Writing</title>
    <link>${absoluteUrl("/writing")}</link>
    <description>Notes on interface engineering, CSS, motion and the details behind the work.</description>
    <language>en</language>
${entries}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
