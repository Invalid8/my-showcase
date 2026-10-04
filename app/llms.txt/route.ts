import {
  getPortfolioFeedItems,
  getPortfolioProjects,
} from "@/lib/portfolio-data";
import { absoluteUrl, siteConfig, summarize } from "@/lib/seo";
import { capabilities, socials } from "@/utils/constants";

export const revalidate = 900;

export async function GET() {
  const [projects, feedItems] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioFeedItems(),
  ]);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Pages",
    "",
    `- [Home](${absoluteUrl("/")}): Introduction, selected work, approach and capabilities`,
    `- [Feed](${absoluteUrl("/feed")}): Notes on interface engineering, CSS, motion, and the details behind the work`,
    "",
    "## Selected work",
    "",
    ...projects.map(
      (project) =>
        `- [${project.name}](${project.href}): ${summarize(project.description || project.descriptor, 240)}`,
    ),
    "",
    "## Feed",
    "",
    ...feedItems.map(
      (item) =>
        `- [${item.title}](${absoluteUrl(item.href)}): ${summarize(item.description, 240)}`,
    ),
    "",
    "## Capabilities",
    "",
    ...capabilities.map(
      (capability) => `- ${capability.title}: ${capability.description}`,
    ),
    "",
    "## Elsewhere",
    "",
    ...socials.map((social) => `- [${social.name}](${social.href})`),
    `- [Email](mailto:${siteConfig.email})`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
