import type { CSSProperties } from "react";
import Image from "next/image";
import { Section } from "../section";
import { Reveal } from "../reveal";
import { ProjectIcon } from "../project-icon";
import { WorkCarousel } from "../work-carousel";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";

/**
 * Display order, set explicitly rather than derived: owned products first,
 * then the published extensions, then open source, with agency work last.
 *
 * Anything absent from this list still renders, appended in data order, so
 * adding a project to PROJECTS can never silently drop it from the grid.
 */
const ORDER = [
  "sellflow",
  "yoombaa",
  "refineai",
  "cleancompress",
  "devstock-gitaxis",
  "headless-wp",
  "shopify-agency",
];

const ORDERED = [
  ...ORDER.flatMap((slug) => PROJECTS.filter((project) => project.slug === slug)),
  ...PROJECTS.filter((project) => !ORDER.includes(project.slug)),
];

/**
 * Project cards, no imagery.
 *
 * Stock photography cost more credibility than the layout gained, and real
 * screenshots were not available, so the cards carry their weight through type
 * scale, density, and a uniform signal slot instead. The signal holds a
 * measured number where one exists and a hard technical fact where none does —
 * same position, same treatment, so the grid stays even.
 *
 * Every destination is listed explicitly in a row at the bottom. Only a case
 * study claims the whole card via the title link's stretched ::after; the
 * bottom links sit above it, so they stay individually clickable.
 */
export function WorkSection() {
  return (
    <Section
      id="work"
      label="Projects"
      title="Selected work"
      intro="A founder product, a live MERN platform, Shopify storefronts for international brands, and published browser and editor extensions."
      pad="lg"
    >
      <WorkCarousel count={ORDERED.length}>
        <ul className="work__grid">
          {ORDERED.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={index * 45}>
              <article
                className="work__card"
                style={{ "--card-accent": project.accent } as CSSProperties}
              >
                <div className="work__top">
                  <span className="work__index">
                    {String(index + 1).padStart(2, "0")} · {project.kind} ·{" "}
                    {project.year}
                  </span>
                  <span className="work__signal">{project.signal.value}</span>
                </div>

                <h3 className="work__name">
                  {/* The project's own mark where it has one; the inline glyph
                      is the fallback for agency work and bare repos. */}
                  {project.iconSrc ? (
                    <Image
                      className="work__logo"
                      src={project.iconSrc}
                      alt=""
                      width={22}
                      height={22}
                      unoptimized
                      aria-hidden="true"
                    />
                  ) : (
                    <ProjectIcon name={project.icon} />
                  )}
                  {project.caseStudy ? (
                    <Link href={`/work/${project.slug}`}>{project.title}</Link>
                  ) : (
                    <span>{project.title}</span>
                  )}
                </h3>

                <p className="work__summary">{project.summary}</p>

                <div className="work__foot">
                  <ul className="tags">
                    {project.stack.map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {project.caseStudy ? (
                    <span className="work__more">Read →</span>
                  ) : null}
                </div>

                {project.links.length > 0 ? (
                  <ul className="work__links">
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.label} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </Reveal>
            </li>
          ))}
        </ul>
      </WorkCarousel>
    </Section>
  );
}
