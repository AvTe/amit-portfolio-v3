import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { site } from "@/lib/site";

/** Only projects with genuine depth get a route — an empty page helps nobody. */
const CASE_STUDIES = PROJECTS.filter((project) => project.caseStudy);

export function generateStaticParams() {
  return CASE_STUDIES.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = CASE_STUDIES.find((entry) => entry.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — case study`,
    description: project.caseStudy?.premise ?? project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — case study`,
      description: project.caseStudy?.premise ?? project.summary,
      url: `${site.url}/work/${project.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = CASE_STUDIES.find((entry) => entry.slug === slug);
  if (!project?.caseStudy) notFound();

  const { caseStudy } = project;

  return (
    <article className="case">
      <Link href="/#work" className="case__back">
        ← All work
      </Link>

      <p className="label mt-6">
        {project.kind} · {project.year}
      </p>
      <h1 className="case__title">{project.title}</h1>
      <p className="case__premise">{caseStudy.premise}</p>

      {/* Replaces the hero image. The stock photography that used to sit here
          cost more credibility than the visual weight was worth. */}
      <div className="case__bar">
        <span>
          <strong>{project.signal.value}</strong>
        </span>
        <span>{project.year}</span>
        <span>{project.stack.join(" · ")}</span>
      </div>

      <div className="case__section">
        <p className="label md:pt-1">Role</p>
        <p>{caseStudy.role}</p>
      </div>

      {caseStudy.sections.map((section, index) => (
        <section key={section.heading} className="case__section">
          <p className="label md:pt-1">
            {String(index + 1).padStart(2, "0")}
          </p>
          <div>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        </section>
      ))}

      <div className="case__section">
        <p className="label md:pt-1">Stack</p>
        <ul className="tags">
          {project.stack.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {project.links.length > 0 ? (
        <div className="case__section">
          <p className="label md:pt-1">Links</p>
          <div className="contact__links !mt-0">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
