import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Hero. The gradient carries the mood; the copy carries the job.
 *
 * Everything a recruiter needs in the first five seconds lives above the
 * fold — who you build for, that you are available, where to go next, and
 * three numbers that back it up.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="hero">
      <span className="hero__gradient" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />

      <div className="hero__inner">
        {/* A status badge, so it stays one glanceable phrase. The qualifier it
            used to carry made it a sentence, which wrapped to two lines on a
            phone and outweighed the headline; it lives in the positioning line
            below now. */}
        <p className="hero__availability">
          <span className="hero__dot" aria-hidden="true" />
          Available immediately
        </p>

        <p className="hero__eyebrow">Hey, I&rsquo;m {site.name.split(" ")[0]}</p>
        <span className="hero__rule" aria-hidden="true" />

        {/* No forced break. `text-wrap: balance` on .hero__title picks even
            lines at every width; a hardcoded <br /> overrode it and produced
            three ragged lines on a phone. */}
        <h1 id="hero-heading" className="hero__title">
          Full-stack Developer and Shopify Expert
        </h1>

        <p className="hero__positioning">
          MERN products and Shopify storefronts for brands in the US, Canada, and
          Europe. Open to full-time roles or selected freelance.
        </p>

        <div className="hero__actions">
          <Link href="#work" className="hero__cta hero__cta--solid">
            See selected work
          </Link>
          <a href={site.resume} download className="hero__cta hero__cta--ghost">
            Download CV
          </a>
        </div>

        <dl className="hero__stats">
          {site.highlights.map((stat) => (
            <div key={stat.label} className="hero__stat">
              <dt className="hero__stat-label">{stat.label}</dt>
              <dd className="hero__stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
