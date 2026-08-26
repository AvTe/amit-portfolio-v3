"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const QUERY = "(prefers-color-scheme: dark)";

/**
 * The theme lives in the DOM, not in React state.
 *
 * The blocking script in `layout.tsx` sets `data-theme` before first paint, and
 * the OS setting can change at any time. Both are external systems, so this
 * subscribes to them rather than mirroring them into state — mirroring would
 * mean a render pass where React's copy and the real value disagree.
 */
function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);

  // The attribute is written directly by `toggle` and by the layout script.
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia(QUERY).matches ? "dark" : "light";
}

/**
 * The server cannot know the visitor's theme, so it renders the neutral label.
 * React reuses this snapshot for hydration too, so the markup matches, then
 * re-renders with the real value once mounted.
 */
function getServerSnapshot(): null {
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    // Writing the attribute is the whole update — the observer above turns it
    // back into a render.
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or storage disabled — the choice just does not persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      // Before mount the theme is unknown, so the control is described
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
