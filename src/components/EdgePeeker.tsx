"use client";

import { useEffect, useRef } from "react";
import Avatar from "@/components/Avatar";

/**
 * The work grid's signature: a figure peeking in from behind the right-hand
 * edge of the screen, in a lane of her own beside the cards (the grid gives
 * up that width on wide screens, so she never covers a card, its text or a
 * control; the lane is clipped at the screen edge, so nothing overflows).
 *
 * - Her way in and out is tied to scroll: she slides out from behind the
 *   edge as her section scrolls into view (from her first visible pixel to
 *   the moment the cards are readable), and ducks back behind it as the
 *   section scrolls away. Scrolling back plays it in reverse. She stays put
 *   while the page is still.
 * - Leans toward the card that is hovered, focused or open: the target is
 *   that card's centre; a new card redirects the lean from wherever it is
 *   (CSS transition); leaving the grid returns her to neutral.
 * - A pointer over her makes her ease back a little (shy); tapping her (or
 *   Enter / Space on the button) sends her ducking behind the edge — gone,
 *   a pause, a cautious half-peek, then out. Pressing again mid-way starts
 *   the duck over; every state is a transition from wherever she is.
 *
 * Her eyes are baked into the artwork, so the response is posture only. The
 * direction to the active card is also published as --gaze-x / --gaze-y
 * (−1…1) on the figure, ready for a future gaze layer.
 */
const LEAN_DEG = 1.8;
/** she leans out from the edge a little toward far cards (never far enough to leave it) */
const LEAN_OUT_PX = 4;

export default function EdgePeeker() {
  const lane = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const el = lane.current;
    const fig = el?.querySelector<HTMLElement>("[data-avatar]");
    const grid = el?.parentElement?.querySelector<HTMLElement>(".panels");
    if (!el || !fig || !grid) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: Element | null = null;

    // scroll-linked: how far out from behind the edge she is (0 hidden … 1 out)
    let raf = 0;
    const place = () => {
      raf = 0;
      if (reduced.matches || !el.offsetParent) {
        fig.style.setProperty("--in", "1");
        fig.dataset.in = "still";
        return;
      }
      const vh = window.innerHeight;
      const f = fig.getBoundingClientRect();
      const g = grid.getBoundingClientRect();
      // in: from her top entering the viewport to the grid's top at 86% of it
      // (a little before the cards are readable, at 80%)
      const start = f.top - vh;
      const end = Math.max(g.top - 0.86 * vh, start + 0.1 * vh);
      const enter = Math.min(1, Math.max(0, -start / (end - start || 1)));
      // out: as the grid's foot rises from 40% to 14% of the viewport
      const leave = Math.min(1, Math.max(0, (g.bottom - 0.14 * vh) / (0.26 * vh)));
      const p = Math.min(enter, leave);
      // a gentle ease, so she decelerates into place
      const eased = 1 - Math.pow(1 - p, 2.2);
      fig.style.setProperty("--in", eased.toFixed(4));
      if (p >= 0.999 && fig.dataset.in !== "done") fig.dataset.in = "done";
      else if (p > 0 && !fig.dataset.in) fig.dataset.in = "true";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", onScroll);

    const lean = (card: Element | null) => {
      if (card === active) return;
      active = card;
      if (!card || reduced.matches) {
        fig.style.setProperty("--lean", "0deg");
        fig.style.setProperty("--lean-x", "0px");
        fig.style.setProperty("--gaze-x", "0");
        fig.style.setProperty("--gaze-y", "0");
        delete fig.dataset.leaning;
        return;
      }
      const f = fig.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      // from her face (a quarter of the way down, middle of the visible figure) to the card's centre
      const dx = c.left + c.width / 2 - (f.left + f.width * 0.45);
      const dy = c.top + c.height / 2 - (f.top + f.height * 0.24);
      const across = Math.max(0, Math.min(1, -dx / (grid.clientWidth * 0.9)));
      const down = Math.max(-1, Math.min(1, dy / (f.height * 0.9)));
      // further cards draw her further out from behind the edge; lower ones tip her head down
      fig.style.setProperty("--lean", `${(-down * LEAN_DEG).toFixed(2)}deg`);
      fig.style.setProperty("--lean-x", `${(-(1 + across * LEAN_OUT_PX)).toFixed(1)}px`);
      fig.style.setProperty("--gaze-x", (Math.max(-1, Math.min(1, dx / grid.clientWidth))).toFixed(3));
      fig.style.setProperty("--gaze-y", down.toFixed(3));
      fig.dataset.leaning = "true";
    };
    const onOver = (e: Event) => {
      const card = (e.target as Element).closest?.(".panel");
      if (card) lean(card);
    };
    const onLeave = () => lean(grid.contains(document.activeElement) ? document.activeElement!.closest(".panel") : null);
    const onFocusOut = (e: FocusEvent) => {
      if (!grid.contains(e.relatedTarget as Node | null) && !grid.matches(":hover")) lean(null);
    };
    grid.addEventListener("pointerover", onOver);
    grid.addEventListener("focusin", onOver);
    grid.addEventListener("pointerleave", onLeave);
    grid.addEventListener("focusout", onFocusOut);
    const pending = timers.current;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", onScroll);
      grid.removeEventListener("pointerover", onOver);
      grid.removeEventListener("focusin", onOver);
      grid.removeEventListener("pointerleave", onLeave);
      grid.removeEventListener("focusout", onFocusOut);
      pending.forEach((t) => clearTimeout(t));
    };
  }, []);

  // duck behind the edge → peek halfway → come back out
  const peekaboo = () => {
    const fig = lane.current?.querySelector<HTMLElement>("[data-avatar]");
    if (!fig) return;
    timers.current.forEach((t) => clearTimeout(t));
    fig.dataset.peek = "hide";
    // gone … a pause … a cautious half-peek … and back out
    timers.current = [
      window.setTimeout(() => (fig.dataset.peek = "check"), 950),
      window.setTimeout(() => delete fig.dataset.peek, 2100),
    ];
  };

  return (
    <div className="edge-lane" ref={lane} data-line="peek-lane">
      <Avatar pose="edgePeek" role="edge" driven />
      <button
        type="button"
        className="edge-lane__hit"
        aria-label="Peekaboo — she ducks behind the edge, then peeks back out"
        onClick={peekaboo}
        onPointerEnter={(e) => {
          const fig = lane.current?.querySelector<HTMLElement>("[data-avatar]");
          if (fig && e.pointerType === "mouse") fig.dataset.shy = "true";
        }}
        onPointerLeave={() => {
          const fig = lane.current?.querySelector<HTMLElement>("[data-avatar]");
          if (fig) delete fig.dataset.shy;
        }}
      />
    </div>
  );
}
