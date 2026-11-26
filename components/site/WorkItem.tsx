import Image from "next/image";
import type { WorkEntry } from "@/content/types";
import { TextLink } from "./TextLink";

export function WorkItem({ work }: { work: WorkEntry }) {
  return (
    <article data-work={work.slug}>
      <Image
        className="item-icon"
        src={work.icon}
        alt=""
        width={18}
        height={18}
      />
      <TextLink href={`/work/${work.slug}`} arrow="forward">
        {work.name}
      </TextLink>
      <p>{work.description}</p>
    </article>
  );
}
