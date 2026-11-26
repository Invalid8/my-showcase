import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks/Blocks";
import { BackLink } from "@/components/site/BackLink";
import { TextLink } from "@/components/site/TextLink";
import { caseStudies } from "@/content/case-studies";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((entry) => entry.slug === slug);
  if (!study) return {};
  return createPageMetadata({
    title: study.name,
    description: study.line,
    path: `/work/${study.slug}`,
    type: "article",
    image: null,
  });
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = caseStudies.findIndex((entry) => entry.slug === slug);
  const study = caseStudies[index];
  if (!study) notFound();
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article>
      <header className="page-head">
        <BackLink href="/#work">Work</BackLink>
        <h1 className="page-title">
          <Image
            className="item-icon"
            src={study.icon}
            alt=""
            width={18}
            height={18}
          />
          {study.name}
        </h1>
        <p className="motto">{study.line}</p>
        <dl className="facts">
          {study.facts.map((fact) => (
            <div key={fact.label} className="contents">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          <dt>Links</dt>
          <dd className="flex flex-wrap gap-x-4">
            {study.links.map((link) => (
              <TextLink
                key={link.href}
                href={link.href}
                arrow={link.href.startsWith("/") ? "forward" : "external"}
              >
                {link.label}
              </TextLink>
            ))}
          </dd>
        </dl>
      </header>
      <Blocks blocks={study.blocks} />
      <nav aria-label="Next project" className="adjacent">
        <span className="faint">Next</span>
        <span>
          <Image
            className="item-icon"
            src={next.icon}
            alt=""
            width={18}
            height={18}
          />
          <TextLink href={`/work/${next.slug}`} arrow="forward">
            {next.name}
          </TextLink>
        </span>
      </nav>
    </article>
  );
}
