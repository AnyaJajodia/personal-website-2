// The matcha toy: its button sits on the cup in the artwork and is ≥ 44px;
// hover (mouse), keyboard focus and tap each set it fizzing; captures the
// plume part-way through. Usage: node qa/av-matcha.mjs [WxH] [--touch]
import { chromium } from "playwright";
const args = process.argv.slice(2);
const touch = args.includes("--touch");
const [size = "1440x900"] = args.filter((a) => !a.startsWith("--"));
const [w, h] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, deviceScaleFactor: touch ? 2 : 1 });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const b = await page.evaluate(() => { const r = document.querySelector(".matcha").getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
const clip = { x: Math.max(0, b.x - 70), y: Math.max(0, b.y - 120), width: b.w + 140, height: b.h + 160 };
const out = { box: [Math.round(b.w), Math.round(b.h)] };
const fizzing = () => page.$eval(".matcha", (e) => !!e.dataset.fizz);
if (touch) {
  await page.tap(".matcha");
  await page.waitForTimeout(260);
  out.tap = await fizzing();
  await page.screenshot({ path: `qa/screenshots/avatar/m-${w}-tap.png`, clip });
} else {
  await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2);
  await page.waitForTimeout(140);
  out.hover = await fizzing();
  await page.screenshot({ path: `qa/screenshots/avatar/m-${w}-hover-a.png`, clip });
  await page.waitForTimeout(260);
  await page.screenshot({ path: `qa/screenshots/avatar/m-${w}-hover-b.png`, clip });
  await page.waitForTimeout(1300);
  out.cleared = !(await fizzing());
  await page.mouse.move(2, h - 2);
  // keyboard: Tab until the cup has focus
  for (let i = 0; i < 12 && !(await page.evaluate(() => document.activeElement?.classList.contains("matcha"))); i++) await page.keyboard.press("Tab");
  await page.waitForTimeout(200);
  out.focus = await fizzing();
  await page.screenshot({ path: `qa/screenshots/avatar/m-${w}-focus.png`, clip });
  await page.waitForTimeout(1400);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  out.enter = await fizzing();
}
// the figure itself never moves
out.figureStill = await page.$eval(".hero__perch .avatar", (e) => e.getAnimations({ subtree: true }).length === 0 && getComputedStyle(e.querySelector(".avatar__body")).transform === "none");
console.log(size, touch ? "touch" : "", JSON.stringify(out));
await browser.close();
