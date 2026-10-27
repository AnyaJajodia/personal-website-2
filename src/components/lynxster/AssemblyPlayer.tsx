"use client";

import { useEffect, useRef } from "react";

/** the assembly's whole sequence, start to last ripple (lynxster-brand.css), plus a little */
const SEQUENCE_MS = 3200;
/** both ripples */
const RIPPLE_MS = 1500;

/**
 * Plays the Lynxster assembly (lynxster-brand.css):
 *   - it waits, pieces held apart, until the whole visual is in view, then
 *     assembles once;
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
    let busyUntil = Infinity; // nothing replays before the first play
    el.dataset.play = "wait";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.intersectionRatio >= 0.98)) {
          el.dataset.play = "run";
          busyUntil = performance.now() + SEQUENCE_MS;
          io.disconnect();
        }
      },
      { threshold: [0.98, 1] },
    );
    io.observe(el);
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
      io.disconnect();
      wrap.removeEventListener("pointerenter", ripple);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
