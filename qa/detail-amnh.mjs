import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + "/work/amnh", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `qa/screenshots/it5-amnh-${w}.png`, fullPage: true });
  const info = await page.evaluate(() => ({
    h2: [...document.querySelectorAll("main h2")].map((e) => e.textContent),
    h3: [...document.querySelectorAll("main h3")].map((e) => e.textContent),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  console.log(w, JSON.stringify(info), errors.join(" | "));
  await page.close();
}
await browser.close();
