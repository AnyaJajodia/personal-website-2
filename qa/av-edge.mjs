// The right-edge peeker, measured and filmed in Chrome:
//  - when she enters and settles, against when the cards become readable
//    (the grid's top passing 80% of the viewport height)
//  - per frame through rapid card switching (pointer, then keyboard): her
//    nearest pixel column to the cards never comes within the gap, and her
//    lean changes direction with the active card, neutral on leaving
//  - peekaboo by click and by keyboard: duck → check → out
//  - she scrolls away with the section; no horizontal overflow
// Saves a frame strip of the entrance, the lean and the peekaboo.
// Usage: node qa/av-edge.mjs [WxH]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
const [size = "1440x900"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const dir = `qa/screenshots/avatar/edge-${W}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
const out = {};
const gridTop = await page.evaluate(() => document.querySelector(".panels").getBoundingClientRect().top + scrollY);
// watch, per animation frame: entrance state, her visible rect vs the cards, the lean
await page.evaluate(() => {
  const fig = document.querySelector('[data-avatar="edge"]');
  const lane = document.querySelector(".edge-lane");
  window.__e = { log: [], minGap: 1e9, lean: [] };
  const tick = () => {
    const e = window.__e;
    if (!e) return;
    const f = fig.querySelector(".avatar__img").getBoundingClientRect();
    const l = lane.getBoundingClientRect();
    const cards = Math.max(...[...document.querySelectorAll(".panel")].map((p) => p.getBoundingClientRect().right));
    // what can paint is her image clipped by the lane
    const left = Math.max(f.left, l.left);
    if (f.width && f.bottom > 0 && f.top < innerHeight) e.minGap = Math.min(e.minGap, left - cards);
    e.log.push([performance.now(), scrollY, fig.dataset.in ?? "-", getComputedStyle(fig.querySelector(".avatar__body")).transform]);
    e.lean.push(getComputedStyle(fig.querySelector(".avatar__react")).transform);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
// scroll in like a reader, filming her side of the screen
const shot = (name) => page.screenshot({ path: `${dir}/${name}.png`, clip: { x: W * 0.55, y: 0, width: W * 0.45, height: H } });
let y = Math.max(0, Math.round(gridTop - H * 1.3));
await page.evaluate((v) => scrollTo(0, v), y);
await page.waitForTimeout(300);
let n = 0;
const readableAt = Math.round(gridTop - H * 0.8);
while (y < gridTop - H * 0.35) {
  y += 14;
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(16);
  if (n < 24 && (await page.evaluate(() => !!document.querySelector('[data-avatar="edge"]').dataset.in)) && n % 1 === 0) await shot(`enter-${String(n++).padStart(2, "0")}`);
}
await page.waitForTimeout(900);
const log = await page.evaluate(() => window.__e.log);
const firstIn = log.find((l) => l[2] !== "-");
const settled = log.find((l, i) => i > 0 && l[2] !== "-" && l[2] !== "queued" && l[3] === "none" && log[i - 1][3] !== "none");
out.entersAtScroll = firstIn?.[1];
out.settledAtScroll = settled?.[1] ?? (log.at(-1)[3] === "none" ? "settled" : "not settled");
out.cardsReadableAtScroll = readableAt;
// rapid card switching
const centers = await page.$$eval(".panel", (ps) => ps.map((p) => { const r = p.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }));
await page.evaluate(() => (window.__e.lean = []));
let k = 0;
for (const [x, yy] of [...centers, ...centers.slice().reverse()]) {
  await page.mouse.move(x, yy, { steps: 3 });
  await page.waitForTimeout(120);
  if (k % 3 === 0) await shot(`lean-${String(k).padStart(2, "0")}`);
  k++;
}
await page.mouse.move(centers[0][0], centers[0][1]);
await page.waitForTimeout(700);
const leanFar = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
await shot("lean-far");
await page.mouse.move(centers[3][0], centers[3][1]);
await page.waitForTimeout(700);
const leanNear = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
await page.mouse.move(W * 0.3, gridTop - (await page.evaluate(() => scrollY)) - 160);
await page.waitForTimeout(800);
out.leanFar = leanFar;
out.leanNear = leanNear;
out.neutralAfterLeave = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
await page.evaluate(() => document.querySelectorAll(".panel a")[5].focus());
await page.waitForTimeout(700);
out.keyboardLean = await page.$eval('[data-avatar="edge"] .avatar__react', (e) => getComputedStyle(e).transform);
await page.evaluate(() => document.activeElement.blur());
out.leanStates = await page.evaluate(() => new Set(window.__e.lean).size);
// peekaboo: click
const peek = () => page.$eval('[data-avatar="edge"]', (e) => e.dataset.peek ?? "out");
const seq = [];
await page.click(".edge-lane__hit");
for (let i = 0; i < 9; i++) {
  seq.push(await peek());
  if (i % 2 === 0) await shot(`peek-${i}`);
  await page.waitForTimeout(230);
}
out.peekabooClick = [...new Set(seq)].join("→");
// peekaboo: keyboard
await page.focus(".edge-lane__hit");
await page.keyboard.press("Enter");
await page.waitForTimeout(120);
out.peekabooKey = await peek();
await page.waitForTimeout(2000);
out.minGapToCardsPx = +(await page.evaluate(() => window.__e.minGap)).toFixed(1);
// leaves with the section
const end = await page.evaluate(() => document.querySelector(".selected").getBoundingClientRect().bottom + scrollY);
await page.evaluate((v) => scrollTo(0, v), Math.round(end + 10));
await page.waitForTimeout(300);
out.goneAfterSection = await page.evaluate(() => document.querySelector('[data-avatar="edge"]').getBoundingClientRect().bottom <= document.querySelector(".site-header").getBoundingClientRect().bottom + 1);
out.overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
out.errors = errors;
console.log(size, JSON.stringify(out));
await page.evaluate(() => (window.__e = null));
await browser.close();
