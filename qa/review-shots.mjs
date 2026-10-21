// Captures for the design review: full pages (complete static line via reduced
// motion, entrance motion settled) + the live first viewport, desktop/tablet/mobile.
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, w, h, dpr] of [["desktop", 1440, 900, 1], ["tablet", 768, 1024, 1], ["mobile", 390, 844, 2]]) {
  for (const reduced of [true, false]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: reduced ? "reduce" : "no-preference" });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    if (reduced) await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
    else await page.screenshot({ path: `.impeccable/review/${name}-first-viewport.png` });
    await page.close();
  }
}
await browser.close();
console.log("ok");
