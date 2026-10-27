"use client";

import { useEffect, useRef } from "react";
import { type Pt, pt, spline, resample, loop, knotShape, toPath, clamp } from "@/lib/line-geometry";
import type { Theme } from "@/content/work";

/**
 * The quieter detail-page version of the homepage line: one path anchored to
 * the page (title flourish → right margin), drawn on as the reader scrolls so it
 * keeps pace just ahead of the viewport. Scrolling back retracts it; no
 * scrolling, no motion. Reduced motion shows it fully drawn.
 */

const N = 420;

function rel(el: Element | null, rootTop: number) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { left: r.left, right: r.right, top: r.top + window.scrollY - rootTop, bottom: r.bottom + window.scrollY - rootTop, width: r.width, height: r.height };
}

/** teardrop wing lobe from (x,y) out along angle a */
function wing(x: number, y: number, len: number, width: number, a: number): Pt[] {
  const dx = Math.cos(a), dy = Math.sin(a);
  const px = -dy, py = dx;
  const P = (along: number, across: number) => pt(x + dx * along + px * across, y + dy * along + py * across);
  return [P(len * 0.18, width * 0.55), P(len * 0.55, width * 0.95), P(len, width * 0.3), P(len * 0.98, -width * 0.25), P(len * 0.6, -width * 0.7), P(len * 0.2, -width * 0.35), pt(x, y)];
}

function buildPath(theme: Theme, root: HTMLElement): Pt[] | null {
  const rootTop = root.getBoundingClientRect().top + window.scrollY;
  const q = (n: string) => rel(root.querySelector(`[data-line="${n}"]`), rootTop);
  const title = q("title");
  const crumb = q("crumb");
  const top = q("top");
  const contentEl = root.querySelector('[data-line="content"]');
  const content = q("content");
  if (content && contentEl) content.right -= parseFloat(getComputedStyle(contentEl).paddingRight) || 0;
  const end = q("end");
  if (!title || !top || !content || !end) return null;
  const vw = document.documentElement.clientWidth;
  const H = root.scrollHeight;
  const gutter = vw - content.right;
  const wide = vw >= 1000;
  const gx = gutter >= 64 ? content.right + gutter * 0.5 : vw - Math.max(10, gutter * 0.38);
  const pts: Pt[] = [];

  // flourish region: right of the title on wide screens, top-right corner otherwise
  const fx = wide
    ? Math.min(content.right - 120, Math.max(title.right + 140, vw * 0.72))
    : clamp((crumb?.right ?? vw * 0.6) + 80, vw - 120, vw - 56);
  const fy = wide ? title.top + Math.min(title.height * 0.35, 90) : (crumb ? crumb.top + crumb.height / 2 : top.top + 90);
  const s = wide ? 1 : 0.55;

  if (!wide && vw < 600) {
    // phones: a compact flourish beside the breadcrumb that enters and leaves at the edge
    const f = clamp((crumb?.right ?? vw * 0.6) + 46, vw - 110, vw - 34);
    pts.push(pt(vw + 30, fy - 46), pt(vw - 8, fy - 30), pt(f + 18, fy - 18));
    if (theme === "amnh") {
      pts.push(pt(f, fy), ...wing(f, fy, 52, 9, -0.7), ...wing(f, fy, 44, 8, -0.12));
    } else if (theme === "lynxster") {
      pts.push(pt(f - 10, fy + 2), pt(f + 4, fy - 14), pt(f - 4, fy + 12), pt(f + 16, fy + 4));
    } else {
      pts.push(pt(f - 8, fy + 6), ...loop(f, fy - 4, 11, 12, { drift: 14 }));
    }
    pts.push(pt(f + 26, fy + 18), pt(vw + 30, fy + 34));
    return resample(spline(pts, 14), N);
  }
  // A page can give the flourish a job instead of a fixed place: an element
  // marked data-line="flourish" (wide screens only; every other page and
  // screen keeps the default below).
  //   tag  — the thread drops from under the header and ties a loop just above
  //          the element's top-right corner (facts hung like a field tag), then
  //          leaves for the margin on the element's right, crossing nothing
  //   mark — the thread drops from under the header to just past the
  //          element's end, makes a small loop there (a footnote mark after a
  //          title, a knot after a wordmark), and leaves once for the margin
  const anchor = wide ? root.querySelector<HTMLElement>('[data-line="flourish"]') : null;
  if (anchor) {
    const r = rel(anchor, rootTop)!;
    const kind = anchor.dataset.flourish === "mark" ? "mark" : "tag";
    const k = parseFloat(anchor.dataset.flourishScale ?? "") || (kind === "mark" ? 0.42 : 0.6);
    let startY: number;
    if (kind === "mark") {
      const mx = r.right + 18 * k + 8;
      const my = r.top + r.height * 0.3;
      pts.push(pt(mx + 150, -20), pt(mx + 70, my - 70), pt(mx + 6, my - 4));
      pts.push(...loop(mx, my - 4 * k, 34 * k, 30 * k, { drift: 40 * k, steps: 12 }));
      pts.push(pt(mx + 70, my + 30), pt(Math.min(gx - 60, mx + 420), my + 90), pt(gx, my + 170));
      startY = my + 300;
    } else {
      const lx = r.right - 30;
      const ly = r.top - 52 * k - 14;
      pts.push(pt(lx - 120, -20), pt(lx - 70, ly - 120), pt(lx - 50 * k, ly + 10 * k));
      pts.push(...loop(lx, ly - 6 * k, 40 * k, 36 * k, { drift: 56 * k, steps: 12 }));
      pts.push(pt(lx + 60 * k + 10, ly + 30 * k), pt(gx, Math.max(ly + 110, r.top + 40)));
      startY = Math.max(ly + 230, r.top + 160);
    }
    pts.push(pt(gx, startY));
    const stop = end.top - 40;
    const n = Math.max(1, Math.round((stop - startY) / 260));
    for (let i = 1; i <= n; i++) {
      const y = startY + ((stop - startY) * i) / n;
      if (i === Math.ceil(n / 2) && n > 2) pts.push(...knotShape(gx, y, 11, { turns: 1.6, dir: -1 }));
      else pts.push(pt(gx + (i % 2 ? 8 : -6), y));
    }
    pts.push(...loop(gx, end.top + 4, 12, 18, { dir: -1 }));
    pts.push(pt(gx - 30, end.bottom + 30), pt(gx - 10, Math.min(H - 6, end.bottom + 120)));
    return resample(spline(pts, 14), N);
  }

  // the line arrives from under the header rather than starting in mid-air
  pts.push(pt(wide ? fx - 170 : vw + 30, wide ? -20 : fy - 70), pt(wide ? fx - 130 : vw - 20, wide ? fy - 100 : fy - 34));
  if (theme === "amnh") {
    // a body line with two wing-like lobes
    pts.push(pt(fx - 30 * s, fy - 50 * s), pt(fx - 6 * s, fy));
    pts.push(...wing(fx, fy, 190 * s, 25 * s, -0.62));
    pts.push(...wing(fx, fy, 165 * s, 22 * s, -0.08));
    pts.push(pt(fx + 6 * s, fy + 60 * s), pt(fx + 40 * s, fy + 140 * s));
  } else if (theme === "lynxster") {
    pts.push(pt(fx - 120 * s, fy + 24 * s), pt(fx - 40 * s, fy - 6 * s));
    pts.push(pt(fx + 6 * s, fy - 24 * s), pt(fx - 30 * s, fy + 22 * s), pt(fx + 40 * s, fy + 10 * s));
    pts.push(pt(fx + 120 * s, fy - 30 * s), pt(fx + 170 * s, fy + 40 * s));
  } else {
    pts.push(pt(fx - 70 * s, fy + 20 * s));
    pts.push(...loop(fx, fy - 10 * s, 44 * s, 40 * s, { drift: 70 * s, steps: 12 }));
    pts.push(pt(fx + 90 * s, fy + 70 * s));
  }

  if (wide || vw >= 600) {
    const startY = (wide ? fy : top.top) + 200 * s;
    pts.push(pt(gx, startY));
    const stop = end.top - 40;
    const n = Math.max(1, Math.round((stop - startY) / 260));
    for (let i = 1; i <= n; i++) {
      const y = startY + ((stop - startY) * i) / n;
      if (i === Math.ceil(n / 2) && n > 2) pts.push(...knotShape(gx, y, 11, { turns: 1.6, dir: -1 }));
      else pts.push(pt(gx + (i % 2 ? 8 : -6), y));
    }
    pts.push(...loop(gx, end.top + 4, 12, 18, { dir: -1 }));
    pts.push(pt(gx - 30, end.bottom + 30), pt(gx - 10, Math.min(H - 6, end.bottom + 120)));
  } else {
    pts.push(pt(vw + 40, fy + 120 * s));
  }
  return resample(spline(pts, 14), N);
}

const COLORS: Record<Theme, string> = {
  lynxster: "var(--lx-accent)",
  amnh: "var(--amnh-accent)",
  default: "var(--accent)",
};

export default function DetailLine({ theme }: { theme: Theme }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const root = svg?.closest<HTMLElement>("[data-line-root]");
    if (!svg || !path || !root) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pts: Pt[] = [];
    let len = 0;
    let raf = 0;

    const render = () => {
      raf = 0;
      if (!pts.length) return;
      if (mq.matches) {
        path.style.strokeDashoffset = "0";
        return;
      }
      const vh = window.innerHeight;
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const atEnd = window.scrollY >= maxScroll - 2;
      const threshold = window.scrollY + vh * 0.82 - rootTop;
      let i = 0;
      while (i < pts.length && pts[i].y < threshold) i++;
      const frac = atEnd ? 1 : clamp(i / (pts.length - 1), 0, 1);
      path.style.strokeDashoffset = String(len * (1 - frac));
    };

    const rebuild = () => {
      const p = buildPath(theme, root);
      if (!p) return;
      pts = p;
      svg.style.height = `${root.scrollHeight}px`;
      path.setAttribute("d", toPath(p));
      len = path.getTotalLength();
      path.style.strokeDasharray = `${len} ${len}`;
      render();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    let t = 0;
    const schedule = () => {
      window.clearTimeout(t);
      t = window.setTimeout(rebuild, 60);
    };
    rebuild();
    document.fonts?.ready.then(rebuild).catch(() => {});
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    mq.addEventListener("change", rebuild);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", rebuild);
    };
  }, [theme]);

  return (
    <svg ref={svgRef} className="detail-line" aria-hidden="true" focusable="false" data-testid="detail-line">
      <path ref={pathRef} d="" style={{ stroke: COLORS[theme] }} />
    </svg>
  );
}
