/**
 * The layered hero avatar, ported from the supplied rig
 * (public/assets/avatar/hero-interactions/rig.json; originals untouched).
 *
 * Every layer is placed on a 1300×1600 stage by its whole image box (the
 * transparent padding is part of the calibration), at the rig's display
 * scale — the legs deliberately use different x/y scales. Pivots are joint
 * positions on the stage. Draw order: legs behind the forearm, both behind
 * the body. Served files (public/assets/avatar/rig/*.avif, from
 * scripts/build-avatars.mjs) are uniformly scaled copies, so the geometry
 * below — in source pixels — still applies.
 */

export const STAGE = { width: 1300, height: 1600 };

export type RigLayer = {
  key: "leg-viewer-left" | "leg-viewer-right" | "forearm-matcha" | "body";
  src: string;
  /** source image size */
  width: number;
  height: number;
  /** display scale on the stage */
  sx: number;
  sy: number;
  /** top-left on the stage */
  x: number;
  y: number;
  /** joint the layer turns about, on the stage */
  pivot: [number, number];
  z: number;
  /** served file size (uniformly scaled), for the img's intrinsic size */
  file: [number, number];
};

// bump REV when a layer's source changes, so no cached copy of the old one is used
const REV = "2";
const src = (k: string) => `/assets/avatar/rig/${k}.avif?v=${REV}`;

export const RIG: RigLayer[] = [
  { key: "leg-viewer-left", src: src("leg-viewer-left"), width: 1024, height: 1536, sx: 0.62, sy: 0.42, x: 172.56, y: 811.86, pivot: [470, 1030], z: 1, file: [614, 922] },
  { key: "leg-viewer-right", src: src("leg-viewer-right"), width: 1024, height: 1536, sx: 0.62, sy: 0.42, x: 489.42, y: 820.26, pivot: [795, 1030], z: 2, file: [614, 922] },
  { key: "forearm-matcha", src: src("forearm-matcha"), width: 1226, height: 1283, sx: 0.4, sy: 0.4, x: 700, y: 476, pivot: [885, 780], z: 3, file: [613, 642] },
  { key: "body", src: src("body"), width: 1024, height: 1536, sx: 1, sy: 1, x: 80, y: 0, pivot: [0, 0], z: 4, file: [676, 1014] },
];

/** where the figure sits on the line: her resting hand (left) and the
 * jacket's edge at the seat (right), measured on the assembled stage */
export const SEAT = { left: [205, 1000] as const, right: [985, 975] as const };

/** the straw's tip, for the fizz on a cheers */
export const STRAW = [1110, 500] as const;

/** visible artwork bounds on the stage (alpha > 20), for layout checks */
export const FIGURE = { left: 136, top: 16, right: 1176, bottom: 1439 };

/** the supplied motion limits (legs ≈ 2–2.5°, cheers ≤ 9°), kept well inside:
 * [offset, degrees, easing into the next key]. The feet swing like a
 * pendulum that loses energy; the cheers rises quickly, holds, and settles. */
export type Key = [number, number, string?];
const swingEase = "cubic-bezier(0.37, 0, 0.63, 1)"; // sine in-out: a pendulum
export const SWING = {
  left: [[0, 0, "cubic-bezier(0.3, 0, 0.5, 1)"], [0.22, -2.2, swingEase], [0.5, 1.6, swingEase], [0.76, -0.6, swingEase], [1, 0]] as Key[],
  right: [[0, 0, "cubic-bezier(0.3, 0, 0.5, 1)"], [0.22, 1.9, swingEase], [0.5, -1.4, swingEase], [0.76, 0.5, swingEase], [1, 0]] as Key[],
  ms: 1500,
};
/** a gentle start, decelerating into the raise; a short hold; an unhurried return */
export const CHEERS = {
  keys: [[0, 0, "cubic-bezier(0.25, 0.1, 0.25, 1)"], [0.3, -7, "linear"], [0.56, -7, "cubic-bezier(0.45, 0, 0.35, 1)"], [1, 0]] as Key[],
  ms: 1500,
};

export const pct = (v: number, of: number) => `${(v / of) * 100}%`;
