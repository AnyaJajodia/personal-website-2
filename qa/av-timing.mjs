// Measures every entrance as it actually runs: per animation frame, the
// entering wrapper's opacity and translation, from the frame it starts moving
// to the frame it stops. Reports travel (px), duration (ms), whether it ever
// overshoots its resting place (a bounce), and how much of the time it is
// below 20% opacity. Usage: node qa/av-timing.mjs [WxH]
import { chromium } from "playwright";
const [size = "1440x900"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
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
await page.waitForTimeout(1800);
const res = await page.evaluate(() => {
  const out = {};
  for (const [role, s] of Object.entries(window.__tr)) {
    const moving = s.filter((f, i) => i > 0 && (f[1] !== s[i - 1][1] || f[2] !== s[i - 1][2] || f[3] !== s[i - 1][3]));
    if (!moving.length) { out[role] = "never moved"; continue; }
    const first = s[s.indexOf(moving[0]) - 1], last = moving[moving.length - 1];
    const travel = Math.hypot(first[2] - last[2], first[3] - last[3]);
    // overshoot: any frame past the resting point along the direction of travel
    const dx = last[2] - first[2], dy = last[3] - first[3];
    const over = moving.some((f) => (f[2] - last[2]) * Math.sign(dx) > 0.5 || (f[3] - last[3]) * Math.sign(dy) > 0.5);
    out[role] = { travelPx: +travel.toFixed(1), durationMs: Math.round(last[0] - first[0]), fromOpacity: first[1], overshoot: over };
  }
  return out;
});
console.log(size, JSON.stringify(res));
await browser.close();
