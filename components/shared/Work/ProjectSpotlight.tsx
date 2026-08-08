"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { ArrowUpRight } from "../../Icons";
import type { Project } from "./types";

type ProjectSpotlightProps = {
  project: Project;
  projectIndex: number;
  projectCount: number;
  previous?: Project;
  next?: Project;
  onClose: () => void;
  direction?: 1 | -1;
  onPrevious?: () => void;
  onNext?: () => void;
};

function ProjectSpotlight({
  project,
  projectIndex,
  projectCount,
  previous,
  next,
  onClose,
  direction = 1,
  onPrevious,
  onNext,
}: ProjectSpotlightProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.dataset.spotlightOpen = "true";

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      delete document.body.dataset.spotlightOpen;
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious?.();
      if (event.key === "ArrowRight") onNext?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrevious, onNext]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden p-4 sm:p-8"
    >
      <motion.button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
        className="absolute inset-0 cursor-default"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.63) 0%, rgba(3,3,3,0.82) 100%)",
        }}
      />

      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={project.name}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: (travel: number) => ({ x: `${travel * 100}vw` }),
            center: { x: 0 },
            exit: (travel: number) => ({ x: `${travel * -100}vw` }),
          }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0"
        >
          {previous && (
            <motion.div
              initial={{ opacity: 0, x: -42 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.46,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-auto absolute left-[-24px] top-1/2 z-10 hidden h-[580px] w-[260px] -translate-y-1/2 lg:block"
            >
              <button
                type="button"
                aria-label={`Show previous project: ${previous.name}`}
                onClick={onPrevious}
                className="group absolute left-1/2 top-1/2 h-[260px] w-[580px] -translate-x-1/2 -translate-y-1/2 rotate-[87deg] cursor-pointer overflow-hidden rounded-[20px] border border-line bg-black/30 opacity-75 transition-opacity duration-300 hover:opacity-95"
              >
                <Image
                  src={previous.image}
                  alt=""
                  fill
                  sizes="260px"
                  className="rounded-[20px] object-cover"
                />
              </button>
            </motion.div>
          )}

          {next && (
            <motion.div
              initial={{ opacity: 0, x: 42 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.46,
                delay: 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-auto absolute right-[-24px] top-1/2 z-10 hidden h-[580px] w-[260px] -translate-y-1/2 lg:block"
            >
              <button
                type="button"
                aria-label={`Show next project: ${next.name}`}
                onClick={onNext}
                className="group absolute left-1/2 top-1/2 h-[260px] w-[580px] -translate-x-1/2 -translate-y-1/2 rotate-[88deg] cursor-pointer overflow-hidden rounded-[20px] border border-line bg-black/30 opacity-75 transition-opacity duration-300 hover:opacity-95"
              >
                <Image
                  src={next.image}
                  alt=""
                  fill
                  sizes="260px"
                  className="rounded-[20px] object-cover"
                />
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.48,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-auto absolute inset-0 grid place-items-center p-4 sm:p-8"
          >
            <article
              className="relative z-20 aspect-1032/629 w-full max-w-[1032px] overflow-hidden rounded-[20px] border border-line"
              style={{ transform: "rotate(0.477deg)" }}
            >
              <Image
                src={project.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1080px) 100vw, 1032px"
                className="rounded-[20px] object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(3,3,3,0.88) 0%, rgba(3,3,3,0.72) 45%, rgba(3,3,3,0.25) 100%)",
                }}
              />

              <div className="absolute inset-0 flex flex-col justify-between p-[5.5%]">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[1.5px] text-secondary">
                  <span>Selected work</span>
                  <span>
                    {String(projectIndex + 1).padStart(2, "0")} /{" "}
                    {String(projectCount).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-8">
                  <div className="min-w-0 max-w-[680px]">
                    <h2
                      id={titleId}
                      className="font-display text-[clamp(2rem,7vw,84px)] font-extrabold leading-[0.95] tracking-[0.04em] text-accent"
                    >
                      {project.name}
                    </h2>
                    <p className="mt-4 line-clamp-2 max-w-[580px] text-[clamp(0.8125rem,1.5vw,19px)] leading-[1.5] text-white sm:mt-6 sm:line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mb-1 flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-3 text-[clamp(0.8rem,1.2vw,16px)] font-bold text-[#0E0E0E] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Visit site
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-line bg-surface/80 text-secondary outline-offset-4 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-accent sm:right-8 sm:top-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </motion.div>
  );
}

export default ProjectSpotlight;
