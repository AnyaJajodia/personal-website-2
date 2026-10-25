// Viewport captures of each homepage section, scrolled in like a reader (marks drawn, figures settled).
// Usage: node qa/sections.mjs <WxH> <tag>  → qa/screenshots/avatar/<tag>-<w>-sec-<section>.png
import { chromium } from "playwright";
const [size = "1440x900", tag = "p1"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await page.mouse.move(2, h - 2);
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (const sel of ["#about", ".currently", ".selected", ".more", ".contact"]) {
  const t = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY - 70, sel);
  let y = await page.evaluate(() => scrollY);
  while (y < Math.min(t, max)) { y = Math.min(t, max, y + 60); await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(20); }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `qa/screenshots/avatar/${tag}-${w}-sec-${sel.replace(/[#.]/, "")}.png` });
}
await browser.close();
