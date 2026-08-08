import type { MetadataRoute } from "next";
import { getPortfolioFeedItems } from "@/lib/portfolio-data";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const feedItems = await getPortfolioFeedItems();

  const latest = feedItems
    .map((item) => item.updatedAt)
    .filter((value): value is string => !!value)
    .sort()
    .at(-1);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/feed"),
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/music"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...feedItems.map((item) => ({
      url: absoluteUrl(item.href),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
