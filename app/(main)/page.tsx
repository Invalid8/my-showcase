import type { Metadata } from "next";
import Image from "next/image";
import { HomeAscii } from "@/components/ascii/HomeAscii";
import { BrandMention } from "@/components/site/BrandMention";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { TextLink } from "@/components/site/TextLink";
import { ToolChip } from "@/components/site/ToolChip";
import { WorkItem } from "@/components/site/WorkItem";
import {
  bookingUrl,
  contacts,
  intro,
  mottos,
  now,
  person,
  toolGroups,
  work,
} from "@/content/home";
import { getPortfolioFeedItems } from "@/lib/portfolio-data";
import { absoluteUrl, createPageMetadata, siteConfig } from "@/lib/seo";

export const revalidate = 900;

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

const personId = absoluteUrl("/#person");

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
      url: siteConfig.url,
      jobTitle: "Frontend Engineer",
      description: siteConfig.description,
      image: absoluteUrl(siteConfig.defaultOgImage),
      sameAs: contacts
        .filter((contact) => contact.href.startsWith("http"))
        .map((contact) => contact.href),
      email: `mailto:${siteConfig.email}`,
    },
  ],
};

export default async function HomePage() {
  const writing = (await getPortfolioFeedItems()).slice(0, 3);

  return (
    <div className="home" data-intro="on">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data must be inlined as JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <noscript>
        <style>
          {
            ".home[data-intro=on] main>section,.home[data-intro=on] .site-footer{opacity:1;transform:none}"
          }
        </style>
      </noscript>
      <HomeAscii mottos={mottos} />
      <main id="content" className="column">
        <Section id="intro">
          <div className="identity">
            <Image
              className="avatar"
              src="/avatar.jpg"
              alt=""
              width={44}
              height={44}
              priority
            />
            <div>
              <h1 className="name">{person.name}</h1>
              <p className="role">{person.role}</p>
            </div>
          </div>
          <p className="motto waiting" data-motto />
          <p>{intro}</p>
          <div className="tools" id="tools">
            {toolGroups.map((group) => (
              <div key={group.label}>
                <span className="tools-label">{group.label}</span>
                <span className="chips">
                  {group.tools.map((tool) => (
                    <ToolChip key={tool.name} tool={tool} />
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p>
            <BrandMention
              name="Neon"
              href="https://neon.com"
              icon="/icons/neon.svg"
            />{" "}
            liked{" "}
            <TextLink href="https://github.com/Invalid8/better-content" dashed>
              better-content
            </TextLink>{" "}
            enough to give it $1,250 in credits, no strings attached. Still my
            favourite review.
          </p>
        </Section>

        <Section id="work" label="Work">
          <div className="stack">
            {work.map((entry) => (
              <WorkItem key={entry.slug} work={entry} />
            ))}
          </div>
        </Section>

        {writing.length > 0 && (
          <Section id="writing" label="Writing">
            <p className="section-intro">
              Technical squabbles and daily stuff, written down before my brain
              tidies it up.
            </p>
            <div className="stack tight">
              {writing.map((item) => (
                <div key={item.slug}>
                  <TextLink href={item.href} arrow="external">
                    {item.title}
                  </TextLink>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            <p className="read-all">
              <TextLink href="/writing" arrow="forward">
                Read all
              </TextLink>
            </p>
          </Section>
        )}

        <Section id="now" label="Now">
          {now.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <TextLink href="/crafts" arrow="forward">
              Crafts
            </TextLink>{" "}
            <span className="faint">
              the record player and other studies, one page each
            </span>
          </p>
        </Section>

        <Section id="connect" label="Connect">
          <p>Oya, say hi.</p>
          <div className="links">
            <TextLink href={`mailto:${person.email}`}>{person.email}</TextLink>
            {contacts.map((contact) => (
              <TextLink
                key={contact.label}
                href={contact.href}
                arrow={contact.href.startsWith("/") ? "forward" : "external"}
              >
                {contact.label}
              </TextLink>
            ))}
          </div>
          <p className="book">
            <TextLink href={bookingUrl} arrow="external">
              Book 30 minutes
            </TextLink>{" "}
            <span className="faint">if talking is easier</span>
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
