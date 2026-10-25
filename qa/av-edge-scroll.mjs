// The edge peeker's scroll-linked slide: samples her offset at scroll
// positions down through the work section and back up again (must match),
// holds still when scrolling stops, and saves a frame strip.
// Usage: node qa/av-edge-scroll.mjs [WxH]
import { chromium } from "playwright";
const [size = "1440x900"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
const g = await page.evaluate(() => { const r = document.querySelector(".panels").getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY }; });
const tx = () => page.evaluate(() => { const b = document.querySelector('[data-avatar="edge"] .avatar__body'); const m = new DOMMatrixReadOnly(getComputedStyle(b).transform.replace("none", "matrix(1,0,0,1,0,0)")); return Math.round(m.m41 * 10) / 10; });
const ys = [];
for (let y = Math.round(g.top - H * 1.25); y <= g.bottom - H * 0.05; y += 40) ys.push(y);
const down = [];
let k = 0;
for (const y of ys) {
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(40);
  down.push(await tx());
  if (k++ % 3 === 0) await page.screenshot({ path: `qa/screenshots/avatar/es-${W}-${String(k).padStart(2, "0")}.png`, clip: { x: W * 0.6, y: 0, width: W * 0.4, height: H } });
}
const up = [];
for (const y of ys.slice().reverse()) {
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(40);
  up.push(await tx());
}
up.reverse();
const mid = ys[Math.floor(ys.length / 2)];
await page.evaluate((v) => scrollTo(0, v), mid);
await page.waitForTimeout(80);
const a = await tx();
await page.waitForTimeout(1200);
const b = await tx();
console.log(size, JSON.stringify({ samples: ys.length, reversible: down.every((v, i) => Math.abs(v - up[i]) < 0.6), holdsStill: a === b, path: down.filter((_, i) => i % 2 === 0).join(" ") }));
await browser.close();
