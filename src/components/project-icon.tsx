import type { Project } from "@/data/projects";

/**
 * Card glyphs, drawn inline.
 *
 * Site favicons were the obvious alternative and do not survive contact with
 * reality: sellflow.bio serves no /favicon.ico and its declared icon carries a
 * Vercel deployment hash that changes on every deploy, so a vendored copy goes
 * stale and a hotlinked one breaks. A third-party favicon service would leak
 * every visitor's IP to it. These are local, consistent in weight, and inherit
 * currentColor so they theme for free.
 *
 * This finally gives `Project.icon` a consumer — it had been dead since the
 * carousel that used it was removed.
 */
const PATHS: Record<Project["icon"], React.ReactNode> = {
  storefront: (
    <>
      <path d="M3 9.5 4.6 4h14.8L21 9.5" />
      <path d="M4.6 9.5V20h14.8V9.5" />
      <path d="M3 9.5h18" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  device: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17.5" cy="19.5" r="1.3" />
      <path d="M2.5 3h2.8l2.5 12h10.4L21 6.5H6.2" />
    </>
  ),
  puzzle: (
    <path d="M9.6 4.2a2.2 2.2 0 0 1 4.4 0V5.4h3a1 1 0 0 1 1 1v3h1.2a2.2 2.2 0 0 1 0 4.4H18v3a1 1 0 0 1-1 1h-3v-1.2a2.2 2.2 0 0 0-4.4 0V19H6.6a1 1 0 0 1-1-1v-3H4.4a2.2 2.2 0 0 1 0-4.4h1.2v-3a1 1 0 0 1 1-1h3V4.2Z" />
  ),
  code: <path d="m8.5 7.5-5 4.5 5 4.5M15.5 7.5l5 4.5-5 4.5" />,
  branch: (
    <>
      <circle cx="6.5" cy="5.5" r="2.2" />
      <circle cx="6.5" cy="18.5" r="2.2" />
      <circle cx="17.5" cy="8.5" r="2.2" />
      <path d="M6.5 7.7v8.6" />
      <path d="M17.5 10.7c0 3.6-3.4 3.7-8.9 4.6" />
    </>
  ),
};

export function ProjectIcon({ name }: { name: Project["icon"] }) {
  return (
    <svg
      className="work__icon"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
