// Line-visibility audit: scrolls the homepage slowly forward then back and, at
// every position, measures how much of the DRAWN line lies inside the visible
// viewport (below the fixed header, inside safe side margins). Also reports
// drawn line that crosses text/content boxes, and where the pen tip sits.
// Usage: node qa/visible.mjs <WxH> [step] [--reduced]
import { chromium } from "playwright";
const args = process.argv.slice(2);
const reduced = args.includes("--reduced");
const [size = "1440x900", stepArg = "40"] = args.filter((a) => !a.startsWith("--"));
const [width, height] = size.split("x").map(Number);
const step = Number(stepArg);
const SAFE = 6; // px from either viewport edge
const MIN_VISIBLE = 40; // px of drawn line that must be on screen

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? "reduce" : "no-preference" });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);

// sample the full path once, in document coordinates
await page.evaluate(() => {
  const p = document.querySelector("[data-testid=scribble] .scribble__path");
  const L = p.getTotalLength();
  const svgTop = p.ownerSVGElement.getBoundingClientRect().top + scrollY;
  const pts = [];
  for (let l = 0; l <= L; l += 3) {
    const q = p.getPointAtLength(l);
    pts.push([l, q.x, q.y + svgTop]);
  }
  window.__pts = pts;
  window.__L = L;
});

const read = () =>
  page.evaluate(
    ({ SAFE }) => {
      const p = document.querySelector("[data-testid=scribble] .scribble__path");
      const L = window.__L;
      const off = parseFloat(p.style.strokeDashoffset || "0");
      const drawn = Math.max(0, L - off);
      const header = document.querySelector(".site-header");
      const hb = header.getBoundingClientRect().bottom;
      const settled = header.dataset.settled === "true";
      const top = scrollY + (settled ? hb : 0);
      const bottom = scrollY + innerHeight;
      const vw = document.documentElement.clientWidth;
      let vis = 0;
      let prev = null;
      for (const [l, x, y] of window.__pts) {
        if (l > drawn) break;
        const inside = x >= SAFE && x <= vw - SAFE && y >= top && y <= bottom;
        if (inside && prev) vis += Math.hypot(x - prev[0], y - prev[1]);
        prev = inside ? [x, y] : null;
      }
      const tip = p.getPointAtLength(drawn);
      const svgTop = p.ownerSVGElement.getBoundingClientRect().top;
      return { drawn: +(drawn / L).toFixed(4), vis: Math.round(vis), tipX: Math.round(tip.x), tipY: Math.round(svgTop + tip.y) };
    },
    { SAFE },
  );

const schedOf = () => page.evaluate(() => document.querySelector("[data-testid=scribble]").dataset.schedule + " | " + document.documentElement.scrollHeight);
const schedStart = await schedOf();
const fwd = [];
for (let s = 0; s <= max + step; s += step) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.min(s, max));
  // wait for two rendered frames (not a fixed delay: the frame rate varies)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  fwd.push({ s: Math.min(s, max), ...(await read()) });
}
const back = [];
for (let i = fwd.length - 1; i >= 0; i--) {
  await page.evaluate((y) => window.scrollTo(0, y), fwd[i].s);
  // wait for two rendered frames (not a fixed delay: the frame rate varies)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  back.push({ s: fwd[i].s, ...(await read()) });
}
back.reverse();

// content collisions: drawn path points inside actual TEXT line boxes (Range
// rects, so empty space beside a heading is not counted) or inside images /
// cards / controls. Deliberate contacts are listed separately: the start in
// the name, the trajectory, and the underline under "Say hello.".
const collisions = await page.evaluate(() => {
  const boxes = [];
  const add = (name, r) => boxes.push({ name, l: r.left, r: r.right, t: r.top + scrollY, b: r.bottom + scrollY });
  const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (el.closest(".visually-hidden, [aria-hidden=true], .hero__name, .trajectory")) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const tag = (el.closest("[class]")?.className.toString().split(" ")[0]) || el.tagName;
    // text in a collapsed (transparent) panel column is not on screen
    if (el.closest(".panel__more") && getComputedStyle(el.closest(".panel__more")).opacity === "0") continue;
    const clip = el.closest(".panel, .feature, .bento__card")?.getBoundingClientRect();
    for (const r0 of range.getClientRects()) {
      const r = clip ? { left: Math.max(r0.left, clip.left), right: Math.min(r0.right, clip.right), top: Math.max(r0.top, clip.top), bottom: Math.min(r0.bottom, clip.bottom) } : r0;
      if (r.right > r.left && r.bottom > r.top) add("text:" + tag, r);
    }
  }
  for (const el of document.querySelectorAll("main img, .feature__visual, .panel, .bento__card, .site-nav a, .contact__email, .hero__cue")) add("box:" + el.className.toString().split(" ")[0], el.getBoundingClientRect());
  const hits = {};
  for (const [, x, y] of window.__pts) {
    for (const b of boxes) {
      if (x > b.l + 1 && x < b.r - 1 && y > b.t + 1 && y < b.b - 1) hits[b.name] = (hits[b.name] ?? 0) + 3;
    }
  }
  return hits;
});

const gaps = fwd.filter((r) => r.s > 0 && r.s < max && r.vis < 40).map((r) => `${r.s}:${r.vis}`);
const gapsBack = back.filter((r) => r.s > 0 && r.s < max && r.vis < 40).map((r) => `${r.s}:${r.vis}`);
const schedEnd = await schedOf();
const rebuiltMidRun = schedStart !== schedEnd ? `${schedStart}  →  ${schedEnd}` : false;
const reversalDiffs = fwd.map((r, i) => [r.s, r.drawn, back[i].drawn]).filter((x) => x[1] !== x[2]);
const mono = fwd.every((r, i) => i === 0 || r.drawn >= fwd[i - 1].drawn);
const reversible = fwd.every((r, i) => r.drawn === back[i].drawn);
const jumps = fwd.filter((r, i) => i > 0 && r.drawn - fwd[i - 1].drawn > 0.06).map((r, i) => `${r.s}:+${(r.drawn - fwd[fwd.indexOf(r) - 1].drawn).toFixed(3)}`);
const tipOff = fwd.filter((r) => r.drawn < 1 && r.s > 0 && (r.tipX < 6 || r.tipX > width - 6 || r.tipY < 0 || r.tipY > height)).map((r) => `${r.s}:${r.tipX},${r.tipY}`);
const minVis = Math.min(...fwd.filter((r) => r.s > 0 && r.s < max).map((r) => r.vis));
console.log(
  JSON.stringify({
    size, reduced, max, samples: fwd.length, minVisible: minVis, lowVisibility: gaps, lowVisibilityBack: gapsBack,
    monotonic: mono, reversible, reversalDiffs, rebuiltMidRun, bigJumps: jumps, tipOutside: tipOff, crossesContent: collisions,
    pass: gaps.length === 0 && gapsBack.length === 0 && mono && reversible && jumps.length === 0,
  }),
);
console.log("visible px by scroll:", fwd.filter((_, i) => i % 4 === 0).map((r) => `${r.s}:${r.vis}`).join(" "));
await browser.close();
