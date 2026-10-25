// Hero composition across widths: where the seated avatar's head, seat and
// feet fall relative to the header, the name, the tagline and the hero's foot,
// and where the trajectory heading starts against the first screen.
// Usage: node qa/av-hero.mjs [WxH ...]
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
for (const size of process.argv.slice(2).length ? process.argv.slice(2) : ["1024x768", "1280x800", "1440x900", "1920x1080", "768x1024", "390x844"]) {
  const [w, h] = size.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await page.goto((process.env.BASE_URL ?? "http://localhost:3100") + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const R = (s) => document.querySelector(s)?.getBoundingClientRect();
    const av = R(".hero__perch"), hd = R(".site-header"), nm = R(".hero__name"), tg = R(".hero__tagline"), it = R(".hero__intro"), hero = R(".hero"), ah = R("#about-heading"), seat = R('[data-line="perch-l"]'), cup = R(".matcha"), nav = R(".site-nav");
    // the artwork's head starts ~1% down the box, the feet end at ~99%
    const head = av.top + av.height * 0.01, feet = av.top + av.height * 0.99;
    const rg = document.createRange(); rg.selectNodeContents(document.querySelectorAll(".hero__line")[1]);
    const jaj = rg.getBoundingClientRect();
    return {
      avatar: [Math.round(av.left), Math.round(av.width)], headBelowHeader: Math.round(head - hd.bottom), headVsNavBottom: Math.round(head - nav.bottom),
      seatY: Math.round(seat.top), nameBottom: Math.round(nm.bottom), gapToJajodia: Math.round(av.left + av.width * 0.02 - jaj.right), gapToTagline: Math.round(av.left - Math.max(tg.right, it.right)),
      feetVsHeroBottom: Math.round(hero.bottom - feet), heroH: Math.round(hero.height), aboutHeadingTop: Math.round(ah.top), vh: innerHeight, cup: [Math.round(cup.width), Math.round(cup.height)],
    };
  });
  console.log(size, JSON.stringify(r));
  await page.close();
}
await browser.close();
