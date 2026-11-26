import type { Block } from "@/content/case-studies";
import { NumberedList } from "../site/NumberedList";
import { Section } from "../site/Section";
import { isExternal, TextLink } from "../site/TextLink";
import { CopyButton } from "./CopyButton";
import { Loop } from "./Loop";
import { Switcher } from "./Switcher";
import { ZoomImage } from "./ZoomImage";

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
          <div
            key={key}
            className={
              block.heading ? "section with-note" : "section with-note follow"
            }
          >
            {block.heading && (
              <h2 className="section-label">{block.heading}</h2>
            )}
            <p>
              {block.body}
              {block.link && (
                <>
                  {" "}
                  <TextLink
                    href={block.link.href}
                    arrow={isExternal(block.link.href) ? "external" : "forward"}
                    dashed
                  >
                    {block.link.label}
                  </TextLink>
                </>
              )}
            </p>
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
              <ZoomImage
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
                  <ZoomImage
                    {...image}
                    sizes="(max-width: 720px) 100vw, 440px"
                  />
                </div>
              ))}
            </div>
          </Figure>
        );
      case "states":
        return (
          <figure
            key={key}
            className="figure bleed states"
            style={
              {
                "--columns": block.columns,
                "--narrow-columns": Math.ceil(block.columns / 2),
              } as React.CSSProperties
            }
          >
            {block.items.map((item) => (
              <figure key={item.image.src}>
                <ZoomImage
                  {...item.image}
                  sizes={`(max-width: 720px) 100vw, ${Math.round(880 / block.columns)}px`}
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
            {block.caption && (
              <figcaption className="states-caption">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      case "loop":
        fig++;
        return (
          <Figure key={key} n={fig} caption={block.caption}>
            <Loop
              src={block.src}
              poster={block.poster}
              label={block.label}
              phone={block.phone}
            />
          </Figure>
        );
      case "switch":
        fig++;
        return (
          <Figure key={key} n={fig} caption={block.caption}>
            <Switcher items={block.items} />
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
              <div
                key={`${i}-${line}`}
                className={i === 0 ? "prompt" : undefined}
              >
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
