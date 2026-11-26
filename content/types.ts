export type Tool = {
  name: string;
  href?: string;
  icon?: string;
};

export type ToolGroup = {
  label: string;
  tools: Tool[];
};

export type WorkEntry = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  origin: "mine" | "client";
  story: string;
  meta: string;
};

export type Contact = {
  label: string;
  href: string;
};
