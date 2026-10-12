// Screenshot of keyboard focus on a Currently card (ring is drawn on the card).
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
for (let i = 0; i < 7; i++) await page.keyboard.press("Tab");
await page.waitForTimeout(700);
console.log("focused:", await page.evaluate(() => document.activeElement.textContent.trim()));
console.log("card outline:", await page.evaluate(() => getComputedStyle(document.activeElement.closest(".feature")).outlineStyle));
const box = await page.locator(".features").boundingBox();
await page.screenshot({ path: "qa/screenshots/it2-focus-card.png", clip: { x: box.x - 20, y: Math.max(0, box.y - 20), width: box.width + 40, height: Math.min(box.height + 40, 880) } });
await browser.close();
