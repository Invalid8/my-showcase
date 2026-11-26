import type { Metadata } from "next";
import Link from "next/link";
import Turnable from "@/components/shared/MusicPlayer/Turnable";
import { NumberedList } from "@/components/site/NumberedList";
import { PageHead } from "@/components/site/PageHead";
import { Section } from "@/components/site/Section";
import { TextLink } from "@/components/site/TextLink";
import { crafts } from "@/content/crafts";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Crafts",
  description: "Interface and interaction studies, one page each.",
  path: "/crafts",
});

export default function CraftsPage() {
  return (
    <>
      <PageHead
        back={{ href: "/", label: "Daniel Fadamitan" }}
        title="Crafts"
        subtitle="Interface and interaction studies, one page each"
        line="Things I made because I wanted to see them move."
      />
      <Section id="deck" label="On the deck">
        <Link
          href="/crafts/record-player"
          className="block"
          aria-label="Open the record player"
        >
          <Turnable disabled />
        </Link>
        <p className="mt-6">
          <TextLink href="/crafts/record-player" arrow="forward">
            Drop the needle
          </TextLink>{" "}
          <span className="faint">on what I actually have on repeat</span>
        </p>
      </Section>
      <Section id="studies" label="Studies">
        <NumberedList
          items={crafts.map((craft) => ({
            key: craft.slug,
            title: (
              <TextLink
                href={craft.href}
                arrow={craft.href.startsWith("/") ? "forward" : "external"}
              >
                {craft.title}
              </TextLink>
            ),
            body: craft.blurb,
            meta: craft.tags.join(" · "),
          }))}
        />
      </Section>
    </>
  );
}
