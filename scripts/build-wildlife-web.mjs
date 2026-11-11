// Derives the Wildlife photography collection's web sizes.
//
//   public/assets/wildlife-photography/<folder>/<name>.png      (Anya's originals, untouched)
//     → public/assets/wildlife-web/<folder>-<name>-<w>.webp
//     → src/content/wildlife-photos.web.json                     (each file's widths)
//
// The originals are 3–5 MB each (44 MB for the page); these are the same
// photographs, only scaled down and re-encoded (WebP, sRGB, quality 88; the
// largest at the original's own pixel size, quality 92) for the gallery's and
// the homepage's responsive srcset — a tile loads the size it is shown at, and
// the opened view the full one. Nothing is cropped or retouched.
//
// Usage: node scripts/build-wildlife-web.mjs   (after build-wildlife-photos.mjs)
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";

const SRC = "public/assets/wildlife-photography";
const OUT = "public/assets/wildlife-web"; // beside, not inside, the supplied collection
const WIDTHS = [480, 800, 1200, 1600];
const generated = JSON.parse(readFileSync("src/content/wildlife-photos.generated.json", "utf8"));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const out = {};
let before = 0, after = 0;
for (const [file, g] of Object.entries(generated)) {
  const stem = file.replace(/\.[^.]+$/, "").replace(/\//g, "-");
  // steps well below the original, then the original's own size
  const widths = [...WIDTHS.filter((w) => w <= g.width * 0.85), g.width];
  before += g.bytes;
  for (const w of widths) {
    const full = w === g.width;
    const info = await sharp(`${SRC}/${file}`)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .toColourspace("srgb")
      .webp({ quality: full ? 92 : 88, smartSubsample: true, effort: 6 })
      .toFile(`${OUT}/${stem}-${w}.webp`);
    if (full) after += info.size;
  }
  out[file] = { stem, widths };
  console.log(`${file}: ${g.width}×${g.height} → ${widths.join(", ")}`);
}
writeFileSync("src/content/wildlife-photos.web.json", JSON.stringify(out, null, 2) + "\n");
console.log(`originals ${(before / 1e6).toFixed(1)} MB → full-size web copies ${(after / 1e6).toFixed(1)} MB`);
