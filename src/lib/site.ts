/** The registered domain. Every canonical, OG tag and sitemap entry hangs off it. */
const PRODUCTION_URL = "https://amitspace.cloud";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  // A production build must never fall back to localhost. That fallback is what
  // put http://localhost:3000 into every canonical link, og:url, og:image and
  // sitemap entry — correct URLs should not depend on remembering to set an
  // environment variable.
  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;

  return "http://localhost:3000";
}

export const site = {
  name: "Amit Vishwakarma",
  role: "Full-Stack Developer",
  tagline: "MERN + Shopify / Headless Commerce",
  title: "Amit Vishwakarma — Full-Stack Developer",
  description:
    "Full-Stack Developer with 4+ years across MERN and Shopify/Headless Commerce. Ships end-to-end — schema, APIs, auth, storefronts — for brands across the US, Canada, and Europe.",
  url: resolveSiteUrl(),
  locale: "en_US",
  email: "amit.websitedev@gmail.com",
  phone: "+917999715006",
  location: "Bengaluru, India — remote, US/EU overlap",
  resume: "/amit-vishwakarma-cv.pdf",
  socials: {
    github: "https://github.com/AvTe",
    linkedin: "https://www.linkedin.com/in/amit-vishwakarma-av7999/",
  },
  keywords: [
    "Amit Vishwakarma",
    "Full-Stack Developer",
    "MERN",
    "Shopify Hydrogen",
    "Headless Commerce",
    "Next.js",
    "React Native",
    "Node.js",
    "Storefront API",
  ],
  highlights: [
    { value: "4+", label: "years shipping" },
    { value: "30+", label: "Shopify builds" },
    { value: "15+", label: "MERN applications" },
  ],
};

export const SECTIONS = [
  { id: "work", index: "01", label: "Projects" },
  { id: "stack", index: "02", label: "Stack" },
  { id: "experience", index: "03", label: "Experience" },
  { id: "contact", index: "04", label: "Contact" },
] as const;

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    description: site.description,
    knowsAbout: site.keywords,
    sameAs: [site.socials.github, site.socials.linkedin],
  } satisfies Record<string, unknown>;
}
