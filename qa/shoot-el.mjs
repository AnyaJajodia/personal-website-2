// Screenshot one element, optionally after hovering/focusing another.
// Usage: node qa/shoot-el.mjs <WxH> <css selector> <name> [--hover=sel] [--focus=sel] [--reduced] [--touch]
import { chromium } from "playwright";
const [size = "1440x900", sel = "body", name = "el", ...flags] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const opt = (k) => flags.find((f) => f.startsWith(`--${k}=`))?.slice(k.length + 3);
const touch = flags.includes("--touch");
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: width < 500 ? 2 : 1,
  reducedMotion: flags.includes("--reduced") ? "reduce" : "no-preference",
  hasTouch: touch,
  isMobile: touch,
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.locator(sel).first().scrollIntoViewIfNeeded();
await page.evaluate((s) => {
  const r = document.querySelector(s).getBoundingClientRect();
  window.scrollBy(0, r.top - 90);
}, sel);
await page.mouse.move(2, 2);
if (opt("hover")) await page.hover(opt("hover"));
if (opt("focus")) await page.focus(opt("focus"));
await page.waitForTimeout(1100);
const el = page.locator(sel).first();
// clip to the viewport (element screenshots of tall elements resize the page mid-transition)
const b = await el.boundingBox();
const clip = { x: Math.max(0, b.x), y: Math.max(0, b.y), width: Math.min(width, b.width), height: Math.min(height - Math.max(0, b.y), b.height) };
await page.screenshot({ path: `qa/screenshots/${name}.png`, clip });
console.log("saved", `qa/screenshots/${name}.png`, JSON.stringify(clip), errors.length ? "ERRORS " + errors.join(" | ") : "");
await browser.close();
