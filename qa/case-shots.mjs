// Viewport frames of a case-study page's sections, for viewing.
// Usage: BASE_URL=... node qa/case-shots.mjs <slug> <width> <light|dark> [selector ...]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const [slug, w = "1440", theme = "light", ...sels] = process.argv.slice(2);
const width = +w;
const height = width < 700 ? 844 : 900;
const out = `qa/screenshots/${slug}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, isMobile: width < 700, hasTouch: width < 700 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
// walk the page once so scroll-cued figures and marks have arrived
const H = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 600) {
  await page.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), y);
  await page.waitForTimeout(60);
}
for (const sel of sels.length ? sels : ["header.detail-hero"]) {
  const ok = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: "instant" });
    return true;
  }, sel);
  if (!ok) {
    console.log("missing", sel);
    continue;
  }
  await page.waitForTimeout(500);
  const name = sel.replace(/[^a-z0-9-]+/gi, "") || "top";
  await page.screenshot({ path: `${out}/${width}-${theme}-${name}.png` });
}
console.log(`${slug} ${width} ${theme}: ${errors.length} console errors ${errors.slice(0, 2).join(" | ")}`);
await browser.close();
