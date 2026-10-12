// Scroll-linked line audit: sweeps the page forward then back, recording how
// much of the line is drawn and where the pen tip sits in the viewport.
// Usage: node qa/pen.mjs <WxH> [step]
import { chromium } from "playwright";
const [size = "1440x900", stepArg = "60"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const step = Number(stepArg);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const read = () =>
  page.evaluate(() => {
    const p = document.querySelector("[data-testid=scribble] .scribble__path");
    const L = p.getTotalLength();
    const off = parseFloat(p.style.strokeDashoffset || "0");
    const tip = p.getPointAtLength(Math.max(0, L - off));
    const svgTop = p.ownerSVGElement.getBoundingClientRect().top;
    return { drawn: +(1 - off / L).toFixed(4), tipY: Math.round(svgTop + tip.y), tipX: Math.round(tip.x) };
  });
const fwd = [];
for (let s = 0; s <= max + step; s += step) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.min(s, max));
  await page.waitForTimeout(40);
  fwd.push({ s: Math.min(s, max), ...(await read()) });
}
const back = [];
for (let i = fwd.length - 1; i >= 0; i--) {
  await page.evaluate((y) => window.scrollTo(0, y), fwd[i].s);
  await page.waitForTimeout(40);
  back.push({ s: fwd[i].s, ...(await read()) });
}
back.reverse();
const mono = fwd.every((r, i) => i === 0 || r.drawn >= fwd[i - 1].drawn);
const reversible = fwd.every((r, i) => r.drawn === back[i].drawn);
const jumps = fwd.filter((r, i) => i > 0 && r.drawn - fwd[i - 1].drawn > 0.06).map((r) => r.s);
// tip visibility: while the line is still being drawn, the pen should be on screen
const off = fwd.filter((r) => r.drawn < 1 && (r.tipY < 0 || r.tipY > height)).map((r) => `${r.s}:${r.tipY}`);
console.log(JSON.stringify({ size, max, samples: fwd.length, startDrawn: fwd[0].drawn, endDrawn: fwd.at(-1).drawn, monotonic: mono, reversible, bigJumps: jumps, tipOffscreen: off }));
console.log("tip y by scroll:", fwd.filter((_, i) => i % 5 === 0).map((r) => `${r.s}→${r.tipY}`).join("  "));
await browser.close();
