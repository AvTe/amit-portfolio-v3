# Portfolio visual overhaul — design

Date: 2026-08-19
Status: approved
Scope: "B — visual overhaul". No new runtime dependencies.

## Problem

The site is well built and reads as a document rather than a product.

The engineering is sound: `reveal.tsx` renders visible and hides only what is
below the fold, so content survives a crawler or a JS failure; `site-menu.tsx`
manages focus and marks the closed panel `inert`; `globals.css` documents its
contrast ratios. None of that is the problem.

The problem is visual hierarchy. Five reference sites (octolane.com,
parallel.ai, appliedlabs.ai, playerzero.ai, firecrawl.dev) read as advanced
because they vary rhythm, scale and density aggressively. This site varies none
of them:

1. Stock photography on four of six project cards.
2. No dark mode — `globals.css` defines `:root` only.
3. Every section is the same shape: same padding, same label-left grid, same
   `--shell: 69rem`.
4. No midrange in the type scale: hero 80px, section title 17px, body 15px.
5. No numbers on project cards.
6. The hero gradient dead-ends into white and never returns.
7. The stack section is a pill dump.
8. `--shell: 69rem` centred on a 1920px viewport leaves ~400px dead each side.

## Decisions

### Imagery: none

All project imagery is removed rather than replaced. Stock photography costs
more credibility than any layout gains, and real screenshots are not available.
Cards carry their weight through type scale, the signal slot and density
instead — the approach parallel.ai uses.

Consequence: the type-scale fix stops being optional. Without images, scale is
the only hierarchy left.

### Signal slot: one shape, metric or fact

Every card has the same signal line in the same position with the same type
treatment. It takes a real metric where one exists and a hard technical fact
where one does not. A uniform slot with mixed content reads better than three
cards with metrics and three without.

Nothing is invented. Values collected 2026-08-19:

| Project            | Signal                      | Source                          |
| ------------------ | --------------------------- | ------------------------------- |
| SellFlow           | 185ms TTFB · live           | curl against sellflow.bio       |
| RefineAI           | 4.8★ Chrome Web Store       | Chrome Web Store listing        |
| DevStock & GitAxis | 79 installs · 5.0★          | Marketplace API, publisher AvTe |
| Shopify agency     | 3 brands · Storefront API   | fact                            |
| Yoombaa            | 3 surfaces · 1 API          | fact                            |
| Headless WordPress | Reference implementation    | fact                            |

GitHub stars are 0 across GitAxis, DevStock and RefineAI, and 1 on
Headless-WordPress-with-Nextjs. Not used.

## Accuracy corrections (independent of design)

Two factual problems found while collecting metrics. Both must be fixed.

1. `projects.ts` claims "Two published marketplace extensions" and "Two
   extensions published to the marketplace". The Marketplace API returns
   exactly one extension for publisher `AvTe`: `AvTe.devstock`. GitAxis has a
   repository (last push 2026-02-25) but no listing. Resolution: reword the
   copy to "one published to the Marketplace, one open source on GitHub".
   Publishing GitAxis is out of scope for this work.

2. yoombaa.com returns TTFB 2.40s. It is linked from a portfolio that claims
   Core Web Vitals expertise. Resolution: accepted knowingly for now. The
   Yoombaa card carries the factual signal `3 surfaces · 1 API` and makes no
   performance claim; no copy elsewhere attributes a performance win to
   Yoombaa. Fixing the host is separate work.

## Design

### 1. Tokens and theme (`globals.css`)

Type scale gains a midrange:

```
--step-display : clamp(2.75rem, 7vw, 5.5rem)     hero only
--step-2       : clamp(1.75rem, 3.5vw, 2.75rem)  section titles (was 1.0625rem)
--step-1       : 1.25rem                         card titles
--step-0       : 1rem                            body           (was 0.9375rem)
--step--1      : 0.875rem                        secondary
--step--2      : 0.6875rem mono                  labels
```

Section titles moving from 17px to 44px is the single largest visual change.

Dark mode: `@media (prefers-color-scheme: dark)` for the system default, plus a
`[data-theme]` attribute override so an explicit toggle wins in both
directions. A blocking inline script in `layout.tsx` reads `localStorage`
before first paint to avoid a flash. `viewport.colorScheme` becomes
`"light dark"` and `themeColor` gains a dark entry.

One accent is preserved. Dark values: `--paper: #0a0b0f`, `--ink: #e8e9ed`,
accent lifts to `#7c86ff` because `#2c35c6` fails contrast on a dark ground.
Every dark token carries a measured ratio comment, matching the existing light
convention.

### 2. Page rhythm

> **Superseded — see Revisions, item 1.** This section proposed three content
> widths. That was wrong and was reverted to a single width during
> implementation. Kept here so the reasoning that failed is on the record.

Three widths replace the single `--shell`:

- `--shell-wide: 84rem` — work grid, stack
- `--shell: 69rem` — default
- `--shell-read: 52rem` — case study prose

Two padding scales, `--pad-lg` (work, contact) and `--pad-md` (stack,
experience), so sections stop being uniform height. `Section` takes `width` and
`pad` props; the label-left grid is unchanged.

### 3. Work section

Card anatomy, no image:

```
01 ---------------------------------  4.8★ Chrome Web Store
RefineAI
Manifest V3 · Supabase RLS · HMAC-verified webhooks
Supabase   Lemon Squeezy   Chrome APIs              Read →
```

- The left accent hairline uses `project.accent`, a field that already exists
  in `projects.ts` and has been dead since the carousel was removed.
- Signal slot sits top right, mono, one line, on every card.
- Two-column grid is kept. Cards get a border and a hover lift; the image zoom
  and `.work__thumb` are removed along with the `next/image` import.

### 4. Stack section

Each domain becomes a row: index `01`–`05`, domain name at `--step-1`, and the
`blurb` from `stack.ts` promoted to the visual lead. Those blurbs are the best
copy on the page and are currently set at 14px grey. Tags demote to a mono
strip below. Logos stay at 13px.

### 5. Hero continuity

The hero is the strongest element and its structure does not change. Two
additions:

- A `--glow` token derived from the hero gradient tints section top borders at
  4% and returns at full strength behind the footer, so the page reads as one
  object rather than a gradient followed by a document.
- The grain SVG moves to a shared class so the footer reuses it.

### 6. Case study page

`.case__hero` and its image are removed. A signal bar replaces it directly
under the premise: role, year, signal and stack, mono, hairline-separated.
Prose narrows to `--shell-read: 52rem`; it is currently 44rem inside a 69rem
shell, which leaves it visually stranded.

### 7. Data

- `signal: { value: string; note?: string }` added to the `Project` interface.
- `image` removed from `Project`; the six files under `public/images/work/` are
  deleted.
- DevStock/GitAxis copy corrected per the accuracy section above.

## Out of scope

Command palette, view transitions, scroll-driven motion, testimonials, FAQ and
trust badges. All are either scope C or need material that does not exist.
`reveal.tsx` is left exactly as it is — it is correct.

## Verification

- `npm run build` and `npm run lint` clean.
- Contrast measured and documented for every dark token, matching the light
  convention already in `globals.css`.
- Keyboard pass: menu focus trap, skip link, and focus-visible rings in both
  themes.
- `prefers-reduced-motion` still disables the reveal transform.
- No flash of incorrect theme on hard reload in either system setting.
- Confirm in-browser whether the duplicated contact paragraph seen in the
  full-page screenshot is a capture artifact; `contact-section.tsx` renders it
  once. **Resolved 2026-08-19:** artifact. Visible markup contains it once; the
  second copy was Next's serialized RSC payload inside a `<script>` tag.

## Revisions

Changes made after the first build was reviewed on screen. Each corrects
something this document originally got wrong.

### 1. One content width, not three

Section 2 proposed `--shell-wide` / `--shell` / `--shell-read` varying per
section. On screen this did not read as rhythm — it read as broken alignment,
because the left edge of every heading moved as you scrolled. Stack sat 44px
left of Experience.

The page now uses **one width, `--shell: 84rem`, everywhere**: `.shell`,
`.hero__inner`, `.brands`, `.footer`, and `.site-controls` all resolve to the
same `max-width` + `margin-inline: auto` + `padding-inline: var(--gutter)`.
`--shell-read: 52rem` survives only for `/work/[slug]`, a separate route with no
alignment relationship to the home page. The `width` prop on `Section` and the
`.shell--wide` / `.shell--read` classes are deleted.

Rhythm comes from vertical padding (`--pad-lg` vs `--pad-md`) and from body
density instead. The vertical spine never moves.

Two elements were off the spine and had to be brought onto it:

- `.hero__inner` was full-bleed with its own `4rem` padding, so the largest
  text on the page aligned with nothing.
- `.site-controls` was pinned to the viewport's right edge, landing ~340px
  outside the content's right margin at 1920. It is now a full-width fixed row
  on the shell with `justify-content: flex-end`, and `pointer-events: none`
  with `auto` on its children so the invisible bar does not swallow hero
  clicks. `.menu-panel`'s children were moved onto the spine for the same
  reason.

### 2. Section label is an eyebrow, not a left column

The `--label-col: 8rem` grid pushed each section title ~160px right of where
its own content started. The label now sits directly above the title.
`--label-col` remains in use by `.case__section` only.

### 3. `--surface` was a no-op

`--surface` was `#ffffff`, identical to `--paper`, so `background:
var(--surface)` on the project cards did nothing and the grid read as loose
text. Now `#f7f8fa` light / `#14161d` dark, with `--line` strengthened to
`#e0e1e6`.

Consequence: `--ink-3` at `#767980` measured **4.1:1** on the new ground and
failed AA. Darkened to `#6e7178` (4.6:1). All ratio comments are now measured
against `--surface`, the card ground and therefore the worst case, in both
themes.

### 4. Padding was roughly double what it should have been

`--pad-lg` at `7.5rem` put ~240px of void at every boundary on a 1920 viewport.
With imagery removed, that read as empty rather than spacious — the reference
sites are imageless *and dense*. Now `clamp(2.75rem, 5vw, 4.25rem)` and
`--pad-md` `clamp(2rem, 3.5vw, 3rem)`, with card and stack-row internals
tightened to match. Card summaries are clamped to three lines so one long entry
cannot leave the rest ragged.

### 5. The theme script caused a hydration mismatch

Writing `data-theme` onto `<html>` before hydration meant React found an
attribute the server never rendered, surfacing as an error in the dev overlay.
Fixed with `suppressHydrationWarning` on `<html>` — it applies one level deep,
so only that element's attributes are exempt. Verified it is not emitted as a
real DOM attribute.
