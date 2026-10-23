// Avatar placements in context: loads the homepage in Chrome, waits for the
// hero to settle, then scrolls down in small steps (so every entrance fires
// on its own cue, as for a reader) and captures the viewport at each figure
// once it has settled. Also reports console errors, which figures entered,
// image load state and the decoded image sizes.
// Usage: node qa/av-shots.mjs <tag> [WxH ...] [--reduced]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const args = process.argv.slice(2);
const reduced = args.includes("--reduced");
const [tag = "av", ...sizes] = args.filter((a) => !a.startsWith("--"));
const base = process.env.BASE_URL ?? "http://localhost:3100";
const dir = "qa/screenshots/avatar";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const size of sizes.length ? sizes : ["1440x900", "768x1024", "390x844"]) {
  const [w, h] = size.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1, reducedMotion: reduced ? "reduce" : "no-preference" });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(2, h - 2);
  await page.waitForTimeout(2600);
  const name = `${dir}/${tag}-${w}`;
  await page.screenshot({ path: `${name}-0hero.png` });
  const roles = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-avatar]")).map((el) => ({ role: el.dataset.avatar, shown: !!el.offsetParent })),
  );
  // walk down the page like a reader
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const stops = {};
  for (const r of roles.filter((r) => r.shown && r.role !== "perched")) {
    stops[r.role] = await page.evaluate((role) => {
      const el = document.querySelector(`[data-avatar="${role}"]`);
      const b = el.getBoundingClientRect();
      // the figure at the trajectory's end waits for the pen, high in the viewport
      return Math.round(b.top + scrollY + b.height / 2 - innerHeight * (role === "ahead" ? 0.35 : 0.5));
    }, r.role);
  }
  let y = 0;
  const order = Object.entries(stops).sort((a, b) => a[1] - b[1]);
  for (const [role, target] of order) {
    const t = Math.max(0, Math.min(max, target));
    while (y < t) {
      y = Math.min(t, y + 60);
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(35);
    }
    await page.waitForTimeout(2700);
    await page.screenshot({ path: `${name}-${role}.png` });
  }
  const state = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-avatar]")).map((el) => {
      const img = el.querySelector("img");
      const r = el.getBoundingClientRect();
      return `${el.dataset.avatar}:${el.offsetParent ? "shown" : "hidden"}:${el.dataset.in ?? "-"}:${img.complete && img.naturalWidth ? "loaded" : "not-loaded"}:${Math.round(r.width)}x${Math.round(r.height)}`;
    }),
  );
  console.log(size, reduced ? "reduced" : "", JSON.stringify({ state, errors }));
  await page.close();
}
await browser.close();
