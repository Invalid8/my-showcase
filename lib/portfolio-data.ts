import "server-only";

import { unstable_cache } from "next/cache";
import { Pool } from "pg";
import { cache } from "react";
import type { Project } from "@/components/shared/Work/types";
import {
  feedItems as fallbackFeedItems,
  projects as fallbackProjects,
} from "@/utils/constants";

type ProjectRow = {
  id: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  link: string | null;
  tags: string[] | null;
  order: number | null;
};

type FeedRow = {
  id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  body: string | null;
  date: string | null;
  tags: string[] | null;
  published: boolean | null;
};

export type PortfolioFeedItem = {
  id: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  body?: string;
};

let pool: Pool | undefined;

function getPool() {
  if (!process.env.DATABASE_URL) return null;

  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 30_000,
    statement_timeout: 20_000,
    keepAlive: true,
  });

  return pool;
}

async function query<T extends object>(text: string, values: unknown[] = []) {
  const database = getPool();
  if (!database) return null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await database.query<T>(text, values);
      return result.rows;
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";

      if (attempt === 2) {
        console.warn(
          `[portfolio-data] database read failed after ${attempt + 1} attempts; using fallback content: ${message}`,
        );
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    }
  }

  return null;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .toUpperCase();
}

function tags(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function mapProject(row: ProjectRow): Project {
  return {
    name: row.title?.trim() || "Untitled project",
    descriptor: tags(row.tags).join(" · "),
    description: row.description?.trim() || "",
    image: row.thumbnail || "/work/fillyr.webp",
    href: row.link || "#",
  };
}

function mapFeedItem(row: FeedRow): PortfolioFeedItem | null {
  const slug = row.slug?.trim();
  if (!slug) return null;

  return {
    id: row.id,
    slug,
    date: formatDate(row.date),
    title: row.title?.trim() || "Untitled feed",
    description: row.excerpt?.trim() || "",
    tags: tags(row.tags),
    href: `/feed/${slug}`,
    body: row.body || undefined,
  };
}

const REVALIDATE = 900;

const loadProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await query<ProjectRow>(`
      SELECT id, title, description, thumbnail, link, tags, "order"
      FROM projects
      ORDER BY "order" ASC NULLS LAST, year DESC NULLS LAST
    `);

    if (!rows?.length) return fallbackProjects;
    return rows.map(mapProject);
  },
  ["portfolio-projects"],
  { revalidate: REVALIDATE, tags: ["portfolio-projects"] },
);

const loadFeedItems = unstable_cache(
  async (): Promise<PortfolioFeedItem[]> => {
    const rows = await query<FeedRow>(`
      SELECT id, title, slug, excerpt, body, date, tags, published
      FROM feeds
      WHERE published IS TRUE
      ORDER BY "order" ASC NULLS LAST, date DESC NULLS LAST
    `);

    if (!rows?.length) {
      return fallbackFeedItems.map((item, index) => ({
        id: String(index),
        ...item,
      }));
    }

    return rows
      .map(mapFeedItem)
      .filter((item): item is PortfolioFeedItem => item !== null);
  },
  ["portfolio-feed"],
  { revalidate: REVALIDATE, tags: ["portfolio-feed"] },
);

export const getPortfolioProjects = cache(loadProjects);

export const getPortfolioFeedItems = cache(loadFeedItems);

export const getPortfolioFeedItem = cache(
  async (slug: string): Promise<PortfolioFeedItem | null> => {
    const items = await getPortfolioFeedItems();
    return items.find((item) => item.slug === slug) ?? null;
  },
);
