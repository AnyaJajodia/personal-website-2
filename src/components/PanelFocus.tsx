"use client";

import { useEffect } from "react";

/**
 * Which work panel is open, per row. CSS :hover alone flashes during fast
 * switching — the pointer crosses the 12px gap between cards, nothing is
 * hovered for a frame, the row snaps back to its default and then forward
 * again. Here the active card is whichever one the pointer or focus last
 * entered; crossing a gap keeps it; leaving the row (and its focus) returns
 * the row to its default. CSS reads `data-open` on the panel and
 * `data-engaged` on the row; every change is a transition from wherever the
 * panels are, so rapid switching redirects instead of queueing.
 * Without JavaScript the :hover / :focus-within rules still apply.
 */
export default function PanelFocus() {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>(".panels__row"));
    const cleanups: (() => void)[] = [];
    for (const row of rows) {
      row.dataset.js = "true";
      const open = (panel: HTMLElement | null) => {
        row.querySelectorAll<HTMLElement>(".panel[data-open]").forEach((p) => p !== panel && delete p.dataset.open);
        if (panel) {
          panel.dataset.open = "true";
          row.dataset.engaged = "true";
        } else delete row.dataset.engaged;
      };
      const onOver = (e: Event) => {
        const p = (e.target as Element).closest<HTMLElement>(".panel");
        if (p && row.contains(p)) open(p);
      };
      const onLeave = () => {
        // keyboard focus inside the row keeps its card open
        const f = row.contains(document.activeElement) ? document.activeElement!.closest<HTMLElement>(".panel") : null;
        open(f);
      };
      const onFocusOut = (e: FocusEvent) => {
        if (!row.contains(e.relatedTarget as Node | null) && !row.matches(":hover")) open(null);
      };
      row.addEventListener("pointerover", onOver);
      row.addEventListener("focusin", onOver);
      row.addEventListener("pointerleave", onLeave);
      row.addEventListener("focusout", onFocusOut);
      cleanups.push(() => {
        row.removeEventListener("pointerover", onOver);
        row.removeEventListener("focusin", onOver);
        row.removeEventListener("pointerleave", onLeave);
        row.removeEventListener("focusout", onFocusOut);
      });
    }
    return () => cleanups.forEach((f) => f());
  }, []);
  return null;
}
