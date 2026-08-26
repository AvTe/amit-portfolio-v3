"use client";

import { useEffect, useRef } from "react";

/**
 * The contact heading: "Open to full-stack" set at display size in outline
 * only, with a grain-and-accent fill that reveals on hover and tracks the
 * cursor.
 *
 * The fill is a second, aria-hidden copy of the same words stacked exactly on
 * the outline. Two copies rather than one element because the outline and the
 * fill need different paint treatments — `-webkit-text-stroke` on one,
 * `background-clip: text` on the other — and a single element cannot fade
 * between them without fading its own stroke too.
 *
 * Cursor position is written to `--mx` / `--my` and eased toward the pointer on
 * a rAF loop, so the glow trails rather than snaps. The loop only runs while
 * there is distance left to cover; it stops on its own once settled.
 */
export function ContactHeadline() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Nothing to track without a real pointer, and nothing to ease if the
    // visitor asked for less motion.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 50, y: 50 };
    const current = { x: 50, y: 50 };
    let frame: number | null = null;

    const tick = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      node.style.setProperty("--mx", `${current.x.toFixed(2)}%`);
      node.style.setProperty("--my", `${current.y.toFixed(2)}%`);

      if (
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05
      ) {
        frame = null;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width) * 100;
      target.y = ((event.clientY - rect.top) / rect.height) * 100;
      start();
    };

    // Ease back to centre rather than freezing wherever the pointer left.
    const onLeave = () => {
      target.x = 50;
      target.y = 50;
      start();
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span ref={ref} className="contact__display">
        <span className="contact__display-glow" aria-hidden="true" />
        Open to full-stack
        <span className="contact__display-fill" aria-hidden="true">
          Open to full-stack
        </span>
      </span>
      <span className="contact__display-sub">
        roles and selected freelance
      </span>
    </>
  );
}
