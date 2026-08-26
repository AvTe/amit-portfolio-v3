import type { ReactNode } from "react";
import { Reveal } from "./reveal";

interface SectionProps {
  id: string;
  label: string;
  /** Usually a string; takes nodes where a section needs a composed heading. */
  title: ReactNode;
  intro?: string;
  /** Vertical breathing room. `lg` for the sections that should dominate. */
  pad?: "lg" | "md";
  children: ReactNode;
}

/**
 * Section frame: a small caps eyebrow, the title, an optional intro, then the
 * body.
 *
 * Every section shares one content width so the left edge never moves down the
 * page. Rhythm comes from vertical padding and from how dense each section's
 * body is — not from moving the spine.
 */
export function Section({
  id,
  label,
  title,
  intro,
  pad = "md",
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section scroll-mt-6${pad === "lg" ? " section--pad-lg" : ""}`}
    >
      <div className="shell">
        <Reveal>
          <div className="section__grid">
            <p className="label">{label}</p>
            <div>
              <h2 id={headingId} className="section__title">
                {title}
              </h2>
              {intro ? <p className="section__intro">{intro}</p> : null}
            </div>
          </div>
        </Reveal>

        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}
