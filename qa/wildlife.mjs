// Functional checks for the Wildlife photography page and its homepage link.
// Usage: BASE_URL=http://localhost:3100 node qa/wildlife.mjs
import { chromium } from "playwright";
import { readFileSync, statSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3100";
const route = "/wildlife-photography";
const m = JSON.parse(readFileSync("src/content/wildlife-photos.json", "utf8"));
const gen = JSON.parse(readFileSync("src/content/wildlife-photos.generated.json", "utf8"));
// the viewing order: the opening photograph, then the rows
const photos = [m.hero, ...m.rows.flatMap((r) => r.photos)].map((id) => ({ id, ...m.photos[id], ...gen[m.photos[id].file] }));
const N = photos.length;
let pass = 0,
  fail = 0;
const ok = (cond, name, extra = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? `  — ${extra}` : ""}`);
};
const settle = (p, ms = 1100) => p.waitForTimeout(ms);
const b = await chromium.launch({ channel: "chrome" });

// ------------------------------------------------------------ homepage link
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const link = p.locator('#more a[href="/wildlife-photography"]');
  ok((await link.count()) === 1, "homepage: one link to /wildlife-photography in Other things");
  ok((await link.textContent())?.trim() === "Wildlife photography", "homepage: the link is named “Wildlife photography”");
  await p.locator(".bento__card--photo").scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  const plate = await p.locator(".bento__card--photo").boundingBox();
  const hit = await p.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest("a")?.getAttribute("href"), { x: plate.x + 40, y: plate.y + 60 });
  ok(hit === "/wildlife-photography", "homepage: the whole plate is clickable (stretched link)", hit ?? "no link");
  ok(!(await p.locator("#more").textContent()).includes("Photographs to come"), "homepage: “Photographs to come” placeholder text is gone");
  const prev = await p.evaluate(() => {
    const img = document.querySelector(".bento__card--photo .photo-preview__img");
    const r = img.getBoundingClientRect();
    const card = img.closest(".bento__card").getBoundingClientRect();
    return { src: img.getAttribute("src"), loaded: img.complete && img.naturalWidth > 0, box: r.width / r.height, nat: img.naturalWidth / img.naturalHeight, inside: r.left >= card.left && r.right <= card.right && r.top >= card.top && r.bottom <= card.bottom, fit: getComputedStyle(img).objectFit };
  });
  ok(prev.src === `/assets/wildlife-photography/${m.photos[m.homepage].file}` && prev.loaded, "homepage: the plate shows the supplied homepage photograph", prev.src);
  ok(Math.abs(prev.box - prev.nat) / prev.nat < 0.01 && prev.inside, "homepage: the preview is whole, at its own proportions, inside the plate", `box ${prev.box.toFixed(3)} vs ${prev.nat.toFixed(3)}`);
  ok((await p.locator(".bento__card--photo .bento__soon").textContent()).includes(`${N} photographs`), `homepage: the plate says ${N} photographs`);
  await link.focus();
  ok(await p.evaluate(() => getComputedStyle(document.querySelector(".bento__card--photo")).outlineStyle !== "none"), "homepage: focusing the link outlines the plate");
  await p.mouse.click(plate.x + 40, plate.y + 60);
  await p.waitForTimeout(2500);
  ok(p.url().endsWith("/wildlife-photography"), "homepage: clicking the plate opens the page", p.url());
  ok((await p.locator("h1").textContent())?.trim() === "Wildlife photography", "homepage → page navigation lands on the page");
  ok(errs.length === 0, "homepage → page: no console errors", errs.join(" | "));
  await p.close();
}

// ------------------------------------------- every photograph, as supplied
{
  const p = await b.newPage();
  const res = await Promise.all(
    photos.map((ph) =>
      p.request.get(`${base}/assets/wildlife-photography/${ph.file}`).then(async (r) => [ph.file, r.status(), (await r.body()).length, statSync(`public/assets/wildlife-photography/${ph.file}`).size]),
    ),
  );
  const bad = res.filter(([, st, got, disk]) => st !== 200 || got !== disk);
  ok(bad.length === 0, `all ${N} photographs are served byte-for-byte as supplied`, bad.map((x) => x.join(" ")).join(", "));
  ok(N === 14 && new Set(photos.map((x) => x.file)).size === N, "14 photographs in the sequence, none listed twice");
  await p.close();
}

// ------------------------------------------------- layout at several widths
for (const [vw, vh] of [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [320, 640],
]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  await p.goto(base + route, { waitUntil: "networkidle" });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await p.waitForTimeout(800);
  await p.waitForFunction(() => [...document.querySelectorAll(".wl-tile__img")].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 90000 }).catch(() => {});
  const r = await p.evaluate(() => {
    const tiles = [...document.querySelectorAll(".wl-tile")];
    const boxes = tiles.map((t) => t.getBoundingClientRect());
    const imgs = tiles.map((t) => t.querySelector("img"));
    const ratioErr = Math.max(...imgs.map((im, i) => Math.abs(boxes[i].width / boxes[i].height - im.naturalWidth / im.naturalHeight) / (im.naturalWidth / im.naturalHeight)));
    let overlaps = 0;
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          c = boxes[j];
        if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1) overlaps++;
      }
    const col = document.querySelector(".wl-section").getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(document.querySelector(".wl-section")).paddingLeft);
    // in a horizontal row, every photograph shares one height
    const rows = [...document.querySelectorAll(".wl-row")].map((row) => {
      const hs = [...row.querySelectorAll(".wl-tile")].map((t) => t.getBoundingClientRect());
      const horizontal = getComputedStyle(row).flexDirection === "row";
      return horizontal ? Math.max(...hs.map((h) => h.height)) - Math.min(...hs.map((h) => h.height)) : 0;
    });
    const area = (w) => {
      const a = [...document.querySelectorAll(`.wl-item[data-weight="${w}"] .wl-tile`)].map((t) => t.getBoundingClientRect().width * t.getBoundingClientRect().height);
      return a.reduce((x, y) => x + y, 0) / a.length;
    };
    const text = document.querySelector("main").innerText;
    const srcs = imgs.map((i) => i.getAttribute("src"));
    return {
      n: tiles.length,
      loaded: imgs.filter((im) => im.complete && im.naturalWidth > 0).length,
      ratioErr,
      overlaps,
      inside: boxes.every((x) => x.left >= col.left + pad - 1 && x.right <= col.right - pad + 1),
      rowSpread: Math.max(...rows),
      mainVsSupport: area("main") / area("support"),
      overflow: document.documentElement.scrollWidth - innerWidth,
      alts: imgs.every((im) => im.alt.length > 20),
      fit: imgs.every((im) => ["cover", "contain", "fill"].includes(getComputedStyle(im).objectFit)),
      dupes: srcs.length - new Set(srcs).size,
      words: /final edits|still to come|main gallery|secondary|supporting photograph/i.test(text),
      count: document.querySelector(".wl-intro__num")?.textContent,
    };
  });
  const tag = `${vw}×${vh}`;
  ok(r.n === N && r.loaded === N, `${tag}: ${N} photographs, all loaded`, `${r.loaded} loaded`);
  ok(r.ratioErr < 0.005, `${tag}: every photograph keeps its own proportions (nothing stretched or cropped)`, `max error ${(r.ratioErr * 100).toFixed(2)}%`);
  ok(r.overlaps === 0 && r.inside, `${tag}: photographs don't overlap and stay inside the column`, `${r.overlaps} overlaps`);
  ok(r.rowSpread <= 1.5, `${tag}: photographs in a row share one height`, `spread ${r.rowSpread.toFixed(2)}px`);
  ok(r.mainVsSupport > 1.6, `${tag}: the main photographs are given more room than the supporting ones`, `${r.mainVsSupport.toFixed(2)}× the area`);
  ok(r.overflow <= 0, `${tag}: no horizontal overflow`, `${r.overflow}px`);
  if (vw === 1440) {
    ok(r.alts, "every photograph has descriptive alt text");
    ok(r.dupes === 0, "no photograph appears twice on the page");
    ok(!r.words, "no “final edits” note and no group names on the page");
    ok(r.count === String(N), `the count says ${N}`, r.count);
  }
  await p.close();
}

// ------------------------------------------- hover, focus, open, keyboard
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(base + route, { waitUntil: "networkidle" });
  const label = (i) => p.evaluate((i) => +getComputedStyle(document.querySelectorAll(".wl-tile__label")[i]).opacity, i);
  ok((await label(0)) === 0, `${theme}: captions are hidden at rest`);
  await p.locator(".wl-tile").nth(0).hover();
  await settle(p, 500);
  ok((await label(0)) === 1, `${theme}: hovering a photograph shows its caption`);
  // contrast of the label
  const contrast = await p.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/[\d.]+/g).map(Number);
      return m.length >= 3 ? m : null;
    };
    const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const cr = (a, b) => (Math.max(L(a), L(b)) + 0.05) / (Math.min(L(a), L(b)) + 0.05);
    // the label's ground is --surface at 90% over the photograph: test against the surface itself
    const surface = parse(getComputedStyle(document.querySelector(".wl-collection")).getPropertyValue("--surface").trim().replace(/^#(..)(..)(..)$/, (_, r, g, b) => `rgb(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)})`));
    const title = parse(getComputedStyle(document.querySelector(".wl-tile__title")).color);
    const cap = parse(getComputedStyle(document.querySelector(".wl-tile__caption")).color);
    return { title: cr(title, surface), cap: cr(cap, surface) };
  });
  ok(contrast.title >= 7 && contrast.cap >= 4.5, `${theme}: caption label text contrast`, `title ${contrast.title.toFixed(1)}:1, caption ${contrast.cap.toFixed(1)}:1`);

  await p.mouse.move(2, 2);
  await settle(p, 400);
  // keyboard: tab to the first tile
  await p.keyboard.press("Tab"); // skip link
  let guard = 0;
  while (!(await p.evaluate(() => document.activeElement?.classList.contains("wl-tile"))) && guard++ < 30) await p.keyboard.press("Tab");
  ok(guard < 30, `${theme}: the photographs are reachable with Tab`);
  await settle(p, 400);
  ok((await label(0)) === 1, `${theme}: keyboard focus shows the caption too`);
  await p.keyboard.press("Enter");
  await settle(p);
  const st = await p.evaluate(() => ({
    open: document.querySelector("dialog.wl-view").open,
    focus: document.activeElement?.getAttribute("aria-label"),
    locked: document.documentElement.dataset.sheetOpen === "true",
    title: document.querySelector("#wl-view-title")?.textContent,
    lifted: document.querySelectorAll('.wl-tile[data-lifted="true"]').length,
  }));
  ok(st.open && st.focus === "Close", `${theme}: Enter opens the larger view and focuses Close`);
  ok(st.locked, `${theme}: the page behind stops scrolling`);
  ok(st.title === photos[0].title, `${theme}: the view shows the chosen photograph's caption`, st.title);
  ok(st.lifted === 1, `${theme}: the photograph lifts out of the grid (its tile is hidden)`);
  const view = await p.evaluate(() => {
    const f = document.querySelector(".wl-view__frame").getBoundingClientRect();
    const hi = document.querySelector(".wl-view__img");
    return { w: f.width, h: f.height, vw: innerWidth, vh: innerHeight, top: f.top, ratio: f.width / f.height, nat: hi.naturalWidth / hi.naturalHeight, ready: hi.dataset.ready === "true" && hi.complete };
  });
  ok(view.w > 600 && view.ready, `${theme}: the larger view is large and loaded`, `${Math.round(view.w)}×${Math.round(view.h)}`);
  ok(Math.abs(view.ratio - view.nat) / view.nat < 0.005 && view.top >= 0 && view.top + view.h <= view.vh, `${theme}: the larger view shows the entire photograph, on screen`);
  // contrast of the view's caption against the scrim
  const vc = await p.evaluate(() => {
    const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const cr = (a, b) => (Math.max(L(a), L(b)) + 0.05) / (Math.min(L(a), L(b)) + 0.05);
    const px = (c) => c.match(/[\d.]+/g).map(Number).slice(0, 3);
    const bg = getComputedStyle(document.querySelector(".theme-wl")).backgroundColor;
    return { cap: cr(px(getComputedStyle(document.querySelector(".wl-view__caption")).color), px(bg)), count: cr(px(getComputedStyle(document.querySelector(".wl-view__count")).color), px(bg)) };
  });
  ok(vc.cap >= 4.5 && vc.count >= 4.5, `${theme}: the view's caption and counter are readable on the scrim`, `${vc.cap.toFixed(1)}:1, ${vc.count.toFixed(1)}:1`);

  await p.keyboard.press("ArrowRight");
  await settle(p, 600);
  ok((await p.locator("#wl-view-title").textContent()) === photos[1].title, `${theme}: → shows the next photograph`);
  ok((await p.locator(".wl-view__count").textContent()).replace(/\s+/g, "").includes(`2/${N}`) || (await p.locator(".wl-view__count").textContent()).includes("2"), `${theme}: the counter follows`);
  await p.keyboard.press("ArrowLeft");
  await p.keyboard.press("ArrowLeft");
  await settle(p, 600);
  ok((await p.locator("#wl-view-title").textContent()) === photos[N - 1].title, `${theme}: ← from the first wraps to the last`);
  // focus stays inside the dialog
  const inside = [];
  for (let i = 0; i < 5; i++) {
    await p.keyboard.press("Tab");
    inside.push(await p.evaluate(() => !!document.activeElement?.closest("dialog.wl-view") || document.activeElement === document.body));
  }
  ok(inside.every(Boolean), `${theme}: Tab stays within the larger view`);
  await p.keyboard.press("Escape");
  await settle(p);
  const after = await p.evaluate(() => ({
    open: document.querySelector("dialog.wl-view").open,
    focusIdx: [...document.querySelectorAll(".wl-tile")].indexOf(document.activeElement),
    locked: !!document.documentElement.dataset.sheetOpen,
    lifted: document.querySelectorAll('.wl-tile[data-lifted="true"]').length,
  }));
  ok(!after.open && !after.locked && after.lifted === 0, `${theme}: Escape closes, unlocks the page and returns the photograph`);
  ok(after.focusIdx === N - 1, `${theme}: focus returns to the tile of the photograph last shown`, `tile ${after.focusIdx}`);

  // mouse: open, close button
  await p.evaluate(() => scrollTo(0, 0));
  await p.locator(".wl-tile").nth(2).click();
  await settle(p);
  await p.locator(".wl-view__close").click();
  await settle(p);
  ok(!(await p.evaluate(() => document.querySelector("dialog.wl-view").open)), `${theme}: the close button closes`);
  // click on the scrim
  await p.locator(".wl-tile").nth(2).click();
  await settle(p);
  await p.mouse.click(30, 450);
  await settle(p);
  ok(!(await p.evaluate(() => document.querySelector("dialog.wl-view").open)), `${theme}: a click outside the photograph closes`);
  // the shared element lands back on its tile
  const land = await p.evaluate(() => {
    const t = document.querySelectorAll(".wl-tile")[2].getBoundingClientRect();
    return t.width > 0 && getComputedStyle(document.querySelectorAll(".wl-tile")[2]).visibility === "visible";
  });
  ok(land, `${theme}: after closing, the tile is visible in its place`);
  // drag down to dismiss
  await p.locator(".wl-tile").nth(2).click();
  await settle(p);
  const fb = await p.locator(".wl-view__frame").boundingBox();
  await p.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
  await p.mouse.down();
  for (let i = 1; i <= 10; i++) await p.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2 + i * 20);
  const mid = await p.evaluate(() => ({ t: getComputedStyle(document.querySelector(".wl-view__frame")).transform, o: +getComputedStyle(document.querySelector(".wl-view__scrim")).opacity }));
  ok(mid.t !== "none" && mid.o < 1, `${theme}: dragging moves the photograph and thins the scrim`);
  await p.mouse.up();
  await settle(p);
  ok(!(await p.evaluate(() => document.querySelector("dialog.wl-view").open)), `${theme}: dragging down far enough closes`);
  // swipe sideways
  await p.locator(".wl-tile").nth(2).click();
  await settle(p);
  const fb2 = await p.locator(".wl-view__frame").boundingBox();
  await p.mouse.move(fb2.x + fb2.width * 0.7, fb2.y + fb2.height / 2);
  await p.mouse.down();
  for (let i = 1; i <= 8; i++) await p.mouse.move(fb2.x + fb2.width * 0.7 - i * 22, fb2.y + fb2.height / 2 + 3);
  await p.mouse.up();
  await settle(p, 600);
  ok((await p.locator("#wl-view-title").textContent()) === photos[3].title, `${theme}: swiping left shows the next photograph`);
  // a short drag settles back
  const fb3 = await p.locator(".wl-view__frame").boundingBox();
  await p.mouse.move(fb3.x + fb3.width / 2, fb3.y + fb3.height / 2);
  await p.mouse.down();
  await p.mouse.move(fb3.x + fb3.width / 2, fb3.y + fb3.height / 2 + 15);
  await p.mouse.move(fb3.x + fb3.width / 2, fb3.y + fb3.height / 2 + 40, { steps: 4 });
  await p.waitForTimeout(400);
  await p.mouse.up();
  await settle(p, 800);
  ok(await p.evaluate(() => document.querySelector("dialog.wl-view").open && getComputedStyle(document.querySelector(".wl-view__frame")).transform === "none"), `${theme}: a short, slow drag settles back`);
  await p.keyboard.press("Escape");
  await settle(p);
  ok(errs.length === 0, `${theme}: no console errors through all of the above`, errs.join(" | "));
  await ctx.close();
}

// ---------------------------------------------------------- reduced motion
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + route, { waitUntil: "networkidle" });
  await p.locator(".wl-tile").nth(0).click();
  await p.waitForTimeout(30);
  const anims = await p.evaluate(() => {
    const f = document.querySelector(".wl-view__frame");
    return { frame: f.getAnimations().map((a) => a.effect.getKeyframes().map((k) => k.transform ?? "").join("|")), dialog: document.querySelector("dialog.wl-view").getAnimations().length };
  });
  ok(anims.frame.every((k) => !k.includes("scale")) && anims.dialog <= 1, "reduced motion: the view fades in, nothing flies or scales", JSON.stringify(anims));
  await p.waitForTimeout(400);
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(30);
  const slide = await p.evaluate(() => document.querySelector(".wl-view__frame").getAnimations().map((a) => a.effect.getKeyframes().map((k) => k.transform ?? "").join("|")));
  ok(slide.every((k) => !/translateX\((?!0px)/.test(k)), "reduced motion: changing photograph is a crossfade, no slide", JSON.stringify(slide));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  ok(!(await p.evaluate(() => document.querySelector("dialog.wl-view").open)), "reduced motion: Escape closes");
  await p.locator(".wl-tile").nth(0).hover();
  await p.waitForTimeout(100);
  ok((await p.evaluate(() => getComputedStyle(document.querySelector(".wl-tile")).transform)) === "none", "reduced motion: tiles don't lift on hover");
  await ctx.close();
}

// ---------------------------------------------------------- phone, touch
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.goto(base + route, { waitUntil: "networkidle" });
  await p.locator(".wl-tile").nth(1).tap();
  await settle(p);
  const r = await p.evaluate(() => {
    const f = document.querySelector(".wl-view__frame").getBoundingClientRect();
    const cap = document.querySelector(".wl-view__cap").getBoundingClientRect();
    const close = document.querySelector(".wl-view__close").getBoundingClientRect();
    return { open: document.querySelector("dialog.wl-view").open, fw: f.width, capIn: cap.bottom <= innerHeight && cap.top >= f.bottom - 1, close: close.width >= 44 && close.top >= 0, title: document.querySelector("#wl-view-title").textContent, caption: document.querySelector("#wl-view-caption").textContent };
  });
  ok(r.open && r.fw >= 360, "phone: a tap opens the photograph across the screen", `${Math.round(r.fw)}px wide`);
  ok(r.capIn && r.title === photos[1].title && r.caption === photos[1].caption, "phone: the caption shows below the photograph in the larger view");
  ok(r.close, "phone: the close button is a 44px target on screen");
  await p.locator(".wl-view__close").tap();
  await settle(p);
  ok(!(await p.evaluate(() => document.querySelector("dialog.wl-view").open)), "phone: tapping close closes");
  await ctx.close();
}

await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
