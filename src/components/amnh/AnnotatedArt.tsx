"use client";

import { animate } from "motion";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import type { ArtNote } from "@/content/amnh-diode-art";

/**
 * An illustration with its notes (content/amnh-diode-art.ts): the artwork
 * sits directly on the page with a numbered point on each feature, and the
 * notes are set in full in a numbered key beside it (or beneath it on narrow
 * screens), so every explanation is there without hovering.
 *
 * Pointing at a key entry or a point, or focusing a link in the key, lights
 * the point, the entry and — on the workstation — the part itself (its SVG
 * group, by data-part).
 *
 * A key entry's link to the part's detail ("enlarged in 01") is a guided
 * move: the part lights, the page travels smoothly to the detail (its
 * heading lands under the sticky header, via scroll-margin), and the detail
 * is briefly marked on arrival and takes focus. It stays a real link
 * (modified clicks open normally); the reader's wheel, touch or keys take
 * over at once; with reduced motion it goes straight there.
 */

const restingY = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);

function arrive(el: HTMLElement, hash: string) {
  history.pushState(history.state, "", hash);
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  // a brief mark on the destination (CSS: [data-arrived])
  el.removeAttribute("data-arrived");
  void el.offsetWidth;
  el.setAttribute("data-arrived", "");
  window.setTimeout(() => el.removeAttribute("data-arrived"), 2200);
}

export default function AnnotatedArt({
  id,
  notes,
  art,
  label,
  ratio,
  caption,
  extra,
  className = "",
}: {
  id: string;
  notes: ArtNote[];
  art: ReactNode;
  /** names the artwork for assistive tech */
  label: string;
  /** the artwork's width / height */
  ratio: number;
  caption: ReactNode;
  /** after the key, in the same column (a closing note) */
  extra?: ReactNode;
  className?: string;
}) {
  const [lit, setLit] = useState<string | null>(null);
  // a guided move holds its part lit until it sets off
  const guiding = useRef<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const stop = useRef<() => void>(() => {});

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    root.querySelectorAll(".is-lit").forEach((el) => el.classList.remove("is-lit"));
    const parts = notes.find((n) => n.key === lit)?.parts ?? [];
    parts.forEach((p) => root.querySelectorAll(`[data-part="${p}"]`).forEach((el) => el.classList.add("is-lit")));
  }, [lit, notes]);
  useEffect(() => () => stop.current(), []);

  const on = (key: string) => ({
    onMouseEnter: () => setLit(key),
    onMouseLeave: () => setLit((k) => (k === key && guiding.current !== key ? null : k)),
    onFocus: () => setLit(key),
    onBlur: () => setLit((k) => (k === key && guiding.current !== key ? null : k)),
  });

  const guide = (key: string, hash: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    e.preventDefault();
    stop.current();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, restingY(el));
      arrive(el, hash);
      return;
    }
    guiding.current = key;
    setLit(key);
    let controls: ReturnType<typeof animate> | undefined;
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const takeOver = () => controls?.stop();
    const quiet = () => events.forEach((t) => window.removeEventListener(t, takeOver));
    // the part shows first, then the page sets off
    const wait = window.setTimeout(() => {
      guiding.current = null;
      setLit((k) => (k === key ? null : k));
      const from = window.scrollY;
      const distance = Math.abs(restingY(el) - from);
      events.forEach((t) => window.addEventListener(t, takeOver, { passive: true }));
      controls = animate(0, 1, {
        duration: Math.min(1.4, 0.55 + distance / 3000),
        ease: [0.65, 0, 0.35, 1],
        // re-aimed every frame, in case anything above changes size
        onUpdate: (p) => window.scrollTo(0, from + (restingY(el) - from) * p),
        onComplete: () => {
          quiet();
          arrive(el, hash);
        },
      });
    }, 420);
    stop.current = () => {
      window.clearTimeout(wait);
      controls?.stop();
      quiet();
      guiding.current = null;
    };
  };

  return (
    // one figure: the artwork, then its key, any closing note and the caption
    // beside it (beneath it on narrow screens)
    <figure className={`dw-art ${className}`.trim()} aria-labelledby={`${id}-caption`}>
      <div className="dw-art__box" ref={box} role="img" aria-label={label} style={{ aspectRatio: `${ratio}` }}>
        {art}
        {notes.map((n, i) =>
          n.at.map(([x, y], j) => (
            <span
              key={`${n.key}-${j}`}
              className={`dw-pt${lit === n.key ? " is-on" : ""}`}
              aria-hidden="true"
              style={{ left: `${x}%`, top: `${y}%` } as CSSProperties}
              {...on(n.key)}
            >
              {i + 1}
            </span>
          )),
        )}
      </div>
      <div className="dw-art__side">
      <ol className="dw-key">
        {notes.map((n, i) => (
          <li key={n.key} className={lit === n.key ? "is-on" : undefined} {...on(n.key)}>
            <span className="dw-key__n" aria-hidden="true">
              {i + 1}
            </span>
            <span className="dw-key__body">
              <strong className="dw-key__label">{n.label}</strong>
              <span className="dw-key__text">{n.text}</span>
              {n.more ? (
                <a className="dw-key__more" href={n.more.href} onClick={guide(n.key, n.more.href)}>
                  {n.more.label}
                  <span aria-hidden="true"> ↓</span>
                </a>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      {extra}
      </div>
      <figcaption className="dw-caption" id={`${id}-caption`}>
        {caption}
      </figcaption>
    </figure>
  );
}
