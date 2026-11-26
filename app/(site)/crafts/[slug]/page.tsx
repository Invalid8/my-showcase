import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DesertBand } from "@/components/ascii/DesertBand";
import { MottoDemo } from "@/components/ascii/MottoDemo";
import { RopeDemo } from "@/components/ascii/RopeDemo";
import { SpinningTurntable } from "@/components/ascii/SpinningTurntable";
import { Blocks } from "@/components/blocks/Blocks";
import { ZoomImage } from "@/components/blocks/ZoomImage";
import MusicPlayer from "@/components/shared/MusicPlayer";
import { getPlaylist } from "@/components/shared/MusicPlayer/playlist";
import { Adjacent } from "@/components/site/Adjacent";
import { HeartBurst } from "@/components/site/HeartBurst";
import { PageHead } from "@/components/site/PageHead";
import { craftNumber, crafts, drawerStates } from "@/content/crafts";
import { mottos } from "@/content/home";
import { createPageMetadata } from "@/lib/seo";
import { PLAYLIST_ID, playlist } from "@/utils/constants";

export const revalidate = 900;

export function generateStaticParams() {
  return crafts.map((craft) => ({ slug: craft.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/crafts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const craft = crafts.find((entry) => entry.slug === slug);
  if (!craft) return {};
  return createPageMetadata({
    title: craft.title,
    description: craft.blurb,
    path: `/crafts/${slug}`,
    image: null,
  });
}

export default async function CraftPage({
  params,
}: PageProps<"/crafts/[slug]">) {
  const { slug } = await params;
  const index = crafts.findIndex((craft) => craft.slug === slug);
  const craft = crafts[index];
  if (!craft) notFound();
  const previous = crafts[index - 1];
  const next = crafts[index + 1];
  const demos: Record<string, ReactNode> = {
    "record-player": slug === "record-player" && (
      <MusicPlayer
        source={await getPlaylist(PLAYLIST_ID, playlist)}
        showIntro={false}
      />
    ),
    desert: <DesertBand />,
    rope: <RopeDemo />,
    turntable: <SpinningTurntable />,
    motto: <MottoDemo lines={mottos} />,
    drawer: (
      <div className="states">
        {drawerStates.map((state) => (
          <figure key={state.src}>
            <ZoomImage
              src={state.src}
              alt={`Baseband address drawer: ${state.caption.slice(3)}`}
              width={540}
              height={1170}
            />
            <figcaption>{state.caption}</figcaption>
          </figure>
        ))}
      </div>
    ),
    heart: (
      <div className="heart-demo">
        <span>
          Built with <HeartBurst />
        </span>
      </div>
    ),
  };

  return (
    <article>
      <PageHead
        back={{ href: "/crafts", label: "Crafts" }}
        title={craft.title}
        subtitle={`Craft ${craftNumber(slug)} · ${[craft.tags[0], ...craft.tags.slice(1).map((tag) => tag.toLowerCase())].join(", ")}`}
        line={craft.line}
      >
        <p className="lede">{craft.intro}</p>
      </PageHead>
      <Blocks blocks={craft.blocks} demos={demos} />
      <Adjacent
        label="More crafts"
        previous={
          previous && {
            href: `/crafts/${previous.slug}`,
            title: previous.title,
          }
        }
        next={next && { href: `/crafts/${next.slug}`, title: next.title }}
      />
    </article>
  );
}
