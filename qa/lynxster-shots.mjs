// Screenshots of the Lynxster page and the homepage "Two threads" cards:
// desktop + phone, light + dark. Usage: BASE_URL=http://localhost:3100 node qa/lynxster-shots.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.env.OUT ?? "qa/screenshots/lynxster";
const b = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"])
  for (const [vw, vh, tag] of [
    [1440, 900, "d"],
    [390, 844, "m"],
  ]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, reducedMotion: "reduce" });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }, theme);
    const p = await ctx.newPage();
    await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/page-top-${tag}-${theme}.png` });
    await p.screenshot({ path: `${out}/page-full-${tag}-${theme}.png`, fullPage: true });
    await p.goto(base + "/#work", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    await p.locator(".features").scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    await p.locator(".currently").screenshot({ path: `${out}/home-${tag}-${theme}.png` });
    await ctx.close();
  }
await b.close();
