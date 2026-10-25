// Derives the site's avatar images from the approved source pack.
//
//   handoff/assets/avatar/<action>/<pose>.png  (untouched originals)
//     → public/assets/avatar/<pose>.avif       (trimmed, resized, alpha kept)
//
// Each selected pose is cropped to its visible artwork (alpha > 8, plus a
// small transparent pad), resized to about twice its largest on-page width,
// and saved as AVIF with its alpha channel, so the gaps between the scribble
// loops stay transparent (less than half the size of the same WebP). Only the poses listed here are exported — the pack
// has 85; the site uses a handful. Prints the generated dimensions for
// src/content/avatars.ts. Usage: node scripts/build-avatars.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "handoff/assets/avatar";
const OUT = "public/assets/avatar";
// pose → width of the exported file in px (≈ 2× the largest CSS width), or
// { width, right }: also trimmed on the right at source pixel `right`
const POSES = {
  // homepage
  "11-break/break-01": 940,
  "06-untangling/untangling-05": 420,
  // trimmed at the drawn wall edge (source x 713): the screen's edge is her wall
  "09-peeking/peeking-02": { width: 480, right: 713 },
  "10-waving/waving-01": 400,
  // detail pages
  "01-typing/typing-03": 380,
  "05-idea/idea-05": 300,
  "14-digitization/digitization-02": 380,
  "14-digitization/digitization-03": 400,
  "05-idea/idea-04": 300,
  "01-typing/typing-01": 360,
  "07-reading/reading-03": 300,
  "03-thinking/thinking-02": 300,
  "13-fieldwork/fieldwork-02": 320,
  "07-reading/reading-01": 360,
  "07-reading/reading-05": 300,
  "05-idea/idea-01": 300,
  "02-matcha/matcha-04": 300,
};

mkdirSync(OUT, { recursive: true });
const rows = [];
for (const [pose, spec] of Object.entries(POSES)) {
  const width = typeof spec === "number" ? spec : spec.width;
  const rightLimit = typeof spec === "number" ? Infinity : spec.right;
  const src = `${SRC}/${pose}.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let [x0, y0, x1, y1] = [info.width, info.height, -1, -1];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  const pad = 6;
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  const w = Math.min(info.width, x1 + pad + 1, rightLimit) - left;
  const h = Math.min(info.height, y1 + pad + 1) - top;
  const name = pose.split("/")[1];
  const out = `${OUT}/${name}.avif`;
  const res = await sharp(src)
    .extract({ left, top, width: w, height: h })
    .resize({ width: Math.min(width, w) })
    .avif({ quality: 62, effort: 6 })
    .toFile(out);
  rows.push(`${name}: ${res.width}x${res.height} ${(res.size / 1024).toFixed(0)}KB (crop ${left},${top} ${w}x${h})`);
}
console.log(rows.join("\n"));

// The layered hero rig (public/assets/avatar/hero-interactions/, originals
// untouched): each layer is scaled UNIFORMLY with its full transparent canvas
// kept — never trimmed — because rig.json positions every layer by its whole
// image box. The page sizes the layers in stage percentages, so a smaller file
// changes nothing about the assembly. → public/assets/avatar/rig/<layer>.avif
const RIG_SRC = "public/assets/avatar/hero-interactions/layers";
const RIG_OUT = "public/assets/avatar/rig";
// layer → export scale (≈ 2× its largest on-page size)
const RIG = { body: 0.66, "leg-viewer-left": 0.6, "leg-viewer-right": 0.6, "forearm-matcha": 0.5 };
mkdirSync(RIG_OUT, { recursive: true });
const rigRows = [];
for (const [name, k] of Object.entries(RIG)) {
  const src = `${RIG_SRC}/${name}.png`;
  const meta = await sharp(src).metadata();
  const res = await sharp(src)
    .resize({ width: Math.round(meta.width * k), height: Math.round(meta.height * k), fit: "fill" })
    .avif({ quality: 64, effort: 6 })
    .toFile(`${RIG_OUT}/${name}.avif`);
  rigRows.push(`${name}: ${meta.width}x${meta.height} → ${res.width}x${res.height} ${(res.size / 1024).toFixed(0)}KB`);
}
console.log(rigRows.join("\n"));
