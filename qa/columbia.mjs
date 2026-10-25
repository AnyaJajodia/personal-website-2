// ESP and ADI pages, the Columbia/ADI logos, the homepage Teaching card and
// the drawer's Teaching entry, in Chrome.
// Usage: BASE_URL=... node qa/columbia.mjs
import { chromium } from "playwright";
import { readFileSync, existsSync } from "node:fs";
import sharp from "sharp";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
function approved(file, fields) {
  const md = readFileSync(file, "utf8").split("<!--")[0];
  const out = [];
  for (const raw of md.split("\n")) {
    let l = raw.trim();
    if (!l || l === "---") continue;
    l = l.replace(/^#+\s*/, "");
    const kv = l.match(new RegExp(`^(${fields.join("|")}): (.+)$`));
    if (kv) {
      out.push(kv[1], kv[2]);
      continue;
    }
    // "Spring 2024 · Exploring": the semester and the stage are set separately
    const st = l.match(/^((?:Spring|Fall) 20\d\d) · (\w+)$/);
    if (st) {
      out.push(st[1], st[2]);
      continue;
    }
    out.push(l);
  }
  return [...new Set(out)];
}
const forbidden = [/INTERNAL/, /DO NOT RENDER/, /10\+/, /Google/, /\bMeta\b/, /Duolingo/, /2027/, /January 2024/, /faculty/i, /testimonial/i, /ADI Labs/];
const browser = await chromium.launch({ channel: "chrome" });
const visibleSrc = (page) =>
  page.evaluate(() => [...document.querySelectorAll(".cu-wordmark img")].filter((i) => getComputedStyle(i).visibility === "visible").map((i) => i.getAttribute("src").split("/").pop()));

for (const pg of [
  { slug: "esp-teaching", file: "handoff/content/work/esp-teaching.md", fields: ["Roles", "Teaching period", "Institution"], tag: "ESP" },
  { slug: "adi-mentorship", file: "handoff/content/work/adi-mentorship.md", fields: ["Role", "Period", "Community", "Cohorts"], tag: "ADI" },
]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${base}/work/${pg.slug}`, { waitUntil: "networkidle" });
  const text = norm(await page.evaluate(() => document.querySelector("main").innerText));
  const lines = approved(pg.file, pg.fields);
  const missing = lines.filter((l) => !text.includes(norm(l)));
  ok(`${pg.tag}: every approved line is on the page (${lines.length})`, missing.length === 0, missing.join(" | "));
  const html = (await page.content()).replace(/<script[\s\S]*?<\/script>/g, "");
  // claims are checked in the visible text; the markup only for the notes themselves
  // (asset hashes can contain digit runs like "2027")
  const leaked = forbidden.filter((f) => f.test(text)).concat([/INTERNAL/, /DO NOT RENDER/].filter((f) => f.test(html)));
  ok(`${pg.tag}: nothing from the notes; no stale claims (10+, placements, 2027, Jan 2024)`, leaked.length === 0, leaked.join(", "));
  const logo = await page.evaluate(() => {
    const w = document.querySelector(".cu-wordmark");
    const imgs = [...w.querySelectorAll("img")];
    return { role: w.getAttribute("role"), label: w.getAttribute("aria-label"), alts: imgs.map((i) => i.getAttribute("alt")), loaded: imgs.every((i) => i.complete && i.naturalWidth > 0), opacity: imgs.map((i) => getComputedStyle(i).opacity + getComputedStyle(i).filter), labelled: document.querySelectorAll('[aria-label="Columbia University"]').length };
  });
  ok(`${pg.tag}: wordmark announced once (one labelled image; both files decorative), unfiltered at full opacity`, logo.role === "img" && logo.label === "Columbia University" && logo.alts.every((a) => a === "") && logo.loaded && logo.labelled === 1 && logo.opacity.every((o) => o === "1none"), JSON.stringify(logo));
  ok(`${pg.tag}: Light shows the deep-blue wordmark`, (await visibleSrc(page)).join() === "columbia-wordmark-light.png", (await visibleSrc(page)).join());
  const box0 = await page.$eval(".cu-wordmark", (e) => JSON.stringify(e.getBoundingClientRect()));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("Dark")');
  await page.waitForTimeout(300);
  const box1 = await page.$eval(".cu-wordmark", (e) => JSON.stringify(e.getBoundingClientRect()));
  ok(`${pg.tag}: switching to Dark shows the pale-blue wordmark in the same place (no layout shift)`, (await visibleSrc(page)).join() === "columbia-wordmark-dark.png" && box0 === box1, (await visibleSrc(page)).join());
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("System")');
  await page.waitForTimeout(200);
  if (pg.tag === "ADI") {
    const pill = await page.evaluate(() => {
      const p = document.querySelector(".cu-pill"), i = p.querySelector("img"), pr = p.getBoundingClientRect(), ir = i.getBoundingClientRect();
      return { overflow: getComputedStyle(p).overflow, radius: parseFloat(getComputedStyle(p).borderTopLeftRadius), h: Math.round(pr.height), ih: Math.round(ir.height), w: Math.round(pr.width), iw: Math.round(ir.width), ratio: +(ir.width / ir.height).toFixed(2), natural: +(i.naturalWidth / i.naturalHeight).toFixed(2), bg: getComputedStyle(p).backgroundColor, src: i.getAttribute("src"), label: p.getAttribute("aria-label"), alt: i.getAttribute("alt") };
    });
    ok("ADI pill: the cropped mark fills a fully rounded, overflow-hidden pill — undistorted, no inner rectangle", pill.overflow === "hidden" && pill.radius >= pill.h / 2 - 1 && pill.h === pill.ih && pill.w === pill.iw && Math.abs(pill.ratio - pill.natural) < 0.03 && pill.src.endsWith("adi-mark.png") && pill.bg === "rgba(0, 0, 0, 0)" && pill.label === "ADI" && pill.alt === "", JSON.stringify(pill));
    // the white letters stay inside the rounded ends: sample the cropped asset
    const { data, info } = await sharp("public/logos/adi-mark.png").removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const r = info.height / 2;
    let outside = 0;
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 3;
        if (data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230) {
          const cx = x < r ? r : x > info.width - r ? info.width - r : x;
          if (Math.hypot(x - cx, y - r) > r - 6) outside++;
        }
      }
    ok("ADI pill: every white letter clears the rounded ends with padding to spare", outside === 0, `${outside} letter pixels near the edge`);
    ok("ADI pill: the original ADI.png is preserved", existsSync("public/logos/ADI.png") && (await sharp("public/logos/ADI.png").metadata()).width === 800);
    const cohorts = await page.$$eval(".cu-cohorts__dots", (d) => d.map((x) => x.children.length));
    ok("ADI: two cohorts of three, six in all (anonymous)", cohorts.join() === "3,3" && text.includes("six in all"));
    ok("ADI: four mentorship themes as an editorial index", (await page.$$eval(".cu-theme", (t) => t.length)) === 4);
  } else {
    const stages = await page.$$eval(".cu-stage", (s) => s.map((x) => x.querySelector(".cu-stage__semester").textContent + "|" + x.querySelector(".cu-stage__role").textContent));
    ok("ESP: the progression with real semesters — Spring 2024 student → Fall 2024 TA → Spring 2025 teaching", stages.join(" → ") === "Spring 2024|Student → Fall 2024|Teaching assistant → Spring 2025|Teaching", stages.join(" → "));
    ok("ESP: one activity example; program-wide offerings set apart from her teaching", (await page.$$eval(".cu-example", (e) => e.length)) === 1 && /Across the program/i.test(await page.$eval(".cu-program", (e) => e.innerText)));
    ok("ESP: teaching period kept apart from participation (Fall 2024–Spring 2025 in the facts)", (await page.$eval(".cu-hero__dates", (e) => e.textContent)) === "Fall 2024–Spring 2025");
  }
  const outline = await page.$$eval("main h1, main h2, main h3", (hs) => hs.map((h) => +h.tagName[1]));
  ok(`${pg.tag}: headings — one h1, no skipped levels`, outline.filter((l) => l === 1).length === 1 && outline.every((lv, i) => !i || lv - outline[i - 1] <= 1), outline.join(""));
  ok(`${pg.tag}: no photo placeholders, buttons, external links or downloads`, (await page.$$eval("main [class*='photo'], main button, main a[href^='http'], main [download]", (x) => x.length)) === 0);
  ok(`${pg.tag}: no console errors`, errors.length === 0, errors.join(" | "));
  // anchors + focus
  const ids = await page.$$eval(".toc__link", (as) => as.map((a) => a.hash.slice(1)));
  const landed = [];
  for (const id of ids) {
    await page.click(`.toc__link[href="#${id}"]`);
    await page.waitForTimeout(1000);
    landed.push(await page.evaluate((id) => ({ id, gap: Math.round(document.getElementById(id).getBoundingClientRect().top - document.querySelector(".site-header").getBoundingClientRect().bottom), bottom: document.documentElement.scrollHeight - innerHeight - scrollY < 2, focused: document.activeElement?.id === id }), id));
  }
  ok(`${pg.tag}: On this page lands under the header and moves focus`, landed.every((l) => ((l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)) && l.focused), JSON.stringify(landed.map((l) => [l.id, l.gap, l.focused])));
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(450);
  const dr = await page.evaluate(() => ({
    cur: [...document.querySelectorAll('#work-sheet [aria-current="page"]')].map((a) => a.getAttribute("href")),
    crown: (() => { const t = document.querySelector(".sheet-entry--teaching .sheet-entry__tile"); const i = t.querySelector("img"); return { bg: getComputedStyle(t).backgroundColor, src: i.getAttribute("src"), shown: i.complete && i.naturalWidth > 0 }; })(),
    pill: (() => { const p = document.querySelector('.sheet-entry__sub[href="/work/adi-mentorship"] .sheet-entry__pill'); return p ? { overflow: getComputedStyle(p).overflow, hidden: p.getAttribute("aria-hidden") } : null; })(),
    focus: document.activeElement?.getAttribute("href"),
  }));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  ok(`${pg.tag}: drawer — this page marked and focused; Teaching shows the crown untiled; ADI's pill beside its link`, dr.cur.join() === `/work/${pg.slug}` && dr.focus === `/work/${pg.slug}` && dr.crown.bg === "rgba(0, 0, 0, 0)" && dr.crown.src.endsWith("columbia-crown-light.png") && dr.crown.shown && dr.pill?.overflow === "hidden" && dr.pill.hidden === "true", JSON.stringify(dr));
  await ctx.close();

  // System mode follows the OS, and the first painted frame already shows the right wordmark
  for (const scheme of ["dark", "light"]) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
    const p = await c.newPage();
    await p.addInitScript(() => {
      localStorage.removeItem("theme");
      requestAnimationFrame(() => { window.__first = [...document.querySelectorAll(".cu-wordmark img")].filter((i) => getComputedStyle(i).visibility === "visible").map((i) => i.getAttribute("src").split("/").pop()); });
    });
    await p.goto(`${base}/work/${pg.slug}`, { waitUntil: "networkidle" });
    const first = await p.evaluate(() => window.__first);
    const want = `columbia-wordmark-${scheme}.png`;
    ok(`${pg.tag}: System (${scheme}) — the right wordmark from the first frame, no flash`, first?.join() === want && (await visibleSrc(p)).join() === want, `${first} → ${(await visibleSrc(p)).join()}`);
    await c.close();
  }
  // layout
  for (const vp of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844 }, { width: 360, height: 740 }]) {
    for (const theme of ["light", "dark"]) {
      const c = await browser.newContext({ viewport: vp, colorScheme: theme, isMobile: vp.width < 700, hasTouch: vp.width < 700 });
      const p = await c.newPage();
      await p.goto(`${base}/work/${pg.slug}`, { waitUntil: "networkidle" });
      const lay = await p.evaluate(() => ({ over: document.documentElement.scrollWidth - innerWidth, clipped: [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main dd")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 2); }).length, height: document.documentElement.scrollHeight }));
      ok(`${pg.tag} ${vp.width}-${theme}: no overflow or clipped text`, lay.over <= 0 && lay.clipped === 0, JSON.stringify(lay));
      await c.close();
    }
  }
}

/* ---------------------------------------------- the homepage Teaching card */
{
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const card = await page.evaluate(() => {
      const p = document.querySelector(".panel--teaching"), logo = p.querySelector(".panel__logo"), img = logo.querySelector("img");
      const ir = img.getBoundingClientRect(), lr = logo.getBoundingClientRect();
      return { surface: getComputedStyle(p).backgroundColor, tile: getComputedStyle(logo).backgroundColor, shadow: getComputedStyle(logo).boxShadow, src: img.getAttribute("src"), opacity: getComputedStyle(img).opacity, svg: p.querySelectorAll(".panel__logo svg").length, visibleH: Math.round(ir.height * 239 / 300), slot: `${Math.round(lr.width)}x${Math.round(lr.height)}`, centred: Math.abs(ir.left + ir.width / 2 - (lr.left + lr.width / 2)) < 1.5 };
    });
    const expectSurface = theme === "light" ? "rgb(176, 185, 218)" : "rgb(160, 170, 210)";
    ok(`homepage card (${theme}): the standalone Columbia crown (no tile, no generic icon) on the unchanged lavender surface`, card.surface === expectSurface && card.tile === "rgba(0, 0, 0, 0)" && card.shadow === "none" && card.src.endsWith("columbia-crown-light.png") && card.opacity === "1" && card.svg === 0 && card.slot === "60x60" && card.centred, JSON.stringify(card));
    await ctx.close();
  }
  // only the Teaching card's identifier changed: compare against the pre-change snapshot outside that box
  const base1440 = "qa/screenshots/unchanged/base/home-1440.png";
  if (existsSync(base1440)) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", colorScheme: "light", deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const box = await page.$eval(".panel--teaching .panel__logo", (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height }; });
    const now = await page.screenshot({ fullPage: true, animations: "disabled" });
    const [a, b] = await Promise.all([sharp(base1440).raw().toBuffer({ resolveWithObject: true }), sharp(now).raw().toBuffer({ resolveWithObject: true })]);
    let outside = 0, inside = 0;
    if (a.info.width === b.info.width && a.info.height === b.info.height) {
      const ch = a.info.channels;
      for (let y = 0; y < a.info.height; y++)
        for (let x = 0; x < a.info.width; x++) {
          const i = (y * a.info.width + x) * ch;
          if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) > 40) {
            const pad = 4;
            if (x >= box.x - pad && x <= box.x + box.w + pad && y >= box.y - pad && y <= box.y + box.h + pad) inside++;
            else outside++;
          }
        }
    }
    ok("homepage: pixels change only inside the Teaching card's identifier slot (vs the pre-change snapshot)", a.info.height === b.info.height && outside < 0.0005 * a.info.width * a.info.height && inside > 0, `${outside} px outside, ${inside} inside`);
    await ctx.close();
  }
}

/* reduced motion */
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  for (const s of ["esp-teaching", "adi-mentorship"]) {
    await page.goto(`${base}/work/${s}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    ok(`reduced motion (${s}): nothing animates`, (await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length)) === 0);
  }
  await page.context().close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} Columbia checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
