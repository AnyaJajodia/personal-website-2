"use client";

import { useEffect } from "react";
import { claimMoment } from "./moment-queue";

/**
 * Draws each hand-drawn heading mark (components/Mark.tsx) once, when its
 * heading has scrolled a little way into view — at one pen speed, so a long
 * loop takes longer than a short stroke, as it would by hand. Marks take
 * their turn with the figures' entrances (moment-queue), so two things are
 * never drawn at once. Reduced motion: drawn at once.
 *
 * The ink marks use a non-scaling stroke (the line's own weight), so their
 * dashes are measured on screen; the highlighter swipe scales with its box,
 * so its dashes are measured along the path.
 */

/** px of stroke per ms: an unhurried pen */
const PEN_SPEED = 0.62;
const MIN_MS = 420;
const MAX_MS = 950;

function lengths(path: SVGPathElement) {
  const total = path.getTotalLength();
  const m = path.getScreenCTM();
  if (!m) return { dash: total, screen: total };
  const n = 64;
  let screen = 0;
  let px = 0;
  let py = 0;
  for (let i = 0; i <= n; i++) {
    const q = path.getPointAtLength((total * i) / n);
    const x = q.x * m.a;
    const y = q.y * m.d;
    if (i) screen += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  const nonScaling = getComputedStyle(path).vectorEffect === "non-scaling-stroke";
  return { dash: nonScaling ? screen : total, screen };
}

export default function MarkStage() {
  useEffect(() => {
    const marks = Array.from(document.querySelectorAll<HTMLElement>("[data-mark]"));
    if (!marks.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      marks.forEach((m) => (m.dataset.drawn = "true"));
      return;
    }

    const timers: number[] = [];
    const pathOf = (m: HTMLElement) => m.querySelector<SVGPathElement>(".mark__ink path");

    // hold each undrawn stroke just out of sight: a gap the length of the path
    // (plus a little, so the round cap leaves no dot at the start)
    const arm = (m: HTMLElement) => {
      const path = pathOf(m);
      if (!path || m.dataset.drawn) return;
      const { dash, screen } = lengths(path);
      if (!dash) return;
      path.style.strokeDasharray = `${dash} ${dash + 12}`;
      path.style.strokeDashoffset = `${dash + 6}`;
      m.style.setProperty("--pen", `${Math.round(Math.min(MAX_MS, Math.max(MIN_MS, screen / PEN_SPEED)))}ms`);
      m.dataset.armed = "true";
    };
    const draw = (m: HTMLElement) => {
      const path = pathOf(m);
      if (!path || m.dataset.drawn) return;
      const ms = parseFloat(m.style.getPropertyValue("--pen")) || 700;
      const wait = claimMoment(ms);
      timers.push(
        window.setTimeout(() => {
          m.dataset.drawn = "true";
          path.style.strokeDashoffset = "0";
          // once drawn, the stroke is simply a stroke (a resize can't disturb it)
          timers.push(
            window.setTimeout(() => {
              path.style.strokeDasharray = "";
              path.style.strokeDashoffset = "";
            }, ms + 80),
          );
        }, wait),
      );
    };

    marks.forEach(arm);
    // the heading's size follows the viewport: re-measure anything not yet drawn
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) arm(e.target as HTMLElement);
    });
    marks.forEach((m) => ro.observe(m));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          ro.unobserve(e.target);
          draw(e.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -22% 0px", threshold: 1 },
    );
    marks.forEach((m) => io.observe(m));
    return () => {
      io.disconnect();
      ro.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);
  return null;
}
