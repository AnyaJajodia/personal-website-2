"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { RIG, STAGE, SEAT, STRAW, SWING, CHEERS, pct, type Key } from "@/content/hero-rig";

/**
 * The seated hero avatar as a layered rig (content/hero-rig.ts): body fixed,
 * each lower leg and the matcha forearm turning about its own joint.
 *
 * Rendered with the page, at rest, from the first paint (the layers are
 * preloaded; the stage reserves its box) — nothing waits for hydration,
 * decoding or an animation. After hydration:
 *
 *   entry   once the homepage line reaches her seat (HomeScribble sets
 *           data-line-reached), one small settling swing of the feet
 *   hover / focus / tap on her   one short foot swing, then still
 *   hover / focus / tap on the cup   a small cheers: up, a pause, down
 *
 * A gesture already playing ignores repeats (nothing stacks or queues).
 * Motion stops when she scrolls out of view or the tab is hidden; reduced
 * motion keeps the resting pose and working controls, and moves nothing.
 */
export default function HeroRig() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const part = (k: string) => el.querySelector<HTMLElement>(`[data-part="${k}"]`)!;
    const legL = part("leg-viewer-left");
    const legR = part("leg-viewer-right");
    const arm = part("forearm-matcha");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = new Set<Animation>();
    let swinging = false;
    let cheering = false;
    let visible = true;
    const timers: number[] = [];

    const play = (target: HTMLElement, keys: Key[], duration: number) => {
      const a = target.animate(
        keys.map(([offset, deg, easing]) => ({ offset, transform: `rotate(${deg}deg)`, ...(easing ? { easing } : {}) })),
        { duration },
      );
      active.add(a);
      a.finished.catch(() => {}).finally(() => active.delete(a));
      return a;
    };
    const can = () => !reduced.matches && visible && !document.hidden;
    const swing = () => {
      if (swinging || !can()) return;
      swinging = true;
      el.dataset.swinging = "true";
      const a = play(legL, SWING.left, SWING.ms);
      const b = play(legR, SWING.right, SWING.ms);
      Promise.allSettled([a.finished, b.finished]).then(() => {
        swinging = false;
        delete el.dataset.swinging;
      });
    };
    const cheers = () => {
      if (cheering || !can()) return;
      cheering = true;
      el.dataset.cheering = "true";
      const a = play(arm, CHEERS.keys, CHEERS.ms);
      // a little fizz at the top of the raise
      timers.push(window.setTimeout(() => (el.dataset.fizz = "on"), CHEERS.ms * 0.3));
      timers.push(window.setTimeout(() => delete el.dataset.fizz, CHEERS.ms * 0.3 + 1300));
      a.finished.catch(() => {}).finally(() => {
        cheering = false;
        delete el.dataset.cheering;
      });
    };
    const stop = () => {
      active.forEach((a) => a.cancel());
      active.clear();
      swinging = cheering = false;
      delete el.dataset.swinging;
      delete el.dataset.cheering;
      delete el.dataset.fizz;
    };

    const legs = el.querySelector<HTMLButtonElement>(".hero-rig__target--legs")!;
    const cup = el.querySelector<HTMLButtonElement>(".hero-rig__target--cup")!;
    const onLegsEnter = (e: PointerEvent) => e.pointerType !== "touch" && swing();
    const onCupEnter = (e: PointerEvent) => e.pointerType !== "touch" && cheers();
    const onLegsFocus = () => legs.matches(":focus-visible") && swing();
    const onCupFocus = () => cup.matches(":focus-visible") && cheers();
    legs.addEventListener("pointerenter", onLegsEnter);
    cup.addEventListener("pointerenter", onCupEnter);
    legs.addEventListener("click", swing);
    cup.addEventListener("click", cheers);
    legs.addEventListener("focus", onLegsFocus);
    cup.addEventListener("focus", onCupFocus);

    // the entry: one settling swing once the line has reached her seat
    let entered = false;
    const entry = () => {
      if (entered || !el.dataset.lineReached) return;
      entered = true;
      timers.push(window.setTimeout(swing, 120));
    };
    const mo = new MutationObserver(entry);
    mo.observe(el, { attributes: true, attributeFilter: ["data-line-reached"] });
    entry();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) stop();
    });
    io.observe(el);
    const onVis = () => document.hidden && stop();
    const onReduce = () => reduced.matches && stop();
    document.addEventListener("visibilitychange", onVis);
    reduced.addEventListener("change", onReduce);

    return () => {
      stop();
      timers.forEach((t) => clearTimeout(t));
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduced.removeEventListener("change", onReduce);
      legs.removeEventListener("pointerenter", onLegsEnter);
      cup.removeEventListener("pointerenter", onCupEnter);
      legs.removeEventListener("click", swing);
      cup.removeEventListener("click", cheers);
      legs.removeEventListener("focus", onLegsFocus);
      cup.removeEventListener("focus", onCupFocus);
    };
  }, []);

  return (
    <div ref={root} className="avatar avatar--perched hero-rig" data-avatar="perched" data-static="true" style={{ "--ar": `${STAGE.width} / ${STAGE.height}` } as React.CSSProperties}>
      <div className="avatar__body hero-rig__stage" aria-hidden="true">
        {RIG.map((l) => (
          <div
            key={l.key}
            className="hero-rig__layer"
            data-part={l.key}
            style={{ zIndex: l.z, transformOrigin: `${pct(l.pivot[0], STAGE.width)} ${pct(l.pivot[1], STAGE.height)}` }}
          >
            <Image
              src={l.src}
              alt=""
              width={l.file[0]}
              height={l.file[1]}
              unoptimized
              preload
              loading="eager"
              fetchPriority={l.key === "body" ? "high" : "auto"}
              decoding="sync"
              draggable={false}
              style={{
                left: pct(l.x, STAGE.width),
                top: pct(l.y, STAGE.height),
                width: pct(l.width * l.sx, STAGE.width),
                height: pct(l.height * l.sy, STAGE.height),
              }}
            />
            {l.key === "forearm-matcha" ? (
              // the fizz rides with the cup
              <svg className="matcha__fizz" viewBox="-30 -64 60 64" focusable="false" style={{ left: pct(STRAW[0], STAGE.width), top: pct(STRAW[1], STAGE.height) }}>
                <path className="matcha__bubble matcha__bubble--1" d="M-7 -8c-4.2 0-6.4-3-6.1-6.1.4-3.3 3.2-5.3 6.4-5 3.3.3 5.4 2.9 5 6.1-.4 3-2.5 5-5.3 5z" />
                <path className="matcha__bubble matcha__bubble--2" d="M7 -14c-3.1 0-4.7-2.2-4.4-4.5.3-2.4 2.4-3.8 4.6-3.6 2.5.2 3.9 2.2 3.6 4.5-.3 2.1-1.8 3.6-3.8 3.6z" />
                <path className="matcha__bubble matcha__bubble--3" d="M-1 -22c-2.2 0-3.3-1.5-3.1-3.2.2-1.7 1.7-2.7 3.3-2.5 1.7.1 2.7 1.5 2.5 3.2-.2 1.5-1.2 2.5-2.7 2.5z" />
                <path className="matcha__mark matcha__mark--1" pathLength={1} d="M-13 -32c-4-3-7-7-8-12" />
                <path className="matcha__mark matcha__mark--2" pathLength={1} d="M1 -38c.6-5 .2-10-1.4-14" />
                <path className="matcha__mark matcha__mark--3" pathLength={1} d="M14 -31c4-2.4 7.5-6 9-11" />
              </svg>
            ) : null}
          </div>
        ))}
        {/* where the line runs under her: probes measured by HomeScribble */}
        <span className="avatar__probe" data-line="perch-l" style={{ left: pct(SEAT.left[0], STAGE.width), top: pct(SEAT.left[1], STAGE.height) }} />
        <span className="avatar__probe" data-line="perch-r" style={{ left: pct(SEAT.right[0], STAGE.width), top: pct(SEAT.right[1], STAGE.height) }} />
      </div>
      <button type="button" className="hero-rig__target hero-rig__target--legs" aria-label="Swing her feet" />
      <button type="button" className="hero-rig__target hero-rig__target--cup matcha" aria-label="Raise the matcha — cheers" />
    </div>
  );
}
