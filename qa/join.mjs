// Close-ups of the line's join with the final "a" of "Anya" at several scroll
// positions (through the hero → sticky-header transition), plus a numeric
// check that the path's first point stays on the letter's tail.
// Usage: node qa/join.mjs <WxH> <name> [scrolls]
import { chromium } from "playwright";
const [size = "1440x900", name = "join", list = "0,120,240,360"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 3 });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
for (const s of list.split(",").map(Number)) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s);
  await page.waitForTimeout(250);
  const m = await page.evaluate(() => {
    const end = document.querySelector('[data-line="name-end"]').getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(document.querySelector('[data-line="hero-name"]')).fontSize);
    const path = document.querySelector("[data-testid=scribble] .scribble__path");
    const svg = path.ownerSVGElement.getBoundingClientRect();
    const p0 = path.getPointAtLength(0);
    // the tail tip per the calibration, in viewport coords
    const tip = { x: end.left + 0.0305 * fs, y: end.bottom - 0.0496 * fs };
    const start = { x: svg.left + p0.x, y: svg.top + p0.y };
    return { tip, start, fs, ready: path.ownerSVGElement.dataset.ready, header: getComputedStyle(document.querySelector(".site-header")).backgroundColor };
  });
  const dist = Math.hypot(m.start.x - (m.tip.x - Math.cos(0.45) * 0.06 * m.fs), m.start.y - (m.tip.y + Math.sin(0.45) * 0.06 * m.fs));
  console.log(`scroll ${s}: start (${m.start.x.toFixed(1)}, ${m.start.y.toFixed(1)}) vs expected-in-tail offset ${dist.toFixed(2)}px · ready ${m.ready}`);
  const f = m.fs;
  const clip = { x: m.tip.x - f * 0.45, y: m.tip.y - f * 0.4, width: f * 1.1, height: f * 0.6 };
  if (clip.y > 0 && clip.y + clip.height < height) await page.screenshot({ path: `qa/screenshots/${name}-${s}.png`, clip });
}
await browser.close();
