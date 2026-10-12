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
    return { mode: svg.dataset.mode, paths, dash: line.style.strokeDasharray || "none", behavior: getComputedStyle(document.documentElement).scrollBehavior, labels: document.querySelectorAll(".trajectory__point").length, marquee: getComputedStyle(document.querySelector(".marquee__track")).animationName };
  });
  const d0 = await page.evaluate(() => document.querySelector("[data-testid=scribble] path").getAttribute("d"));
  await scrollTo(page, 2000);
  const d1 = await page.evaluate(() => document.querySelector("[data-testid=scribble] path").getAttribute("d"));
  ok("reduced motion: complete line drawn statically", info.mode === "static" && info.dash === "none" && info.paths.every((n) => n > 100) && d0 === d1, JSON.stringify(info));
  ok("reduced motion: bento marquee stopped", info.marquee === "none", info.marquee);
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
  ok("panels: two compact rows (220–250px)", rows.length === 2 && rows.every((h) => h >= 220 && h <= 250), rows.join(" / ") + "px");
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
  const nodes = page.locator(".lab__node");
  await page.locator(".bento__card--experiments").scrollIntoViewIfNeeded();
  await nodes.nth(0).hover();
  await settle(page, 300);
  const act = await page.$$eval(".lab__node", (n) => n.findIndex((g) => g.classList.contains("is-active")));
  const beams = await page.locator(".lab__beam").count();
  ok("bento: experiments diagram responds to pointer", act === 0 && beams === 2, `active node ${act}, beams ${beams}`);
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
  ok("supplied logos load undistorted (rendered ratio = file ratio)", logos.length === 5 && logos.every((l) => l.ok && Math.abs(l.ratio - l.natural) < 0.05), logos.map((l) => `${l.src.split("/").pop()} ${l.ratio}/${l.natural}`).join(", "));
  const lynx = await page.$eval(".feature__lockup", (e) => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), label: e.getAttribute("aria-label") }; });
  ok("Currently: Lynxster lockup sizeable and labelled", lynx.h >= 80 && lynx.label === "Lynxster", JSON.stringify(lynx));
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

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
