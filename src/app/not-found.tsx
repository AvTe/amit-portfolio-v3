import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 has nothing worth indexing, and indexing it competes with the real
  // pages for the same terms.
  robots: { index: false, follow: true },
};

/**
 * Shown for any unmatched URL, and for a `/work/<slug>` that has no case study —
 * `notFound()` in that route sends visitors here deliberately.
 */
export default function NotFound() {
  return (
    <div className="notfound">
      <p className="label">Error 404</p>
      <h1 className="notfound__title">This page doesn&rsquo;t exist</h1>
      <p className="notfound__body">
        The link may be out of date, or the address slightly off. Everything on
        this site is reachable from the work below.
      </p>

      <div className="notfound__links">
        <Link href="/" className="hero__cta hero__cta--solid">
          Back to start
        </Link>
        <Link href="/#work" className="hero__cta hero__cta--ghost">
          See selected work
        </Link>
      </div>

      <p className="label mt-6">
        Or email <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </div>
  );
}
