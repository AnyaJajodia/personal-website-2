// The Inteli-lens page (iteration 27), in Chrome.
//   content: every public line of handoff/content/work/inteli-lens.md is on the
//     page; nothing from its internal notes or the retired copy is (unconfirmed
//     tools, validation claims, CCTV/desktop/pipeline wording); three sections,
//     no "On this page"
//   illustration: the generated mockup near the prototype text, lazy, loaded,
//     uncropped (rendered ratio = file ratio; nothing hidden by the frame), the
//     visible caption, descriptive alt, a working full-size link
//   design: lavender/plum accents (thread, brackets, labels) with the shared
//     backgrounds; text contrast ≥ 4.5:1 for every text node, both themes;
//     the detection box settles once (and not at all with reduced motion)
//   avatar: decorative, feet on the closing rule, overlapping no text
//   navigation: breadcrumb, skip link, pager, drawer entry; homepage panel 2022
//   layout: no horizontal overflow at five widths, both themes
// Usage: BASE_URL=... node qa/inteli.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const url = base + "/work/inteli-lens";
const out = "qa/screenshots/inteli";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/\s+/g, " ").trim();

/* the public copy: the Markdown above its notes, joined into paragraphs,
   without heading marks, bold labels or emphasis */
const md = readFileSync("handoff/content/work/inteli-lens.md", "utf8").split("<!--")[0];
const expected = [];
for (const block of md.split(/\n\s*\n/)) {
  for (let l of block.split(/ {2}\n/)) {
    l = norm(l.replace(/^#+\s*/, "").replace(/\*\*([^*]+):\*\*\s*/, "").replace(/\*/g, ""));
    if (!l || l === "---") continue;
    // "Python · JupyterLab · …" is set as a list
    if (l.includes(" · ")) expected.push(...l.split(" · "));
    else expected.push(l);
  }
}
const notes = readFileSync("handoff/content/work/inteli-lens.md", "utf8").split("<!--")[1] ?? "";
const forbidden = [
  "INTERNAL", "DO NOT RENDER", "PyQt5", "FFmpeg", "SQLite", "scikit", "NumPy", "CCTV", "desktop prototype",
  "precision", "recall", "validated the model", "blood alcohol", "BAC", "accuracy", "labeled dataset",
  "An early video-detection experiment in Jupyter", "From footage to a working prototype", "drunk-driving incidents",
  "Decode", "Classify", "My contribution", "Overview", "Scope", "2027", "2023",
  ...notes.split("\n").map((l) => l.trim()).filter((l) => l.length > 40).slice(0, 6),
];

const b = await chromium.launch({ channel: "chrome" });

/* ------------------------------------------------ 1. content and structure */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  p.on("pageerror", (e) => errors.push(e.message));
  const imgReqs = [];
  p.on("request", (r) => r.resourceType() === "image" && r.url().includes("/assets/inteli-lens/") && imgReqs.push(r.url().split("/").pop()));
  await p.goto(url, { waitUntil: "networkidle" });
  const text = norm(await p.$eval("main", (m) => m.textContent));
  const missing = expected.filter((e) => !text.includes(e));
  ok(`copy: every public line of inteli-lens.md is on the page (${expected.length} strings)`, missing.length === 0, missing.join(" | "));
  const head = await p.evaluate(() => document.title + " " + document.querySelector('meta[name="description"]').content);
  const leaks = forbidden.filter((f) => text.includes(f) || head.includes(f));
  ok("copy: no internal notes, unconfirmed tools, validation/BAC claims or retired copy (page, title, description)", leaks.length === 0, leaks.join(" | "));
  ok("copy: no HTML comment or staging text rendered", !(await p.content()).includes("IMPLEMENTATION NOTES"));
  const s = await p.evaluate(() => ({
    h1: document.querySelector("h1").textContent,
    h2: [...document.querySelectorAll("main h2")].map((h) => h.textContent),
    toc: document.querySelectorAll(".toc, .case-rail, [aria-label='On this page']").length,
    ids: [...document.querySelectorAll(".il-section")].map((x) => x.id),
    facts: [...document.querySelectorAll(".il-facts dt")].map((d) => d.textContent),
    tools: [...document.querySelectorAll(".il-tools li")].map((l) => l.textContent),
    year: document.querySelector(".il-hero__year").textContent,
    crumb: document.querySelector(".breadcrumb a").getAttribute("href"),
    skip: document.querySelector(".skip-link").getAttribute("href"),
    pager: [...document.querySelectorAll(".pager a")].map((a) => a.getAttribute("href")),
  }));
  ok("structure: h1 is the question; three sections (idea, prototype, looking back); no “On this page”", s.h1 === "Could movement reveal signs of impairment?" && s.h2.join("|") === "The idea|Building the prototype|Looking back" && s.toc === 0 && s.ids.join(",") === "the-idea,building-the-prototype,looking-back", JSON.stringify(s));
  ok("facts: Type, Tools (Python · JupyterLab · OpenCV · TensorFlow) and the year 2022", s.facts.join(",") === "Type,Tools" && s.tools.join(",") === "Python,JupyterLab,OpenCV,TensorFlow" && s.year.includes("2022"), JSON.stringify([s.facts, s.tools, s.year]));
  ok("navigation: breadcrumb to Work, skip link to main, pager back/prev/next", s.crumb === "/#work" && s.skip === "#main" && s.pager.join(",") === "/#work,/work/tmu-citation-tooling,/work/gvi-conservation", s.pager.join(","));
  // (Chrome fetches loading="lazy" images already within ~1250px of the viewport, as this one is)
  ok("illustration: one prepared copy fetched (never the 1.6 MB PNG)", imgReqs.length <= 1 && !imgReqs.some((r) => r.endsWith(".png")), imgReqs.join(","));

  // the illustration
  await p.locator(".il-figure").scrollIntoViewIfNeeded();
  await p.waitForFunction(() => { const i = document.querySelector(".il-figure__img"); return i.complete && i.naturalWidth > 0; }, null, { timeout: 8000 });
  const f = await p.evaluate(() => {
    const i = document.querySelector(".il-figure__img");
    const r = i.getBoundingClientRect();
    const fig = document.querySelector(".il-figure");
    const prev = fig.previousElementSibling;
    const frame = document.querySelector(".il-figure__frame").getBoundingClientRect();
    return {
      loading: i.getAttribute("loading"), src: i.currentSrc.split("/").pop(), natural: +(i.naturalWidth / i.naturalHeight).toFixed(3), ratio: +(r.width / r.height).toFixed(3),
      fit: getComputedStyle(i).objectFit, clipped: r.width > frame.width + 1 || r.height > frame.height + 1,
      cap: document.querySelector(".il-figure__cap span").textContent, alt: i.alt, labelled: fig.getAttribute("aria-labelledby"),
      afterPrototypeText: prev?.textContent.includes("Working independently in JupyterLab"), full: document.querySelector(".il-figure__full").getAttribute("href"),
      newTab: document.querySelector(".il-figure__full").target,
    };
  });
  ok("illustration: placed right after the prototype paragraph; lazy; loaded (WebP copy)", f.afterPrototypeText && f.loading === "lazy" && /mockup-(960|1600)\.webp$/.test(f.src), JSON.stringify(f));
  ok("illustration: uncropped — rendered ratio = file ratio, object-fit not cover, inside its frame", Math.abs(f.ratio - 1597 / 985) < 0.01 && Math.abs(f.natural - 1597 / 985) < 0.01 && f.fit !== "cover" && !f.clipped, `${f.ratio}/${f.natural} ${f.fit}`);
  ok("illustration: visible caption “Illustrative reconstruction of the early prototype.” labels the figure", f.cap === "Illustrative reconstruction of the early prototype." && f.labelled === "il-figure-cap");
  ok("illustration: alt describes it as an illustration, including its own disclosure", f.alt.length > 120 && /Illustration/.test(f.alt) && /Illustrative reconstruction/.test(f.alt));
  const full = await p.request.get(base + f.full);
  ok("illustration: “View full size” opens the original PNG in a new tab (200, image/png)", full.status() === 200 && full.headers()["content-type"].includes("image/png") && f.newTab === "_blank", `${full.status()} ${full.headers()["content-type"]}`);
  // the corner disclosure is inside the rendered image: the original's bottom-right corner, uncropped
  const corner = await p.evaluate(async () => {
    const i = document.querySelector(".il-figure__img");
    const c = document.createElement("canvas");
    c.width = i.naturalWidth; c.height = i.naturalHeight;
    const g = c.getContext("2d");
    g.drawImage(i, 0, 0);
    // dark text pixels in the region the "Illustrative reconstruction" label occupies (x 84–96%, y 92–95.5%)
    const x0 = Math.round(c.width * 0.84), y0 = Math.round(c.height * 0.92), w = Math.round(c.width * 0.12), h = Math.round(c.height * 0.035);
    const d = g.getImageData(x0, y0, w, h).data;
    let dark = 0;
    for (let k = 0; k < d.length; k += 4) if (d[k] + d[k + 1] + d[k + 2] < 450) dark++;
    return dark;
  });
  ok("illustration: its own “Illustrative reconstruction” label is still in the served image", corner > 40, `${corner} text pixels`);
  ok("no console errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

/* ------------------------------------------------ 2. themes: accents, contrast, avatar, overflow */
const lum = (c) => {
  const [r, g, bl] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
};
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle" });
  await p.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
  await p.waitForTimeout(600);
  const a = await p.evaluate(() => {
    const cs = (sel, prop, pseudo) => getComputedStyle(document.querySelector(sel), pseudo)[prop];
    return {
      bg: getComputedStyle(document.body).backgroundColor,
      thread: cs(".detail-line path", "stroke"),
      box: cs(".il-box", "backgroundImage", "::before"),
      boxAnim: cs(".il-box", "animationName", "::before"),
      label: cs(".il-facts dt", "color"),
      year: cs(".il-hero__year", "color"),
      lead: cs(".il-limit__lead", "color"),
      mark: cs(".il-mark", "stroke"),
    };
  });
  const lav = theme === "light" ? "rgb(139, 120, 162)" : "rgb(196, 175, 212)";
  const ink = theme === "light" ? "rgb(81, 65, 94)" : "rgb(196, 175, 212)";
  const bg = theme === "light" ? "rgb(247, 244, 238)" : "rgb(33, 30, 28)";
  ok(`${theme}: the shared background; thread, brackets and lens mark in lavender; labels, year and the data lead in ${theme === "light" ? "plum" : "lavender"}`, a.bg === bg && a.thread === lav && a.box.includes(lav) && a.mark === lav && a.label === ink && a.year === ink && a.lead === ink, JSON.stringify(a));
  ok(`${theme}: reduced motion — the detection box is simply there (no animation)`, a.boxAnim === "none", a.boxAnim);

  // every text node's contrast against the page background
  const low = await p.evaluate(() => {
    const parse = (c) => c.match(/[\d.]+/g).map(Number);
    const L = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const pageBg = parse(getComputedStyle(document.body).backgroundColor);
    const bad = [];
    const w = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (el.closest(".visually-hidden, [aria-hidden='true']")) continue;
      const st = getComputedStyle(el);
      if (st.visibility === "hidden" || +st.opacity === 0) continue;
      const fg = parse(st.color);
      const a = fg[3] ?? 1;
      const mixed = fg.slice(0, 3).map((v, i) => v * a + pageBg[i] * (1 - a));
      const [hi, lo] = [L(mixed), L(pageBg)].sort((x, y) => y - x);
      const ratio = (hi + 0.05) / (lo + 0.05);
      if (ratio < 4.5) bad.push(`${el.className || el.tagName}: ${ratio.toFixed(2)}`);
    }
    return [...new Set(bad)];
  });
  ok(`${theme}: every text node ≥ 4.5:1 against the page`, low.length === 0, low.join(", "));

  const av = await p.evaluate(() => {
    const el = document.querySelector(".avatar--il-think");
    const img = el.querySelector("img");
    const r = el.getBoundingClientRect();
    const base = parseFloat(getComputedStyle(el).getPropertyValue("--base"));
    const pager = document.querySelector(".pager").getBoundingClientRect();
    const feet = r.top + r.height * base;
    const texts = [...document.querySelectorAll(".il-back p, .il-h2")].map((t) => t.getBoundingClientRect());
    const overlap = texts.some((t) => !(r.right <= t.left || r.left >= t.right || r.bottom <= t.top || r.top >= t.bottom));
    return { hidden: el.getAttribute("aria-hidden"), alt: img.alt, loaded: img.complete && img.naturalWidth > 0, gap: +(feet - pager.top).toFixed(1), overlap };
  });
  ok(`${theme}: avatar decorative, loaded, feet on the closing rule (±3px), over no text`, av.hidden === "true" && av.alt === "" && av.loaded && Math.abs(av.gap) <= 3 && !av.overlap, JSON.stringify(av));
  await ctx.close();

  for (const [vw, vh] of [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 640]]) {
    const c2 = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, reducedMotion: "reduce" });
    const q = await c2.newPage();
    await q.goto(url, { waitUntil: "networkidle" });
    await q.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
    await q.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
    await q.waitForTimeout(300);
    const o = await q.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll("main *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > vw + 1 || r.left < -1) && !e.closest(".detail-line"); }).map((e) => e.className || e.tagName);
      const av = document.querySelector(".avatar--il-think").getBoundingClientRect();
      const pager = document.querySelector(".pager").getBoundingClientRect();
      const base = parseFloat(getComputedStyle(document.querySelector(".avatar--il-think")).getPropertyValue("--base"));
      return { sw: document.documentElement.scrollWidth, vw, wide: [...new Set(wide)].slice(0, 5), feet: +(av.top + av.height * base - pager.top).toFixed(1), titleLines: Math.round(document.querySelector(".il-hero__title").getBoundingClientRect().height / parseFloat(getComputedStyle(document.querySelector(".il-hero__title")).lineHeight)) };
    });
    ok(`${theme} ${vw}px: no horizontal overflow; avatar on the rule; title ${o.titleLines} lines`, o.sw <= o.vw && o.wide.length === 0 && Math.abs(o.feet) <= 3, JSON.stringify(o));
    if (vw === 1440 || vw === 390) await q.screenshot({ path: `${out}/qa-${vw}-${theme}.png`, fullPage: true });
    await c2.close();
  }
}

/* ------------------------------------------------ 3. motion: the box settles once */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle" });
  const m = await p.evaluate(() => {
    const an = document.querySelector(".il-box").getAnimations({ subtree: true });
    return an.map((a) => ({ name: a.animationName, dur: a.effect.getTiming().duration, iter: a.effect.getTiming().iterations }));
  });
  ok("motion: the detection box settles once (one ≤1s animation, not repeated)", m.length === 1 && m[0].name === "il-lock" && m[0].dur <= 1000 && m[0].iter === 1, JSON.stringify(m));
  await p.waitForTimeout(1600);
  const end = await p.evaluate(() => getComputedStyle(document.querySelector(".il-box"), "::before").transform);
  ok("motion: it comes to rest exactly on the word", end === "none" || end === "matrix(1, 0, 0, 1, 0, 0)", end);
  await ctx.close();
}

/* ------------------------------------------------ 4. homepage panel and drawer */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const panel = await p.evaluate(() => {
    const a = document.querySelector('a[href="/work/inteli-lens"]');
    const row = a?.closest(".panel, li, article");
    return { date: row?.querySelector(".panel__date")?.textContent, text: row?.textContent.replace(/\s+/g, " ") };
  });
  ok("homepage: the Inteli-lens panel reads 2022 with the revised summary", panel.date === "2022" && panel.text.includes("An independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication."), JSON.stringify(panel));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.click(".site-nav__work");
  await p.waitForTimeout(650);
  const d = await p.evaluate(() => {
    const cur = document.activeElement;
    return { open: document.querySelector("#work-sheet").open, focus: cur?.getAttribute("href"), current: cur?.getAttribute("aria-current"), text: cur?.textContent.replace(/\s+/g, " ").trim() };
  });
  ok("drawer: opens from Work with Inteli-lens focused and marked current", d.open && d.focus === "/work/inteli-lens" && d.current === "page" && /Inteli-lens/.test(d.text), JSON.stringify(d));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(450);
  ok("drawer: Escape closes it and returns focus to Work", !(await p.evaluate(() => document.querySelector("#work-sheet").open)) && (await p.evaluate(() => document.activeElement?.classList.contains("site-nav__work"))));
  // theme control works on this page
  const before = await p.evaluate(() => document.documentElement.dataset.theme ?? "system");
  await p.click(".theme-toggle__button");
  await p.click('.theme-toggle__item:has-text("Dark")');
  await p.waitForTimeout(1000); // past the theme's colour transition
  const after = await p.evaluate(() => [document.documentElement.dataset.theme, getComputedStyle(document.querySelector(".il-facts dt")).color]);
  ok("theme control switches this page to Dark (lavender labels)", before !== "dark" && after[0] === "dark" && after[1] === "rgb(196, 175, 212)", `${before} → ${after.join(" ")}`);
  await ctx.close();
}

await b.close();
const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} Inteli-lens checks passed`);
process.exit(passed === results.length ? 0 : 1);
