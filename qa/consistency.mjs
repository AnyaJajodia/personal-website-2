// Consistency across the bespoke detail pages (TMU, GVI, PMMY, teenage
// pregnancy; Crackd and Buzzworks for reference): navigation, type scale,
// spacing, theme behaviour, accessibility. Reports a table, fails on drift.
// Usage: BASE_URL=... node qa/consistency.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const slugs = ["tmu-citation-tooling", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "crackd-ai", "buzzworks"];
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const browser = await chromium.launch({ channel: "chrome" });
const rows = {};
for (const theme of ["light", "dark"]) {
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: theme, isMobile: vp.width < 700, hasTouch: vp.width < 700 });
    const page = await ctx.newPage();
    for (const s of slugs) {
      await page.goto(`${base}/work/${s}`, { waitUntil: "networkidle" });
      const m = await page.evaluate(() => {
        const cs = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e) : null; };
        const h2 = [...document.querySelectorAll(".case-content section > h2")].find((h) => !/small/.test(h.className)) ?? document.querySelector(".case-content h2");
        const sec = h2.closest("section");
        const prose = [...document.querySelectorAll(".case-content p")].find((p) => getComputedStyle(p).fontFamily.includes("Inter") && p.textContent.length > 120);
        const toc = document.querySelector(".toc");
        return {
          header: !!document.querySelector(".site-header .sheet-trigger") && document.querySelector(".site-header").getBoundingClientRect().height,
          tocLinks: toc ? toc.querySelectorAll("a").length : 0,
          tocW: toc ? Math.round(toc.getBoundingClientRect().width) : 0,
          h1: parseFloat(cs("h1").fontSize),
          h2: parseFloat(getComputedStyle(h2).fontSize),
          h2Font: getComputedStyle(h2).fontFamily.split(",")[0],
          body: prose ? parseFloat(getComputedStyle(prose).fontSize) : 0,
          lh: prose ? +(parseFloat(getComputedStyle(prose).lineHeight) / parseFloat(getComputedStyle(prose).fontSize)).toFixed(2) : 0,
          // characters a full line holds: the paragraph's width over its own average glyph width
          measure: prose ? (() => { const c = document.createElement("canvas").getContext("2d"); const st = getComputedStyle(prose); c.font = `${st.fontWeight} ${st.fontSize} ${st.fontFamily}`; const avg = c.measureText(prose.textContent).width / prose.textContent.length; return Math.round(prose.getBoundingClientRect().width / avg); })() : 0,
          secPad: Math.round(parseFloat(getComputedStyle(sec).paddingTop)),
          contentLeft: Math.round(document.querySelector(".case-content").getBoundingClientRect().left),
          bg: getComputedStyle(document.body).backgroundColor,
          skip: !!document.querySelector(".skip-link"),
          main: !!document.querySelector("main#main"),
          h1count: document.querySelectorAll("h1").length,
        };
      });
      rows[`${s}|${vp.width}|${theme}`] = m;
    }
    await ctx.close();
  }
}
console.table(Object.fromEntries(Object.entries(rows).filter(([k]) => k.endsWith("|1440|light")).map(([k, v]) => [k.split("|")[0], v])));

const pick = (w, t, key) => slugs.map((s) => rows[`${s}|${w}|${t}`][key]);
const same = (arr) => arr.every((x) => x === arr[0]);
const within = (arr, tol) => Math.max(...arr) - Math.min(...arr) <= tol;
for (const w of [1440, 390]) {
  ok(`@${w}: every page has the header drawer trigger, same header height`, pick(w, "light", "header").every(Boolean) && same(pick(w, "light", "header")), pick(w, "light", "header").join(" "));
  ok(`@${w}: every page has On this page`, pick(w, "light", "tocLinks").every((n) => n >= 5), pick(w, "light", "tocLinks").join(" "));
  ok(`@${w}: same h2 size and serif across pages`, same(pick(w, "light", "h2")) && same(pick(w, "light", "h2Font")), pick(w, "light", "h2").join(" "));
  ok(`@${w}: same body size and line height`, same(pick(w, "light", "body")) && same(pick(w, "light", "lh")), `${pick(w, "light", "body").join(" ")} / ${pick(w, "light", "lh").join(" ")}`);
  ok(`@${w}: same section rhythm (padding)`, same(pick(w, "light", "secPad")), pick(w, "light", "secPad").join(" "));
  ok(`@${w}: same content column`, same(pick(w, "light", "contentLeft")), pick(w, "light", "contentLeft").join(" "));
  ok(`@${w}: h1 within one step of the shared scale`, within(pick(w, "light", "h1"), 1), pick(w, "light", "h1").join(" "));
}
const four = slugs.slice(0, 4);
ok("dark: TMU, GVI and both research pages keep the site's own night background", four.every((s) => rows[`${s}|1440|dark`].bg === "rgb(33, 30, 28)"), four.map((s) => rows[`${s}|1440|dark`].bg).join(" "));
ok("light: all four share the site's paper", four.every((s) => rows[`${s}|1440|light`].bg === "rgb(247, 244, 238)"), four.map((s) => rows[`${s}|1440|light`].bg).join(" "));
ok("accessibility: skip link, main landmark and one h1 on every page", slugs.every((s) => { const r = rows[`${s}|1440|light`]; return r.skip && r.main && r.h1count === 1; }));
// the shared 64ch measure holds ~84 average Inter characters a line; the point here is that it's the same everywhere
ok("readable measure: the same 64ch column on every page (±3 characters)", within(slugs.map((s) => rows[`${s}|1440|light`].measure), 3) && slugs.every((s) => rows[`${s}|1440|light`].measure <= 88), slugs.map((s) => rows[`${s}|1440|light`].measure).join(" "));
await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} consistency checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
