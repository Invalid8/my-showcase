import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "../../Icons";
import type { Project } from "./types";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-504/297 w-[min(720px,88vw)] overflow-hidden rounded-[3px] border border-line bg-card-tint text-left outline-offset-4 transition-colors duration-200 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="absolute inset-8 overflow-hidden rounded-[3px] shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:inset-14">
        <Image
          src={project.image}
          alt=""
          width={720}
          height={424}
          sizes="(max-width: 768px) 88vw, 720px"
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className="size-full object-cover object-top transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent to-black/60" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 md:p-8">
        <span className="min-w-0">
          <span className="block truncate text-[19px] font-semibold tracking-[-0.35px] text-white">
            {project.name}
          </span>
          <span className="mt-[7px] block truncate font-mono text-[11.5px] tracking-[0.3px] text-white/75">
            {project.descriptor}
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </span>
        <ArrowUpRight className="size-4 shrink-0 text-accent transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default ProjectCard;
