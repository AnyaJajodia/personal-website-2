"use client";

import { useEffect, useRef } from "react";
import { buildRoute, schedule, type HomeLayout, type Rect } from "@/lib/home-route";
import { splineIndexed, toPath, clamp, type Pt } from "@/lib/line-geometry";
import { ThreadTug } from "@/lib/thread-tug";

/**
 * ONE continuous line for the homepage. It grows out of the final "a" of the
 * name, turns down into the right margin, sweeps left into the career
 * trajectory and runs on down the page without ever leaving it (see
 * lib/home-route.ts for the route).
 *
 * The SVG is laid over the whole document (absolute, behind the content,
 * pointer-events: none), so the line scrolls natively with the text and its
 * join with the letter can never lag or drift. Scroll only controls how much
 * of the line is drawn (stroke-dashoffset): reverse scroll retracts it, and
 * when scrolling stops it holds. With prefers-reduced-motion the complete
 * line is drawn once, statically.
 */

const NARROW_BREAKPOINT = 860;

function docRect(el: Element | null): Rect {
  if (!el) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  const r = el.getBoundingClientRect();
  const y = window.scrollY;
  return { left: r.left, right: r.right, width: r.width, height: r.height, top: r.top + y, bottom: r.bottom + y };
}

/** a probe's point, or null when it (or its figure) is not displayed */
function probe(el: Element | null): Pt | null {
  if (!el || !(el as HTMLElement).offsetParent) return null;
  const r = docRect(el);
  return { x: r.left, y: r.top };
}

function measure(root: HTMLElement): HomeLayout {
  const q = (name: string) => root.querySelector(`[data-line="${name}"]`);
  const qa = (name: string) => Array.from(root.querySelectorAll(`[data-line="${name}"]`)).map(docRect);
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const contentEl = q("content");
  const content = docRect(contentEl);
  if (contentEl) {
    const cs = getComputedStyle(contentEl);
    content.left += parseFloat(cs.paddingLeft) || 0;
    content.right -= parseFloat(cs.paddingRight) || 0;
  }
  const nameEl = q("hero-name");
  const end = docRect(q("name-end")); // zero-size probe sitting on the baseline after "Anya"
  return {
    vw,
    vh,
    maxScroll: Math.max(0, document.documentElement.scrollHeight - vh),
    narrow: window.matchMedia(`(max-width: ${NARROW_BREAKPOINT - 0.02}px)`).matches,
    contentLeft: content.left,
    contentRight: content.right,
    nameSize: nameEl ? parseFloat(getComputedStyle(nameEl).fontSize) : 160,
    nameEnd: { x: end.left, y: end.bottom },
    hero: docRect(q("hero")),
    heroSlot: (() => {
      const el = q("hero-slot");
      return el && getComputedStyle(el).display !== "none" ? docRect(el) : docRect(null);
    })(),
    perch: (() => {
      const l = probe(q("perch-l"));
      const r = probe(q("perch-r"));
      return l && r ? { l, r } : null;
    })(),
    heroIntro: docRect(q("hero-intro")),
    heroCue: docRect(q("hero-cue")),
    aboutHeading: docRect(q("about-heading")),
    trajBand: docRect(q("traj-band")),
    trajPoints: qa("traj-point"),
    trajEnd: docRect(q("traj-end")),
    lane: (() => {
      const el = root.querySelector<HTMLElement>(".edge-lane");
      return el && getComputedStyle(el).display !== "none" ? docRect(el) : null;
    })(),
    currentLabel: docRect(q("current-label")),
    currentHeading: docRect(q("current-heading")),
    features: qa("feature"),
    featureRow: docRect(root.querySelector(".features")),
    thread: (() => {
      const fist = probe(q("untangle-fist"));
      const foot = probe(q("untangle-foot"));
      const el = root.querySelector('[data-avatar="untangling"]');
      return fist && foot && el ? { fist, foot, figure: docRect(el) } : null;
    })(),
    aboutBody: docRect(root.querySelector(".about__body")),
    selectedLabel: docRect(q("selected-label")),
    selectedHeading: docRect(q("selected-heading")),
    panels: docRect(q("panels")),
    moreLabel: docRect(q("more-label")),
    moreIntro: docRect(root.querySelector(".more__intro")),
    bento: docRect(root.querySelector(".bento")),
    contact: docRect(q("contact")),
    contactHeading: docRect(q("contact-heading")),
    greeter: (() => {
      const el = root.querySelector<HTMLElement>('[data-avatar="greeting"]');
      return el?.offsetParent ? docRect(el) : null;
    })(),
  };
}

/** Ribbon over the first stretch of the line, filled with an ink → plum
 * gradient so the colour change happens just outside the letter, not at it. */
function bridgePath(pts: Pt[], w0: number, w1: number): string {
  const L: Pt[] = [];
  const R: Pt[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
    const t = i / (n - 1);
    const w = (w0 + (w1 - w0) * t * t * (3 - 2 * t)) / 2;
    L.push({ x: pts[i].x + nx * w, y: pts[i].y + ny * w });
    R.push({ x: pts[i].x - nx * w, y: pts[i].y - ny * w });
  }
  const f = (v: number) => Math.round(v * 100) / 100;
  const side = (p: Pt[]) => p.map((q) => `${f(q.x)} ${f(q.y)}`).join("L");
  return `M${side(L)}L${side(R.reverse())}Z`;
}

/** Drawn length for a scroll position, interpolated between schedule entries. */
export function drawnAt(sched: { s: number; len: number }[], s: number): number {
  if (!sched.length) return 0;
  if (s <= sched[1]?.s) {
    const a = sched[0], b = sched[1];
    return s <= a.s ? a.len : a.len + ((b.len - a.len) * (s - a.s)) / (b.s - a.s || 1);
  }
  let lo = 1;
  let hi = sched.length - 1;
  if (s >= sched[hi].s) return sched[hi].len;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (sched[mid].s <= s) lo = mid;
    else hi = mid;
  }
  const a = sched[lo], b = sched[hi];
  return a.len + ((b.len - a.len) * (s - a.s)) / (b.s - a.s || 1);
}

export default function HomeScribble() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const bridgeRef = useRef<SVGPathElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  const knotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const line = lineRef.current;
    const bridge = bridgeRef.current;
    const grad = gradRef.current;
    const root = svg?.closest<HTMLElement>("[data-line-root]");
    const knotLayer = knotsRef.current;
    if (!svg || !line || !bridge || !grad || !root || !knotLayer) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let sched: { s: number; len: number }[] = [];
    let total = 1;
    let svgLen = 1;
    let raf = 0;
    let fontsReady = document.fonts?.status === "loaded";
    // the knots you can tug (thread-tug.ts); they own the path's d while one is moving
    const tug = new ThreadTug(knotLayer, line, mq);
    // trajectory milestones: emphasise the one the pen has most recently reached
    const points = Array.from(root.querySelectorAll<HTMLElement>('[data-line="traj-point"]'));
    let mileLens: number[] = [];
    // figures that appear when the pen reaches them (once; never taken back)
    let cueLens: [HTMLElement, number][] = [];
    let active = -2;
    // the entry: on a fresh load at the top, the line grows from the end of
    // the name to the seat (≈1s) instead of appearing already drawn; reaching
    // the seat cues the hero's one settling swing (data-line-reached)
    const ENTRY_MS = 1000;
    let entry: { t0: number } | null = null;
    let entered = false;
    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      points.forEach((el, j) => {
        if (j === i) el.dataset.active = "true";
        else delete el.dataset.active;
      });
    };

    const render = () => {
      raf = 0;
      if (!sched.length) return;
      const s = window.scrollY;
      let len = clamp(drawnAt(sched, s), 0, total);
      if (entry) {
        const t = (performance.now() - entry.t0) / ENTRY_MS;
        if (t >= 1) entry = null;
        else {
          len *= 1 - Math.pow(1 - t, 3);
          raf = requestAnimationFrame(render);
        }
      }
      line.style.strokeDashoffset = String(svgLen * (1 - len / total));
      svg.dataset.drawn = (len / total).toFixed(4);
      for (const [el, at] of cueLens) if (len >= at && !el.dataset.lineReached) el.dataset.lineReached = "true";
      let reached = -1;
      while (reached + 1 < mileLens.length && mileLens[reached + 1] <= len) reached++;
      setActive(reached);
    };

    const rebuild = () => {
      // leaving the page: the DOM can go before this effect is cleaned up
      if (!root.isConnected) return;
      const L = measure(root);
      const route = buildRoute(L);
      const { dense, at } = splineIndexed(route.points, 4);
      const cum = [0];
      for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y));
      total = cum[cum.length - 1] || 1;
      svg.style.height = `${document.documentElement.scrollHeight}px`;
      const d = toPath(dense);
      line.setAttribute("d", d);
      svgLen = line.getTotalLength() || total;
      tug.setPath(dense, fontsReady ? (route.knots ?? []) : []);

      // ink → plum bridge out of the letter
      const f = L.nameSize;
      let j = 1;
      while (j < dense.length - 1 && cum[j] < f * 0.26) j++;
      const head = dense.slice(0, j + 1);
      const lineW = parseFloat(getComputedStyle(line).strokeWidth) || 2;
      bridge.setAttribute("d", bridgePath(head, lineW, lineW));
      grad.setAttribute("x1", String(head[0].x));
      grad.setAttribute("y1", String(head[0].y));
      grad.setAttribute("x2", String(head[head.length - 1].x));
      grad.setAttribute("y2", String(head[head.length - 1].y));

      mileLens = route.milestones.map((k) => cum[at[k]] + 1);
      cueLens = Object.entries(route.cues ?? {}).flatMap(([role, k]) => {
        const el = root.querySelector<HTMLElement>(`[data-avatar="${role}"]`);
        return el ? [[el, cum[at[k]]] as [HTMLElement, number]] : [];
      });
      svg.dataset.layout = L.narrow ? "narrow" : "wide";
      if (fontsReady) svg.dataset.ready = "true";
      if (fontsReady && !entered) {
        entered = true;
        if (!mq.matches && window.scrollY < 40) entry = { t0: performance.now() };
      }
      if (mq.matches) {
        sched = [];
        svg.dataset.mode = "static";
        line.style.strokeDasharray = "";
        line.style.strokeDashoffset = "";
        svg.dataset.drawn = "1";
        setActive(-1);
        return;
      }
      svg.dataset.mode = "scroll";
      line.style.strokeDasharray = `${svgLen} ${svgLen}`;
      sched = schedule(route.marks, (k) => cum[at[k]], L.maxScroll, L.vh);
      svg.dataset.schedule = sched.map((p) => Math.round(p.s)).join(" ");
      render();
    };

    // re-anchor on the very next frame after any layout change, so the line
    // never trails the reflowed text (no debounce gap during a resize)
    let rebuildRaf = 0;
    const scheduleRebuild = () => {
      if (!rebuildRaf)
        rebuildRaf = requestAnimationFrame(() => {
          rebuildRaf = 0;
          rebuild();
        });
    };
    const onScroll = () => {
      if (!raf && sched.length) raf = requestAnimationFrame(render);
    };

    rebuild();
    // anchor to the real letter only once the web font has rendered
    document.fonts?.ready
      .then(() => {
        fontsReady = true;
        rebuild();
      })
      .catch(() => {
        fontsReady = true;
        rebuild();
      });
    // ResizeObserver runs after layout and before paint: rebuilding here keeps the
    // line and the reflowed letter in the same frame
    const ro = new ResizeObserver(() => rebuild());
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleRebuild);
    window.addEventListener("load", rebuild);
    mq.addEventListener("change", rebuild);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rebuildRaf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleRebuild);
      window.removeEventListener("load", rebuild);
      mq.removeEventListener("change", rebuild);
      tug.destroy();
    };
  }, []);

  return (
    <>
      <svg ref={svgRef} className="scribble" aria-hidden="true" focusable="false" data-testid="scribble" data-ready="false">
        <defs>
          <linearGradient ref={gradRef} id="scribble-ink" gradientUnits="userSpaceOnUse">
            <stop offset="0.3" className="scribble__ink-start" />
            <stop offset="1" className="scribble__ink-end" />
          </linearGradient>
        </defs>
        <path ref={lineRef} className="scribble__path" d="" />
        <path ref={bridgeRef} className="scribble__bridge" d="" fill="url(#scribble-ink)" />
      </svg>
      {/* handles over the knots you can tug (filled by ThreadTug) */}
      <div ref={knotsRef} className="thread-knots" />
    </>
  );
}
