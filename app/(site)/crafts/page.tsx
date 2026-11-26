import type { Metadata } from "next";
import { NumberedList } from "@/components/site/NumberedList";
import { PageHead } from "@/components/site/PageHead";
import { Section } from "@/components/site/Section";
import { TextLink } from "@/components/site/TextLink";
import { crafts } from "@/content/crafts";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Crafts",
  description:
    "Things I built because I wanted to see them move, one page each.",
  path: "/crafts",
});

export default function CraftsPage() {
  return (
    <>
      <PageHead
        back={{ href: "/", label: "Daniel Fadamitan" }}
        title="Crafts"
        subtitle="Built for the fun of it, one page each"
        line="Things I made because I wanted to see them move."
      />
      <Section id="studies" label="Studies">
        <NumberedList
          items={crafts.map((craft) => ({
            key: craft.slug,
            title: (
              <TextLink href={`/crafts/${craft.slug}`} arrow="forward">
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
