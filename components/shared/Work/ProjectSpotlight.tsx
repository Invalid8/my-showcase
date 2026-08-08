"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { Project } from "./types";

type ProjectSpotlightProps = {
  project: Project;
  previous?: Project;
  next?: Project;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

function ProjectSpotlight({
  project,
  previous,
  next,
  onClose,
  onPrevious,
  onNext,
}: ProjectSpotlightProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden p-4 sm:p-8"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.63) 0%, rgba(3,3,3,0.82) 100%)",
        }}
      />

      {previous && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-70px] top-1/2 hidden h-[182px] w-[515px] -translate-y-1/2 overflow-hidden rounded-[20px] border border-line opacity-45 lg:block"
          style={{ transform: "translateY(-50%) rotate(87deg)" }}
        >
          <Image
            src={previous.image}
            alt=""
            fill
            sizes="182px"
            className="rounded-[20px] object-cover"
          />
        </div>
      )}

      {next && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-70px] top-1/2 hidden h-[209px] w-[464px] -translate-y-1/2 overflow-hidden rounded-[20px] border border-line opacity-45 lg:block"
          style={{ transform: "translateY(-50%) rotate(88deg)" }}
        >
          <Image
            src={next.image}
            alt=""
            fill
            sizes="209px"
            className="rounded-[20px] object-cover"
          />
        </div>
      )}

      <article
        className="relative aspect-1032/629 w-full max-w-[1032px] overflow-hidden rounded-[20px] border border-line"
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

        <div className="absolute bottom-[6%] left-[4.3%] right-[4.3%] flex flex-col items-start gap-3 sm:bottom-[12.5%] sm:gap-4">
          <h2
            id={titleId}
            className="font-display text-[clamp(2rem,7vw,84px)] font-extrabold tracking-[0.06em] text-accent"
          >
            {project.name}
          </h2>
          <p className="max-w-[580px] text-[clamp(0.875rem,1.8vw,23px)] leading-[1.57] text-white">
            {project.description}
          </p>
          <Link
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 rounded-lg bg-accent px-5 py-2.5 text-[clamp(0.8rem,1.2vw,16px)] font-bold text-[#0E0E0E] transition-opacity duration-200 hover:opacity-90"
          >
            Visit Site
          </Link>
        </div>
      </article>

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
    </div>
  );
}

export default ProjectSpotlight;
