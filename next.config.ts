import type { NextConfig } from "next";

/**
 * Response headers.
 *
 * No CSP yet, deliberately. The theme script in `layout.tsx` runs inline before
 * paint to avoid a flash, so a strict policy needs a nonce or a hash for it —
 * shipping a broken CSP is worse than shipping none. The four below carry no
 * such risk and cost nothing.
 */
const securityHeaders = [
  // This site is never meant to be framed.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers guessing a type other than the one served.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin cross-site, the full path same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs a camera, microphone or location.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  experimental: {
    /**
     * Ship CSS as a <style> tag in the head instead of a <link>.
     *
     * Lighthouse measured the stylesheet as the only render-blocking request,
     * costing 150ms before anything could paint — with LCP at 4.4s that is the
     * cheapest part to remove. The documented trade-off is that returning
     * visitors lose a cached stylesheet, which is the right side to give up on
     * a portfolio: almost every visit is someone's first.
     */
    inlineCss: true,
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      /**
       * One canonical host. Both apex and www served 200 independently, which
       * means two URLs for every page. The canonical tag already pointed at the
       * apex so search would have consolidated eventually, but a 301 settles it
       * outright and saves the round trip.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.amitspace.cloud" }],
        destination: "https://amitspace.cloud/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
