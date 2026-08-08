import { projects as defaultProjects } from "@/utils/constants";
import ProjectCard from "./ProjectCard";
import type { Project } from "./types";

type WorkProps = {
  projects?: Project[];
};

function Work({ projects = defaultProjects }: WorkProps) {
  return (
    <section className="space-y-8">
      <div className="content-box">
        <h2 className="font-mono text-sm uppercase tracking-[1.4px] text-label">
          Selected work
        </h2>
      </div>

      <div className="slider">
        <ul className="flex w-max gap-9 pe-4 ps-[max(16px,calc(50vw-406px))] md:pe-6">
          {projects.map((project, index) => (
            <li key={`${project.name}-${project.href}-${index}`}>
              <ProjectCard project={project} priority={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Work;
