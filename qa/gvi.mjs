// The GVI conservation case study, in Chrome.
//   content: every approved line of gvi-conservation.md; nothing from its
//     internal notes; no embellishment of the AI model, the lion relocation,
//     the run, fundraising or aerial surveys; certificate as text
//   photographs: exactly three slots (opening, fieldwork, teaching), driven by
//     content/gvi-photos.ts, with sensible proportions; no stock, video or autoplay
//   structure: heading outline, logo, one figure, no external links or files
//   navigation, drawer, keyboard focus, layout in both themes, theme switching,
//   the thread clear of text and photographs, reduced motion
// Usage: BASE_URL=... node qa/gvi.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const url = base + "/work/gvi-conservation";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

const md = readFileSync("handoff/content/work/gvi-conservation.md", "utf8").split("<!--")[0];
const lines = [];
for (const raw of md.split("\n")) {
  let l = raw.trim();
  if (!l || l === "---") continue;
  l = l.replace(/^#+\s*/, "").replace(/^-\s+/, "");
  const kv = l.match(/^(Role|Period|Location): (.+)$/);
  if (kv) {
    lines.push(kv[1], kv[2]);
    continue;
  }
  lines.push(l);
}
const forbidden = [/INTERNAL/, /DO NOT RENDER/, /2027/, /aerial/i, /ultramarathon/i, /\braised\b/i, /\$\s?\d/, /accuracy/i, /deployed/i, /darted (the|her)/i, /I darted/i, /veterinar/i, /\bkm run\b/i, /completed (the|a) 50/i];

const browser = await chromium.launch({ channel: "chrome" });

/* ---------------------------------------------------------------- content */
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  const text = norm(await page.evaluate(() => document.querySelector("main").innerText));
  const missing = [...new Set(lines)].filter((l) => !text.includes(norm(l)));
  ok(`content: every approved line of gvi-conservation.md is on the page (${new Set(lines).size} lines)`, missing.length === 0, missing.join(" | "));
  const html = (await page.content()).replace(/<script[\s\S]*?<\/script>/g, "");
  const leaked = forbidden.filter((f) => f.test(text) || f.test(html));
  ok("content: nothing from the internal notes; no embellished model, relocation, run, fundraising or aerial claims", leaked.length === 0, leaked.join(", "));
  ok("content: the lion relocation observed (not performed); the run helped organize and participated in", text.includes("i observed the darting and relocation process") && text.includes("helped organize and participated in a 50 km running event"));
  ok("content: the early working model, and the later ideas kept apart under their own label", text.includes("an early working model") && (await page.$eval(".gvi-after__k", (e) => e.textContent)) === "After the internship");
  ok("content: the certificate is readable text, with no file link", (await page.$$eval(".gvi-cert li", (l) => l.length)) === 3 && (await page.$$eval(".gvi-cert a, main a[href$='.pdf']", (a) => a.length)) === 0);
  const photos = await page.$$eval(".gvi-photo", (fs) =>
    fs.map((f) => {
      const r = f.querySelector(".gvi-photo__frame").getBoundingClientRect();
      return { id: f.dataset.photo, ratio: +(r.width / r.height).toFixed(2), placeholder: !!f.querySelector(".gvi-photo__empty"), caption: !!f.querySelector("figcaption")?.textContent.trim() };
    }),
  );
  ok("photographs: exactly three slots — opening, fieldwork, teaching — each captioned", photos.map((p) => p.id).join() === "opening,fieldwork,teaching" && photos.every((p) => p.caption), JSON.stringify(photos));
  const pr = Object.fromEntries(photos.map((p) => [p.id, p.ratio]));
  ok("photographs: sensible proportions (wide opening ~2.3–2.6:1, portrait fieldwork 0.8:1, teaching 1.5:1)", pr.opening >= 2.2 && pr.opening <= 2.6 && Math.abs(pr.fieldwork - 0.8) < 0.03 && Math.abs(pr.teaching - 1.5) < 0.03, JSON.stringify(pr));
  ok("photographs: placeholders are quiet and labelled, not stock (no <img> yet, no video, no autoplay)", photos.every((p) => p.placeholder) && (await page.$$eval(".gvi-photo img, main video, main iframe, [autoplay]", (x) => x.length)) === 0);
  const ext = await page.$$eval("main a[href^='http'], main a[download]", (as) => as.map((a) => a.href));
  ok("no external links or downloads", ext.length === 0, ext.join(" "));
  const outline = await page.$$eval("main h1, main h2, main h3", (hs) => hs.map((h) => +h.tagName[1]));
  ok("headings: one h1, no skipped levels", outline.filter((l) => l === 1).length === 1 && outline.every((lv, i) => !i || lv - outline[i - 1] <= 1), outline.join(""));
  ok("logo: GVI's two supplied colourways (dark-lettered in Light), unfiltered, announced once, no tile", await page.evaluate(() => {
    const w = document.querySelector(".gvi-logo__mark"), imgs = [...w.querySelectorAll("img")];
    const shown = imgs.filter((i) => getComputedStyle(i).visibility === "visible").map((i) => i.getAttribute("src"));
    return w.getAttribute("aria-label") === "GVI" && imgs.every((i) => i.alt === "" && i.complete && i.naturalWidth > 0 && getComputedStyle(i).filter === "none") && shown.join() === "/logos/gvi.webp" && getComputedStyle(document.querySelector(".gvi-logo")).backgroundColor === "rgba(0, 0, 0, 0)";
  }));
  ok("figure: one fieldwork avatar, decorative, never over a photograph", await page.evaluate(() => {
    const a = document.querySelectorAll("main .avatar");
    if (a.length !== 1 || a[0].getAttribute("aria-hidden") !== "true") return false;
    const r = a[0].getBoundingClientRect();
    return [...document.querySelectorAll(".gvi-photo__frame")].every((f) => { const p = f.getBoundingClientRect(); return r.right < p.left || r.left > p.right || r.bottom < p.top || r.top > p.bottom; });
  }));
  ok("no console errors", errors.length === 0, errors.join(" | "));

  // the thread stays clear of text and photographs in the opening
  const clear = await page.evaluate(() => {
    const path = document.querySelector(".detail-line path");
    const len = path.getTotalLength();
    const svg = path.ownerSVGElement.getBoundingClientRect();
    const boxes = [...document.querySelectorAll(".gvi-hero h1 span, .gvi-hero__subtitle, .gvi-hero__dates, .gvi-logo, .gvi-facts, .gvi-photo--opening .gvi-photo__frame, .breadcrumb")].map((e) => e.getBoundingClientRect());
    let hits = 0;
    for (let i = 0; i < len; i += 6) {
      const p = path.getPointAtLength(i);
      const x = p.x + svg.left, y = p.y + svg.top;
      if (y > innerHeight * 2.5) break;
      if (boxes.some((b) => x > b.left + 2 && x < b.right - 2 && y > b.top + 2 && y < b.bottom - 2)) hits++;
    }
    return hits;
  });
  ok("thread: clear of the opening's text and photograph", clear === 0, `${clear} points inside`);

  // On this page
  const ids = await page.$$eval(".toc__link", (as) => as.map((a) => a.hash.slice(1)));
  const landed = [];
  for (const id of ids) {
    await page.click(`.toc__link[href="#${id}"]`);
    await page.waitForTimeout(1100);
    landed.push(await page.evaluate((id) => {
      const t = document.getElementById(id).getBoundingClientRect().top;
      const h = document.querySelector(".site-header").getBoundingClientRect().bottom;
      return { id, gap: Math.round(t - h), bottom: document.documentElement.scrollHeight - innerHeight - scrollY < 2, focused: document.activeElement?.id === id };
    }, id));
  }
  ok(`On this page: all ${ids.length} links land just below the fixed header, and focus moves to the section`, landed.every((l) => ((l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)) && l.focused), JSON.stringify(landed.map((l) => [l.id, l.gap, l.focused])));

  // keyboard: Tab from the top reaches the header controls, each with a visible ring
  await page.evaluate(() => scrollTo(0, 0));
  await page.focus(".skip-link");
  const rings = [];
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    rings.push(await page.evaluate(() => ({ el: document.activeElement?.className || document.activeElement?.tagName, ring: getComputedStyle(document.activeElement).outlineStyle !== "none" || getComputedStyle(document.activeElement).boxShadow !== "none" })));
  }
  ok("keyboard: name, nav (with the Work menu button) and theme controls reachable with visible focus", rings.every((r) => r.ring) && rings.some((r) => /sheet-trigger/.test(r.el)), JSON.stringify(rings));

  // the drawer marks this page
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(450);
  const cur = await page.$$eval('#work-sheet [aria-current="page"]', (a) => a.map((x) => x.getAttribute("href")));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  ok("drawer: Conservation fieldwork marked current; Escape returns focus", cur.join() === "/work/gvi-conservation" && (await page.evaluate(() => document.activeElement?.classList.contains("sheet-trigger"))), cur.join());
  await page.context().close();
}

/* --------------------------------------------- phones: photograph proportions */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const r = await page.$$eval(".gvi-photo__frame", (fs) => fs.map((f) => { const b = f.getBoundingClientRect(); return +(b.width / b.height).toFixed(2); }));
  ok("photographs (phone): opening and fieldwork at 4:3, teaching at 3:2, none enormous", Math.abs(r[0] - 1.33) < 0.03 && Math.abs(r[1] - 1.33) < 0.03 && Math.abs(r[2] - 1.5) < 0.03, JSON.stringify(r));
  await ctx.close();
}

/* ------------------------------------------------------------- layout */
for (const vp of [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 360, height: 740 },
]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: theme, isMobile: vp.width < 700, hasTouch: vp.width < 700 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const lay = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - innerWidth;
      const clipped = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main dd")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width && (r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 2);
      }).map((e) => e.className || e.tagName);
      return { over, clipped: clipped.slice(0, 5) };
    });
    ok(`${vp.width}-${theme}: no horizontal overflow or clipped text`, lay.over <= 0 && lay.clipped.length === 0, JSON.stringify(lay));
    await ctx.close();
  }
}

/* --------------------------------------------- theme switching + reduced motion */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const before = await page.evaluate(() => ({ c: getComputedStyle(document.querySelector(".gvi-hero__dates")).color, bg: getComputedStyle(document.body).backgroundColor }));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("Dark")');
  await page.waitForTimeout(500);
  await page.reload({ waitUntil: "networkidle" });
  const after = await page.evaluate(() => ({ t: document.documentElement.dataset.theme, c: getComputedStyle(document.querySelector(".gvi-hero__dates")).color, bg: getComputedStyle(document.body).backgroundColor }));
  ok("theme: Dark persists, keeps the portfolio's night background, lifts the forest accent", before.c === "rgb(61, 98, 72)" && after.t === "dark" && after.bg === "rgb(33, 30, 28)" && after.c === "rgb(180, 205, 162)", JSON.stringify({ before, after }));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("System")');
  await ctx.close();
}
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
  ok("reduced motion: nothing animates; nothing runs continuously", running === 0, `${running} running`);
  await page.context().close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} GVI checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
