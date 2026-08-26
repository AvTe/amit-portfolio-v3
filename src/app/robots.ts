import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Next's build artefacts are not content. Crawlers waste budget on them
      // and occasionally surface a chunk URL in results.
      disallow: ["/_next/static/chunks/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    // Names the canonical hostname, so a crawler that reaches the site through
    // the www alias knows which one to keep.
    host: site.url,
  };
}
