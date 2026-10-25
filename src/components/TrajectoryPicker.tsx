"use client";

import { useEffect, useRef } from "react";

/**
 * The trajectory's milestones can be picked. Clicking, tapping or focusing
 * one moves the yellow highlight to it and shows its margin note (a line
 * quoted from the About text) in the space reserved beneath the timeline —
 * one at a time. Picking it again lets go. Until something is picked, the
 * highlight and the note follow the milestone the line has reached as you
 * scroll (HomeScribble marks it data-active). Nothing reflows: the note's
 * space is always there, and notes cross-fade within it.
 */
export default function TrajectoryPicker() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fig = ref.current?.closest<HTMLElement>(".trajectory");
    if (!fig) return;
    const points = Array.from(fig.querySelectorAll<HTMLButtonElement>(".trajectory__point"));
    const aside = fig.querySelector<HTMLElement>(".trajectory__aside");
    let picked = -1;

    const show = (i: number) => {
      if (!aside) return;
      if (i < 0) delete aside.dataset.show;
      else {
        aside.dataset.show = String(i);
        aside.style.setProperty("--pick", String(i));
      }
    };
    const reached = () => points.findIndex((p) => p.dataset.active);
    const pick = (i: number) => {
      picked = i;
      points.forEach((p, j) => {
        p.setAttribute("aria-pressed", String(j === i));
        if (j === i) p.dataset.selected = "true";
        else delete p.dataset.selected;
      });
      if (i >= 0) fig.dataset.picked = "true";
      else delete fig.dataset.picked;
      show(i >= 0 ? i : reached());
    };

    const onClick = (e: Event) => {
      const p = (e.target as Element).closest<HTMLButtonElement>(".trajectory__point");
      if (!p) return;
      const i = points.indexOf(p);
      pick(i === picked ? -1 : i);
    };
    const onFocus = (e: FocusEvent) => {
      const p = e.target as HTMLElement;
      if (p.matches(".trajectory__point:focus-visible")) pick(points.indexOf(p as HTMLButtonElement));
    };
    fig.addEventListener("click", onClick);
    fig.addEventListener("focusin", onFocus);
    // follow the line while nothing is picked
    const mo = new MutationObserver(() => {
      if (picked < 0) show(reached());
    });
    points.forEach((p) => mo.observe(p, { attributes: true, attributeFilter: ["data-active"] }));
    show(reached());
    return () => {
      fig.removeEventListener("click", onClick);
      fig.removeEventListener("focusin", onFocus);
      mo.disconnect();
    };
  }, []);

  return <span ref={ref} hidden />;
}
