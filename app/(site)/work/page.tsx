import type { Metadata } from "next";
import Image from "next/image";
import { PageHead } from "@/components/site/PageHead";
import { TextLink } from "@/components/site/TextLink";
import { work } from "@/content/home";
import type { WorkEntry } from "@/content/types";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Work",
  description:
    "Products I started and built end to end, and client work: what each one is, why it exists and what I did.",
  path: "/work",
  image: null,
});

const groups: { origin: WorkEntry["origin"]; label: string }[] = [
  { origin: "mine", label: "Started by me" },
  { origin: "client", label: "For clients" },
];

export default function WorkPage() {
  return (
    <>
      <PageHead
        back={{ href: "/", label: "Daniel Fadamitan" }}
        title="Work"
        subtitle="Products I started and saw through, and the web side of a delivery platform"
      />

      {groups.map((group) => (
        <section
          key={group.origin}
          className="section"
          aria-label={group.label}
        >
          <h2 className="mono-meta year-label">{group.label}</h2>
          <div className="stack work-list">
            {work
              .filter((entry) => entry.origin === group.origin)
              .map((entry) => (
                <article key={entry.slug}>
                  <Image
                    className="item-icon"
                    src={entry.icon}
                    alt=""
                    width={18}
                    height={18}
                  />
                  <TextLink href={`/work/${entry.slug}`} arrow="forward">
                    {entry.name}
                  </TextLink>
                  <p>{entry.story}</p>
                  <div className="mono-meta">{entry.meta}</div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
