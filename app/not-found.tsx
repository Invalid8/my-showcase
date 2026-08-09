import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import MusicPlayer from "@/components/shared/MusicPlayer";
import { getPlaylist } from "@/components/shared/MusicPlayer/playlist";
import SiteFooter from "@/components/shared/SiteFooter";
import { PLAYLIST_ID, playlist } from "@/utils/constants";

export const metadata: Metadata = {
  title: "404, Not Found",
  description: "This page does not exist.",
  robots: { index: false, follow: true },
};

async function NotFound() {
  const source = await getPlaylist(PLAYLIST_ID, playlist);

  return (
    <div className="deck-page">
      <main className="container-box min-h-[80svh] pt-20">
        <div className="space-y-8">
          <div className="content-box space-y-5">
            <p className="font-display text-[clamp(4.5rem,16vw,150px)] font-extrabold leading-[0.82] tracking-[-0.05em] text-accent">
              404
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Not found
            </h1>
            <p className="text-[15.5px]/[25px] text-secondary">
              Whatever you were after has moved, or never existed. While
              you&rsquo;re here, want to listen to what I listen to?
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-foreground underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
            >
              Back to the work
              <ArrowUpRight />
            </Link>
          </div>

          <MusicPlayer source={source} variant="side" showIntro={false} />
        </div>
      </main>
      <SiteFooter className="max-w-[770px]" />
    </div>
  );
}

export default NotFound;
