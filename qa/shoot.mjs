// Reproducible screenshots with Playwright driving the installed Google Chrome.
// Usage: node qa/shoot.mjs <path> <width>x<height> <outName> [--full] [--reduced] [--scroll=0,800,...] [--selector=css]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3100";
const [path = "/", size = "1440x900", name = "shot", ...flags] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const full = flags.includes("--full");
const reduced = flags.includes("--reduced");
const scrollFlag = flags.find((f) => f.startsWith("--scroll="));
const scrolls = scrollFlag ? scrollFlag.slice(9).split(",").map(Number) : [null];
const out = "qa/screenshots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: width < 500 ? 2 : 1,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(base + path, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);
for (const s of scrolls) {
  let file = `${out}/${name}.png`;
  if (s !== null) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s);
    await page.waitForTimeout(350);
    file = `${out}/${name}-${s}.png`;
  }
  await page.screenshot({ path: file, fullPage: full });
  console.log("saved", file);
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("horizontal overflow px:", overflow, "| doc height:", await page.evaluate(() => document.documentElement.scrollHeight));
console.log("poses:", await page.evaluate(() => document.querySelector("[data-testid=scribble]")?.getAttribute("data-poses") ?? "-"));
if (errors.length) console.log("CONSOLE ERRORS:\n" + errors.join("\n"));
await browser.close();
