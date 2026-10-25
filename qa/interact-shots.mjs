// Frames of the refinement pass's interactions in motion, for viewing:
// thread tug (drag + release), taped preview lift, panel opening sequence,
// peeker shy + peekaboo, trajectory pick, copy, pen, viewfinder.
// Usage: node qa/interact-shots.mjs
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = "qa/screenshots/avatar/ix";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const to = async (sel, at) => { await page.evaluate(([s, a]) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * a); }, [sel, at]); await page.waitForTimeout(600); };
const shot = (name, el, pad = 40) => page.evaluate(([s, p]) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: Math.max(0, r.left - p), y: Math.max(0, r.top - p), width: Math.min(innerWidth, r.width + 2 * p), height: Math.min(innerHeight, r.height + 2 * p) }; }, [el, pad]).then((clip) => page.screenshot({ path: `${out}-${name}.png`, clip }));

// thread
await to('.thread-knot[data-knot="first"]', 0.5);
const k = await page.$eval('.thread-knot[data-knot="first"]', (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
const tclip = { x: k[0] - 160, y: k[1] - 110, width: 340, height: 200 };
await page.screenshot({ path: `${out}-thread-0rest.png`, clip: tclip });
await page.mouse.move(k[0], k[1]); await page.mouse.down();
for (let i = 1; i <= 10; i++) await page.mouse.move(k[0] + i * 6, k[1] + i * 9);
await page.waitForTimeout(250);
await page.screenshot({ path: `${out}-thread-1pull.png`, clip: tclip });
await page.mouse.up();
for (const t of [90, 180, 300, 1200]) { await page.waitForTimeout(t === 90 ? 90 : t - [0, 90, 180, 300][[90, 180, 300, 1200].indexOf(t)]); await page.screenshot({ path: `${out}-thread-2rel-${t}.png`, clip: tclip }); }
// trajectory pick
await to(".trajectory", 0.15);
await (await page.$$(".trajectory__point"))[3].click();
await page.waitForTimeout(800);
await shot("traj-pick", ".trajectory", 10);
// taped preview
await to(".currently", 0.05);
await page.hover(".feature--lynxster .feature__visual");
await page.waitForTimeout(1000);
await shot("preview-lift", ".feature--lynxster", 30);
await page.mouse.move(3, 3);
// panels
await to(".panels", 0.3);
const c = await page.$$eval(".panels__row:first-child .panel", (ps) => ps.map((p) => { const r = p.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }));
await page.mouse.move(c[2][0], c[2][1]);
for (const t of [150, 350, 600]) { await page.waitForTimeout(t === 150 ? 150 : t - [150, 350, 600][[150, 350, 600].indexOf(t) - 1]); await shot(`panel-${t}`, ".panels__row", 6); }
// peeker
await page.mouse.move(c[0][0], c[0][1]);
await page.waitForTimeout(700);
const lane = await page.$eval(".edge-lane__hit", (e) => { const r = e.getBoundingClientRect(); return { x: r.left - 300, y: r.top - 40, width: r.width + 300, height: r.height + 80 }; });
lane.x = Math.max(0, lane.x); lane.width = Math.min(1440 - lane.x, lane.width);
await page.screenshot({ path: `${out}-peek-lean-far.png`, clip: lane });
const hb = await (await page.$(".edge-lane__hit")).boundingBox();
await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height * 0.4);
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}-peek-shy.png`, clip: lane });
await page.mouse.click(hb.x + hb.width / 2, hb.y + hb.height * 0.4);
for (const t of [200, 700, 1300, 2600]) { await page.waitForTimeout(t === 200 ? 200 : t - [200, 700, 1300, 2600][[200, 700, 1300, 2600].indexOf(t) - 1]); await page.screenshot({ path: `${out}-peek-boo-${t}.png`, clip: lane }); }
await page.mouse.move(3, 3);
// more + contact
await to(".bento", 0.15);
await page.hover(".bento__card--photo"); await page.waitForTimeout(700); await shot("photo", ".bento__card--photo", 10);
await page.hover(".bento__card--writing"); await page.waitForTimeout(900); await shot("writing", ".bento__card--writing", 10);
await to(".contact", 0.05);
await page.click(".copy-email"); await page.waitForTimeout(600); await shot("copy", ".contact__address", 20);
await browser.close();
