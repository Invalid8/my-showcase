import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowUpRight,
  Compass,
  Devices,
  Document,
  Gauge,
  GitHub,
  Layers,
  LinkedIn,
  Plug,
  Sparkles,
  X,
} from "@/components/Icons";
import IconPop, { type PopIcon } from "@/components/shared/IconPop";
import MusicPlayer from "@/components/shared/MusicPlayer";
import { getPlaylist } from "@/components/shared/MusicPlayer/playlist";
import Work from "@/components/shared/Work";
import {
  getPortfolioFeedItems,
  getPortfolioProjects,
} from "@/lib/portfolio-data";
import { absoluteUrl, createPageMetadata, siteConfig } from "@/lib/seo";
import {
  CAL_LINK,
  capabilities,
  PLAYLIST_ID,
  playlist,
  socials,
} from "@/utils/constants";

export const revalidate = 900;

const socialIcons = {
  github: GitHub,
  x: X,
  linkedin: LinkedIn,
  resume: Document,
} as const;

function SocialLink({ name }: { name: (typeof socials)[number]["name"] }) {
  const social = socials.find((item) => item.name === name);
  if (!social) return null;

  const Icon = socialIcons[social.icon];

  return (
    <IconPop
      href={social.href}
      icons={[
        {
          key: social.icon,
          icon: <Icon className="size-5.5" />,
          label: social.name,
          background: social.brand.background,
          foreground: social.brand.foreground,
        },
      ]}
    >
      {social.name}
    </IconPop>
  );
}

function Fan({
  icons,
  children,
}: {
  icons: PopIcon[];
  children: React.ReactNode;
}) {
  return (
    <IconPop
      icons={icons}
      className="cursor-default rounded-sm text-foreground underline decoration-line-strong decoration-dotted underline-offset-[6px] outline-offset-2 transition-colors duration-200 hover:text-accent hover:decoration-accent focus-visible:outline-2 focus-visible:outline-accent"
    >
      {children}
    </IconPop>
  );
}

const systemIcons: PopIcon[] = [
  { key: "layers", icon: <Layers />, label: "Design systems" },
  { key: "plug", icon: <Plug />, label: "APIs and integrations" },
  { key: "devices", icon: <Devices />, label: "Web and mobile" },
];

const craftIcons: PopIcon[] = [
  { key: "gauge", icon: <Gauge />, label: "Performance" },
  { key: "accessibility", icon: <Accessibility />, label: "Accessibility" },
  { key: "wand", icon: <Sparkles />, label: "Interaction detail" },
];

const productIcons: PopIcon[] = [
  { key: "compass", icon: <Compass />, label: "Product direction" },
  { key: "wand", icon: <Sparkles />, label: "Design craft" },
  { key: "layers", icon: <Layers />, label: "Engineering" },
];

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

async function page() {
  const [source, projects, feedItems] = await Promise.all([
    getPlaylist(PLAYLIST_ID, playlist),
    getPortfolioProjects(),
    getPortfolioFeedItems(),
  ]);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Frontend Engineer",
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.defaultOgImage),
    sameAs: socials
      .filter((social) => social.href.startsWith("http"))
      .map((social) => social.href),
    knowsAbout: capabilities.map((capability) => capability.title),
  };

  return (
    <div className="container-box">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data must be inlined as JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div id="intro" className="space-y-10 mt-30 content-box max-w-3xl">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Daniel Fadamitan</h1>
          <p className="text-base text-secondary">Frontend Engineer</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-display font-semibold">
            I build thoughtful <br />
            interfaces for products <br />
            people actually use.
          </h2>
          <p className="text-base text-secondary">
            I work across web and mobile, turning complex product requirements
            into clear, responsive and maintainable interfaces.
          </p>
          <p className="text-base text-secondary leading-relaxed">
            Most of it ends up on <SocialLink name="GitHub" />, open source and
            production work alike. When an interface refuses to leave me alone I
            think out loud about it on <SocialLink name="X" />. The tidier, more
            formal telling lives on <SocialLink name="LinkedIn" />, and if you
            would rather skip the scrolling entirely, the whole thing fits on{" "}
            <SocialLink name="Resume" />.
          </p>
        </div>
      </div>

      <div id="work">
        <Work projects={projects} />
      </div>

      <div id="approach" className="content-box space-y-8">
        <h2 className="text-sm text-secondary font-light tracking-widest uppercase">
          Approach
        </h2>
        <p className="text-secondary text-base font-display font-medium">
          I build interfaces around{" "}
          <span className="text-foreground">real product requirements,</span>{" "}
          not isolated screens, turning complex workflows into clear, responsive
          experiences across web and mobile.
          <br />
          <br /> I work in <Fan icons={systemIcons}>reusable systems,</Fan>{" "}
          connecting APIs, authentication, payments, uploads and device
          features, caring as much about{" "}
          <Fan icons={craftIcons}>the details</Fan> as about code that stays
          maintainable as a product is refined through actual use.
        </p>
      </div>

      <div id="capabilities" className="content-box space-y-8">
        <div className="space-y-2">
          <h2 className="text-sm text-secondary font-light tracking-widest uppercase">
            CAPABILITIES
          </h2>
          <p className="text-secondary text-base">
            The areas I contribute to across a product team.
          </p>
        </div>
        <ul className="max-w-2xl space-y-3">
          {capabilities.map((capability) => (
            <li
              key={capability.title}
              className="flex gap-3 text-base text-secondary"
            >
              <span aria-hidden="true" className="pt-2.5 text-line-strong">
                <span className="block size-1 rounded-full bg-current" />
              </span>
              <span>
                <span className="block text-foreground">
                  {capability.title}
                </span>
                <span className="block text-sm text-secondary">
                  {capability.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <section
        id="feed"
        className="content-box space-y-8"
        aria-labelledby="feed-title"
      >
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-2">
            <h2
              id="feed-title"
              className="text-sm text-secondary font-light tracking-widest uppercase"
            >
              My feed
            </h2>
            <p className="text-secondary text-base">
              Notes on interface engineering, CSS, motion, and the details
              behind the work.
            </p>
          </div>
          <Link
            href="/feed"
            className="text-secondary text-sm flex items-center gap-1.5 shrink-0 hover:text-accent transition-colors duration-200"
          >
            View all
            <ArrowUpRight />
          </Link>
        </div>
        <ul className="max-w-2xl space-y-3">
          {feedItems.slice(0, 3).map((item) => (
            <li key={item.slug} className="flex gap-3 text-base text-secondary">
              <span aria-hidden="true" className="pt-2.5 text-line-strong">
                <span className="block size-1 rounded-full bg-current" />
              </span>
              <span>
                <span className="block">
                  <Link
                    href={item.href}
                    className="text-foreground underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
                  >
                    {item.title}
                  </Link>
                  <time className="ms-2 whitespace-nowrap text-sm text-muted">
                    {item.date}
                  </time>
                </span>
                <span className="block text-sm text-secondary">
                  {item.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div id="care" className="content-box space-y-8">
        <h2 className="text-sm text-secondary font-light tracking-widest uppercase">
          WHAT I CARE ABOUT
        </h2>
        <p className="text-secondary text-base font-display font-medium">
          I'm most useful where{" "}
          <Fan icons={productIcons}>product, design and engineering</Fan>{" "}
          overlap. I take an idea that is still a little unclear and turn it
          into{" "}
          <span className="text-foreground">
            something people can actually use.
          </span>
          <br />
          <br />
          That might be shaping a responsive layout, untangling an awkward
          mobile flow, building an interaction system the team can reuse, wiring
          an interface to real product data, or spending an unreasonable amount
          of time on one detail that quietly makes everything feel better.
          <br />
          <br />
          Most of that happens somewhere between React, React Native, Next.js,
          Flutter and whatever the product needs next, though the tools are
          rarely the interesting part. What I care about is whether the
          interface{" "}
          <span className="text-foreground">
            feels considered, performs well,
          </span>{" "}
          and still makes sense once the product becomes more complicated.
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-8">
          <p className="text-secondary text-base">
            If that sounds like your kind of problem, the calendar is open.
          </p>
          <Link
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-base text-foreground underline underline-offset-4 decoration-line-strong transition-colors duration-200 hover:text-accent hover:decoration-accent"
          >
            Book a 30-minute call
            <ArrowUpRight className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="content-box">
        <p className="text-secondary italic">
          Enough about the work. The rest of this page is fun.
        </p>
      </div>
      <div id="music">
        <MusicPlayer source={source} />
      </div>
    </div>
  );
}

export default page;
