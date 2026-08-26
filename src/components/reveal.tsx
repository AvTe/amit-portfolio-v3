"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-in reveal.
 *
 * Progressive enhancement, deliberately: the server renders the content
 * *visible*, and only after mount does the client hide whatever is still below
 * the fold. Hiding first (`opacity: 0` by default) meant anything whose
 * IntersectionObserver never fired — no JS, a crawler, a full-page screenshot
 * tool — stayed permanently invisible.
 *
 * Anything already on screen at mount is never hidden, so there is no flash.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let observer: IntersectionObserver | null = null;

    const id = requestAnimationFrame(() => {
      // Already in view — leave it alone rather than hiding then re-showing.
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return;

      setHidden(true);
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHidden(false);
            observer?.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(id);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={hidden ? "false" : "true"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
