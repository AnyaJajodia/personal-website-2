// The Crackd.ai page and the work drawer, in Chrome.
//   content: every approved line of handoff/content/work/crackd-ai.md is on the
//     page (bar the paragraph the notes mark as staging); nothing from its
//     implementation notes (or retired claims) is; the external links are the
//     three repositories and the two live apps that answered, each in its own
//     application, with no screenshots on the page itself
//   (the walkthrough dialogs: qa/crackd-tour.mjs)
//   drawer: opens from the header's "Work" button; focus starts on Crackd (marked current)
//     and is trapped; arrows move; Escape / overlay / close button dismiss and
//     return focus; background scroll is locked and restored; every entry is a
//     real link to a route that exists; choosing one navigates
//   "On this page": every link lands its section just under the fixed header
//   layout: no horizontal overflow or clipped headings at five widths, both
//     themes; the theme control works here; reduced motion
// Usage: BASE_URL=... node qa/crackd.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const url = base + "/work/crackd-ai";
const out = "qa/screenshots/crackd";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const norm = (s) => s.replace(/\s+/g, " ").trim();

/* the approved copy: the Markdown without its notes, headings marks, bullets
   or bare URLs (the URLs are checked as links below) */
const md = readFileSync("handoff/content/work/crackd-ai.md", "utf8").split("<!--")[0];
const lines = [];
// iteration 26: the notes mark this paragraph as editorial staging — omitted
const staging = /^The application walkthrough shows chain configuration/;
for (const raw of md.split("\n")) {
  let l = raw.trim();
  if (!l || l === "---" || /^https?:\/\//.test(l) || staging.test(l)) continue;
  l = l.replace(/^#+\s*/, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // "Role: …" → label and value are set separately
  const kv = l.match(/^([A-Z][A-Za-z ]+): (.+)$/);
  if (kv) {
    lines.push(kv[1], kv[2]);
    continue;
  }
  // "September–December 2025 · Contributing within a team" → dates beside the heading
  const ph = l.match(/^((?:September–December 2025)|(?:January–May 2026)) · (.+)$/);
  if (ph) {
    lines.push(ph[1], ph[2]);
    continue;
  }
  lines.push(l);
}
const forbidden = ["IMPLEMENTATION NOTES", "DO NOT RENDER", "CONTENT STATUS", "TensorFlow", "40%", "35%", "self-critique", "TODO", "Placeholder", "anchoring bias", "detailed experiment comparison", "will be added", "crackd-admin-panel.vercel.app", "Explore the applications"];
const repos = ["https://github.com/AnyaJajodia/caption_voting_user_interface", "https://github.com/AnyaJajodia/crackd-spring2026-admin-panel", "https://github.com/AnyaJajodia/llm_chaining_matrix"];
const lives = ["https://crackdspring2026.vercel.app/", "https://crackdmatrix.vercel.app/"];
const appOf = { [repos[0]]: "user-application", [repos[1]]: "admin-application", [repos[2]]: "llm-chaining-matrix", [lives[0]]: "user-application", [lives[1]]: "llm-chaining-matrix" };

const browser = await chromium.launch({ channel: "chrome" });

/* ---------------------------------------------------------------- content */
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  const text = norm(await page.evaluate(() => document.querySelector("main").innerText.replace(/­/g, "")));
  const missing = [...new Set(lines)].filter((l) => !text.toLowerCase().includes(norm(l).toLowerCase()));
  ok(`content: every approved line of crackd-ai.md is on the page (${new Set(lines).size} lines)`, missing.length === 0, missing.join(" | "));
  const html = await page.content();
  const leaked = forbidden.filter((f) => text.includes(f) || html.includes(f));
  ok("content: nothing from the implementation notes, retired claims or demo URLs", leaked.length === 0, leaked.join(", "));
  ok("content: both phase dates as given", text.includes("September–December 2025") && text.includes("January–May 2026"));
  const ext = await page.$$eval("main a[href^='http']", (as) => as.map((a) => ({ href: a.href, app: a.closest("article")?.id ?? null, blank: a.target === "_blank" && /noopener/.test(a.rel) })));
  ok(
    "links: the three repositories and two live apps, each inside its own application, opening safely",
    ext.length === 5 && ext.every((e) => appOf[e.href] === e.app && e.blank),
    JSON.stringify(ext.map((e) => [e.href.split("/").pop(), e.app])),
  );
  const outline = await page.$$eval("main h1, main h2, main h3", (hs) => hs.map((h) => +h.tagName[1]));
  const skips = outline.filter((lv, i) => i && lv - outline[i - 1] > 1).length;
  ok("headings: one h1, no skipped levels", outline.filter((l) => l === 1).length === 1 && skips === 0, outline.join(""));
  ok("logo: the real Crackd logo, labelled, loaded, on its own dark plate (no filter)", await page.$eval(".ck-plate__logo", (i) => i.complete && i.naturalWidth > 0 && i.alt === "Crackd" && i.src.includes("/logos/crackd.png") && getComputedStyle(i).filter === "none" && getComputedStyle(i.parentElement).backgroundColor === "rgb(22, 21, 18)"));
  const order = await page.evaluate(() => {
    const d = document.querySelector(".ck-hero__dates"), l = document.querySelector(".ck-plate"), h = document.querySelector("h1");
    const pos = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    // iteration 24: the logo and its dates share one line, above the question
    const same = Math.abs(d.getBoundingClientRect().top + d.offsetHeight / 2 - (l.getBoundingClientRect().top + l.offsetHeight / 2)) < 12;
    return { order: pos(l, d) && pos(d, h) && same, dates: (document.querySelector(".ck-hero").innerText.match(/September 2025–May 2026/gi) ?? []).length };
  });
  ok("hero: the logo with September 2025–May 2026 beside it, above the question, shown once", order.order && order.dates === 1, JSON.stringify(order));
  const live = await page.$$eval(".ck-live", (as) => as.map((a) => [a.closest("article").id, a.querySelector(".ck-live__access")?.textContent]));
  ok("live apps: labelled with their access requirement; none for the admin app (its address returned 404)", live.length === 2 && live.every(([, acc]) => /sign-in/i.test(acc ?? "")) && !live.some(([id]) => id === "admin-application"), JSON.stringify(live));
  const apps = await page.$$eval(".ck-app", (as) => as.map((a) => ({ id: a.id, tour: a.querySelectorAll(".ck-tour-btn").length, primary: a.querySelector(".ck-tour-btn")?.textContent.startsWith("View walkthrough"), repo: a.querySelectorAll(".ck-repo").length, screens: a.querySelectorAll(".ck-screen").length })));
  ok("applications: three entries, each with one “View walkthrough” button, one repository link and its named screens (6 / 5 / 5)", apps.length === 3 && apps.every((a) => a.tour === 1 && a.primary && a.repo === 1) && apps.map((a) => a.screens).join() === "6,5,5", JSON.stringify(apps));
  ok("no table, and no screenshots or thumbnails on the page itself", (await page.$$eval("main table, main .ck-app img, main img[src*='/assets/crackd/']", (x) => x.length)) === 0 && (await page.$$eval("img", (x) => x.filter((i) => i.src.includes("/assets/crackd/") && !i.closest("dialog")).length)) === 0);
  ok("walkthrough images load only when a tour opens", !(await page.evaluate(() => performance.getEntriesByType("resource").some((r) => r.name.includes("/assets/crackd/")))));
  ok("figures: at most two avatars, decorative", (await page.$$eval("main .avatar", (a) => a.length)) <= 2 && (await page.$$eval("main .avatar", (a) => a.every((x) => x.getAttribute("aria-hidden") === "true"))));
  ok("one walkthrough dialog, closed; no videos or embeds", (await page.$$eval("main dialog.ck-tour", (x) => x.length)) === 1 && (await page.$$eval("main dialog.ck-tour[open], main video, main iframe", (x) => x.length)) === 0);
  ok("no console errors", errors.length === 0, errors.join(" | "));
  await page.context().close();
}

/* ------------------------------------------------------------- drawer */
const drawerChecks = async (vp, tag) => {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: vp.width < 700, isMobile: vp.width < 700 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => scrollTo(0, 1400));
  await page.waitForTimeout(300);
  const trigger = page.locator(".site-header .sheet-trigger");
  ok(`${tag}: one drawer trigger — the header nav's own "Work" item (a button with a chevron, dialog attributes); the name stays a home link`, (await page.$$eval(".sheet-trigger", (b) => b.length)) === 1 && (await page.evaluate(() => { const b = document.querySelector(".site-header__brand"), t = document.querySelector(".sheet-trigger"); return b.getAttribute("href") === "/" && t.tagName === "BUTTON" && !!t.closest(".site-nav") && t.textContent.trim() === "Work" && !!t.querySelector(".site-nav__chev") && t.getAttribute("aria-haspopup") === "dialog" && t.getAttribute("aria-controls") === "work-sheet" && document.querySelectorAll('.site-nav a[href="/#work"]').length === 0; })));
  ok(`${tag}: "Work" stays reachable while scrolled`, await trigger.isVisible() && (await trigger.boundingBox()).y >= 0 && (await trigger.boundingBox()).y < vp.height, JSON.stringify(await trigger.boundingBox()));
  const tb = await trigger.boundingBox();
  if (vp.width < 640) {
    const lab = await page.evaluate(() => { const hd = document.querySelector(".site-header__inner"); const t = document.querySelector(".sheet-trigger"); return { text: t.innerText.trim(), name: t.getAttribute("aria-label"), nav: getComputedStyle(document.querySelector(".site-header__inner > nav")).display, fits: hd.scrollWidth <= hd.clientWidth + 1 }; });
    ok(`${tag}: phones — the nav (with its "Work" menu button) stays in the header row and fits`, lab.text === "Work" && /^Work/.test(lab.name ?? "") && lab.nav !== "none" && lab.fits, JSON.stringify(lab));
  }
  // the visible control is compact; its hit area (a ::before) reaches 44px
  const hit = await page.evaluate(() => {
    const t = document.querySelector(".site-header .sheet-trigger"), r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const half = Math.max(22, r.width / 2);
    return [[cx, cy - 21.5], [cx, cy + 21.5], [cx - Math.min(half, 21.5), cy], [cx + Math.min(half, 21.5), cy]].every(([x, y]) => t.contains(document.elementFromPoint(x, y))) && r.width + 12 >= 44;
  });
  ok(`${tag}: trigger has a ≥44px target`, hit);
  const y0 = await page.evaluate(() => scrollY);
  await trigger.focus();
  await page.keyboard.press("Enter");
  if (tag === "1440") {
    // restrained motion: a plain slide, ~500ms soft deceleration in; no scaling; the page behind stays put
    const anim = await page.evaluate(() => document.querySelector(".sheet__panel").getAnimations().map((a) => ({ name: a.animationName, d: a.effect.getTiming().duration, kf: JSON.stringify(a.effect.getKeyframes()) })));
    ok("drawer motion: the panel slides in over ~500ms (420–560), translate only (no scale)", anim.some((a) => a.name === "sheet-in" && a.d >= 420 && a.d <= 560 && !/scale/.test(a.kf)), JSON.stringify(anim.map((a) => [a.name, a.d])));
  }
  await page.waitForTimeout(600);
  ok(`${tag}: the page behind doesn't move while the sheet is open`, Math.abs((await page.evaluate(() => scrollY)) - y0) < 1 && (await page.evaluate(() => getComputedStyle(document.querySelector("main")).transform)) === "none");
  const st = await page.evaluate(() => {
    const d = document.querySelector("#work-sheet");
    const p = d.querySelector(".sheet__panel").getBoundingClientRect();
    return {
      open: d.open,
      modal: d.matches(":modal"),
      label: document.getElementById(d.getAttribute("aria-labelledby"))?.textContent,
      focus: document.activeElement?.getAttribute("href"),
      current: [...d.querySelectorAll('[aria-current="page"]')].map((a) => a.getAttribute("href")),
      locked: getComputedStyle(document.documentElement).overflow === "hidden",
      expanded: document.querySelector(".sheet-trigger").getAttribute("aria-expanded"),
      panel: { left: Math.round(p.left), width: Math.round(p.width), right: Math.round(p.right) },
      links: [...d.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
      nested: d.querySelectorAll("a a, a button").length,
    };
  });
  ok(`${tag}: opens as a labelled modal sheet; trigger reports expanded`, st.open && st.modal && st.label === "Browse work" && st.expanded === "true", JSON.stringify({ label: st.label, expanded: st.expanded }));
  ok(`${tag}: focus starts on Crackd, the one entry marked as this page`, st.focus === "/work/crackd-ai" && st.current.join() === "/work/crackd-ai", JSON.stringify(st.current));
  ok(`${tag}: background scroll locked`, st.locked);
  ok(`${tag}: panel from the right edge, leaving the page visible beside it`, st.panel.right === vp.width && st.panel.left >= 40, JSON.stringify(st.panel));
  const workRoutes = st.links.filter((h) => h.startsWith("/work/"));
  const wanted = ["lynxster", "amnh", "crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
  ok(`${tag}: every portfolio experience, as real links (Lynxster and AMNH first after the overview)`, wanted.every((s) => workRoutes.includes(`/work/${s}`)) && workRoutes.length === 11 && workRoutes[0] === "/work/lynxster" && workRoutes[1] === "/work/amnh" && st.nested === 0, workRoutes.join(" "));
  if (tag.startsWith("1440")) {
    const codes = await Promise.all([...st.links].map(async (h) => [h, (await fetch(base + h)).status]));
    ok("drawer: every entry's route exists (200)", codes.every(([, c]) => c === 200), codes.filter(([, c]) => c !== 200).join(" "));
  }
  await page.screenshot({ path: `${out}/drawer-${tag}.png` });
  // arrows
  await page.keyboard.press("ArrowDown");
  const afterDown = await page.evaluate(() => document.activeElement?.getAttribute("href"));
  await page.keyboard.press("Home");
  const home = await page.evaluate(() => document.activeElement?.getAttribute("href"));
  await page.keyboard.press("End");
  const end = await page.evaluate(() => document.activeElement?.getAttribute("href"));
  ok(`${tag}: ↓ / Home / End move between entries`, afterDown === "/work/buzzworks" && home === "/#work" && end === "/work/adi-mentorship", `${afterDown} ${home} ${end}`);
  ok(`${tag}: "Back to work overview" opens the list, linking to the homepage's work section`, st.links[0] === "/#work" && (await page.$eval(".sheet__overview", (a) => a.textContent.includes("Back to work overview"))));
  // trap: Tab around more than the number of stops; focus never leaves the sheet
  let escaped = 0;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    if (!(await page.evaluate(() => !!document.activeElement?.closest("#work-sheet")))) escaped++;
  }
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Shift+Tab");
    if (!(await page.evaluate(() => !!document.activeElement?.closest("#work-sheet")))) escaped++;
  }
  ok(`${tag}: focus is trapped in the sheet (Tab and Shift+Tab wrap)`, escaped === 0, `${escaped} escapes`);
  await page.keyboard.press("Escape");
  if (tag === "1440") {
    await page.waitForTimeout(30);
    const out = await page.evaluate(() => document.querySelector(".sheet__panel").getAnimations().map((a) => ({ name: a.animationName, d: a.effect.getTiming().duration })));
    ok("drawer motion: closing is quicker, ~320ms (280–360)", out.some((a) => a.name === "sheet-out" && a.d >= 280 && a.d <= 360), JSON.stringify(out));
  }
  await page.waitForTimeout(450);
  const closed = await page.evaluate(() => ({ open: document.querySelector("#work-sheet").open, focus: document.activeElement?.className, locked: getComputedStyle(document.documentElement).overflow === "hidden", y: scrollY, expanded: document.querySelector(".sheet-trigger").getAttribute("aria-expanded") }));
  ok(`${tag}: Escape closes, returns focus to the trigger, unlocks scroll in place`, !closed.open && closed.focus.includes("sheet-trigger") && !closed.locked && Math.abs(closed.y - y0) < 2 && closed.expanded === "false", JSON.stringify(closed));
  // overlay click
  await trigger.click();
  await page.waitForTimeout(550);
  await page.mouse.click(12, Math.round(vp.height / 2));
  await page.waitForTimeout(450);
  ok(`${tag}: a click on the overlay closes it`, !(await page.evaluate(() => document.querySelector("#work-sheet").open)));
  // close button
  await trigger.click();
  await page.waitForTimeout(550);
  const cb = await page.$eval(".sheet__close", (b) => { const r = b.getBoundingClientRect(); return [r.width, r.height, b.getAttribute("aria-label")]; });
  await page.click(".sheet__close");
  await page.waitForTimeout(450);
  ok(`${tag}: the close button (labelled, ≥44px) closes it and returns focus`, !(await page.evaluate(() => document.querySelector("#work-sheet").open)) && cb[0] >= 44 && cb[1] >= 44 && !!cb[2] && (await page.evaluate(() => document.activeElement?.classList.contains("sheet-trigger"))));
  // choosing this page just closes; choosing another navigates
  await trigger.click();
  await page.waitForTimeout(550);
  await page.click('#work-sheet a[href="/work/crackd-ai"]');
  await page.waitForTimeout(450);
  ok(`${tag}: choosing this page closes the sheet without navigating`, page.url() === url && !(await page.evaluate(() => document.querySelector("#work-sheet").open)));
  await trigger.click();
  await page.waitForTimeout(550);
  await page.click('#work-sheet a[href="/work/lynxster"]');
  await page.waitForURL("**/work/lynxster");
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => ({ locked: getComputedStyle(document.documentElement).overflow === "hidden", attr: document.documentElement.dataset.sheetOpen ?? null, h1: document.querySelector("h1")?.textContent }));
  ok(`${tag}: an entry navigates to its page; nothing stays locked`, !after.locked && after.attr === null && /trust/i.test(after.h1 ?? ""), JSON.stringify(after));
  await ctx.close();
};
await drawerChecks({ width: 1440, height: 900 }, "1440");
await drawerChecks({ width: 390, height: 844 }, "390");

/* ------------------------------------------------------- on this page */
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const ids = await page.$$eval(".toc__link", (as) => as.map((a) => a.hash.slice(1)));
  const landed = [];
  for (const id of ids) {
    await page.click(`.toc__link[href="#${id}"]`);
    await page.waitForTimeout(1100);
    landed.push(
      await page.evaluate((id) => {
        const t = document.getElementById(id).getBoundingClientRect().top;
        const h = document.querySelector(".site-header").getBoundingClientRect().bottom;
        const bottom = document.documentElement.scrollHeight - innerHeight - scrollY < 2;
        const cur = document.querySelector('.toc__link[aria-current="location"]')?.hash.slice(1);
        return { id, gap: Math.round(t - h), bottom, cur };
      }, id),
    );
  }
  // every target sits just below the header (or the page has run out of scroll)
  ok("On this page: every link lands its section just below the fixed header", landed.every((l) => (l.gap >= 4 && l.gap <= 40) || (l.bottom && l.gap >= 4)), JSON.stringify(landed.map((l) => [l.id, l.gap])));
  ok("On this page: the section being read is marked", landed.every((l) => l.cur === l.id || l.bottom), JSON.stringify(landed.map((l) => [l.id, l.cur])));
  ok("On this page: 6 sections (the revised headings), phases numbered 01 / 02", ids.join() === "what-is-crackd,contributing-within-a-team,building-complete-applications,inside-the-chaining-matrix,what-i-took-from-it,tools-and-workflow" && (await page.$$eval(".toc__n", (n) => n.map((x) => x.textContent).filter(Boolean).join())) === "01,02");
  await page.context().close();
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
    const tag = `${vp.width}-${theme}`;
    const lay = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - innerWidth;
      const clipped = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main dd, main td, main th, .ck-repo")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width && (r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 2);
      }).map((e) => e.className || e.tagName);
      const bg = getComputedStyle(document.querySelector(".theme-crackd")).backgroundColor;
      return { over, clipped: clipped.slice(0, 5), bg };
    });
    ok(`${tag}: no horizontal overflow or clipped text`, lay.over <= 0 && lay.clipped.length === 0, JSON.stringify(lay));
    if (theme === "dark") ok(`${tag}: the deeper Crackd night (#1a1816)`, lay.bg === "rgb(26, 24, 22)", lay.bg);
    // section screenshots for viewing (viewport frames, scrolled so scroll-drawn marks have drawn)
    if (vp.width === 1440 || vp.width === 390 || (vp.width === 1024 && theme === "light") || (vp.width === 768 && theme === "light")) {
      for (const sel of [".ck-hero", "#what-is-crackd", "#contributing-within-a-team", "#building-complete-applications", "#user-application", "#admin-application", "#llm-chaining-matrix", "#inside-the-chaining-matrix", "#what-i-took-from-it", "#tools-and-workflow"]) {
        // instant: the page scrolls smoothly for its own anchors
        await page.evaluate((s) => {
          const y = document.querySelector(s).getBoundingClientRect().top + scrollY - 90;
          scrollTo({ top: y, behavior: "instant" });
        }, sel);
        await page.waitForTimeout(450);
        await page.screenshot({ path: `${out}/${tag}-${sel.replace(/[#.]/g, "")}.png` });
      }
    }
    await ctx.close();
  }
}

/* -------------------------------------- theme control + reduced motion */
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("Dark")');
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, bg: getComputedStyle(document.querySelector(".theme-crackd")).backgroundColor }));
  ok("theme control on Crackd: Dark applies the page's dark palette", t.theme === "dark" && t.bg === "rgb(26, 24, 22)", JSON.stringify(t));
  await page.click(".theme-toggle__button");
  await page.click('.theme-toggle__item:has-text("System")');
  await page.context().close();
}
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.click(".site-header .sheet-trigger");
  await page.waitForTimeout(100);
  const anim = await page.evaluate(() => document.querySelector(".sheet__panel").getAnimations().map((a) => a.animationName));
  const hl = await page.evaluate(() => document.querySelector(".ck-hero .ck-hl").getAnimations().length);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  ok("reduced motion: the sheet fades (no slide), closes at once; the highlighter is simply there", !anim.includes("sheet-in") && hl === 0 && !(await page.evaluate(() => document.querySelector("#work-sheet").open)), JSON.stringify({ anim, hl }));
  await page.context().close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} Crackd checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
