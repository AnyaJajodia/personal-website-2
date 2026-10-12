// Trajectory: which milestone is emphasised as the pen advances, and that
// emphasis never changes layout (label boxes identical before/after).
import { chromium } from "playwright";
const [size = "1440x900"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
const boxes = () => page.$$eval(".trajectory__point", (ps) => ps.map((p) => { const r = p.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)].join(","); }).join(" | "));
const b0 = await boxes();
const top = await page.$eval('[data-line="traj"]', (e) => e.getBoundingClientRect().top + scrollY);
const seen = [];
for (let s = top - height; s < top + 400; s += 40) {
  await page.evaluate((y) => window.scrollTo(0, y), s);
  await page.waitForTimeout(60);
  const a = await page.$$eval(".trajectory__point", (ps) => ps.findIndex((p) => p.dataset.active));
  if (!seen.length || seen.at(-1).a !== a) seen.push({ s: Math.round(s), a });
}
const b1 = await boxes();
console.log("active milestone by scroll:", seen.map((x) => `${x.s}→${x.a + 1 || "none"}`).join("  "));
console.log("layout unchanged by emphasis:", b0 === b1);
await page.evaluate((y) => window.scrollTo(0, y), top - height * 0.45);
await page.waitForTimeout(300);
const r = await page.$eval('[data-line="traj"]', (e) => { const b = e.getBoundingClientRect(); return { x: b.left - 20, y: b.top - 10, w: b.width + 40, h: b.height + 20 }; });
await page.screenshot({ path: `qa/screenshots/it3-milestone-${width}.png`, clip: { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(width, r.w), height: Math.min(height - Math.max(0, r.y), r.h) } });
await browser.close();
