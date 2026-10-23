// Detail-page figures in context: for each project page, scrolls to each
// avatar (in steps, so it enters on its own cue), waits for it to settle and
// captures the viewport. Reports overlap of the figure with any text in its
// section, and console errors. Usage: node qa/av-detail.mjs <tag> [WxH ...]
import { chromium } from "playwright";
const [tag = "d", ...sizes] = process.argv.slice(2);
const base = process.env.BASE_URL ?? "http://localhost:3100";
const slugs = ["lynxster", "amnh", "crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
const browser = await chromium.launch({ channel: "chrome" });
for (const size of sizes.length ? sizes : ["1440x900", "768x1024", "390x844"]) {
  const [w, h] = size.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const slug of slugs) {
    const errors = [];
    const onC = (m) => m.type() === "error" && errors.push(m.text());
    page.on("console", onC);
    await page.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const figs = await page.evaluate(() => Array.from(document.querySelectorAll("[data-avatar]")).map((el, i) => ({ i, shown: !!el.offsetParent })));
    const out = [];
    let y = 0;
    for (const f of figs.filter((f) => f.shown)) {
      const t = await page.evaluate((i) => {
        const el = document.querySelectorAll("[data-avatar]")[i];
        const b = el.getBoundingClientRect();
        return Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, Math.round(b.top + scrollY + b.height / 2 - innerHeight * 0.55)));
      }, f.i);
      while (y < t) {
        y = Math.min(t, y + 80);
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(30);
      }
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `qa/screenshots/avatar/${tag}-${w}-${slug}-${f.i}.png` });
      const hit = await page.evaluate((i) => {
        const el = document.querySelectorAll("[data-avatar]")[i];
        const a = el.getBoundingClientRect();
        const sec = el.closest("section");
        const hits = [];
        const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const b of r.getClientRects()) if (b.right > a.left + 4 && b.left < a.right - 4 && b.bottom > a.top + 4 && b.top < a.bottom - 4) hits.push(n.textContent.trim().slice(0, 30));
        }
        return { in: el.dataset.in, hits };
      }, f.i);
      out.push(`${f.i}:${hit.in}:${hit.hits.length ? "OVERLAP " + hit.hits.join("|") : "clear"}`);
    }
    console.log(size, slug, out.join(" "), figs.filter((f) => !f.shown).length ? `(${figs.filter((f) => !f.shown).length} hidden)` : "", errors.length ? "ERR " + errors.join(" | ") : "");
    page.off("console", onC);
  }
  await page.close();
}
await browser.close();
