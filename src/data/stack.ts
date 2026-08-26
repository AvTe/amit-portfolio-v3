/**
 * The stack, grouped into five domains — sourced from the 2026 resume.
 *
 * These groups drive the city model in the Stack section: each domain is a
 * block of towers, `weight` (1–5) drives tower height, `color` is the brand
 * colour used for the crown, sign trim, and list chip.
 *
 * `icon` names an SVG vendored under /public/logos (originally from
 * simpleicons). Every mark appears at most once across the city — tools that
 * would repeat a logo (React Native vs React, the three Shopify technologies)
 * or whose mark doesn't exist (AWS was removed from simpleicons after a
 * trademark takedown) carry a `mono` label instead, rendered as a typographic
 * board. `mono` is also the fallback if a logo fails to load, so no tower is
 * ever blank.
 *
 * Adding an icon: drop `<slug>.svg` (brand-coloured) into /public/logos; if
 * the brand colour is dark, also add `<slug>-white.svg` — the city swaps to
 * it automatically for legibility on the night facade.
 */

export type StackDomain = "interface" | "backend" | "commerce" | "data" | "cloud";

export interface StackItem {
  name: string;
  domain: StackDomain;
  /** 1–5. Drives tower height. */
  weight: number;
  /** Brand colour (crown, trim, list chip). */
  color: string;
  /** simpleicons slug. Omitted where the mark would repeat or doesn't exist. */
  icon?: string;
  /** Short board text — used when there is no icon, or as load fallback. */
  mono: string;
}

export const DOMAINS: { id: StackDomain; label: string; blurb: string }[] = [
  {
    id: "interface",
    label: "Interface",
    blurb:
      "Reusable component libraries used across multiple product areas. WCAG audits and cross-browser QA at release.",
  },
  {
    id: "backend",
    label: "Backend",
    blurb:
      "REST and GraphQL APIs with validation and error handling. JWT and session auth; webhook-driven sync into CRM and ERP.",
  },
  {
    id: "commerce",
    label: "Commerce",
    blurb:
      "30+ production Shopify builds. Admin and Storefront APIs, Liquid themes, and headless storefronts on Next.js.",
  },
  {
    id: "data",
    label: "Data",
    blurb:
      "Schema design through query optimisation — measurably faster API responses on refactored endpoints.",
  },
  {
    id: "cloud",
    label: "Cloud & Delivery",
    blurb:
      "Deploys on AWS behind Nginx and PM2. Owned Core Web Vitals work that cut page load by roughly a third on live client sites.",
  },
];

export const STACK: StackItem[] = [
  { name: "React", domain: "interface", weight: 5, color: "#61DAFB", icon: "react", mono: "R" },
  { name: "Next.js", domain: "interface", weight: 5, color: "#171717", icon: "nextdotjs", mono: "N" },
  { name: "TypeScript", domain: "interface", weight: 4, color: "#3178C6", icon: "typescript", mono: "TS" },
  { name: "React Native", domain: "interface", weight: 3, color: "#61DAFB", mono: "RN" },
  { name: "Tailwind", domain: "interface", weight: 5, color: "#06B6D4", icon: "tailwindcss", mono: "TW" },

  { name: "Node.js", domain: "backend", weight: 5, color: "#5FA04E", icon: "nodedotjs", mono: "NJ" },
  { name: "Express", domain: "backend", weight: 5, color: "#6e6e6e", icon: "express", mono: "EX" },
  { name: "GraphQL", domain: "backend", weight: 4, color: "#E10098", icon: "graphql", mono: "GQ" },
  { name: "WebSockets", domain: "backend", weight: 3, color: "#f5c542", mono: "WS" },

  { name: "Shopify Hydrogen", domain: "commerce", weight: 4, color: "#9b6bf2", mono: "H2" },
  { name: "Storefront API", domain: "commerce", weight: 5, color: "#7AB55C", icon: "shopify", mono: "SF" },
  { name: "Shopify Liquid", domain: "commerce", weight: 5, color: "#22b8a0", mono: "{ }" },
  { name: "WooCommerce", domain: "commerce", weight: 3, color: "#96588A", icon: "woocommerce", mono: "WC" },

  { name: "MongoDB", domain: "data", weight: 5, color: "#47A248", icon: "mongodb", mono: "M" },
  { name: "PostgreSQL", domain: "data", weight: 3, color: "#4169E1", icon: "postgresql", mono: "PG" },
  { name: "Redis", domain: "data", weight: 3, color: "#FF4438", icon: "redis", mono: "RD" },
  { name: "Supabase", domain: "data", weight: 3, color: "#3FCF8E", icon: "supabase", mono: "SB" },

  { name: "AWS", domain: "cloud", weight: 4, color: "#FF9900", mono: "AWS" },
  { name: "Nginx & PM2", domain: "cloud", weight: 3, color: "#009639", icon: "nginx", mono: "NX" },
  { name: "Git & CI", domain: "cloud", weight: 5, color: "#F05032", icon: "git", mono: "GIT" },
  { name: "Core Web Vitals", domain: "cloud", weight: 4, color: "#F44B21", icon: "lighthouse", mono: "CWV" },
];
