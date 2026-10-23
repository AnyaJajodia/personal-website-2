// How many figures share the viewport, at every scroll position: reports the
// maximum (counting a figure once at least 40% of it is in view) and where.
// Usage: node qa/av-density.mjs [WxH ...]
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
for (const size of process.argv.slice(2).length ? process.argv.slice(2) : ["1440x900", "1024x768", "768x1024", "390x844"]) {
  const [w, h] = size.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const figs = [...document.querySelectorAll("[data-avatar]")].filter((e) => e.offsetParent).map((e) => {
      const b = e.getBoundingClientRect();
      return { role: e.dataset.avatar, t: b.top + scrollY, b: b.bottom + scrollY };
    });
    const max = document.documentElement.scrollHeight - innerHeight;
    let worst = { n: 0, at: 0, who: [] };
    for (let s = 0; s <= max; s += 20) {
      const who = figs.filter((f) => Math.min(f.b, s + innerHeight) - Math.max(f.t, s + 60) >= 0.4 * (f.b - f.t)).map((f) => f.role);
      if (who.length > worst.n) worst = { n: who.length, at: s, who };
    }
    return worst;
  });
  console.log(size, JSON.stringify(r));
  await page.close();
}
await browser.close();
