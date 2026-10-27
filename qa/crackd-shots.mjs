import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3101";
const out = "qa/screenshots/crackd26";
const b = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"]) for (const [vw, vh, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(base + "/work/crackd-ai", { waitUntil: "networkidle" });
  await p.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  const apps = p.locator(".ck-apps");
  await apps.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await apps.screenshot({ path: `${out}/apps-${tag}-${theme}.png` });
  await p.screenshot({ path: `${out}/full-${tag}-${theme}.png`, fullPage: true });
  // tours
  for (const [k, step] of [["user-application", 4], ["admin-application", 0], ["llm-chaining-matrix", 3]]) {
    const btns = p.locator(`#${k} .ck-screen`);
    await btns.nth(step).click();
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/tour-${k}-${tag}-${theme}.png` });
    if (k === "admin-application") {
      await p.locator(".ck-tour__zoom").click(); await p.waitForTimeout(500);
      await p.screenshot({ path: `${out}/tour-zoom-${tag}-${theme}.png` });
      await p.keyboard.press("Escape"); await p.waitForTimeout(200);
    }
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  }
  console.log(theme, tag, await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, !!document.querySelector("dialog[open]")]));
  await ctx.close();
}
await b.close();
