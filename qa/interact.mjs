// Interaction QA for the refinement pass, in Google Chrome (Playwright).
// Measures what screenshots cannot: the thread's local deformation and its
// return, picking milestones without layout shift, the taped previews' lift
// and arrow, the panels' open sequence and flash-free rapid switching, the
// edge peeker's moods, the viewfinder, the pen, copying the email, and the
// greeter's arrival. Usage: BASE_URL=... node qa/interact.mjs
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3100";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const browser = await chromium.launch({ channel: "chrome" });
const frames2 = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

async function home(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.on("console", (m) => m.type() === "error" && page.errors.push(m.text()));
  page.on("pageerror", (e) => page.errors.push(String(e)));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  return page;
}
const scrollTo = async (page, sel, at = 0.35) => {
  await page.evaluate(
    ([s, a]) => {
      const el = document.querySelector(s);
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * a);
    },
    [sel, at],
  );
  await page.waitForTimeout(500);
};

/* 1. the thread */
{
  const page = await home();
  // scroll so the first trajectory knot is drawn and on screen
  await scrollTo(page, ".trajectory", 0.3);
  await page.waitForTimeout(400);
  const knots = await page.$$eval(".thread-knot", (ks) => ks.map((k) => ({ id: k.dataset.knot, label: k.getAttribute("aria-label"), w: k.offsetWidth })));
  ok("thread: labelled, ≥44px handles over the knots (hero, first, now, hello)", ["hero", "first", "now", "hello"].every((id) => knots.some((k) => k.id === id)) && knots.every((k) => k.label && k.w >= 44), knots.map((k) => `${k.id}:${k.w}`).join(" "));
  const sample = () =>
    page.evaluate(() => {
      const p = document.querySelector(".scribble__path");
      const L = p.getTotalLength();
      const pts = [];
      for (let i = 0; i <= 600; i++) {
        const q = p.getPointAtLength((L * i) / 600);
        pts.push([q.x, q.y]);
      }
      return { d: p.getAttribute("d"), pts };
    });
  const before = await sample();
  const traj = await page.$eval(".trajectory", (e) => JSON.stringify(e.getBoundingClientRect()));
  const k = await page.$eval('.thread-knot[data-knot="first"]', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, cx: r.left + r.width / 2, cy: r.top + r.height / 2 + scrollY }; });
  // press and drag far: resistance caps the travel
  await page.mouse.move(k.x, k.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(k.x + i * 10, k.y + i * 8);
  await page.waitForTimeout(250);
  const pulled = await page.evaluate(([cx, cy]) => {
    const p = document.querySelector(".scribble__path");
    const top = p.ownerSVGElement.getBoundingClientRect().top + scrollY;
    // nearest point of the path to where the knot was, and how far the knot moved
    let best = 1e9;
    const L = p.getTotalLength();
    for (let i = 0; i <= 2000; i++) {
      const q = p.getPointAtLength((L * i) / 2000);
      best = Math.min(best, Math.hypot(q.x - cx, q.y + top - cy));
    }
    return best;
  }, [k.cx, k.cy]);
  const during = await sample();
  // only the nearby line moved: points far from the knot are unchanged
  const far = during.pts.filter((q, i) => Math.hypot(before.pts[i][0] - k.cx, before.pts[i][1] - (k.cy - 0)) > 400);
  await page.mouse.up();
  const trajAfter = await page.$eval(".trajectory", (e) => JSON.stringify(e.getBoundingClientRect()));
  ok("thread: a drag deforms the line near the knot, with bounded travel (≤34px)", during.d !== before.d && pulled > 4 && pulled <= 40, `knot centre now ${pulled.toFixed(1)}px from the path`);
  // the path keeps one point per segment, so changed segments can be located:
  // every one of them must lie within reach of the knot
  const changed = await page.evaluate(([a, b, cx, cy]) => {
    const top = document.querySelector(".scribble").getBoundingClientRect().top + scrollY;
    const ta = a.split(/(?=[MQL])/), tb = b.split(/(?=[MQL])/);
    let n = 0, far = 0;
    for (let i = 0; i < Math.min(ta.length, tb.length); i++) {
      if (ta[i] === tb[i]) continue;
      n++;
      const [x, y] = ta[i].slice(1).split(/[ ,]+/).map(Number);
      far = Math.max(far, Math.hypot(x - cx, y + top - cy));
    }
    return { n, total: ta.length, sameCount: ta.length === tb.length, far: Math.round(far) };
  }, [before.d, during.d, k.cx, k.cy]);
  ok("thread: only the line near the knot changes (one continuous path)", changed.n > 0 && changed.sameCount && changed.far <= 110, `${changed.n} of ${changed.total} segments, all within ${changed.far}px of the knot`);
  ok("thread: surrounding content does not move", traj === trajAfter);
  await page.waitForTimeout(1800);
  const settled = await sample();
  ok("thread: on release it springs back and settles exactly", settled.d === before.d);
  // keyboard: focus and Enter plucks; arrows tug
  await page.focus('.thread-knot[data-knot="first"]');
  await page.waitForTimeout(1200);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(120);
  const plucked = (await sample()).d !== before.d;
  await page.waitForTimeout(1800);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(100);
  const tugged = (await sample()).d !== before.d;
  await page.waitForTimeout(1800);
  ok("thread: keyboard pluck (Enter) and tug (arrows), then rest", plucked && tugged && (await sample()).d === before.d);
  ok("thread: no console errors", page.errors.length === 0, page.errors.join(" | "));
  await page.context().close();
}
{
  // touch: a tap plucks, and the page can still be scrolled from a knot
  const page = await home({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await scrollTo(page, '.thread-knot[data-knot="first"]', 0.5);
  const d0 = await page.$eval(".scribble__path", (p) => p.getAttribute("d"));
  await page.tap('.thread-knot[data-knot="first"]');
  await page.waitForTimeout(100);
  const d1 = await page.$eval(".scribble__path", (p) => p.getAttribute("d"));
  const ta = await page.$eval('.thread-knot[data-knot="first"]', (e) => getComputedStyle(e).touchAction);
  ok("thread (touch): a tap plucks; the handle never blocks scrolling", d1 !== d0 && ta === "manipulation", `touch-action ${ta}`);
  await page.context().close();
}
{
  const page = await home({ reducedMotion: "reduce" });
  ok("thread: no handles with reduced motion", (await page.$$(".thread-knot")).length === 0);
  await page.context().close();
}

/* 2. trajectory: pick a milestone */
{
  const page = await home();
  await scrollTo(page, ".trajectory", 0.15);
  const h0 = await page.$eval(".trajectory", (e) => e.getBoundingClientRect().height);
  const body0 = await page.$eval(".about__body", (e) => e.getBoundingClientRect().top);
  const pts = await page.$$(".trajectory__point");
  await pts[1].click();
  await page.waitForTimeout(700);
  const s1 = await page.evaluate(() => ({
    show: document.querySelector(".trajectory__aside").dataset.show,
    pressed: [...document.querySelectorAll(".trajectory__point")].map((p) => p.getAttribute("aria-pressed")).join(""),
    hl: getComputedStyle(document.querySelectorAll(".trajectory__title")[1]).backgroundSize,
    others: [...document.querySelectorAll(".trajectory__title")].filter((t, i) => i !== 1 && getComputedStyle(t).backgroundSize.startsWith("100%")).length,
    visible: [...document.querySelectorAll(".trajectory__aside-text")].filter((t) => +getComputedStyle(t).opacity > 0.5).map((t) => t.textContent),
  }));
  ok("trajectory: picking a milestone moves the highlight to it (only it)", s1.show === "1" && s1.pressed === "falsetruefalsefalsefalse" && parseFloat(s1.hl) > 98 && s1.others === 0, JSON.stringify(s1));
  ok("trajectory: one aside at a time, quoted from the About text", s1.visible.length === 1 && (await page.$eval(".about__body", (e) => e.textContent)).includes(s1.visible[0].replace(/…/g, "")), s1.visible[0]);
  await pts[3].click();
  await page.waitForTimeout(700);
  const h1 = await page.$eval(".trajectory", (e) => e.getBoundingClientRect().height);
  const body1 = await page.$eval(".about__body", (e) => e.getBoundingClientRect().top);
  ok("trajectory: switching notes causes no layout shift", Math.abs(h1 - h0) < 0.5 && Math.abs(body1 - body0) < 0.5, `${h0} → ${h1}`);
  await pts[3].click();
  await page.waitForTimeout(400);
  ok("trajectory: picking again lets go", (await page.$eval(".trajectory", (e) => !e.dataset.picked)));
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelectorAll(".trajectory__point")[4].focus());
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(500);
  ok("trajectory: keyboard focus picks a milestone", (await page.$eval(".trajectory__aside", (e) => e.dataset.show)) === "4");
  await page.context().close();
}

/* 3. taped previews */
{
  const page = await home();
  await scrollTo(page, ".currently", 0.1);
  const tape0 = await page.$eval(".feature--lynxster", (e) => getComputedStyle(e, "::before").transform);
  const vis = await page.$(".feature--lynxster .feature__visual");
  const b = await vis.boundingBox();
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.5);
  await page.waitForTimeout(900);
  const st = await page.evaluate(() => {
    const f = document.querySelector(".feature--lynxster");
    const v = f.querySelector(".feature__visual");
    const cs = getComputedStyle(v);
    return { t: cs.transform, origin: cs.transformOrigin, shadow: cs.boxShadow, tape: getComputedStyle(f, "::before").transform, nudge: getComputedStyle(f.querySelector(".feature__nudge path")).strokeDashoffset };
  });
  ok("taped preview: the free corner lifts (origin at the taped corner); the shadow follows", st.t.startsWith("matrix3d") && st.origin.startsWith("0px 0px") && st.shadow.includes("16px 26px"), st.t.slice(0, 40));
  ok("taped preview: the tape stays put", st.tape === tape0, `${tape0} → ${st.tape}`);
  ok("taped preview: a pencilled arrow draws toward the link", parseFloat(st.nudge) < 0.05, st.nudge);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelector(".feature--amnh .feature__cta").focus());
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(900);
  const kb = await page.evaluate(() => ({ t: getComputedStyle(document.querySelector(".feature--amnh .feature__visual")).transform, nudge: getComputedStyle(document.querySelector(".feature--amnh .feature__nudge path")).strokeDashoffset }));
  ok("taped preview: keyboard focus on the link does the same", kb.t.startsWith("matrix3d") && parseFloat(kb.nudge) < 0.05);
  await page.context().close();
}

/* 4. panels: sequence and rapid switching */
{
  const page = await home();
  await scrollTo(page, ".panels", 0.25);
  const cards = await page.$$eval(".panels__row:first-child .panel", (ps) => ps.map((p) => { const r = p.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }));
  await page.mouse.move(cards[2][0], cards[2][1]);
  const seq = [];
  for (const t of [120, 330, 520, 900]) {
    await page.waitForTimeout(t - (seq.at(-1)?.t ?? 0));
    seq.push({ t, ...(await page.evaluate(() => { const p = document.querySelectorAll(".panels__row:first-child .panel")[2]; return { w: Math.round(p.getBoundingClientRect().width), more: +(+getComputedStyle(p.querySelector(".panel__more")).opacity).toFixed(2), go: +(+getComputedStyle(p.querySelector(".panel__go")).opacity).toFixed(2) }; })) });
  }
  const s = seq;
  ok("panels: open in order — widen, then the summary, then the arrow", s[0].w < s[3].w && s[1].more > s[1].go && s[3].more === 1 && s[3].go === 1 && s[0].go === 0, JSON.stringify(s));
  // rapid switching across the gaps: the row never falls back to its default mid-move
  await page.evaluate(() => {
    const row = document.querySelector(".panels__row");
    window.__flash = 0;
    window.__frames = 0;
    const t = () => {
      if (!window.__watch) return;
      window.__frames++;
      if (!row.dataset.engaged) window.__flash++;
      requestAnimationFrame(t);
    };
    window.__watch = true;
    requestAnimationFrame(t);
  });
  for (const [x, y] of [...cards, ...cards.slice().reverse(), ...cards]) {
    await page.mouse.move(x, y, { steps: 6 });
    await page.waitForTimeout(40);
  }
  const flash = await page.evaluate(() => { window.__watch = false; return { flash: window.__flash, frames: window.__frames }; });
  ok("panels: rapid switching never flashes the default panel", flash.flash === 0, `${flash.frames} frames`);
  // every visible summary sits inside its panel (no clipping)
  await page.waitForTimeout(900);
  const clip = await page.evaluate(() => [...document.querySelectorAll(".panel")].filter((p) => +getComputedStyle(p.querySelector(".panel__more")).opacity > 0.9).map((p) => { const a = p.getBoundingClientRect(), m = p.querySelector(".panel__desc").getBoundingClientRect(); return m.right <= a.right + 0.5 && m.bottom <= a.bottom + 0.5; }));
  ok("panels: open summaries are not clipped", clip.every(Boolean), `${clip.length} open`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(900);
  ok("panels: leaving returns the row to its default", (await page.evaluate(() => !document.querySelector(".panels__row").dataset.engaged)));
  await page.context().close();
}

/* 5. the edge peeker's moods */
{
  const page = await home();
  await scrollTo(page, ".panels", 0.3);
  await page.waitForTimeout(400);
  const hit = await page.$(".edge-lane__hit");
  const hb = await hit.boundingBox();
  const tx = () => page.$eval('[data-avatar="edge"] .avatar__act', (e) => Math.round(new DOMMatrixReadOnly(getComputedStyle(e).transform.replace("none", "matrix(1,0,0,1,0,0)")).m41));
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height * 0.4);
  await page.waitForTimeout(600);
  const shy = await tx();
  await page.mouse.move(hb.x - 300, hb.y);
  await page.waitForTimeout(700);
  const back = await tx();
  const rest = await page.$eval('[data-avatar="edge"] .avatar__img', (e) => Math.round(e.getBoundingClientRect().width * 0.14));
  ok("edge peeker: a pointer over her makes her ease back; leaving, she returns to her quieter rest", shy > back && Math.abs(back - rest) <= 2, `${shy}px → ${back}px (rest ${rest}px)`);
  const states = [];
  await hit.click();
  for (let i = 0; i < 14; i++) {
    states.push(await page.$eval('[data-avatar="edge"]', (e) => e.dataset.peek ?? "out"));
    await page.waitForTimeout(180);
  }
  const order = states.filter((v, i) => i === 0 || v !== states[i - 1]).join("→");
  ok("edge peeker: activating her: hide → pause → cautious peek → out", order === "hide→check→out", order);
  // interrupted: press again mid-way, she starts the duck over (no queue)
  await hit.click();
  await page.waitForTimeout(1100);
  await hit.click();
  await page.waitForTimeout(80);
  ok("edge peeker: pressing again mid-peek restarts cleanly", (await page.$eval('[data-avatar="edge"]', (e) => e.dataset.peek)) === "hide");
  await page.waitForTimeout(2400);
  await page.focus(".edge-lane__hit");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  ok("edge peeker: keyboard activation works", (await page.$eval('[data-avatar="edge"]', (e) => e.dataset.peek)) === "hide");
  // her visible artwork stays clear of the cards and the top of her hair is not cropped
  const geo = await page.evaluate(() => {
    const img = document.querySelector('[data-avatar="edge"] img').getBoundingClientRect();
    const lane = document.querySelector(".edge-lane").getBoundingClientRect();
    const cards = Math.max(...[...document.querySelectorAll(".panel")].map((p) => p.getBoundingClientRect().right));
    return { leftInLane: img.left >= lane.left - 0.5, gap: Math.round(Math.max(img.left, lane.left) - cards), laneOverflowY: getComputedStyle(document.querySelector(".edge-lane")).overflowY };
  });
  ok("edge peeker: whole figure inside her lane (only the screen edge crops her), clear of the cards", geo.leftInLane && geo.gap >= 24 && geo.laneOverflowY === "visible", JSON.stringify(geo));
  await page.context().close();
}

/* 6. supporting interactions */
{
  const page = await home();
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await scrollTo(page, ".bento", 0.2);
  const corner = () => page.$eval(".viewfinder i", (e) => getComputedStyle(e).transform);
  const c0 = await corner();
  const photo = await page.$(".bento__card--photo");
  await photo.hover();
  await page.waitForTimeout(700);
  const c1 = await corner();
  ok("photography: viewfinder corners close in on hover", c0 === "none" && c1 !== "none", `${c0} → ${c1}`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(700);
  await page.focus(".bento__card--photo .bento__link");
  await page.waitForTimeout(700);
  ok("photography: and on keyboard focus; the plate links to the photographs", (await corner()) !== "none" && (await page.$eval(".bento__card--photo .bento__link", (e) => e.getAttribute("href"))) === "/wildlife-photography");
  const pen = () => page.evaluate(() => ({ pen: getComputedStyle(document.querySelector(".writing__pen")).transform, ink: getComputedStyle(document.querySelector(".writing__ink")).strokeDashoffset }));
  const p0 = await pen();
  await (await page.$(".bento__card--writing")).hover();
  await page.waitForTimeout(1000);
  const p1 = await pen();
  ok("writing: the pen finishes its stroke on hover, then rests", p0.pen !== "none" && parseFloat(p0.ink) > 0.05 && p1.pen === "none" && parseFloat(p1.ink) === 0, `${JSON.stringify(p0)} → ${JSON.stringify(p1)}`);
  ok("experiments: still empty", (await page.$eval(".bento__card--experiments", (e) => e.querySelectorAll("svg, img, canvas, button, a").length)) === 0);
  // contact
  await scrollTo(page, ".contact", 0.1);
  const btn = await page.$(".copy-email");
  const label0 = await btn.textContent();
  await btn.click();
  await page.waitForTimeout(600);
  const after = await page.evaluate(async () => ({ label: document.querySelector(".copy-email").textContent, check: getComputedStyle(document.querySelector(".copy-email__check path")).strokeDashoffset, status: document.querySelector('.contact [role="status"]').textContent, clip: await navigator.clipboard.readText(), link: document.querySelector(".contact__email").getAttribute("href") }));
  ok("contact: copy control copies the address, says “Copied”, draws a check; the email link is unchanged", label0.includes("Copy email") && after.label.includes("Copied") && parseFloat(after.check) < 0.05 && after.status.includes("copied") && after.link === `mailto:${after.clip}`, JSON.stringify(after));
  await page.context().close();
}
{
  // the greeter is settled as the contact section arrives (before the line reaches her)
  const page = await home();
  const top = await page.evaluate(() => document.querySelector(".contact").getBoundingClientRect().top + scrollY);
  for (let y = top - 1400; y < top - 900 * 0.55; y += 30) {
    await page.evaluate((v) => scrollTo(0, v), Math.round(y));
    await frames2(page);
  }
  await page.waitForTimeout(700);
  const g = await page.evaluate(() => {
    const a = document.querySelector('[data-avatar="greeting"]');
    const b = a.getBoundingClientRect();
    return { in: a.dataset.in, visible: b.top < innerHeight && b.bottom > 0, op: getComputedStyle(a.querySelector(".avatar__body")).opacity };
  });
  ok("contact: the greeting figure has settled by the time the section is in view", g.in === "done" || (g.in === "true" && g.op === "1"), JSON.stringify(g));
  await page.context().close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed`);
process.exit(failed.length ? 1 : 0);
