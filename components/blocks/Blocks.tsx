import Image from "next/image";
import type { Block } from "@/content/case-studies";
import { NumberedList } from "../site/NumberedList";
import { Section } from "../site/Section";
import { CopyButton } from "./CopyButton";
import { LivePreview } from "./LivePreview";

function Figure({
  n,
  caption,
  wide,
  children,
}: {
  n: number;
  caption: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className={wide ? "figure bleed" : "figure"}>
      {children}
      <figcaption>
        <span className="mono-meta">Fig. {n}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  let fig = 0;
  const lead = blocks.findIndex((block) => block.type === "image");

  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    switch (block.type) {
      case "text":
        return (
          <div key={key} className="section with-note">
            {block.heading && (
              <h2 className="section-label">{block.heading}</h2>
            )}
            <p>{block.body}</p>
            {block.note && (
              <aside className="margin-note">
                <div className="mono-meta">Note</div>
                {block.note}
              </aside>
            )}
          </div>
        );
      case "image":
        fig++;
        return (
          <Figure key={key} n={fig} caption={block.caption} wide={block.wide}>
            <div className="frame">
              <Image
                {...block.image}
                sizes="(max-width: 720px) 100vw, 880px"
                loading={index === lead ? "eager" : "lazy"}
                fetchPriority={index === lead ? "high" : "auto"}
              />
            </div>
          </Figure>
        );
      case "pair":
        fig++;
        return (
          <Figure key={key} n={fig} caption={block.caption} wide>
            <div className="pair">
              {block.images.map((image) => (
                <div key={image.src} className="frame">
                  <Image {...image} sizes="(max-width: 720px) 100vw, 440px" />
                </div>
              ))}
            </div>
          </Figure>
        );
      case "live":
        fig++;
        return (
          <Figure key={key} n={fig} caption={block.caption} wide>
            <LivePreview url={block.url} title={block.caption} />
          </Figure>
        );
      case "code":
        return (
          <figure key={key} className="code-block">
            <header>
              <span>
                {block.file} · {block.lang}
              </span>
              <CopyButton text={block.code} />
            </header>
            <pre>
              <code>{block.code}</code>
            </pre>
            {block.caption && (
              <figcaption className="caption">{block.caption}</figcaption>
            )}
          </figure>
        );
      case "terminal":
        return (
          <pre key={key} className="terminal">
            {block.lines.map((line, i) => (
              <div key={line} className={i === 0 ? "prompt" : undefined}>
                {line}
              </div>
            ))}
          </pre>
        );
      case "list":
        return (
          <Section key={key} id={`list-${index}`} label={block.heading}>
            <NumberedList
              items={block.items.map((item) => ({
                key: item.title,
                title: item.title,
                body: item.body,
              }))}
            />
          </Section>
        );
      case "quote":
        return (
          <figure key={key} className="pull-quote">
            <blockquote>“{block.text}”</blockquote>
            <figcaption className="mono-meta">— {block.source}</figcaption>
          </figure>
        );
      default:
        return null;
    }
  });
}
