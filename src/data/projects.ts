export interface ProjectLink {
  label: string;
  href: string;
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface CaseStudy {
  /** One-line framing shown under the title. */
  premise: string;
  role: string;
  sections: CaseStudySection[];
}

export interface Project {
  slug: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  /**
   * The one-line proof shown top-right on the card. A real metric where one
   * exists, a hard technical fact where none does — the slot is the same shape
   * either way, so cards stay uniform.
   *
   * Values collected 2026-08-19; sources are recorded in
   * docs/superpowers/specs/2026-08-19-portfolio-visual-overhaul-design.md.
   * Never invent a number here.
   */
  signal: { value: string; note?: string };
  contribution: string[];
  stack: string[];
  links: ProjectLink[];
  /** Card tint used for the active-card glow and the panel rule. */
  accent: string;
  /** Present only where there is genuine depth to write about. */
  caseStudy?: CaseStudy;
  /**
   * Fallback glyph, drawn inline. Used wherever the project has no real mark
   * of its own — agency work, and the two open-source repos.
   */
  icon: "storefront" | "device" | "cart" | "puzzle" | "code" | "branch";
  /**
   * The project's actual logo, vendored under /public/icons.
   *
   * Copied locally rather than hotlinked: the Chrome Web Store serves these
   * from rotating googleusercontent URLs, and sellflow.bio's icon path carries
   * a Vercel deployment hash that changes on every deploy. Both would break as
   * remote references. Takes precedence over `icon` when present.
   */
  iconSrc?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "sellflow",
    icon: "storefront",
    iconSrc: "/icons/sellflow.svg",
    title: "SellFlow",
    kind: "Founder",
    year: "2025",
    summary:
      "Free social commerce platform for creators — sell on Instagram, TikTok, and YouTube with a link in bio. No website, no payment gateway setup.",
    signal: { value: "185ms TTFB · live" },
    contribution: [
      "Founded and built the product end to end",
      "Storefront, checkout flow, and creator dashboard",
      "Full stack: schema, APIs, auth, frontend",
    ],
    stack: ["Next.js", "Node.js", "MongoDB"],
    links: [{ label: "sellflow.bio", href: "https://sellflow.bio" }],
    caseStudy: {
      premise:
        "Creators were losing sales to the gap between a social post and a checkout. SellFlow removes the website from that path entirely.",
      role: "Founder and sole engineer — schema through deploy.",
      sections: [
        {
          heading: "The constraint",
          body: "A creator with an audience on Instagram or TikTok has no natural place to sell. The usual answer is a full storefront and a payment gateway account, which is days of setup and a monthly bill before the first sale. The product had to work for someone who will not build a website and will not read documentation.",
        },
        {
          heading: "The decision",
          body: "Everything hangs off a single bio link. No theme editor, no product importer, no dashboard tour. Creating a product is one form; the storefront is generated from it. That constraint drove the schema: products, storefronts and orders are flat and denormalised, because the read path (a shopper opening a link) has to be fast and the write path is rare.",
        },
        {
          heading: "The tradeoff",
          body: "Denormalising means fan-out on updates and no rich querying across collections. Acceptable here — creators have tens of products, not thousands, and nobody filters a bio-link store. It would be the wrong call for a catalogue business.",
        },
        {
          heading: "Where it stands",
          body: "Live at sellflow.bio. Storefront, checkout flow and creator dashboard are all shipped; the platform is free to use.",
        },
      ],
    },
    accent: "#DB2777",
  },
  {
    slug: "yoombaa",
    icon: "device",
    iconSrc: "/icons/yoombaa.png",
    title: "Yoombaa",
    kind: "Product",
    year: "2024",
    summary:
      "Live MERN platform with a shipped React Native app in production on both stores. Owned schema design, the REST layer, auth, and the cross-platform build.",
    signal: { value: "3 surfaces · 1 API" },
    contribution: [
      "Schema design and REST API layer",
      "Auth flow, web frontend",
      "React Native app shipped to iOS and Android",
    ],
    stack: ["React", "React Native", "Express", "MongoDB"],
    links: [{ label: "yoombaa.com", href: "https://yoombaa.com" }],
    caseStudy: {
      premise:
        "One product, three surfaces: a web app, an iOS app and an Android app, all against one API.",
      role: "Schema design, REST layer, auth, web frontend, and the React Native build.",
      sections: [
        {
          heading: "The constraint",
          body: "The mobile apps and the web app had to stay in step without maintaining two backends or two sets of business rules — and the mobile build had to survive both store review processes.",
        },
        {
          heading: "The decision",
          body: "One Express API owns every rule; both clients are thin. Auth is shared, so a session issued to the web app is the same shape the mobile app receives. React Native rather than two native codebases, because the surface area is mostly forms, lists and media — not platform-specific interaction.",
        },
        {
          heading: "The tradeoff",
          body: "React Native costs you the last ten percent of native feel, and store review adds a release cycle that the web app does not have. In exchange one engineer can ship all three surfaces, which was the actual constraint.",
        },
        {
          heading: "Where it stands",
          body: "Live at yoombaa.com with the mobile app shipped to production on both stores.",
        },
      ],
    },
    accent: "#0EA5E9",
  },
  {
    slug: "shopify-agency",
    icon: "cart",
    title: "Storefronts for Allbirds, Everlane, Filson",
    kind: "Shopify Development",
    year: "2025–26",
    summary:
      "Theme customization and Storefront API integration delivered for international brands as part of an agency team — product and collection pages, GraphQL-driven rendering, Core Web Vitals work.",
    signal: { value: "3 brands · Storefront API" },
    contribution: [
      "Storefront API (GraphQL) data rendering",
      "Product and collection page builds",
      "Measured Core Web Vitals improvements",
    ],
    stack: ["Shopify Plus", "Liquid", "Storefront API"],
    links: [],
    accent: "#7AB55C",
  },
  {
    slug: "refineai",
    icon: "puzzle",
    iconSrc: "/icons/refineai.png",
    title: "RefineAI",
    kind: "Chrome Extension",
    year: "2025",
    summary:
      "Manifest V3 extension with AI writing features and a real business behind it: Supabase with row-level security, Lemon Squeezy billing, HMAC-verified webhooks, server-side quota enforcement.",
    signal: { value: "4.8★ Chrome Web Store" },
    contribution: [
      "Extension architecture on Manifest V3",
      "Supabase backend with RLS",
      "Billing, webhooks, and quota enforcement",
    ],
    stack: ["Supabase", "Lemon Squeezy", "Chrome APIs"],
    // Was a /search/ URL, which is a query rather than a listing and would have
    // rotted the moment anything else matched the term.
    links: [
      {
        label: "Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/refineai/flphmkincbiepfekijnkmlmkekijlghe",
      },
    ],
    accent: "#6366F1",
  },
  {
    slug: "devstock-gitaxis",
    icon: "code",
    title: "DevStock & GitAxis",
    kind: "VS Code Extensions",
    year: "2024",
    summary:
      "Two developer tools — DevStock published to the VS Code Marketplace, GitAxis open source on GitHub. Editor productivity and Git workflow, built and maintained in the open.",
    signal: { value: "79 installs · 5.0★" },
    contribution: [
      "DevStock published to the VS Code Marketplace",
      "GitAxis open source on GitHub",
    ],
    stack: ["TypeScript", "VS Code API"],
    // Two tools, two destinations. DevStock is the published one, so it points
    // at the Marketplace listing the install count comes from; GitAxis has no
    // listing and points at source.
    links: [
      {
        label: "DevStock · Marketplace",
        href: "https://marketplace.visualstudio.com/items?itemName=AvTe.devstock",
      },
      { label: "GitAxis · GitHub", href: "https://github.com/AvTe/GitAxis" },
    ],
    accent: "#38BDF8",
  },
  {
    slug: "cleancompress",
    icon: "puzzle",
    iconSrc: "/icons/cleancompress.png",
    title: "CleanCompress",
    kind: "Chrome Extension",
    year: "2025",
    summary:
      "Compresses and downloads every image on a page in one pass. Client-side only — nothing is uploaded to a server.",
    // 6 users and 2 ratings are too thin to lead with; a 5.0 average off two
    // votes reads as stronger than it is. Fact-led instead, per the signal rule.
    signal: { value: "Manifest V3 · client-side" },
    contribution: [
      "Published to the Chrome Web Store",
      "Bulk page-wide image capture and compression",
      "Runs entirely in the browser — no upload step",
    ],
    stack: ["JavaScript", "Chrome APIs"],
    links: [
      {
        label: "Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/cleancompress/kceemfaoiakccpjednchfbfggigheggk",
      },
    ],
    accent: "#0EA5E9",
  },
  {
    slug: "headless-wp",
    icon: "branch",
    title: "WordPress Custom Development",
    kind: "Open Source",
    year: "2024–26",
    // Kept to what the four linked repos actually demonstrate. Block themes and
    // client marketing sites are real WordPress experience but live in the
    // Experience section — claiming them here, where every link is a repo,
    // would send a reader looking for something they will not find.
    summary:
      "Custom WordPress and WooCommerce development — headless CMS behind a Next.js frontend, checkout and phone-auth plugins for WooCommerce, and editor tooling. Shipped open source.",
    signal: { value: "4 repos · open source" },
    contribution: [
      "Headless reference architecture on the WP REST API",
      "WooCommerce checkout and auth plugins in PHP",
      "Editor tooling plugin, maintained in the open",
    ],
    stack: ["Next.js", "WordPress", "WooCommerce", "PHP"],
    // PatchWatch-WordPress-Plugin was requested here too but is not public —
    // both the API and the page 404, and no public repo matches the name. Add
    // it once the repo is visible rather than shipping a dead link.
    links: [
      {
        label: "Headless + Next.js",
        href: "https://github.com/AvTe/Headless-WordPress-with-Nextjs",
      },
      {
        label: "Checkout Autocomplete",
        href: "https://github.com/AvTe/WooCommerce-Checkout-Autocomplete",
      },
      {
        label: "Firebase Phone OTP",
        href: "https://github.com/AvTe/Woocommerce-Firebase-Phone-OTP",
      },
      {
        label: "Shortcuts",
        href: "https://github.com/AvTe/wordpress-shortcuts-plugin",
      },
    ],
    accent: "#21759B",
  },
];
