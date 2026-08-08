import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import MusicPlayer from "@/components/shared/MusicPlayer";
import { getPlaylist } from "@/components/shared/MusicPlayer/playlist";
import SiteFooter from "@/components/shared/SiteFooter";
import { createPageMetadata } from "@/lib/seo";
import { PLAYLIST_ID, playlist } from "@/utils/constants";

export const revalidate = 900;

export const metadata: Metadata = createPageMetadata({
  title: "Record Player",
  description:
    "The playlist that is usually running while I work, on a turntable built in CSS.",
  path: "/music",
});

async function page() {
  const source = await getPlaylist(PLAYLIST_ID, playlist);

  return (
    <div>
      <main className="container-box min-h-[80svh] pt-20">
        <div className="content-box space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[1.4px] text-label">
            Daniel Fadamitan
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em]">
            Record player
          </h1>
          <p className="max-w-176.5 text-[15.5px]/[25px] text-secondary">
            A turntable built out of gradients and transforms, wired to a real
            YouTube playlist. Pick a record below and drop the needle. Nothing
            here is a real product requirement, which is exactly the point.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-secondary transition-colors duration-200 hover:text-accent"
          >
            Back to the work
            <ArrowUpRight />
          </Link>
        </div>

        <div className="pt-14">
          <MusicPlayer source={source} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default page;
