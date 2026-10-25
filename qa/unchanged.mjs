// Guard: pages outside a change stay unchanged. `snap` records each route's
// normalised markup (scripts and build hashes stripped) and a reduced-motion
// full-page screenshot at desktop and phone width; `compare` re-records and
// reports any route whose markup or pixels differ.
// Usage: BASE_URL=... node qa/unchanged.mjs snap|compare [--skip=slug,slug] [--mask-header]
//   --mask-header: detail pages are compared without the shared site header
//   (an intended, shared change); the homepage is always compared whole.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import sharp from "sharp";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const mode = process.argv[2] ?? "compare";
const skip = (process.argv.find((a) => a.startsWith("--skip=")) ?? "--skip=").slice(7).split(",").filter(Boolean);
const maskHeader = process.argv.includes("--mask-header");
const dir = "qa/screenshots/unchanged";
mkdirSync(`${dir}/base`, { recursive: true });
mkdirSync(`${dir}/now`, { recursive: true });
const slugs = ["lynxster", "amnh", "crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
const routes = ["/", ...slugs.map((s) => `/work/${s}`)].filter((r) => !skip.some((s) => r.endsWith("/" + s)));
const norm = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]+>/g, "")
    .replace(/<meta[^>]+>/g, "")
    .replace(/\/_next\/[^"' )]+/g, "/_next/*")
    .replace(/\s+/g, " ");
const name = (r) => (r === "/" ? "home" : r.split("/").pop());

const browser = await chromium.launch({ channel: "chrome" });
const results = [];
for (const r of routes) {
  const mask = maskHeader && r !== "/";
  let raw = await (await fetch(base + r)).text();
  if (mask) raw = raw.replace(/<header class="site-header"[\s\S]*?<\/header>/, "<header-masked/>");
  const html = norm(raw);
  const shots = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", colorScheme: "light", deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const buf = await page.screenshot({ fullPage: true, animations: "disabled" });
    shots[w] = buf;
    await ctx.close();
  }
  const sub = mode === "snap" ? "base" : "now";
  writeFileSync(`${dir}/${sub}/${name(r)}.html.txt`, html);
  for (const w of Object.keys(shots)) writeFileSync(`${dir}/${sub}/${name(r)}-${w}.png`, shots[w]);
  if (mode === "compare") {
    let was = existsSync(`${dir}/base/${name(r)}.html.txt`) ? readFileSync(`${dir}/base/${name(r)}.html.txt`, "utf8") : null;
    if (mask && was) was = was.replace(/<header class="site-header"[\s\S]*?<\/header>/, "<header-masked/>");
    const sameHtml = was === html;
    // pixels: the same size, and under 0.2% of pixels differing by more than
    // 40 levels (the paper grain, canvas dots and image decoding jitter slightly)
    const samePx = [];
    const diffs = [];
    for (const w of Object.keys(shots)) {
      const p = `${dir}/base/${name(r)}-${w}.png`;
      if (!existsSync(p)) { samePx.push(false); diffs.push("no base"); continue; }
      const [a, b] = await Promise.all([sharp(p).raw().toBuffer({ resolveWithObject: true }), sharp(shots[w]).raw().toBuffer({ resolveWithObject: true })]);
      if (a.info.width !== b.info.width || a.info.height !== b.info.height) { samePx.push(false); diffs.push(`size ${a.info.height}→${b.info.height}`); continue; }
      const ch = a.info.channels;
      // masked: skip the header band at the top of the page (68px desktop, 60px phone)
      const skipRows = mask ? (+w < 640 ? 61 : 69) : 0;
      let n = 0;
      for (let i = skipRows * a.info.width * ch; i < a.data.length; i += ch) {
        if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) > 40) n++;
      }
      const share = n / (a.info.width * a.info.height);
      samePx.push(share < 0.002);
      diffs.push(`${(share * 100).toFixed(3)}%`);
    }
    const pass = sameHtml && samePx.every(Boolean);
    results.push(pass);
    console.log(`${pass ? "PASS" : "FAIL"}  ${r} unchanged  — markup ${sameHtml ? "same" : "DIFFERENT"}, pixels 1440 ${samePx[0] ? "same" : "DIFFERENT"} (${diffs[0]}), 390 ${samePx[1] ? "same" : "DIFFERENT"} (${diffs[1]})`);
  } else console.log(`snap  ${r}`);
}
await browser.close();
if (mode === "compare") {
  console.log(`\n${results.filter(Boolean).length}/${results.length} routes unchanged`);
  process.exit(results.every(Boolean) ? 0 : 1);
}
