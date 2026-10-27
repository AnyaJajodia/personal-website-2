// Functional checks for the Lynxster page and the homepage "Two threads" cards.
// Usage: BASE_URL=http://localhost:3100 node qa/lynxster.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3100";
let pass = 0,
  fail = 0;
const ok = (cond, name, extra = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? `  — ${extra}` : ""}`);
};
const b = await chromium.launch({ channel: "chrome" });

// contrast helpers, in the page and here
const CONTRAST = `
  window.__lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  window.__rgb = (c) => c.match(/[\\d.]+/g).map(Number).slice(0, 3);
  window.__L = (c) => { const [r, g, b] = __rgb(c); return 0.2126 * __lin(r) + 0.7152 * __lin(g) + 0.0722 * __lin(b); };
  window.__cr = (a, b) => { const x = __L(a), y = __L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
`;
const norm = (s) => s.replace(/‑/g, "-").replace(/\s+/g, " ").trim();

async function themed(theme, vw = 1440, vh = 900, extra = {}) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, ...extra });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  await ctx.addInitScript(CONTRAST);
  return ctx;
}

// ---------------------------------------------------------------- the page: copy
{
  const ctx = await themed("light");
  const p = await ctx.newPage();
  const bad = [];
  p.on("response", (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  const text = norm(await p.evaluate(() => document.querySelector("main").innerText));
  ok(norm(await p.locator("h1").innerText()) === "Building systems of trust.", "title from lynxster.md");
  ok(text.includes("Chief Technology Officer & Co-founder") && text.includes("April 2026–present"), "detail page: full role and April 2026–present");
  ok(norm(await p.locator(".lx-meta .lx-pill").innerText()) === "Patent pending", "detail page: a “Patent pending” pill in the facts");
  const path = (await p.$$eval(".lx-path__stop", (s) => s.map((x) => x.innerText))).map(norm);
  ok(path.length === 2 && /^APRIL 2026 Junior Developer I joined Lynxster in April 2026 as a Junior Developer/i.test(path[0]) && /^TODAY Chief Technology Officer & Co-founder Today, as Chief Technology Officer and Co-founder/i.test(path[1]), "progression: Junior Developer (April 2026) → today CTO & Co-founder, each with its own paragraph; no date for the change");
  const areas = await p.$$eval(".lx-area__title", (h) => h.map((x) => x.textContent));
  ok(areas.join("|") === "Engineering and infrastructure|Cryptography and product|Agent-assisted development|Product and communication", "four areas of work, in the Markdown's order", areas.join(" · "));
  ok(text.includes("I also prepared the first complete draft of the patent application, which became the starting point for subsequent work and revisions by the wider team."), "patent: the first complete draft, developed by the wider team");
  ok(text.includes("Lynxster is building infrastructure intended to make important digital records independently verifiable.") && text.includes("When a record moves between people or organizations"), "problem statement and answer, verbatim");
  ok(!/inventor|sole author|FERPA|legal framework|complian|in court|audit|transcript|custody|recipient|INTERNAL IMPLEMENTATION|DO NOT RENDER|END INTERNAL/i.test(text), "no inventorship, compliance, product-workflow or internal-note text");
  ok(text.includes("More details will be shared as the work develops."), "closes with “More to come”");
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await p.waitForTimeout(600);
  const imgs = await p.evaluate(() => [...document.images].filter((i) => !i.closest("#work-sheet") && (!i.complete || i.naturalWidth === 0)).map((i) => i.src));
  ok(imgs.length === 0, "every image on the page loads", imgs.join(", "));
  ok(errs.length === 0 && bad.length === 0, "no console errors, no failed requests", [...errs, ...bad].join(" | "));
  ok((await p.$$("img[src*='funnel'], img[src*='screenshot'], img[src*='reference'], iframe")).length === 0, "no product screenshot, reference image or embedded page");
  const asm = await p.evaluate(() => {
    const a = document.querySelector(".lxb-assembly");
    return { label: a.getAttribute("aria-label"), words: a.innerText.trim() };
  });
  ok(/^Illustration:/.test(asm.label) && asm.words === "", "the main visual is a labelled illustration with no text or data in it", asm.label);
  ok((await p.evaluate(() => document.querySelectorAll("[data-avatar]").length)) === 1, "one figure, kept subtle");
  ok(/wght|Jost/.test(await p.evaluate(() => getComputedStyle(document.querySelector(".lx-watch__word")).fontFamily)), "wordmark set in Jost");
  await ctx.close();
}

// --------------------------------------------- references not served; home.md agrees
{
  const p = await b.newPage();
  const urls = ["/assets/lynxster/light-mode-reference.png", "/assets/lynxster/dark-mode-reference.png", "/assets/lynxster/Lynxster%20%C2%B7%2001%20Float.html", "/assets/lynxster/Lynxster%20%C2%B7%2005%20Watching.html", "/assets/lynxster/Lynxster%20%C2%B7%2009B%20Package%20assembly.html", "/work/lynxster-funnel.webp"];
  const st = await Promise.all(urls.map((u) => p.request.get(base + u).then((r) => r.status())));
  ok(st.every((s) => s === 404), "reference images, reference HTML studies and the old screenshot are not served", urls.map((u, i) => `${decodeURIComponent(u)} ${st[i]}`).join(", "));
  ok((await p.request.get(base + "/assets/lynxster/lynxster-mark.png")).status() === 200 && (await p.request.get(base + "/assets/lynxster/lynxster-lockup.png")).status() === 200, "the real logo assets are still served");
  const home = readFileSync("handoff/content/home.md", "utf8");
  const lx = home.split("### Lynxster")[1].split("###")[0];
  ok(lx.includes("CTO & Co-founder · April 2026–present") && lx.includes("Patent pending") && lx.includes("Engineering, product development, and technical leadership for independently verifiable digital records.") && !/FERPA|legal framework/.test(home), "home.md's Lynxster entry agrees with lynxster.md; the old claim is gone");
  await p.close();
}

// ------------------------------------------------------- one treatment per theme
const want = {
  light: { band: "rgb(252, 253, 254)", body: "rgb(238, 241, 245)", accent: "rgb(36, 70, 124)", mark: "rgb(36, 70, 124)" },
  dark: { band: "rgb(7, 9, 8)", body: "rgb(17, 21, 20)", accent: "rgb(76, 199, 188)", mark: "rgb(127, 214, 204)" },
};
for (const theme of ["light", "dark"]) {
  for (const [vw, vh] of [
    [1440, 900],
    [390, 844],
  ]) {
    const ctx = await themed(theme, vw, vh, vw < 600 ? { hasTouch: true, isMobile: true } : {});
    const p = await ctx.newPage();
    await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
    // the assembly plays once it is wholly in view: bring it in, let it finish
    await p.evaluate(() => document.querySelector(".lxb-assembly").scrollIntoView({ block: "center" }));
    await p.waitForTimeout(3600);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const cs = (s) => getComputedStyle(document.querySelector(s));
      const band = cs(".lx-band").backgroundColor;
      const body = cs("body").backgroundColor;
      const stage = document.querySelector(".lx-stage").getBoundingClientRect();
      const vis = document.querySelector(".lxb-assembly").getBoundingClientRect();
      const header = document.querySelector(".site-header");
      const pairs = {
        title: __cr(cs(".lx-title").color, band),
        subtitle: __cr(cs(".lx-subtitle").color, band),
        metaLabel: __cr(cs(".lx-meta dt").color, band),
        crumb: __cr(cs(".breadcrumb a").color, band),
        pill: __cr(cs(".lx-pill").color, cs(".lx-pill").backgroundColor),
        lead: __cr(cs(".lx-problem__lead").color, body),
        answer: __cr(cs(".lx-problem__answer p").color, body),
        when: __cr(cs(".lx-path__when").color, body),
        stopText: __cr(cs(".lx-path__stop p").color, body),
        area: __cr(cs(".lx-area__body p").color, body),
        note: __cr(cs(".lx-area__note").color, cs(".lx-area__note").backgroundColor),
        learning: __cr(cs(".lx-learning__text p").color, cs(".lx-learning").backgroundColor),
        more: __cr(cs(".lx-more p").color, body),
        nav: __cr(getComputedStyle(document.querySelector(".site-nav a, .site-nav button")).color, band),
      };
      const sheets = [...document.querySelectorAll(".lxb-sheet")].map((s) => +getComputedStyle(s).opacity);
      return {
        band,
        body,
        headerTone: header.dataset.tone,
        headerColor: getComputedStyle(header).color,
        accent: cs(".breadcrumb a").color,
        thread: getComputedStyle(document.querySelector(".detail-line path")).stroke,
        mark: cs(".lx-watch .lxb-mark").backgroundColor,
        sealMark: cs(".lxb-seal .lxb-mark").backgroundColor,
        straddles: vis.top < stage.top + stage.height * 0.44 && vis.bottom > stage.top + stage.height * 0.44,
        bandAboveVisual: getComputedStyle(document.querySelector(".lx-stage")).backgroundImage.includes(band.replace(/\s/g, "").replace("rgb(", "rgb(")) || true,
        sheets,
        seal: +cs(".lxb-seal").opacity,
        eyesHidden: [...document.querySelectorAll(".lx-watch__eyes ellipse")].every((e) => getComputedStyle(e).opacity === "0"),
        pairs,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    const tag = `${theme} ${vw}`;
    ok(r.band === want[theme].band && r.body === want[theme].body, `${tag}: ${theme === "light" ? "near-white header band over a cooler tint" : "near-black header band over charcoal"}`, `${r.band} / ${r.body}`);
    ok(r.headerTone === "light" && __crNode(r.headerColor, r.band) >= 7, `${tag}: the site header follows the theme`, `${r.headerTone}, ${r.headerColor}`);
    ok(r.accent === want[theme].accent && r.thread === want[theme].accent, `${tag}: links and thread in the theme's accent`, `${r.accent} / ${r.thread}`);
    ok(r.mark === want[theme].mark && r.sealMark === want[theme].mark, `${tag}: the marks in the theme's colour (navy / light teal)`, `${r.mark} / ${r.sealMark}`);
    ok(r.straddles, `${tag}: the visual starts in the band and carries over its edge`);
    ok(r.sheets.every((o) => o === 1) && r.seal === 1, `${tag}: the assembled illustration is complete at rest`, JSON.stringify(r.sheets));
    ok(r.eyesHidden, `${tag}: the mark's eyes are closed at rest (touch sees a complete mark)`);
    const low = Object.entries(r.pairs).filter(([, v]) => v < 4.5);
    ok(low.length === 0, `${tag}: text and links meet AA contrast`, Object.entries(r.pairs).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(", "));
    ok(r.overflow <= 0, `${tag}: no horizontal overflow`, `${r.overflow}px`);
    await ctx.close();
  }
}
function __crNode(a, b2) {
  const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const L = (c) => {
    const [r, g, bl] = c.match(/[\d.]+/g).map(Number);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
  };
  const x = L(a),
    y = L(b2);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// ------------------------------------------ the watching mark: pointer and eyes
for (const theme of ["light", "dark"]) {
  const ctx = await themed(theme);
  const p = await ctx.newPage();
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  const m = await p.locator(".lx-watch__tilt").boundingBox();
  await p.mouse.move(200, 300);
  await p.waitForTimeout(300);
  const far = await p.evaluate(() => ({ watching: document.querySelector(".lx-band").dataset.watching, eyes: document.querySelector(".lx-band").dataset.eyes }));
  await p.mouse.move(m.x + m.width / 2, m.y + m.height * 0.62, { steps: 10 });
  await p.waitForTimeout(700);
  const near = await p.evaluate(() => {
    const e = document.querySelector(".lx-watch__eyes ellipse");
    return {
      eyes: document.querySelector(".lx-band").dataset.eyes,
      op: getComputedStyle(e).opacity,
      fill: getComputedStyle(e).fill,
      band: getComputedStyle(document.querySelector(".lx-band")).backgroundColor,
      spot: getComputedStyle(document.querySelector(".lx-band__spot")).opacity,
      tilt: getComputedStyle(document.querySelector(".lx-watch__tilt")).transform,
    };
  });
  ok(far.watching === "true" && far.eyes === "closed", `${theme}: over the band, the glow follows and the eyes stay closed`, JSON.stringify(far));
  ok(near.eyes === "open" && near.op === "1" && near.fill === near.band && near.spot === "1" && near.tilt !== "none", `${theme}: near the mark the eyes open — cut-outs in the band's own colour — and the mark tilts`, JSON.stringify(near));
  await p.mouse.move(5, 880);
  await p.waitForTimeout(700);
  ok((await p.evaluate(() => document.querySelector(".lx-band").dataset.eyes)) === "closed", `${theme}: leaving the band closes the eyes and settles the mark`);
  await ctx.close();
}

// ------------------------------------------------- reduced motion: finished at once
{
  const ctx = await themed("light", 1440, 900, { reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  await p.waitForTimeout(150);
  const r = await p.evaluate(() => ({
    asm: [...document.querySelectorAll(".lxb-assembly *")].reduce((n, el) => n + el.getAnimations().length, 0),
    sheets: [...document.querySelectorAll(".lxb-sheet")].map((s) => getComputedStyle(s).opacity),
  }));
  await p.locator(".lx-path__track").scrollIntoViewIfNeeded();
  await p.waitForTimeout(200);
  const off = await p.evaluate(() => getComputedStyle(document.querySelector(".lx-path__line path")).strokeDashoffset);
  const m = await p.locator(".lx-watch__tilt").boundingBox();
  await p.evaluate(() => scrollTo(0, 0));
  await p.mouse.move(m.x + m.width / 2, m.y + m.height * 0.62, { steps: 6 });
  await p.waitForTimeout(400);
  const tilt = await p.evaluate(() => getComputedStyle(document.querySelector(".lx-watch__tilt")).transform);
  ok(r.asm === 0 && r.sheets.every((o) => o === "1") && (off === "0" || off === "0px"), "reduced motion: the illustration and the path are complete at once, nothing moves", JSON.stringify({ ...r, off }));
  ok(tilt === "none" || /matrix\(1, 0, 0, 1, 0, 0\)|matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1\)/.test(tilt), "reduced motion: the mark doesn't tilt", tilt);
  const h = await themed("light", 1440, 900, { reducedMotion: "reduce" });
  const hp = await h.newPage();
  await hp.goto(base + "/", { waitUntil: "networkidle" });
  const fl = await hp.evaluate(() => document.querySelector(".lxb-float__bob").getAnimations().length);
  ok(fl === 0, "reduced motion: the homepage mark rests (no bob)");
  await h.close();
  await ctx.close();
}

// ---------------------------------------------- homepage: Two threads, both cards
const homeWant = {
  light: { mark: "rgb(36, 70, 124)", glow: /36, 70, 124/, ink: "rgb(16, 20, 18)", lx: "rgb(36, 70, 124)", amnhCta: "rgb(29, 79, 140)" },
  dark: { mark: "rgb(127, 214, 204)", glow: /76, 199, 188|127, 214, 204/, ink: "rgb(242, 235, 221)", lx: "rgb(76, 199, 188)", amnhCta: "rgb(230, 185, 143)" },
};
for (const theme of ["light", "dark"]) {
  const ctx = await themed(theme);
  const p = await ctx.newPage();
  const bad = [];
  p.on("response", (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const cards = await p.evaluate(() =>
    ["lynxster", "amnh"].map((slug) => {
      const f = document.querySelector(`.feature--${slug}`);
      const vis = f.querySelector("a.feature__visual");
      const title = f.querySelector(".feature__title a");
      const cta = f.querySelector(".feature__cta");
      const name = title?.querySelector("[aria-label]")?.getAttribute("aria-label") ?? title?.querySelector("img")?.alt;
      return {
        slug,
        visHref: vis?.getAttribute("href"),
        visHidden: vis?.getAttribute("aria-hidden") === "true" && vis?.tabIndex === -1,
        titleHref: title?.getAttribute("href"),
        titleName: name,
        cta: cta?.getAttribute("href"),
        nested: f.querySelectorAll("a a, a button, button a").length,
        meta: f.querySelector(".feature__meta").innerText.replace(/\s+/g, " ").trim(),
        status: f.querySelector(".feature__status")?.innerText.trim() ?? null,
        desc: f.querySelector(".feature__desc")?.innerText ?? "",
      };
    }),
  );
  const [lx, am] = cards;
  const brand = await p.evaluate(() => {
    const f = document.querySelector(".feature--lynxster");
    return {
      float: !!f.querySelector(".lxb-float .lxb-mark") && f.querySelector(".lxb-float .lxb-word")?.textContent === "lynxster",
      floatMark: getComputedStyle(f.querySelector(".lxb-float .lxb-mark")).backgroundColor,
      glow: getComputedStyle(f.querySelector(".lxb-float__shadow")).backgroundImage,
      small: f.querySelector(".feature__title .feature__mark") ? getComputedStyle(f.querySelector(".feature__title .feature__mark")).backgroundColor : null,
      lockupInTitle: !!f.querySelector(".feature__title .logo-mask--lockup"),
      cta: getComputedStyle(f.querySelector(".feature__cta")).color,
      amnhCta: getComputedStyle(document.querySelector(".feature--amnh .feature__cta")).color,
      pill: [getComputedStyle(f.querySelector(".lx-status-pill")).color, getComputedStyle(f.querySelector(".lx-status-pill")).backgroundColor],
      tapes: [getComputedStyle(f, "::before").backgroundColor, getComputedStyle(document.querySelector(".feature--amnh"), "::before").backgroundColor],
    };
  });
  ok(brand.float && brand.floatMark === homeWant[theme].mark && homeWant[theme].glow.test(brand.glow), `${theme}: the preview floats the mark and wordmark, with a glow in the theme's colour`, `${brand.floatMark} | ${brand.glow.slice(0, 60)}`);
  ok(brand.small === homeWant[theme].ink && !brand.lockupInTitle, `${theme}: beside the role, the mark alone in the portfolio's ink`, String(brand.small));
  ok(brand.cta === homeWant[theme].lx && brand.amnhCta === homeWant[theme].amnhCta, `${theme}: “Explore Lynxster” in Lynxster's colour; AMNH's link unchanged`, `${brand.cta} / ${brand.amnhCta}`);
  const pillWant = theme === "light" ? ["rgb(29, 58, 104)", "rgb(228, 235, 245)"] : ["rgb(143, 224, 214)", "rgb(17, 48, 45)"];
  ok(brand.pill[0] === pillWant[0] && brand.pill[1] === pillWant[1], `${theme}: the Patent pending pill in Lynxster's colours`, brand.pill.join(" on "));
  ok(/181, 205, 196/.test(brand.tapes[0]) && /240, 216, 150/.test(brand.tapes[1]), `${theme}: tape swapped — sage on Lynxster, yellow on AMNH`, brand.tapes.join(" | "));
  ok(lx.visHref === "/work/lynxster" && lx.titleHref === "/work/lynxster" && lx.cta === "/work/lynxster", `${theme}: Lynxster — preview, title and button all lead to its page`);
  ok(am.visHref === "/work/amnh" && am.titleHref === "/work/amnh" && am.cta === "/work/amnh", `${theme}: AMNH — preview, title and button all lead to its page`);
  ok(lx.visHidden && am.visHidden && lx.nested === 0 && am.nested === 0, `${theme}: the preview links are pointer-only duplicates; nothing interactive is nested`);
  ok(lx.titleName === "Lynxster" && am.titleName === "American Museum of Natural History", `${theme}: the title links are named`, `${lx.titleName} / ${am.titleName}`);
  ok(/^CTO & Co-founder ?,? ?April 2026–present$/.test(lx.meta) && lx.status === "Patent pending", `${theme}: homepage Lynxster — CTO & Co-founder, April 2026–present, Patent pending`, `${lx.meta} | ${lx.status}`);
  ok(!/FERPA|legal framework/i.test(lx.desc) && lx.desc.startsWith("Engineering, product development"), `${theme}: homepage description from lynxster.md, no compliance claim`);
  ok(/^Volunteer ?,? ?2026–now$/.test(am.meta) && am.status === null, `${theme}: AMNH's role and dates unchanged`, am.meta);
  ok(bad.length === 0, `${theme}: no failed requests on the homepage`, bad.join(", "));
  for (const [sel, slug] of [
    [".feature--lynxster a.feature__visual", "lynxster"],
    [".feature--amnh .feature__title a", "amnh"],
  ]) {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.locator(sel).scrollIntoViewIfNeeded();
    await p.locator(sel).click();
    await p.waitForTimeout(1500);
    ok(p.url().endsWith(`/work/${slug}`), `${theme}: clicking ${sel.includes("visual") ? "the preview" : "the title"} opens /work/${slug}`, p.url());
  }
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.locator(".feature--lynxster .feature__title a").focus();
  await p.keyboard.press("Shift+Tab");
  await p.keyboard.press("Tab");
  await p.waitForTimeout(600);
  const k = await p.evaluate(() => {
    const a = document.activeElement;
    const f = a.closest(".feature");
    return { href: a.getAttribute("href"), ring: getComputedStyle(a).outlineStyle, lift: getComputedStyle(f.querySelector(".feature__visual")).transform !== "none" };
  });
  ok(k.href === "/work/lynxster" && k.ring !== "none" && k.lift, `${theme}: keyboard focus on the title shows a ring and lifts the card`, JSON.stringify(k));
  await p.keyboard.press("Enter");
  await p.waitForTimeout(1500);
  ok(p.url().endsWith("/work/lynxster"), `${theme}: Enter on the title opens the page`);
  await ctx.close();
}

// ------------------------------------------------ theme switching on the page
{
  const ctx = await themed("light");
  const p = await ctx.newPage();
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  const before = await p.evaluate(() => getComputedStyle(document.querySelector(".lx-band")).backgroundColor);
  await p.locator(".theme-toggle__button").click();
  await p.waitForTimeout(300);
  await p.locator("#theme-menu [role^='menuitem']", { hasText: "Dark" }).first().click();
  await p.waitForTimeout(700);
  const after = await p.evaluate(() => ({ band: getComputedStyle(document.querySelector(".lx-band")).backgroundColor, mark: getComputedStyle(document.querySelector(".lx-watch .lxb-mark")).backgroundColor, theme: document.documentElement.dataset.theme }));
  ok(before === want.light.band && after.band === want.dark.band && after.mark === want.dark.mark, "switching the theme on the page swaps the whole treatment", JSON.stringify(after));
  await ctx.close();
}

// ------------------------------------- the path's thread runs dot to dot
{
  const ctx = await themed("light", 1440, 900, { reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  await p.locator(".lx-path").scrollIntoViewIfNeeded();
  const g = await p.evaluate(() => {
    const path = document.querySelector(".lx-path__line path");
    const svg = path.ownerSVGElement.getBoundingClientRect();
    const len = path.getTotalLength();
    const start = path.getPointAtLength(0), end = path.getPointAtLength(len);
    const sx = svg.width / 1000, sy = svg.height / 40;
    const dot = (sel) => { const r = getComputedStyle(document.querySelector(sel), "::before"); const li = document.querySelector(sel).getBoundingClientRect(); return { x: li.left + parseFloat(r.left) + parseFloat(r.width) / 2, y: li.top + parseFloat(r.top) + parseFloat(r.height) / 2 }; };
    const a = dot(".lx-path__stop--from"), b2 = dot(".lx-path__stop--to");
    return { start: [svg.left + start.x * sx, svg.top + start.y * sy], end: [svg.left + end.x * sx, svg.top + end.y * sy], a: [a.x, a.y], b: [b2.x, b2.y] };
  });
  const d = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]);
  ok(d(g.start, g.a) < 2 && d(g.end, g.b) < 2, "progression: the thread starts and ends exactly at the two dots", `${d(g.start, g.a).toFixed(1)}px / ${d(g.end, g.b).toFixed(1)}px`);
  await ctx.close();
}

// ------------- the assembly plays when wholly in view; hover replays the ripples
{
  const ctx = await themed("light", 1440, 900);
  const p = await ctx.newPage();
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  await p.mouse.move(5, 880);
  const running = () => p.evaluate(() => document.querySelector(".lxb-assembly").getAnimations({ subtree: true }).filter((x) => x.playState === "running").map((x) => x.animationName));
  const before = await p.evaluate(() => ({ play: document.querySelector(".lxb-assembly").dataset.play, sheet: getComputedStyle(document.querySelector(".lxb-sheet--c")).opacity }));
  await p.evaluate(() => document.querySelector(".lxb-assembly").scrollIntoView({ block: "center" }));
  await p.waitForTimeout(200);
  const started = await running();
  await p.waitForTimeout(3500);
  const a = await p.locator(".lxb-assembly").boundingBox();
  await p.mouse.move(a.x + 30, a.y + 30);
  await p.waitForTimeout(150);
  const ripple = await running();
  await p.waitForTimeout(1700);
  const after = await running();
  const fin = await p.evaluate(() => ({ seal: getComputedStyle(document.querySelector(".lxb-seal")).opacity, sheets: [...document.querySelectorAll(".lxb-sheet")].map((x) => getComputedStyle(x).opacity) }));
  ok(before.play === "wait" && started.length >= 8, "the assembly waits until the whole preview is in view, then plays", `${before.play} → ${started.length} running`);
  ok(ripple.length === 2 && ripple.every((n) => n === "lxb-ripple") && after.length === 0 && fin.seal === "1" && fin.sheets.every((o) => o === "1"), "hovering the preview replays just the last beat — the seal's two ripples", ripple.join(","));
  await ctx.close();
}

// ------------------------------------------------------------------- the drawer
{
  const ctx = await themed("light");
  const p = await ctx.newPage();
  await p.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  await p.click(".site-nav__work");
  await p.waitForTimeout(700);
  const note = await p.evaluate(() => {
    const a = document.querySelector('#work-sheet a[href="/work/lynxster"]');
    return a?.closest("li, .sheet-entry, .sheet-feature")?.innerText.replace(/\s+/g, " ") ?? "";
  });
  ok(/CTO & Co-founder/.test(note) && !/Chief Technology Officer(?! &)|2026–now|2027|Engineering & technical leadership/.test(note), "drawer: Lynxster labelled CTO & Co-founder, no stale role or dates", note);
  await ctx.close();
}

await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
