import type { Metadata } from "next";

export const siteConfig = {
  name: "Daniel Fadamitan",
  title: "Daniel Fadamitan | Frontend Engineer",
  description:
    "Frontend engineer building thoughtful, accessible interfaces for web and mobile with React, React Native, Next.js and TypeScript.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dalgoridim.com",
  locale: "en_US",
  twitter: "@dalgoridim",
  defaultOgImage: "/opengraph-image",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function summarize(value: string, maxLength = 160) {
  const plain = value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).trimEnd()}…`;
}

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.defaultOgImage,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: PageMetadata): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const socialTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: socialTitle }],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: [siteConfig.url],
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      creator: siteConfig.twitter,
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  };
}
