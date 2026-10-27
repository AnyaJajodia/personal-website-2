// Homepage copy integration (handoff/content/home.md is the authority):
//   1. every approved line of home.md is on the page, and no retired copy is;
//   2. at desktop / tablet / phone widths, in Light and Dark: no horizontal
//      overflow, every work panel's summary fits when it is open, trajectory
//      asides stay inside their reserved space, the Currently cards' text
//      doesn't collide; screenshots of each section for viewing.
// Usage: BASE_URL=... node qa/copy.mjs
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = "qa/screenshots/copy";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

/* ---------------------------------------------- 1. the approved text */
const md = readFileSync("handoff/content/home.md", "utf8").split("## Links")[0];
const norm = (s) => s.replace(/\s+/g, " ").replace(/(\d{4})-(\d{4})/g, "$1–$2").trim();
const expected = [];
for (const raw of md.split("\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const item = line.match(/^- (.+?) \((.+?)\) — (.+)$/);
  if (item) {
    expected.push(item[1], norm(item[2]), item[3]);
    continue;
  }
  if (/ \/ /.test(line)) {
    line.split(" / ").forEach((p) => expected.push(p.replace(/[↗↓]/g, "").trim()));
    continue;
  }
  if (line === "Anya Jajodia.") continue; // the name, split over two lines (checked below)
  // "CTO & Co-founder · April 2026–present": role and date are set in their own spans
  // (home.md's Lynxster entry follows the revised lynxster.md since 27 Oct 2026)
  const meta = line.match(/^(CTO & Co-founder|Volunteer) · (.+)$/);
  if (meta) {
    expected.push(meta[1], meta[2]);
    continue;
  }
  expected.push(line.replace(/\s*[↗↓]$/, "").trim());
}
const retired = [
  "FERPA",
  "US and Canadian legal frameworks",
  "The disclosure funnel",
  "Engineering, research, and other things",
  "follow the occasional question into a museum",
  "I started out with QMSS",
  "making complicated things easier",
  "from cryptographic implementation to the product around it",
  "Joined a mantis behavioral research project",
  "surprisingly complicated problem",
  "A WhatsApp-based HR system that",
  "A Python pipeline for tracing",
  "CCTV footage",
  "cheetah data",
  "Earlier work on women",
  "Peer teaching and technical mentorship",
  "For a project, a research question",
  "Engineering & technical leadership",
  "Link to come",
];

const browser = await chromium.launch({ channel: "chrome" });
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const text = norm(await page.evaluate(() => document.querySelector("main").textContent + " " + document.querySelector(".site-footer").textContent));
  // the two dates corrected to match the detail pages (iteration 24) are checked on their own below
  // (iteration 27: Inteli-lens's date and summary follow its revised inteli-lens.md — checked below)
  const inteliOld = "A computer-vision prototype exploring walking patterns and body language for signs of intoxication, with the goal of helping reduce drunk-driving incidents in the US.";
  const corrected = new Set(["2025", "2023", "2022–2024", "2022-2024", inteliOld]);
  const missing = expected.filter((e) => !corrected.has(e.trim()) && !text.includes(norm(e)));
  ok(`every approved home.md line is on the page (${expected.length} strings)`, missing.length === 0, missing.join(" | "));
  const stale = retired.filter((r) => text.includes(r) || 0);
  const head = await page.evaluate(() => document.title + " " + document.querySelector('meta[name="description"]').content);
  ok("no retired homepage copy (page, title, description)", stale.length === 0 && !retired.some((r) => head.includes(r)), stale.join(" | "));
  ok("hero: the name reads “Anya Jajodia.”", norm(await page.$eval(".hero__name", (e) => e.textContent)) === "Anya Jajodia.");
  ok("document title and description use the approved hero copy", head.includes("Building ideas. Exploring possibilities. Asking better questions.") && head.includes("occasionally into the backrooms of a museum."), head);
  const metas = await page.$$eval(".feature__meta", (ms) => ms.map((m) => m.innerText.replace(/\s*,\s*/g, " ").replace(/\s+/g, " ").trim()));
  ok("Currently: role and dates in the caption metadata", metas[0] === "CTO & Co-founder April 2026–present" && metas[1] === "Volunteer 2026–now", metas.join(" | "));
  const dates = await page.$$eval(".panel__date", (d) => d.map((x) => x.textContent));
  // home.md's dates, except where the completed detail pages corrected them (iteration 24):
  // Crackd spans 2025–2026 (Sept 2025–May 2026); both displayed papers are from 2022;
  // Inteli-lens is from 2022 (its revised inteli-lens.md)
  ok("Selected work: each panel's date (home.md, with Crackd and the publications corrected to match their detail pages)", dates.join(",") === "2025–2026,2025–2026,2025,2022,2024,2022,2024–2026", dates.join(","));
  ok(
    "Inteli-lens panel: 2022 and the revised inteli-lens.md summary (not the retired drunk-driving line)",
    text.includes("An independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication.") && !text.includes(inteliOld),
  );
  const contact = await page.$$eval(".contact-list__row", (rs) => rs.map((r) => [r.tagName, r.getAttribute("href"), r.textContent.trim()]));
  ok(
    "Contact: LinkedIn and GitHub link out; Résumé stays a “to come” placeholder (no dead link)",
    contact[0][1] === "https://www.linkedin.com/in/anya-jajodia/" && contact[1][1] === "https://github.com/AnyaJajodia" && contact[2][0] === "SPAN" && !contact[2][1],
    JSON.stringify(contact),
  );
  ok("Contact: email link and copy control present", (await page.$eval(".contact__email", (a) => a.getAttribute("href"))) === "mailto:anya@jajodia.org" && !!(await page.$(".contact__address button")));
  ok("no console errors", errors.length === 0, errors.join(" | "));
  await page.context().close();
}

/* ---------------------------------------------- 2. layout, both themes */
const shotSection = async (page, sel, name) => {
  const el = await page.$(sel);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await el.screenshot({ path: `${out}/${name}.png` });
};
const settleAll = async (page) => {
  // walk the page so every scroll-cued entrance has played, then back to the top
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
};

for (const vp of [
  { w: 1920, h: 1080 },
  { w: 1440, h: 900 },
  { w: 1280, h: 800 },
  { w: 1024, h: 768 },
  { w: 768, h: 1024, touch: true },
  { w: 390, h: 844, touch: true },
  { w: 360, h: 740, touch: true },
]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: !!vp.touch, isMobile: !!vp.touch && vp.w < 700, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await settleAll(page);
    const tag = `${vp.w}-${theme}`;
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok(`${tag}: no horizontal overflow`, over <= 0, `${over}px`);

    // hero: tagline / intro don't collide with the figure or each other
    const hero = await page.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const t = r(".hero__tagline"), i = r(".hero__intro"), n = r(".hero__name");
      return { order: n.bottom <= t.top + 1 && t.bottom <= i.top + 1, tl: Math.round(t.height), il: Math.round(i.height) };
    });
    ok(`${tag}: hero name → tagline → intro stack without overlap`, hero.order, JSON.stringify(hero));
    // the tagline and intro stay clear of the seated figure (its leftmost artwork,
    // her resting hand, is x 136 of the 1300-wide stage); phones stack her above
    const clear = await page.evaluate(() => {
      const rig = document.querySelector(".hero-rig").getBoundingClientRect();
      const figLeft = rig.left + (rig.width * 136) / 1300;
      const figBottom = rig.top + (rig.height * 1439) / 1600;
      const lines = (sel) => { const rg = document.createRange(); rg.selectNodeContents(document.querySelector(sel)); return [...rg.getClientRects()]; };
      const rs = [...lines(".hero__tagline"), ...lines(".hero__intro")];
      const hit = rs.filter((r) => r.right > figLeft - 8 && r.top < figBottom && r.bottom > rig.top);
      const t = lines(".hero__tagline");
      return { hit: hit.length, figLeft: Math.round(figLeft), taglineRight: Math.round(Math.max(...t.map((r) => r.right))), taglineLines: new Set(t.map((r) => Math.round(r.top))).size };
    });
    ok(`${tag}: hero tagline and intro stay clear of her`, clear.hit === 0, JSON.stringify(clear));
    if (theme === "light" || vp.w === 1440 || vp.w === 390) await shotSection(page, ".hero", `hero-${tag}`);

    // trajectory: pick each milestone; its aside stays in its reserved band
    const asides = [];
    for (let i = 0; i < 5; i++) {
      const btn = (await page.$$(".trajectory__point"))[i];
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await page.waitForTimeout(450);
      asides.push(
        await page.evaluate((k) => {
          const t = document.querySelector(`.trajectory__aside-text[data-i="${k}"]`);
          const a = t.getBoundingClientRect(), box = document.querySelector(".trajectory__aside").getBoundingClientRect();
          const body = document.querySelector(".about__body").getBoundingClientRect();
          const fig = document.querySelector(".trajectory").getBoundingClientRect();
          return { i: k, fits: a.bottom <= box.bottom + 1 && a.bottom <= body.top - 4 && a.left >= fig.left - 1 && a.right <= Math.min(fig.right, innerWidth) + 1, h: Math.round(a.height), below: Math.round(box.bottom - a.bottom), toBody: Math.round(body.top - a.bottom) };
        }, i),
      );
      if (vp.w === 1440 || vp.w === 390) await shotSection(page, ".trajectory", `traj-${i}-${tag}`);
    }
    ok(`${tag}: every trajectory aside fits its reserved space`, asides.every((a) => a.fits), JSON.stringify(asides.filter((a) => !a.fits)));
    // the trajectory with a note showing, and the About text under it, in one frame
    if (vp.w === 1440 || vp.w === 390 || vp.w === 1024) {
      await (await page.$$(".trajectory__point"))[2].click();
      await page.waitForTimeout(450);
      const box = await page.evaluate(() => { const a = document.querySelector(".trajectory").getBoundingClientRect(), c = document.querySelector(".about__body").getBoundingClientRect(); return { y: a.top + scrollY, h: c.bottom - a.top }; });
      await page.screenshot({ path: `${out}/about-full-${tag}.png`, fullPage: true, clip: { x: 0, y: box.y - 20, width: vp.w, height: box.h + 40 } });
    }
    // unpick, so the line's own state resumes
    await page.keyboard.press("Escape");

    // Currently: caption, streams and the CTA don't collide; text not clipped
    const feats = await page.$$eval(".feature", (fs) =>
      fs.map((f) => {
        const kids = [...f.querySelectorAll(".feature__caption, .feature__desc, .feature__stream, .feature__foot")].map((e) => e.getBoundingClientRect());
        let clash = false;
        for (let k = 1; k < kids.length; k++) if (kids[k].top < kids[k - 1].bottom - 1) clash = true;
        const fr = f.getBoundingClientRect();
        return { clash, clipped: kids.some((r) => r.bottom > fr.bottom + 1 || r.right > fr.right + 1) };
      }),
    );
    ok(`${tag}: Currently cards — caption, text and link stack cleanly`, feats.every((f) => !f.clash && !f.clipped), JSON.stringify(feats));
    if (theme === "light" || vp.w === 1440 || vp.w === 390) await shotSection(page, ".currently", `currently-${tag}`);

    // Selected work: open every panel in turn (hover on desktop); its summary fits
    const desktop = await page.evaluate(() => matchMedia("(min-width: 1000px) and (hover: hover)").matches);
    const panels = await page.$$(".panel");
    const fits = [];
    for (let i = 0; i < panels.length; i++) {
      if (desktop) {
        await panels[i].scrollIntoViewIfNeeded();
        const b = await panels[i].boundingBox();
        await page.mouse.move(b.x + 20, b.y + 20);
        await page.waitForTimeout(950);
      }
      fits.push(
        await panels[i].evaluate((p, i) => {
          const pr = p.getBoundingClientRect();
          const inner = p.querySelector(".panel__inner");
          const pad = parseFloat(getComputedStyle(inner).paddingBottom);
          const padTop = parseFloat(getComputedStyle(inner).paddingTop);
          const parts = [...p.querySelectorAll(".panel__desc, .panel__links, .panel__go, .panel__name, .panel__meta, .panel__logo")].map((e) => e.getBoundingClientRect());
          const top = Math.min(...parts.map((r) => r.top));
          const bottom = Math.max(...parts.map((r) => r.bottom));
          const right = Math.max(...parts.map((r) => r.right));
          const more = p.querySelector(".panel__more").getBoundingClientRect();
          const id = p.querySelector(".panel__id").getBoundingClientRect();
          // content is bottom-aligned, so an overflow would spill off the TOP
          return { i, open: +getComputedStyle(p.querySelector(".panel__more")).opacity > 0.9, spare: Math.round(Math.min(...[...p.querySelectorAll(".panel__more > *")].map((e) => e.getBoundingClientRect().top)) - pr.top - padTop), fits: bottom <= pr.bottom - pad + 1 && right <= pr.right + 1 && top >= pr.top + padTop - 1, overlap: more.left < id.right - 1 && more.top < id.bottom - 1 && more.width > 0 && id.width > 0 && getComputedStyle(p.querySelector(".panel__inner")).flexDirection === "row" };
        }, i),
      );
      if (desktop && (theme === "light" || vp.w === 1440)) {
        const row = await panels[i].evaluateHandle((p) => p.closest(".panels__row"));
        await row.asElement().screenshot({ path: `${out}/panel-${i}-${tag}.png` });
      }
    }
    ok(`${tag}: every work panel's summary fits when open${desktop ? " (hover)" : " (stacked)"}`, fits.every((f) => f.open && f.fits && !f.overlap), JSON.stringify(fits.map((f) => [f.i, f.spare, f.fits, f.overlap])));
    if (!desktop && (theme === "light" || vp.w === 390)) await shotSection(page, ".selected", `selected-${tag}`);
    if (desktop) await page.mouse.move(2, 2);

    if (theme === "light" || vp.w === 1440 || vp.w === 390) {
      await shotSection(page, ".about__body", `about-${tag}`);
      await shotSection(page, ".contact", `contact-${tag}`);
      await shotSection(page, ".site-footer", `footer-${tag}`);
    }
    await ctx.close();
  }
}

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} copy checks passed`);
process.exit(results.every(Boolean) ? 0 : 1);
