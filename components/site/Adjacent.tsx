import { TextLink } from "./TextLink";

type Link = { href: string; title: string };

export function Adjacent({
  previous,
  next,
  label = "Adjacent",
}: {
  previous?: Link;
  next?: Link;
  label?: string;
}) {
  if (!previous && !next) return null;

  return (
    <nav aria-label={label}>
      <dl className="adjacent">
        {previous && (
          <>
            <dt>Previous</dt>
            <dd>
              <TextLink href={previous.href} arrow="forward">
                {previous.title}
              </TextLink>
            </dd>
          </>
        )}
        {next && (
          <>
            <dt>Next</dt>
            <dd>
              <TextLink href={next.href} arrow="forward">
                {next.title}
              </TextLink>
            </dd>
          </>
        )}
      </dl>
    </nav>
  );
}
