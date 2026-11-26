import type { Metadata } from "next";
import { DesertBand } from "@/components/ascii/DesertBand";
import { MonoMeta } from "@/components/site/MonoMeta";
import { TextLink } from "@/components/site/TextLink";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="site">
      <main id="content" className="column not-found">
        <DesertBand />
        <MonoMeta className="mt-8">404</MonoMeta>
        <h1 className="motto">You wandered into the desert.</h1>
        <p>
          This page doesn't exist, or it moved. The lizard hasn't seen it
          either.
        </p>
        <div className="links">
          <TextLink href="/" arrow="forward">
            Back home
          </TextLink>
          <TextLink href="/crafts" arrow="forward">
            Crafts
          </TextLink>
          <TextLink href="/writing" arrow="forward">
            Writing
          </TextLink>
        </div>
      </main>
    </div>
  );
}
