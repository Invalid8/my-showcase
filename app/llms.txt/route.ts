import { caseStudies } from "@/content/case-studies";
import { contacts, intro, person } from "@/content/home";
import { getPortfolioFeedItems } from "@/lib/portfolio-data";
import { absoluteUrl, summarize } from "@/lib/seo";

export const revalidate = 900;

export async function GET() {
  const feedItems = await getPortfolioFeedItems();

  const lines = [
    `# ${person.name}`,
    "",
    `> ${person.role}. ${intro}`,
    "",
    "## Pages",
    "",
    `- [Home](${absoluteUrl("/")}): Introduction, tools, work, writing and how to get in touch`,
    `- [Writing](${absoluteUrl("/writing")}): Notes on interface engineering, CSS, motion and the details behind the work`,
    `- [Details](${absoluteUrl("/details")}): Interaction, UI and brand decisions from shipped work`,
    `- [Crafts](${absoluteUrl("/crafts")}): Interface and interaction studies, one page each`,
    `- [Résumé](${absoluteUrl("/resume")}): Experience, projects and skills, also as a PDF at ${absoluteUrl("/resume.pdf")}`,
    "",
    "## Case studies",
    "",
    ...caseStudies.map(
      (study) =>
        `- [${study.name}](${absoluteUrl(`/work/${study.slug}`)}): ${study.line}`,
    ),
    "",
    "## Writing",
    "",
    ...feedItems.map(
      (item) =>
        `- [${item.title}](${absoluteUrl(item.href)}): ${summarize(item.description, 240)}`,
    ),
    "",
    "## Elsewhere",
    "",
    ...contacts
      .filter((contact) => contact.href.startsWith("http"))
      .map((contact) => `- [${contact.label}](${contact.href})`),
    `- [Email](mailto:${person.email})`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
