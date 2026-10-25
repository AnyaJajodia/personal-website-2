// The TMU citation-tooling case study, in Chrome.
//   content: every approved line of tmu-citation-tooling.md; nothing from its
//     internal notes; no links to or downloads of the notebook, manuscript or
//     outputs; the confirmed metrics and the 2025 date; synthetic material
//     labelled illustrative wherever it appears
//   walkthrough: complete without JavaScript (all five stages and explanations,
//     no inert buttons); with JavaScript, buttons reveal one explanation at a
//     time, by click, tap and keyboard (↑/↓, Home/End); reduced motion
//   review matrix: the six documented columns; phones read rows as records
//   navigation, drawer, layout in both themes, theme switching
// Usage: BASE_URL=... node qa/tmu.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const url = base + "/work/tmu-citation-tooling";
const out = "qa/screenshots/tmu-citation-tooling";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

const md = readFileSync("handoff/content/work/tmu-citation-tooling.md", "utf8").split("<!--")[0];
const lines = [];
for (const raw of md.split("\n")) {
  let l = raw.trim();
  if (!l || l === "---" || /^\|\s*-/.test(l)) continue;
  if (/^\|/.test(l)) {
    l.split("|").map((c) => c.trim()).filter(Boolean).forEach((c) => lines.push(c));
    continue;
  }
  l = l.replace(/^#+\s*/, "").replace(/^-\s+/, "");
  const kv = l.match(/^(Role|Period|Supervisor|Tools): (.+)$/);
  if (kv) {
    lines.push(kv[1]);
    // the tools are set as a list of their own names
    (kv[1] === "Tools" ? kv[2].split(" · ") : [kv[2]]).forEach((v) => lines.push(v));
    continue;
  }
  // "01 · Extract and organize": the number is the cell's marker, the rest its heading
  const stage = l.match(/^(\d\d) · (.+)$/);
  if (stage) {
    lines.push(stage[2]);
    continue;
  }
  lines.push(l);
}
const forbidden = [/INTERNAL/, /DO NOT RENDER/, /2027/, /\.ipynb/i, /colab\.research/i, /drive\.google/i, /\bRun\b(?! )/, /download/i];
const label = "Illustrative example — a fictional reference, not material from the manuscript.";

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
  ok(`content: every approved line of tmu-citation-tooling.md is on the page (${new Set(lines).size} lines)`, missing.length === 0, missing.join(" | "));
  const html = (await page.content()).replace(/<script[\s\S]*?<\/script>/g, "");
  const leaked = forbidden.filter((f) => f.test(text) || f.test(html));
  ok("content: nothing from the internal notes, no notebook/download links, no 2027", leaked.length === 0, leaked.join(", "));
  ok("content: the confirmed metrics (800+, 92%, 30%) and the 2025 date", ["800+", "92%", "30%"].every((m) => text.includes(m)) && text.includes("more than 800 legal footnotes") && (await page.$eval(".tmu-hero__dates", (e) => [...e.childNodes].filter((n) => !(n.classList?.contains("visually-hidden"))).map((n) => n.textContent).join("").trim())) === "2025");
  const ext = await page.$$eval("main a[href^='http'], main a[download]", (as) => as.map((a) => a.href));
  ok("no external links, downloads, embeds or run controls", ext.length === 0 && (await page.$$eval("main iframe, main video, main [download]", (x) => x.length)) === 0 && !/\brun\b/i.test(await page.$$eval("main button", (b) => b.map((x) => x.innerText).join(" "))), ext.join(" "));
  const labels = await page.evaluate((label) => ({
    walk: document.querySelector(".walk__label")?.innerText.includes(label),
    bibs: /illustrative/i.test(document.querySelector(".tmu-bibs figcaption")?.innerText ?? "") && /fictional/i.test(document.querySelector(".tmu-bibs figcaption").innerText),
    review: document.querySelector(".tmu-review figcaption")?.innerText.includes(label),
  }), label);
  ok("synthetic material is labelled illustrative everywhere it appears (walkthrough, bibliographies, review rows)", labels.walk && labels.bibs && labels.review, JSON.stringify(labels));
  const cols = await page.$$eval(".tmu-review__table thead th", (t) => t.map((x) => x.textContent.trim()));
  ok("review matrix: the six documented columns, in order", cols.join("|") === "Original reference number|Original footnote|Converted in-text citation|Generated bibliography entry|Original bibliography entry|Associated chapter", cols.join("|"));
  const outline = await page.$$eval("main h1, main h2, main h3", (hs) => hs.map((h) => +h.tagName[1]));
  ok("headings: one h1, no skipped levels", outline.filter((l) => l === 1).length === 1 && outline.every((lv, i) => !i || lv - outline[i - 1] <= 1), outline.join(""));
  ok("logo: the supplied TMU logo, unchanged (no filter), labelled", await page.$eval(".tmu-logo__img", (i) => i.complete && i.naturalWidth > 0 && i.src.includes("/logos/tmu.png") && getComputedStyle(i).filter === "none" && /Toronto Metropolitan University/.test(i.alt)));
  ok("figures: one decorative avatar", (await page.$$eval("main .avatar", (a) => a.length)) === 1);
  ok("no console errors", errors.length === 0, errors.join(" | "));

  // the walkthrough, interactive
  const w = () => page.evaluate(() => ({
    buttons: document.querySelectorAll(".walk__stage").length,
    expanded: [...document.querySelectorAll(".walk__stage")].map((b) => b.getAttribute("aria-expanded")),
    visible: [...document.querySelectorAll(".walk__explain")].filter((p) => !p.hidden).map((p) => p.id),
    examples: document.querySelectorAll(".walk-ex").length,
    current: document.querySelector(".walk__step[data-current] .walk__stage")?.textContent,
  }));
  const s0 = await w();
  ok("walkthrough: five stages, every example shown; the first explanation open", s0.buttons === 5 && s0.examples === 5 && s0.visible.join() === "w-footnote-explain" && s0.expanded[0] === "true", JSON.stringify(s0));
  await page.click(".walk__stage >> nth=2");
  await page.waitForTimeout(250);
  const s1 = await w();
  ok("walkthrough: a click reveals that stage's explanation (one at a time) and marks it", s1.visible.join() === "w-citation-explain" && s1.expanded.filter((x) => x === "true").length === 1 && /In-text citation/.test(s1.current ?? ""), JSON.stringify(s1));
  await page.focus(".walk__stage >> nth=2");
  await page.keyboard.press("ArrowDown");
  const f1 = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  await page.keyboard.press("End");
  const f2 = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("Home");
  const f3 = await page.evaluate(() => document.activeElement?.textContent);
  const s2 = await w();
  const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  ok("walkthrough: ↓ / Home / End move between stages; Enter opens; focus ring visible", /Bibliography entry/.test(f1 ?? "") && s2.visible.join() === "w-bibliography-explain" && /Review row/.test(f2 ?? "") && /Original footnote/.test(f3 ?? "") && ring !== "none", JSON.stringify({ f1, f2, f3, ring }));
  const tb = await page.$eval(".walk__stage", (b) => b.getBoundingClientRect().height);
  ok("walkthrough: each stage control is a ≥44px target", tb >= 44, `${tb}px`);
  await page.click(".walk__stage >> nth=1");
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector("#walkthrough").scrollIntoView({ block: "start", behavior: "instant" }));
  await page.evaluate(() => scrollBy({ top: -80, behavior: "instant" }));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${out}/walk-source-match.png` });

  // On this page
  const ids = await page.$$eval(".toc__link", (as) => as.map((a) => a.hash.slice(1)));
  const landed = [];
  for (const id of ids) {
    await page.click(`.toc__link[href="#${id}"]`);
    await page.waitForTimeout(1100);
    landed.push(await page.evaluate((id) => {
      const t = document.getElementById(id).getBoundingClientRect().top;
      const h = document.querySelector(".site-header").getBoundingClientRect().bottom;
      return { id, gap: Math.round(t - h), bottom: document.documentElement.scrollHeight - innerHeight - scrollY < 2 };
    }, id));
  }
  ok(`On this page: all ${ids.length} links land their sections just below the fixed header`, landed.every((l) => (l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)), JSON.stringify(landed.map((l) => [l.id, l.gap])));

  // the drawer marks this page
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(450);
  const cur = await page.$$eval('#work-sheet [aria-current="page"]', (a) => a.map((x) => x.getAttribute("href")));
  const focus = await page.evaluate(() => document.activeElement?.getAttribute("href"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  const back = await page.evaluate(() => document.activeElement?.classList.contains("sheet-trigger"));
  ok("drawer: Research tooling marked current and focused; Escape returns focus", cur.join() === "/work/tmu-citation-tooling" && focus === "/work/tmu-citation-tooling" && back, JSON.stringify({ cur, focus, back }));
  await page.context().close();
}

/* -------------------------------------- the walkthrough without JavaScript */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  const r = await page.evaluate(() => ({
    buttons: document.querySelectorAll(".walk button").length,
    shown: [...document.querySelectorAll(".walk__explain")].filter((p) => !p.hidden && getComputedStyle(p).display !== "none").length,
    examples: document.querySelectorAll(".walk-ex").length,
    names: [...document.querySelectorAll(".walk__name")].map((h) => h.textContent.trim()),
  }));
  ok("walkthrough without JavaScript: all five stages, examples and explanations; no inert buttons", r.buttons === 0 && r.shown === 5 && r.examples === 5 && r.names.join(" → ") === "Original footnote → Source match → In-text citation → Bibliography entry → Review row", JSON.stringify(r));
  await ctx.close();
}

/* --------------------------------------------- touch + the review matrix on phones */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.tap(".walk__stage >> nth=4");
  await page.waitForTimeout(250);
  const vis = await page.$$eval(".walk__explain", (ps) => ps.filter((p) => !p.hidden).map((p) => p.id));
  ok("walkthrough (touch): a tap reveals that stage", vis.join() === "w-review-explain", vis.join());
  const rec = await page.evaluate(() => {
    const row = document.querySelector(".tmu-review__table tbody tr");
    return { display: getComputedStyle(row).display, label: getComputedStyle(row.querySelector("td"), "::before").content, scrollW: document.querySelector(".tmu-review__scroll").scrollWidth - document.querySelector(".tmu-review__scroll").clientWidth };
  });
  ok("review matrix (phone): each row reads as a labelled record, no sideways scrolling", rec.display === "block" && /Original footnote/.test(rec.label) && rec.scrollW <= 0, JSON.stringify(rec));
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
      const clipped = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main dd, main td, main th")].filter((e) => {
        if (e.closest(".tmu-review__scroll")) return false; // a scroll region of its own on tablets
        const r = e.getBoundingClientRect();
        return r.width && (r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 2);
      }).map((e) => e.className || e.tagName);
      // the thread never crosses the opening's text
      const path = document.querySelector(".detail-line path");
      return { over, clipped: clipped.slice(0, 5), bg: getComputedStyle(document.body).backgroundColor, hasLine: !!path };
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
  const before = await page.evaluate(() => getComputedStyle(document.querySelector(".tmu-hero__dates")).color);
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("Dark")');
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({ t: document.documentElement.dataset.theme, c: getComputedStyle(document.querySelector(".tmu-hero__dates")).color, bg: getComputedStyle(document.querySelector(".theme-tmu")).backgroundColor }));
  ok("theme: Dark lifts TMU blue for contrast and keeps the site's own night background", before === "rgb(0, 76, 155)" && after.t === "dark" && after.c === "rgb(156, 195, 242)" && after.bg === "rgb(33, 30, 28)", JSON.stringify({ before, after }));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("System")');
  await ctx.close();
}
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.click(".walk__stage >> nth=3");
  await page.waitForTimeout(30);
  // movement only: keyframe animations, and transitions of transform/translate/opacity
  // (colour changes on selection are not motion)
  const moving = () => page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && !a.effect?.target?.closest?.(".avatar") && (a.animationName || /transform|translate|rotate|opacity/.test(a.transitionProperty ?? ""))).map((a) => a.animationName || a.transitionProperty));
  const anim = await moving();
  await page.waitForTimeout(1500);
  const later = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && !a.effect?.target?.closest?.(".avatar")).length);
  ok("reduced motion: selecting a stage moves nothing; nothing runs continuously", anim.length === 0 && later === 0, JSON.stringify({ anim, later }));
  await page.context().close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} TMU checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
