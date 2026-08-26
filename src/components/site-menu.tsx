"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SECTIONS, site } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

/**
 * The only navigation on the site: a fixed hamburger that opens a full-screen
 * menu. Replaces the header bar entirely, per the reference.
 *
 * It is a real control, not decoration — Escape closes it, focus moves into
 * the panel on open and returns to the button on close, background scroll is
 * locked while it is up, and the panel is a labelled modal dialog.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel so keyboard users land where the menu opened.
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* One fixed flex row. Placing the nav, the toggle and the hamburger
          independently meant each had to guess where its neighbour ended. */}
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

      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`menu-panel${open ? " menu-panel--open" : ""}`}
        // Fully removed from the tree when closed, so nothing behind the
        // overlay is reachable by tab.
        {...(open ? {} : { inert: true })}
      >
        <nav className="menu-panel__nav" aria-label="Primary">
          <ol>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <Link href={`#${section.id}`} onClick={() => setOpen(false)}>
                  <span className="menu-panel__index">{section.index}</span>
                  {section.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="menu-panel__foot">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <div className="menu-panel__links">
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={site.socials.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={site.resume} download>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
