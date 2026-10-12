// Ad-hoc DOM probe: node qa/probe.mjs <path> <WxH> "<js expression>"
import { chromium } from "playwright";
const [path = "/", size = "1440x900", expr = "document.title"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + path, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
console.log(JSON.stringify(await page.evaluate(expr), null, 1));
await browser.close();
