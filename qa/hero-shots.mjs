// First-viewport frames of the bespoke case studies + where their openings end.
// Usage: BASE_URL=... node qa/hero-shots.mjs <outdir> [theme]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const [out = "qa/screenshots/heroes", theme = "light"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const slugs = ["crackd-ai", "buzzworks", "tmu-citation-tooling", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
const b = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, isMobile: w < 700, hasTouch: w < 700 });
  for (const slug of slugs) {
    const p = await ctx.newPage();
    await p.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    const m = await p.evaluate(() => {
      const hero = document.querySelector("header.detail-hero");
      const sec = document.querySelector(".case-content section, .case-content > *");
      const h1 = document.querySelector("h1");
      return { heroBottom: Math.round(hero.getBoundingClientRect().bottom), firstSection: Math.round(sec?.getBoundingClientRect().top ?? -1), h1Lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)), h1Size: getComputedStyle(h1).fontSize, over: document.documentElement.scrollWidth - innerWidth };
    });
    await p.screenshot({ path: `${out}/${slug}-${w}-${theme}.png` });
    console.log(w, slug.padEnd(28), JSON.stringify(m));
    await p.close();
  }
  await ctx.close();
}
await b.close();
