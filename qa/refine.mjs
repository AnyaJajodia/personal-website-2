// The navigation/accent/Buzzworks/Crackd/GVI refinement pass, in Chrome.
// Usage: BASE_URL=... node qa/refine.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const details = ["lynxster", "amnh", "crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"];
const browser = await chromium.launch({ channel: "chrome" });
const lum = (page, c) =>
  page.evaluate((c) => {
    const cv = document.createElement("canvas").getContext("2d");
    cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    const [r, g, b] = cv.getImageData(0, 0, 1, 1).data;
    return [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  }, c);

/* ------------------------------------------------------------ navigation */
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, isMobile: w < 700, hasTouch: w < 700 });
    const page = await ctx.newPage();
    const bad = [];
    for (const s of details) {
      await page.goto(`${base}/work/${s}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => {
        const t = document.querySelector(".site-nav .sheet-trigger");
        const hd = document.querySelector(".site-header__inner");
        const accent = getComputedStyle(t).getPropertyValue("--accent").trim();
        const line = getComputedStyle(t.querySelector(".site-nav__label"), "::after");
        const probe = document.createElement("span");
        probe.style.color = "var(--accent)";
        t.appendChild(probe);
        const accentRgb = getComputedStyle(probe).color;
        probe.remove();
        return {
          button: t?.tagName === "BUTTON",
          text: t.textContent.trim(),
          beside: !!document.querySelector(".site-header__brand + .sheet-trigger"),
          color: getComputedStyle(t).color,
          accentRgb,
          lineFill: line.backgroundColor,
          lineShown: line.transform === "none" || line.transform === "matrix(1, 0, 0, 1, 0, 0)",
          oldSvg: /1d4f8c|36afbb/.test(getComputedStyle(t).backgroundImage + line.backgroundImage),
          fits: hd.scrollWidth <= hd.clientWidth + 1 && t.getBoundingClientRect().right <= innerWidth,
          workLinks: document.querySelectorAll('.site-nav a[href="/#work"]').length,
        };
      });
      if (!(r.button && r.text === "Work" && !r.beside && r.color === r.accentRgb && r.lineFill === r.accentRgb && r.lineShown && !r.oldSvg && r.fits && r.workLinks === 0)) bad.push(`${s} ${JSON.stringify(r)}`);
    }
    ok(`detail nav @${w} ${theme}: "Work" is a menu button in every header, its text and pen-line underline in the page's own accent (no blue SVG), row fits`, bad.length === 0, bad.join(" | "));
    await ctx.close();
  }
}
{
  // the drawer opens from Work, reaches "Back to work overview" first, and closes after navigation
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
    const page = await ctx.newPage();
    await page.goto(`${base}/work/gvi-conservation`, { waitUntil: "networkidle" });
    const btn = page.locator(".site-nav .sheet-trigger");
    await btn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(450);
    const st = await page.evaluate(() => ({
      expanded: document.querySelector(".sheet-trigger").getAttribute("aria-expanded"),
      open: document.querySelector("#work-sheet").open,
      first: document.querySelector("#work-sheet [data-sheet-item]").getAttribute("href"),
      firstText: document.querySelector("#work-sheet [data-sheet-item]").textContent,
      focus: document.activeElement?.getAttribute("href"),
      locked: getComputedStyle(document.documentElement).overflow === "hidden",
      footer: document.querySelectorAll(".sheet__foot").length,
    }));
    ok(`drawer @${w}: opens from Work (expanded), focus on this page, scroll locked; "Back to work overview" leads the list`, st.expanded === "true" && st.open && st.focus === "/work/gvi-conservation" && st.locked && st.first === "/#work" && /Back to work overview/.test(st.firstText) && st.footer === 0, JSON.stringify(st));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
    ok(`drawer @${w}: Escape closes and returns focus to Work`, await page.evaluate(() => !document.querySelector("#work-sheet").open && document.activeElement?.classList.contains("site-nav__work")));
    await btn.click();
    await page.waitForTimeout(450);
    await page.click(".sheet__overview");
    await page.waitForURL("**/#work");
    await page.waitForTimeout(1300);
    const home = await page.evaluate(() => ({ top: Math.round(document.getElementById("work").getBoundingClientRect().top), locked: getComputedStyle(document.documentElement).overflow === "hidden", dialog: document.querySelectorAll("#work-sheet").length }));
    ok(`drawer @${w}: "Back to work overview" navigates to the homepage work section; nothing stays locked`, Math.abs(home.top) < 90 && !home.locked && home.dialog === 0, JSON.stringify(home));
    await ctx.close();
  }
}

/* ------------------------------------------------------------ homepage nav */
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => scrollTo(0, 900));
  await page.waitForTimeout(500);
  const link = page.locator('.site-nav a[href="#work"]');
  ok(`homepage (${theme}): Work is still a link to #work (no drawer)`, (await link.count()) === 1 && (await page.$$eval(".sheet-trigger, #work-sheet", (x) => x.length)) === 0);
  await link.hover();
  await page.waitForTimeout(400);
  const hv = await page.$eval('.site-nav a[href="#work"]', (a) => ({ color: getComputedStyle(a).color, line: getComputedStyle(a, "::after").backgroundColor, t: getComputedStyle(a, "::after").transform, svg: getComputedStyle(a).backgroundImage }));
  ok(`homepage (${theme}): the hover underline uses the navbar's hover colour (currentColor), not the old blue`, hv.line === hv.color && /none|matrix\(1, 0, 0, 1/.test(hv.t) && hv.svg === "none", JSON.stringify(hv));
  await link.click();
  await page.waitForTimeout(1300);
  ok(`homepage (${theme}): Work scrolls to the work section`, Math.abs(await page.evaluate(() => document.getElementById("work").getBoundingClientRect().top)) < 90);
  await ctx.close();
}

/* ------------------------------------------------------------ Buzzworks */
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  const page = await ctx.newPage();
  await page.goto(`${base}/work/buzzworks`, { waitUntil: "networkidle" });
  const b = await page.evaluate(() => {
    const brand = document.querySelector(".bz-brand"), img = brand.querySelector("img"), name = brand.querySelector(".bz-brand__name");
    const r = img.getBoundingClientRect();
    return { src: img.getAttribute("src"), ratio: +(r.width / r.height).toFixed(2), natural: +(img.naturalWidth / img.naturalHeight).toFixed(2), opacity: getComputedStyle(img).opacity, filter: getComputedStyle(img).filter, bg: getComputedStyle(brand).backgroundColor, name: name.textContent, font: getComputedStyle(name).fontFamily.split(",")[0], full: document.querySelectorAll('.bz-hero img[src*="buzzworks.png"]').length };
  });
  ok(`Buzzworks header (${theme}): the minimal orange symbol (true proportions, full opacity) + “Buzzworks” in the portfolio serif; no white tile or full logo`, b.src.endsWith("buzzworks-minimal.png") && Math.abs(b.ratio - b.natural) < 0.03 && b.opacity === "1" && b.filter === "none" && b.bg === "rgba(0, 0, 0, 0)" && b.name === "Buzzworks" && /Cormorant/.test(b.font) && b.full === 0, JSON.stringify(b));
  if (theme === "light") {
    const c = await page.evaluate(() => {
      const bar = document.querySelector(".bz-chat__bar").getBoundingClientRect();
      const rows = [...document.querySelectorAll(".bz-chat__row")];
      const notes = [...document.querySelectorAll(".bz-chat__note")].map((n) => n.getBoundingClientRect());
      const bubbleText = parseFloat(getComputedStyle(document.querySelector(".bz-bubble")).fontSize);
      return { w: Math.round(bar.width), rows: rows.length, notesRight: Math.max(...notes.map((n) => n.right)), contentRight: document.querySelector(".case-content").getBoundingClientRect().right, notesLeft: Math.min(...notes.map((n) => n.left)), bubbleText, height: Math.round(document.querySelector(".bz-chat__phone").getBoundingClientRect().height) };
    });
    // the earlier window was 23.5rem (376px)
    const grow = c.w / 376;
    ok(`Buzzworks chat (desktop): the window is ${Math.round((grow - 1) * 100)}% wider (25–35%), text unscaled, notes beside it within the column`, grow >= 1.25 && grow <= 1.35 && c.bubbleText === 15 && c.notesLeft > c.w && c.notesRight <= c.contentRight + 1 && c.rows === 12, JSON.stringify(c));
  }
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${base}/work/buzzworks`, { waitUntil: "networkidle" });
  const m = await page.evaluate(() => {
    const out = [];
    for (const row of document.querySelectorAll(".bz-chat__row")) {
      const note = row.querySelector(".bz-chat__note");
      if (!note) continue;
      const nb = note.getBoundingClientRect(), bb = row.querySelector(".bz-bubble").getBoundingClientRect();
      out.push(nb.top >= bb.bottom - 1);
    }
    const chat = document.querySelector(".bz-chat__phone").getBoundingClientRect();
    return { after: out, fits: chat.right <= innerWidth - 10 && chat.left >= 10, over: document.documentElement.scrollWidth - innerWidth };
  });
  ok("Buzzworks chat (phone): fits the width; each note sits below its exchange; no overflow", m.after.length >= 4 && m.after.every(Boolean) && m.fits && m.over <= 0, JSON.stringify(m));
  await ctx.close();
}

/* ------------------------------------------------------------ Crackd */
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  const page = await ctx.newPage();
  await page.goto(`${base}/work/crackd-ai`, { waitUntil: "networkidle" });
  const c = await page.evaluate(() => {
    const cs = (s) => getComputedStyle(document.querySelector(s));
    return { apps: cs(".ck-apps").backgroundColor, admin: cs(".ck-app--admin").backgroundColor, matrix: cs(".ck-app--matrix").backgroundColor, name: cs(".ck-app--matrix .ck-app__name").color, body: cs(".ck-app--admin .ck-app__body p").color, chain: cs(".ck-chain").stroke, opacity: cs(".ck-apps").opacity, repos: document.querySelectorAll(".ck-apps a[href*='github.com']").length };
  });
  if (theme === "light") {
    const [ln, lb] = await Promise.all([lum(page, c.name), lum(page, c.body)]);
    // design pass: the three builds are open entries on the sheet — no boxes inside it
    ok("Crackd (light): no near-black block and no boxes inside the sheet — admin and matrix are open entries with dark text; full opacity; all three repo links", c.apps === "rgba(0, 0, 0, 0)" && c.admin === "rgba(0, 0, 0, 0)" && c.matrix === "rgba(0, 0, 0, 0)" && ln < 0.05 && lb < 0.1 && c.opacity === "1" && c.repos === 3, JSON.stringify(c));
    ok("Crackd (light): yellow kept as accents — the matrix thread and the user app's short rule", /rgb\(201, 160, 24\)/.test(c.chain) && (await page.evaluate(() => getComputedStyle(document.querySelector(".ck-app--user"), "::before").backgroundColor)) !== "rgba(0, 0, 0, 0)", c.chain);
  } else {
    ok("Crackd (dark): the near-black panel and yellow matrix unchanged", c.apps === "rgb(18, 17, 15)" && c.name === "rgb(240, 207, 85)" && c.repos === 3, JSON.stringify(c));
  }
  await ctx.close();
}

/* ------------------------------------------------------------ GVI */
for (const theme of ["light", "dark", "system-dark"]) {
  const scheme = theme === "light" ? "light" : "dark";
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const page = await ctx.newPage();
  if (theme !== "system-dark") await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await page.goto(`${base}/work/gvi-conservation`, { waitUntil: "networkidle" });
  const g = await page.evaluate(() => {
    const w = document.querySelector(".gvi-logo__mark");
    const shown = [...w.querySelectorAll("img")].filter((i) => getComputedStyle(i).visibility === "visible");
    const r = w.getBoundingClientRect();
    return { shown: shown.map((i) => i.getAttribute("src")), box: `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)}x${Math.round(r.height)}`, tile: getComputedStyle(document.querySelector(".gvi-logo")).backgroundColor, pad: getComputedStyle(document.querySelector(".gvi-logo")).padding };
  });
  const want = scheme === "light" ? "/logos/gvi.webp" : "/logos/gvi-white.png";
  ok(`GVI logo (${theme}): ${want.split("/").pop()} shown, no tile, same box in every theme`, g.shown.join() === want && g.tile === "rgba(0, 0, 0, 0)" && g.pad === "0px", JSON.stringify(g));
  if (theme === "light") globalThis.__gviBox = g.box;
  else ok(`GVI logo (${theme}): identical position and scale to Light`, g.box === globalThis.__gviBox, `${g.box} vs ${globalThis.__gviBox}`);
  if (theme !== "system-dark") {
    const st = await page.evaluate(() => {
      const s = document.querySelector(".gvi-stayed"), cs = getComputedStyle(s);
      const q = document.querySelector(".gvi-stayed__quote"), qcs = getComputedStyle(q);
      const p = document.querySelector(".gvi-stayed .gvi-prose");
      const other = getComputedStyle(document.querySelector("#threads .gvi-prose")).maxWidth;
      return { card: !!document.querySelector(".gvi-stayed__panel"), bg: cs.backgroundColor, img: cs.backgroundImage, radius: cs.borderRadius, label: getComputedStyle(document.querySelector(".gvi-stayed__label")).fontSize, quoteCh: Math.round(q.getBoundingClientRect().width / (parseFloat(qcs.fontSize) * 0.5)), quoteColor: qcs.color, proseMax: getComputedStyle(p).maxWidth === other ? "64ch" : getComputedStyle(p).maxWidth, rule: cs.borderTopWidth };
    });
    ok(`GVI close (${theme}): open section — small label, green pull quote at a comfortable measure, normal-width prose, one fine rule; no card, border or gradient`, !st.card && st.bg === "rgba(0, 0, 0, 0)" && st.img === "none" && st.radius === "0px" && parseFloat(st.label) <= 14 && st.quoteCh <= 48 && st.proseMax === "64ch" && st.rule === "1px", JSON.stringify(st));
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} refinement checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
