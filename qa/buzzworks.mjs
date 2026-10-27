// The Buzzworks case study, and the shared detail-page header, in Chrome.
//   content: every approved line of handoff/content/work/buzzworks.md; nothing
//     from its internal notes or unconfirmed claims; the conversation is
//     captioned as a fictional reconstruction; the diagram is labelled conceptual
//   structure: heading outline, logo, one figure, no embeds/demos/external links
//   navigation: "On this page" lands under the header; conversation notes jump
//     to real flows; the drawer marks Buzzworks; the header trigger is on every
//     detail page (never the homepage) and fits on phones
//   layout + theme: no overflow at six widths in both themes; a theme chosen
//     here persists across reloads and pages
// Usage: BASE_URL=... node qa/buzzworks.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const url = base + "/work/buzzworks";
const out = "qa/screenshots/buzzworks";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

const md = readFileSync("handoff/content/work/buzzworks.md", "utf8").split("<!--")[0];
const lines = [];
for (const raw of md.split("\n")) {
  let l = raw.trim();
  if (!l || l === "---" || /^\|\s*-/.test(l)) continue;
  if (/^\|/.test(l)) {
    l.split("|").map((c) => c.trim()).filter(Boolean).forEach((c) => lines.push(c));
    continue;
  }
  l = l.replace(/^#+\s*/, "");
  const kv = l.match(/^(Role|Period|Scope): (.+)$/);
  if (kv) {
    lines.push(kv[1], kv[2]);
    continue;
  }
  lines.push(l);
}
const forbidden = [/INTERNAL/, /DO NOT RENDER/, /FastAPI/i, /Kubernetes/i, /autoscal/i, /\bS3\b/, /sub-200/i, /200\s?ms/i, /10K/i, /\bRAG\b/, /confidence score/i, /escalat/i, /retry/i, /duplicate/i, /nominee/i, /2027/, /encrypt/i, /\bcompleted? (bank )?rollout/i, /vector/i, /embedding/i, /pagination/i, /load more/i, /two-agent/i];
const caption = "Illustrative workflows reconstructed using fictional information. No employee data or proprietary application screens are shown.";

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
  ok(`content: every approved line of buzzworks.md is on the page (${new Set(lines).size} lines)`, missing.length === 0, missing.join(" | "));
  const html = await page.content();
  const leaked = forbidden.filter((f) => f.test(text) || f.test(html.replace(/<script[\s\S]*?<\/script>/g, "")));
  ok("content: nothing from the internal notes or unconfirmed claims", leaked.length === 0, leaked.join(", "));
  ok("content: role, May 2025–May 2026, and the rollout as being prepared (not completed)", text.includes("full stack software development intern") && text.includes("may 2025–may 2026") && text.includes("was being prepared for integration into icici bank"));
  const chat = await page.evaluate(() => {
    const f = document.querySelector(".wa");
    return {
      caption: f.querySelector("figcaption").innerText.replace(/\s+/g, " "),
      tabs: [...f.querySelectorAll("[role=tab]")].map((t) => t.textContent),
      img: f.querySelectorAll("img, iframe, video").length,
    };
  });
  ok("reconstruction: four scenarios (form first), captioned with the notes' wording as an illustration", chat.tabs.join("|") === "Complete a form|Ask about a policy|Manage leave|Review an offer" && chat.caption.includes(caption) && /illustration/i.test(chat.caption), chat.caption);
  ok("reconstruction: accessible HTML, no screenshots or embeds (interactions: qa/buzzworks-recon.mjs)", chat.img === 0);
  const figs = await page.$$eval(".bz-system figcaption", (f) => f.map((x) => x.textContent));
  ok("diagrams: the conceptual architecture, and the two-stage policy workflow with processed content from the content API", figs.length === 2 && /conceptual diagram/i.test(figs[0]) && /content API/.test(figs[1]) && (await page.$$eval(".bz-policy .bz-node__stage", (s) => s.map((x) => x.textContent).join())) === "Stage 1 · Claude,Stage 2 · Claude");
  const ext = await page.$$eval("main a[href^='http']", (as) => as.map((a) => a.href));
  ok("no external links, demo buttons, embeds or dialogs in the page", ext.length === 0 && (await page.$$eval("main iframe, main video, main dialog:not(#work-sheet), main button:not(.wa button)", (x) => x.length)) === 0, ext.join(" "));
  const outline = await page.$$eval("main h1, main h2, main h3", (hs) => hs.map((h) => +h.tagName[1]));
  ok("headings: one h1, no skipped levels", outline.filter((l) => l === 1).length === 1 && outline.every((lv, i) => !i || lv - outline[i - 1] <= 1), outline.join(""));
  ok("logo: the supplied minimal Buzzworks symbol (unfiltered) with the name in page type", await page.$eval(".bz-brand", (b) => { const i = b.querySelector("img"); return i.complete && i.naturalWidth > 0 && i.getAttribute("src").includes("/logos/buzzworks-minimal.png") && i.alt === "" && getComputedStyle(i).filter === "none" && b.querySelector(".bz-brand__name").textContent === "Buzzworks"; }));
  ok("figures: one decorative avatar", (await page.$$eval("main .avatar", (a) => a.length)) === 1);
  const green = await page.evaluate(() => {
    const els = [...document.querySelectorAll("main *")].filter((e) => !e.closest(".wa"));
    return els.filter((e) => /rgb\(0, 128, 105\)|rgb\(217, 253, 211\)/.test(getComputedStyle(e).backgroundColor + getComputedStyle(e).color)).length;
  });
  ok("WhatsApp green stays inside the conversation", green === 0, `${green} elements outside`);
  ok("no console errors", errors.length === 0, errors.join(" | "));

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
  ok("On this page: every link lands its section just below the fixed header", landed.every((l) => (l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)), JSON.stringify(landed.map((l) => [l.id, l.gap])));
  // the drawer here marks Buzzworks
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(500);
  const cur = await page.$$eval('#work-sheet [aria-current="page"]', (a) => a.map((x) => x.getAttribute("href")));
  ok("drawer on Buzzworks: Buzzworks is the current entry", cur.join() === "/work/buzzworks", cur.join());
  await page.keyboard.press("Escape");
  await page.context().close();
}

/* ------------------------------------- the shared detail header, everywhere */
{
  const slugs = ["lynxster", "amnh", "crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
  for (const [w, h] of [[1440, 900], [390, 844], [360, 740]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
    const page = await ctx.newPage();
    const bad = [];
    for (const s of slugs) {
      await page.goto(`${base}/work/${s}`, { waitUntil: "domcontentloaded" });
      // the sheet is rendered into <body> once the page has hydrated
      await page.waitForSelector("#work-sheet", { state: "attached" });
      const r = await page.evaluate((s) => {
        const hd = document.querySelector(".site-header"), inner = hd.querySelector(".site-header__inner");
        const t = hd.querySelector(".sheet-trigger"), b = hd.querySelector(".site-header__brand"), tg = hd.querySelector(".theme-toggle__button");
        const tb = t?.getBoundingClientRect(), gb = tg.getBoundingClientRect();
        return {
          s,
          trigger: !!t && !!t.closest(".site-nav") && b.getAttribute("href") === "/",
          current: [...document.querySelectorAll('#work-sheet [aria-current="page"]')].map((a) => a.getAttribute("href")).join(),
          fits: inner.scrollWidth <= inner.clientWidth + 1 && tb && tb.right < gb.left && gb.right <= innerWidth,
        };
      }, s);
      if (!r.trigger || r.current !== `/work/${s}` || !r.fits) bad.push(JSON.stringify(r));
    }
    ok(`header @${w}: every detail page's nav "Work" opens the drawer, marks itself, and the row fits`, bad.length === 0, bad.join(" "));
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    ok(`header @${w}: the homepage has no drawer trigger (unchanged)`, (await page.$$eval(".sheet-trigger, #work-sheet", (x) => x.length)) === 0);
    await ctx.close();
  }
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
      // screen-reader-only text is clipped by design, not a layout fault
      const clipped = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main dd, main td, main th")].filter((e) => !e.closest(".visually-hidden") && !e.classList.contains("visually-hidden")).filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width && (r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 2);
      }).map((e) => e.className || e.tagName);
      return { over, clipped: clipped.slice(0, 5), bg: getComputedStyle(document.querySelector(".theme-buzzworks")).backgroundColor };
    });
    ok(`${vp.width}-${theme}: no horizontal overflow or clipped text`, lay.over <= 0 && lay.clipped.length === 0, JSON.stringify(lay));
    await ctx.close();
  }
}

/* ------------------------------------------------------ theme persistence */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("Dark")');
  await page.waitForTimeout(400);
  await page.reload({ waitUntil: "networkidle" });
  const a = await page.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector(".theme-buzzworks")).backgroundColor }));
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(450);
  await page.click('#work-sheet a[href="/work/crackd-ai"]');
  await page.waitForURL("**/work/crackd-ai");
  await page.waitForTimeout(300);
  const b = await page.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector(".theme-crackd")).backgroundColor }));
  ok("theme: Dark chosen on Buzzworks survives a reload and a move to Crackd", a.t === "dark" && a.bg === "rgb(28, 25, 22)" && b.t === "dark" && b.bg === "rgb(26, 24, 22)", JSON.stringify({ a, b }));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("System")');
  await ctx.close();
}

/* ------------------------------------------------------- reduced motion */
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && !a.effect?.target?.closest?.(".avatar")).length);
  ok("reduced motion: nothing animates on the page", running === 0, `${running} running`);
  await page.context().close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} Buzzworks checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
