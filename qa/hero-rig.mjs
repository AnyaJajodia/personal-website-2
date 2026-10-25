// The layered hero rig, in Chrome: first-frame visibility and reserved box,
// the entry swing after the line reaches the seat, hover / focus / tap
// gestures, repeat inputs not stacking, offscreen / hidden stopping, reduced
// motion, and frames of the joints at maximum rotation in both themes.
// Usage: BASE_URL=... node qa/hero-rig.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = "qa/screenshots/avatar/rig";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const browser = await chromium.launch({ channel: "chrome" });
const rigAnims = (page) =>
  page.evaluate(() => [...document.querySelectorAll(".hero-rig__layer")].flatMap((l) => l.getAnimations().map((a) => `${l.dataset.part}:${a.playState}`)));

/* first frame, entry timing */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.addInitScript(() => {
    window.__f = [];
    const t0 = performance.now();
    const tick = () => {
      const imgs = [...document.querySelectorAll(".hero-rig__layer img")];
      if (imgs.length) {
        const box = document.querySelector(".hero-rig").getBoundingClientRect();
        let op = 1;
        for (let e = imgs[0]; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
        window.__f.push({ t: Math.round(performance.now() - t0), n: imgs.length, loaded: imgs.every((i) => i.complete && i.naturalWidth), op, w: Math.round(box.width), h: Math.round(box.height), swing: !!document.querySelector(".hero-rig[data-swinging]"), reached: !!document.querySelector(".hero-rig[data-line-reached]"), drawn: document.querySelector("[data-testid=scribble]")?.dataset.drawn });
      }
      if (window.__f.length < 200) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(3200);
  const f = await page.evaluate(() => window.__f);
  const first = f[0];
  ok("hero rig: all four layers present and opaque on the first painted frame; box reserved", first.n === 4 && first.op === 1 && first.w > 300 && first.h > 300, JSON.stringify(first));
  ok("hero rig: layers decoded by the first frames (preloaded)", f.slice(0, 3).some((x) => x.loaded), `loaded at frame ${f.findIndex((x) => x.loaded)}`);
  const sizeStable = f.every((x) => x.w === first.w && x.h === first.h);
  ok("hero rig: no layout shift of the figure during load", sizeStable);
  const reachedAt = f.findIndex((x) => x.reached);
  const swingAt = f.findIndex((x) => x.swing);
  ok("hero rig: entry — the line grows to the seat, then one swing", reachedAt > 0 && swingAt >= reachedAt && f[reachedAt].t > 300, `line reached seat at ${f[reachedAt]?.t}ms, swing at ${f[swingAt]?.t}ms`);
  const swings = f.reduce((n, x, i) => n + (x.swing && !(f[i - 1]?.swing) ? 1 : 0), 0);
  ok("hero rig: the entry plays exactly once; no idle loop afterwards", swings === 1 && (await rigAnims(page)).length === 0, `${swings} swing(s)`);
  ok("hero rig: no console errors", errors.length === 0, errors.join(" | "));

  // hover / repeats / cheers / focus
  const legs = await (await page.$(".hero-rig__target--legs")).boundingBox();
  await page.mouse.move(legs.x + legs.width * 0.5, legs.y + legs.height * 0.75);
  await page.waitForTimeout(120);
  const a1 = await rigAnims(page);
  // repeated inputs while playing: leave and re-enter, click twice, focus
  await page.mouse.move(5, 5);
  await page.mouse.move(legs.x + legs.width * 0.5, legs.y + legs.height * 0.75);
  await page.mouse.click(legs.x + legs.width * 0.5, legs.y + legs.height * 0.75);
  await page.mouse.click(legs.x + legs.width * 0.5, legs.y + legs.height * 0.75);
  const a2 = await rigAnims(page);
  ok("hero rig: hover swings both lower legs (and nothing else)", a1.length === 2 && a1.every((x) => x.startsWith("leg-")), a1.join(" "));
  ok("hero rig: repeated inputs while swinging don't stack or queue", a2.length === 2, a2.join(" "));
  await page.waitForTimeout(1700);
  ok("hero rig: the swing settles completely", (await rigAnims(page)).length === 0 && (await page.$$eval(".hero-rig__layer", (ls) => ls.every((l) => getComputedStyle(l).transform === "none"))));
  const cup = await (await page.$(".hero-rig__target--cup")).boundingBox();
  await page.mouse.move(5, 5);
  await page.waitForTimeout(100);
  await page.mouse.move(cup.x + cup.width / 2, cup.y + cup.height / 2);
  await page.waitForTimeout(150);
  const c1 = await rigAnims(page);
  await page.mouse.click(cup.x + cup.width / 2, cup.y + cup.height / 2);
  const c2 = await rigAnims(page);
  ok("hero rig: the cup raises the forearm only; repeats ignored", c1.length >= 1 && c1.some((x) => x.startsWith("forearm")) && c2.filter((x) => x.startsWith("forearm")).length === 1, `${c1.join(" ")} | ${c2.join(" ")}`);
  ok("hero rig: cup target ≥44px and labelled", cup.width >= 44 && cup.height >= 44 && !!(await page.$eval(".hero-rig__target--cup", (b) => b.getAttribute("aria-label"))));
  await page.waitForTimeout(1600);
  // keyboard focus
  await page.mouse.move(5, 5);
  await page.evaluate(() => document.querySelector(".skip-link")?.focus());
  let n = 0;
  while (n++ < 25 && !(await page.evaluate(() => document.activeElement?.classList.contains("hero-rig__target--legs")))) await page.keyboard.press("Tab");
  await page.waitForTimeout(100);
  const kf = await rigAnims(page);
  const ring = await page.$eval(".hero-rig__target--legs", (b) => getComputedStyle(b).outlineStyle);
  ok("hero rig: keyboard focus on her swings the feet, with a visible focus ring", kf.length === 2 && ring !== "none", `${kf.join(" ")} outline ${ring}`);
  await page.waitForTimeout(1600);
  await page.keyboard.press("Tab");
  await page.waitForTimeout(100);
  const kc = await rigAnims(page);
  ok("hero rig: keyboard focus on the cup raises it", kc.some((x) => x.startsWith("forearm")), kc.join(" "));
  await page.waitForTimeout(1600);
  // offscreen stops a gesture
  await page.mouse.move(legs.x + legs.width * 0.5, legs.y + legs.height * 0.75);
  await page.waitForTimeout(80);
  await page.evaluate(() => scrollTo(0, 2400));
  await page.waitForTimeout(300);
  ok("hero rig: scrolling her out of view stops a gesture", (await rigAnims(page)).length === 0);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);

  // joints at maximum rotation, both themes
  for (const theme of ["light", "dark"]) {
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t;
    }, theme);
    const clip = await page.$eval(".hero-rig", (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: Math.max(0, r.top), width: r.width, height: r.height }; });
    const pose = async (name, transforms) => {
      await page.evaluate((tf) => document.querySelectorAll(".hero-rig__layer").forEach((l) => (l.style.transform = tf[l.dataset.part] ?? "")), transforms);
      await page.screenshot({ path: `${out}-${theme}-${name}.png`, clip });
    };
    await pose("rest", {});
    await pose("swing-a", { "leg-viewer-left": "rotate(-2.5deg)", "leg-viewer-right": "rotate(2deg)" });
    await pose("swing-b", { "leg-viewer-left": "rotate(2deg)", "leg-viewer-right": "rotate(-1.7deg)" });
    await pose("cheers", { "forearm-matcha": "rotate(-7deg)" });
    await pose("cheers-limit", { "forearm-matcha": "rotate(-9deg)" });
    await page.evaluate(() => document.querySelectorAll(".hero-rig__layer").forEach((l) => (l.style.transform = "")));
  }
  await ctx.close();
}

/* touch: a tap on her swings, a tap on the cup cheers */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(3000);
  await page.tap(".hero-rig__target--legs");
  await page.waitForTimeout(100);
  const a = await rigAnims(page);
  await page.waitForTimeout(1600);
  await page.tap(".hero-rig__target--cup");
  await page.waitForTimeout(100);
  const b = await rigAnims(page);
  const sz = await page.$eval(".hero-rig__target--cup", (e) => [e.offsetWidth, e.offsetHeight]);
  ok("hero rig (touch): tap her → swing; tap the cup → cheers (≥44px target)", a.length === 2 && b.some((x) => x.startsWith("forearm")) && sz.every((v) => v >= 44), `${a.join(" ")} | ${b.join(" ")} | cup ${sz}`);
  await ctx.close();
}

/* reduced motion */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const legs = await (await page.$(".hero-rig__target--legs")).boundingBox();
  await page.mouse.move(legs.x + legs.width / 2, legs.y + legs.height / 2);
  await page.mouse.click(legs.x + legs.width / 2, legs.y + legs.height / 2);
  await page.focus(".hero-rig__target--cup");
  await page.waitForTimeout(150);
  const st = await page.evaluate(() => ({ imgs: [...document.querySelectorAll(".hero-rig__layer img")].filter((i) => i.complete && i.naturalWidth).length, targets: document.querySelectorAll(".hero-rig__target").length }));
  ok("hero rig (reduced motion): resting pose, working targets, nothing moves", (await rigAnims(page)).length === 0 && st.imgs === 4 && st.targets === 2, JSON.stringify(st));
  await ctx.close();
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} hero rig checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
