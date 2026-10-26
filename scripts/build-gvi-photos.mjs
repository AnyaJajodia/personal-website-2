// Derives the GVI page's photographs for the web.
//
//   public/assets/gvi/<name>.<JPG|png>         (Anya's originals, untouched)
//     → public/assets/gvi/web/<name>-<w>.webp  (resized, sRGB, metadata stripped)
//
// Each photograph is exported at a few widths (never larger than the source)
// for the page's responsive srcset (components/gvi/PhotoSlot.tsx). Nothing is
// cropped or retouched: the files keep the supplied framing, and the
// community photograph keeps its face-obscuring edits exactly as supplied —
// it is only scaled down. Prints the widths for src/content/gvi-photos.ts.
// Usage: node scripts/build-gvi-photos.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "public/assets/gvi";
const OUT = "public/assets/gvi/web";
const WIDTHS = [480, 800, 1200, 1600, 2400];
const PHOTOS = ["gvi-lioness-relocation.JPG", "gvi-cheetah-observation.png", "gvi-community-learning.JPG"];

mkdirSync(OUT, { recursive: true });
for (const file of PHOTOS) {
  const stem = file.replace(/\.[^.]+$/, "");
  const src = sharp(`${SRC}/${file}`).rotate(); // honour any EXIF orientation
  const { width, height } = await src.metadata();
  const widths = [...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))].filter((w, i, a) => a.indexOf(w) === i);
  for (const w of widths) {
    await sharp(`${SRC}/${file}`)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .toColourspace("srgb")
      .webp({ quality: 82, smartSubsample: true, effort: 6 })
      .toFile(`${OUT}/${stem}-${w}.webp`);
  }
  console.log(`${stem}: ${width}×${height} → ${widths.join(", ")}`);
}
