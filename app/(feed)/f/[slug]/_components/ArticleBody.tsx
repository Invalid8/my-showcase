import { renderMarkdown } from "@/lib/markdown";

async function FeedArticleBody({
  title,
  description,
  date,
  tags,
  body,
}: {
  title: string;
  description: string;
  date: string;
  tags: string[];
  body?: string;
}) {
  return (
    <>
      <section id="article-start" className="scroll-mt-10">
        <div className="mb-6 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[1.2px] text-label">
          <span>{date}</span>
          <span>{tags.join(" · ")}</span>
        </div>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-primary sm:text-6xl">
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-secondary">
          {description}
        </p>
      </section>

      {body ? (
        <section id="article-content" className="prose-feed scroll-mt-10 mt-10">
          {await renderMarkdown(body)}
        </section>
      ) : (
        <FallbackArticle />
      )}
    </>
  );
}

function FallbackArticle() {
  return (
    <>
      <section id="the-model" className="scroll-mt-10 mt-10">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[1.4px] text-accent">
          01 / The model
        </p>
        <h2 className="font-display text-2xl font-medium text-primary sm:text-3xl">
          Let the document be the timeline.
        </h2>
        <p className="mt-5">
          A scroll-driven interaction ties progress to the content instead of an
          arbitrary duration. Scroll back and it rewinds, pause and it holds.
        </p>
      </section>

      <section id="scroll-timelines" className="scroll-mt-10 mt-10">
        <h2 className="font-display text-2xl font-medium text-primary sm:text-3xl">
          Scroll timelines
        </h2>
        <p className="mt-5">
          Use a scroll timeline when animation should respond to the scroll
          container itself. It works well for progress indicators, reading
          states, sticky headers, and small transitions that reveal structure as
          someone moves through a page.
        </p>
        <pre className="mt-7 overflow-x-auto rounded border border-line bg-surface p-5 font-mono text-xs leading-6 text-secondary">
          <code>{`@keyframes reveal {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.story { animation: reveal linear both; animation-timeline: scroll(); }`}</code>
        </pre>
      </section>

      <section id="view-timelines" className="scroll-mt-10 mt-10">
        <h2 className="font-display text-2xl font-medium text-primary sm:text-3xl">
          View timelines
        </h2>
        <p className="mt-5">
          A view timeline is better when the element itself is the subject.
          Cards can enter as they cross the viewport, figures can settle into
          place, and a sequence can stay readable without a large JavaScript
          observer managing every threshold.
        </p>
      </section>

      <section
        id="practical-notes"
        className="scroll-mt-10 mt-10 border-t border-line pt-8"
      >
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[1.4px] text-accent">
          02 / Practical notes
        </p>
        <ul className="space-y-3">
          <li className="border-b border-line pb-3">
            Keep motion secondary to hierarchy.
          </li>
          <li className="border-b border-line pb-3">
            Test the resting state before tuning the animation.
          </li>
          <li>Respect reduced-motion preferences from the beginning.</li>
        </ul>
      </section>
    </>
  );
}

export default FeedArticleBody;
