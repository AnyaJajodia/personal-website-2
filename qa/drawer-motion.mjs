import { chromium } from "playwright";
const url = process.argv[2] || "http://localhost:3100/work/buzzworks";
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(800);
const run = (sel) => p.evaluate((sel) => new Promise((res) => {
  const out = []; let t0;
  const tick = () => {
    const pn = document.querySelector(".sheet__panel");
    const tf = getComputedStyle(pn).transform; const x = tf === "none" ? 0 : +tf.split(",")[4];
    out.push([Math.round(performance.now() - t0), Math.round(x), (+getComputedStyle(pn).opacity).toFixed(2)]);
    if (performance.now() - t0 < 900) requestAnimationFrame(tick); else res(out);
  };
  t0 = performance.now(); document.querySelector(sel).click(); requestAnimationFrame(tick);
}), sel);
console.log("OPEN ", JSON.stringify(await run(".site-nav__work")));
await p.waitForTimeout(300);
console.log("CLOSE", JSON.stringify(await run(".sheet__close")));
await b.close();
