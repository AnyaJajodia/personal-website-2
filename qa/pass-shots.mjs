// Design-pass evidence: full pages cut into viewable frames.
// Usage: BASE_URL=... node qa/pass-shots.mjs <outdir> [slug ...]
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const [outDir = "qa/screenshots/pass22", ...only] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const slugs = only.length ? only : ["crackd-ai", "buzzworks", "tmu-citation-tooling", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
const b = await chromium.launch({ channel: "chrome" });
async function full(slug, width, theme) {
  const ctx = await b.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, colorScheme: theme, isMobile: width < 700, hasTouch: width < 700 });
  const p = await ctx.newPage();
  await p.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await p.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), y); await p.waitForTimeout(70); }
  await p.waitForTimeout(1800);
  await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(300);
  const buf = await p.screenshot({ fullPage: true });
  await ctx.close();
  return { buf, H };
}
for (const slug of slugs) {
  // desktop light: 1440 x 1800 frames
  const d = await full(slug, 1440, "light");
  const meta = await sharp(d.buf).metadata();
  for (let y = 0, i = 0; y < meta.height; y += 1800, i++) {
    const h = Math.min(1800, meta.height - y);
    await sharp(d.buf).extract({ left: 0, top: y, width: 1440, height: h }).toFile(`${outDir}/${slug}-d${i}.png`);
  }
  // phone dark: columns of 2000px side by side, 4 per sheet
  const m = await full(slug, 390, "dark");
  const mm = await sharp(m.buf).metadata();
  const cols = [];
  for (let y = 0; y < mm.height; y += 2000) cols.push(await sharp(m.buf).extract({ left: 0, top: y, width: mm.width, height: Math.min(2000, mm.height - y) }).toBuffer());
  for (let s = 0; s < cols.length; s += 4) {
    const group = cols.slice(s, s + 4);
    const sheet = sharp({ create: { width: 4 * (mm.width + 20), height: 2000, channels: 3, background: "#777" } });
    await sheet.composite(group.map((c, i) => ({ input: c, left: i * (mm.width + 20), top: 0 }))).png().toFile(`${outDir}/${slug}-m${s / 4}.png`);
  }
  console.log(slug, "desktop", Math.ceil(meta.height / 1800), "frames; phone", Math.ceil(cols.length / 4), "sheets");
}
await b.close();
