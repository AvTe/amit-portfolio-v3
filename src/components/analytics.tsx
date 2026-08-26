import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics 4.
 *
 * `next/script` rather than `@next/third-parties/google`: the helper package
 * would be the project's first runtime dependency beyond React and Next, and it
 * wraps the same two tags this renders directly.
 *
 * `afterInteractive` is the right strategy — analytics has no business
 * competing with the page for the main thread during hydration. The inline tag
 * carries an `id`, which Next requires in order to track and dedupe it.
 *
 * Rendering is gated in the root layout, not here, so this component stays a
 * plain description of the tags.
 */
export function Analytics() {
  const id = site.gaMeasurementId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
