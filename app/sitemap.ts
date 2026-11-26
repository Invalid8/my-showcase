import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { crafts } from "@/content/crafts";
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
  const lastModified = latest ? new Date(latest) : undefined;

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/work"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...caseStudies.map((study) => ({
      url: absoluteUrl(`/work/${study.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: absoluteUrl("/writing"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...feedItems.map((item) => ({
      url: absoluteUrl(item.href),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: absoluteUrl("/resume"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/crafts"), changeFrequency: "monthly", priority: 0.6 },
    ...crafts.map((craft) => ({
      url: absoluteUrl(`/crafts/${craft.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
