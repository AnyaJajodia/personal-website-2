"use client";

import { useEffect } from "react";

/**
 * Smooth scrolling for in-page anchor links only. (A global CSS
 * `scroll-behavior: smooth` would also animate the browser/Next.js scroll
 * restoration on Back, which should be instant.) Respects reduced motion.
 */
export default function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href^='#']");
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (id === "top") window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.pushState(history.state, "", `#${id}`);
      // move focus for keyboard and screen-reader users without a second jump
      const focusTarget = id === "main" ? document.getElementById("main") : target;
      if (focusTarget && focusTarget !== document.body) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
