// Calibrates where the hero line leaves the final "a": captures the letter tail at 4x (line hidden).
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 4 });
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.addStyleTag({ content: ".scribble{display:none!important} .home__main{animation:none!important}" });
  const info = await page.evaluate(() => {
    const e = document.querySelector('[data-line="name-end"]').getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(document.querySelector('[data-line="hero-name"]')).fontSize);
    return { x: e.left, y: e.bottom, fs };
  });
  const clip = { x: info.x - info.fs * 0.3, y: info.y - info.fs * 0.3, width: info.fs * 0.4, height: info.fs * 0.35 };
  const buf = await page.screenshot({ clip });
  const file = `qa/screenshots/tail-${w}.png`;
  (await import("node:fs")).writeFileSync(file, buf);
  console.log(JSON.stringify({ w, ...info, clip, file }));
  await page.close();
}
await browser.close();
