/**
 * The avatar poses the site uses — a small, stable selection from the
 * approved 85-pose pack in handoff/assets/avatar/ (originals untouched).
 * Files in public/assets/avatar/ are derived by scripts/build-avatars.mjs:
 * cropped to the artwork, resized, alpha kept. Dimensions below are the
 * exported files' own, so every image reserves its exact box.
 *
 * `anchors` are points on the artwork, in fractions of the image box, that
 * the page lines things up against: where she sits, where her feet meet the
 * ground, where her hand grips the thread. They were read off the exported
 * images on a 5% grid.
 */

export type Pose = {
  src: string;
  width: number;
  height: number;
  /** horizontal line the figure rests on (feet, seat or the edge she grips), 0–1 from the top */
  base: number;
  anchors?: Record<string, { x: number; y: number }>;
};

const p = (name: string, width: number, height: number, base: number, anchors?: Pose["anchors"]): Pose => ({
  src: `/assets/avatar/${name}.avif`,
  width,
  height,
  base,
  anchors,
});

export const poses = {
  // homepage
  /** 11.1 seated, matcha set down beside her; hands rest flat at seat level;
   * the cup stands at 2–18% across, its straw tip at 41% down */
  perched: p("break-01", 940, 1467, 0.62, { seatL: { x: 0.02, y: 0.625 }, seatR: { x: 0.97, y: 0.625 } }),
  /** 06.5 holding the knot aloft; the thread hangs from her raised fist */
  untangling: p("untangling-05", 420, 653, 0.985, { fist: { x: 0.14, y: 0.035 }, foot: { x: 0.2, y: 0.95 } }),
  /** 09.2 a face-and-hands peek from behind a right-hand edge, trimmed at
   * the drawn edge (the screen's edge stands in for it); her fingers curl
   * round it ~40% down; no legs or shoes — the figure ends in hair and jacket */
  edgePeek: p("peeking-02", 480, 1296, 1),
  /** 10.1 standing wave */
  waving: p("waving-01", 400, 776, 0.985),

  // detail pages
  typingDesk: p("typing-03", 380, 541, 0.985),
  notebook: p("idea-05", 300, 576, 0.985),
  copyStand: p("digitization-02", 380, 632, 0.985),
  archivalPaper: p("digitization-03", 400, 452, 0.97),
  snapping: p("idea-04", 300, 573, 0.985),
  laptopFloor: p("typing-01", 360, 438, 0.985),
  standingBook: p("reading-03", 300, 639, 0.985),
  lookingUp: p("thinking-02", 300, 606, 0.985),
  binoculars: p("fieldwork-02", 320, 591, 0.97),
  readingSeated: p("reading-01", 360, 429, 0.985),
  turningPage: p("reading-05", 300, 590, 0.985),
  raisedFinger: p("idea-01", 300, 514, 0.985),
  cheers: p("matcha-04", 300, 547, 0.985),
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof poses;

/**
 * One or two contextual figures per project page, each set beside the
 * section it belongs to — by heading, or "stream-id/heading" inside a
 * stream. AMNH's figures stay with the digitization stream: the mantis
 * research has no details yet, so nothing illustrates it.
 */
export const detailAvatars: Record<string, { section: string; pose: PoseName }[]> = {
  lynxster: [
    { section: "My work", pose: "typingDesk" },
    { section: "From implementation to explanation", pose: "notebook" },
  ],
  amnh: [
    { section: "collections-digitization/Overview", pose: "archivalPaper" },
    { section: "collections-digitization/Records, rigs, and workflows", pose: "copyStand" },
  ],
  "crackd-ai": [{ section: "My contribution", pose: "snapping" }],
  buzzworks: [{ section: "My contribution", pose: "laptopFloor" }],
  "tmu-citation-tooling": [{ section: "My contribution", pose: "standingBook" }],
  "inteli-lens": [{ section: "My contribution", pose: "lookingUp" }],
  "gvi-conservation": [{ section: "Overview", pose: "binoculars" }],
  "pmmy-research": [{ section: "Overview", pose: "readingSeated" }],
  "teenage-pregnancy-research": [{ section: "Overview", pose: "turningPage" }],
  "esp-teaching": [{ section: "My contribution", pose: "raisedFinger" }],
  "adi-mentorship": [{ section: "My contribution", pose: "cheers" }],
};
