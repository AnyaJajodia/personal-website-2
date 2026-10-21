// The line holds when scrolling stops: drawn amount sampled over 2 s of idle
// at several positions must not change. Usage: node qa/hold.mjs [WxH]
import { chromium } from "playwright";
const [width, height] = (process.argv[2] ?? "1440x900").split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const out = [];
for (const f of [0.15, 0.4, 0.65, 0.9]) {
  await page.mouse.wheel(0, Math.round(max * f) - (await page.evaluate(() => scrollY)));
  await page.waitForTimeout(700);
  const a = await page.evaluate(() => [scrollY, document.querySelector("[data-testid=scribble]").dataset.drawn]);
  await page.waitForTimeout(2000);
  const b = await page.evaluate(() => [scrollY, document.querySelector("[data-testid=scribble]").dataset.drawn]);
  out.push({ at: Math.round(a[0]), drawn: a[1], after2s: b[1], held: a[1] === b[1] && a[0] === b[0] });
}
console.log(JSON.stringify({ size: `${width}x${height}`, holds: out.every((o) => o.held), out }));
await browser.close();
