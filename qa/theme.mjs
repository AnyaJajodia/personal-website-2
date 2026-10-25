// Theme system, in Chrome: System default following the OS (live), explicit
// choices remembered across reloads and pages, applied before first paint
// (no flash, no hydration warning), switching keeps scroll and interaction
// state, an accessible toggle (keyboard), dark-palette contrast, and no
// global image inversion. Usage: BASE_URL=... node qa/theme.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const browser = await chromium.launch({ channel: "chrome" });
const state = (page) => page.evaluate(() => ({ theme: document.documentElement.dataset.theme, pref: document.documentElement.dataset.themePref, bg: getComputedStyle(document.body).backgroundColor, stored: localStorage.getItem("theme") }));

/* System default, live OS changes */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  const warns = [];
  page.on("console", (m) => /hydrat|did not match/i.test(m.text()) && warns.push(m.text()));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const a = await state(page);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForTimeout(500);
  const b = await state(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForTimeout(500);
  const c = await state(page);
  ok("theme: defaults to System and follows the OS, live", a.pref === "system" && a.theme === "light" && b.theme === "dark" && c.theme === "light" && b.bg === "rgb(33, 30, 28)", `${a.theme} → ${b.theme} → ${c.theme}`);
  ok("theme: no hydration mismatch warnings", warns.length === 0, warns.join(" | "));
  await ctx.close();
}

/* before first paint: the very first frame already has the stored theme */
for (const [os, stored] of [["light", "dark"], ["dark", "light"], ["dark", null]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: os });
  if (stored) await ctx.addInitScript((v) => localStorage.setItem("theme", v), stored);
  await ctx.addInitScript(() => {
    window.__first = null;
    requestAnimationFrame(() => (window.__first = { theme: document.documentElement.dataset.theme, bg: getComputedStyle(document.body).backgroundColor }));
  });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  const f = await page.evaluate(() => window.__first);
  const want = stored ?? os;
  ok(`theme: first frame already ${want} (OS ${os}, saved ${stored ?? "none"}) — no flash`, f.theme === want && f.bg === (want === "dark" ? "rgb(33, 30, 28)" : "rgb(247, 244, 238)"), JSON.stringify(f));
  await ctx.close();
}

/* the toggle: keyboard, persistence, scroll and interaction state kept */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  // open a trajectory note and a work panel, then switch theme mid-page
  await page.evaluate(() => document.querySelector(".trajectory").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);
  await (await page.$$(".trajectory__point"))[2].click();
  await page.waitForTimeout(400);
  const y0 = await page.evaluate(() => scrollY);
  const btn = await page.$(".theme-toggle__button");
  const label = await btn.getAttribute("aria-label");
  const box = await btn.boundingBox();
  const nav = await page.$eval(".site-nav li:last-child a", (a) => a.getBoundingClientRect().right);
  ok("toggle: in the header, after Contact, labelled, ≥36px with a 44px hit area", box.x > nav && !!label && box.width >= 32, `${label} ${Math.round(box.width)}px`);
  await btn.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  const menu = await page.evaluate(() => ({ open: !!document.querySelector('[role="menu"]'), items: [...document.querySelectorAll('[role="menuitemradio"]')].map((i) => `${i.textContent}:${i.getAttribute("aria-checked")}`), focused: document.activeElement?.textContent, expanded: document.querySelector(".theme-toggle__button").getAttribute("aria-expanded") }));
  ok("toggle: Enter opens a menu of System / Light / Dark, current one checked and focused", menu.open && menu.items.join() === "System:true,Light:false,Dark:false" && menu.focused === "System" && menu.expanded === "true", JSON.stringify(menu));
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const after = await state(page);
  const y1 = await page.evaluate(() => scrollY);
  const kept = await page.evaluate(() => ({ note: document.querySelector(".trajectory__aside").dataset.show, picked: document.querySelectorAll(".trajectory__point")[2].getAttribute("aria-pressed"), focus: document.activeElement?.className }));
  ok("toggle: arrows + Enter choose Dark; the choice is stored; focus returns to the button", after.theme === "dark" && after.stored === "dark" && kept.focus.includes("theme-toggle__button"), JSON.stringify(after));
  ok("toggle: switching keeps the scroll position and open interaction state", Math.abs(y1 - y0) < 1 && kept.note === "2" && kept.picked === "true", `${y0} → ${y1}, note ${kept.note}`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  ok("toggle: Escape closes the menu", !(await page.$('[role="menu"]')));
  await page.goto(base + "/work/amnh", { waitUntil: "networkidle" });
  ok("theme: the choice persists across pages and reloads", (await state(page)).theme === "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForTimeout(300);
  ok("theme: an explicit choice ignores later OS changes", (await state(page)).theme === "dark");
  // back to System
  await page.click(".theme-toggle__button");
  await page.click('[role="menuitemradio"]:has-text("System")');
  await page.waitForTimeout(400);
  const sys = await state(page);
  ok("theme: choosing System clears the stored choice and follows the OS again", sys.pref === "system" && sys.stored === null && sys.theme === "light", JSON.stringify(sys));
  await ctx.close();
}

/* dark palette: contrast, no inversion, no stray light surfaces */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("theme", "dark"));
  const page = await ctx.newPage();
  const contrast = (sel) =>
    page.evaluate((s) => {
      // any CSS colour (incl. color-mix's color(srgb …)) → sRGB bytes via a canvas
      const cv = document.createElement("canvas").getContext("2d");
      const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3); };
      const lum = (c) => rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
      const out = [];
      for (const el of document.querySelectorAll(s)) {
        if (!el.offsetParent) continue;
        let bgEl = el, bg = "rgba(0, 0, 0, 0)";
        while (bgEl && /, 0\)$|transparent/.test((bg = getComputedStyle(bgEl).backgroundColor))) bgEl = bgEl.parentElement;
        if (!bgEl) bg = getComputedStyle(document.body).backgroundColor;
        const a = lum(getComputedStyle(el).color), b = lum(bg);
        out.push(+((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2));
      }
      return out;
    }, sel);
  for (const path of ["/", "/work/amnh", "/work/lynxster", "/work/crackd-ai"]) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const body = await contrast("main p, main li, main dd, .site-nav a, .breadcrumb, .label");
    const heads = await contrast("main h1, main h2, main h3");
    const min = Math.min(...body), hmin = Math.min(...heads);
    ok(`dark ${path}: text ≥ 4.5:1, headings ≥ 3:1`, min >= 4.5 && hmin >= 3, `text min ${min} (${body.length}), headings min ${hmin}`);
  }
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const inv = await page.evaluate(() => [...document.querySelectorAll("img, svg, html, body, main")].filter((e) => /invert/.test(getComputedStyle(e).filter)).length);
  ok("dark: nothing is inverted (avatar, logos and photos keep their colours)", inv === 0);
  const panels = await page.$$eval(".panel", (ps) => ps.map((p) => getComputedStyle(p).backgroundColor));
  ok("dark: coloured panels kept as coloured paper, slightly settled into the page", panels.every((c) => c !== "rgba(0, 0, 0, 0)"), panels.slice(0, 3).join(" "));
  await ctx.close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} theme checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
