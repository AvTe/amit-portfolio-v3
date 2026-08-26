# Amit Vishwakarma — Portfolio

Personal portfolio. Next.js App Router, fully static, no runtime dependencies
beyond React and Next itself.

**Live:** [amitspace.cloud](https://amitspace.cloud)

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

## What it is

A single page — hero, work, stack, experience, contact — plus a case-study route
for the projects with genuine depth to write about. Everything renders at build
time; there is no database, no CMS and no API.

Project cards carry no photography. Stock imagery costs more credibility than
layout gains, and real product screenshots were not available, so each card
earns its weight through type scale, density and a uniform "signal" slot that
holds a measured number where one exists and a hard technical fact where none
does. Every value in that slot is sourced — see
`docs/superpowers/specs/` — and none of them are invented.

## Structure

```
src/
  app/                  routes, metadata, sitemap, robots, OG image
    work/[slug]/        case studies, statically generated
  components/           hero, sections, and the four client components
  data/                 projects, stack, experience — all content lives here
  lib/                  site config, fonts
public/
  icons/                project logos, vendored locally
  logos/                stack marks
docs/superpowers/       design spec and implementation plan
```

Content is data, not markup. Adding a project means one object in
`src/data/projects.ts`; the card, the sitemap entry and — if it has a
`caseStudy` — the route all follow.

## Notes

**Themes.** Light and dark are both first-class. Every colour is a token, and
the theme resolves before first paint via a blocking script in the root layout,
so there is no flash. Contrast ratios are measured and recorded in comments
beside each token, against the card ground rather than the page ground because
that is the worst case.

**Client JavaScript** is limited to four components: the theme toggle, the menu,
the mobile project carousel, and the contact heading's pointer tracking.
Everything else is server-rendered. Scroll reveals render *visible* and hide only
what is below the fold, so content survives a crawler or a JS failure.

**No test framework.** Verification is `tsc --noEmit`, `eslint`, `next build`,
and a manual pass in both themes. Adding one is on the list.

## Deploying

`NEXT_PUBLIC_SITE_URL` sets the origin used by canonical links, Open Graph tags
and `sitemap.xml`. See `.env.example` — a production build falls back to the
real domain, so the variable is only needed to override it.
