import "server-only";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { type ComponentPropsWithoutRef, Fragment, type ReactNode } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { cn } from "@/utils";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-default" },
    keepBackground: false,
    defaultLang: "plaintext",
  });

const components = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h2
      {...props}
      className={cn(
        "mt-12 scroll-mt-24 font-display text-2xl font-medium text-primary first:mt-0 sm:text-3xl",
        className,
      )}
    />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      {...props}
      className={cn(
        "mt-12 scroll-mt-24 font-display text-2xl font-medium text-primary first:mt-0 sm:text-3xl",
        className,
      )}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      {...props}
      className={cn(
        "mt-9 scroll-mt-24 font-display text-xl font-medium text-primary",
        className,
      )}
    />
  ),
  h4: ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4
      {...props}
      className={cn(
        "mt-8 scroll-mt-24 font-display text-lg font-medium text-primary",
        className,
      )}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p {...props} className={cn("mt-5", className)} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className={cn("mt-5 list-disc space-y-2 ps-5", className)} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      {...props}
      className={cn("mt-5 list-decimal space-y-2 ps-5", className)}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li {...props} className={cn("marker:text-muted", className)} />
  ),
  strong: ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong
      {...props}
      className={cn("font-semibold text-primary", className)}
    />
  ),
  blockquote: ({
    className,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className={cn(
        "mt-7 border-s-2 border-accent ps-5 text-secondary italic",
        className,
      )}
    />
  ),
  hr: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
    <hr {...props} className={cn("mt-10 border-line", className)} />
  ),
  a: ({ href, className, ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = !!href && /^https?:\/\//.test(href);

    return (
      <a
        {...props}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(
          "text-accent underline underline-offset-4 hover:no-underline",
          className,
        )}
      />
    );
  },
  img: ({ className, alt, ...props }: ComponentPropsWithoutRef<"img">) => (
    // biome-ignore lint/performance/noImgElement: markdown images have unknown dimensions
    <img
      {...props}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      className={cn("mt-7 h-auto w-full rounded border border-line", className)}
    />
  ),
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="mt-7 overflow-x-auto rounded border border-line">
      <table
        {...props}
        className={cn("w-full border-collapse text-sm", className)}
      />
    </div>
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      {...props}
      className={cn(
        "border-b border-line bg-surface px-4 py-3 text-start font-medium text-primary",
        className,
      )}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      {...props}
      className={cn("border-b border-line px-4 py-3 align-top", className)}
    />
  ),
  pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      className={cn(
        "mt-7 overflow-x-auto rounded border border-line bg-surface p-5 font-mono text-xs leading-6",
        className,
      )}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code
      {...props}
      className={cn(
        "font-mono text-[0.9em]",
        !className?.includes("language-") &&
          "rounded border border-line bg-surface px-1.5 py-0.5 text-primary",
        className,
      )}
    />
  ),
};

export async function renderMarkdown(source: string): Promise<ReactNode> {
  const tree = processor.parse(source);
  const hast = await processor.run(tree);

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components,
  });
}
