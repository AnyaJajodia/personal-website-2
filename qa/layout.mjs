// Dumps the homepage's main block rects (document coordinates) so the line's
// route can be composed around the content. Usage: node qa/layout.mjs <WxH>...
import { chromium } from "playwright";
const sizes = process.argv.slice(2).length ? process.argv.slice(2) : ["1440x900"];
const browser = await chromium.launch({ channel: "chrome" });
for (const size of sizes) {
  const [width, height] = size.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const out = await page.evaluate(() => {
    const r = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.right), Math.round(b.bottom + scrollY)].join(",");
    };
    const sels = {
      hero: ".hero", name: ".hero__name", slot: ".hero__slot", tagline: ".hero__tagline", intro: ".hero__intro", cue: ".hero__cue",
      about: "#about", aboutH: ".about__heading", band: ".trajectory__band", traj: ".trajectory", body: ".about__body",
      current: ".currently", currentH: '[data-line="current-heading"]', features: ".features",
      selected: ".selected", selectedH: '[data-line="selected-heading"]', panels: ".panels",
      more: ".more", moreH: '[data-line="more-heading"]', moreIntro: ".more__intro", bento: ".bento", moreNote: ".more__note",
      contact: ".contact", contactH: '[data-line="contact-heading"]', contactGrid: ".contact__grid", footer: ".site-footer",
    };
    const o = { vw: document.documentElement.clientWidth, doc: document.documentElement.scrollHeight };
    for (const [k, v] of Object.entries(sels)) o[k] = r(v);
    return o;
  });
  console.log(size, JSON.stringify(out));
  await page.close();
}
await browser.close();
