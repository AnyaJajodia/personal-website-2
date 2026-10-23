// Watches the avatars move: records Chrome's own screencast (every painted
// frame, via the DevTools protocol) during a fresh reload, the peeker's reveal,
// rapid switching between work cards (pointer and keyboard), fast scrolling
// down and back up, and a resize; saves the frames and frame strips, and
// measures — per animation frame — what the screenshots cannot prove:
//   - the hero avatar is loaded, opaque and unanimated on the first frame
//   - the peeker's clip line never drops below the grid's top edge, and no
//     pixel of hers ever lands on a panel
// Usage: node qa/av-film.mjs [tag] [WxH]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
const [tag = "film", size = "1440x900"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const base = process.env.BASE_URL ?? "http://localhost:3100";
const dir = `qa/screenshots/avatar/film-${tag}-${W}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const cdp = await page.context().newCDPSession(page);
let frames = [];
let recording = null;
cdp.on("Page.screencastFrame", async (f) => {
  if (recording) frames.push({ t: f.metadata.timestamp, data: f.data });
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
const start = async (name) => {
  frames = [];
  recording = name;
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1 });
};
const stop = async () => {
  await cdp.send("Page.stopScreencast");
  const name = recording;
  recording = null;
  const t0 = frames[0]?.t ?? 0;
  frames.forEach((f, i) => writeFileSync(`${dir}/${name}-${String(i).padStart(3, "0")}-${Math.round((f.t - t0) * 1000)}ms.jpg`, Buffer.from(f.data, "base64")));
  return frames.length;
};
const report = {};

// 1. fresh reload: the hero avatar on the very first frames
await page.addInitScript(() => {
  window.__heroFrames = [];
  const tick = () => {
    const img = document.querySelector(".hero__perch img");
    if (img) {
      let op = 1;
      for (let e = img; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
      const anims = document.querySelector(".hero__perch .avatar__body")?.getAnimations({ subtree: true }).length ?? -1;
      window.__heroFrames.push({ t: Math.round(performance.now()), complete: img.complete && img.naturalWidth > 0, op: +op.toFixed(3), anims, transform: getComputedStyle(img.closest(".avatar__body")).transform });
    }
    if (window.__heroFrames.length < 90) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await page.goto("about:blank");
await start("reload");
await page.goto(base + "/", { waitUntil: "load" });
await page.waitForTimeout(1500);
report.reloadFrames = await stop();
const hf = await page.evaluate(() => window.__heroFrames);
report.heroFirstFrame = hf[0];
report.heroAlwaysOpaqueStill = hf.every((f) => f.op === 1 && f.anims === 0 && f.transform === "none");
report.heroLoadedByFrame = hf.findIndex((f) => f.complete);

// helpers
const scrollSteps = async (to, step, wait) => {
  let y = await page.evaluate(() => scrollY);
  while (Math.abs(y - to) > 1) {
    y += Math.sign(to - y) * Math.min(step, Math.abs(to - y));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(wait);
  }
};
// per-frame watch of the peeker against the grid
const watchPeeker = () =>
  page.evaluate(() => {
    window.__peek = { n: 0, worst: -1e9, lean: [] };
    const a = document.querySelector('[data-avatar="peeking"]');
    const grid = document.querySelector(".panels");
    const tick = () => {
      if (!window.__peek) return;
      const box = a.getBoundingClientRect();
      // the clip line: the artwork's base line, in the anchor's (untransformed by entrance/lean) box
      const clipY = box.top + box.height * parseFloat(getComputedStyle(a).getPropertyValue("--base")) - 1; // clip-path sits 1px above it
      const top = Math.min(...[...grid.querySelectorAll(".panel")].map((p) => p.getBoundingClientRect().top));
      window.__peek.worst = Math.max(window.__peek.worst, clipY - top);
      window.__peek.n++;
      window.__peek.lean.push(getComputedStyle(a.querySelector(".avatar__react")).transform);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
const endWatch = () => page.evaluate(() => { const p = window.__peek; window.__peek = null; return { frames: p.n, worstClipBelowGridTop: +p.worst.toFixed(2), leanStates: [...new Set(p.lean)].length }; });

// 2. the peeker's reveal, scrolling in slowly
const gridTop = await page.evaluate(() => document.querySelector(".panels").getBoundingClientRect().top + scrollY);
await scrollSteps(gridTop - H * 1.05, 120, 16);
await watchPeeker();
await start("peek-reveal");
await scrollSteps(gridTop - H * 0.62, 18, 16);
await page.waitForTimeout(1100);
report.peekRevealFrames = await stop();
report.peekReveal = await endWatch();

// pixel proof: the strip just under the grid's top edge, around her, with and without her
const strip = await page.evaluate(() => {
  const a = document.querySelector('[data-avatar="peeking"]').getBoundingClientRect();
  const top = document.querySelector(".panels").getBoundingClientRect().top;
  return { x: Math.round(a.left - 30), y: Math.round(top), width: Math.round(a.width + 60), height: 36 };
});
const shotStrip = (name) => page.screenshot({ path: `${dir}/${name}.png`, clip: strip });

// 3. rapid switching between cards by pointer, then leaving; then keyboard
const centers = await page.evaluate(() => [...document.querySelectorAll(".panel")].map((p) => { const r = p.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }));
await watchPeeker();
await start("cards");
for (const [x, y] of [...centers, ...centers.slice().reverse()]) {
  await page.mouse.move(x, y, { steps: 3 });
  await page.waitForTimeout(110);
}
await page.mouse.move(centers[0][0], centers[0][1], { steps: 2 });
await page.waitForTimeout(500);
await page.mouse.move(5, H - 5, { steps: 4 }); // leave the grid
await page.waitForTimeout(700);
report.cardFrames = await stop();
report.cards = await endWatch();
report.neutralAfterLeave = await page.evaluate(() => getComputedStyle(document.querySelector('[data-avatar="peeking"] .avatar__react')).transform);
// keyboard: tab through the card links
await page.evaluate(() => document.querySelector(".panel a")?.focus());
await watchPeeker();
await start("keys");
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(260);
}
await page.waitForTimeout(400);
report.keyFrames = await stop();
report.keys = await endWatch();
// hovered + open card: her strip is still identical with and without her
await page.mouse.move(centers[3][0], centers[3][1], { steps: 2 });
await page.waitForTimeout(700);
await shotStrip("strip-hover-with");
await page.addStyleTag({ content: '[data-avatar="peeking"]{visibility:hidden!important}' });
await shotStrip("strip-hover-without");
await page.evaluate(() => document.querySelectorAll("style").forEach((s) => s.textContent.includes('peeking"]{visibility') && s.remove()));
await page.mouse.move(5, H - 5);
await page.evaluate(() => document.activeElement?.blur());

// 4. fast scroll to the end and straight back up
await start("fast");
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
await scrollSteps(max, 260, 16);
await page.waitForTimeout(600);
await scrollSteps(0, 320, 16);
await page.waitForTimeout(400);
report.fastFrames = await stop();
report.afterFast = await page.evaluate(() => [...document.querySelectorAll("[data-avatar]")].filter((e) => e.offsetParent).map((e) => `${e.dataset.avatar}:${e.dataset.in ?? "static"}`).join(" "));

// 5. resize mid-page: figures follow the reflow, the line rebuilds under them
await page.evaluate((y) => window.scrollTo(0, y), Math.round(gridTop - H * 0.5));
await page.setViewportSize({ width: Math.round(W * 0.8), height: H });
await page.waitForTimeout(700);
await page.screenshot({ path: `${dir}/resize-narrower.png` });
await page.setViewportSize({ width: W, height: H });
await page.waitForTimeout(700);
await page.screenshot({ path: `${dir}/resize-back.png` });

console.log(JSON.stringify(report, null, 1));
await browser.close();
