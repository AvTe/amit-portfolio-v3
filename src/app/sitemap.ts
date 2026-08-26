import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = PROJECTS.filter((project) => project.caseStudy).map(
    (project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }),
  );

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies,
  ];
}
