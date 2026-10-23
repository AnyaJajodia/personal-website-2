// Survey: full-page homepage captures with the (hidden) hero slot outlined,
// for composing avatar placements. Usage: node qa/av-survey.mjs <tag>
import { chromium } from "playwright";
const tag = process.argv[2] ?? "survey";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, w, h] of [["desktop", 1440, 900], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".hero__slot{visibility:visible!important;outline:2px dashed red}" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `qa/screenshots/avatar/${tag}-${name}-full.png`, fullPage: true });
  await page.close();
}
await browser.close();
