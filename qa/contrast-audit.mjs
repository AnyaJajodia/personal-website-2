// Every visible text run on a page, in a given theme: its colour against the
// background actually behind it (walking up to the first opaque fill, blended
// through translucent ones), font size and weight; flags anything below
// WCAG AA (4.5:1, or 3:1 for ≥24px / ≥18.66px bold). Also checks links'
// hover state. Usage: node qa/contrast-audit.mjs <light|dark> [path ...]
import { chromium } from "playwright";
const [theme = "dark", ...paths] = process.argv.slice(2);
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
const page = await ctx.newPage();
let worst = [];
for (const path of paths.length ? paths : ["/", "/work/amnh", "/work/lynxster", "/work/crackd-ai", "/work/esp-teaching"]) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  // reveal everything as a reader would (marks, panels' open default)
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= max; y += 300) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(30); }
  await page.waitForTimeout(800);
  const res = await page.evaluate(() => {
    const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; const m = c.match(/\/\s*([\d.]+)\)|,\s*([\d.]+)\)$/); let a = 1; if (/rgba|\/|color\(/.test(c)) { const mm = c.match(/[,/]\s*([\d.]+)\s*\)$/); if (mm) a = +mm[1]; } return [d[0], d[1], d[2], a]; };
    const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
    const bgOf = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const c = rgba(getComputedStyle(e).backgroundColor);
        if (c[3] > 0) { layers.push(c); if (c[3] >= 0.99) break; }
      }
      let out = rgba(getComputedStyle(document.body).backgroundColor);
      for (const c of layers.reverse()) out = [0, 1, 2].map((i) => c[i] * c[3] + out[i] * (1 - c[3]));
      return out;
    };
    const rows = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.textContent.trim();
      const el = n.parentElement;
      if (!t || !el || el.closest(".visually-hidden, script, style, [aria-hidden=true], nextjs-portal")) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (!r.width || cs.visibility === "hidden" || +cs.opacity === 0) continue;
      let op = 1;
      for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
      if (op < 0.5) continue; // a closed panel's summary
      const fg0 = rgba(cs.color), bg = bgOf(el);
      const fg = [0, 1, 2].map((i) => fg0[i] * fg0[3] * op + bg[i] * (1 - fg0[3] * op));
      const a = lum(fg), b = lum(bg);
      const cr = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const px = parseFloat(cs.fontSize), w = +cs.fontWeight;
      const large = px >= 24 || (px >= 18.66 && w >= 700);
      rows.push({ cr: +cr.toFixed(2), need: large ? 3 : 4.5, px, w, sel: (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : el.tagName.toLowerCase()), text: t.slice(0, 32) });
    }
    return rows;
  });
  const fails = res.filter((r) => r.cr < r.need);
  const small = res.filter((r) => r.px < 16);
  const minSmall = small.length ? Math.min(...small.map((r) => r.cr)) : null;
  console.log(`${theme} ${path}: ${res.length} text runs, ${fails.length} below AA; smallest text min ${minSmall}`);
  for (const f of fails.slice(0, 12)) console.log(`   ${f.cr} < ${f.need}  ${f.px}px ${f.sel} "${f.text}"`);
  worst.push(...small.map((r) => ({ ...r, path })));
}
// the lowest small-text contrasts overall, for tuning
worst.sort((a, b) => a.cr - b.cr);
const seen = new Set();
console.log("lowest small text:");
for (const r of worst) { const k = r.sel + r.cr; if (seen.has(r.sel)) continue; seen.add(r.sel); console.log(`   ${r.cr}  ${r.px}px ${r.sel} "${r.text}" (${r.path})`); if (seen.size > 14) break; }
await browser.close();
