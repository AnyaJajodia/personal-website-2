// Selected-work panels + More bento interaction check (hover, keyboard focus, click).
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const widths = () =>
  page.$$eval(".panels__row", (rows) =>
    rows.map((r) => [...r.children].map((li) => Math.round(li.getBoundingClientRect().width)))
  );
const bodyOpacity = (slug) =>
  page.evaluate((s) => {
    const a = document.querySelector(`.panel a[href="/work/${s}"]`);
    return getComputedStyle(a.closest(".panel").querySelector(".panel__body")).opacity;
  }, slug);
const shot = async (name) => {
  const box = await page.locator(".panels").boundingBox();
  await page.screenshot({ path: `qa/screenshots/${name}.png`, clip: { x: box.x - 20, y: box.y - 20, width: box.width + 40, height: box.height + 40 } });
};
await page.locator(".panels").scrollIntoViewIfNeeded();
await page.mouse.move(5, 5);
await page.waitForTimeout(900);
console.log("default widths", JSON.stringify(await widths()), "crackd body", await bodyOpacity("crackd-ai"));
await shot("it2-panels-default");

await page.hover('.panel a[href="/work/buzzworks"]');
await page.waitForTimeout(1000);
console.log("hover buzzworks", JSON.stringify(await widths()), "body", await bodyOpacity("buzzworks"), "crackd body", await bodyOpacity("crackd-ai"));
await shot("it2-panels-hover-buzzworks");

await page.mouse.move(5, 5);
await page.focus('.panel a[href="/work/crackd-ai"]');
for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
await page.waitForTimeout(1000);
const f1 = await page.evaluate(() => document.activeElement.getAttribute("href"));
console.log("tab x3 →", f1, JSON.stringify(await widths()), "body", await bodyOpacity("inteli-lens"));
await shot("it2-panels-focus-inteli");

for (let i = 0; i < 2; i++) await page.keyboard.press("Tab");
await page.waitForTimeout(1000);
const f2 = await page.evaluate(() => document.activeElement.getAttribute("href"));
console.log("tab x2 more →", f2, JSON.stringify(await widths()), "body", await bodyOpacity("pmmy-research"));
await shot("it2-panels-focus-group");
await page.keyboard.press("Tab");
const f3 = await page.evaluate(() => document.activeElement.getAttribute("href"));
console.log("next tab →", f3);

// nested interactive elements?
const nested = await page.$$eval(".panels a", (as) => as.filter((a) => a.querySelector("a, button")).length);
const names = await page.$$eval(".panels a", (as) => as.map((a) => a.getAttribute("href")));
console.log("links in panels:", names.join(" "), "| nested interactive:", nested);

// Experiments diagram
await page.locator(".bento__card--experiments").scrollIntoViewIfNeeded();
const nodes = page.locator(".lab__node");
await nodes.nth(0).hover();
await page.waitForTimeout(400);
const act = () => page.$$eval(".lab__node", (n) => n.map((g, i) => (g.classList.contains("is-active") ? i : null)).filter((x) => x !== null));
console.log("diagram hover node0 → active", await act(), "beams", await page.locator(".lab__beam").count(), "beam anim", await page.$eval(".lab__beam", (b) => getComputedStyle(b).animationName));
await nodes.nth(6).click();
await page.mouse.move(5, 5);
await page.waitForTimeout(300);
console.log("click node6 + leave → active (pinned)", await act());
const box = await page.locator(".bento").boundingBox();
await nodes.nth(4).hover();
await page.waitForTimeout(500);
await page.screenshot({ path: "qa/screenshots/it2-bento-hover.png", clip: { x: box.x - 20, y: box.y - 20, width: box.width + 40, height: box.height + 40 } });

// click a panel → route
await page.locator(".panels").scrollIntoViewIfNeeded();
await page.click('.panel a[href="/work/buzzworks"]');
await page.waitForURL("**/work/buzzworks");
console.log("click buzzworks →", page.url());
await page.goBack();
await page.waitForURL(base + "/");
await page.click('a.panel__sublink[href="/work/esp-teaching"]', { force: false }).catch(async () => {
  await page.hover('a.panel__sublink[href="/work/esp-teaching"]');
  await page.waitForTimeout(800);
  await page.click('a.panel__sublink[href="/work/esp-teaching"]');
});
await page.waitForURL("**/work/esp-teaching");
console.log("click grouped sub-link →", page.url());
await browser.close();
