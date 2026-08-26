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

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
