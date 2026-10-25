// Theme captures: the homepage (hero + each section) and a project page in
// a given theme, set the way a visitor would (localStorage + reload) or via
// the OS preference. Usage: node qa/theme-shots.mjs <tag> <light|dark|system-dark> [WxH]
import { chromium } from "playwright";
const [tag = "t", mode = "dark", size = "1440x900"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: mode === "system-dark" ? "dark" : "light" });
if (mode === "light" || mode === "dark") await ctx.addInitScript((m) => localStorage.setItem("theme", m), mode);
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.mouse.move(2, h - 2);
await page.waitForTimeout(2200);
const dir = "qa/screenshots/avatar";
await page.screenshot({ path: `${dir}/${tag}-${w}-0hero.png` });
for (const sel of ["#about", ".currently", ".selected", ".more", ".contact"]) {
  const t = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY - 70, sel);
  let y = await page.evaluate(() => scrollY);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  while (y < Math.min(t, max)) { y = Math.min(t, max, y + 70); await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(16); }
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${dir}/${tag}-${w}-${sel.replace(/[#.]/, "")}.png` });
}
for (const slug of ["amnh", "lynxster", "crackd-ai"]) {
  await page.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/${tag}-${w}-work-${slug}.png` });
  await page.evaluate(() => scrollTo(0, 900));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/${tag}-${w}-work-${slug}-2.png` });
}
console.log(mode, size, await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, pref: document.documentElement.dataset.themePref })), errors.length ? errors : "no console errors");
await browser.close();
