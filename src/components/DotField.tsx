"use client";

import { useEffect, useRef } from "react";

/**
 * A faint field of dots laid behind one section (hero, Contact). Near the
 * pointer the dots ease aside and spring back. It animates only while the
 * pointer is close or dots are still settling — never as a constant loop —
 * and pauses when the section is offscreen. On touch devices and with
 * prefers-reduced-motion it is drawn once, static. Decorative: aria-hidden,
 * pointer-events: none, behind the content and the line.
 */

type Dot = { x0: number; y0: number; x: number; y: number; vx: number; vy: number };

const RADIUS = 120; // influence of the pointer, px
const PUSH = 20; // how far a dot right under the pointer moves, px

export default function DotField({ target }: { target: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = document.querySelector<HTMLElement>(target);
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let top = 0;
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = true;
    const isStatic = () => reduced.matches || coarse.matches;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(98, 95, 89, 0.19)"; // warm grey, quieter than the plum line
      const r = w < 640 ? 0.95 : 1.1;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      top = rect.top + window.scrollY;
      w = document.documentElement.clientWidth;
      h = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.style.top = `${top}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 640 ? 22 : 26;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) dots.push({ x0: x, y0: y, x, y, vx: 0, vy: 0 });
      }
      draw();
    };

    const step = () => {
      raf = 0;
      let moving = false;
      for (const d of dots) {
        let tx = d.x0;
        let ty = d.y0;
        if (pointer) {
          const dx = d.x0 - pointer.x;
          const dy = d.y0 - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.01) {
            const f = (1 - dist / RADIUS) ** 2 * PUSH;
            tx += (dx / dist) * f;
            ty += (dy / dist) * f;
          }
        }
        d.vx = (d.vx + (tx - d.x) * 0.12) * 0.78;
        d.vy = (d.vy + (ty - d.y) * 0.12) * 0.78;
        d.x += d.vx;
        d.y += d.vy;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02 || Math.abs(d.x - tx) + Math.abs(d.y - ty) > 0.05) moving = true;
      }
      draw();
      canvas.dataset.animating = moving ? "true" : "false";
      if (moving && visible) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf && visible && !isStatic()) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const y = e.clientY + window.scrollY - top;
      const inside = y > -RADIUS && y < h + RADIUS;
      const next = inside ? { x: e.clientX, y } : null;
      if (!next && !pointer) return;
      pointer = next;
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      canvas.dataset.visible = String(visible);
    });
    io.observe(host);
    const ro = new ResizeObserver(() => layout());
    ro.observe(host);

    const setMode = () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvas.dataset.mode = isStatic() ? "static" : "interactive";
      if (isStatic()) {
        pointer = null;
        for (const d of dots) {
          d.x = d.x0;
          d.y = d.y0;
        }
        draw();
        return;
      }
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    };
    layout();
    setMode();
    reduced.addEventListener("change", setMode);
    coarse.addEventListener("change", setMode);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduced.removeEventListener("change", setMode);
      coarse.removeEventListener("change", setMode);
    };
  }, [target]);

  return <canvas ref={ref} className="dot-field" aria-hidden="true" data-testid="dot-field" />;
}
