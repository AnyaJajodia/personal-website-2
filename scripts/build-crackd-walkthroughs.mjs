// Prepares the Crackd walkthrough screenshots for public display.
//
//   handoff/assets/crackd-source/<app>/<name>.png   (unchanged originals — never served)
//     → public/assets/crackd/<app>/<name>-<w>.webp  (prepared copies, the only ones rendered)
//
// Every change is deterministic and listed below with its reason, so the
// preparation is reviewable and reversible (edit a rule, rerun). Two kinds:
//   crop — trims an edge (used only to remove macOS capture thumbnails);
//   blur — a strong blur over a rectangle (account details, private-marked
//          records). Nothing is painted in or replaced: the interface and its
//          labels stay, the obscured values simply can't be read.
// Coordinates are in the originals' pixels (2048 × 1114).
//
// `PERSONAL_PHOTO` covers one photograph that the admin app marks Private; it
// also appears as the account's own upload in the user app. It is obscured
// everywhere for consistency. Set it to false to show it (after confirming it
// may be published) and rerun.
//
// Usage: node scripts/build-crackd-walkthroughs.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "handoff/assets/crackd-source";
const OUT = "public/assets/crackd";
const WIDTHS = [1280, 2048];
const PERSONAL_PHOTO = true;

// shared regions
const userAccount = { blur: [37, 1028, 153, 43], why: "account ID in the sidebar footer" };
const adminEmail = { blur: [24, 996, 214, 30], why: "signed-in email" };
const matrixName = { blur: [1575, 16, 168, 42], why: "signed-in account name" };
const photo = (r, why = "photograph from a record marked Private") => (PERSONAL_PHOTO ? [{ blur: r, why, sigma: 26 }] : []);

const RULES = {
  "user-app/01-home.png": [userAccount],
  "user-app/02-voting.png": [userAccount],
  "user-app/03-upload.png": [
    userAccount,
    { crop: { bottom: 968 }, why: "macOS capture thumbnail (bottom right, over empty background)" },
    ...photo([624, 729, 74, 75], "thumbnail of the selected personal photograph"),
  ],
  "user-app/04-generation-progress.png": [userAccount],
  "user-app/05-caption-results.png": [
    userAccount,
    // the dimmed "Your Captions" grid behind the viewer shows the same personal uploads
    ...(PERSONAL_PHOTO ? [{ blur: [373, 139, 1368, 936], why: "dimmed personal uploads behind the viewer", sigma: 22, except: [591, 168, 866, 778] }] : []),
    ...photo([823, 213, 402, 535]),
  ],
  "user-app/06-highlights.png": [
    userAccount,
    ...[481, 885, 1289, 1693].flatMap((x) => [...photo([x - 8, 262, 200, 256]), ...photo([x - 8, 762, 200, 256])]),
  ],

  "admin-app/01-caption-inspection.png": [
    adminEmail,
    // the two rows marked PRIVATE: thumbnails, captions, and the expanded record's identifiers
    { blur: [486, 326, 85, 85], why: "private record: thumbnail", sigma: 18 },
    { blur: [598, 352, 640, 36], why: "private record: caption" },
    { blur: [486, 453, 85, 85], why: "private record: thumbnail", sigma: 18 },
    { blur: [598, 479, 540, 36], why: "private record: caption" },
    { blur: [509, 633, 376, 33], why: "private record: caption ID" },
    { blur: [999, 633, 386, 33], why: "private record: image ID" },
  ],
  "admin-app/02-image-details.png": [
    adminEmail,
    // the expanded record is marked PRIVATE: its photograph, identifiers and generated description
    { blur: [486, 326, 85, 85], why: "private record: thumbnail", sigma: 18 },
    { blur: [598, 355, 115, 30], why: "private record: image ID" },
    { blur: [494, 456, 512, 382], why: "private record: photograph", sigma: 26 },
    { blur: [490, 861, 414, 56], why: "private record: profile and image IDs" },
    { blur: [1244, 506, 676, 224], why: "private record: generated description of the private photograph" },
  ],
  "admin-app/03-opener-statistics.png": [adminEmail],
  "admin-app/04-caption-popularity.png": [adminEmail],
  "admin-app/05-flavor-step-details.png": [{ blur: [20, 1017, 205, 28], why: "signed-in email" }],

  "matrix/01-flavor-library.png": [matrixName],
  "matrix/02-prompt-chain.png": [matrixName],
  "matrix/03-test-set.png": [matrixName],
  "matrix/04-run-progress.png": [matrixName, { crop: { bottom: 975 }, why: "macOS capture thumbnail (bottom right, over the progress list)" }],
  "matrix/05-caption-gallery.png": [matrixName],
};

async function prepare(file, rules) {
  let img = sharp(`${SRC}/${file}`);
  const { width, height } = await img.metadata();
  let buf = await img.png().toBuffer();
  const layers = [];
  for (const r of rules.filter((x) => x.blur)) {
    const [left, top, w, h] = r.blur;
    let patch = await sharp(buf).extract({ left, top, width: w, height: h }).blur(r.sigma ?? 12).toBuffer();
    if (r.except) {
      // keep a rectangle inside the region sharp (the foreground panel), blurring around it
      const [ex, ey, ew, eh] = r.except;
      const keep = await sharp(buf).extract({ left: ex, top: ey, width: ew, height: eh }).toBuffer();
      patch = await sharp(patch).composite([{ input: keep, left: ex - left, top: ey - top }]).toBuffer();
    }
    layers.push({ input: patch, left, top, order: r.except ? 0 : 1 });
  }
  // blurred backdrops first, then the sharper-edged blurs inside them
  layers.sort((a, b) => a.order - b.order);
  for (const l of layers) buf = await sharp(buf).composite([{ input: l.input, left: l.left, top: l.top }]).png().toBuffer();
  const crop = rules.find((x) => x.crop)?.crop;
  const outH = crop?.bottom ?? height;
  if (crop) buf = await sharp(buf).extract({ left: 0, top: 0, width, height: outH }).png().toBuffer();
  const stem = file.replace(/\.png$/, "");
  mkdirSync(`${OUT}/${stem.split("/")[0]}`, { recursive: true });
  for (const w of WIDTHS) {
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 86, effort: 6, smartSubsample: true }).toFile(`${OUT}/${stem}-${w}.webp`);
  }
  return { file, width, height: outH, changes: rules.length };
}

for (const [file, rules] of Object.entries(RULES)) {
  const r = await prepare(file, rules);
  console.log(`${r.file}: ${r.width}×${r.height}, ${r.changes} change(s)`);
}
