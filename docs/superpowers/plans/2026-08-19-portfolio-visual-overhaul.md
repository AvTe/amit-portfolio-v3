# Portfolio Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's visual hierarchy — dark mode, a real type scale, varied section rhythm, and imageless metric-led project cards — so the page reads as a product rather than a CV.

**Architecture:** All changes are presentational and data-shape only. `globals.css` gains a token layer (type steps, dark palette, three shell widths, two padding scales); `Section` gains `width`/`pad` props; the work and stack sections are rebuilt around a uniform "signal" slot; all project imagery is deleted. No routing, no data fetching, and no new dependencies change.

**Tech Stack:** Next.js 16.3.0 (App Router), React 19.2.8, Tailwind CSS v4 (`@tailwindcss/postcss`), TypeScript 5, `next/font/google` (DM Sans + JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-08-19-portfolio-visual-overhaul-design.md`

## Global Constraints

- **No new dependencies.** `package.json` must be byte-identical at the end of this plan.
- **No test framework exists in this repo.** `package.json` scripts are `dev`, `build`, `start`, `lint` only. Every task's verification step is therefore `npx tsc --noEmit` + `npm run lint` + (where markup changed) `npm run build`, plus the named manual browser checks written into that task. Do not add vitest, jest, or playwright — that would violate the no-new-dependencies constraint.
- **Commits require explicit user approval in this repo.** Each task ends with a prepared commit command. Run it only when the user has said to commit; otherwise leave the work staged-but-uncommitted and report that.
- **One accent colour only.** Blue. Light `#2c35c6`, dark `#7c86ff`. Nothing else tints anything.
- **Every dark colour token carries a measured contrast ratio comment**, matching the convention already used in the light block of `globals.css`.
- **No invented metrics.** The six signal strings in Task 3 are the only permitted values. They were collected 2026-08-19 and are recorded with their sources in the spec.
- **`reveal.tsx` is not modified by any task.** Its progressive-enhancement behaviour is correct as written.
- **AGENTS.md rule:** this is Next.js 16; consult `node_modules/next/dist/docs/` before using any Next API not already present in the codebase.
- **Browser targets** are pinned in `package.json#browserslist` to Chrome/Edge/Firefox ≥ 111 and Safari ≥ 16.4. `:has()`, `inert`, and CSS nesting are all safe; do not add fallbacks for them.

---

### Task 1: Dark mode foundation

Establishes the dark palette, the pre-paint theme script, and the toggle control. After this task the site is fully usable in both themes with no flash on reload; nothing else about the layout changes yet.

**Files:**
- Modify: `src/app/globals.css` — `:root` block (currently lines 24–47), add dark blocks after it
- Modify: `src/app/layout.tsx` — `viewport` export (lines 40–43), `<body>` children
- Modify: `src/components/site-menu.tsx` — wrap the nav and hamburger in `.site-controls`, render the toggle between them
- Create: `src/components/theme-toggle.tsx`
- Test: no test framework — verification is typecheck, lint, build, and the named browser checks in Step 6

**Interfaces:**
- Consumes: nothing from earlier tasks (this is the first).
- Produces:
  - CSS custom properties available site-wide in both themes: `--paper`, `--surface`, `--ink`, `--ink-2`, `--ink-3`, `--line`, `--line-strong`, `--accent`, `--accent-soft`.
  - `<html>` carries `data-theme="light" | "dark"` when the visitor has made an explicit choice, and no attribute when following the system.
  - `export function ThemeToggle(): JSX.Element` from `src/components/theme-toggle.tsx` — no props.

- [ ] **Step 1: Add the dark palette to `globals.css`**

Insert immediately after the closing brace of the existing `:root` block. Do not modify the light values.

```css
/* Dark palette. Same roles, same single accent. Ratios measured against
   --paper (#0a0b0f), matching the convention used for the light block. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #0a0b0f;
    --surface: #101218;

    --ink: #e8e9ed; /* 16.2:1 - headlines and body */
    --ink-2: #9fa2ad; /* 7.7:1  - secondary copy */
    --ink-3: #7d808a; /* 5.0:1  - meta labels, smallest text */

    --line: #1e2029;
    --line-strong: #2b2e3a;

    /* #2c35c6 is 1.9:1 on this ground and fails. Lifted. */
    --accent: #7c86ff; /* 6.3:1 */
    --accent-soft: #191d3d;
  }
}

/* Explicit choice wins over the system setting in both directions. */
:root[data-theme="dark"] {
  --paper: #0a0b0f;
  --surface: #101218;

  --ink: #e8e9ed; /* 16.2:1 */
  --ink-2: #9fa2ad; /* 7.7:1 */
  --ink-3: #7d808a; /* 5.0:1 */

  --line: #1e2029;
  --line-strong: #2b2e3a;

  --accent: #7c86ff; /* 6.3:1 */
  --accent-soft: #191d3d;
}
```

- [ ] **Step 2: Add toggle styling to `globals.css`**

Append to the end of the file.

```css
/* Fixed control cluster ----------------------------------------------------
 * The nav links, the theme toggle and the hamburger were three independently
 * fixed elements each carrying its own offset, which meant the toggle's
 * position depended on the rendered width of the nav. One flex row instead —
 * nothing has to guess where its neighbour ends.
 */

.site-controls {
  position: fixed;
  top: clamp(1rem, 2.2vw, 1.75rem);
  right: clamp(1rem, 2.2vw, 1.75rem);
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  color: var(--accent);
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.9);
}

:root[data-theme="dark"] .theme-toggle {
  background: rgba(255, 255, 255, 0.08);
}

:root[data-theme="dark"] .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.16);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .theme-toggle {
    background: rgba(255, 255, 255, 0.08);
  }

  :root:not([data-theme="light"]) .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.16);
  }
}
```

Then **remove** `position`, `top`, `right` and `z-index` from the existing
`.site-nav` and `.menu-toggle` rules — the wrapper owns placement now. Both
keep every other declaration, including the `@media (min-width: 56rem)` block
that shows the nav and hides the hamburger.

- [ ] **Step 3: Create `src/components/theme-toggle.tsx`**

> **Amended during execution (2026-08-19).** The `useState` + `useEffect`
> version below is rejected by React 19's `react-hooks/set-state-in-effect`
> lint rule, which is correct: the theme is external state (a DOM attribute
> plus a media query), not derived state, so mirroring it into React guarantees
> a render where the two disagree. The shipped implementation uses
> `useSyncExternalStore` with a `MutationObserver` on `data-theme` and a
> `matchMedia` listener, and `getServerSnapshot` returning `null` so hydration
> markup matches. See the file for the final code; the sketch below is kept
> only to explain why it was not used.

```tsx
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Theme toggle.
 *
 * The stored preference is applied by the blocking script in `layout.tsx`
 * before first paint, so this component never causes a flash. It reads the
 * attribute that script set rather than re-deriving the theme, which keeps a
 * single source of truth.
 *
 * Renders with a neutral label on the server and syncs on mount, so the markup
 * is identical on both sides and hydration does not warn.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const explicit = document.documentElement.dataset.theme as Theme | undefined;
    if (explicit) {
      setTheme(explicit);
      return;
    }
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or storage disabled — the choice just does not persist.
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      // Until mount we do not know the theme, so the control is described
      // generically rather than with a label that might be wrong.
      aria-label={theme ? `Switch to ${isDark ? "light" : "dark"} theme` : "Switch theme"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        {isDark ? (
          <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-13.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM3.5 12a1 1 0 0 1 1-1H6a1 1 0 1 1 0 2H4.5a1 1 0 0 1-1-1Zm14.5 0a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H19a1 1 0 0 1-1-1ZM5.9 5.9a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1-1.4 1.4L5.9 7.3a1 1 0 0 1 0-1.4Zm9.7 9.7a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1-1.4 1.4l-1.1-1.1a1 1 0 0 1 0-1.4Zm2.5-9.7a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0ZM8.4 15.6a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0Z" />
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        )}
      </svg>
    </button>
  );
}
```

- [ ] **Step 4: Wire the theme script into `layout.tsx`**

Replace the `viewport` export:

```tsx
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
  ],
  colorScheme: "light dark",
};
```

Then make the script the **first child of `<body>`**, before the skip link.
`layout.tsx` needs no other change — the toggle is mounted by `SiteMenu` in
Step 5, so the fixed control cluster stays in one component.

```tsx
      <body>
        {/* Runs before the rest of the body parses, so a stored preference is
            applied before first paint. A plain inline script rather than
            next/script: beforeInteractive still executes after the initial
            markup streams, which is too late to prevent a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteMenu />
```

- [ ] **Step 5: Mount the toggle in the control cluster (`site-menu.tsx`)**

Add the import:

```tsx
import { ThemeToggle } from "./theme-toggle";
```

Wrap the existing `<nav className="site-nav">` and `<button className="menu-toggle">`
in a single flex row, with the toggle between them. The nav and button markup
are otherwise unchanged — only the wrapper and the toggle are new.

```tsx
      <div className="site-controls">
        {/* Four sections is few enough to show outright on desktop; the
            hamburger takes over below 56rem. */}
        <nav className="site-nav" aria-label="Sections">
          {SECTIONS.map((section) => (
            <Link key={section.id} href={`#${section.id}`}>
              {section.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`menu-toggle${open ? " menu-toggle--open" : ""}`}
        >
          <span className="menu-toggle__bar" aria-hidden="true" />
          <span className="menu-toggle__bar" aria-hidden="true" />
        </button>
      </div>
```

The full-screen `.menu-panel` stays a sibling of this wrapper, not a child —
it is `position: fixed; inset: 0` and must not inherit the cluster's placement.

- [ ] **Step 6: Verify it typechecks, lints, and builds**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all three exit 0. If `tsc` reports `Property 'theme' does not exist on type 'DOMStringMap'`, the `dataset.theme` access is fine — that error means the file is missing `"use client"`.

- [ ] **Step 7: Manual browser checks**

Run `npm run dev`, then confirm each:

1. OS set to light, hard reload → page is light, no dark flash.
2. OS set to dark, hard reload → page is dark, no light flash.
3. Click the toggle → theme flips; reload → the chosen theme persists.
4. With an explicit choice stored, change the OS setting → the explicit choice still wins.
5. Tab to the toggle → a visible focus ring appears in both themes.
6. Body background is a solid token colour in dark mode, not white showing through.
7. Nav links, toggle and hamburger sit in one row top-right without overlapping, at 375px and at 1280px.

- [ ] **Step 8: Commit (only with user approval — see Global Constraints)**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/theme-toggle.tsx src/components/site-menu.tsx
git commit -m "feat: add dark mode with pre-paint theme resolution"
```

---

### Task 2: Type scale and section rhythm

Adds the missing midrange to the type scale and gives `Section` three widths and two padding scales. This is the change that moves section titles from 17px to 44px.

**Files:**
- Modify: `src/app/globals.css` — `:root` (add steps and widths), `.section*`, `.shell`, `body`
- Modify: `src/components/section.tsx` — add `width` and `pad` props
- Test: no test framework — verification is Step 5

**Interfaces:**
- Consumes: the token block from Task 1 (adds to the same `:root`, does not alter the dark blocks).
- Produces:
  - Type step tokens `--step-display`, `--step-2`, `--step-1`, `--step-0`, `--step--1`, `--step--2`.
  - Width tokens `--shell-wide`, `--shell`, `--shell-read`, and padding tokens `--pad-lg`, `--pad-md`.
  - `Section` accepts two new optional props: `width?: "wide" | "default" | "read"` (default `"default"`) and `pad?: "lg" | "md"` (default `"md"`). Existing call sites keep working unchanged.

- [ ] **Step 1: Add scale and width tokens to `:root` in `globals.css`**

Add inside the existing `:root` block, after the `--shell` declaration. Replace the current single `--shell` line with the three widths.

```css
  /* Type scale. The old scale had no midrange — hero 80px, section title 17px,
     body 15px — so everything below the hero read at one level of importance. */
  --step-display: clamp(2.75rem, 7vw, 5.5rem);
  --step-2: clamp(1.75rem, 3.5vw, 2.75rem);
  --step-1: 1.25rem;
  --step-0: 1rem;
  --step--1: 0.875rem;
  --step--2: 0.6875rem;

  /* Three content widths instead of one. 69rem centred on a 1920 viewport
     left ~400px dead on each side. */
  --shell-wide: 84rem;
  --shell: 69rem;
  --shell-read: 52rem;

  --pad-lg: clamp(4rem, 9vw, 7.5rem);
  --pad-md: clamp(2.75rem, 5.5vw, 4.5rem);
```

- [ ] **Step 2: Apply the scale in `globals.css`**

Make these four edits. Each replaces an existing declaration.

```css
/* body — was font-size: 0.9375rem */
body {
  font-size: var(--step-0);
}

/* .section — was padding-block: clamp(2.5rem, 5vw, 4rem) */
.section {
  padding-block: var(--pad-md);
  border-top: 1px solid var(--line);
}

/* .section__title — was font-size: 1.0625rem */
.section__title {
  font-size: var(--step-2);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-wrap: balance;
  color: var(--ink);
}

/* .section__intro — gains size now that the title is large enough to lead */
.section__intro {
  margin-top: 0.75rem;
  font-size: var(--step--1);
  color: var(--ink-2);
  max-width: 44rem;
}

/* .hero__title — was clamp(2rem, 6.2vw, 5rem), now the display step so the
   hero and the section titles come from one scale rather than two. */
.hero__title {
  font-size: var(--step-display);
}
```

Then add the width and padding modifier classes:

```css
.section--pad-lg {
  padding-block: var(--pad-lg);
}

.shell--wide {
  max-width: var(--shell-wide);
}

.shell--read {
  max-width: var(--shell-read);
}
```

- [ ] **Step 3: Add the props to `section.tsx`**

Replace the whole file:

```tsx
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

interface SectionProps {
  id: string;
  label: string;
  title: string;
  intro?: string;
  /** Content width. Wide for grids, read for prose. Defaults to the middle. */
  width?: "wide" | "default" | "read";
  /** Vertical breathing room. `lg` for the sections that should dominate. */
  pad?: "lg" | "md";
  children: ReactNode;
}

const SHELL = {
  wide: "shell shell--wide",
  default: "shell",
  read: "shell shell--read",
} as const;

/**
 * CV section frame: a small caps label in a fixed left column, content on the
 * right.
 *
 * Width and padding vary per section on purpose. Every section being the same
 * shape is what made the page read as a document rather than a product.
 */
export function Section({
  id,
  label,
  title,
  intro,
  width = "default",
  pad = "md",
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section scroll-mt-6${pad === "lg" ? " section--pad-lg" : ""}`}
    >
      <div className={SHELL[width]}>
        <Reveal>
          <div className="section__grid">
            <p className="label md:pt-1">{label}</p>
            <div>
              <h2 id={headingId} className="section__title">
                {title}
              </h2>
              {intro ? <p className="section__intro">{intro}</p> : null}
            </div>
          </div>
        </Reveal>

        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Assign widths and padding at the call sites**

Four one-line edits:

- `src/components/sections/work-section.tsx` — add `width="wide"` and `pad="lg"` to `<Section>`
- `src/components/sections/stack-section.tsx` — add `width="wide"`
- `src/components/sections/experience-section.tsx` — leave as-is (default/md)
- `src/components/sections/contact-section.tsx` — add `pad="lg"`

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all exit 0.

Then `npm run dev` and confirm:
1. Section headings are visibly large — roughly 2.5× their previous size at desktop width.
2. Work and stack sections are wider than experience.
3. Work and contact have noticeably more vertical space than stack and experience.
4. At 375px width nothing overflows horizontally and no heading clips.
5. Both themes still correct.

- [ ] **Step 6: Commit (only with user approval)**

```bash
git add src/app/globals.css src/components/section.tsx src/components/sections/
git commit -m "feat: add type scale midrange and per-section width/padding"
```

---

### Task 3: Add the signal field and correct the extension copy

Additive data change. Nothing renders it yet, so the build stays green and this task can be reviewed purely on whether the values are accurate.

**Files:**
- Modify: `src/data/projects.ts` — `Project` interface, all six entries
- Test: no test framework — verification is Step 3

**Interfaces:**
- Consumes: nothing.
- Produces: `Project.signal: { value: string; note?: string }` — required on every project. `value` is the short mono string rendered top-right on a card; `note` is currently unused and reserved for a title attribute.

- [ ] **Step 1: Add the field to the interface**

In the `Project` interface, add after `summary`:

```ts
  /**
   * The one-line proof shown top-right on the card. A real metric where one
   * exists, a hard technical fact where none does — the slot is the same shape
   * either way, so cards stay uniform. Values collected 2026-08-19; sources are
   * recorded in docs/superpowers/specs/2026-08-19-portfolio-visual-overhaul-design.md.
   * Never invent a number here.
   */
  signal: { value: string; note?: string };
```

- [ ] **Step 2: Add the value to each of the six entries**

Add a `signal` property to each project object. These are the only permitted values:

```ts
// slug: "sellflow"
signal: { value: "185ms TTFB · live" },

// slug: "yoombaa"
signal: { value: "3 surfaces · 1 API" },

// slug: "shopify-agency"
signal: { value: "3 brands · Storefront API" },

// slug: "refineai"
signal: { value: "4.8★ Chrome Web Store" },

// slug: "devstock-gitaxis"
signal: { value: "79 installs · 5.0★" },

// slug: "headless-wp"
signal: { value: "Reference implementation" },
```

In the same pass, correct the DevStock/GitAxis copy. The Marketplace has one extension under publisher `AvTe`, not two. Replace the `summary` and `contribution` on the `devstock-gitaxis` entry:

```ts
    summary:
      "Two developer tools — DevStock published to the VS Code Marketplace, GitAxis open source on GitHub. Editor productivity and Git workflow, built and maintained in the open.",
    contribution: [
      "DevStock published to the VS Code Marketplace",
      "GitAxis open source on GitHub",
    ],
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm run lint
```

Expected: exit 0. If `tsc` reports a missing `signal` on any object literal, one of the six entries was skipped — add it rather than making the field optional.

Then confirm by eye that no entry claims two published Marketplace extensions.

- [ ] **Step 4: Commit (only with user approval)**

```bash
git add src/data/projects.ts
git commit -m "feat: add project signal values; correct extension publication claim"
```

---

### Task 4: Rebuild the work section as imageless cards

**Files:**
- Modify: `src/components/sections/work-section.tsx` — full rewrite
- Modify: `src/app/globals.css` — replace the `.work__*` block
- Test: no test framework — verification is Step 4

**Interfaces:**
- Consumes: `Project.signal` (Task 3), `Project.accent` (already in the data and currently unused), the type steps and `shell--wide` (Task 2).
- Produces: no new exports. `WorkSection` keeps its current signature.

- [ ] **Step 1: Replace the `.work__*` CSS**

Delete `.work__thumb`, `.work__thumb img`, and `.work__card:hover .work__thumb img` entirely. Replace the rest of the work block with:

```css
/* Work -------------------------------------------------------------------- */

.work__grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 48rem) {
  .work__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.work__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  height: 100%;
  padding: 1.5rem 1.5rem 1.35rem;
  border: 1px solid var(--line);
  border-radius: 0.875rem;
  background: var(--surface);
  overflow: hidden;
  transition:
    border-color 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* The accent hairline. `accent` has been in the project data since the old
   carousel and has had no consumer since it was removed. */
.work__card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: var(--card-accent, var(--accent));
  opacity: 0.55;
  transition: opacity 0.28s ease;
}

.work__card:hover {
  border-color: var(--line-strong);
  transform: translateY(-2px);
}

.work__card:hover::before {
  opacity: 1;
}

.work__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.work__index {
  font-family: var(--font-code), ui-monospace, monospace;
  font-size: var(--step--2);
  letter-spacing: 0.12em;
  color: var(--ink-3);
}

/* The signal slot. Same position, same treatment, every card — whether it
   holds a measured number or a technical fact. */
.work__signal {
  font-family: var(--font-code), ui-monospace, monospace;
  font-size: var(--step--2);
  letter-spacing: 0.02em;
  color: var(--accent);
  text-align: right;
  white-space: nowrap;
}

.work__name {
  font-size: var(--step-1);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--ink);
}

.work__name a::after {
  content: "";
  position: absolute;
  inset: 0;
}

.work__summary {
  font-size: var(--step--1);
  color: var(--ink-2);
}

.work__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
}

.work__more {
  font-family: var(--font-code), ui-monospace, monospace;
  font-size: var(--step--2);
  letter-spacing: 0.05em;
  color: var(--accent);
  white-space: nowrap;
}
```

Leave `.work__badge` in place — it is still used for the Live pill.

- [ ] **Step 2: Rewrite `work-section.tsx`**

```tsx
import { Section } from "../section";
import { Reveal } from "../reveal";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";

// Agency work for recognisable brands leads — it is the fastest credibility
// on the page.
const ORDERED = [...PROJECTS].sort(
  (a, b) =>
    (b.slug === "shopify-agency" ? 1 : 0) - (a.slug === "shopify-agency" ? 1 : 0),
);

/**
 * Project cards, no imagery.
 *
 * Stock photography cost more credibility than the layout gained, and real
 * screenshots were not available, so the cards carry their weight through
 * type scale, density, and a uniform signal slot instead.
 */
export function WorkSection() {
  return (
    <Section
      id="work"
      label="Projects"
      title="Selected work"
      intro="A founder product, a live MERN platform, agency storefronts for international brands, and published browser and editor extensions."
      width="wide"
      pad="lg"
    >
      <ul className="work__grid">
        {ORDERED.map((project, index) => {
          const href = project.links[0]?.href;
          return (
            <li key={project.slug}>
              <Reveal delay={index * 45}>
                <article
                  className="work__card"
                  style={{ "--card-accent": project.accent } as React.CSSProperties}
                >
                  <div className="work__top">
                    <span className="work__index">
                      {String(index + 1).padStart(2, "0")} · {project.kind} · {project.year}
                    </span>
                    <span className="work__signal">{project.signal.value}</span>
                  </div>

                  <h3 className="work__name">
                    {project.caseStudy ? (
                      <Link href={`/work/${project.slug}`}>{project.title}</Link>
                    ) : href ? (
                      <a href={href} target="_blank" rel="noreferrer">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>

                  <p className="work__summary">{project.summary}</p>

                  <div className="work__foot">
                    <ul className="tags">
                      {project.stack.map((tech) => (
                        <li key={tech} className="tag">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    {project.caseStudy ? (
                      <span className="work__more">Read →</span>
                    ) : href ? (
                      <span className="work__badge">Live</span>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: exit 0. `next/image` is no longer imported here; if lint reports it as unused, the import was not removed.

- [ ] **Step 4: Manual browser checks**

1. Six cards, no images, two columns at desktop and one at 375px.
2. Every card shows a signal top-right; none is empty.
3. Each card has a coloured left hairline, and the colours differ per project.
4. Clicking anywhere on a card with a case study navigates to it.
5. Cards in a row are equal height and the tag row sits flush at the bottom of each.
6. Both themes: hairlines and signal text are legible, cards are distinguishable from the page ground.

- [ ] **Step 5: Commit (only with user approval)**

```bash
git add src/app/globals.css src/components/sections/work-section.tsx
git commit -m "feat: rebuild work cards imageless with uniform signal slot"
```

---

### Task 5: Rebuild the case study page

**Files:**
- Modify: `src/app/work/[slug]/page.tsx` — remove the image block, add the signal bar
- Modify: `src/app/globals.css` — `.case*` block
- Test: no test framework — verification is Step 4

**Interfaces:**
- Consumes: `Project.signal` (Task 3), `--shell-read` (Task 2).
- Produces: no new exports.

- [ ] **Step 1: Update the `.case*` CSS**

Delete `.case__hero` and `.case__hero img`. Change `.case` to use the reading width, and add the bar:

```css
.case {
  max-width: var(--shell-read);
  margin-inline: auto;
  padding: clamp(2.5rem, 6vw, 5rem) var(--gutter);
}

.case__title {
  margin-top: 1.5rem;
  font-size: var(--step-2);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;
  text-wrap: balance;
}

.case__premise {
  margin-top: 0.9rem;
  font-size: var(--step-1);
  line-height: 1.45;
  color: var(--ink-2);
}

/* Replaces the hero image. Same information density, none of the stock. */
.case__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin-top: 2rem;
  padding: 0.9rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  font-family: var(--font-code), ui-monospace, monospace;
  font-size: var(--step--2);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.case__bar strong {
  font-weight: 500;
  color: var(--accent);
}
```

Also change `.case__section` and `.case__section p` — the `max-width: 44rem` on the paragraph is now redundant inside a 52rem shell:

```css
.case__section {
  margin-top: 2.5rem;
  display: grid;
  gap: 0.75rem 2rem;
}

@media (min-width: 48rem) {
  .case__section {
    grid-template-columns: var(--label-col) minmax(0, 1fr);
  }
}

.case__section p {
  color: var(--ink-2);
}

.case__section h2 {
  font-size: var(--step-1);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 0.4rem;
}
```

- [ ] **Step 2: Replace the image block in `page.tsx`**

Remove `import Image from "next/image";` from the top of the file. Then replace this block:

```tsx
      <div className="case__hero">
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 1100px) 100vw, 1100px"
          priority
        />
      </div>
```

with:

```tsx
      <div className="case__bar">
        <span>
          <strong>{project.signal.value}</strong>
        </span>
        <span>{project.year}</span>
        <span>{project.stack.join(" · ")}</span>
      </div>
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: exit 0, and the build emits static routes for `/work/sellflow` and `/work/yoombaa` — the two projects with case studies.

- [ ] **Step 4: Manual browser checks**

Visit `/work/sellflow` and `/work/yoombaa`:

1. No image anywhere on the page.
2. The signal bar sits under the premise with the metric in accent colour.
3. Prose lines are comfortably readable, not stretched.
4. "← All work" returns to `/#work`.
5. Both themes correct.

- [ ] **Step 5: Commit (only with user approval)**

```bash
git add src/app/globals.css "src/app/work/[slug]/page.tsx"
git commit -m "feat: replace case study hero image with signal bar"
```

---

### Task 6: Delete the image field and asset files

Runs after Tasks 4 and 5 so that nothing references `project.image` any more.

**Files:**
- Modify: `src/data/projects.ts` — remove `image` from the interface and all six entries
- Delete: `public/images/work/*.jpg` (six files), and `public/images/` if it is then empty
- Test: no test framework — verification is Step 3

**Interfaces:**
- Consumes: Tasks 4 and 5 must be complete.
- Produces: `Project` no longer has an `image` property.

- [ ] **Step 1: Confirm nothing still reads it**

```bash
grep -rn "project.image\|\.image\b\|images/work" src/ --include=*.tsx --include=*.ts
```

Expected: only the declaration and the six literals in `src/data/projects.ts`. If anything else appears, stop and finish that consumer first.

- [ ] **Step 2: Remove the field and the files**

Delete from the `Project` interface:

```ts
  /** Portrait project image, object-cover across the whole card. */
  image: string;
```

Delete the six `image: "/images/work/....jpg",` lines from the entries, then:

```bash
rm -r public/images
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: exit 0. A `tsc` error naming `image` means a consumer was missed.

Then confirm in the browser that `/` and both case study pages render with no broken-image icons and no 404s in the network panel.

- [ ] **Step 4: Commit (only with user approval)**

```bash
git add -A src/data/projects.ts public/
git commit -m "chore: drop project image field and unused work imagery"
```

---

### Task 7: Rebuild the stack section

**Files:**
- Modify: `src/components/sections/stack-section.tsx` — full rewrite
- Modify: `src/app/globals.css` — replace the `.stack__*` block
- Test: no test framework — verification is Step 4

**Interfaces:**
- Consumes: `DOMAINS` and `STACK` from `src/data/stack.ts` (unchanged), type steps from Task 2.
- Produces: no new exports.

- [ ] **Step 1: Replace the `.stack__*` CSS**

```css
/* Stack ------------------------------------------------------------------- */

.stack__group {
  display: grid;
  gap: 0.4rem 2rem;
  padding-block: 1.5rem;
  border-top: 1px solid var(--line);
}

.stack__group:first-child {
  border-top: 0;
  padding-top: 0;
}

@media (min-width: 48rem) {
  .stack__group {
    grid-template-columns: 3rem minmax(0, 1fr);
  }
}

.stack__index {
  font-family: var(--font-code), ui-monospace, monospace;
  font-size: var(--step--2);
  letter-spacing: 0.12em;
  color: var(--ink-3);
  padding-top: 0.35rem;
}

.stack__group-name {
  font-size: var(--step-1);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--ink);
}

/* The blurbs are the best copy on the page and used to be set at 14px grey
   under a pile of pills. They lead now; the pills are the footnote. */
.stack__evidence {
  margin-top: 0.35rem;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--ink-2);
  max-width: 46rem;
}

.stack__group .tags {
  margin-top: 0.85rem;
}
```

Remove the now-dead `.stack__group + .stack__group` rule.

- [ ] **Step 2: Rewrite `stack-section.tsx`**

```tsx
import Image from "next/image";
import { Section } from "../section";
import { Reveal } from "../reveal";
import { DOMAINS, STACK } from "@/data/stack";

/**
 * One row per domain: index, name, the evidence line, then the tools.
 *
 * The previous version led with pills, which is what every portfolio does and
 * says nothing. The domain blurbs are specific and earned, so they lead.
 */
export function StackSection() {
  return (
    <Section
      id="stack"
      label="Stack"
      title="What I build with"
      intro="Grouped by where it sits in the system, front to storefront to server."
      width="wide"
    >
      {DOMAINS.map((domain, index) => (
        <Reveal key={domain.id} delay={index * 40}>
          <div className="stack__group">
            <p className="stack__index">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <h3 className="stack__group-name">{domain.label}</h3>
              <p className="stack__evidence">{domain.blurb}</p>
              <ul className="tags">
                {STACK.filter((item) => item.domain === domain.id).map((item) => (
                  <li key={item.name} className="tag">
                    {item.icon ? (
                      <Image
                        src={`/logos/${item.icon}.svg`}
                        alt=""
                        width={13}
                        height={13}
                        unoptimized
                        aria-hidden="true"
                      />
                    ) : null}
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}
    </Section>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: exit 0.

- [ ] **Step 4: Manual browser checks**

1. Five rows, indexed 01–05, each separated by a hairline.
2. The blurb is the most prominent text in each row after the domain name.
3. All 21 tools still appear, logos included.
4. In dark mode, the dark-marked logos (Next.js in particular) are still visible — `nextdotjs.svg` is near-black. If it disappears, use `nextdotjs-white.svg`, which is already in `public/logos/`, under the dark selector.
5. At 375px the rows stack without the index colliding with the name.

- [ ] **Step 5: Commit (only with user approval)**

```bash
git add src/app/globals.css src/components/sections/stack-section.tsx
git commit -m "feat: lead stack section with domain evidence over tool pills"
```

---

### Task 8: Carry the hero gradient down the page

**Files:**
- Modify: `src/app/globals.css` — hero block, `.section`, `.footer`
- Modify: `src/components/site-footer.tsx` — add the grain span
- Test: no test framework — verification is Step 4

**Interfaces:**
- Consumes: tokens from Tasks 1 and 2.
- Produces: `.grain` — a reusable class carrying the fractal-noise background, used by both the hero and the footer.

- [ ] **Step 1: Extract the grain into a shared class**

Replace `.hero__grain` with a shared `.grain`, keeping the identical background value:

```css
/* The grain is the signature: without it the gradient bands visibly. Shared
   between the hero and the footer so the page opens and closes the same way. */
.grain {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.5;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23g)'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

Then update `hero.tsx` — change `className="hero__grain"` to `className="grain"`.

- [ ] **Step 2: Add the section glow and the footer gradient**

```css
/* The gradient used to dead-end at the hero and never return. A trace of it
   sits on each section boundary and comes back at full strength in the footer,
   so the page reads as one object.

   `border-top` is removed here rather than kept: the gradient occupies the
   same 1px and stacking both gives a muddy double rule. */
.section {
  position: relative;
  border-top: 0;
}

.section::after {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--accent) 30%,
    var(--accent) 70%,
    transparent 100%
  );
  opacity: 0.28;
  pointer-events: none;
}

.footer {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.footer__gradient {
  position: absolute;
  inset: 0;
  z-index: -2;
  background: radial-gradient(
    120% 180% at 50% 130%,
    var(--accent-soft) 0%,
    transparent 70%
  );
  pointer-events: none;
}
```

- [ ] **Step 3: Add the spans to `site-footer.tsx`**

As the first two children of the footer element:

```tsx
      <span className="footer__gradient" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: exit 0.

Then in the browser:
1. The hero looks unchanged from before this task.
2. Each section boundary carries a faint accent hairline that fades at both ends. There must be exactly one rule per boundary — if two are visible, the `border-top: 0` on `.section` was not applied. If the single rule reads too weak to separate sections, restore `border-top: 1px solid var(--line)` and drop the `::after` opacity to `0.12` so the two read as one tinted line rather than two.
3. The footer has a soft accent glow rising from the bottom.
4. In dark mode the glow is present but not blown out.
5. `.footer` content still sits above the gradient, not behind it.

- [ ] **Step 5: Commit (only with user approval)**

```bash
git add src/app/globals.css src/components/hero.tsx src/components/site-footer.tsx
git commit -m "feat: carry hero gradient through section rules and footer"
```

---

### Task 9: Full verification pass

No code changes unless a check fails. This is the gate before the work is called done.

**Files:**
- Modify: only whatever a failed check requires
- Test: no test framework — this task *is* the test

**Interfaces:**
- Consumes: Tasks 1–8 complete.
- Produces: nothing.

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf .next && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all exit 0, with static routes emitted for `/`, `/work/sellflow`, `/work/yoombaa`, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image`.

- [ ] **Step 2: Confirm no dependency drift**

```bash
git diff --stat package.json package-lock.json
```

Expected: no output. Any change here violates the no-new-dependencies constraint.

- [ ] **Step 3: Theme correctness**

For each of light-system, dark-system, explicit-light and explicit-dark:
1. Hard reload shows no flash of the wrong theme.
2. Every section has a legible foreground on its background.
3. Focus rings are visible on the skip link, nav links, menu toggle, theme toggle, and every card link.

- [ ] **Step 4: Accessibility**

1. Tab from the top: skip link → nav links → theme toggle → page content in order.
2. Open the menu; confirm focus moves into it, Escape closes it and returns focus to the button, and background content is not tabbable while it is open.
3. Set the OS to reduce motion and reload; confirm cards and sections appear without transform animation.
4. Confirm every `<Image>` still has an `alt`, and decorative spans still carry `aria-hidden`.

- [ ] **Step 5: Responsive**

Check 375px, 768px, 1280px and 1920px:
1. No horizontal scrollbar at any width.
2. At 1920px the content is not stranded in the centre — the work and stack sections use the wide shell.
3. No text clips or overlaps.

- [ ] **Step 6: Resolve the screenshot artifact**

Open `/#contact` in a real browser and confirm the intro paragraph appears exactly once. `contact-section.tsx` renders one `intro`, so a second occurrence would mean `Section` is rendering it twice. If it does appear twice, fix `Section` before closing this task.

- [ ] **Step 7: Content accuracy**

```bash
grep -rn "Two published\|Two extensions" src/
```

Expected: no output.

- [ ] **Step 8: Commit (only with user approval)**

```bash
git add -A
git commit -m "chore: verification pass for visual overhaul"
```
