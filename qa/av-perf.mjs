// Scroll smoothness: drives a steady wheel scroll down the homepage and
// records requestAnimationFrame intervals; reports median / p95 frame time
// and the share of frames over 20ms. Usage: node qa/av-perf.mjs [WxH]
import { chromium } from "playwright";
const [size = "1440x900"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.evaluate(() => { window.__f = []; let last = performance.now(); const t = (now) => { window.__f.push(now - last); last = now; if (window.__f.length < 2000) requestAnimationFrame(t); }; requestAnimationFrame(t); });
await page.mouse.move(w / 2, h / 2);
for (let i = 0; i < 90; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(16); }
const f = await page.evaluate(() => window.__f.slice(5).sort((a, b) => a - b));
const q = (p) => f[Math.floor(f.length * p)].toFixed(1);
console.log(size, JSON.stringify({ frames: f.length, median: q(0.5), p95: q(0.95), over20: +(f.filter((x) => x > 20).length / f.length).toFixed(3) }));
await browser.close();
