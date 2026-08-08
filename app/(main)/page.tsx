import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import MusicPlayer from "@/components/shared/MusicPlayer";
import { getPlaylist } from "@/components/shared/MusicPlayer/playlist";
import Work from "@/components/shared/Work";
import {
  capabilities,
  feedItems,
  PLAYLIST_ID,
  playlist,
  socials,
} from "@/utils/constants";

async function page() {
  const source = await getPlaylist(PLAYLIST_ID, playlist);

  return (
    <div className="container-box">
      <div id="intro" className="space-y-10 mt-30 content-box max-w-2xl">
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
          <ul className="flex gap-6 items-center flex-wrap">
            {socials.map((social) => (
              <li key={social.name}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary hover:text-accent transition-colors duration-200 flex items-center gap-1.5 text-nowrap"
                >
                  {social.name} <ArrowUpRight />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div id="work">
        <Work />
      </div>

      <div id="approach" className="content-box space-y-8">
        <h2 className="text-sm text-secondary font-light tracking-widest uppercase">
          Approach
        </h2>
        <p className="text-secondary text-xl md:text-2xl font-display font-medium">
          I build interfaces around{" "}
          <span className="text-accent">real product requirements,</span> not
          isolated screens, turning complex workflows into{" "}
          <span className="text-foreground">clear, responsive experiences</span>{" "}
          across <span className="text-accent">web and mobile.</span>
          <br />
          <br /> I work in{" "}
          <span className="text-foreground">reusable systems,</span> connecting
          APIs, authentication, payments, uploads and device features, caring as
          much about{" "}
          <span className="text-foreground">interaction details</span> as about{" "}
          <span className="text-foreground">performance</span> accessibility and
          code that stays <span className="text-accent">maintainable</span> as a
          product is refined through{" "}
          <span className="text-accent">actual use.</span>
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
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability) => (
            <li key={capability.title} className="h-full">
              <div className="bg-surface p-6 rounded h-full hover:bg-opacity-80 transition-colors duration-200 flex flex-col justify-between border border-line hover:border-line-strong">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-1.5">
                  {capability.title}
                </h3>
                <p className="text-secondary text-sm">
                  {capability.description}
                </p>
                <Link
                  href={capability.product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary text-sm flex items-center gap-1.5 mt-4 hover:text-accent transition-colors duration-200"
                >
                  {capability.product.name}
                  <ArrowUpRight />
                </Link>
              </div>
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
        <ul className="space-y-3">
          {feedItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="group grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-8 rounded-xl border border-line bg-surface p-4 md:p-5 hover:border-line-strong transition-colors duration-200"
              >
                <time className="text-xs text-secondary tracking-wide md:pt-1">
                  {item.date}
                </time>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium group-hover:text-accent transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary">{item.description}</p>
                  <p className="text-xs text-secondary">
                    {item.tags.join(" · ")}
                  </p>
                </div>
                <ArrowUpRight className="text-secondary md:mt-1 md:justify-self-end group-hover:text-accent transition-colors duration-200" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div id="care" className="content-box space-y-8">
        <h2 className="text-sm text-secondary font-light tracking-widest uppercase">
          WHAT I CARE ABOUT
        </h2>
        <p className="text-secondary text-xl md:text-2xl font-display font-medium">
          I'm most useful where{" "}
          <span className="text-accent">product, design and engineering</span>{" "}
          overlap. I take an idea that is still a little unclear and turn it
          into{" "}
          <span className="text-foreground">
            something people can actually use.
          </span>
          <br />
          <br />
          That might be shaping a responsive layout, untangling an awkward
          mobile flow, building an interaction system the team can reuse, wiring
          an interface to{" "}
          <span className="text-accent">real product data,</span> or spending an
          unreasonable amount of time on one detail that quietly makes
          everything feel better.
          <br />
          <br />
          Most of that happens somewhere between React, React Native, Next.js,
          Flutter and whatever the product needs next, though the tools are
          rarely the interesting part. What I care about is whether the
          interface{" "}
          <span className="text-foreground">
            feels considered, performs well,
          </span>{" "}
          and still makes sense once the product{" "}
          <span className="text-accent">becomes more complicated.</span>
        </p>
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
