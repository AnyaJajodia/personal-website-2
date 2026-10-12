/**
 * Homepage line route.
 *
 * ONE path, authored in DOCUMENT coordinates from measured element rects:
 *
 *   final "a" of Anya → flows right → rounded turn down the right side →
 *   sweeps left above the career trajectory → U-turn → through the five
 *   trajectory points → down the margin past Currently / Selected work / More
 *   (stepping in beside headings) → flourish by "Say hello." → leaves.
 *
 * The path never moves (so its start stays welded to the letter). What scroll
 * controls is how much of it is drawn: every `mark` pins a waypoint to the
 * scroll position at which the pen reaches it; between marks the drawn length
 * is interpolated by arc length. Reverse scroll retracts it; idle holds it.
 */

import { type Pt, pt, loop, knotShape, clamp } from "./line-geometry";

export type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

export type HomeLayout = {
  vw: number;
  vh: number;
  maxScroll: number;
  /** narrow layouts: vertical trajectory, edge-hugging continuation */
  narrow: boolean;
  contentLeft: number;
  contentRight: number;
  /** computed font-size of the hero name */
  nameSize: number;
  /** end of the final "a" of "Anya" (advance edge), on its baseline */
  nameEnd: Pt;
  hero: Rect;
  heroIntro: Rect;
  heroCue: Rect;
  aboutHeading: Rect;
  trajBand: Rect;
  trajPoints: Rect[];
  trajEnd: Rect;
  currentLabel: Rect;
  currentHeading: Rect;
  features: Rect[];
  selectedLabel: Rect;
  selectedHeading: Rect;
  panels: Rect;
  moreLabel: Rect;
  contact: Rect;
  contactHeading: Rect;
};

/** waypoint index `k` is reached when scrollY === s */
export type Mark = { k: number; s: number };
/** milestones: waypoint index where each trajectory point's shape begins */
export type Route = { points: Pt[]; marks: Mark[]; milestones: number[] };

/**
 * Exit stroke of Cormorant Garamond 500 "a", relative to the end of the
 * glyph's advance on the baseline, in em, plus the stroke's angle above
 * horizontal. Measured from 4x renders at 208px and 94px (qa/measure-tail.mjs).
 */
export const A_TAIL = { dx: 0.0305, dy: -0.0496, angle: 0.45 };

const cx = (r: Rect) => r.left + r.width / 2;
const cy = (r: Rect) => r.top + r.height / 2;

/** Slant points like handwriting (positive = lean right) around baseline y0. */
function slant(points: Pt[], y0: number, k = 0.22): Pt[] {
  return points.map((p) => pt(p.x + (y0 - p.y) * k, p.y));
}

/** Loop drawn while travelling downwards; bulges to the right when side = 1. */
function vloop(x: number, y: number, rx: number, ry: number, side: 1 | -1 = 1, drift?: number): Pt[] {
  return loop(0, -ry, rx, ry, { drift: drift ?? rx * 0.9 }).map((p) => pt(x + side * -p.y, y + p.x));
}

/** A small run of cursive loops travelling right, varied so they don't look stamped. */
function cursive(x: number, base: number, ry: number, count: number): Pt[] {
  const sizes = [0.86, 1, 0.92, 0.8];
  const pts: Pt[] = [];
  let px = x;
  for (let i = 0; i < count; i++) {
    const r = ry * sizes[i % sizes.length];
    pts.push(...slant(loop(px, base - r, r * 0.52, r, { drift: r * 0.5 }), base));
    px += r * 0.95;
  }
  return pts;
}

export function tailTip(L: HomeLayout): { tip: Pt; dir: Pt } {
  const f = L.nameSize;
  return {
    tip: pt(L.nameEnd.x + A_TAIL.dx * f, L.nameEnd.y + A_TAIL.dy * f),
    dir: pt(Math.cos(A_TAIL.angle), -Math.sin(A_TAIL.angle)),
  };
}

class Pen {
  pts: Pt[] = [];
  marks: Mark[] = [];
  miles: number[] = [];
  /** the next waypoint starts a trajectory milestone */
  mile() {
    this.miles.push(this.pts.length);
    return this;
  }
  to(...p: Pt[]) {
    this.pts.push(...p);
    return this;
  }
  /** the pen reaches the last waypoint at scroll position s */
  at(s: number) {
    this.marks.push({ k: this.pts.length - 1, s });
    return this;
  }
  /** Gentle S-curves along x between y0 and y1 (never a ruled line). */
  meander(x: number, y0: number, y1: number, amp: number, wave: number, markAt?: (y: number) => number) {
    const n = Math.max(1, Math.round((y1 - y0) / (wave / 2)));
    for (let i = 1; i <= n; i++) {
      const y = y0 + ((y1 - y0) * i) / n;
      // irregular amplitude so it reads as a hand, not a sine wave
      const a = amp * (i % 2 ? 1 : -0.75) * (0.8 + 0.2 * Math.sin(i * 1.7));
      this.to(pt(x + (i === n ? 0 : a), y));
      if (markAt) this.at(markAt(y));
    }
    return this;
  }
}

/* ---------------------------------------------------------------- wide */

function wideRoute(L: HomeLayout): Route {
  const P = new Pen();
  const { vh, vw } = L;
  const f = L.nameSize;
  const { tip: A, dir } = tailTip(L);
  const gw = vw - L.contentRight;
  const g = gw >= 64 ? L.contentRight + gw * 0.5 : vw - Math.max(10, gw * 0.45);
  const amp = clamp(gw * 0.22, 5, 24);
  const pen = 0.74; // where the pen sits in the viewport while the page scrolls

  // 1. out of the letter: start inside the tail so the join is seamless
  P.to(pt(A.x - dir.x * 0.06 * f, A.y - dir.y * 0.06 * f)).at(-1);
  P.to(A, pt(A.x + dir.x * 0.14 * f, A.y + dir.y * 0.14 * f));

  // 2. flow right at about x-height, one handwritten loop on the way
  const xr = Math.min(L.contentRight - 24, vw * 0.88);
  const yc = A.y - 0.3 * f;
  const ry = clamp(f * 0.15, 16, 32);
  const lx = A.x + (xr - A.x) * 0.34;
  P.to(pt(A.x + 0.4 * f, A.y - 0.2 * f), pt(lx - ry * 1.6, yc + ry * 0.55));
  P.to(...slant(loop(lx, yc - ry * 0.25, ry * 0.55, ry, { drift: ry * 0.7 }), yc + ry * 0.75));
  P.to(pt(lx + ry * 2.4, yc + ry * 0.35), pt(A.x + (xr - A.x) * 0.68, yc - 0.03 * f));

  // 3. a rounded turn down the right side, then an unhurried S through the
  //    open space beside the intro
  const R = clamp(0.42 * f, 54, 92);
  P.to(pt(xr - R * 0.85, yc - 0.02 * f), pt(xr - R * 0.12, yc + R * 0.38), pt(xr + 4, yc + R * 1.15));
  const xin = Math.max(L.heroIntro.right + 140, vw * 0.7, xr - 150);
  const h = L.hero;
  P.to(pt(xr - 14, h.top + vh * 0.52));
  P.to(...vloop((xr + xin) / 2, h.top + vh * 0.62, 15, 21, -1));
  P.to(pt(xr - 4, h.top + vh * 0.8)).at(0);
  // no ruled margin: a broad sway into the open space beside the About
  // heading, with one small loop, before the sweep
  const AH = L.aboutHeading;
  P.to(pt(xr + 14, h.bottom - vh * 0.06));
  P.to(pt(xr - 34, AH.top - 46));
  P.to(...vloop(xr - 58, AH.top + AH.height * 0.3, 11, 16, -1));
  P.to(pt(xr - 40, AH.top + AH.height * 0.62)).at(AH.top + AH.height * 0.5 - pen * vh);

  // 4. sweep left above the trajectory, U-turn, then through it left → right
  const c = L.trajPoints;
  const band = L.trajBand;
  const sweepY = band.top + 26;
  const ly = band.top + band.height - 24; // the trajectory's own line, close above the labels
  const R2 = 64;
  P.to(pt(xr - 2, sweepY - R2 * 1.3)).at(sweepY - R2 * 1.3 - 0.78 * vh);
  P.to(pt(xr - R2 * 0.55, sweepY - 6), pt(vw * 0.62, sweepY + 7), pt(vw * 0.4, sweepY - 5));
  const cl = L.contentLeft;
  P.to(pt(cl + 70, sweepY + 1), pt(cl - 16, sweepY + 26), pt(cl - 24, (sweepY + ly) / 2 + 6), pt(cl + 6, ly - 8));

  if (c.length >= 5) {
    const xs = c.map(cx);
    const gap = xs[1] - xs[0];
    P.to(pt(xs[0] - 46, ly - 16));
    // 01 — the original plan: a tangle
    P.mile().to(...knotShape(xs[0], ly - 30, 26, { turns: 3.3, phase: Math.PI * 0.9 }));
    P.to(pt(xs[0] + gap * 0.48, ly + 12));
    // 02 — one clear loop
    P.mile().to(...slant(loop(xs[1], ly - 30, 15, 30), ly));
    P.to(pt(xs[1] + gap * 0.5, ly - 4));
    // 03 — one interest became several
    P.mile().to(...cursive(xs[2] - 26, ly + 2, 29, 3));
    P.to(pt(xs[2] + gap * 0.42, ly + 12));
    // 04 — a wide loop that swings back over earlier ground
    P.mile().to(pt(xs[3] + gap * 0.08, ly - 6), pt(xs[3] - gap * 0.18, ly - 56), pt(xs[3] - gap * 0.6, ly - 44));
    P.to(pt(xs[3] - gap * 0.4, ly - 8), pt(xs[3] + gap * 0.05, ly + 10), pt(xs[3] + gap * 0.5, ly - 2));
    // 05 — Lynxster + AMNH: two threads wound together
    P.mile().to(...knotShape(xs[4], ly - 26, 17, { turns: 2.2, phase: Math.PI * 1.1 }));
    P.to(pt(xs[4] + gap * 0.45, ly + 8));
  }
  // still following the thread: on past the last point, then a rounded turn down
  P.to(pt(cx(L.trajEnd), ly - 18)).at(band.top + band.height * 0.5 - 0.32 * vh);
  P.to(pt(g - 26, ly - 14), pt(g + 2, ly + 34));

  // 5. released into the work sections, along the margin with rounded swings
  const yAt = (y: number) => y - pen * vh;
  P.meander(g, ly + 34, L.currentLabel.top - 110, amp, 420, yAt);
  // Currently: a knot beside "Two threads I'm following."
  const C = L.currentHeading;
  const r = 22;
  const kx = clamp(C.right + 150, C.right + 90, L.contentRight - 70);
  const ky = C.top + C.height * 0.45;
  P.to(pt(g - 14, L.currentLabel.top - 44), pt(kx + r * 2.6, ky - r * 1.8)).at(yAt(ky - r * 1.8));
  P.to(...knotShape(kx, ky, r, { turns: 2.6, phase: 0, dir: -1 }));
  P.to(pt(kx + r * 1.8, ky + r * 2.1)).at(yAt(ky) + 120);
  P.to(pt(g, C.bottom + 70));
  const fb = L.features.length ? Math.max(...L.features.map((x) => x.bottom)) : C.bottom + 300;
  const ft = L.features.length ? Math.min(...L.features.map((x) => x.top)) : C.bottom + 60;
  P.meander(g, C.bottom + 70, (ft + fb) / 2 - 40, amp, 380, yAt);
  P.to(...vloop(g + 2, (ft + fb) / 2 - 14, 10, 14, -1));
  P.meander(g, (ft + fb) / 2 + 30, L.selectedLabel.top - 110, amp, 380, yAt);

  // Selected work: loops beside the heading (or in the label row if tight)
  const S = L.selectedHeading;
  const useHeading = L.contentRight - S.right > 280;
  const base = useHeading ? S.top + S.height * 0.62 : cy(L.selectedLabel) + 12;
  const sx = useHeading ? S.right + 80 : Math.max(L.contentRight - 220, L.selectedLabel.right + 40);
  P.to(pt(g - 16, base - 90), pt(sx - 20, base + 2)).at(yAt(base));
  P.to(...cursive(sx, base + 4, 23, 3));
  P.to(pt(sx + 3 * 23 + 40, base + 10)).at(yAt(base) + 90);
  P.to(pt(g, base + 110));
  P.meander(g, base + 110, L.panels.bottom - 30, amp, 400, yAt);

  // More: one loose loop in the open band between the panels and the More rule
  const gapTop = L.panels.bottom;
  const gapBot = L.moreLabel.top;
  const my = (gapTop + gapBot) / 2 + 8;
  const ry2 = clamp((gapBot - gapTop) * 0.2, 14, 26);
  const mx = clamp(vw * 0.8, L.contentLeft + 200, L.contentRight - 60);
  P.to(pt(g - 14, gapTop + 16), pt(mx + ry2 * 2.4, my - ry2 * 0.6)).at(yAt(my));
  P.to(...slant(loop(mx, my - ry2, ry2 * 0.55, ry2, { dir: -1, drift: ry2 * 0.7 }), my));
  P.to(pt(mx - ry2 * 1.6, my + ry2 * 0.3), pt(g - 30, gapBot - 4), pt(g, gapBot + 60)).at(yAt(my) + 90);
  P.meander(g, gapBot + 60, L.contact.top - 150, amp, 400, yAt);

  // Contact: sweep in above the label row, drop beside "Say hello.", leave quietly
  const K = L.contactHeading;
  const kb = K.top + K.height * 0.62;
  const kxs = K.right + Math.min(110, (vw - K.right) * 0.2);
  P.to(pt(g - 10, L.contact.top - 110), pt(vw * 0.6, L.contact.top - 30)).at(yAt(L.contact.top - 30));
  P.to(pt(kxs - 10, K.top + K.height * 0.1), pt(kxs - 24, kb - 6), pt(kxs - 6, kb + 6));
  P.to(...cursive(kxs + 14, kb + 6, clamp(K.height * 0.24, 16, 28), 3));
  P.to(pt(kxs + 150, kb + 14), pt(kxs + 320, kb - 4), pt(vw + 60, kb - 26)).at(Number.POSITIVE_INFINITY);
  return { points: P.pts, marks: P.marks, milestones: P.miles };
}

/* -------------------------------------------------------------- narrow */

function narrowRoute(L: HomeLayout): Route {
  const P = new Pen();
  const { vh, vw } = L;
  const f = L.nameSize;
  const { tip: A, dir } = tailTip(L);
  const gw = vw - L.contentRight;
  const edge = vw - Math.max(8, gw * 0.42);
  const off = vw + 36;
  const yAt = (y: number) => y - 0.74 * vh;

  P.to(pt(A.x - dir.x * 0.06 * f, A.y - dir.y * 0.06 * f)).at(-1);
  P.to(A, pt(A.x + dir.x * 0.13 * f, A.y + dir.y * 0.13 * f));
  const W = edge - A.x;
  const yc = A.y - 0.28 * f;
  if (W > 140) {
    const ry = clamp(f * 0.15, 10, 18);
    const lx = A.x + W * 0.42;
    P.to(pt(lx - ry * 1.6, yc + ry * 0.6));
    P.to(...slant(loop(lx, yc - ry * 0.25, ry * 0.55, ry, { drift: ry * 0.7 }), yc + ry * 0.75));
    P.to(pt(lx + ry * 2.2, yc + ry * 0.3));
  } else {
    P.to(pt(A.x + W * 0.5, yc + 4));
  }
  // rounded turn down the right edge
  P.to(pt(edge - 20, yc - 2), pt(edge - 3, yc + 22), pt(edge, yc + 60));
  const h = L.hero;
  const y80 = Math.max(yc + 90, h.top + vh * 0.8);
  P.meander(edge, yc + 60, y80, Math.min(gw * 0.18, 6), 260);
  P.at(0);
  // past the cue and heading just inside the edge, then sweep left into the
  // open gap under "A fairly straightforward career trajectory."
  const H = L.aboutHeading;
  P.meander(edge, y80, H.bottom - 6, Math.min(gw * 0.18, 6), 300, yAt);
  const c = L.trajPoints;
  const lx = L.contentLeft + 16;
  const sweepY = H.bottom + 28;
  P.to(pt(edge - 18, sweepY - 4), pt(vw * 0.55, sweepY + 6)).at(yAt(sweepY));
  if (c.length >= 5) {
    const ys = c.map((r) => r.top + 16);
    const step = ys[1] - ys[0];
    P.to(pt(lx + 40, ys[0] - 34));
    P.mile().to(...knotShape(lx + 4, ys[0], 13, { turns: 3, phase: -Math.PI / 2 }));
    P.to(pt(lx - 2, ys[0] + step * 0.5)).at(yAt(ys[0] + step * 0.5));
    P.mile().to(...vloop(lx, ys[1] - 8, 9, 13));
    P.to(pt(lx + 2, ys[1] + step * 0.45)).at(yAt(ys[1] + step * 0.45));
    P.mile().to(...vloop(lx, ys[2] - 16, 7, 10), ...vloop(lx, ys[2] + 2, 8, 12));
    P.to(pt(lx - 1, ys[2] + step * 0.5)).at(yAt(ys[2] + step * 0.5));
    // revisit: swing back up before continuing
    P.mile().to(pt(lx + 8, ys[3] + 6), pt(lx + 22, ys[3] - step * 0.35), pt(lx + 6, ys[3] - step * 0.55));
    P.to(pt(lx - 6, ys[3] - step * 0.2), pt(lx, ys[3] + step * 0.3)).at(yAt(ys[3] + step * 0.3));
    P.mile().to(...knotShape(lx + 4, ys[4], 11, { turns: 2.2, phase: -Math.PI / 2 }));
    P.to(pt(lx, ys[4] + step * 0.5));
  }
  const exitY = L.trajEnd.bottom + 30;
  P.to(pt(lx + 2, L.trajEnd.top + L.trajEnd.height * 0.5), pt(lx + 30, exitY)).at(yAt(exitY));
  P.to(pt(vw * 0.55, exitY + 6), pt(edge - 14, exitY + 2), pt(edge + 4, exitY + 40));

  // the thread slips just past the edge and steps back in beside headings
  P.to(pt(off, exitY + 140), pt(off, L.currentLabel.top - 140)).at(yAt(L.currentLabel.top - 140));
  const ky = cy(L.currentLabel);
  P.to(pt(vw - 20, ky - 40), pt(vw - 30, ky - 16));
  P.to(...knotShape(vw - 46, ky, 14, { turns: 2.4, dir: -1 }));
  P.to(pt(vw - 14, ky + 34)).at(yAt(ky) + 80);
  P.to(pt(off, ky + 80), pt(off, L.selectedLabel.top - 120)).at(yAt(L.selectedLabel.top - 120));
  const sy = cy(L.selectedLabel) + 8;
  const sx = Math.max(L.selectedLabel.right + 30, vw - 120);
  P.to(pt(vw - 20, sy - 50), pt(sx - 14, sy + 2));
  P.to(...cursive(sx, sy + 4, 14, 3));
  P.to(pt(vw - 10, sy + 10)).at(yAt(sy) + 70);
  P.to(pt(off, sy + 50), pt(off, L.moreLabel.top - 120)).at(yAt(L.moreLabel.top - 120));
  const my = cy(L.moreLabel) + 6;
  const mx = Math.max(L.moreLabel.right + 40, vw - 90);
  P.to(pt(vw - 16, my - 44), pt(mx + 22, my - 8));
  P.to(...slant(loop(mx, my - 14, 8, 14, { dir: -1, drift: 10 }), my));
  P.to(pt(vw - 8, my + 18)).at(yAt(my) + 60);
  const K = L.contactHeading;
  P.to(pt(off, my + 70), pt(off, K.top - 120)).at(yAt(K.top - 120));
  const kb = K.top + K.height * 0.6;
  const Wk = vw - K.right;
  const kxs = K.right + Math.min(30, Wk * 0.18);
  P.to(pt(vw - 16, K.top - 40), pt(kxs - 6, kb + 2));
  P.to(...cursive(kxs + 8, kb + 4, clamp(K.height * 0.22, 12, 18), Wk > 150 ? 3 : 2));
  P.to(pt(vw + 50, kb - 18)).at(Number.POSITIVE_INFINITY);
  return { points: P.pts, marks: P.marks, milestones: P.miles };
}

/* ---------------------------------------------------------- composition */

export function buildRoute(L: HomeLayout): Route {
  return L.narrow ? narrowRoute(L) : wideRoute(L);
}

/**
 * Turn a route's marks into a monotonic scroll → arc-length schedule.
 * `lenAt[k]` is the arc length of the dense path at waypoint k.
 * Guarantees: starts drawn through the hero mark at scroll 0; never faster
 * than `maxRate` px of line per px of scroll; fully drawn at the bottom.
 */
export function schedule(marks: Mark[], lenAt: (k: number) => number, maxScroll: number, vh: number, maxRate = 14) {
  const out: { s: number; len: number }[] = marks.map((m) => ({ s: m.s, len: lenAt(m.k) }));
  out.sort((a, b) => a.len - b.len);
  for (let i = 1; i < out.length; i++) {
    const minGap = (out[i].len - out[i - 1].len) / maxRate;
    if (i === 1) continue; // the first span (letter → hero mark) is drawn before any scrolling
    out[i].s = Math.max(out[i].s, out[i - 1].s + minGap);
  }
  // squeeze whatever would land past the bottom into the last stretch of scroll
  const end = maxScroll;
  const lastOk = out.findLastIndex((p, i) => i > 0 && p.s <= end - 0.22 * vh);
  if (lastOk > 0 && lastOk < out.length - 1) {
    const s0 = out[lastOk].s;
    const l0 = out[lastOk].len;
    const l1 = out[out.length - 1].len;
    for (let i = lastOk + 1; i < out.length; i++) out[i].s = s0 + ((out[i].len - l0) / (l1 - l0 || 1)) * (end - s0);
  }
  out[out.length - 1].s = Math.max(out[out.length - 1].s === Number.POSITIVE_INFINITY ? end : out[out.length - 1].s, end);
  return out;
}
