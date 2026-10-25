"use client";

import { useEffect } from "react";

/**
 * Draws each hand-drawn heading mark (components/Mark.tsx) once, when it has
 * scrolled a little way into view. Reduced motion: drawn at once.
 */
export default function MarkStage() {
  useEffect(() => {
    const marks = Array.from(document.querySelectorAll<HTMLElement>("[data-mark]"));
    if (!marks.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      marks.forEach((m) => (m.dataset.drawn = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.drawn = "true";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -22% 0px", threshold: 1 },
    );
    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, []);
  return null;
}
