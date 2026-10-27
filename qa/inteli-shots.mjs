import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.env.OUT ?? "qa/screenshots/inteli";
const routes = (process.env.ROUTES ?? "/work/inteli-lens").split(",");
const b = await chromium.launch({ channel: "chrome" });
for (const route of routes) for (const theme of ["light", "dark"]) for (const [vw, vh, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(base + route, { waitUntil: "networkidle" });
  await p.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  // bring lazy images in
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.waitForTimeout(500);
  const name = route.split("/").pop() || "home";
  await p.screenshot({ path: `${out}/${name}-top-${tag}-${theme}.png` });
  await p.screenshot({ path: `${out}/${name}-full-${tag}-${theme}.png`, fullPage: true });
  console.log(name, theme, tag, await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.body.scrollHeight]));
  await ctx.close();
}
await b.close();
