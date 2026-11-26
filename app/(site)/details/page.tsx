import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { HeartBurst } from "@/components/site/HeartBurst";
import { KindFilter } from "@/components/site/KindFilter";
import { MonoMeta } from "@/components/site/MonoMeta";
import { PageHead } from "@/components/site/PageHead";
import {
  type DetailKind,
  detailKinds,
  marks,
  sheetStates,
} from "@/content/details";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Details",
  description: "Interaction, UI and brand decisions from things I've shipped.",
  path: "/details",
});

function Entry({
  kind,
  meta,
  title,
  media,
  wide,
  children,
}: {
  kind: DetailKind;
  meta: ReactNode;
  title: ReactNode;
  media: ReactNode;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <article className="entry" data-kind={kind}>
      <MonoMeta>{meta}</MonoMeta>
      <h2>{title}</h2>
      <div className={wide ? "media bleed" : "media"}>{media}</div>
      {children}
    </article>
  );
}

function ProjectMeta({
  kind,
  icon,
  project,
  date,
}: {
  kind: string;
  icon?: string;
  project: string;
  date: string;
}) {
  return (
    <>
      {kind} ·{" "}
      {icon && (
        <Image
          className="item-icon !mr-1.5 !size-3.5"
          src={icon}
          alt=""
          width={14}
          height={14}
        />
      )}
      {project} · {date}
    </>
  );
}

export default function DetailsPage() {
  return (
    <>
      <PageHead
        back={{ href: "/", label: "Daniel Fadamitan" }}
        title="Details"
        subtitle="Interaction, UI and brand decisions from things I've shipped"
        line="The small stuff is the stuff."
      />
      <KindFilter kinds={detailKinds}>
        <div className="mt-16">
          <Entry
            kind="interaction"
            wide
            meta={
              <ProjectMeta
                kind="Interaction"
                icon="/icons/baseband.png"
                project="Baseband"
                date="Sep 2026"
              />
            }
            title="One sheet, four states"
            media={
              <div className="states">
                {sheetStates.map((state) => (
                  <figure key={state.src}>
                    <Image
                      src={state.src}
                      alt={`Baseband address sheet: ${state.caption.slice(3)}`}
                      width={540}
                      height={1170}
                    />
                    <figcaption>{state.caption}</figcaption>
                  </figure>
                ))}
              </div>
            }
          >
            <p>
              The button never swaps for another. It stays grey until there is
              an address, holds a spinner while it checks, then becomes Try
              again. The error sits right under the field, in plain words, and
              the sheet rides up with the keyboard instead of hiding behind it.
            </p>
          </Entry>

          <Entry
            kind="interaction"
            meta={
              <ProjectMeta
                kind="Interaction"
                icon="/icons/vscrybe.png"
                project="VScrybe"
                date="Nov 2026"
              />
            }
            title="Built with ♥, and it means it"
            media={
              <div className="heart-demo">
                <span>
                  Built with <HeartBurst />
                </span>
              </div>
            }
          >
            <p>
              Click the heart in the footer and nine small hearts float up and
              fade. Each drifts its own way and rises its own height, so it
              never looks canned, and it simply doesn't run for anyone who
              prefers reduced motion.
            </p>
            <p className="specs">
              9 hearts · drift ±45px · rise 70–140px · 900–1400ms · 35ms stagger
              · cubic-bezier(0.2, 0.8, 0.3, 1)
            </p>
          </Entry>

          <Entry
            kind="brand"
            wide
            meta="Brand · three marks"
            title="Marks that say what the product does"
            media={
              <div className="marks">
                {marks.map((mark) => (
                  <div key={mark.name} className="mark-card">
                    <div className="flex items-end gap-2">
                      {[56, 28, 16].map((size) => (
                        <Image
                          key={size}
                          src={mark.icon}
                          alt={size === 56 ? `${mark.name} mark` : ""}
                          width={size}
                          height={size}
                          style={{ borderRadius: size / 4.5 }}
                        />
                      ))}
                    </div>
                    <h3>{mark.name}</h3>
                    <div className="swatches">
                      {mark.palette.map((color) => (
                        <span
                          key={color}
                          style={{ "--swatch": color } as CSSProperties}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                    <p>{mark.note}</p>
                  </div>
                ))}
              </div>
            }
          />

          <Entry
            kind="ui"
            wide
            meta={
              <ProjectMeta
                kind="UI"
                icon="/icons/vscrybe.png"
                project="VScrybe"
                date="Oct 2026"
              />
            }
            title="Click a line, hear that moment"
            media={
              <div className="frame">
                <Image
                  src="/details/vs-listen-dark.webp"
                  alt="A VScrybe session with timestamp pills beside each transcript line"
                  width={1560}
                  height={1072}
                />
              </div>
            }
          >
            <p>
              Every transcript line keeps its timestamp as a small pill. Click
              it and the player jumps to that exact moment, so checking a word
              against the voice takes one tap.
            </p>
          </Entry>

          <Entry
            kind="ui"
            meta="UI · this site · Nov 2026"
            title="A motto that decodes"
            media={
              <div className="decode-demo" aria-hidden="true">
                <p>Mxqtpj ezvhe I wkvhgd ql eyfsa.</p>
                <p>Mostly toezs I wanted to euist.</p>
                <p>Mostly tools I wanted to exist.</p>
              </div>
            }
          >
            <p>
              Every visit picks a different line I'd actually say, never the
              same twice in a row, and resolves it letter by letter from
              scrambled ones, left to right, with a little randomness so it
              feels typed, not printed.
            </p>
          </Entry>
        </div>
      </KindFilter>
    </>
  );
}
