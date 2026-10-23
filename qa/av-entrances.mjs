// Films each figure's entrance as a reader scrolls slowly toward it (Chrome
// screencast, every painted frame) and writes one strip per figure, cropped
// around it, with frame times — to judge travel, timing and settle.
// Usage: node qa/av-entrances.mjs [tag] [WxH]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
const [tag = "ent", size = "1440x900"] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const dir = `qa/screenshots/avatar/ent-${tag}-${W}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const cdp = await page.context().newCDPSession(page);
let frames = [];
let on = false;
cdp.on("Page.screencastFrame", async (f) => {
  if (on) frames.push({ t: f.metadata.timestamp, data: f.data, sy: f.metadata.scrollOffsetY });
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
await page.mouse.move(2, H - 2);
const roles = await page.evaluate(() => [...document.querySelectorAll("[data-avatar]:not([data-static])")].filter((e) => e.offsetParent).map((e) => e.dataset.avatar));
const out = {};
for (const role of roles) {
  const top = await page.evaluate((r) => document.querySelector(`[data-avatar="${r}"]`).getBoundingClientRect().top + scrollY, role);
  frames = [];
  on = true;
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1 });
  let y = await page.evaluate(() => scrollY);
  const target = Math.min(top - H * 0.42, await page.evaluate(() => document.documentElement.scrollHeight - innerHeight));
  while (y < target) {
    y = Math.min(target, y + 14);
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(1300);
  await cdp.send("Page.stopScreencast");
  on = false;
  const r = await page.evaluate((r) => { const b = document.querySelector(`[data-avatar="${r}"]`).getBoundingClientRect(); return { x: b.left, y: b.top + scrollY, w: b.width, h: b.height, in: document.querySelector(`[data-avatar="${r}"]`).dataset.in }; }, role);
  // keep the frames from the figure's last 1.4 s
  const tEnd = frames[frames.length - 1].t;
  const kept = frames.filter((f) => f.t > tEnd - 1.7);
  kept.forEach((f, i) => writeFileSync(`${dir}/${role}-${String(i).padStart(3, "0")}.jpg`, Buffer.from(f.data, "base64")));
  writeFileSync(`${dir}/${role}.json`, JSON.stringify({ rect: r, frames: kept.map((f) => ({ t: Math.round((f.t - kept[0].t) * 1000), sy: f.sy })) }));
  out[role] = `${kept.length} frames, ${r.in}`;
}
console.log(JSON.stringify(out));
await browser.close();
