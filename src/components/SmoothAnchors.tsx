"use client";

import { animate } from "motion";
import { useEffect, useRef } from "react";
import { HOME_TO } from "./HomeSectionLinks";

/**
 * Smooth scrolling for in-page anchor links only. (A global CSS
 * `scroll-behavior: smooth` would also animate the browser/Next.js scroll
 * restoration on Back, which should be instant.) Respects reduced motion.
 *
 * Arriving from another page for a section (HomeSectionLinks), the homepage
 * opens at its top and, once the page has settled in, travels down to the
 * section on its own: an eased journey whose length grows with the distance,
 * re-aiming every frame in case anything above it changes size. Any wheel,
 * touch or key from the reader takes over at once. With reduced motion it
 * goes straight there.
 */

/** the section's resting scroll position, under the header (its scroll-margin) */
const restingY = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);

const arrive = (el: HTMLElement, id: string) => {
  history.replaceState(history.state, "", `#${id}`);
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
};

function travel(id: string) {
  const el = document.getElementById(id);
  if (!el) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, restingY(el));
    arrive(el, id);
    return () => {};
  }
  let controls: ReturnType<typeof animate> | undefined;
  const takeOver = () => controls?.stop();
  const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  const quiet = () => events.forEach((t) => window.removeEventListener(t, takeOver));
  // let the page settle in first (PageTransition), then set off
  const wait = window.setTimeout(() => {
    const from = window.scrollY;
    const distance = Math.abs(restingY(el) - from);
    events.forEach((t) => window.addEventListener(t, takeOver, { passive: true }));
    controls = animate(0, 1, {
      duration: Math.min(2.4, 0.8 + distance / 3600),
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (p) => window.scrollTo(0, from + (restingY(el) - from) * p),
      onComplete: () => {
        quiet();
        arrive(el, id);
      },
    });
  }, 550);
  return () => {
    window.clearTimeout(wait);
    controls?.stop();
    quiet();
  };
}
export default function SmoothAnchors() {
  // a journey handed over by another page, read once (kept in a ref, so an
  // effect that is cleaned up and run again still makes it)
  const handed = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (handed.current === undefined) {
      handed.current = null;
      try {
        handed.current = sessionStorage.getItem(HOME_TO);
        sessionStorage.removeItem(HOME_TO);
      } catch {
        /* no storage, no journey */
      }
    }
    const id = handed.current;
    if (!id) return;
    window.scrollTo(0, 0);
    return travel(id);
  }, []);

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
