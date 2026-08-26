export interface Role {
  title: string;
  organisation: string;
  period: string;
  description: string;
}

export const EXPERIENCE: Role[] = [
  {
    title: "Full-Stack Developer",
    organisation: "Moshi Moshi, The Communication Company",
    period: "Jun 2025 — Present",
    description:
      "Shipping full-stack features across React/Next.js and Node.js/Express with MongoDB — schema to production deploy. Shopify storefronts on Admin + Storefront APIs with webhook-driven CRM/ERP sync, and frontend performance work that cut page load by roughly a third on live client sites.",
  },
  {
    title: "Freelance Full-Stack Developer",
    organisation: "Independent — direct clients & agencies",
    period: "Feb 2025 — Jun 2025 · Oct 2022 — Jun 2023",
    description:
      "MERN and Shopify delivery for repeat clients in the US and Europe: custom theme work, headless storefronts on Next.js + Storefront API, and Express/MongoDB backends. Complete lifecycle from scoping to handoff, with open-source extensions shipped between engagements.",
  },
  {
    title: "Frontend / Full-Stack Developer",
    organisation: "Stellar8 Labs",
    period: "Mar 2024 — Feb 2025",
    description:
      "Full-stack features with React/Next.js and Node.js APIs, including JWT and session auth. Built reusable component libraries used across product areas, ran WCAG audits and cross-browser QA, and refactored legacy components into modular architecture.",
  },
  {
    title: "Web Developer / Website Designer",
    organisation: "GrayCyan",
    period: "Jun 2023 — Feb 2024",
    description:
      "WordPress block themes and responsive marketing sites from UI/UX wireframes, working directly with the Canadian design team across time zones. BEM + SCSS architecture, pixel-perfect across breakpoints.",
  },
  {
    title: "Web Developer",
    organisation: "Dime In Time Media LLC",
    period: "Sep 2021 — Oct 2022",
    description:
      "Responsive, conversion-focused sites for US clients on JavaScript, WordPress, and WooCommerce — checkout customisations, product templates, and performance improvements on delivered projects.",
  },
];
