"use client";

import Image from "next/image";
import { ArrowUpRight } from "../../Icons";
import type { Project } from "./types";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
  onOpen?: () => void;
};

function ProjectCard({ project, priority = false, onOpen }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${project.name}`}
      className="group relative block aspect-504/297 w-[min(504px,82vw)] overflow-hidden rounded-[3px] border border-line text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 768px) 82vw, 504px"
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,8,8,0) 0%, rgba(8,8,8,0.95) 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-[22px]">
        <span className="min-w-0">
          <span className="block truncate text-[19px] font-semibold tracking-[-0.35px] text-primary">
            {project.name}
          </span>
          <span className="mt-[7px] block truncate font-mono text-[11.5px] tracking-[0.3px] text-secondary">
            {project.descriptor}
          </span>
        </span>
        <ArrowUpRight className="size-4 shrink-0 text-accent transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

export default ProjectCard;
