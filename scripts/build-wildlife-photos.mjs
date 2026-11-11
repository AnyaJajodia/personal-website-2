// Reads the Wildlife photography collection — it never writes, resizes or
// re-encodes a photograph. The supplied files in
// public/assets/wildlife-photography/ are the ones the page serves.
//
//   src/content/wildlife-photos.json            (the collection: files, copy, sequence)
//     → src/content/wildlife-photos.generated.json   (each file's pixel size + loading tone)
//
// Tone: each photograph is sampled at 72 px in memory and read in OKLab/OKLCH;
// its dominant hue (weighted by chroma, so a blue sky outvotes grey bark) at a
// fixed, quiet lightness colours its place while the photograph loads, so the
// page arrives as soft colour rather than grey boxes. One tone per theme.
//
// It also fails if a listed file is missing, a photograph is listed twice in
// the sequence, or a file in the folders is not in the collection.
//
// Usage: node scripts/build-wildlife-photos.mjs   (after adding or replacing a photograph)
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";

const SRC = "public/assets/wildlife-photography";
const MANIFEST = "src/content/wildlife-photos.json";
const GENERATED = "src/content/wildlife-photos.generated.json";

// ---------------------------------------------------------------- colour
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function rgbToOklab(r, g, b) {
  [r, g, b] = [r / 255, g / 255, b / 255].map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklchToRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return rgb.map((c) => Math.round(Math.min(1, Math.max(0, gam(c))) * 255));
}
/** largest chroma ≤ C that is still inside sRGB at this L and h */
function inGamut(L, C, h) {
  for (let c = C; c > 0; c -= 0.002) {
    const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    if (rgb.every((v) => v >= -0.0005 && v <= 1.0005)) return c;
  }
  return 0;
}
const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

/** a tone (OKLCH, clamped to sRGB) of hue h */
const tone = (L, C, h) => {
  const c = inGamut(L, C, h);
  return { css: hex(oklchToRgb(L, c, h)), L, C: +c.toFixed(4), h: Math.round(h) };
};

async function tonesOf(path) {
  const { data, info } = await sharp(path).rotate().resize(72, 72, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // chroma-weighted hue histogram (10° bins), plus the overall mean
  const bins = new Float64Array(36);
  let sumL = 0, sumC = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const [L, a, b] = rgbToOklab(data[i], data[i + 1], data[i + 2]);
    const C = Math.hypot(a, b);
    const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    // very dark and very pale pixels say little about the photograph's colour
    const w = C * (L > 0.12 && L < 0.97 ? 1 : 0.2);
    bins[Math.floor(h / 10) % 36] += w;
    sumL += L;
    sumC += C;
    n++;
  }
  // smooth over neighbouring bins, then take the peak
  let best = 0, bestV = -1;
  for (let i = 0; i < 36; i++) {
    const v = bins[(i + 35) % 36] * 0.5 + bins[i] + bins[(i + 1) % 36] * 0.5;
    if (v > bestV) [best, bestV] = [i, v];
  }
  // refine: chroma-weighted mean hue inside the peak's ±15°
  let x = 0, y = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const [L, a, b] = rgbToOklab(data[i], data[i + 1], data[i + 2]);
    const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    const d = Math.abs(((h - (best * 10 + 5) + 540) % 360) - 180);
    if (d <= 15) {
      x += a * (L > 0.12 && L < 0.97 ? 1 : 0.2);
      y += b * (L > 0.12 && L < 0.97 ? 1 : 0.2);
    }
  }
  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const meanL = sumL / n, meanC = sumC / n;
  // how colourful the background may be: a muted photograph keeps a muted page
  const k = Math.min(1, meanC / 0.08);
  return {
    hue: Math.round(hue),
    meanL: +meanL.toFixed(3),
    meanC: +meanC.toFixed(3),
    // the tile's colour while its photograph loads (no text sits on it)
    light: tone(0.84, 0.02 + 0.05 * k, hue),
    dark: tone(0.32, 0.02 + 0.04 * k, hue),
  };
}

// ---------------------------------------------------------------- read
const m = JSON.parse(readFileSync(MANIFEST, "utf8"));
const generated = {};
let failures = 0;
const fail = (msg) => {
  console.error(msg);
  failures++;
};

for (const [id, p] of Object.entries(m.photos)) {
  const src = `${SRC}/${p.file}`;
  if (!existsSync(src)) {
    fail(`missing file for "${id}": ${src}`);
    continue;
  }
  const meta = await sharp(src).metadata();
  const swap = (meta.orientation ?? 1) >= 5; // EXIF rotation by 90°: displayed sideways
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const tones = await tonesOf(src);
  generated[p.file] = { width, height, bytes: statSync(src).size, tone: { light: tones.light.css, dark: tones.dark.css } };
  console.log(`${id.padEnd(22)} ${p.file.padEnd(40)} ${String(width).padStart(5)}×${String(height).padEnd(5)} ${(statSync(src).size / 1048576).toFixed(1)} MB  ${tones.light.css} / ${tones.dark.css}`);
}

// the sequence: every photograph once (hero first, outside the rows)
const seq = [m.hero, ...m.rows.flatMap((r) => r.photos.flat())];
for (const id of seq) if (!m.photos[id]) fail(`sequence names an unknown photograph: ${id}`);
const dupes = seq.filter((id, i) => seq.indexOf(id) !== i);
if (dupes.length) fail(`listed more than once: ${dupes.join(", ")}`);
for (const id of Object.keys(m.photos)) if (!seq.includes(id)) fail(`not placed in the sequence: ${id}`);
for (const id of [m.homepage].flat()) if (!m.photos[id]) fail(`homepage preview names an unknown photograph: ${id}`);
// every supplied file is in the collection
const listed = new Set(Object.values(m.photos).map((p) => p.file));
for (const dir of readdirSync(SRC)) {
  if (!statSync(`${SRC}/${dir}`).isDirectory()) continue;
  for (const f of readdirSync(`${SRC}/${dir}`)) if (/\.(png|jpe?g|webp|avif)$/i.test(f) && !listed.has(`${dir}/${f}`)) fail(`supplied but not in the collection: ${dir}/${f}`);
}

writeFileSync(GENERATED, JSON.stringify(generated, null, 2) + "\n");
console.log(`\n${seq.length} photographs in sequence → ${GENERATED}`);
if (failures) {
  console.error(`${failures} problem(s)`);
  process.exit(1);
}
