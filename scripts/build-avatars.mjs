// Derives the site's avatar images from the approved source pack.
//
//   handoff/assets/avatar/<action>/<pose>.png  (untouched originals)
//     → public/assets/avatar/<pose>.webp       (trimmed, resized, alpha kept)
//
// Each selected pose is cropped to its visible artwork (alpha > 8, plus a
// small transparent pad), resized to about twice its largest on-page width,
// and saved as WebP with full-quality alpha, so the gaps between the scribble
// loops stay transparent. Only the poses listed here are exported — the pack
// has 85; the site uses a handful. Prints the generated dimensions for
// src/content/avatars.ts. Usage: node scripts/build-avatars.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "handoff/assets/avatar";
const OUT = "public/assets/avatar";
// pose → width of the exported file in px (≈ 2× the largest CSS width)
const POSES = {
  // homepage
  "11-break/break-01": 620,
  "15-map/map-04": 280,
  "06-untangling/untangling-05": 340,
  "09-peeking/peeking-03": 400,
  "08-photography/photography-03": 300,
  "10-waving/waving-01": 300,
  "07-reading/reading-04": 400,
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
for (const [pose, width] of Object.entries(POSES)) {
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
  const w = Math.min(info.width, x1 + pad + 1) - left;
  const h = Math.min(info.height, y1 + pad + 1) - top;
  const name = pose.split("/")[1];
  const out = `${OUT}/${name}.webp`;
  const res = await sharp(src)
    .extract({ left, top, width: w, height: h })
    .resize({ width: Math.min(width, w) })
    .webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(out);
  rows.push(`${name}: ${res.width}x${res.height} ${(res.size / 1024).toFixed(0)}KB (crop ${left},${top} ${w}x${h})`);
}
console.log(rows.join("\n"));
