// The two research-publication pages (PMMY, teenage pregnancy), in Chrome.
// Usage: BASE_URL=... node qa/research.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/⁠/g, "").replace(/\s+/g, " ").trim().toLowerCase();

/** approved lines of a document: no notes, no Markdown marks, link labels only */
function approved(file, fields) {
  const md = readFileSync(file, "utf8").split("<!--")[0];
  const out = [];
  for (const raw of md.split("\n")) {
    let l = raw.trim();
    if (!l || l === "---" || /^\|\s*-/.test(l)) continue;
    if (/^\|/.test(l)) {
      l.split("|").map((c) => c.trim()).filter(Boolean).forEach((c) => out.push(c));
      continue;
    }
    const link = l.match(/^\[(.+?)\]\((.+?)\)$/);
    if (link) continue; // checked as links below
    l = l.replace(/^#+\s*/, "").replace(/^\d\d · /, "");
    const kv = l.match(new RegExp(`^(${fields.join("|")}): (.+)$`));
    if (kv) {
      out.push(kv[1], kv[2]);
      continue;
    }
    out.push(l);
  }
  return [...new Set(out)];
}

const PAPER = "https://ijournals.in/wp-content/uploads/2022/08/12.IJSHRE-100413-Anya.pdf";
const AROGYA = "https://www.saakshartaa.com/project-%C4%81rogya";
const forbidden = [/INTERNAL/, /DO NOT RENDER/, /50\+ women/i, /secur(ed|ing) (startup )?loans/i, /annual/i, /85\.37/, /0\.8537/, /\bMAE\b/, /\bRMSE\b/, /accura(te|cy)\b(?! scores)/i, /total fertility rate/i, /\bDOI\b/, /doi\.org/i, /clinical adoption/i, /testimonial/i];

const browser = await chromium.launch({ channel: "chrome" });

for (const pg of [
  { slug: "pmmy-research", file: "handoff/content/work/pmmy-research.md", fields: ["Role", "Year", "Mentor and co-author", "Publication", "Published title", "Authors", "Journal", "Volume", "Issue", "Published", "Pages"], links: [], other: "teenage-pregnancy-research" },
  { slug: "teenage-pregnancy-research", file: "handoff/content/work/teenage-pregnancy-research.md", fields: ["Role", "Year", "Mentor and co-author", "Publication", "Community partner", "Published title", "Authors", "Journal", "Volume", "Issue", "Published", "Pages"], links: [PAPER, AROGYA], other: "pmmy-research" },
]) {
  const tag = pg.slug.startsWith("pmmy") ? "PMMY" : "Teen";
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/work/${pg.slug}`, { waitUntil: "networkidle" });
  const text = norm(await page.evaluate(() => document.querySelector("main").innerText));
  const lines = approved(pg.file, pg.fields);
  const missing = lines.filter((l) => !text.includes(norm(l)));
  ok(`${tag}: every approved line is on the page (${lines.length} lines)`, missing.length === 0, missing.join(" | "));
  const html = (await page.content()).replace(/<script[\s\S]*?<\/script>/g, "");
  const leaked = forbidden.filter((f) => f.test(text) || f.test(html));
  ok(`${tag}: nothing from the notes, no retired claims, metrics-as-accuracy, DOIs or adoption claims`, leaked.length === 0, leaked.join(", "));
  ok(`${tag}: exact published title, both authors, lead role, Reetu Jain as mentor and co-author, near the top`, await page.evaluate(() => {
    const card = document.querySelector(".rs-paper");
    const order = document.querySelector(".rs-paper").compareDocumentPosition(document.querySelector("#the-question")) & Node.DOCUMENT_POSITION_FOLLOWING;
    const facts = document.querySelector(".rs-facts").innerText;
    return !!order && /Anya Jajodia and Reetu Jain/.test(card.innerText) && /Lead Researcher/.test(facts) && /Mentor and co-author/i.test(facts) && /Reetu Jain/.test(facts);
  }));
  const ext = await page.$$eval("main a[href^='http']", (as) => [...new Set(as.map((a) => a.href))]);
  ok(`${tag}: only the documents' own verified links (${pg.links.length || "none"}), opening safely`, ext.length === pg.links.length && pg.links.every((l) => ext.includes(l)) && (await page.$$eval("main a[href^='http']", (as) => as.every((a) => a.target === "_blank" && /noopener/.test(a.rel)))), ext.join(" "));
  const cross = await page.$$eval(`main a[href="/work/${pg.other}"]`, (as) => as.length);
  ok(`${tag}: contextual links to the companion paper (real route)`, cross >= 2 && (await fetch(`${base}/work/${pg.other}`)).status === 200, `${cross} links`);
  const outline = await page.$$eval("main h1, main h2, main h3", (hs) => hs.map((h) => +h.tagName[1]));
  ok(`${tag}: headings — one h1, no skipped levels`, outline.filter((l) => l === 1).length === 1 && outline.every((lv, i) => !i || lv - outline[i - 1] <= 1), outline.join(""));
  ok(`${tag}: one decorative figure; no buttons, downloads or embeds`, (await page.$$eval("main .avatar", (a) => a.length)) === 1 && (await page.$$eval("main button, main [download], main iframe, main video", (x) => x.length)) === 0);
  ok(`${tag}: no console errors`, errors.length === 0, errors.join(" | "));

  if (tag === "PMMY") {
    const chart = await page.evaluate(() => {
      const plot = document.querySelector(".rs-chart__plot");
      const bars = [...plot.querySelectorAll(".rs-bar")].map((b) => {
        const track = b.querySelector(".rs-bar__track").getBoundingClientRect().width, fill = b.querySelector(".rs-bar__fill").getBoundingClientRect().width;
        return { label: b.querySelector(".rs-bar__label").textContent, value: b.querySelector(".rs-bar__value").textContent, share: Math.round((fill / track) * 100) };
      });
      const rows = [...document.querySelectorAll(".rs-chart__table tbody tr")].map((r) => [r.querySelector("th").textContent, r.querySelector("td").textContent]);
      return { bars, rows, hidden: plot.getAttribute("aria-hidden"), caption: document.querySelector(".rs-chart figcaption").textContent, tcap: document.querySelector(".rs-chart__table caption")?.textContent };
    });
    ok("PMMY chart: bars drawn to the reported values, directly labelled (78 / 12 / 10)", JSON.stringify(chart.bars) === JSON.stringify([{ label: "Positive", value: "78%", share: 78 }, { label: "Neutral", value: "12%", share: 12 }, { label: "Negative", value: "10%", share: 10 }]), JSON.stringify(chart.bars));
    ok("PMMY chart: accessible table (the data assistive tech reads), plot hidden from AT", chart.hidden === "true" && JSON.stringify(chart.rows) === JSON.stringify([["Positive", "78%"], ["Neutral", "12%"], ["Negative", "10%"]]) && !!chart.tcap);
    ok("PMMY chart: captioned as classifications within the 1,000-tweet sample, not the population", /sample of 1,000 PMMY-related tweets/.test(chart.caption) && /not the wider population/.test(chart.caption) && text.includes("not population-wide approval ratings or model-accuracy scores"));
    const methods = await page.evaluate(() => ({
      lanes: [...document.querySelectorAll(".rs-lane__name")].map((l) => l.textContent),
      training: document.querySelector(".rs-training")?.innerText,
      trainingInFlow: !!document.querySelector(".rs-lane__flow .rs-training"),
    }));
    ok("PMMY methods: two strands, with the movie-review training material apart from the tweet flow", methods.lanes.join() === "Financial-program analysis,Twitter sentiment" && /Movie-review sentiment dataset/.test(methods.training ?? "") && !methods.trainingInFlow, JSON.stringify(methods));
    ok("PMMY: no financial trend chart; no paper link invented", (await page.$$eval("main svg", (s) => s.filter((x) => !x.closest(".avatar")).length)) === 0 && ext.length === 0);
  } else {
    const fig = await page.evaluate(() => ({
      rounds: document.querySelectorAll(".rs-nfhs__rounds li").length,
      span: document.querySelector(".rs-nfhs__span").innerText,
      flow: [...document.querySelectorAll(".rs-flow .rs-node__name")].map((n) => n.textContent),
      cap: document.querySelector(".rs-nfhs figcaption").textContent,
    }));
    ok("Teen figure: five NFHS rounds, 1992–2021, not to scale (no invented round years)", fig.rounds === 5 && /1992/.test(fig.span) && /2021/.test(fig.span) && /not to scale/.test(fig.cap), JSON.stringify(fig));
    ok("Teen figure: preparation → exploratory analysis / regression → interpretation", fig.flow.join(" → ") === "Preparation → Exploratory analysis → Linear regression → Interpretation", fig.flow.join(" → "));
    ok("Teen: three distinct narrative parts — study, hospital discussion, Project Ārogya", ["#building-the-study", "#hospital-discussion", "#project-arogya"].every((id) => text.length) && (await page.$$eval("#building-the-study, #hospital-discussion, #project-arogya", (s) => s.length)) === 3);
    ok("Teen hospital: one 2022 presentation, a discussion she led, retained internally (not adoption)", text.includes("in 2022, i presented the research") && text.includes("i led a discussion of the findings") && text.includes("retained in the hospital’s internal database for internal use") && text.includes("should not be confused with adoption into clinical practice"));
    const ar = await page.evaluate(() => ({ reach: document.querySelector(".rs-reach__value")?.textContent, roles: document.querySelectorAll(".rs-roles li").length, photos: document.querySelectorAll(".rs-photo").length, imgs: document.querySelectorAll(".rs-photo img").length }));
    ok("Teen Ārogya: 200+ girls, the four roles (materials, sole leadership, mentoring, support), one optional photo slot", ar.reach === "200+" && ar.roles === 4 && ar.photos === 1 && ar.imgs === 0 && text.includes("sole leader"), JSON.stringify(ar));
    ok("Teen: findings stay in words (no chart of invented values)", (await page.$$eval("#findings svg, #findings .rs-chart", (x) => x.length)) === 0);
  }

  // On this page, focus, drawer
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
  ok(`${tag}: all ${ids.length} On-this-page links land under the header and move focus`, landed.every((l) => ((l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)) && l.focused), JSON.stringify(landed.filter((l) => !(((l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)) && l.focused))));
  // reach it by keyboard, as :focus-visible requires
  await page.focus(".rs-paper a");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  ok(`${tag}: links show a visible focus ring`, ring !== "none", ring);
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(450);
  const cur = await page.$$eval('#work-sheet [aria-current="page"]', (a) => a.map((x) => x.getAttribute("href")));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  ok(`${tag}: drawer marks this paper; Escape returns focus`, cur.join() === `/work/${pg.slug}` && (await page.evaluate(() => document.activeElement?.classList.contains("sheet-trigger"))), cur.join());
  await ctx.close();

  // layout in both themes
  for (const vp of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 740 }]) {
    for (const theme of ["light", "dark"]) {
      const c2 = await browser.newContext({ viewport: vp, colorScheme: theme, isMobile: vp.width < 700, hasTouch: vp.width < 700 });
      const p2 = await c2.newPage();
      await p2.goto(`${base}/work/${pg.slug}`, { waitUntil: "networkidle" });
      const lay = await p2.evaluate(() => {
        const over = document.documentElement.scrollWidth - innerWidth;
        const clipped = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main dd, main td, main th")].filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width && (r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 2);
        }).map((e) => e.className || e.tagName);
        // the chart's value labels stay inside the chart panel
        const chart = document.querySelector(".rs-chart");
        const vals = chart ? [...chart.querySelectorAll(".rs-bar__value")].every((v) => v.getBoundingClientRect().right <= chart.getBoundingClientRect().right - 4) : true;
        return { over, clipped: clipped.slice(0, 5), vals };
      });
      ok(`${tag} ${vp.width}-${theme}: no overflow or clipped text${tag === "PMMY" ? "; chart labels inside" : ""}`, lay.over <= 0 && lay.clipped.length === 0 && lay.vals, JSON.stringify(lay));
      await c2.close();
    }
  }
}

/* theme switching + reduced motion */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(`${base}/work/pmmy-research`, { waitUntil: "networkidle" });
  const a = await page.evaluate(() => getComputedStyle(document.querySelector(".rs-ask")).color);
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("Dark")');
  await page.waitForTimeout(450);
  await page.click(`main a[href="/work/teenage-pregnancy-research"] >> nth=0`);
  await page.waitForURL("**/teenage-pregnancy-research");
  await page.waitForTimeout(400);
  const b = await page.evaluate(() => ({ t: document.documentElement.dataset.theme, c: getComputedStyle(document.querySelector(".rs-ask")).color, bg: getComputedStyle(document.body).backgroundColor }));
  ok("theme: burgundy on paper; Dark persists into the companion page, lifting teal on the site's night", a === "rgb(121, 61, 85)" && b.t === "dark" && b.c === "rgb(169, 214, 202)" && b.bg === "rgb(33, 30, 28)", JSON.stringify({ a, b }));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("System")');
  await ctx.close();
}
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  for (const s of ["pmmy-research", "teenage-pregnancy-research"]) {
    await page.goto(`${base}/work/${s}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    ok(`reduced motion (${s}): nothing animates`, running === 0, `${running} running`);
  }
  await page.context().close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} research checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
