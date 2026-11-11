"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";
import type { Photo, Row } from "@/content/wildlife";

/**
 * The collection: the opening photograph beside the introduction, then a
 * sequence of rows. A row's cells — single photographs, or columns of them
 * stacked — are all exactly as tall as each other, every photograph at its own
 * proportions (widths worked out in content/wildlife.ts; CSS only, nothing
 * cropped, nothing measured), so main photographs can be placed large and
 * supporting ones small.
 * Photographs are the supplied files, untouched; each opens into a larger view.
 *
 * The larger view is a shared-element transition, after
 * https://21st.dev/@jahed/components/shared-element-gallery: the photograph
 * lifts out of the grid and grows into place on a spring, and on closing
 * returns to exactly where it came from (FLIP, with the Web Animations API —
 * a transform on one element, the frosted scrim's opacity beside it). The view is a native modal <dialog>: the page behind is inert,
 * focus moves to the close button and returns to the photograph's tile.
 *
 *   open      click / tap a tile, or Enter / Space on it
 *   close     ✕ button, Escape, a click on the scrim, or drag the photograph
 *             up or down (it follows the pointer and shrinks as it goes)
 *   move      ← / → buttons, arrow keys, or swipe sideways
 *
 * With prefers-reduced-motion the view simply fades in and out, and changing
 * photograph is a short crossfade.
 */

/*
 * The hover caption: a soft shade over the photograph's lower left with the
 * caption as plain white text on it. Motion fades it in on hover or keyboard
 * focus; at rest the shade is hidden.
 */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const veil: Variants = {
  rest: {
    opacity: 0,
    transition: { duration: 0.25, ease: EASE },
    transitionEnd: { visibility: "hidden" },
  },
  hover: {
    opacity: 1,
    visibility: "visible",
    transition: { duration: 0.4, ease: EASE },
  },
};
const caption: Variants = {
  rest: { opacity: 0, x: -8, transition: { duration: 0.2, ease: EASE } },
  hover: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.06, ease: EASE },
  },
};

/** a spring as a CSS linear() easing (semi-implicit Euler, 120 Hz) */
function spring(stiffness: number, damping: number) {
  const dt = 1 / 120;
  let x = 0,
    v = 0,
    t = 0;
  const xs = [0];
  while (t < 2) {
    v += (-stiffness * (x - 1) - damping * v) * dt;
    x += v * dt;
    t += dt;
    xs.push(x);
    if (t > 0.15 && Math.abs(x - 1) < 0.0015 && Math.abs(v) < 0.02) break;
  }
  const n = 48;
  const pts = Array.from({ length: n + 1 }, (_, i) => (i === n ? 1 : xs[Math.round((i / n) * (xs.length - 1))]));
  return {
    easing: `linear(${pts.map((p) => +p.toFixed(4)).join(", ")})`,
    duration: Math.round(t * 1000),
  };
}
/** opening: a soft spring that just overshoots (ζ ≈ 0.82) */
const OPEN = spring(230, 25);
/** closing and settling back: critically damped, quicker */
const CLOSE = spring(420, 41);
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** background scroll locked without a layout shift (the work drawer's lock: WorkDrawer.css) */
function lock() {
  const root = document.documentElement;
  root.style.setProperty("--sheet-scrollbar", `${window.innerWidth - root.clientWidth}px`);
  root.dataset.sheetOpen = "true";
}
function unlock() {
  const root = document.documentElement;
  delete root.dataset.sheetOpen;
  root.style.removeProperty("--sheet-scrollbar");
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** the transform that maps box `from` onto box `to` (both viewport rects) */
function mapRect(from: DOMRect, to: DOMRect) {
  const sx = to.width / from.width;
  const sy = to.height / from.height;
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  return { t: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` };
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={dir === "prev" ? "M14.5 6 8.5 12l6 6" : "M9.5 6l6 6-6 6"} />
    </svg>
  );
}

type Props = {
  hero: Photo;
  rows: Row[];
  /** the opening photograph followed by every row's, in order: what ← / → walk through */
  sequence: Photo[];
};

export default function WildlifeGallery({ hero, rows, sequence }: Props) {
  const photos = sequence;
  const n = photos.length;
  const indexOf = (ph: Photo) => photos.findIndex((x) => x.id === ph.id);

  const [view, setView] = useState<number | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLElement>(null);
  const figRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const phase = useRef<"closed" | "opening" | "open" | "closing">("closed");
  const origin = useRef<{ rect: DOMRect } | null>(null);
  const swapDir = useRef(0);

  /** captions differ in length: the photograph leaves exactly the caption's
   * height free (its width never depends on the photograph, so this settles) */
  const fitCaption = useCallback(() => {
    const cap = capRef.current,
      fig = figRef.current;
    if (cap && fig) fig.style.setProperty("--cap-h", `${cap.offsetHeight}px`);
  }, []);
  const [ready, setReady] = useState(false);

  // tiles fade in as their photographs arrive (only ones still loading when
  // the page hydrates; without JavaScript every photograph simply appears)
  useEffect(() => {
    rootRef.current?.querySelectorAll<HTMLImageElement>(".wl-tile__img").forEach((img) => {
      if (img.complete) return;
      img.dataset.pending = "true";
      img.addEventListener("load", () => delete img.dataset.pending, {
        once: true,
      });
      img.addEventListener("error", () => delete img.dataset.pending, {
        once: true,
      });
    });
  }, []);

  const lift = (i: number | null, on: boolean) => {
    const t = i === null ? null : tileRefs.current[i];
    if (t) t.dataset.lifted = on ? "true" : "false";
  };

  /* ------------------------------------------------------------ open */
  const open = (i: number) => {
    if (phase.current !== "closed") return;
    const img = tileRefs.current[i]?.querySelector<HTMLImageElement>("img");
    if (!img) return;
    origin.current = { rect: img.getBoundingClientRect() };
    setReady(img.complete && img.naturalWidth > 0);
    phase.current = "opening";
    setView(i);
  };

  // the dialog has rendered with the photograph: show it and fly it in
  useLayoutEffect(() => {
    if (view === null || phase.current !== "opening") return;
    const d = dialogRef.current,
      frame = frameRef.current,
      scrim = scrimRef.current,
      cap = capRef.current;
    if (!d || !frame || !scrim || !cap) return;
    lock();
    d.showModal();
    fitCaption();
    closeRef.current?.focus({ preventScroll: true });
    lift(view, true);
    const done = () => {
      if (phase.current === "opening") phase.current = "open";
    };
    if (reduced() || !origin.current) {
      const a = d.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 160,
        easing: "ease-out",
      });
      a.onfinish = done;
      return;
    }
    const last = frame.getBoundingClientRect();
    const { t } = mapRect(last, origin.current.rect);
    frame.animate([{ transform: t }, { transform: "none" }], {
      duration: OPEN.duration,
      easing: OPEN.easing,
    }).onfinish = done;
    scrim.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 360,
      easing: EASE_OUT,
    });
    cap.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 420, delay: 140, easing: EASE_OUT, fill: "backwards" },
    );
    d.querySelectorAll<HTMLElement>(".wl-view__close, .wl-view__nav").forEach((b) =>
      b.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        delay: 160,
        fill: "backwards",
      }),
    );
  }, [view, fitCaption]);

  /* ----------------------------------------------------------- close */
  const finish = useCallback(() => {
    const i = view;
    const d = dialogRef.current;
    lift(i, false);
    d?.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    if (d?.open) d.close();
    unlock();
    phase.current = "closed";
    setView(null);
    if (i !== null) tileRefs.current[i]?.focus({ preventScroll: true });
  }, [view]);

  const close = useCallback(() => {
    if (view === null || phase.current === "closing" || phase.current === "closed") return;
    phase.current = "closing";
    const d = dialogRef.current,
      frame = frameRef.current,
      scrim = scrimRef.current,
      cap = capRef.current;
    const tile = tileRefs.current[view];
    if (!d || !frame || !scrim || !cap || !tile) return finish();
    if (reduced()) {
      d.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 140,
        easing: "ease-in",
        fill: "forwards",
      }).onfinish = finish;
      return;
    }
    // bring the tile into view behind the scrim if the visitor moved far from it
    const tr = tile.getBoundingClientRect();
    if (tr.bottom < 0 || tr.top > window.innerHeight) tile.scrollIntoView({ block: "center", behavior: "instant" });
    const target = tile.querySelector("img")!.getBoundingClientRect();
    // from wherever it is now (mid-drag included) to the tile
    const current = getComputedStyle(frame).transform;
    frame.getAnimations().forEach((a) => a.cancel());
    frame.style.transform = "none";
    const base = frame.getBoundingClientRect();
    frame.style.transform = "";
    const { t } = mapRect(base, target);
    frame.animate([{ transform: current === "none" ? "none" : current }, { transform: t }], { duration: CLOSE.duration, easing: CLOSE.easing, fill: "forwards" }).onfinish = finish;
    const scrimNow = getComputedStyle(scrim).opacity;
    scrim.getAnimations().forEach((a) => a.cancel());
    scrim.animate([{ opacity: scrimNow }, { opacity: 0 }], {
      duration: Math.min(320, CLOSE.duration),
      easing: "ease-out",
      fill: "forwards",
    });
    [cap, ...d.querySelectorAll<HTMLElement>(".wl-view__close, .wl-view__nav")].forEach((el) =>
      el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], {
        duration: 140,
        easing: "ease-out",
        fill: "forwards",
      }),
    );
  }, [view, finish]);

  /* ------------------------------------------------- next / previous */
  const go = useCallback(
    (dir: number) => {
      if (view === null || phase.current === "closing") return;
      const next = (view + dir + n) % n;
      lift(view, false);
      lift(next, true);
      swapDir.current = dir;
      phase.current = "open";
      const t = tileRefs.current[next]?.querySelector("img");
      setReady(!!t && t.complete && t.naturalWidth > 0);
      setView(next);
    },
    [view, n],
  );

  // the new photograph slides in from the side it came from
  useLayoutEffect(() => {
    const dir = swapDir.current;
    if (view === null || !dir) return;
    swapDir.current = 0;
    fitCaption();
    const frame = frameRef.current,
      cap = capRef.current;
    if (!frame || !cap) return;
    frame.getAnimations().forEach((a) => a.cancel());
    const shift = reduced() ? 0 : 36 * dir;
    frame.animate(
      [
        { opacity: 0, transform: `translateX(${shift}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: reduced() ? 140 : 380, easing: EASE_OUT },
    );
    cap.animate([{ opacity: 0.2 }, { opacity: 1 }], {
      duration: 260,
      easing: "ease-out",
    });
  }, [view, fitCaption]);

  /* -------------------------------------------------------- keyboard */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  /* ------------------------------------------------- drag and swipe */
  const drag = useRef<{
    x: number;
    y: number;
    t: number;
    axis: "" | "x" | "y";
    id: number;
  } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (phase.current !== "open" || (e.pointerType === "mouse" && e.button !== 0)) return;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      axis: "",
      id: e.pointerId,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const g = drag.current,
      frame = frameRef.current,
      scrim = scrimRef.current;
    if (!g || g.id !== e.pointerId || !frame || !scrim) return;
    const dx = e.clientX - g.x,
      dy = e.clientY - g.y;
    if (!g.axis) {
      if (Math.hypot(dx, dy) < 8) return;
      g.axis = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      frame.getAnimations().forEach((a) => a.cancel());
      frame.dataset.dragging = "true";
    }
    if (g.axis === "y") {
      const k = Math.min(Math.abs(dy) / 900, 0.22);
      frame.style.transform = `translate(${dx * 0.35}px, ${dy}px) scale(${1 - k})`;
      scrim.style.opacity = String(1 - Math.min(Math.abs(dy) / 420, 0.75));
    } else {
      frame.style.transform = `translateX(${dx * 0.9}px)`;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const g = drag.current,
      frame = frameRef.current,
      scrim = scrimRef.current;
    drag.current = null;
    if (!g || !g.axis || !frame || !scrim) return;
    delete frame.dataset.dragging;
    const dx = e.clientX - g.x,
      dy = e.clientY - g.y;
    const v = (g.axis === "y" ? Math.abs(dy) : Math.abs(dx)) / Math.max(1, performance.now() - g.t);
    if (g.axis === "y" && (Math.abs(dy) > 110 || (v > 0.55 && Math.abs(dy) > 30))) {
      // close() starts from the dragged position and opacity (computed styles)
      close();
      return;
    }
    if (g.axis === "x" && (Math.abs(dx) > 70 || (v > 0.5 && Math.abs(dx) > 24))) {
      frame.style.transform = "";
      scrim.style.opacity = "";
      go(dx < 0 ? 1 : -1);
      return;
    }
    // not far enough: settle back
    const from = frame.style.transform;
    frame.style.transform = "";
    if (!reduced())
      frame.animate([{ transform: from }, { transform: "none" }], {
        duration: CLOSE.duration,
        easing: CLOSE.easing,
      });
    const so = scrim.style.opacity;
    scrim.style.opacity = "";
    if (so && !reduced())
      scrim.animate([{ opacity: so }, { opacity: 1 }], {
        duration: 240,
        easing: "ease-out",
      });
  };
  // a click that ended a drag is not a click on the scrim
  const onStageClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".wl-view__frame, .wl-view__cap, button")) return;
    close();
  };

  // tidy up if the page is left with the view open
  useEffect(() => () => unlock(), []);

  // keep the room for the caption right as the window changes size
  const isOpen = view !== null;
  useEffect(() => {
    if (!isOpen || !capRef.current) return;
    const ro = new ResizeObserver(fitCaption);
    ro.observe(capRef.current);
    return () => ro.disconnect();
  }, [isOpen, fitCaption]);

  const p = view === null ? null : photos[view];
  const ar = p ? p.width / p.height : 1;

  /** one photograph in the collection: a button that opens it (a render
   * function, not a component, so tiles keep their identity across renders) */
  const tile = (ph: Photo, eager = false, share = 1, className = "") => {
    const i = indexOf(ph);
    return (
      <motion.button
        type="button"
        className={`wl-tile ${className}`.trim()}
        ref={(el: HTMLButtonElement | null) => {
          tileRefs.current[i] = el;
        }}
        onClick={() => open(i)}
        aria-haspopup="dialog"
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        style={
          {
            "--ar": `${ph.width} / ${ph.height}`,
            "--tone-l": ph.tone.light,
            "--tone-d": ph.tone.dark,
          } as React.CSSProperties
        }
      >
        {/* a web copy near the size it is shown at (rows stack full-width on
            phones); never cropped */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="wl-tile__img"
          src={ph.src}
          srcSet={ph.srcSet}
          sizes={`(max-width: 640px) 100vw, min(${Math.ceil(share * 100)}vw, ${Math.ceil(share * 1240)}px)`}
          width={ph.width}
          height={ph.height}
          alt={ph.alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          draggable={false}
        />
        <motion.span className="wl-tile__veil" variants={veil} aria-hidden="true" />
        <motion.span className="wl-tile__label" variants={caption} aria-hidden="true">
          <span className="wl-tile__title">{ph.title}</span>
          <span className="wl-tile__caption">{ph.hover}</span>
        </motion.span>
      </motion.button>
    );
  };

  // supporting photographs alternate sides when the rows stack on phones
  let support = 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="wl-collection" ref={rootRef}>
        <div className="wl-opening">{tile(hero, true)}</div>

        <h2 className="visually-hidden" id="wl-collection-title">
          The photographs
        </h2>
        <div className="wl-rows" aria-labelledby="wl-collection-title" role="list">
          {rows.map((row, r) => (
            <div key={r} className="wl-row" style={{ "--w": row.width } as React.CSSProperties}>
              {row.cells.map((cell, k) => {
                const item = (ph: Photo, extra = "", style?: React.CSSProperties) => {
                  const side = ph.weight === "support" ? (support++ % 2 === 0 ? "start" : "end") : undefined;
                  return (
                    <div
                      key={ph.id}
                      role="listitem"
                      className={`wl-item ${extra}`.trim()}
                      data-weight={ph.weight}
                      data-side={side}
                      style={
                        {
                          "--ar": ph.width / ph.height,
                          ...style,
                        } as React.CSSProperties
                      }
                    >
                      {tile(ph, r === 0, row.width * cell.share)}
                    </div>
                  );
                };
                const width = { "--cw": cell.width } as React.CSSProperties;
                // a single photograph, or a column of them exactly as tall as the row
                return cell.photos.length === 1 ? (
                  item(cell.photos[0], "wl-cell", width)
                ) : (
                  <div key={k} className="wl-cell wl-stack" style={width}>
                    {cell.photos.map((ph) => item(ph))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <dialog
          ref={dialogRef}
          className="wl-view"
          aria-labelledby="wl-view-title"
          aria-describedby="wl-view-caption"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onKeyDown={onKeyDown}
        >
          {p ? (
            <>
              <div className="wl-view__scrim" ref={scrimRef} aria-hidden="true" />
              <div className="wl-view__stage" onClick={onStageClick}>
                <figure className="wl-view__figure" ref={figRef} style={{ "--ar": ar } as React.CSSProperties}>
                  <div
                    className="wl-view__frame"
                    ref={frameRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={
                      {
                        "--tone-l": p.tone.light,
                        "--tone-d": p.tone.dark,
                      } as React.CSSProperties
                    }
                  >
                    {/* the whole photograph, at the size the view needs (its
                        place holds the photograph's tone until it arrives) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={p.id}
                      className="wl-view__img"
                      src={p.src}
                      srcSet={p.srcSet}
                      sizes="100vw"
                      width={p.width}
                      height={p.height}
                      alt={p.alt}
                      decoding="sync"
                      data-ready={ready ? "true" : undefined}
                      onLoad={() => setReady(true)}
                      draggable={false}
                    />
                  </div>
                  <figcaption className="wl-view__cap" ref={capRef}>
                    <div className="wl-view__text" aria-live="polite">
                      <h2 className="wl-view__title" id="wl-view-title">
                        {p.title}
                      </h2>
                      <p className="wl-view__caption" id="wl-view-caption">
                        {p.caption}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </div>
              {/* fixed in one place for every photograph, whatever its caption */}
              <div className="wl-view__nav">
                <button type="button" className="wl-btn" onClick={() => go(-1)} aria-label="Previous photograph">
                  <Arrow dir="prev" />
                </button>
                <span className="wl-view__count">
                  <span className="visually-hidden">Photograph </span>
                  {view! + 1}
                  <span aria-hidden="true"> / </span>
                  <span className="visually-hidden"> of </span>
                  {n}
                </span>
                <button type="button" className="wl-btn" onClick={() => go(1)} aria-label="Next photograph">
                  <Arrow dir="next" />
                </button>
              </div>
              <button type="button" className="wl-btn wl-view__close" ref={closeRef} onClick={close} aria-label="Close">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                </svg>
              </button>
            </>
          ) : null}
        </dialog>
      </div>
    </MotionConfig>
  );
}
