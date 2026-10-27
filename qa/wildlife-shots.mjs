// Screenshots of the Wildlife photography page for visual review:
// grid (top + full), hover caption, keyboard-focus caption, the larger view
// mid-flight and settled, and the homepage plate — desktop and phone, both themes.
// Usage: BASE_URL=http://localhost:3100 node qa/wildlife-shots.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.env.OUT ?? "qa/screenshots/wildlife";
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"])
  for (const [vw, vh, tag] of [
    [1440, 900, "d"],
    [390, 844, "m"],
  ]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, hasTouch: tag === "m", isMobile: tag === "m" });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }, theme);
    const p = await ctx.newPage();
    await p.goto(base + "/wildlife-photography", { waitUntil: "networkidle" });
    await p.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      scrollTo(0, 0);
    });
    // the photographs are full-size originals: wait until every one has arrived
    await p.waitForFunction(() => [...document.querySelectorAll(".wl-tile__img")].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 60000 });
    await p.waitForTimeout(700);
    const s = (n) => `${out}/${n}-${tag}-${theme}.png`;
    await p.screenshot({ path: s("top") });
    await p.screenshot({ path: s("full"), fullPage: true });
    const tiles = p.locator(".wl-tile");
    if (tag === "d") {
      await tiles.nth(1).hover();
      await p.waitForTimeout(600);
      await p.screenshot({ path: s("hover") });
      await p.mouse.move(5, 5);
      await p.keyboard.press("Tab"); // skip link
      await tiles.nth(4).focus();
      await p.evaluate(() => document.querySelector(".wl-tile:focus")?.scrollIntoView({ block: "center" }));
      await p.waitForTimeout(500);
      await p.screenshot({ path: s("focus") });
      await p.evaluate(() => scrollTo(0, 0));
      await p.waitForTimeout(300);
    }
    await tiles.nth(2).click();
    await p.waitForTimeout(170);
    await p.screenshot({ path: s("open-mid") });
    await p.waitForTimeout(1100);
    await p.screenshot({ path: s("open") });
    await p.keyboard.press("ArrowRight");
    await p.waitForTimeout(800);
    await p.screenshot({ path: s("open-next") });
    console.log(theme, tag, await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.activeElement?.getAttribute("aria-label"), document.querySelector(".wl-view__title")?.textContent]));
    await ctx.close();
  }
// the homepage plate
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  const p = await ctx.newPage();
  await p.goto(base + "/#more", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.locator("#more").scrollIntoViewIfNeeded();
  await p.locator(".bento__card--photo").hover();
  await p.waitForTimeout(700);
  await p.locator("#more").screenshot({ path: `${out}/home-more-${theme}.png` });
  await ctx.close();
}
await b.close();
