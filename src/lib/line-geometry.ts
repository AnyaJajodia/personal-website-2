/**
 * Small geometry toolkit for the hand-drawn line.
 *
 * Poses are authored as waypoint lists. A centripetal Catmull-Rom spline turns
 * them into a smooth dense polyline, which is then resampled to a fixed number
 * of points spaced evenly by arc length. Because every pose has the same point
 * count and the same parameterisation, any two poses can be interpolated point
 * by point — that is what lets one line morph between compositions.
 */

export type Pt = { x: number; y: number };

export const pt = (x: number, y: number): Pt => ({ x, y });

/** Centripetal Catmull-Rom (alpha = 0.5) through all waypoints. */
export function spline(points: Pt[], samplesPerSegment = 14): Pt[] {
  if (points.length < 2) return points.slice();
  const out: Pt[] = [];
  const p = [extrapolate(points[1], points[0]), ...points, extrapolate(points[points.length - 2], points[points.length - 1])];
  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
    const t0 = 0;
    const t1 = t0 + knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    for (let s = 0; s < samplesPerSegment; s++) {
      const t = t1 + ((t2 - t1) * s) / samplesPerSegment;
      out.push(catmull(p0, p1, p2, p3, t0, t1, t2, t3, t));
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/**
 * Same spline, but sampled densely enough that long segments stay smooth
 * (about one sample every `spacing` px), and returning the dense index of
 * every waypoint so callers can attach data (e.g. a scroll schedule) to them.
 */
export function splineIndexed(points: Pt[], spacing = 5): { dense: Pt[]; at: number[] } {
  const dense: Pt[] = [];
  const at: number[] = [];
  if (points.length < 2) return { dense: points.slice(), at: points.map((_, i) => i) };
  const p = [extrapolate(points[1], points[0]), ...points, extrapolate(points[points.length - 2], points[points.length - 1])];
  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
    const t1 = knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    const n = Math.min(80, Math.max(3, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / spacing)));
    at.push(dense.length);
    for (let s = 0; s < n; s++) dense.push(catmull(p0, p1, p2, p3, 0, t1, t2, t3, t1 + ((t2 - t1) * s) / n));
  }
  at.push(dense.length);
  dense.push(points[points.length - 1]);
  return { dense, at };
}

function extrapolate(from: Pt, to: Pt): Pt {
  return { x: to.x + (to.x - from.x), y: to.y + (to.y - from.y) };
}

function knot(a: Pt, b: Pt) {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return Math.max(Math.sqrt(d), 1e-4);
}

function catmull(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t0: number, t1: number, t2: number, t3: number, t: number): Pt {
  const lerpT = (a: Pt, b: Pt, ta: number, tb: number) => {
    const w = (t - ta) / (tb - ta);
    return { x: a.x + (b.x - a.x) * w, y: a.y + (b.y - a.y) * w };
  };
  const a1 = lerpT(p0, p1, t0, t1);
  const a2 = lerpT(p1, p2, t1, t2);
  const a3 = lerpT(p2, p3, t2, t3);
  const b1 = lerpT(a1, a2, t0, t2);
  const b2 = lerpT(a2, a3, t1, t3);
  return lerpT(b1, b2, t1, t2);
}

/** Resample a polyline to exactly n points evenly spaced by arc length. */
export function resample(poly: Pt[], n: number): Pt[] {
  const cum: number[] = [0];
  for (let i = 1; i < poly.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].y - poly[i - 1].y));
  }
  const total = cum[cum.length - 1] || 1;
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (j < cum.length - 1 && cum[j] < target) j++;
    const seg = cum[j] - cum[j - 1] || 1;
    const w = Math.min(1, Math.max(0, (target - cum[j - 1]) / seg));
    out.push({
      x: poly[j - 1].x + (poly[j].x - poly[j - 1].x) * w,
      y: poly[j - 1].y + (poly[j].y - poly[j - 1].y) * w,
    });
  }
  return out;
}

export function lerpPoints(a: Pt[], b: Pt[], t: number, out?: Pt[]): Pt[] {
  const res = out ?? new Array<Pt>(a.length);
  for (let i = 0; i < a.length; i++) {
    res[i] = { x: a[i].x + (b[i].x - a[i].x) * t, y: a[i].y + (b[i].y - a[i].y) * t };
  }
  return res;
}

/** Smooth SVG path through points using quadratic curves between midpoints. */
export function toPath(points: Pt[], offsetY = 0): string {
  if (points.length < 2) return "";
  const f = (v: number) => Math.round(v * 10) / 10;
  let d = `M${f(points[0].x)} ${f(points[0].y - offsetY)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const q = points[i + 1];
    d += `Q${f(p.x)} ${f(p.y - offsetY)} ${f((p.x + q.x) / 2)} ${f((p.y + q.y) / 2 - offsetY)}`;
  }
  const last = points[points.length - 1];
  d += `L${f(last.x)} ${f(last.y - offsetY)}`;
  return d;
}

/**
 * A cursive loop (like a handwritten "ℓ") while travelling in `dir`.
 * Starts and ends at the bottom of the loop; `drift` moves the exit along.
 */
export function loop(cx: number, cy: number, rx: number, ry: number, opts: { drift?: number; steps?: number; dir?: 1 | -1 } = {}): Pt[] {
  const { drift = rx * 0.9, steps = 9, dir = 1 } = opts;
  const pts: Pt[] = [];
  for (let s = 0; s <= steps; s++) {
    const u = s / steps;
    // bottom → forward side → top → back side → bottom (one full turn)
    const a = Math.PI / 2 - u * Math.PI * 2;
    pts.push({ x: cx + dir * (rx * Math.cos(a) + drift * (u - 0.5)), y: cy + ry * Math.sin(a) });
  }
  return pts;
}

/**
 * A tangled knot: several overlapping turns whose centre wanders, like a pen
 * circling the same spot. Deterministic so it never jitters between frames.
 */
export function knotShape(cx: number, cy: number, r: number, opts: { turns?: number; steps?: number; phase?: number; dir?: 1 | -1 } = {}): Pt[] {
  const { turns = 3, steps = 34, phase = 0, dir = 1 } = opts;
  const pts: Pt[] = [];
  const n = Math.round(steps * turns);
  for (let s = 0; s <= n; s++) {
    const th = phase + dir * (s / steps) * Math.PI * 2;
    const wob = 0.38 * r;
    const rr = r * (0.78 + 0.22 * Math.sin(th * 0.5 + 1.3));
    pts.push({
      x: cx + rr * Math.cos(th) + wob * Math.cos(-0.62 * th + phase),
      y: cy + rr * Math.sin(th) * 0.92 + wob * Math.sin(-0.62 * th + phase),
    });
  }
  return pts;
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function easeInOut(t: number) {
  // gentle cubic in/out
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
