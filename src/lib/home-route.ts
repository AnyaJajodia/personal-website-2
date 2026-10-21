/**
 * Homepage line route.
 *
 * ONE path, authored in DOCUMENT coordinates from measured element rects:
 *
 *   final "a" of Anya → flows right over the (empty) avatar slot → rounded
 *   turn into the right margin → in beside the About heading → sweeps left
 *   above the career trajectory → through the five trajectory points → back
 *   to the margin → a knot beside "Two threads…" → the margin past the work,
 *   stitching in at each section boundary → loop and underline at "Say hello."
 *
 * The line never leaves the page: wherever content runs full width it keeps
 * to the margin (quiet, gently uneven), and it only steps into the page where
 * there is open space — beside headings and in the gaps between sections — so
 * some of it is always on screen.
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
  /** the empty slot held for a future avatar (zero rect when hidden) */
  heroSlot: Rect;
  heroIntro: Rect;
  heroCue: Rect;
  aboutHeading: Rect;
  trajBand: Rect;
  trajPoints: Rect[];
  trajEnd: Rect;
  currentLabel: Rect;
  currentHeading: Rect;
  features: Rect[];
  /** the two Currently cards together */
  featureRow: Rect;
  aboutBody: Rect;
  selectedLabel: Rect;
  selectedHeading: Rect;
  panels: Rect;
  moreLabel: Rect;
  moreIntro: Rect;
  bento: Rect;
  contact: Rect;
  contactHeading: Rect;
};

/** waypoint index `k` is reached when scrollY === s */
export type Mark = { k: number; s: number };
/** milestones: waypoint index where each trajectory point's shape begins;
 * guide: waypoint span [from, to] of the trajectory, faintly pre-drawn */
export type Route = { points: Pt[]; marks: Mark[]; milestones: number[]; guide?: [number, number] };

/**
 * Exit stroke of Cormorant Garamond 500 "a", relative to the end of the
 * glyph's advance on the baseline, in em, plus the stroke's angle above
 * horizontal. Measured from 4x renders at 208px and 94px (qa/measure-tail.mjs).
 */
export const A_TAIL = { dx: 0.0305, dy: -0.0496, angle: 0.45 };

const cx = (r: Rect) => r.left + r.width / 2;

/** Slant points like handwriting (positive = lean right) around baseline y0. */
function slant(points: Pt[], y0: number, k = 0.22): Pt[] {
  return points.map((p) => pt(p.x + (y0 - p.y) * k, p.y));
}

/** Loop drawn while travelling downwards; bulges to the right when side = 1. */
function vloop(x: number, y: number, rx: number, ry: number, side: 1 | -1 = 1, drift?: number): Pt[] {
  return loop(0, -ry, rx, ry, { drift: drift ?? rx * 0.9 }).map((p) => pt(x + side * -p.y, y + p.x));
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
  guide: [number, number] = [0, 0];
  /** the next waypoint starts the faint pre-drawn guide under the trajectory */
  guideFrom() {
    this.guide[0] = this.pts.length;
    return this;
  }
  /** the last waypoint ends it */
  guideTo() {
    this.guide[1] = this.pts.length - 1;
    return this;
  }
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

/** The quiet margin and the gestures that step in from it. */
class Margin {
  constructor(
    private P: Pen,
    private gx: number,
    private amp: number,
    private yAt: (y: number) => number,
  ) {}
  /** gently uneven travel down the margin, the pen tracking the scroll */
  run(y0: number, y1: number) {
    if (y1 - y0 < 40) return this;
    this.P.meander(this.gx, y0, y1, this.amp, 220, this.yAt);
    return this;
  }
  /** a stitch: in from the margin through an empty band between sections, and back */
  stitch(y0: number, y1: number, toX: number) {
    if (y1 - y0 < 50) return this;
    const ym = (y0 + y1) / 2;
    const d = this.gx - toX;
    this.P.to(pt(this.gx - d * 0.18, y0 + (y1 - y0) * 0.12), pt(toX + d * 0.08, ym - (y1 - y0) * 0.08));
    this.P.to(pt(toX, ym + (y1 - y0) * 0.06)).at(this.yAt(ym));
    this.P.to(pt(this.gx - d * 0.35, y1 - (y1 - y0) * 0.16), pt(this.gx, y1)).at(this.yAt(y1));
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
  const pen = 0.74; // where the pen sits in the viewport while the page scrolls
  const yAt = (y: number) => y - pen * vh;
  // the margin the line keeps beside full-width content
  const gx = L.contentRight + gw * 0.5;
  const M = new Margin(P, gx, clamp(gw * 0.09, 3, 9), yAt);

  // 1. out of the letter: start inside the tail so the join is seamless
  P.to(pt(A.x - dir.x * 0.06 * f, A.y - dir.y * 0.06 * f)).at(-1);
  P.to(A, pt(A.x + dir.x * 0.14 * f, A.y + dir.y * 0.14 * f));

  // 2. flow right with one handwritten loop, passing ABOVE the avatar slot
  //    (held empty for later) rather than through it
  const slot = L.heroSlot;
  const hasSlot = slot.width > 0 && slot.height > 0;
  const yc = hasSlot ? Math.min(A.y - 0.3 * f, slot.top - 40) : A.y - 0.3 * f;
  const ry = clamp(f * 0.15, 16, 32);
  const lx = hasSlot ? Math.min(A.x + (gx - A.x) * 0.3, slot.left - ry * 0.4) : A.x + (gx - A.x) * 0.3;
  P.to(pt(A.x + 0.4 * f, A.y - 0.2 * f), pt(lx - ry * 1.6, yc + ry * 0.55));
  P.to(...slant(loop(lx, yc - ry * 0.25, ry * 0.55, ry, { drift: ry * 0.7 }), yc + ry * 0.75));
  P.to(pt(lx + ry * 2.4, yc + ry * 0.35), pt(A.x + (gx - A.x) * 0.7, yc - 0.03 * f));

  // 3. a rounded turn down into the margin, past the slot
  const R = clamp(0.42 * f, 54, 92);
  P.to(pt(gx - R * 0.9, yc - 0.02 * f), pt(gx - R * 0.14, yc + R * 0.4), pt(gx, yc + R * 1.15));
  const h = L.hero;
  const below = hasSlot ? slot.bottom : h.top + vh * 0.55;
  // a slight hand sway on the way down, so the margin never reads as a rule
  const sway = clamp(gw * 0.12, 4, 9);
  const y0 = yc + R * 1.15;
  P.to(pt(gx + sway, y0 + (below - y0) * 0.3), pt(gx - sway * 0.6, y0 + (below - y0) * 0.62)).at(0);
  P.to(pt(gx + sway * 0.4, below - 10));
  // then in, through the hero's open lower right, to beside the About heading
  const AH = L.aboutHeading;
  const xa = clamp(Math.max(AH.right + 160, vw * 0.6), vw * 0.5, L.contentRight - 120);
  P.to(pt((gx + xa) / 2 + 30, below + 70), pt(xa + 20, h.bottom - vh * 0.08)).at(h.bottom - vh * 0.08 - pen * vh);
  P.to(pt(xa - 10, AH.top - 20));
  P.to(...vloop(xa + 6, AH.top + AH.height * 0.32, 11, 16, 1));
  P.to(pt(xa + 24, AH.top + AH.height * 0.72)).at(AH.top + AH.height * 0.5 - pen * vh);

  // 4. sweep left above the trajectory, U-turn, then through it left → right
  const c = L.trajPoints;
  const band = L.trajBand;
  const sweepY = band.top + 26;
  const ly = band.top + band.height - 24; // the trajectory's own line, close above the labels
  P.guideFrom().to(pt(xa + 30, sweepY - 40)).at(sweepY - 40 - 0.78 * vh);
  P.to(pt(xa - 20, sweepY - 4), pt(vw * 0.4, sweepY + 6));
  const cl = L.contentLeft;
  P.to(pt(cl + 70, sweepY + 1), pt(cl - 16, sweepY + 26), pt(cl - 24, (sweepY + ly) / 2 + 6), pt(cl + 6, ly - 8));

  if (c.length >= 5) {
    const xs = c.map(cx);
    const gap = xs[1] - xs[0];
    P.to(pt(xs[0] - 42, ly - 14));
    // 01 — the original plan: a small tangle
    P.mile().to(...knotShape(xs[0], ly - 24, 19, { turns: 2.6, phase: Math.PI * 0.9 }));
    P.to(pt(xs[0] + gap * 0.5, ly + 4));
    // 02–04 — stops on one line: a quiet crest over each point, nothing more
    for (const i of [1, 2, 3]) {
      P.mile().to(pt(xs[i] - 22, ly + 1), pt(xs[i], ly - 11), pt(xs[i] + 22, ly + 1));
      P.to(pt(xs[i] + gap * 0.5, ly + 3));
    }
    // 05 — Lynxster + AMNH: two threads wound together
    P.mile().to(...knotShape(xs[4], ly - 20, 14, { turns: 2, phase: Math.PI * 1.1 }));
    P.to(pt(xs[4] + gap * 0.45, ly + 6));
  }
  // still following the thread: on past the last point and back to the margin
  P.to(pt(cx(L.trajEnd), ly - 18)).at(band.top + band.height * 0.5 - 0.32 * vh).guideTo();
  P.to(pt(L.contentRight + gw * 0.2, ly + 16), pt(gx, ly + 80)).at(yAt(ly + 80));

  // 5. down the margin beside the About text, then a knot beside
  //    "Two threads I'm following." — the one gesture in Currently
  const C = L.currentHeading;
  M.run(ly + 80, C.top - 50);
  const r = 22;
  const kx = Math.max(C.right + 140, L.contentRight - 230);
  const ky = C.top + C.height * 0.45;
  P.to(pt(gx - 16, C.top - 14), pt(kx + r * 2.6, ky - r * 1.8)).at(yAt(ky - r * 1.8));
  P.to(...knotShape(kx, ky, r, { turns: 2.6, phase: 0, dir: -1 }));
  const F = L.featureRow;
  P.to(pt(kx + r * 2.2, ky + r * 2), pt(gx - 6, F.top + 4)).at(yAt(F.top + 4));

  // 6. where the work dominates, the line keeps quietly to the margin —
  //    stepping in only through the empty band between sections
  M.run(F.top + 4, F.bottom + 10);
  const W = L.panels;
  M.stitch(F.bottom + 10, W.top - 12, L.contentRight - clamp(vw * 0.1, 70, 150));
  M.run(W.top - 12, W.bottom + 10);
  // More: the intro sits on the right at wide widths, so the stitch stays above it
  const mi = L.moreIntro;
  const B = L.bento;
  const introRight = mi.width > 0 && mi.left > vw * 0.4;
  M.stitch(W.bottom + 10, (introRight ? mi.top : B.top) - 14, L.contentRight - clamp(vw * 0.08, 60, 120));
  M.run((introRight ? mi.top : B.top) - 14, B.bottom + 10);

  // 7. the ending: in for "Say hello.", one loop past the full stop, and it
  //    comes to rest as an underline beneath the words
  const K = L.contactHeading;
  M.run(B.bottom + 10, K.top - 90);
  const kr = clamp(K.height * 0.2, 16, 30);
  const lp = K.right + Math.min(90, (vw - K.right) * 0.18);
  const uy = K.top + K.height * 1.1;
  P.to(pt(gx - 20, K.top - 50), pt(K.right + Math.min(320, (vw - K.right) * 0.6), K.top - 20)).at(yAt(K.top - 20));
  P.to(pt(lp + kr * 2.4, K.top + K.height * 0.3));
  P.to(...slant(loop(lp, K.top + K.height * 0.62 - kr, kr * 0.55, kr, { dir: -1, drift: kr * 0.8 }), K.top + K.height * 0.62));
  P.to(pt(lp - kr * 1.4, K.top + K.height * 0.8), pt(K.right - 6, uy - 2));
  P.to(pt(K.left + K.width * 0.55, uy + 5), pt(K.left + 18, uy + 1), pt(K.left - 4, uy - 12)).at(Number.POSITIVE_INFINITY);
  return { points: P.pts, marks: P.marks, milestones: P.miles, guide: P.guide };
}

/* -------------------------------------------------------------- narrow */

function narrowRoute(L: HomeLayout): Route {
  const P = new Pen();
  const { vh, vw } = L;
  const f = L.nameSize;
  const { tip: A, dir } = tailTip(L);
  const gw = vw - L.contentRight;
  const gx = L.contentRight + gw * 0.5;
  const yAt = (y: number) => y - 0.74 * vh;
  const M = new Margin(P, gx, clamp(gw * 0.14, 2, 7), yAt);

  P.to(pt(A.x - dir.x * 0.06 * f, A.y - dir.y * 0.06 * f)).at(-1);
  P.to(A, pt(A.x + dir.x * 0.13 * f, A.y + dir.y * 0.13 * f));
  const W0 = gx - A.x;
  const yc = A.y - 0.28 * f;
  if (W0 > 140) {
    const ry = clamp(f * 0.15, 10, 18);
    const lx = A.x + W0 * 0.42;
    P.to(pt(lx - ry * 1.6, yc + ry * 0.6));
    P.to(...slant(loop(lx, yc - ry * 0.25, ry * 0.55, ry, { drift: ry * 0.7 }), yc + ry * 0.75));
    P.to(pt(lx + ry * 2.2, yc + ry * 0.3));
  } else {
    P.to(pt(A.x + W0 * 0.5, yc + 4));
  }
  // the flourish turns down into the margin (the slot above the name stays clear) …
  const H = L.aboutHeading;
  P.to(pt(gx - 16, yc + 2), pt(gx, yc + 34)).at(0);
  // … keeps to it past the intro, and sweeps in below the About heading
  M.run(yc + 34, H.bottom - 6);
  const c = L.trajPoints;
  const lx = L.contentLeft + 16;
  const sweepY = H.bottom + 28;
  P.guideFrom().to(pt(gx - 14, sweepY - 6), pt(vw * 0.55, sweepY + 6)).at(yAt(sweepY));
  if (c.length >= 5) {
    const ys = c.map((r) => r.top + 16);
    const step = ys[1] - ys[0];
    P.to(pt(lx + 40, ys[0] - 34));
    P.mile().to(...knotShape(lx + 4, ys[0], 11, { turns: 2.6, phase: -Math.PI / 2 }));
    P.to(pt(lx - 2, ys[0] + step * 0.5)).at(yAt(ys[0] + step * 0.5));
    for (const i of [1, 2, 3]) {
      P.mile().to(pt(lx - 1, ys[i] - 14), pt(lx + 9, ys[i]), pt(lx - 1, ys[i] + 14));
      P.to(pt(lx, ys[i] + step * 0.5)).at(yAt(ys[i] + step * 0.5));
    }
    P.mile().to(...knotShape(lx + 3, ys[4], 10, { turns: 2, phase: -Math.PI / 2 }));
    P.to(pt(lx, ys[4] + step * 0.5));
  }
  // across under the last point, back to the margin beside the About text
  const exitY = (L.trajEnd.bottom + L.aboutBody.top) / 2;
  P.to(pt(lx + 2, L.trajEnd.top + L.trajEnd.height * 0.5), pt(lx + 30, exitY)).at(yAt(exitY)).guideTo();
  // the crossing gets its own stretch of scroll so it is drawn, not flicked
  P.to(pt(vw * 0.55, exitY + 4), pt(gx - 16, exitY + 2), pt(gx, exitY + 30)).at(yAt(exitY) + 0.2 * vh);

  // a knot beside "Two threads…", then the margin past the work, stitching in
  // through the empty bands between sections
  const C = L.currentHeading;
  const ky = C.top + C.height * 0.5;
  const kr = 13;
  const kxx = Math.max(C.right + kr * 3, L.contentRight - kr * 3);
  M.run(exitY + 30, C.top - 40);
  P.to(pt(gx - 6, ky - 44), pt(kxx + kr * 1.6, ky - kr * 1.9)).at(yAt(ky - kr * 1.9));
  P.to(...knotShape(kxx, ky, kr, { turns: 2.4, dir: -1 }));
  const F = L.featureRow;
  P.to(pt(kxx + kr * 1.6, ky + kr * 2), pt(gx, F.top + 4)).at(yAt(F.top + 4));
  M.run(F.top + 4, F.bottom + 8);
  const Wp = L.panels;
  const depth = clamp(vw * 0.16, 50, 110);
  M.stitch(F.bottom + 8, Wp.top - 10, L.contentRight - depth);
  M.run(Wp.top - 10, Wp.bottom + 8);
  const mh = L.moreLabel;
  M.stitch(Wp.bottom + 8, Math.max(mh.bottom, L.moreIntro.top - 10), L.contentRight - depth);
  const B = L.bento;
  M.run(Math.max(mh.bottom, L.moreIntro.top - 10), B.bottom + 8);

  // the ending under "Say hello."
  const K = L.contactHeading;
  M.run(B.bottom + 8, K.top - 60);
  const Wk = vw - K.right;
  const uy = K.top + K.height * 1.1;
  P.to(pt(gx - 4, K.top - 26)).at(yAt(K.top - 26));
  if (Wk > 80) {
    const lr = clamp(K.height * 0.2, 10, 16);
    const lp = K.right + Math.min(38, Wk * 0.42);
    P.to(pt(lp + lr * 2, K.top + K.height * 0.35));
    P.to(...slant(loop(lp, K.top + K.height * 0.62 - lr, lr * 0.55, lr, { dir: -1, drift: lr * 0.8 }), K.top + K.height * 0.62));
  }
  P.to(pt(K.right - 4, uy - 2), pt(K.left + K.width * 0.5, uy + 4), pt(K.left + 12, uy), pt(K.left - 2, uy - 10)).at(Number.POSITIVE_INFINITY);
  return { points: P.pts, marks: P.marks, milestones: P.miles, guide: P.guide };
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
