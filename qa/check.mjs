// Functional QA with Playwright + installed Google Chrome.
// Usage: BASE_URL=http://localhost:3100 node qa/check.mjs
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3100";
const slugs = [
  "lynxster", "amnh", "crackd-ai", "buzzworks", "tmu-citation-tooling", "inteli-lens",
  "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship",
];
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const browser = await chromium.launch({ channel: "chrome" });

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.bad = [];
  page.on("console", (m) => m.type() === "error" && page.errors.push(m.text()));
  page.on("pageerror", (e) => page.errors.push(String(e)));
  page.on("response", (r) => r.status() >= 400 && page.bad.push(`${r.status()} ${r.url()}`));
  return page;
}
const settle = (page, ms = 450) => page.waitForTimeout(ms);
const scrollTo = async (page, y) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await settle(page, 250);
};

/* 1. every route: status, console errors, failed requests, overflow at 3 widths */
for (const [w, h] of [[375, 812], [768, 1024], [1440, 900]]) {
  const page = await newPage({ viewport: { width: w, height: h } });
  for (const path of ["/", ...slugs.map((s) => `/work/${s}`)]) {
    page.errors = [];
    page.bad = [];
    const res = await page.goto(base + path, { waitUntil: "networkidle" });
    await settle(page, 300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const h1 = await page.locator("h1").count();
    const pass = res.status() === 200 && overflow <= 0 && page.errors.length === 0 && page.bad.length === 0 && h1 === 1;
    ok(`route ${path} @${w}`, pass, `status ${res.status()}, overflow ${overflow}, h1 ${h1}, errors ${page.errors.length}, failed ${page.bad.join(" ")}`);
  }
  await page.context().close();
}

/* 2. 404 for unknown slug */
{
  const page = await newPage();
  const res = await page.goto(base + "/work/not-a-project");
  ok("unknown route returns 404", res.status() === 404, `status ${res.status()}`);
  await page.context().close();
}

/* 3. homepage anchors from the header */
{
  const page = await newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  for (const id of ["about", "work", "more", "contact"]) {
    await page.click(`.site-nav a[href="#${id}"]`);
    await settle(page, 1200);
    const top = await page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id);
    const atBottom = await page.evaluate(() => Math.abs(window.scrollY + innerHeight - document.documentElement.scrollHeight) < 3);
    ok(`nav anchor #${id}`, (top >= 0 && top < 90) || (id === "contact" && atBottom), `section top ${Math.round(top)}px, url ${page.url().split("/").pop()}`);
  }
  // sticky header: brand hidden at top, shown after the hero name scrolls away
  await scrollTo(page, 0);
  await settle(page, 800);
  const brandTop = await page.evaluate(() => getComputedStyle(document.querySelector(".site-header__brand")).opacity);
  await scrollTo(page, 900);
  await settle(page, 600);
  const brandLater = await page.evaluate(() => getComputedStyle(document.querySelector(".site-header__brand")).opacity);
  const headerPos = await page.evaluate(() => document.querySelector(".site-header").getBoundingClientRect().top);
  ok("sticky header settles (name appears, stays at top)", brandTop === "0" && brandLater === "1" && headerPos === 0, `opacity ${brandTop} → ${brandLater}, header top ${headerPos}`);
  await page.context().close();
}

/* 4. direct-load deep links */
{
  const page = await newPage();
  await page.goto(base + "/#contact", { waitUntil: "networkidle" });
  await settle(page, 1200);
  const y = await page.evaluate(() => window.scrollY);
  ok("direct load /#contact scrolls to Contact", y > 3000, `scrollY ${y}`);
  await page.context().close();
}

/* 5. work links, browser Back restores position, Back to work, detail nav anchors */
{
  const page = await newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const links = await page.$$eval('a[href^="/work/"]', (as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
  ok("homepage links every detail route", slugs.every((s) => links.includes(`/work/${s}`)), `${links.length} unique detail links`);

  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelector('.panel a[href="/work/buzzworks"]').scrollIntoView({ block: "center", behavior: "instant" }));
  await settle(page);
  const before = await page.evaluate(() => window.scrollY);
  await page.click('.panel a[href="/work/buzzworks"]');
  await page.waitForURL("**/work/buzzworks");
  await settle(page, 600);
  ok("selected-work panel opens detail page", page.url().endsWith("/work/buzzworks"));
  await page.goBack();
  await page.waitForURL(base + "/");
  await settle(page, 900);
  const after = await page.evaluate(() => window.scrollY);
  ok("browser Back restores homepage scroll", Math.abs(after - before) < 60, `before ${Math.round(before)}, after ${Math.round(after)}`);

  await page.goto(base + "/work/amnh", { waitUntil: "networkidle" });
  await page.click(".pager__back");
  await page.waitForURL("**/#work");
  await settle(page, 1300);
  const workTop = await page.evaluate(() => document.getElementById("work").getBoundingClientRect().top);
  ok("Back to work returns to /#work", Math.abs(workTop) < 90, `#work top ${Math.round(workTop)}`);

  await page.goto(base + "/work/crackd-ai", { waitUntil: "networkidle" });
  await page.click('.site-nav a[href="/#about"]');
  await page.waitForURL("**/#about");
  await settle(page, 1300);
  const aboutTop = await page.evaluate(() => document.getElementById("about").getBoundingClientRect().top);
  ok("detail header About → /#about", Math.abs(aboutTop) < 90, `#about top ${Math.round(aboutTop)}`);

  await page.goto(base + "/work/crackd-ai", { waitUntil: "networkidle" });
  await page.click(".pager__link--next");
  await page.waitForURL("**/work/buzzworks");
  ok("next-project link", page.url().endsWith("/work/buzzworks"));
  await page.context().close();
}

/* 6. the line: one fixed route welded to the "a"; scroll only draws/retracts it */
{
  const page = await newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 900);
  const state = () =>
    page.evaluate(() => {
      const svg = document.querySelector("[data-testid=scribble]");
      const p = svg.querySelector(".scribble__path");
      return { d: p.getAttribute("d"), off: p.style.strokeDashoffset, drawn: Number(svg.dataset.drawn), ready: svg.dataset.ready, mode: svg.dataset.mode };
    });
  const s0 = await state();
  await scrollTo(page, 500);
  const s500 = await state();
  await scrollTo(page, 1300);
  const s1300 = await state();
  await scrollTo(page, 3500);
  const s3500 = await state();
  await page.waitForTimeout(1500);
  const s3500b = await state();
  await scrollTo(page, 1300);
  const back1300 = await state();
  await scrollTo(page, 500);
  const back500 = await state();
  await scrollTo(page, 0);
  const back0 = await state();
  ok("line shown once fonts are ready, in scroll mode", s0.ready === "true" && s0.mode === "scroll");
  ok("line extends as you scroll forward", s0.drawn < s500.drawn && s500.drawn < s1300.drawn && s1300.drawn < s3500.drawn, `drawn ${s0.drawn} → ${s500.drawn} → ${s1300.drawn} → ${s3500.drawn}`);
  ok("route itself never moves (no drifting attachment)", s0.d === s500.d && s0.d === s3500.d);
  ok("line holds when scrolling stops", s3500.off === s3500b.off);
  ok("reverse scroll retracts exactly", back1300.off === s1300.off && back500.off === s500.off && back0.off === s0.off);
  const weld = [];
  for (const y of [0, 150, 300]) {
    await scrollTo(page, y);
    weld.push(
      await page.evaluate(() => {
        const end = document.querySelector('[data-line="name-end"]').getBoundingClientRect();
        const fs = parseFloat(getComputedStyle(document.querySelector('[data-line="hero-name"]')).fontSize);
        const p = document.querySelector("[data-testid=scribble] .scribble__path");
        const box = p.ownerSVGElement.getBoundingClientRect();
        const a = p.getPointAtLength(0);
        // start must sit inside the tail of the "a" (calibrated tip, 0.06em back along the stroke)
        const ex = end.left + 0.0305 * fs - Math.cos(0.45) * 0.06 * fs;
        const ey = end.bottom - 0.0496 * fs + Math.sin(0.45) * 0.06 * fs;
        return Math.hypot(box.left + a.x - ex, box.top + a.y - ey);
      }),
    );
  }
  ok("line starts inside the final \"a\" at every scroll position", weld.every((d) => d < 1), weld.map((d) => d.toFixed(2) + "px").join(", "));
  const svgStyle = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector("[data-testid=scribble]"));
    return { pe: s.pointerEvents, z: s.zIndex };
  });
  // points on the drawn line must hit page content, not the svg
  await scrollTo(page, 0);
  const hits = await page.evaluate(() => {
    const p = document.querySelector("[data-testid=scribble] .scribble__path");
    const box = p.ownerSVGElement.getBoundingClientRect();
    return [0.004, 0.02, 0.05].map((f) => {
      const q = p.getPointAtLength(p.getTotalLength() * f);
      const el = document.elementFromPoint(box.left + q.x, box.top + q.y);
      return el ? el.tagName.toLowerCase() : "none";
    });
  });
  ok("line never intercepts pointer input", svgStyle.pe === "none" && hits.every((h) => h !== "path" && h !== "svg"), `pointer-events ${svgStyle.pe}, z ${svgStyle.z}, hits ${hits.join("/")}`);
  await page.context().close();
}

/* 7. reduced motion: static composition, labels in DOM, no smooth scroll */
{
  const page = await newPage({ reducedMotion: "reduce" });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 600);
  const info = await page.evaluate(() => {
    const svg = document.querySelector("[data-testid=scribble]");
    const paths = [...svg.querySelectorAll("path")].map((p) => (p.getAttribute("d") || "").length);
    const line = svg.querySelector(".scribble__path");
    return { mode: svg.dataset.mode, paths, dash: line.style.strokeDasharray || "none", behavior: getComputedStyle(document.documentElement).scrollBehavior, labels: document.querySelectorAll(".trajectory__point").length, marquee: getComputedStyle(document.querySelector(".writing__ink")).animationName };
  });
  const d0 = await page.evaluate(() => document.querySelector("[data-testid=scribble] path").getAttribute("d"));
  await scrollTo(page, 2000);
  const d1 = await page.evaluate(() => document.querySelector("[data-testid=scribble] path").getAttribute("d"));
  ok("reduced motion: complete line drawn statically", info.mode === "static" && info.dash === "none" && info.paths.every((n) => n > 100) && d0 === d1, JSON.stringify(info));
  ok("reduced motion: More writing flourish not animated", info.marquee === "none", info.marquee);
  ok("reduced motion: no trajectory underdrawing (only the line itself)", (await page.$$("[data-testid=scribble] path:not(.scribble__path):not(.scribble__bridge)")).length === 0);
  ok("reduced motion: no CSS smooth scrolling", info.behavior === "auto");
  ok("trajectory labels are real DOM text", info.labels === 5);
  await page.goto(base + "/work/amnh", { waitUntil: "networkidle" });
  await settle(page, 400);
  const off = await page.evaluate(() => document.querySelector("[data-testid=detail-line] path").style.strokeDashoffset);
  ok("reduced motion: detail line fully drawn", off === "0" || off === "0px", `dashoffset ${off}`);
  await page.context().close();
}

/* 8. keyboard: skip link first, visible focus, all nav reachable */
{
  const page = await newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement.textContent.trim());
  const visible = await page.evaluate(() => document.activeElement.getBoundingClientRect().top >= 0);
  ok("first Tab focuses skip link (visible)", first === "Skip to content" && visible, first);
  const seq = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    seq.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        const s = getComputedStyle(a);
        // Currently cards draw the ring on the whole card (stretched link)
        const card = a.closest(".feature");
        const ring = s.outlineStyle !== "none" && s.outlineWidth !== "0px" ? "outline" : card && getComputedStyle(card).outlineStyle !== "none" ? "card-outline" : "none";
        return `${a.textContent.trim().slice(0, 28)}|${ring}`;
      }),
    );
  }
  ok("keyboard order: nav then content, focus outline visible", seq.every((s) => s.endsWith("outline")) && seq[0].startsWith("About"), seq.join(" · "));
  await page.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const brand = await page.evaluate(() => document.activeElement.textContent.trim());
  ok("detail page: brand reachable by keyboard", brand === "Anya Jajodia.", brand);
  await page.context().close();
}

/* 9. content integrity: images/logos load, no dead links, alt/labels */
{
  const page = await newPage();
  await page.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  const logo = await page.evaluate(async () => {
    const r = await fetch("/assets/lynxster/lynxster-lockup.png");
    return r.status;
  });
  const labelled = await page.evaluate(() => [...document.querySelectorAll('[role="img"]')].every((e) => e.getAttribute("aria-label")));
  ok("real Lynxster logo asset loads; role=img elements labelled", logo === 200 && labelled, `logo ${logo}`);
  let deadHrefs = [];
  for (const path of ["/", ...slugs.map((s) => `/work/${s}`)]) {
    await page.goto(base + path, { waitUntil: "domcontentloaded" });
    const hrefs = await page.$$eval("a", (as) => as.map((a) => a.getAttribute("href")));
    deadHrefs.push(...hrefs.filter((h) => !h || h === "#" || h.includes("TODO")));
  }
  ok("no empty/placeholder hrefs anywhere", deadHrefs.length === 0, deadHrefs.join(", "));
  await page.context().close();
}

/* 10. selected-work panels and More bento */
{
  const page = await newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.locator(".panels").scrollIntoViewIfNeeded();
  await page.mouse.move(2, 2);
  await settle(page, 900);
  const w = (slug) => page.evaluate((s) => document.querySelector(`.panel a[href="/work/${s}"]`).closest(".panel").getBoundingClientRect().width, slug);
  const op = (slug) => page.evaluate((s) => getComputedStyle(document.querySelector(`.panel a[href="/work/${s}"]`).closest(".panel").querySelector(".panel__more")).opacity, slug);
  const crackd0 = await w("crackd-ai");
  const buzz0 = await w("buzzworks");
  ok("panels: first panel open by default, names legible collapsed", crackd0 > buzz0 * 2 && (await op("crackd-ai")) === "1", `crackd ${Math.round(crackd0)}px, buzzworks ${Math.round(buzz0)}px`);
  const rows = await page.$$eval(".panels__row", (r) => r.map((x) => Math.round(x.getBoundingClientRect().height)));
  const heightsBefore = await page.$$eval(".panel", (p) => p.map((x) => Math.round(x.getBoundingClientRect().height)).join(","));
  // rows are at least the compact height and grow only to fit their longest summary
  const fitRows = await page.$$eval(".panels__row", (rs) => rs.map((r) => Math.max(...[...r.querySelectorAll(".panel__more")].map((m) => m.scrollHeight)) <= r.getBoundingClientRect().height));
  ok("panels: two compact rows (≥220px, sized to their longest summary, ≤300px)", rows.length === 2 && rows.every((h) => h >= 220 && h <= 300) && fitRows.every(Boolean), rows.join(" / ") + "px");
  const collapsed = await page.$$eval(".panel", (ps) => ps.map((p) => {
    const name = p.querySelector(".panel__name");
    const logo = p.querySelector(".panel__logo img, .panel__logo svg");
    const img = p.querySelector(".panel__logo img");
    return { name: name && getComputedStyle(name).display !== "none" && parseFloat(getComputedStyle(name).fontSize) >= 18, logo: !!logo && logo.getBoundingClientRect().width > 20, loaded: !img || img.naturalWidth > 0, date: p.querySelector(".panel__date")?.textContent ?? "" };
  }));
  ok("panels: collapsed panels show logo/mark, readable name, dates from content", collapsed.every((c) => c.name && c.logo && c.loaded), collapsed.map((c) => c.date || "—").join(" · "));
  await page.hover('.panel a[href="/work/buzzworks"]');
  await settle(page, 1000);
  const logoX0 = await page.$eval(".panel--buzzworks .panel__logo", (e) => Math.round(e.getBoundingClientRect().left - e.closest(".panel").getBoundingClientRect().left));
  ok("panels: hover expands a panel and reveals its summary", (await w("buzzworks")) > buzz0 * 2 && (await op("buzzworks")) === "1");
  const heightsAfter = await page.$$eval(".panel", (p) => p.map((x) => Math.round(x.getBoundingClientRect().height)).join(","));
  const logoX1 = await page.$eval(".panel--buzzworks .panel__logo", (e) => Math.round(e.getBoundingClientRect().left - e.closest(".panel").getBoundingClientRect().left));
  ok("panels: expansion changes width only; logo stays put", heightsBefore === heightsAfter && logoX0 === logoX1, `heights ${heightsAfter}, logo offset ${logoX0} → ${logoX1}`);
  await page.mouse.move(2, 2);
  await page.focus('.panel a[href="/work/crackd-ai"]');
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await settle(page, 1000);
  const focused = await page.evaluate(() => document.activeElement.getAttribute("href"));
  ok("panels: keyboard focus expands a panel", focused === "/work/inteli-lens" && (await op("inteli-lens")) === "1", focused);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await settle(page, 1000);
  const sub = await page.evaluate(() => document.activeElement.getAttribute("href"));
  ok("panels: grouped sub-links reachable and open their panel", sub === "/work/pmmy-research" && (await op("pmmy-research")) === "1", sub);
  const nested = await page.$$eval(".panels a", (as) => as.filter((a) => a.querySelector("a, button")).length);
  const dests = await page.$$eval(".panels a", (as) => as.length);
  ok("panels: every destination present, no nested interactive elements", dests === 9 && nested === 0, `${dests} links, ${nested} nested`);
  const exp = await page.$eval(".bento__card--experiments", (c) => ({ graphics: c.querySelectorAll("svg, img, canvas").length, text: c.textContent.trim() }));
  ok("More: Experiments is an empty, clearly forthcoming plate (no graphic)", exp.graphics === 0 && /Later/.test(exp.text), JSON.stringify(exp));
  const fake = await page.$$eval(".bento a, .bento button", (x) => x.length);
  ok("bento: placeholders are not links", fake === 0);
  await page.context().close();

  const phone = await newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await phone.goto(base + "/", { waitUntil: "networkidle" });
  const cards = await phone.evaluate(() =>
    [...document.querySelectorAll(".panel")].map((p) => ({
      more: getComputedStyle(p.querySelector(".panel__more")).opacity,
      date: p.querySelector(".panel__date") ? getComputedStyle(p.querySelector(".panel__date")).display !== "none" : null,
      w: Math.round(p.getBoundingClientRect().width),
    })),
  );
  ok("mobile/touch: stacked cards with summaries and dates visible", cards.length === 7 && cards.every((c) => c.more === "1" && c.date !== false && c.w > 300), JSON.stringify(cards[0]));
  const feat = await phone.$$eval(".feature", (f) => f.map((x) => Math.round(x.getBoundingClientRect().left)));
  ok("mobile: Currently features stack", feat.length === 2 && feat[0] === feat[1], feat.join(","));
  await phone.context().close();
}

/* 11. logos, dot field, trajectory milestone */
{
  const page = await newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 600);
  const logos = await page.$$eval("img[src*='/logos/']", (imgs) => imgs.map((i) => ({ src: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0, ratio: +(i.getBoundingClientRect().width / i.getBoundingClientRect().height).toFixed(2), natural: +(i.naturalWidth / i.naturalHeight).toFixed(2) })));
  ok("supplied logos load undistorted (rendered ratio = file ratio)", logos.length === 6 && logos.every((l) => l.ok && Math.abs(l.ratio - l.natural) < 0.05), logos.map((l) => `${l.src.split("/").pop()} ${l.ratio}/${l.natural}`).join(", "));
  const lynx = await page.$eval(".feature__lockup", (e) => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), label: e.getAttribute("aria-label") }; });
  ok("Currently: Lynxster lockup sizeable and labelled", lynx.h >= 64 && lynx.label === "Lynxster", JSON.stringify(lynx));
  // three logo layers: muted panel → container with a translucent BACKGROUND only → opaque artwork
  const layers = await page.evaluate(() =>
    [...document.querySelectorAll(".panel")].map((p) => {
      const logo = p.querySelector(".panel__logo");
      const art = logo.querySelector("img, svg");
      const r = logo.getBoundingClientRect();
      const cs = getComputedStyle(logo);
      let anc = 1;
      for (let e = art; e && e !== document.body; e = e.parentElement) anc *= parseFloat(getComputedStyle(e).opacity);
      const bg = cs.backgroundColor.match(/[\d.]+/g).map(Number);
      return {
        k: p.className.split("--")[1],
        size: `${Math.round(r.width)}x${Math.round(r.height)}`,
        radius: cs.borderRadius,
        bgAlpha: bg[3] ?? 1,
        artOpacity: anc,
        filter: getComputedStyle(art).filter,
        src: art.getAttribute("src"),
      };
    }),
  );
  const sizes = new Set(layers.map((l) => l.size + l.radius));
  // every identifier sits in the same slot; all but Teaching on a translucent tile —
  // Teaching's Columbia crown stands alone on the card (no tile), by design
  const tiled = layers.filter((l) => l.k !== "teaching");
  const crown = layers.find((l) => l.k === "teaching");
  ok(
    "panels: one identifier slot (same size/shape); translucent tiles, opaque unfiltered artwork; Teaching's crown untiled",
    sizes.size === 1 && tiled.every((l) => l.bgAlpha > 0 && l.bgAlpha < 1) && layers.every((l) => l.artOpacity === 1 && l.filter === "none") && crown.bgAlpha === 0 && crown.src.endsWith("columbia-crown-light.png"),
    [...sizes].join() + " · " + layers.map((l) => `${l.k} bg${l.bgAlpha} art${l.artOpacity}`).join(", "),
  );
  ok(
    "panels: compact Crackd/Buzzworks symbols; Crackd's yellow on a dark backing",
    layers.find((l) => l.k === "crackd").src.endsWith("crackd-minimal.png") && layers.find((l) => l.k === "buzzworks").src.endsWith("buzzworks-minimal.png") &&
      (await page.$eval(".panel--crackd .panel__logo", (e) => getComputedStyle(e).backgroundColor)).startsWith("rgba(36, 35, 33"),
  );
  const flat = await page.evaluate(() => ({
    motifs: document.querySelectorAll(".panel__motif").length,
    gradients: [...document.querySelectorAll(".panel")].filter((p) => [getComputedStyle(p).backgroundImage, getComputedStyle(p, "::before").backgroundImage, getComputedStyle(p, "::after").backgroundImage].some((v) => v && v !== "none")).length,
    radius: getComputedStyle(document.querySelector(".panel")).borderRadius,
  }));
  ok("panels: flat paper surfaces (no gradients, no watermark motifs), subtly rounded (≤ 8px)", flat.motifs === 0 && flat.gradients === 0 && parseFloat(flat.radius) <= 8, JSON.stringify(flat));
  const pal = await page.evaluate(() => {
    // any CSS colour (incl. color-mix's color(srgb …)) → sRGB bytes via a canvas
    const cv = document.createElement("canvas").getContext("2d");
    const bytes = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const lum = (c) => bytes(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    return [...document.querySelectorAll(".panel")].map((p) => {
      const cs = getComputedStyle(p);
      const a = lum(cs.backgroundColor), b = lum(cs.color);
      return { k: p.className.split("--")[1], bg: `rgb(${bytes(cs.backgroundColor).join(", ")})`, cr: +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2) };
    });
  });
  const want = { crackd: "rgb(248, 215, 77)", buzzworks: "rgb(232, 178, 141)", tmu: "rgb(169, 193, 217)", inteli: "rgb(185, 164, 190)", gvi: "rgb(165, 189, 176)", pubs: "rgb(211, 161, 173)", teaching: "rgb(176, 185, 218)" };
  ok("panels: muted coloured-paper palette (Crackd yellow kept)", pal.every((p) => want[p.k] === p.bg), pal.map((p) => `${p.k} ${p.bg}`).join("; "));
  ok("panels: charcoal text, contrast ≥ 4.5:1 on every panel colour", pal.every((p) => p.cr >= 4.5), pal.map((p) => `${p.k} ${p.cr}`).join(", "));
  const meta = await page.evaluate(() => {
    // any CSS colour (incl. color-mix's color(srgb …)) → sRGB bytes via a canvas
    const cv = document.createElement("canvas").getContext("2d");
    const bytes = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const lum = (c) => bytes(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    return [...document.querySelectorAll(".panel")].map((p) => { const a = lum(getComputedStyle(p).backgroundColor), b = lum(getComputedStyle(p.querySelector(".panel__meta")).color); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2); });
  });
  ok("panels: dates/categories (small text) ≥ 4.5:1 too", meta.every((c) => c >= 4.5), meta.join(", "));
  const amnhCard = await page.$eval(".feature--amnh", (e) => e.textContent);
  const nFeat = await page.$$eval(".feature", (f) => f.length);
  ok("Currently: AMNH card separates its two workstreams (still two cards)", nFeat === 2 && amnhCard.includes("DIODE · Collections digitization") && amnhCard.includes("Mantis behavioral trials & research"));
  const hero = await page.evaluate(() => ({ specimen: document.querySelectorAll(".specimen, .hero svg:not(.matcha__fizz)").length, figures: document.querySelectorAll(".hero [data-avatar]").length, perched: !!document.querySelector('.hero__perch [data-avatar="perched"] img')?.naturalWidth }));
  ok("hero: dragonfly removed; one avatar, sitting on the line", hero.specimen === 0 && hero.figures === 1 && hero.perched, JSON.stringify(hero));
  const df = () => page.$eval("[data-testid=dot-field]", (c) => ({ mode: c.dataset.mode, anim: c.dataset.animating ?? "idle", pe: getComputedStyle(c).pointerEvents }));
  for (let i = 0; i <= 8; i++) await page.mouse.move(820 + i * 18, 430 + i * 5);
  await settle(page, 100);
  const moving = await df();
  await page.mouse.move(1430, 880);
  await page.evaluate(() => document.documentElement.dispatchEvent(new PointerEvent("pointerleave")));
  await settle(page, 2500);
  const rested = await df();
  ok("dot field: reacts to pointer, then settles and stops", moving.anim === "true" && rested.anim === "false" && moving.pe === "none", `${JSON.stringify(moving)} → ${rested.anim}`);
  const top = await page.$eval('[data-line="traj"]', (e) => e.getBoundingClientRect().top + scrollY);
  await scrollTo(page, top - 900 * 0.35);
  const act = await page.$$eval(".trajectory__point", (ps) => ps.findIndex((p) => p.dataset.active));
  ok("trajectory: the reached milestone is emphasised", act >= 0, `active point ${act + 1}`);
  await page.context().close();
  const t = await newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await t.goto(base + "/", { waitUntil: "networkidle" });
  ok("dot field: static on touch", (await t.$eval("[data-testid=dot-field]", (c) => c.dataset.mode)) === "static");
  await t.context().close();
  const r = await newPage({ reducedMotion: "reduce" });
  await r.goto(base + "/", { waitUntil: "networkidle" });
  ok("dot field: static with reduced motion", (await r.$eval("[data-testid=dot-field]", (c) => c.dataset.mode)) === "static");
  await r.context().close();
}

/* 12. composition-aware line: under the hero avatar's seat, never off the page,
       always partly in view while scrolling, resting under "Say hello." */
for (const [w, h] of [[1440, 900], [1024, 768], [768, 1024], [390, 844]]) {
  const page = await newPage({ viewport: { width: w, height: h } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 800);
  const r = await page.evaluate(() => {
    const p = document.querySelector("[data-testid=scribble] .scribble__path");
    const L = p.getTotalLength();
    const top = p.ownerSVGElement.getBoundingClientRect().top + scrollY;
    const pts = [];
    for (let i = 0; i <= 3000; i++) { const q = p.getPointAtLength((L * i) / 3000); pts.push({ x: q.x, y: q.y + top, l: (L * i) / 3000 }); }
    window.__pts = pts; window.__L = L;
    const doc = (sel) => { const e = document.querySelector(sel); const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY }; };
    // she sits on it: across her seat the line runs at seat height, and never
    // through her upper body
    const pl = doc('[data-line="perch-l"]');
    const pr = doc('[data-line="perch-r"]');
    const box = doc(".hero__perch");
    // the seat band (the line's later run may pass the empty corner under her feet)
    const seat = pts.filter((q) => q.x > pl.l + 8 && q.x < pr.l - 8 && q.y > box.t && q.y < pl.t + (box.b - box.t) * 0.2);
    const seatOk = seat.length > 20 && seat.every((q) => Math.abs(q.y - pl.t) < 9);
    // above the seat, the line may cross the rig's empty stage but never her
    // artwork: sample the body layer's alpha under each point (except where it
    // reaches her resting hand)
    const bodyImg = document.querySelector('[data-part="body"] img');
    const bi = bodyImg.getBoundingClientRect();
    const cnv = document.createElement("canvas");
    cnv.width = bodyImg.naturalWidth;
    cnv.height = bodyImg.naturalHeight;
    const cx = cnv.getContext("2d");
    cx.drawImage(bodyImg, 0, 0);
    const alphaAt = (x, y) => {
      const u = Math.floor(((x - bi.left) / bi.width) * cnv.width), v = Math.floor(((y - scrollY - bi.top) / bi.height) * cnv.height);
      if (u < 0 || v < 0 || u >= cnv.width || v >= cnv.height) return 0;
      return cx.getImageData(u, v, 1, 1).data[3];
    };
    const inSlot = pts.filter((q) => q.y > box.t && q.y < pl.t - 12 && Math.hypot(q.x - pl.l, q.y - pl.t) > 30 && alphaAt(q.x, q.y) > 128).length + (seatOk ? 0 : 1000);
    const vw = document.documentElement.clientWidth;
    const offPage = pts.filter((q) => q.x < 4 || q.x > vw - 4).length;
    const K = doc('[data-line="contact-heading"]');
    const end = pts[pts.length - 1];
    return { inSlot, offPage, endUnder: end.y > K.b - 10 && end.y < K.b + 60 && end.x < K.l + 80, end: [Math.round(end.x), Math.round(end.y)], K: [Math.round(K.l), Math.round(K.b)] };
  });
  ok(`line runs under the hero avatar's seat, not through her @${w}`, r.inSlot === 0, `${r.inSlot} stray points`);
  ok(`line never leaves the page horizontally @${w}`, r.offPage === 0, `${r.offPage} points outside the viewport`);
  // forward and back: some DRAWN line is always on screen below the header
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const low = [];
  const positions = [];
  for (let s = 0; s <= max; s += 90) positions.push(s);
  positions.push(max);
  for (const s of [...positions, ...positions.slice().reverse()]) {
    await page.evaluate((y) => window.scrollTo(0, y), s);
    await page.waitForTimeout(25);
    const vis = await page.evaluate(() => {
      const p = document.querySelector("[data-testid=scribble] .scribble__path");
      const drawn = window.__L - parseFloat(p.style.strokeDashoffset || "0");
      const t = scrollY + document.querySelector(".site-header").getBoundingClientRect().bottom;
      const b = scrollY + innerHeight;
      const vw = document.documentElement.clientWidth;
      let v = 0, prev = null;
      for (const q of window.__pts) {
        if (q.l > drawn) break;
        const ins = q.x >= 6 && q.x <= vw - 6 && q.y >= t && q.y <= b;
        if (ins && prev) v += Math.hypot(q.x - prev.x, q.y - prev.y);
        prev = ins ? q : null;
      }
      return Math.round(v);
    });
    if (vis < 40) low.push(`${s}:${vis}`);
  }
  ok(`line stays partly in view at every scroll position, forward and back @${w}`, low.length === 0, low.length ? low.slice(0, 8).join(" ") : `${positions.length * 2} positions`);
  ok(`line comes to rest under "Say hello." @${w}`, r.endUnder, `end ${r.end}, heading left/bottom ${r.K}`);
  // the faint grey pre-trace is gone: the line, its ink bridge out of the letter, nothing else
  const paths = await page.$$eval("[data-testid=scribble] path", (ps) => ps.map((p) => p.getAttribute("class")));
  ok(`no faint pre-trace under the trajectory — the line is the only stroke @${w}`, paths.join() === "scribble__path,scribble__bridge", paths.join());
  await page.context().close();
}

/* 13. AMNH detail: two clearly separate workstreams */
{
  const page = await newPage();
  await page.goto(base + "/work/amnh", { waitUntil: "networkidle" });
  const d = await page.evaluate(() => ({
    streams: [...document.querySelectorAll("section.stream")].map((s) => ({ id: s.id, h: s.querySelector("h2")?.textContent, text: s.textContent })),
    index: [...document.querySelectorAll(".streams-index a")].map((a) => a.getAttribute("href")),
    plates: document.querySelectorAll(".plate__frame[role=img]").length,
  }));
  const [dig, mantis] = d.streams;
  ok(
    "AMNH detail: Collections digitization and Mantis behavioral research as separate sections",
    d.streams.length === 2 && dig.h === "Collections digitization" && mantis.h === "Mantis behavioral research" && d.index.join() === "#collections-digitization,#mantis-research",
    d.streams.map((s) => s.h).join(" | "),
  );
  ok(
    "AMNH detail: digitization content preserved; research described only as joining",
    dig.text.includes("digitize archival dragonfly records") && dig.text.includes("3D-printed rigs") && mantis.text.includes("joined a mantis behavioral research project") && mantis.text.includes("once they’re confirmed"),
  );
  ok("AMNH detail: honest photo placeholders for both workstreams", d.plates === 3, `${d.plates} placeholders`);
  await page.context().close();
}

/* 14. avatars: anchored, decorative, light, calm */
for (const [w, h] of [[1440, 900], [1024, 768], [768, 1024], [390, 844]]) {
  const page = await newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  const requested = [];
  page.on("request", (q) => requested.push(new URL(q.url()).pathname));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 1200);
  const a11y = await page.evaluate(() =>
    [...document.querySelectorAll("[data-avatar]")].map((el) => {
      const img = el.querySelector("img");
      // the hero rig holds two labelled controls, so its artwork (not the whole figure) is aria-hidden
      const art = el.querySelector(".hero-rig__stage") ?? el;
      return { hidden: art.getAttribute("aria-hidden") === "true", alt: img.getAttribute("alt"), pe: getComputedStyle(el).pointerEvents, w: img.getAttribute("width"), h: img.getAttribute("height"), loading: img.getAttribute("loading"), role: el.dataset.avatar };
    }),
  );
  ok(`avatars: decorative (aria-hidden, empty alt, no pointer events), sized boxes @${w}`, a11y.every((a) => a.hidden && a.alt === "" && a.pe === "none" && a.w && a.h), `${a11y.length} figures`);
  ok(`avatars: only the hero loads eagerly @${w}`, a11y.every((a) => (a.role === "perched") === (a.loading === "eager")));
  // the only images left in the accessibility tree are the three real ones
  const imgs = (await page.locator("body").ariaSnapshot()).split("\n").filter((l) => /- img\b/.test(l));
  ok(`avatars: none in the accessibility tree @${w}`, imgs.length === 3, imgs.map((l) => l.trim()).join(" | "));
  // walk down the page like a reader, so every figure meets its cue
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= max; y += 70) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(25);
  }
  await page.evaluate((v) => window.scrollTo(0, v), max);
  await settle(page, 4000); // the last entrances (≤0.9s wait + 2.4s to settle)
  const avs = requested.filter((p) => p.startsWith("/assets/avatar/"));
  const shown = await page.evaluate(() => [...document.querySelectorAll("[data-avatar]")].filter((el) => el.offsetParent).map((el) => el.dataset.avatar));
  const hiddenLoaded = await page.evaluate(() => [...document.querySelectorAll("[data-avatar]")].filter((el) => !el.offsetParent && el.querySelector("img").complete && el.querySelector("img").naturalWidth).length);
  ok(
    `avatars: only displayed figures load, no contact sheets or source PNGs @${w}`,
    hiddenLoaded === 0 && avs.every((p) => p.endsWith(".avif")) && !requested.some((p) => /previews|handoff|\.png$/.test(p) && p.includes("avatar")) && avs.length <= shown.length + (shown.includes("perched") ? 3 : 0), // the hero rig is four layers
    `${avs.length} files for ${shown.length} shown: ${shown.join(", ")}`,
  );
  // fewer, larger figures: hero, untangler, greeter everywhere; the edge peeker where there is room for her lane
  const expected = ["perched", "untangling", ...(w >= 1200 ? ["edge"] : []), "greeting"];
  const narrowOk = shown.join() === expected.join();
  ok(`avatars: fewer figures as the page narrows @${w}`, narrowOk && shown.includes("perched"), shown.join(", "));
  const crowd = await page.evaluate(() => {
    const figs = [...document.querySelectorAll("[data-avatar]")].filter((e) => e.offsetParent).map((e) => { const b = e.getBoundingClientRect(); return { t: b.top + scrollY, b: b.bottom + scrollY }; });
    let n = 0;
    for (let s = 0; s <= document.documentElement.scrollHeight - innerHeight; s += 20)
      n = Math.max(n, figs.filter((f) => Math.min(f.b, s + innerHeight) - Math.max(f.t, s + 60) >= 0.4 * (f.b - f.t)).length);
    return n;
  });
  ok(`avatars: never more than two figures in view @${w}`, crowd <= 2, `max ${crowd}`);
  const settled = await page.evaluate(() => [...document.querySelectorAll("[data-avatar]:not([data-static])")].filter((el) => el.offsetParent).every((el) => el.dataset.in === "done" && el.querySelector(".avatar__body").getAnimations().length === 0));
  ok(`avatars: each entered once and has settled (no running animation) @${w}`, settled);
  // the line: through the untangler's fist; under the feet of the figure at the trajectory's end and of the greeter
  const line = await page.evaluate(() => {
    const p = document.querySelector("[data-testid=scribble] .scribble__path");
    const L = p.getTotalLength();
    const top = p.ownerSVGElement.getBoundingClientRect().top + scrollY;
    const pts = [];
    for (let i = 0; i <= 4000; i++) { const q = p.getPointAtLength((L * i) / 4000); pts.push({ x: q.x, y: q.y + top }); }
    const at = (sel) => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return null; const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top + scrollY, b: b.bottom + scrollY }; };
    const near = (x, y) => Math.min(...pts.map((q) => Math.hypot(q.x - x, q.y - y)));
    const fist = at('[data-line="untangle-fist"]');
    const under = (sel) => {
      const b = at(sel);
      if (!b) return null;
      const xs = [0.3, 0.5, 0.7].map((f) => b.l + (b.r - b.l) * f);
      return Math.max(...xs.map((x) => Math.min(...pts.filter((q) => Math.abs(q.x - x) < 3).map((q) => Math.abs(q.y - (b.b - 2))), 999)));
    };
    return { fist: fist ? +near(fist.l, fist.t).toFixed(1) : null, greeter: under('[data-avatar="greeting"]') };
  });
  ok(`avatars: the line runs into the untangler's fist @${w}`, line.fist !== null && line.fist < 4, `${line.fist}px`);
  ok(`avatars: the greeter stands on the line's last stretch @${w}`, line.greeter !== null && line.greeter < 8, `${line.greeter}px`);
  // nothing readable or clickable is covered: links stay hittable, no text under a figure
  const cover = await page.evaluate(() => {
    const figs = [...document.querySelectorAll("[data-avatar]")].filter((el) => el.offsetParent).map((el) => {
      const b = el.getBoundingClientRect();
      // the artwork's own transparent margin (the hero rig's stage: figure spans x 10.5–90.5%, y 1–90%)
      if (el.dataset.avatar === "perched") return { role: "perched", l: b.left + b.width * 0.105, r: b.left + b.width * 0.905, t: b.top + b.height * 0.01 + scrollY, b: b.top + b.height * 0.9 + scrollY };
      const ix = b.width * 0.12, iy = b.height * 0.08;
      return { role: el.dataset.avatar, l: b.left + ix, r: b.right - ix, t: b.top + iy + scrollY, b: b.bottom - iy + scrollY };
    });
    const hits = [];
    const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || n.parentElement.closest("[aria-hidden=true]")) continue;
      const more = n.parentElement.closest(".panel__more");
      if (more && getComputedStyle(more).opacity === "0") continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      // text inside a panel is clipped by it (overflow: hidden)
      const clip = n.parentElement.closest(".panel")?.getBoundingClientRect();
      for (const r0 of rg.getClientRects()) {
        const r = clip ? { left: Math.max(r0.left, clip.left), right: Math.min(r0.right, clip.right), top: Math.max(r0.top, clip.top), bottom: Math.min(r0.bottom, clip.bottom) } : r0;
        if (r.right <= r.left || r.bottom <= r.top) continue;
        for (const f of figs) if (r.right > f.l && r.left < f.r && r.bottom + scrollY > f.t && r.top + scrollY < f.b) hits.push(`${f.role}: ${n.textContent.trim().slice(0, 24)}`);
      }
    }
    const links = [...document.querySelectorAll(".contact a, .contact-list__row, .panel a, .feature a")].filter((a) => a.offsetParent);
    const blocked = [];
    for (const a of links) {
      a.scrollIntoView({ block: "center" });
      const b = a.getBoundingClientRect();
      const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      if (!a.contains(top) && !top?.contains(a)) blocked.push(a.textContent.trim().slice(0, 20));
    }
    return { hits: [...new Set(hits)], blocked };
  });
  ok(`avatars: no text sits under a figure @${w}`, cover.hits.length === 0, cover.hits.join(" | "));
  ok(`avatars: every work and contact link stays clickable @${w}`, cover.blocked.length === 0, cover.blocked.join(" | "));
  await page.context().close();
}
{
  // reduced motion: every figure simply in place, no entrance, no idle motion
  const page = await newPage({ reducedMotion: "reduce" });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 600);
  const r = await page.evaluate(() =>
    [...document.querySelectorAll("[data-avatar]")].filter((el) => el.offsetParent).map((el) => ({ in: el.dataset.static ? "still" : el.dataset.in, op: getComputedStyle(el.querySelector(".avatar__body")).opacity, anim: el.querySelector(".avatar__body").getAnimations().length })),
  );
  ok("avatars: reduced motion shows every figure in place, unanimated", r.length >= 4 && r.every((x) => x.in === "still" && x.op === "1" && x.anim === 0), JSON.stringify(r[0]));
  await page.goto(base + "/work/lynxster", { waitUntil: "networkidle" });
  const d = await page.evaluate(() => [...document.querySelectorAll("[data-avatar]")].map((el) => el.dataset.in));
  ok("avatars: reduced motion on project pages too", d.length === 2 && d.every((x) => x === "still"), d.join());
  await page.context().close();
}
{
  // project pages: one or two contextual figures, standing on a section rule, clear of text
  const page = await newPage();
  const res = [];
  // (the bespoke pages have their own layouts; their figures are checked separately below)
  for (const slug of slugs.filter((s) => !["crackd-ai", "buzzworks", "tmu-citation-tooling", "gvi-conservation", "pmmy-research", "teenage-pregnancy-research", "esp-teaching", "adi-mentorship"].includes(s))) {
    await page.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
    const r = await page.evaluate(() =>
      [...document.querySelectorAll("[data-avatar]")].map((el) => {
        const s = el.closest("section.detail-section");
        const b = el.getBoundingClientRect();
        const sb = s.getBoundingClientRect();
        return Math.abs(b.bottom - (b.height * (1 - parseFloat(getComputedStyle(el).getPropertyValue("--base")))) - sb.bottom) < 3;
      }),
    );
    res.push(`${slug}:${r.length}:${r.every(Boolean)}`);
  }
  ok("project pages: 1–2 figures each, standing on the rule under their section", res.every((x) => /:(1|2):true$/.test(x)), res.join(" "));
  ok("project pages: two for Lynxster and AMNH", res.some((x) => x === "lynxster:2:true") && res.some((x) => x === "amnh:2:true"));
  // Crackd: one sits on the phase-02 sheet's top edge, one stands on the last question's rule
  await page.goto(`${base}/work/crackd-ai`, { waitUntil: "networkidle" });
  const ck = await page.evaluate(() => {
    const foot = (el) => { const b = el.getBoundingClientRect(); return b.bottom - b.height * (1 - parseFloat(getComputedStyle(el).getPropertyValue("--base"))); };
    const build = document.querySelector(".avatar--ck-build"), think = document.querySelector(".avatar--ck-think");
    const sheet = document.querySelector(".ck-sheet").getBoundingClientRect();
    const lastQ = [...document.querySelectorAll(".ck-questions__list li")].pop().getBoundingClientRect();
    return { n: document.querySelectorAll("[data-avatar]").length, build: Math.round(foot(build) - sheet.top), think: Math.round(foot(think) - lastQ.bottom) };
  });
  ok("Crackd: two figures, seated on the phase-02 sheet and standing on the last question's rule", ck.n === 2 && Math.abs(ck.build) < 3 && Math.abs(ck.think) < 3, JSON.stringify(ck));
  // Buzzworks: one, standing on the rule under "What I owned"
  await page.goto(`${base}/work/buzzworks`, { waitUntil: "networkidle" });
  const bz = await page.evaluate(() => {
    const el = document.querySelector(".avatar--bz-desk"), b = el.getBoundingClientRect();
    const foot = b.bottom - b.height * (1 - parseFloat(getComputedStyle(el).getPropertyValue("--base")));
    return { n: document.querySelectorAll("[data-avatar]").length, gap: Math.round(foot - document.getElementById("what-i-owned").getBoundingClientRect().bottom) };
  });
  ok("Buzzworks: one figure, standing on the rule under its section", bz.n === 1 && Math.abs(bz.gap) < 3, JSON.stringify(bz));
  // TMU: one, the reader, standing on the rule under "Beyond the code"
  await page.goto(`${base}/work/tmu-citation-tooling`, { waitUntil: "networkidle" });
  const tm = await page.evaluate(() => {
    const el = document.querySelector(".avatar--tmu-reader"), b = el.getBoundingClientRect();
    const foot = b.bottom - b.height * (1 - parseFloat(getComputedStyle(el).getPropertyValue("--base")));
    return { n: document.querySelectorAll("[data-avatar]").length, gap: Math.round(foot - document.getElementById("beyond-the-code").getBoundingClientRect().bottom) };
  });
  ok("TMU: one figure, standing on the rule under its section", tm.n === 1 && Math.abs(tm.gap) < 3, JSON.stringify(tm));
  // GVI: one, watching with binoculars, standing on the rule under "In the field"
  await page.goto(`${base}/work/gvi-conservation`, { waitUntil: "networkidle" });
  const gv = await page.evaluate(() => {
    const el = document.querySelector(".avatar--gvi-watch"), b = el.getBoundingClientRect();
    const foot = b.bottom - b.height * (1 - parseFloat(getComputedStyle(el).getPropertyValue("--base")));
    return { n: document.querySelectorAll("[data-avatar]").length, gap: Math.round(foot - document.getElementById("in-the-field").getBoundingClientRect().bottom) };
  });
  ok("GVI: one figure, standing on the rule under its section", gv.n === 1 && Math.abs(gv.gap) < 3, JSON.stringify(gv));
  // the research pages: one reader each, on the rule under "My contribution"
  for (const slug of ["pmmy-research", "teenage-pregnancy-research"]) {
    await page.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
    const rs = await page.evaluate(() => {
      const el = document.querySelector(".avatar--rs-reader"), b = el.getBoundingClientRect();
      const foot = b.bottom - b.height * (1 - parseFloat(getComputedStyle(el).getPropertyValue("--base")));
      return { n: document.querySelectorAll("[data-avatar]").length, gap: Math.round(foot - document.getElementById("my-contribution").getBoundingClientRect().bottom) };
    });
    ok(`${slug}: one figure, standing on the rule under its section`, rs.n === 1 && Math.abs(rs.gap) < 3, JSON.stringify(rs));
  }
  await page.context().close();
}

/* 15. avatar motion, measured frame by frame */
{
  // the hero avatar: loaded, opaque and still from the first frame of a fresh load
  const page = await newPage();
  await page.addInitScript(() => {
    window.__hero = [];
    const tick = () => {
      const img = document.querySelector(".hero__perch img");
      if (img) {
        let op = 1;
        for (let e = img; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
        // the figure itself: the stage and the body layer (the legs may make their one settling entry swing)
        const body = document.querySelector('.hero-rig [data-part="body"]');
        const stage = img.closest(".avatar__body");
        window.__hero.push({ complete: img.complete && img.naturalWidth > 0, op, anims: stage.getAnimations().length + body.getAnimations().length, transform: getComputedStyle(stage).transform + getComputedStyle(body).transform === "nonenone" ? "none" : "moved" });
      }
      if (window.__hero.length < 60) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(base + "/", { waitUntil: "load" });
  await settle(page, 1200);
  const hero = await page.evaluate(() => window.__hero);
  const preload = await page.$$eval('link[rel="preload"][as="image"]', (ls) => ls.map((l) => l.getAttribute("href") || l.getAttribute("imagesrcset")));
  ok("hero avatar: fully visible and still from the first frame (no entrance), preloaded", hero.length > 0 && hero[0].complete && hero.every((f) => f.op === 1 && f.anims === 0 && f.transform === "none") && preload.some((p) => p?.includes("rig/body")), `first ${JSON.stringify(hero[0])}, preload ${preload.join(" ")}`);

  // every other entrance: a short decelerating settle, no bounce
  await page.evaluate(() => {
    window.__tr = {};
    const tick = () => {
      for (const el of document.querySelectorAll("[data-avatar]:not([data-static])")) {
        if (!el.offsetParent) continue;
        const cs = getComputedStyle(el.querySelector(".avatar__body"));
        const m = new DOMMatrixReadOnly(cs.transform === "none" ? undefined : cs.transform);
        (window.__tr[el.dataset.avatar] ??= []).push([performance.now(), +cs.opacity, m.m41, m.m42]);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= max; y += 20) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(16);
  }
  await settle(page, 1800);
  const tr = await page.evaluate(() => {
    const out = {};
    for (const [role, s] of Object.entries(window.__tr)) {
      const moving = s.filter((f, i) => i > 0 && (f[1] !== s[i - 1][1] || f[2] !== s[i - 1][2] || f[3] !== s[i - 1][3]));
      if (!moving.length) { out[role] = null; continue; }
      const first = s[s.indexOf(moving[0]) - 1], last = moving[moving.length - 1];
      const dx = last[2] - first[2], dy = last[3] - first[3];
      out[role] = { travel: Math.hypot(dx, dy), ms: last[0] - first[0], over: moving.some((f) => (f[2] - last[2]) * Math.sign(dx) > 0.5 || (f[3] - last[3]) * Math.sign(dy) > 0.5) };
    }
    return out;
  });
  const fmt = Object.entries(tr).map(([k, v]) => (v ? `${k} ${v.travel.toFixed(0)}px/${Math.round(v.ms)}ms${v.over ? " overshoot" : ""}` : `${k} none`)).join(", ");
  ok("avatars: entrances are short settles (8–18px, 350–650ms), never bouncing; the edge peeker's slide is scroll-linked (checked below)", Object.entries(tr).every(([k, v]) => v && !v.over && (k === "edge" ? true : v.ms >= 350 && v.ms <= 650 && v.travel >= 8 && v.travel <= 18)), fmt);
  ok("avatars: no traveller on the trajectory, no figures in More", (await page.$$(".trajectory [data-avatar], .more [data-avatar]")).length === 0);
  await page.context().close();
}

/* 16. the right-edge peeker */
for (const [w, h] of [[1440, 900], [1280, 800]]) {
  const page = await newPage({ viewport: { width: w, height: h } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const gridTop = await page.evaluate(() => document.querySelector(".panels").getBoundingClientRect().top + scrollY);
  await page.evaluate(() => {
    const fig = document.querySelector('[data-avatar="edge"]');
    const lane = document.querySelector(".edge-lane");
    window.__e = { minGap: 1e9, settledAt: null, lean: new Set() };
    const tick = () => {
      const e = window.__e;
      if (!e) return;
      const f = fig.querySelector(".avatar__img").getBoundingClientRect();
      const l = lane.getBoundingClientRect();
      const cards = Math.max(...[...document.querySelectorAll(".panel")].map((p) => p.getBoundingClientRect().right));
      if (f.bottom > 0 && f.top < innerHeight) e.minGap = Math.min(e.minGap, Math.max(f.left, l.left) - cards);
      // settled: within 2px of rest (the end of the ease is invisible)
      const tx = new DOMMatrixReadOnly(getComputedStyle(fig.querySelector(".avatar__body")).transform.replace("none", "matrix(1,0,0,1,0,0)")).m41;
      if (e.settledAt === null && fig.dataset.in && fig.dataset.in !== "queued" && Math.abs(tx) < 2) e.settledAt = scrollY;
      e.lean.add(getComputedStyle(fig.querySelector(".avatar__react")).transform);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  for (let y = Math.max(0, Math.round(gridTop - h * 1.3)); y < gridTop - h * 0.35; y += 14) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(16);
  }
  await settle(page, 900);
  const readable = Math.round(gridTop - h * 0.8);
  const settledAt = await page.evaluate(() => window.__e.settledAt);
  // she slides out with the scroll from her first visible pixel; fully out by the time the
  // cards are readable (or, where she is shorter than the grid, within 18% of a screen of appearing)
  const firstSeen = await page.evaluate(() => document.querySelector('[data-avatar="edge"]').getBoundingClientRect().top + scrollY - innerHeight);
  const due = Math.max(readable, Math.round(firstSeen + h * 0.18));
  ok(`edge peeker: scroll-linked slide is complete when the cards are readable @${w}`, settledAt !== null && settledAt <= due + 2, `out at ${settledAt}, due by ${due} (cards readable at ${readable})`);
  const centers = await page.$$eval(".panel", (ps) => ps.map((p) => { const r = p.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }));
  for (const [x, y] of [...centers, ...centers.slice().reverse()]) {
    await page.mouse.move(x, y, { steps: 3 });
    await page.waitForTimeout(90);
  }
  await page.mouse.move(centers[0][0], centers[0][1]);
  await settle(page, 700);
  const far = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
  await page.mouse.move(centers[3][0], centers[3][1]);
  await settle(page, 700);
  const near = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
  await page.mouse.move(w * 0.3, 80);
  await settle(page, 800);
  const neutral = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
  await page.evaluate(() => document.querySelectorAll(".panel a")[5].focus());
  await settle(page, 700);
  const key = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
  await page.evaluate(() => document.activeElement.blur());
  const e = await page.evaluate(() => ({ minGap: window.__e.minGap, lean: window.__e.lean.size }));
  ok(`edge peeker: never within 24px of a card, in any frame (entrance, rapid switching) @${w}`, e.minGap >= 24, `${e.minGap.toFixed(1)}px`);
  ok(`edge peeker: leans to the active card (further for further cards), by pointer and keyboard; neutral after leaving @${w}`, far !== near && near !== neutral && key !== neutral && neutral === "matrix(1, 0, 0, 1, 0, 0)" && e.lean > 10, `${far} | ${near} | ${neutral} | ${key}`);
  const peek = () => page.$eval('[data-avatar="edge"]', (el) => el.dataset.peek ?? "out");
  const seq = [];
  await page.click(".edge-lane__hit");
  for (let i = 0; i < 12; i++) { seq.push(await peek()); await page.waitForTimeout(230); }
  await page.focus(".edge-lane__hit");
  await page.keyboard.press("Space");
  await page.waitForTimeout(120);
  const keyPeek = await peek();
  ok(`edge peeker: peekaboo by tap/click and keyboard (ducks, checks, comes out) @${w}`, [...new Set(seq)].join("→") === "hide→check→out" && keyPeek === "hide", `${[...new Set(seq)].join("→")}; key ${keyPeek}`);
  const label = await page.$eval(".edge-lane__hit", (b) => b.getAttribute("aria-label"));
  ok(`edge peeker: her button is labelled and reachable @${w}`, !!label && (await page.$eval(".edge-lane__hit", (b) => b.tabIndex)) === 0, label);
  const end = await page.evaluate(() => document.querySelector(".selected").getBoundingClientRect().bottom + scrollY);
  await page.evaluate((v) => window.scrollTo(0, v), Math.round(end + 10));
  await settle(page, 300);
  ok(`edge peeker: leaves with the section; no horizontal overflow @${w}`, await page.evaluate(() => document.querySelector('[data-avatar="edge"]').getBoundingClientRect().bottom <= document.querySelector(".site-header").getBoundingClientRect().bottom + 1 && document.documentElement.scrollWidth === document.documentElement.clientWidth));
  await page.evaluate(() => (window.__e = null));
  await page.context().close();
}
{
  const page = await newPage({ viewport: { width: 1024, height: 768 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  ok("edge peeker: not shown where there is no room for her lane (1024)", (await page.$eval(".edge-lane", (e) => getComputedStyle(e).display)) === "none");
  await page.context().close();
}

/* 17. the matcha (the hero rig's cup; the rig itself: qa/hero-rig.mjs) */
for (const [w, h, touch] of [[1440, 900, false], [390, 844, true]]) {
  const page = await newPage({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await settle(page, 1800);
  const m = await page.evaluate(() => {
    const b = document.querySelector(".hero-rig__target--cup").getBoundingClientRect();
    const st = document.querySelector(".hero-rig").getBoundingClientRect();
    // the cup in the assembled rig: 84% across, 39% down the stage
    const cup = { x: st.left + st.width * 0.84, y: st.top + st.height * 0.39 };
    return { w: b.width, h: b.height, onCup: cup.x > b.left && cup.x < b.right && cup.y > b.top && cup.y < b.bottom, label: document.querySelector(".hero-rig__target--cup").getAttribute("aria-label") };
  });
  ok(`matcha: a labelled button over the cup itself, ≥ 44px @${w}`, m.onCup && m.w >= 44 && m.h >= 44 && !!m.label, JSON.stringify(m));
  if (touch) await page.tap(".hero-rig__target--cup");
  else {
    const b = await page.$eval(".hero-rig__target--cup", (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    await page.mouse.move(b[0], b[1]);
  }
  await page.waitForTimeout(600);
  const st = await page.evaluate(() => ({ arm: document.querySelector('[data-part="forearm-matcha"]').getAnimations().length, body: document.querySelector('[data-part="body"]').getAnimations().length, fizz: !!document.querySelector(".hero-rig[data-fizz]") }));
  ok(`matcha: ${touch ? "a tap" : "hover"} raises the cup (a small cheers, with fizz); the body stays still @${w}`, st.arm === 1 && st.body === 0 && st.fizz, JSON.stringify(st));
  await page.context().close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
