"use client";

import { useCallback, useState } from "react";
import { projects as defaultProjects } from "@/utils/constants";
import ProjectCard from "./ProjectCard";
import ProjectSpotlight from "./ProjectSpotlight";
import type { Project } from "./types";

type WorkProps = {
  projects?: Project[];
};

function Work({ projects = defaultProjects }: WorkProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const step = useCallback(
    (delta: number) => {
      setDirection(delta > 0 ? 1 : -1);
      setOpen((current) =>
        current === null
          ? current
          : (current + delta + projects.length) % projects.length,
      );
    },
    [projects.length],
  );

  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="space-y-5">
      <div className="content-box">
        <h2 className="font-mono text-[11px] uppercase tracking-[1.4px] text-label">
          Selected work
        </h2>
      </div>

      <div className="slider">
        <ul className="flex w-max gap-9 pe-4 ps-[max(16px,calc(50vw-406px))] md:pe-6">
          {projects.map((project, index) => (
            <li key={`${project.name}-${project.href}-${index}`}>
              <ProjectCard
                project={project}
                priority={index === 0}
                onOpen={() => setOpen(index)}
              />
            </li>
          ))}
        </ul>
      </div>

      {open !== null && projects[open] && (
        <ProjectSpotlight
          project={projects[open]}
          projectIndex={open}
          projectCount={projects.length}
          previous={
            projects.length > 1
              ? projects[(open - 1 + projects.length) % projects.length]
              : undefined
          }
          next={
            projects.length > 1
              ? projects[(open + 1) % projects.length]
              : undefined
          }
          onClose={close}
          direction={direction}
          onPrevious={projects.length > 1 ? () => step(-1) : undefined}
          onNext={projects.length > 1 ? () => step(1) : undefined}
        />
      )}
    </section>
  );
}

export default Work;
