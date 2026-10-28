"use client";

import { useEffect, useRef } from "react";

/** the assembly's whole sequence, start to last ripple (lynxster-brand.css), plus a little */
const SEQUENCE_MS = 2600;
/** both ripples */
const RIPPLE_MS = 1500;

/**
 * Plays the Lynxster assembly (lynxster-brand.css):
 *   - as soon as the page loads it gathers the three records (laid out,
 *     unsealed, at the start) and stamps the seal, once;
 *   - afterwards, each time a pointer enters, only the last beat replays —
 *     the seal's two ripples.
 * With reduced motion (or without JavaScript) nothing is held back: the
 * finished composition shows and stays still.
 */
export default function AssemblyPlayer({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = ref.current;
    const el = wrap?.querySelector<HTMLElement>(".lxb-assembly");
    if (!wrap || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // the records rest laid out for one frame, then the sequence plays from the start
    el.dataset.play = "wait";
    let busyUntil = performance.now() + SEQUENCE_MS; // no ripple over the first play
    const start = requestAnimationFrame(() => {
      el.dataset.play = "run";
      busyUntil = performance.now() + SEQUENCE_MS;
    });
    const ripple = () => {
      const now = performance.now();
      if (now < busyUntil) return;
      busyUntil = now + RIPPLE_MS;
      delete el.dataset.ripple;
      void el.offsetWidth; // restart the ripple animation
      el.dataset.ripple = "on";
    };
    wrap.addEventListener("pointerenter", ripple);
    return () => {
      cancelAnimationFrame(start);
      wrap.removeEventListener("pointerenter", ripple);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
