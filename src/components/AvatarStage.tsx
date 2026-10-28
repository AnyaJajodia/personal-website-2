"use client";

import { useEffect } from "react";
import { claimMoment } from "./moment-queue";

/**
 * Cues the page's avatars. CSS owns how things move (transitions, so any new
 * state redirects the motion from wherever it is instead of restarting it);
 * this only decides when.
 *
 * - The hero (`data-static`) is never touched: it is simply there from the
 *   first frame.
 * - Every other figure enters once, when its place scrolls into view
 *   (`data-enter-at`, 0–1: how far up the viewport it must be), and then
 *   settles — or, with `data-enter-at="line"`, once the homepage line has
 *   been drawn under its feet (HomeScribble sets `data-line-reached`). With
 *   `data-enter-on` (a selector), the cue is that element reaching the entry
 *   line instead of the figure itself — for a tall figure that should be
 *   settled before the content beside it is read. An entrance waits for any
 *   other figure still moving on screen (never for ones already scrolled
 *   away), and for a heading mark being drawn (moment-queue), so one thing
 *   moves at a time.
 *
 * With prefers-reduced-motion every figure is simply shown in place. Without JavaScript the CSS never hides them.
 */

const ENTER_MS = 520;
/** after this the entrance is over: "done" leaves no transition pending */
const SETTLE_MS = 1600;
/** never hold an entrance back longer than this */
const MAX_WAIT_MS = 500;

export default function AvatarStage() {
  useEffect(() => {
    const figures = Array.from(document.querySelectorAll<HTMLElement>("[data-avatar]:not([data-static]):not([data-driven])"));
    if (!figures.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const showAll = () => figures.forEach((el) => (el.dataset.in = "still"));
    if (reduced.matches) {
      showAll();
      return;
    }

    const timers: number[] = [];

    // on screen at all? (the entry observers only watch the lower edge)
    const seen = new IntersectionObserver((entries) => {
      for (const e of entries) (e.target as HTMLElement).dataset.vis = e.isIntersecting ? "true" : "false";
    });
    figures.forEach((el) => seen.observe(el));

    // when each figure's entrance ends, so others can wait for it while it is on screen
    const moving = new Map<HTMLElement, number>();
    const busyFor = (now: number) => {
      let wait = 0;
      moving.forEach((end, el) => {
        if (el.dataset.vis === "true" && end > now) wait = Math.max(wait, end - now);
      });
      return wait;
    };
    const enter = (el: HTMLElement) => {
      if (el.dataset.in) return;
      el.dataset.in = "queued";
      const now = performance.now();
      // a figure at the screen's edge (data-solo) competes with nothing: it never
      // waits; any other takes its turn after figures still moving on screen and
      // after a heading's pen mark being drawn (moment-queue)
      const wait = el.dataset.solo ? 0 : Math.max(Math.min(MAX_WAIT_MS, busyFor(now)), claimMoment(ENTER_MS, MAX_WAIT_MS));
      moving.set(el, now + wait + ENTER_MS * 0.8);
      timers.push(
        window.setTimeout(() => {
          el.dataset.in = "true";
          timers.push(window.setTimeout(() => (el.dataset.in = "done"), SETTLE_MS));
        }, wait),
      );
    };

    // one entry observer per entry line
    const observers = new Map<string, IntersectionObserver>();
    const lineWatch = new MutationObserver((records) => {
      for (const m of records) if ((m.target as HTMLElement).dataset.lineReached) enter(m.target as HTMLElement);
    });
    for (const el of figures) {
      if (el.dataset.enterAt === "line") {
        if (el.dataset.lineReached) enter(el);
        else lineWatch.observe(el, { attributes: true, attributeFilter: ["data-line-reached"] });
        continue;
      }
      // above 1: the cue fires that far below the viewport, before it scrolls into view
      const at = Math.min(1.4, Math.max(0.2, Number(el.dataset.enterAt ?? 0.86)));
      const margin = `0px 0px ${Math.round((at - 1) * 100)}% 0px`;
      const cueEl = el.dataset.enterOn ? document.querySelector<HTMLElement>(el.dataset.enterOn) : null;
      if (cueEl) {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) enter(el);
          },
          { rootMargin: margin, threshold: 0 },
        );
        io.observe(cueEl);
        observers.set(`on:${el.dataset.avatar}`, io);
        continue;
      }
      const key = at.toFixed(2);
      let io = observers.get(key);
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) if (e.isIntersecting) enter(e.target as HTMLElement);
          },
          { rootMargin: margin, threshold: 0.6 },
        );
        observers.set(key, io);
      }
      io.observe(el);
    }

    const onReduce = () => {
      if (reduced.matches) showAll();
    };
    reduced.addEventListener("change", onReduce);
    return () => {
      observers.forEach((io) => io.disconnect());
      lineWatch.disconnect();
      seen.disconnect();
      timers.forEach((t) => clearTimeout(t));
      reduced.removeEventListener("change", onReduce);
    };
  }, []);

  return null;
}
