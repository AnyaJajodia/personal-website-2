"use client";

import { useEffect } from "react";

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
 *   been drawn under its feet (HomeScribble sets `data-line-reached`). An entrance waits for any other figure still moving on screen
 *   (never for ones already scrolled away), so one thing moves at a time.
 * - The peeker over the work grid leans a little toward the card that is
 *   hovered, focused or open — driven by which card is active, not by the
 *   cursor's position — and returns to neutral when the grid is left.
 *
 * With prefers-reduced-motion every figure is shown in place and nothing
 * leans. Without JavaScript the CSS never hides them.
 */

const ENTER_MS = 520;
/** after this the entrance is over: "done" leaves no transition pending */
const SETTLE_MS = 1600;
/** never hold an entrance back longer than this */
const MAX_WAIT_MS = 500;
/** the peeker's lean toward the active card, at most */
const LEAN_DEG = 2.4;
const LEAN_PX = 7;

export default function AvatarStage() {
  useEffect(() => {
    const figures = Array.from(document.querySelectorAll<HTMLElement>("[data-avatar]:not([data-static])"));
    if (!figures.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const showAll = () => figures.forEach((el) => (el.dataset.in = "still"));
    if (reduced.matches) {
      showAll();
      return;
    }

    const cleanups: (() => void)[] = [];
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
      const wait = Math.min(MAX_WAIT_MS, busyFor(now));
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
      const at = Math.min(1, Math.max(0.2, Number(el.dataset.enterAt ?? 0.86)));
      const key = at.toFixed(2);
      let io = observers.get(key);
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) if (e.isIntersecting) enter(e.target as HTMLElement);
          },
          { rootMargin: `0px 0px -${Math.round((1 - at) * 100)}% 0px`, threshold: 0.6 },
        );
        observers.set(key, io);
      }
      io.observe(el);
    }

    // the peeker: lean toward the active card
    const peeker = document.querySelector<HTMLElement>('[data-avatar="peeking"]');
    const stage = peeker?.closest<HTMLElement>(".panels-stage");
    if (peeker && stage) {
      let active: Element | null = null;
      const lean = (card: Element | null) => {
        if (card === active) return;
        active = card;
        let t = 0;
        if (card) {
          const a = peeker.getBoundingClientRect();
          const c = card.getBoundingClientRect();
          // direction and rough distance only: a card right below her barely moves her
          t = Math.max(-1, Math.min(1, (c.left + c.width / 2 - (a.left + a.width / 2)) / (stage.clientWidth * 0.42)));
        }
        peeker.style.setProperty("--lean", `${(t * LEAN_DEG).toFixed(2)}deg`);
        peeker.style.setProperty("--lean-x", `${(t * LEAN_PX).toFixed(1)}px`);
        if (card) peeker.dataset.leaning = "true";
        else delete peeker.dataset.leaning;
      };
      const onOver = (e: Event) => {
        const card = (e.target as Element).closest?.(".panel");
        if (card) lean(card);
      };
      const onLeave = () => {
        const focused = stage.contains(document.activeElement) ? document.activeElement!.closest(".panel") : null;
        lean(focused);
      };
      const onFocusOut = (e: FocusEvent) => {
        if (!stage.contains(e.relatedTarget as Node | null) && !stage.matches(":hover")) lean(null);
      };
      stage.addEventListener("pointerover", onOver);
      stage.addEventListener("focusin", onOver);
      stage.addEventListener("pointerleave", onLeave);
      stage.addEventListener("focusout", onFocusOut);
      cleanups.push(() => {
        stage.removeEventListener("pointerover", onOver);
        stage.removeEventListener("focusin", onOver);
        stage.removeEventListener("pointerleave", onLeave);
        stage.removeEventListener("focusout", onFocusOut);
      });
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
      cleanups.forEach((f) => f());
      reduced.removeEventListener("change", onReduce);
    };
  }, []);

  return null;
}
