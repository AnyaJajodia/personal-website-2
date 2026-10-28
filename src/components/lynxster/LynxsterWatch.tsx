"use client";

import { useEffect, useRef } from "react";

/**
 * The Lynxster page's header band, after the "05 Watching" study. With a
 * mouse or pen over the band, a soft glow follows the pointer, the mark tilts
 * a little towards it, and as the pointer comes near, the mark's eyes open —
 * cut-outs in the band's own colour. It only sets CSS variables and a flag
 * (lynxster.css draws everything), so the band is complete without it: on
 * touch, without JavaScript and with reduced motion, the mark simply rests.
 *
 * The band's colour carries on behind the top of the illustration below it
 * (.lx-stage). That element can hold its own glow layer
 * ([data-watch-glow], clipped to the dark part); the pointer is followed
 * across both, and both glows share one centre, so they meet seamlessly.
 */
export default function LynxsterWatch({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const band = ref.current;
    if (!band) return;
    const mark = band.querySelector<HTMLElement>("[data-watch-mark]");
    // the dark top of the next section, if it carries a glow of its own
    const glow = band.parentElement?.querySelector<HTMLElement>("[data-watch-glow]") ?? null;
    const extra = glow?.parentElement ?? null;
    const areas = [band, ...(extra ? [extra] : [])];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const r = band.getBoundingClientRect();
      for (const a of areas) {
        const q = a.getBoundingClientRect();
        a.style.setProperty("--spot-x", `${e.clientX - q.left}px`);
        a.style.setProperty("--spot-y", `${e.clientY - q.top}px`);
        a.dataset.watching = "true";
      }
      if (!mark) return;
      const m = mark.getBoundingClientRect();
      const cx = m.left + m.width / 2,
        cy = m.top + m.height * 0.6;
      // eyes open when the pointer comes near the mark
      band.dataset.eyes = Math.hypot(e.clientX - cx, e.clientY - cy) < m.width * 0.75 ? "open" : "closed";
      if (still.matches) return;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
      mark.style.setProperty("--tilt-y", `${(nx * 14).toFixed(2)}deg`);
      mark.style.setProperty("--tilt-x", `${(-ny * 10).toFixed(2)}deg`);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = (e: PointerEvent) => {
      // crossing from the band into the stage's dark top (or back) isn't leaving
      if (areas.some((a) => a.contains(e.relatedTarget as Node | null))) return;
      last = null;
      for (const a of areas) delete a.dataset.watching;
      band.dataset.eyes = "closed";
      mark?.style.setProperty("--tilt-x", "0deg");
      mark?.style.setProperty("--tilt-y", "0deg");
    };
    for (const a of areas) {
      a.addEventListener("pointermove", move);
      a.addEventListener("pointerleave", leave);
    }
    return () => {
      cancelAnimationFrame(raf);
      for (const a of areas) {
        a.removeEventListener("pointermove", move);
        a.removeEventListener("pointerleave", leave);
      }
    };
  }, []);
  return (
    <header ref={ref} className={className} {...rest}>
      <div className="lx-band__spot" aria-hidden="true" />
      {children}
    </header>
  );
}
