// Dot field behaviour: displaces near the pointer, settles and stops, pauses
// offscreen, static on touch and reduced motion, never intercepts clicks.
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const out = [];
const log = (k, v) => { out.push(`${k}: ${v}`); console.log(`${k}: ${v}`); };
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const st = () => page.$$eval("[data-testid=dot-field]", (c) => c.map((x) => ({ mode: x.dataset.mode, anim: x.dataset.animating ?? "idle", vis: x.dataset.visible, pe: getComputedStyle(x).pointerEvents, z: getComputedStyle(x).zIndex })));
  log("at rest", JSON.stringify(await st()));
  await page.screenshot({ path: "qa/screenshots/it3-dots-rest.png", clip: { x: 700, y: 300, width: 500, height: 320 } });
  for (let i = 0; i <= 10; i++) await page.mouse.move(820 + i * 16, 420 + i * 6);
  await page.waitForTimeout(120);
  log("pointer moving", JSON.stringify((await st())[0]));
  await page.screenshot({ path: "qa/screenshots/it3-dots-pointer.png", clip: { x: 700, y: 300, width: 500, height: 320 } });
  await page.mouse.move(1430, 20);
  await page.mouse.move(5, 5);
  await page.evaluate(() => document.documentElement.dispatchEvent(new PointerEvent("pointerleave")));
  await page.waitForTimeout(2500);
  log("after pointer leaves (should settle and stop)", JSON.stringify((await st())[0]));
  const hit = await page.evaluate(() => document.elementFromPoint(900, 450)?.tagName);
  log("element under pointer in hero", hit);
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(400);
  log("hero field when scrolled away (visible?)", (await st())[0].vis);
  await page.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  log("touch device mode", await page.$eval("[data-testid=dot-field]", (c) => c.dataset.mode));
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  for (let i = 0; i <= 10; i++) await page.mouse.move(820 + i * 16, 420 + i * 6);
  await page.waitForTimeout(150);
  log("reduced motion mode / animating", await page.$eval("[data-testid=dot-field]", (c) => `${c.dataset.mode} / ${c.dataset.animating ?? "idle"}`));
  await ctx.close();
}
await browser.close();
