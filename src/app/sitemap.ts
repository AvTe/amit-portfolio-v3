import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { site } from "@/lib/site";

/**
 * When the content last actually changed.
 *
 * This was `new Date()`, which stamped every URL with the build time — so a
 * deploy that only touched CSS told Google every page had changed, including
 * case studies whose text had not moved in months. `lastmod` is only worth
 * sending when it is true; a feed that claims everything changed on every
 * deploy is one a crawler learns to ignore.
 *
 * Bump this when the copy changes, not when the code does.
 */
const CONTENT_UPDATED = new Date("2026-08-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = PROJECTS.filter((project) => project.caseStudy).map(
    (project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }),
  );

  return [
    {
      url: site.url,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies,
  ];
}
