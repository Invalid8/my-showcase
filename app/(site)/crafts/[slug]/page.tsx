import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesertBand } from "@/components/ascii/DesertBand";
import { MottoDemo } from "@/components/ascii/MottoDemo";
import { RopeDemo } from "@/components/ascii/RopeDemo";
import { SpinningTurntable } from "@/components/ascii/SpinningTurntable";
import MusicPlayer from "@/components/shared/MusicPlayer";
import { getPlaylist } from "@/components/shared/MusicPlayer/playlist";
import { Adjacent } from "@/components/site/Adjacent";
import { NumberedList } from "@/components/site/NumberedList";
import { PageHead } from "@/components/site/PageHead";
import { Section } from "@/components/site/Section";
import { craftNumber, crafts } from "@/content/crafts";
import { mottos } from "@/content/home";
import { ART } from "@/lib/ascii/art";
import { TURNTABLE_FRAMES } from "@/lib/ascii/turntable";
import { waveform } from "@/lib/ascii/waveform";
import { createPageMetadata } from "@/lib/seo";
import { PLAYLIST_ID, playlist } from "@/utils/constants";

export const revalidate = 900;

const local = crafts.filter((craft) => craft.href.startsWith("/"));

export function generateStaticParams() {
  return local.map((craft) => ({ slug: craft.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/crafts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const craft = local.find((entry) => entry.slug === slug);
  if (!craft) return {};
  return createPageMetadata({
    title: craft.title,
    description: craft.blurb,
    path: craft.href,
  });
}

const SPECIMENS = [
  { name: "Turntable", lines: TURNTABLE_FRAMES[0], size: "text-[6px]" },
  { name: "Fillyr page and pen", lines: ART.fillyr, size: "text-[10px]" },
  { name: "VScrybe waveform", lines: waveform(1200, 0.6), size: "text-[12px]" },
];

function Specimens() {
  return (
    <div className="demo-stage grid gap-8 p-6 sm:grid-cols-[auto_auto] sm:justify-around">
      {SPECIMENS.map(({ name, lines, size }) => (
        <pre
          key={name}
          className={`ascii static ${size}`}
          role="img"
          aria-label={name}
        >
          {lines.join("\n")}
        </pre>
      ))}
    </div>
  );
}

async function Demo({ slug }: { slug: string }) {
  switch (slug) {
    case "record-player":
      return (
        <div className="bleed">
          <MusicPlayer
            source={await getPlaylist(PLAYLIST_ID, playlist)}
            showIntro={false}
          />
        </div>
      );
    case "desert":
      return <DesertBand />;
    case "characters-not-pixels":
      return <Specimens />;
    case "rope":
      return <RopeDemo />;
    case "motto":
      return <MottoDemo lines={mottos} />;
    case "ascii-record-player":
      return <SpinningTurntable />;
    default:
      return null;
  }
}

export default async function CraftPage({
  params,
}: PageProps<"/crafts/[slug]">) {
  const { slug } = await params;
  const index = crafts.findIndex((craft) => craft.slug === slug);
  const craft = crafts[index];
  if (!craft || !craft.href.startsWith("/")) notFound();
  const previous = crafts[index - 1];
  const next = crafts[index + 1];

  return (
    <article>
      <PageHead
        back={{ href: "/crafts", label: "Crafts" }}
        title={craft.title}
        subtitle={`Craft ${craftNumber(slug)} · ${[craft.tags[0], ...craft.tags.slice(1).map((tag) => tag.toLowerCase())].join(", ")}`}
        line={craft.line}
      >
        {craft.intro && <p className="lede">{craft.intro}</p>}
      </PageHead>
      <div className="section">
        <Demo slug={slug} />
      </div>
      {craft.made && (
        <Section id="made" label="How it's made">
          <NumberedList
            items={craft.made.map((item) => ({
              key: item.title,
              title: item.title,
              body: item.body,
            }))}
          />
        </Section>
      )}
      <Adjacent
        label="More crafts"
        previous={previous && { href: previous.href, title: previous.title }}
        next={next && { href: next.href, title: next.title }}
      />
    </article>
  );
}
