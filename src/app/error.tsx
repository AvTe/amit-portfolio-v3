"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Catches a runtime throw anywhere below the root layout.
 *
 * Four client components run on this site — the theme toggle, the menu, the
 * carousel and the contact headline's pointer tracking — so this is a real
 * surface, not a formality. The layout survives, so the visitor keeps the nav
 * and can leave without using the back button.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No error service is wired up yet; the console is the only reporter there
    // is. Replace this with the real client when one exists.
    console.error(error);
  }, [error]);

  return (
    <div className="notfound">
      <p className="label">Something broke</p>
      <h1 className="notfound__title">This section failed to load</h1>
      <p className="notfound__body">
        The rest of the site is fine. Try again, and if it keeps happening I
        would genuinely like to know.
      </p>

      <div className="notfound__links">
        <button
          type="button"
          onClick={reset}
          className="hero__cta hero__cta--solid"
        >
          Try again
        </button>
        <Link href="/" className="hero__cta hero__cta--ghost">
          Back to start
        </Link>
      </div>

      <p className="label mt-6">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        {error.digest ? ` · reference ${error.digest}` : null}
      </p>
    </div>
  );
}
