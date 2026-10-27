// The Crackd.ai walkthroughs, in Chrome.
//   every application's tour: opens from "View walkthrough" (and from each named
//     screen), as one labelled modal dialog with the application name, step
//     title, subtitle, the prepared screenshot and the step count; every step's
//     image loads (prepared WebP copies only, never the originals) at its own
//     proportions; titles and subtitles match walkthroughs.json
//   controls: Previous / Next (disabled at the ends), named steps, ←/→, Enlarge
//     (same dialog, scrollable, larger copy) and Fit; Escape leaves the enlarged
//     view first, then closes; Tab is trapped; focus returns to the opener;
//     the backdrop closes it; the page behind doesn't move
//   layout: large on desktop, full screen on phones, controls stay in place
//     from step to step, nothing overflows; both themes; reduced motion
//   sequence accuracy: the "selected screens" note is shown in every tour
// Usage: BASE_URL=... node qa/crackd-tour.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const url = base + "/work/crackd-ai";
const out = "qa/screenshots/crackd-tour";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const json = JSON.parse(readFileSync("handoff/assets/crackd-source/walkthroughs.json", "utf8"));
const flat = (o) => (Array.isArray(o) ? o : Object.values(o).flatMap((v) => (Array.isArray(v) ? v : v?.steps ?? v?.screens ?? [])));
const supplied = flat(json).map((x) => [x.title, x.subtitle ?? x.caption ?? x.description]);
const apps = [
  ["user-application", "User application", 6],
  ["admin-application", "Admin application", 5],
  ["llm-chaining-matrix", "LLM chaining matrix", 5],
];

const browser = await chromium.launch({ channel: "chrome" });
const state = (page) =>
  page.evaluate(() => {
    const d = document.querySelector("dialog.ck-tour");
    const img = d.querySelector(".ck-tour__img");
    const r = (sel) => {
      const b = d.querySelector(sel)?.getBoundingClientRect();
      return b ? [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)] : null;
    };
    return {
      open: d.open,
      modal: d.matches(":modal"),
      label: document.getElementById(d.getAttribute("aria-labelledby"))?.textContent.trim(),
      title: d.querySelector(".ck-tour__title")?.childNodes[1]?.textContent.trim(),
      count: d.querySelector(".ck-tour__count")?.textContent.replace(/\s+/g, ""),
      sub: d.querySelector(".ck-tour__sub")?.textContent.trim(),
      note: d.querySelector(".ck-tour__note")?.textContent.trim(),
      src: img?.currentSrc,
      alt: img?.alt,
      loaded: !!img && img.complete && img.naturalWidth > 0,
      ratio: img ? [img.naturalWidth / img.naturalHeight, img.clientWidth / img.clientHeight, +img.getAttribute("width") / +img.getAttribute("height")] : null,
      prevDisabled: d.querySelector(".ck-tour__btn:not(.ck-tour__btn--next)")?.disabled,
      nextDisabled: d.querySelector(".ck-tour__btn--next")?.disabled,
      current: [...d.querySelectorAll('.ck-tour__step[aria-current="step"]')].length,
      zoom: d.querySelector(".ck-tour__panel")?.dataset.zoom === "true",
      pressed: d.querySelector(".ck-tour__zoom")?.getAttribute("aria-pressed"),
      focus: document.activeElement?.className,
      inDialog: !!document.activeElement?.closest("dialog.ck-tour"),
      dialog: r(".ck-tour__panel"),
      foot: r(".ck-tour__foot"),
      next: r(".ck-tour__btn--next"),
      stage: r(".ck-tour__stage"),
      imgBox: r(".ck-tour__img"),
      overflowX: d.scrollWidth > d.clientWidth + 1,
      locked: getComputedStyle(document.documentElement).overflow === "hidden",
      y: scrollY,
      vw: innerWidth,
      vh: innerHeight,
    };
  });

/* --------------------------------------------- every tour, every step */
for (const [vp, theme] of [
  [{ width: 1440, height: 900 }, "light"],
  [{ width: 1440, height: 900 }, "dark"],
  [{ width: 1024, height: 768 }, "light"],
  [{ width: 390, height: 844 }, "light"],
  [{ width: 390, height: 844 }, "dark"],
  [{ width: 360, height: 640 }, "dark"],
]) {
  const tag = `${vp.width}-${theme}`;
  const ctx = await browser.newContext({ viewport: vp, colorScheme: theme, isMobile: vp.width < 700, hasTouch: vp.width < 700 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const requested = [];
  page.on("request", (r) => r.url().includes("/assets/crackd") && requested.push(r.url()));
  await page.goto(url, { waitUntil: "networkidle" });
  ok(`${tag}: no walkthrough image is fetched before a tour opens`, requested.length === 0, requested.slice(0, 3).join(" "));

  for (const [id, name, n] of apps) {
    const btn = page.locator(`#${id} .ck-tour-btn`);
    await btn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    const y0 = await page.evaluate(() => scrollY);
    await btn.click();
    await page.waitForTimeout(450);
    let s = await state(page);
    ok(`${tag} ${id}: opens as a modal labelled with the application, at step 1 of ${n}, focus inside`, s.open && s.modal && s.label.startsWith(name) && s.count === `1/${n}` && s.inDialog && s.locked && s.prevDisabled && !s.nextDisabled, JSON.stringify({ label: s.label, count: s.count, focus: s.focus }));
    ok(`${tag} ${id}: the "selected screens, not one session" note is shown`, /not one continuous session/.test(s.note ?? ""));
    const foot0 = s.foot;
    const steps = [];
    for (let k = 0; k < n; k++) {
      if (k) {
        await page.click(".ck-tour__btn--next");
        await page.waitForTimeout(250);
      }
      await page.waitForFunction(() => {
        const i = document.querySelector(".ck-tour__img");
        return i && i.complete && i.naturalWidth > 0;
      });
      s = await state(page);
      steps.push(s);
      if (vp.width === 1440 || vp.width === 390) await page.screenshot({ path: `${out}/${tag}-${id}-${k + 1}.png` });
    }
    const bad = steps.filter((x, k) => !x.loaded || x.count !== `${k + 1}/${n}` || x.current !== 1 || !x.alt || Math.abs(x.ratio[0] - x.ratio[1]) > 0.02 || Math.abs(x.ratio[0] - x.ratio[2]) > 0.02 || !/\/assets\/crackd\/.+\.webp$/.test(x.src));
    ok(`${tag} ${id}: all ${n} steps — image loaded (prepared WebP), alt text, proportions kept, count and current step right`, bad.length === 0, JSON.stringify(bad.map((b) => [b.count, b.loaded, b.ratio, b.src])));
    const unmatched = steps.filter((x) => !supplied.some(([t, sub]) => t === x.title && (!sub || x.sub.startsWith(sub))));
    ok(`${tag} ${id}: every title and subtitle is the supplied one`, unmatched.length === 0, JSON.stringify(unmatched.map((u) => [u.title, u.sub])));
    const fits = steps.every((x) => x.imgBox[0] >= x.stage[0] - 1 && x.imgBox[1] >= x.stage[1] - 1 && x.imgBox[0] + x.imgBox[2] <= x.stage[0] + x.stage[2] + 1 && x.imgBox[1] + x.imgBox[3] <= x.stage[1] + x.stage[3] + 1);
    ok(`${tag} ${id}: each screenshot fits its stage whole; no horizontal overflow`, fits && steps.every((x) => !x.overflowX));
    ok(`${tag} ${id}: the controls stay in place from step to step`, steps.every((x) => JSON.stringify(x.foot) === JSON.stringify(foot0)), JSON.stringify(steps.map((x) => x.foot)));
    ok(`${tag} ${id}: Next is disabled on the last step`, steps.at(-1).nextDisabled && !steps.at(-1).prevDisabled);
    const big = vp.width >= 1000 ? s.dialog[2] >= vp.width * 0.88 && s.dialog[3] >= vp.height * 0.85 : s.dialog[2] === vp.width && s.dialog[3] === vp.height && s.dialog[0] === 0 && s.dialog[1] === 0;
    ok(`${tag} ${id}: ${vp.width < 600 ? "full screen" : "large"}; Next reachable on screen, ≥44px`, big && s.next[1] + s.next[3] <= vp.height && s.next[3] >= 44, JSON.stringify({ dialog: s.dialog, next: s.next }));

    if (id === apps[0][0]) {
      // keyboard: ← / →, named steps, Enlarge, Escape twice, Tab trap
      await page.locator(".ck-tour__panel").focus().catch(() => {});
      await page.focus(".ck-tour__btn:not(.ck-tour__btn--next)");
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(150);
      const left = (await state(page)).count;
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(150);
      const right = (await state(page)).count;
      ok(`${tag}: ← / → move between steps (and stop at the end)`, left === `${n - 1}/${n}` && right === `${n}/${n}`, `${left} ${right}`);
      await page.locator(".ck-tour__step").nth(1).click();
      await page.waitForTimeout(200);
      ok(`${tag}: a named step jumps there`, (await state(page)).count === `2/${n}`);
      await page.click(".ck-tour__zoom");
      await page.waitForTimeout(300);
      await page.waitForFunction(() => document.querySelector(".ck-tour__img").currentSrc.includes("-2048"));
      s = await state(page);
      const scrollable = await page.evaluate(() => {
        const st = document.querySelector(".ck-tour__stage");
        return st.scrollWidth > st.clientWidth && getComputedStyle(st).overflow === "auto";
      });
      ok(`${tag}: Enlarge shows the 2048px copy in the same dialog, scrollable, pressed state reported`, s.zoom && s.pressed === "true" && s.imgBox[2] > s.stage[2] && scrollable && (await page.$$eval("dialog[open]", (d) => d.length)) === 1, JSON.stringify({ img: s.imgBox, stage: s.stage }));
      if (vp.width === 1440 || vp.width === 390) await page.screenshot({ path: `${out}/${tag}-zoom.png` });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      s = await state(page);
      ok(`${tag}: Escape first leaves the enlarged view, keeping the dialog open`, s.open && !s.zoom);
      let escaped = 0;
      for (let k = 0; k < 24; k++) {
        await page.keyboard.press("Tab");
        if (!(await page.evaluate(() => !!document.activeElement?.closest("dialog.ck-tour")))) escaped++;
      }
      for (let k = 0; k < 24; k++) {
        await page.keyboard.press("Shift+Tab");
        if (!(await page.evaluate(() => !!document.activeElement?.closest("dialog.ck-tour")))) escaped++;
      }
      ok(`${tag}: focus is trapped (Tab and Shift+Tab wrap)`, escaped === 0, `${escaped} escapes`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      s = await state(page);
      const back = await page.evaluate(() => document.activeElement?.classList.contains("ck-tour-btn") && !!document.activeElement.closest("#user-application"));
      ok(`${tag}: Escape then closes; focus returns to its button; the page is unlocked where it was`, !s.open && back && !s.locked && Math.abs(s.y - y0) < 2, JSON.stringify({ focus: s.focus, y: s.y, y0 }));
    } else {
      // a named screen on the page opens the tour at that screen; the backdrop closes it
      await page.locator("dialog.ck-tour .ck-tour__close").click();
      await page.waitForTimeout(250);
      const closeBack = await page.evaluate((id) => document.activeElement?.classList.contains("ck-tour-btn") && !!document.activeElement.closest(`#${id}`), id);
      ok(`${tag} ${id}: the close button closes it and returns focus`, !(await state(page)).open && closeBack);
      const screen = page.locator(`#${id} .ck-screen`).nth(2);
      await screen.scrollIntoViewIfNeeded();
      await screen.click();
      await page.waitForTimeout(450);
      s = await state(page);
      ok(`${tag} ${id}: a named screen on the page opens the tour at that screen`, s.open && s.count === `3/${n}`, s.count);
      if (vp.width >= 1000) {
        await page.mouse.click(8, 8);
        await page.waitForTimeout(300);
        ok(`${tag} ${id}: a click on the backdrop closes it, focus back on the screen's name`, !(await state(page)).open && (await page.evaluate(() => document.activeElement?.classList.contains("ck-screen"))));
      } else {
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
      }
    }
  }
  const crackdReqs = [...new Set(requested)];
  ok(`${tag}: only prepared copies are requested (no originals, nothing from handoff/)`, crackdReqs.every((u) => /\/assets\/crackd\/(user-app|admin-app|matrix)\/[\w-]+-(1280|2048)\.webp$/.test(u)), crackdReqs.filter((u) => !/\.webp$/.test(u)).join(" "));
  ok(`${tag}: no console errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}

/* ------------------------------------------------------ reduced motion */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#admin-application .ck-tour-btn").click();
  await page.waitForTimeout(50);
  const a1 = await page.evaluate(() => document.querySelector("dialog.ck-tour").getAnimations({ subtree: true }).length);
  await page.click(".ck-tour__btn--next");
  await page.waitForTimeout(50);
  const a2 = await page.evaluate(() => document.querySelector("dialog.ck-tour").getAnimations({ subtree: true }).length);
  ok("reduced motion: the dialog and each new screen appear without animation", a1 === 0 && a2 === 0, `${a1} ${a2}`);
  await page.keyboard.press("Escape");
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#admin-application .ck-tour-btn").click();
  await page.waitForTimeout(20);
  const anim = await page.evaluate(() => document.querySelector("dialog.ck-tour").getAnimations().map((a) => a.effect.getTiming().duration));
  ok("motion: a restrained rise (≤ 350ms), no autoplay (the step stays put)", anim.length > 0 && anim.every((d) => d <= 350), JSON.stringify(anim));
  await page.waitForTimeout(3000);
  ok("no autoplay: still on step 1 after 3s", (await state(page)).count === "1/5");
  await ctx.close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} walkthrough checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
