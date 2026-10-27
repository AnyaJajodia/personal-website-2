// The Buzzworks reconstruction: four fictional journeys in one window.
//   tabs: four, the form first; arrow keys / Home / End move between them
//   guided steps: the path's option advances; other options are disabled;
//     Next / Back / Restart; the form shows summary → edit one field → updated
//     summary → submission; offer: document → accept → sample signature → done;
//     leave: menu → balances → sample policy (no request sequence)
//   one window height across scenarios; the log scrolls inside it; no page overflow
//   no live calls: no network requests while stepping; reduced motion
// Usage: BASE_URL=... node qa/buzzworks-recon.mjs [shots-dir]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.argv[2] ?? "qa/screenshots/buzzworks-recon";
mkdirSync(out, { recursive: true });
const results = [];
const ok = (name, pass, detail = "") => { results.push(pass); console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); };
const b = await chromium.launch({ channel: "chrome" });

for (const [w, h, theme] of [[1440, 900, "light"], [390, 844, "dark"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, isMobile: w < 700, hasTouch: w < 700 });
  const p = await ctx.newPage();
  await p.goto(`${base}/work/buzzworks`, { waitUntil: "networkidle" });
  const tag = `${w} ${theme}`;
  await p.locator(".wa").scrollIntoViewIfNeeded();
  const tabs = await p.$$eval(".wa__tab", (t) => t.map((x) => [x.textContent, x.getAttribute("aria-selected")]));
  ok(`${tag}: four scenario tabs, "Complete a form" selected first`, tabs.map((t) => t[0]).join("|") === "Complete a form|Ask about a policy|Manage leave|Review an offer" && tabs[0][1] === "true", JSON.stringify(tabs));
  const winH = async () => p.$eval(".wa__window", (e) => Math.round(e.getBoundingClientRect().height));
  const h0 = await winH();
  let reqs = 0;
  p.on("request", (r) => { if (!r.url().startsWith("data:")) reqs++; });

  // the form, by guided clicks in the chat itself
  const texts = async () => p.$$eval(".wa__log .wa-bubble", (bs) => bs.map((x) => x.textContent.replace(/\s+/g, " ").trim()));
  const disabledOthers = await p.$$eval(".wa-opt", (os) => os.filter((o) => !o.classList.contains("wa-opt--path")).every((o) => o.disabled));
  ok(`${tag}: only the path's option is active; the others are shown, disabled`, disabledOthers && (await p.$$eval(".wa-opt--path", (o) => o.length)) === 1);
  await p.click(".wa-opt--path"); // Personal details form
  await p.click(".wa__send"); // Meera
  await p.click(".wa__send"); // Pune
  await p.click(".wa__send"); // photo
  await p.waitForTimeout(350);
  let t = await texts();
  ok(`${tag}: form — short replies and a sample attachment, then a summary`, t.some((x) => x.includes("sample-photo.jpg")) && t.some((x) => /Here’s what I have/.test(x) && x.includes("City: Pune")), t.slice(-2).join(" / "));
  await p.screenshot({ path: `${out}/${w}-${theme}-form-summary.png` });
  await p.click(".wa-opt--path"); // Edit a field
  await p.click(".wa-opt--path"); // City
  await p.click(".wa__send"); // Mumbai
  await p.waitForTimeout(350);
  t = await texts();
  ok(`${tag}: form — one field edited, and an updated summary`, t.some((x) => /Updated/.test(x) && x.includes("City: Mumbai")), t.slice(-1)[0]);
  await p.screenshot({ path: `${out}/${w}-${theme}-form-updated.png` });
  await p.click(".wa-opt--path"); // Submit
  await p.waitForTimeout(350);
  t = await texts();
  const end = await p.evaluate(() => ({ next: document.querySelector(".wa__ctl--next").disabled, step: document.querySelector(".wa__progress").textContent, log: (() => { const l = document.querySelector(".wa__log"); return l.scrollHeight > l.clientHeight && Math.abs(l.scrollTop + l.clientHeight - l.scrollHeight) < 4; })() }));
  ok(`${tag}: form — submission confirmed; Next disabled at the end; the log scrolled to the newest message inside the window`, /Submitted/.test(t.at(-1)) && end.next && end.step === "Step 9 of 9" && end.log, JSON.stringify(end));
  await p.screenshot({ path: `${out}/${w}-${theme}-form-done.png` });
  // Back / Restart
  await p.click(".wa__ctl >> text=Back");
  ok(`${tag}: Back steps back one`, (await p.textContent(".wa__progress")) === "Step 8 of 9");
  await p.click(".wa__ctl >> text=Restart");
  ok(`${tag}: Restart returns to the first step`, (await p.textContent(".wa__progress")) === "Step 1 of 9" && (await p.$$eval(".wa__log .wa-bubble", (x) => x.length)) === 1);

  // keyboard: arrow keys across the tabs
  await p.focus(".wa__tab[aria-selected='true']");
  await p.keyboard.press("ArrowRight");
  const k1 = await p.evaluate(() => [document.activeElement.textContent, document.activeElement.getAttribute("aria-selected")]);
  await p.keyboard.press("End");
  const k2 = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press("Home");
  const k3 = await p.evaluate(() => document.activeElement.textContent);
  ok(`${tag}: tabs — ←/→, Home, End move and select`, k1[0] === "Ask about a policy" && k1[1] === "true" && k2 === "Review an offer" && k3 === "Complete a form", JSON.stringify([k1, k2, k3]));
  const ring = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  ok(`${tag}: focused tab shows a ring`, ring !== "none", ring);

  // policy, by Next
  await p.click(".wa__tab >> text=Ask about a policy");
  for (let i = 0; i < 3; i++) await p.click(".wa__ctl--next");
  await p.waitForTimeout(350);
  t = await texts();
  ok(`${tag}: policy — question, a brief answer marked as sample material, "Ask another question"`, t.some((x) => /work from home/.test(x)) && t.some((x) => /sample hybrid-work policy/.test(x)) && /what would you like to know/.test(t.at(-1)), t.slice(-2).join(" / "));
  await p.screenshot({ path: `${out}/${w}-${theme}-policy.png` });
  const h1 = await winH();

  // leave: balances and a sample policy, no request sequence
  await p.click(".wa__tab >> text=Manage leave");
  for (let i = 0; i < 2; i++) await p.click(".wa__ctl--next");
  await p.waitForTimeout(350);
  t = await texts();
  ok(`${tag}: leave — menu, sample balances, a sample leave policy; no request sequence`, t.some((x) => /Casual leave/.test(x)) && /Sample leave policy\.pdf/.test(t.at(-1)) && !t.some((x) => /request (submitted|sent)|dates/i.test(x)), t.at(-1));
  const h2 = await winH();

  // offer: document, accept, sample signature, confirmation
  await p.click(".wa__tab >> text=Review an offer");
  for (let i = 0; i < 2; i++) await p.click(".wa__ctl--next");
  await p.waitForTimeout(350);
  t = await texts();
  ok(`${tag}: offer — document card, accept, a generic sample signature, confirmation`, t.some((x) => /Offer letter — Sample Co\.pdf/.test(x)) && (await p.$$eval(".wa-file--sig", (x) => x.length)) === 1 && /recorded/.test(t.at(-1)), t.at(-1));
  await p.screenshot({ path: `${out}/${w}-${theme}-offer.png` });
  const h3 = await winH();
  ok(`${tag}: one window height across all four scenarios`, new Set([h0, h1, h2, h3]).size === 1, [h0, h1, h2, h3].join(","));
  ok(`${tag}: nothing live — no network requests while stepping through`, reqs === 0, `${reqs}`);
  ok(`${tag}: caption says it is illustrative and fictional`, /Illustrative workflows reconstructed using fictional information\. No employee data or proprietary application screens are shown\./.test(await p.textContent(".wa__caption")));
  ok(`${tag}: no page overflow`, (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  await ctx.close();
}
// reduced motion: messages appear without animation
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(`${base}/work/buzzworks`, { waitUntil: "networkidle" });
  await p.click(".wa__ctl--next");
  const anim = await p.$$eval(".wa-row", (r) => r.map((x) => getComputedStyle(x).animationName));
  ok("reduced motion: new messages simply appear", anim.every((a) => a === "none"), anim.join(","));
  await ctx.close();
}
await b.close();
const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} reconstruction checks passed`);
process.exit(passed === results.length ? 0 : 1);
