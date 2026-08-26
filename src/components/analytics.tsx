import Script from "next/script";
import { site } from "@/lib/site";
import { CONSENT_KEY, CONSENT_REQUIRED_REGIONS } from "@/lib/consent";

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * Two stages, and the order between them is the whole point. Google requires
 * `consent default` to run *before* gtag.js loads, so that first block is a
 * plain inline script — part of the initial HTML, executed during parse. The
 * loader and `config` stay `afterInteractive`, which Next injects only after
 * hydration, so the default is always in place first. Making both of them
 * `next/script` would leave that ordering to chance.
 *
 * The stored answer is read synchronously in the same inline block, so gtag.js
 * starts with the visitor's real choice already applied. That is what removes
 * the need for `wait_for_update` and the delay it costs every page load.
 *
 * Advertising signals stay denied everywhere: this site runs no ads and has no
 * reason to ask for them.
 */
export function Analytics() {
  const id = site.gaMeasurementId;
  if (!id) return null;

  const denied = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };

  const bootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${JSON.stringify({
    ...denied,
    analytics_storage: "denied",
    region: CONSENT_REQUIRED_REGIONS,
  })});
gtag('consent','default',${JSON.stringify({
    ...denied,
    analytics_storage: "granted",
  })});
try{var c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)});
if(c==='granted'||c==='denied'){gtag('consent','update',{analytics_storage:c});}}catch(e){}
gtag('js', new Date());`.trim();

  return (
    <>
      {/* Must execute before gtag.js. Inline, so it runs during parse. */}
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`gtag('config', '${id}');`}
      </Script>
    </>
  );
}
