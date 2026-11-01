export interface Role {
  title: string;
  organisation: string;
  period: string;
  description: string;
}

export const EXPERIENCE: Role[] = [
  {
    title: "Shopify Full-Stack Developer",
    organisation: "TipTop Things Limited",
    period: "Sep 2026 — Present",
    description:
      "Shopify storefronts and custom apps end to end on Liquid, React, TypeScript, Node.js, and the Admin and Storefront GraphQL APIs. Custom theme sections, Theme App Extensions, and app backends with webhooks and OAuth, plus integrations with external services and Core Web Vitals work.",
  },
  {
    title: "Shopify Full-Stack Developer",
    organisation: "Moshi Moshi, The Communication Company",
    period: "Jun 2025 — Jun 2026",
    description:
      "Custom Shopify sections, Theme App Extensions, and app backends in Node.js, React, and Next.js for enterprise DTC brands, extended through the Storefront and Admin GraphQL APIs, metafields, and metaobjects. BigCommerce storefront work on cross-platform projects, and Core Web Vitals work that cut page load by roughly 30–40% on several client sites.",
  },
  {
    title: "Freelance Shopify Developer",
    organisation: "Independent — direct clients & agencies",
    period: "Feb 2025 — Jun 2025 · Oct 2022 — Jun 2023",
    description:
      "Complete project lifecycle for repeat clients in the US and Europe, from scoping to handoff. Custom Shopify themes on Liquid and the Storefront GraphQL API, BigCommerce storefront builds, and migrations onto Shopify from other platforms.",
  },
  {
    title: "Frontend Developer",
    organisation: "Stellar8 Labs",
    period: "Mar 2024 — Feb 2025",
    description:
      "Responsive, accessible UI for eCommerce platforms, integrated with backend systems over REST and GraphQL APIs, with attention to component structure and design-system consistency. Performance optimisation, accessibility testing, and cross-browser debugging.",
  },
  {
    title: "Website Designer",
    organisation: "GrayCyan",
    period: "Jun 2023 — Feb 2024",
    description:
      "High-performance WordPress block themes and custom plugins in PHP and ACF, built from UI/UX wireframes. Scalable BEM + SCSS architecture, pixel-perfect across devices.",
  },
  {
    title: "Web Developer",
    organisation: "Dime In Time Media LLC",
    period: "Sep 2021 — Oct 2022",
    description:
      "Responsive, conversion-focused websites for US clients, and WooCommerce solutions in PHP and WordPress, including custom theme and plugin work and performance improvements.",
  },
];
