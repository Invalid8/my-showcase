import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import { BackLink } from "@/components/site/BackLink";
import { PrintButton } from "@/components/site/PrintButton";
import { SheetFit } from "@/components/site/SheetFit";
import { resume } from "@/content/resume";
import { createPageMetadata } from "@/lib/seo";

const serif = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = createPageMetadata({
  title: "Résumé",
  description:
    "Daniel Fadamitan, frontend engineer: experience, projects and skills.",
  path: "/resume",
});

const updated = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(resume.updated));

function Heading({ children }: { children: string }) {
  return <h2 className="cv-head">{children}</h2>;
}

export default function ResumePage() {
  return (
    <div className="site resume-page">
      <main id="content">
        <nav className="resume-bar" aria-label="Résumé">
          <BackLink href="/">Daniel Fadamitan</BackLink>
          <div className="resume-actions">
            <span className="mono-meta normal-case tracking-normal">
              Updated {updated}
            </span>
            <a
              className="text-link"
              href="/resume.pdf"
              download="Daniel-Fadamitan-Resume.pdf"
            >
              Download PDF ↓
            </a>
            <PrintButton />
          </div>
        </nav>
        <SheetFit>
          <article className={`cv ${serif.className}`}>
            <header>
              <h1>{resume.name}</h1>
              <p className="cv-role">{resume.role}</p>
            </header>
            <div className="cv-grid">
              <div>
                <section>
                  <Heading>Summary</Heading>
                  <p>{resume.summary}</p>
                </section>
                <section>
                  <Heading>Experience</Heading>
                  {resume.experience.map((job) => (
                    <div key={job.company} className="cv-item">
                      <h3>
                        {job.company} <em>— {job.title}</em>
                      </h3>
                      <p className="cv-dates">{job.dates}</p>
                      <p>{job.body}</p>
                    </div>
                  ))}
                </section>
                <section>
                  <Heading>Projects</Heading>
                  {resume.projects.map((project) => (
                    <div key={project.name} className="cv-item">
                      <h3 className="cv-project">
                        <a href={project.href}>{project.name}</a>
                        <span>{project.meta}</span>
                      </h3>
                      <p>{project.body}</p>
                    </div>
                  ))}
                </section>
                <section>
                  <Heading>Education</Heading>
                  <div className="cv-item">
                    <h3>{resume.education.school}</h3>
                    <p>
                      <em>{resume.education.degree}</em>
                    </p>
                    <p className="cv-dates">{resume.education.dates}</p>
                  </div>
                </section>
              </div>
              <aside>
                <ul className="cv-contact">
                  {resume.contact.map((item) => (
                    <li key={item.href}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
                <section>
                  <Heading>Skills</Heading>
                  {resume.skills.map((skill) => (
                    <div key={skill.label} className="cv-item">
                      <h3>{skill.label}</h3>
                      <p>{skill.value}</p>
                    </div>
                  ))}
                </section>
                <section>
                  <Heading>Language</Heading>
                  <p>{resume.languages}</p>
                </section>
                <section>
                  <Heading>Interests</Heading>
                  <p>{resume.interests}</p>
                </section>
              </aside>
            </div>
          </article>
        </SheetFit>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sizes the sheet before first paint so phones never see it cropped
          dangerouslySetInnerHTML={{
            __html:
              "(function(e){e.style.setProperty('--sheet-scale',Math.min(1,e.clientWidth/794))})(document.currentScript.previousElementSibling)",
          }}
        />
        <p className="resume-note">
          This page is the résumé. It reads from the same content as the site,
          so it is never out of date, and printing it gives a clean one-page A4.
        </p>
      </main>
    </div>
  );
}
