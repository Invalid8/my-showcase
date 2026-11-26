import Image from "next/image";
import type { Tool } from "@/content/types";

export function ToolChip({ tool }: { tool: Tool }) {
  const icon = tool.icon ? (
    <Image
      className="chip-icon"
      src={tool.icon}
      alt=""
      width={18}
      height={18}
    />
  ) : (
    <span className="chip-icon" aria-hidden="true" />
  );

  if (!tool.href) {
    return (
      <span className="chip">
        {icon}
        {tool.name}
      </span>
    );
  }

  return (
    <a className="chip" href={tool.href} target="_blank" rel="noopener">
      {icon}
      {tool.name}
    </a>
  );
}
