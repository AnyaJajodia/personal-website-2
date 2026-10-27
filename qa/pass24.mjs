// Iteration 24 (detail-page design pass) checks, in Chrome.
//   openings: the first section begins within the first desktop screen; two-line titles
//   thread: its flourish has a job (tag over the facts / a mark after the title or
//     wordmark) and crosses no opening text; Lynxster/AMNH keep the default
//   (Inteli-lens joined the case-study openings in iteration 27: a tag over its facts)
//   drawer: opens from Work, Escape closes and returns focus, TMU/GVI identifiable
//   anchors land under the sticky header; Back restores scroll; no overflow; reduced motion
// Usage: BASE_URL=... node qa/pass24.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const results = [];
const ok = (name, pass, detail = "") => { results.push(pass); console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); };
const slugs = ["crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
const kinds = { "crackd-ai": "tag", buzzworks: "tag", "tmu-citation-tooling": "mark", "inteli-lens": "tag", "gvi-conservation": "tag", "pmmy-research": "tag", "teenage-pregnancy-research": "tag", "esp-teaching": "mark", "adi-mentorship": "mark" };
const b = await chromium.launch({ channel: "chrome" });

for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  for (const slug of slugs) {
    const p = await ctx.newPage();
    await p.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(700);
    const m = await p.evaluate(() => {
      const h1 = document.querySelector("h1");
      const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
      // the first substantive content: GVI's is its opening photograph, the others' their first section
      // (Inteli-lens has no rail, so no .case-content: its first .il-section)
      const first = (document.querySelector(".gvi-photo--opening") ?? document.querySelector(".case-content section, .case-content > *, .il-section")).getBoundingClientRect().top;
      const anchor = document.querySelector('[data-line="flourish"]');
      // thread vs the opening's text: sample the path, test against text boxes
      const path = document.querySelector(".detail-line path");
      const svg = path.ownerSVGElement.getBoundingClientRect();
      const len = path.getTotalLength();
      const boxes = [...document.querySelectorAll(".case-hero h1 span[data-line='title'], .case-hero .detail-hero__subtitle, .case-hero dl dd, .case-hero dl dt, .case-hero .breadcrumb, .case-hero__id > *")].map((e) => e.getBoundingClientRect());
      let inside = 0;
      for (let i = 0; i <= 600; i++) {
        const q = path.getPointAtLength((len * i) / 600);
        const x = q.x + svg.left, y = q.y + svg.top;
        if (boxes.some((r) => x > r.left + 2 && x < r.right - 2 && y > r.top + 2 && y < r.bottom - 2)) inside++;
      }
      return { lines, first: Math.round(first), kind: anchor?.dataset.flourish ?? null, inside, over: document.documentElement.scrollWidth - innerWidth };
    });
    ok(`${theme} ${slug}: opening ≤ 720px with a two-line title; flourish "${m.kind}"; thread crosses no opening text; no overflow`, m.first <= 720 && m.lines === 2 && m.kind === kinds[slug] && m.inside === 0 && m.over <= 0, JSON.stringify(m));
    await p.close();
  }
  await ctx.close();
}

// template pages keep the default flourish (no anchor)
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  // (Lynxster has its own page since the Lynxster pass: qa/lynxster.mjs)
  for (const s of ["amnh"]) {
    await p.goto(`${base}/work/${s}`, { waitUntil: "networkidle" });
    ok(`${s}: untouched opening (no case-hero, no flourish anchor)`, (await p.$$eval(".case-hero, [data-line='flourish']", (x) => x.length)) === 0);
  }
  // drawer: labels, Escape, focus return, scroll inside the sheet
  await p.goto(`${base}/work/tmu-citation-tooling`, { waitUntil: "networkidle" });
  await p.focus(".site-nav__work");
  await p.keyboard.press("Enter");
  await p.waitForTimeout(650);
  const d = await p.evaluate(() => ({
    open: document.querySelector("#work-sheet").open,
    notes: [...document.querySelectorAll(".sheet-entry__note")].map((n) => n.textContent.replace(/,?\s*this page/i, "").trim()),
    focus: document.activeElement?.getAttribute("href"),
    ring: getComputedStyle(document.activeElement).outlineStyle,
    scrolls: (() => { const b = document.querySelector(".sheet__body"); return getComputedStyle(b).overflowY === "auto" && getComputedStyle(b).overscrollBehaviorY === "contain"; })(),
  }));
  ok("drawer: opens from Work; focus on this page's entry with a visible ring; the list scrolls inside the sheet", d.open && d.focus === "/work/tmu-citation-tooling" && d.ring !== "none" && d.scrolls, JSON.stringify({ ...d, notes: undefined }));
  ok("drawer: TMU and GVI identifiable in their labels", d.notes.some((n) => /^TMU · Research/.test(n)) && d.notes.some((n) => /^GVI · Fieldwork/.test(n)), d.notes.join(" | "));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
  ok("drawer: Escape closes it and returns focus to Work", !(await p.evaluate(() => document.querySelector("#work-sheet").open)) && (await p.evaluate(() => document.activeElement?.classList.contains("site-nav__work"))));
  // anchors under the sticky header, then Back restores the scroll
  const ids = await p.$$eval(".toc__link", (as) => as.slice(0, 4).map((a) => a.hash.slice(1)));
  const gaps = [];
  for (const id of ids) {
    await p.click(`.toc__link[href="#${id}"]`);
    await p.waitForTimeout(900);
    gaps.push(await p.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top - document.querySelector(".site-header").getBoundingClientRect().bottom), id));
  }
  ok("On this page: sections land just below the sticky header", gaps.every((g) => g >= 4 && g <= 40), gaps.join(","));
  await p.goto(`${base}/work/gvi-conservation`, { waitUntil: "networkidle" });
  await p.evaluate(() => scrollTo(0, 2400));
  await p.waitForTimeout(500);
  const before = await p.evaluate(() => scrollY);
  await p.evaluate(() => document.querySelector(".pager__link--next").click()); // without scrolling to it first
  await p.waitForURL((u) => !u.pathname.includes("gvi-conservation"));
  await p.waitForLoadState("networkidle");
  await p.goBack();
  await p.waitForURL((u) => u.pathname.includes("gvi-conservation"));
  await p.waitForTimeout(800);
  const y = await p.evaluate(() => scrollY);
  ok("browser Back returns to the same place on the page", Math.abs(y - before) < 60, `${before} → ${y}`);
  await ctx.close();
}

// phones + reduced motion: content shown, no overflow
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce", colorScheme: "dark" });
  for (const slug of slugs) {
    const p = await ctx.newPage();
    await p.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
    const m = await p.evaluate(() => ({
      over: document.documentElement.scrollWidth - innerWidth,
      hidden: [...document.querySelectorAll("main h1, main h2, main p, main dd")].filter((e) => { const s = getComputedStyle(e); return s.visibility === "hidden" || +s.opacity < 0.99; }).length,
      tables: [...document.querySelectorAll("main table")].filter((t) => !t.closest(".visually-hidden")).every((t) => { const w = t.parentElement; return t.scrollWidth <= w.clientWidth + 1 || /auto|scroll/.test(getComputedStyle(w).overflowX); }),
    }));
    ok(`phone + reduced motion ${slug}: everything visible without animation; no page overflow; tables scroll in their own frame`, m.over <= 0 && m.hidden === 0 && m.tables, JSON.stringify(m));
    await p.close();
  }
  await ctx.close();
}
await b.close();
const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} iteration-24 checks passed`);
process.exit(passed === results.length ? 0 : 1);
