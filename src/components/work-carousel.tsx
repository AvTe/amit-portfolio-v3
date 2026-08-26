"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Matches the `min-width: 48rem` breakpoint the desktop grid switches on. */
const MOBILE = "(max-width: 47.99rem)";

/**
 * Mobile-only project carousel.
 *
 * The track is a CSS scroll-snap container, so swiping is the browser's own
 * scrolling with real momentum and no touch handlers of our own. The arrows
 * only nudge that same scroll position, which means the two input methods can
 * never disagree about where the carousel is.
 *
 * Above the breakpoint the class is never applied and the desktop grid is
 * untouched. With JS off the track still snaps and swipes; only the arrows and
 * the counter go missing.
 */
export function WorkCarousel({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const track = wrap.querySelector<HTMLElement>(".work__grid");
    if (!track) return;
    trackRef.current = track;

    const mobile = window.matchMedia(MOBILE);
    let frame: number | null = null;

    const read = () => {
      frame = null;
      const step = track.scrollWidth / count;
      if (step <= 0) return;
      setIndex(
        Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / step))),
      );
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(read);
    };

    const sync = () => {
      const on = mobile.matches;
      setActive(on);
      if (on) {
        track.addEventListener("scroll", onScroll, { passive: true });
        read();
      } else {
        track.removeEventListener("scroll", onScroll);
        // Leaving a horizontal offset behind would shift the desktop grid.
        track.scrollLeft = 0;
        setIndex(0);
      }
    };

    sync();
    mobile.addEventListener("change", sync);

    return () => {
      mobile.removeEventListener("change", sync);
      track.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [count]);

  const go = useCallback(
    (delta: number) => {
      const track = trackRef.current;
      if (!track) return;
      const step = track.scrollWidth / count;
      track.scrollTo({
        left: (index + delta) * step,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [count, index],
  );

  return (
    <div
      ref={wrapRef}
      className={`work__carousel${active ? " work__carousel--active" : ""}`}
    >
      {children}

      <div className="work__carousel-nav">
        <button
          type="button"
          className="work__carousel-btn"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous project"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <p className="work__carousel-count">
          {String(index + 1).padStart(2, "0")}
          <span aria-hidden="true"> / </span>
          <span className="sr-only">of </span>
          {String(count).padStart(2, "0")}
        </p>

        <button
          type="button"
          className="work__carousel-btn"
          onClick={() => go(1)}
          disabled={index >= count - 1}
          aria-label="Next project"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
