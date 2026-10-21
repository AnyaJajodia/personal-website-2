// In-context captures: the Selected work section inside the surrounding page
// (viewport screenshots, live scroll-drawn line), plus the About trajectory
// while the line is part-way through it, forward and back.
// Usage: node qa/context-shots.mjs <tag>   → qa/screenshots/ctx-<tag>-*.png
import { chromium } from "playwright";
const tag = process.argv[2] ?? "now";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const errors = [];
for (const [name, w, h] of [["desktop", 1440, 900], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  page.on("console", (m) => m.type() === "error" && errors.push(`${name}: ${m.text()}`));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const at = async (y) => {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), Math.round(y));
    await page.waitForTimeout(450);
  };
  const top = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
  // the work section in context: end of Currently above, start of More below
  await at((await top(".selected")) - h * 0.18);
  await page.mouse.move(5, h - 5);
  await page.screenshot({ path: `qa/screenshots/ctx-${tag}-${name}-work.png` });
  // trajectory part-drawn, forward then back
  const traj = await top('[data-line="traj"]');
  for (const [i, f] of [[1, 0.62], [2, 0.42], [3, 0.3]].entries()) {
    await at(traj - h * f[1]);
    await page.screenshot({ path: `qa/screenshots/ctx-${tag}-${name}-traj-f${i}.png` });
  }
  await at(traj + 400);
  await at(traj - h * 0.42);
  await page.screenshot({ path: `qa/screenshots/ctx-${tag}-${name}-traj-back.png` });
  await page.close();
}
console.log("ok", errors.length ? errors.join(" | ") : "no console errors");
await browser.close();
