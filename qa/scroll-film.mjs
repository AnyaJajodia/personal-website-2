// Slow scroll "film" in Google Chrome: scrolls the homepage forward in small
// wheel steps, and at intermediate positions plus every section boundary saves
// a VIEWPORT screenshot (live scroll-drawn line, not the static full line);
// then scrolls back up and captures the same positions again.
// Usage: node qa/scroll-film.mjs <WxH> <name>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const [size = "1440x900", name = "desktop"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const dir = `qa/screenshots/film-${name}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
// section boundaries: each section's top edge placed mid-viewport
const bounds = await page.evaluate(() =>
  ["#about", ".currently", ".selected", ".more", ".contact"].map((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY - innerHeight * 0.5)),
);
const stops = [...new Set([0, ...bounds, ...Array.from({ length: 9 }, (_, i) => Math.round((max * (i + 1)) / 10)), max])]
  .map((s) => Math.max(0, Math.min(max, s)))
  .sort((a, b) => a - b);
const shoot = async (tag, s) => {
  // wheel in small increments to the stop (real scrolling, not a jump)
  let cur = await page.evaluate(() => scrollY);
  while (Math.abs(cur - s) > 2) {
    const d = Math.max(-80, Math.min(80, s - cur));
    await page.mouse.wheel(0, d);
    await page.waitForTimeout(16);
    const next = await page.evaluate(() => scrollY);
    if (next === cur) break;
    cur = next;
  }
  // let any smooth wheel animation finish, then pin the exact position
  await page.waitForTimeout(400);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s);
  await page.waitForTimeout(220);
  const info = await page.evaluate(() => ({ drawn: document.querySelector("[data-testid=scribble]").dataset.drawn, at: Math.round(scrollY) }));
  if (info.at !== s) console.log("not at stop", s, info.at);
  const file = `${dir}/${tag}-${String(s).padStart(5, "0")}.png`;
  await page.screenshot({ path: file });
  return { s, drawn: info.drawn, file };
};
const fwd = [];
await page.mouse.move(width / 2, height / 2);
for (const s of stops) fwd.push(await shoot("f", s));
const back = [];
for (const s of stops.slice().reverse()) back.push(await shoot("b", s));
console.log(JSON.stringify(fwd.map((f) => [f.s, f.drawn, back.find((b) => b.s === f.s).drawn]).filter((x) => x[1] !== x[2])));
console.log(JSON.stringify({ size, max, bounds, frames: fwd.length + back.length, sameDrawnBothWays: fwd.every((f) => back.find((b) => b.s === f.s).drawn === f.drawn), errors }));
await browser.close();
