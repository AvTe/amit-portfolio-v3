"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  CONSENT_KEY,
  needsConsentBanner,
  type ConsentChoice,
} from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Whether to ask lives outside React — it is localStorage plus the visitor's
 * time zone, not derived state — so it is read through an external store
 * rather than mirrored in with an effect. The snapshot is memoised because
 * `useSyncExternalStore` demands a stable value between notifications.
 */
const listeners = new Set<() => void>();
let snapshot: boolean | null = null;

function compute(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") return false;
  } catch {
    // Storage blocked. Treat as unanswered; the choice just will not persist.
  }
  return needsConsentBanner();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot(): boolean {
  if (snapshot === null) snapshot = compute();
  return snapshot;
}

/** The server cannot know either input, and must not render a flash. */
function getServerSnapshot(): boolean {
  return false;
}

function dismiss() {
  snapshot = false;
  for (const listener of listeners) listener();
}

/**
 * Analytics consent, asked only where the law requires asking.
 *
 * Consent Mode has already denied storage for those regions before gtag.js
 * loaded, so nothing is written while this is on screen — the banner grants,
 * it never un-does. That is also why a visitor who ignores it entirely is left
 * in a compliant state rather than a pending one.
 */
export function ConsentBanner() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus in once it appears, or a keyboard visitor has to tab the whole
  // page to reach the thing that just interrupted them.
  useEffect(() => {
    if (visible) panelRef.current?.querySelector("button")?.focus();
  }, [visible]);

  function answer(choice: ConsentChoice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Not persisted; the banner returns next visit. Better than not asking.
    }
    window.gtag?.("consent", "update", { analytics_storage: choice });
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
    >
      <div>
        <p id="consent-title" className="consent__title">
          Analytics cookies
        </p>
        <p className="consent__text">
          I use Google Analytics to see which projects people actually read.
          Nothing is stored until you say yes, and I never collect anything that
          identifies you personally.
        </p>
      </div>

      <div className="consent__actions">
        <button
          type="button"
          className="consent__btn consent__btn--solid"
          onClick={() => answer("granted")}
        >
          Accept
        </button>
        <button
          type="button"
          className="consent__btn"
          onClick={() => answer("denied")}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
