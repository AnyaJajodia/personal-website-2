/**
 * Tuggable knots on the homepage line.
 *
 * Each knot the route records (Route.knots) gets an invisible 44px button
 * laid over it. The line itself never moves as a whole: a tug displaces only
 * the dense points within reach of that knot, weighted by a smooth falloff,
 * so the path stays one continuous stroke and nothing around it moves.
 *
 *   mouse / pen   press and drag: the knot follows with resistance (soft
 *                 clamp, at most MAX px), and on release springs back with
 *                 a small elastic overshoot
 *   hover         a light pluck
 *   tap / Enter / Space   a pluck (a touch never drags, so it never blocks
 *                 page scrolling)
 *   arrow keys    a tug in that direction
 *
 * A spring per knot runs only while something is moving, then stops.
 * With prefers-reduced-motion no handles are made.
 */

import { toPath, type Pt } from "./line-geometry";
import type { Knot } from "./home-route";

const MAX = 34; // px, the furthest a knot can be pulled
const STIFF = 170;
const DAMP = 9;

type State = {
  knot: Knot;
  el: HTMLButtonElement;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  held: boolean;
  tx: number;
  ty: number;
};

const LABELS: Record<string, string> = {
  hero: "Tug the loop in the thread",
  first: "Tug the first knot in the thread",
  now: "Tug the knot at Lynxster and AMNH",
  hello: "Tug the loop by Say hello",
};

export class ThreadTug {
  private dense: Pt[] = [];
  private states = new Map<string, State>();
  private raf = 0;
  private last = 0;
  private gone = false;

  constructor(
    private layer: HTMLElement,
    private line: SVGPathElement,
    private reduced: MediaQueryList,
  ) {}

  /** a new route: keep the line's points, place (or remove) the handles */
  setPath(dense: Pt[], knots: Knot[]) {
    if (this.gone) return; // a late rebuild (fonts ready) after unmount
    this.dense = dense;
    const ids = new Set(knots.map((k) => k.id));
    for (const [id, st] of this.states)
      if (!ids.has(id) || this.reduced.matches) {
        st.el.remove();
        this.states.delete(id);
      }
    if (this.reduced.matches) return;
    for (const k of knots) {
      let st = this.states.get(k.id);
      if (!st) {
        st = {
          knot: k,
          el: this.makeHandle(k.id),
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          held: false,
          tx: 0,
          ty: 0,
        };
        this.states.set(k.id, st);
      }
      st.knot = k;
      const size = Math.max(44, Math.min(72, k.r * 2.2));
      st.el.style.left = `${k.x - size / 2}px`;
      st.el.style.top = `${k.y - size / 2}px`;
      st.el.style.width = st.el.style.height = `${size}px`;
    }
    if ([...this.states.values()].some((s) => s.dx || s.dy)) this.draw();
  }

  destroy() {
    this.gone = true;
    cancelAnimationFrame(this.raf);
    this.states.forEach((s) => s.el.remove());
    this.states.clear();
  }

  private makeHandle(id: string) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "thread-knot";
    el.dataset.knot = id;
    el.setAttribute("aria-label", LABELS[id] ?? "Tug the thread");
    let start: { x: number; y: number } | null = null;
    let dragged = false;
    const st = () => this.states.get(id)!;

    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse" && !start) this.pluck(st(), 0, 70);
    });
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY };
      dragged = false;
      el.setPointerCapture(e.pointerId);
      const s = st();
      s.held = true;
      s.tx = s.dx;
      s.ty = s.dy;
      el.dataset.held = "true";
      this.run();
    });
    el.addEventListener("pointermove", (e) => {
      if (!start) return;
      const rx = e.clientX - start.x;
      const ry = e.clientY - start.y;
      const m = Math.hypot(rx, ry);
      if (m > 3) dragged = true;
      // resistance: the further you pull, the less it gives
      const k = m ? (MAX * Math.tanh(m / (MAX * 1.6))) / m : 0;
      const s = st();
      s.tx = rx * k;
      s.ty = ry * k;
      this.run();
    });
    const release = () => {
      if (!start) return;
      start = null;
      const s = st();
      s.held = false;
      delete el.dataset.held;
      this.run();
    };
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("lostpointercapture", release);
    el.addEventListener("click", (e) => {
      // a drag already did its work; a tap, a click or Enter/Space plucks
      if (dragged) {
        dragged = false;
        e.preventDefault();
        return;
      }
      this.pluck(st(), 0, 240);
    });
    el.addEventListener("keydown", (e) => {
      const dir: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      const d = dir[e.key];
      if (!d) return;
      e.preventDefault();
      this.pluck(st(), d[0] * 300, d[1] * 300);
    });
    el.addEventListener("focus", () => {
      if (el.matches(":focus-visible")) this.pluck(st(), 0, 60);
    });
    this.layer.appendChild(el);
    return el;
  }

  private pluck(s: State, vx: number, vy: number) {
    if (this.reduced.matches || s.held) return;
    s.vx += vx;
    s.vy += vy;
    this.run();
  }

  private run() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.step);
  }

  private step = (now: number) => {
    this.raf = 0;
    const dt = Math.min(0.034, (now - this.last) / 1000);
    this.last = now;
    let moving = false;
    for (const s of this.states.values()) {
      if (s.held) {
        // follow the pointer closely, but never jump
        s.vx = (s.tx - s.dx) / Math.max(dt, 0.008);
        s.vy = (s.ty - s.dy) / Math.max(dt, 0.008);
        s.dx += (s.tx - s.dx) * 0.45;
        s.dy += (s.ty - s.dy) * 0.45;
        moving = true;
        continue;
      }
      s.vx += (-STIFF * s.dx - DAMP * s.vx) * dt;
      s.vy += (-STIFF * s.dy - DAMP * s.vy) * dt;
      s.dx += s.vx * dt;
      s.dy += s.vy * dt;
      // keep even a hard pluck within reach
      const m = Math.hypot(s.dx, s.dy);
      if (m > MAX) {
        s.dx *= MAX / m;
        s.dy *= MAX / m;
      }
      if (Math.abs(s.dx) + Math.abs(s.dy) < 0.05 && Math.abs(s.vx) + Math.abs(s.vy) < 0.5) {
        s.dx = s.dy = s.vx = s.vy = 0;
      } else moving = true;
    }
    this.draw();
    if (moving) this.raf = requestAnimationFrame(this.step);
  };

  /** displace the points near each pulled knot; everything else stays put */
  private draw() {
    const active = [...this.states.values()].filter((s) => s.dx || s.dy);
    if (!active.length) {
      this.line.setAttribute("d", toPath(this.dense));
      return;
    }
    const out = this.dense.map((p) => {
      let x = p.x;
      let y = p.y;
      for (const s of active) {
        const reach = Math.max(70, s.knot.r * 3);
        const d = Math.hypot(p.x - s.knot.x, p.y - s.knot.y);
        if (d >= reach) continue;
        const t = 1 - (d / reach) * (d / reach);
        const w = t * t;
        x += s.dx * w;
        y += s.dy * w;
      }
      return { x, y };
    });
    this.line.setAttribute("d", toPath(out));
  }
}
