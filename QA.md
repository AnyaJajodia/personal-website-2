# QA report — private preview, iteration 3 (12 Oct 2026)

**Preview:** http://localhost:3100 (production build, `npm run start`). Port 3000 is another local app and was left untouched.

Iteration 3 is homepage-only:
- Supplied logos, compact bold Selected-work panels with dates, and larger Currently logos.
- Tighter spacing and an active trajectory milestone.
- Stronger More scenes and a graphic photo placeholder.
- A faint interactive dot field.

Copy, facts, routes, detail pages, the hero and the line route are unchanged.

## Commands and results (final run)

| Command | Result |
|---------|--------|
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0; ✓ 15 static pages (`/`, 11 × `/work/[slug]`, `/_not-found`, `/icon.svg`) |
| `node qa/check.mjs` (production) | **84/84 PASS**, exit 0 → `qa/check-output.txt` (36/36 route × width checks) |
| `node qa/pen.mjs` 1440/768/390 | monotonic ✓, reversible ✓, no jumps, pen tip always on screen → `qa/pen-output.txt` |
| `node qa/join.mjs` 1440/390 | line start within 0.02–0.03 px of the "a" tail at scroll 0/100/120/200 → `qa/join-output.txt` |
| `node qa/milestone.mjs` 1440/390 | active milestone 1→5 as the pen advances; **layout unchanged by emphasis: true** → `qa/milestone-output.txt` |
| `node qa/dots.mjs` | interactive → animates near the pointer → settles and stops; hidden when scrolled away; static on touch and reduced motion; `h1` under the cursor → `qa/dots-output.txt` |

### New checks in `qa/check.mjs`
- **Panels:**
  - Two rows, 240 / 240 px.
  - Every collapsed panel shows a logo or mark, a name of at least 18 px, and dates from content: `Sep 2025–2027 · May 2025–2027 · May 2025–2027 · — · — · 2022 · Jan 2024–2027`.
  - Hover opens a panel and reveals its summary.
  - **Expansion changes width only**: all heights stay 240, and the Buzzworks logo offset stays 19 → 19 px.
  - Keyboard focus opens Inteli-lens, and grouped sub-links are reachable.
  - 9 destinations, 0 nested interactive elements.
- **Mobile/touch (390):** cards with summaries and dates visible.
- **Logos:** all 5 supplied logos load undistorted (rendered/file ratio: amnh 4.59/4.59, crackd 2.40/2.40, buzzworks 3.77/3.77, tmu 1.83/1.83, gvi 1.27/1.27). The Lynxster lockup is 189×116 px and labelled.
- **Dot field:** reacts to the pointer, then settles to `animating=false`. Static on touch and with reduced motion.
- **Trajectory:** the reached milestone is emphasised.
- **Carried over from iteration 2 (all pass):**
  - Routes at 3 widths (0 overflow, 0 console errors, 0 failed requests) and the 404 route.
  - Header anchors, the sticky header, and Back restoring scroll (2844 → 2844).
  - Line: extends, holds, retracts exactly, and starts inside the "a" (0.03 px).
  - Reduced motion, keyboard rings on every stop, and content integrity.

### Laptop fit (Selected-work heading + both rows)
Label-to-last-row span vs viewport minus header: **1366×768: 693 ≤ 700 ✓**, 1280×800: 664 ≤ 732 ✓, 1440×900: 709 ≤ 832 ✓.

### Contrast (computed, WCAG)
- Ivory `#fbf9f5` on violet 11.8, TMU blue 7.2, indigo 6.2, raspberry 5.9, teal `#07757A` 5.2.
- Ink `#1d1a17` on orange 5.9, golden yellow 11.1.
- The requested teal `#087F83` measured 4.57 with ivory, so it was deepened slightly.

## Browser inspection

### Playwright screenshots (captured and viewed)
- **Before (iteration-2 build):** `qa/screenshots/it3-before-1440-{0,1000,2050,2650,3300,3950,5002}.png` → `qa/sheet-it3-before.png`.
- **After (final production build):**
  - `after3-1440-{0,1000,1950,2550,3300,4457}.png` → `qa/sheet-after3-1440.png`
  - `after3-768-{0,1900,2900,3700}.png` → `qa/sheet-after3-768.png`
  - `after3-390-{0,1150,2300,3500,4700,6814}.png` → `qa/sheet-after3-390.png`
  - `after3-hero-1440.png` (dot field at rest)
- **Panels:**
  - Default and keyboard focus on a Teaching sub-link: `after3-sel-1440(-focus).png` → `qa/sheet-after3-sel.png`.
  - Hover TMU at 1440, Publications at 1280, laptop 1366×768, focus at 1024: `it3-sel-*`, `it3-panels-{1280,1024,768,390}.png`.
- **Currently:** `it3-cur-1440(-hover).png`, `it3-cur-390.png`.
- **More:** `it3-bento-1440b.png`, `it3-bento-390.png`, `it3-bento-768.png`, `it3-photo-{390,768}.png`.
- **Dot field (rest vs pointer):** `it3-dots-{rest,pointer}.png` → `qa/sheet-it3-dots.png`.
- **Trajectory with active milestone:** `it3-milestone-{1440,390}.png`.
- **Join close-ups:** `after3-join-*.png`.

### Claude in Chrome (the user's Chrome, 110% zoom, 1374 CSS px wide)
- **Hero:** the dot field is visible and interactive, and the line is joined to the "a".
- **Logos:** all 5 supplied images load. The Currently cards show the Lynxster lockup and the AMNH wordmark clearly.
- **Real hover on Buzzworks:** it opens to 601 px with its summary, the second row keeps GVI open, and every panel stays 234 px tall.
- **Tablet and phone:** the homepage was loaded in 768 px and 390 px iframes inside your Chrome, so media queries apply (the window wasn't resized).
  - Two-column cards at 768, one column at 390.
  - Summaries visible on every card, all 5 dates shown, logos loaded.
  - Line in narrow layout.
- **Console:** `read_console_messages`, errors only: none.

## Routes checked
`/` · all 11 `/work/*` routes · `/work/not-a-project` (404), each at 375, 768 and 1440 px.

## How to run
```bash
npm install
npm run dev          # http://localhost:3100
npm run check        # typecheck + lint + build
npm run start        # production preview on :3100
node qa/check.mjs    # functional suite (server running)
node qa/pen.mjs 1440x900 · node qa/join.mjs 1440x900 join · node qa/milestone.mjs 1440x900 · node qa/dots.mjs · node qa/panels.mjs
node qa/shoot-el.mjs 1440x900 ".selected" name [--hover=sel] [--focus=sel] [--touch] [--reduced]
```

## Remaining limitations
- Tested in Chrome only. The panels need `:has()` and container query units, and Currently needs subgrid (Safari 16+, Firefox 121+). Safari, Firefox and physical touch devices were not tested.
- Logos are used as supplied, without brand guidelines. Panel colours are portfolio colours, not brand tokens.
- No start dates exist for GVI or Inteli-lens, so those panels show no date. Other placeholders are unchanged: Lynxster screenshot, AMNH/GVI photographs, LinkedIn, résumé and paper URLs, 2027 end dates (EDITING_CHECKLIST.md).
- The Claude in Chrome capture at 110% zoom adds a blank band and crops the right edge. DOM checks in Chrome confirm the layout is correct.
- Nothing has been committed, pushed or deployed.

---

## Iteration 2 report (12 Oct 2026)

**Preview:** http://localhost:3100. This is the production build, run with `npm run start`. Port 3000 is another local app and was left untouched.

Iteration 2 changed the homepage visuals and motion only:
- The line's route, its join with the name, and its colour.
- Currently, Selected work and More.
- Section spacing.

Copy, facts, routes and the 11 detail pages are unchanged. Iteration-1 results are summarised at the end.

## Stack
- **Framework:** Next.js 16.4.0 (App Router; every route is statically prerendered), React 19.3.0, TypeScript 5.9.3.
- **Lint:** ESLint 9 with eslint-config-next 16.4.0.
- **Fonts:** @fontsource Cormorant Garamond and Inter Variable, self-hosted.
- **Testing:** Playwright 1.64.0 (dev only, drives the installed Google Chrome).
- **Libraries:** no animation or UI library was added. The More grid adapts Magic UI's BentoGrid/BentoCard pattern (https://magicui.design/docs/components/bento-grid), with its Marquee and Animated Beam effects, written in plain CSS and React.

## Commands and results (final run, after all fixes)

| Command | Result |
|---------|--------|
| `npm run typecheck` | exit 0, no errors |
| `npm run lint` | exit 0, no warnings |
| `npm run build` | ✓ compiled; 15 static pages: `/`, 11 × `/work/[slug]`, `/_not-found`, `/icon.svg` |
| `node qa/check.mjs` (production server) | **75/75 PASS**, exit 0 → `qa/check-output.txt` |
| `node qa/pen.mjs` at 1440×900, 768×1024, 390×844 | monotonic ✓, reversible ✓, no jumps, pen tip always on screen → `qa/pen-output.txt` |
| `node qa/join.mjs` at 1440 and 390 | line start within **0.02–0.03 px** of the calibrated point inside the "a" at scroll 0/100/120/200 → `qa/join-output.txt` |
| `node qa/panels.mjs` | hover, Tab focus, grouped sub-links, click → route, diagram hover/pin all as expected (output in REVIEW.md #2, #6) |

### What `qa/check.mjs` verifies (Playwright + Chrome)
- **Routes:**
  - All 12 routes × 3 widths (375, 768, 1440): HTTP 200, one `<h1>`, 0 px horizontal overflow, 0 console errors, 0 failed requests (36/36).
  - An unknown slug returns 404.
- **Navigation:**
  - The header anchors land at 67 px.
  - Sticky header: the name is hidden over the hero and appears once the hero name has scrolled away.
  - A direct load of `/#contact` lands on Contact.
  - All 11 detail routes are linked from the homepage.
  - A panel opens its page, and **Back restores scroll** (3078 → 3078).
  - *Back to work* and the detail-page *About* link land correctly, and *Next* works.
- **Line:**
  - It is shown only after the web font is ready.
  - Drawn fraction 0.093 → 0.132 → 0.410 → 0.774 at scroll 0/500/1300/3500.
  - The path geometry never changes, so nothing drifts.
  - It holds after 1.5 s idle, and reverse scroll restores identical dash offsets.
  - It starts inside the final "a" (0.03 px) at scroll 0/150/300.
  - It has `pointer-events: none`, and points on the line hit-test to the `h1`.
- **Reduced motion:**
  - The complete line is drawn statically (no dash), and the path is unchanged on scroll.
  - The bento marquee is stopped (`animation-name: none`), and there's no CSS smooth scroll.
  - Detail-page lines are fully drawn.
- **Keyboard:**
  - The skip link is first, then About/Work/More/Contact, the cue, *Explore Lynxster* and *Explore AMNH* (ring drawn on the card), then the panels. Every stop shows a visible ring.
  - The detail-page brand is reachable.
- **Panels:**
  - The first panel is open by default (688 px vs 172 px collapsed).
  - Hover expands a panel and reveals its summary. Tab focus expands Inteli-lens.
  - Tabbing into the grouped panel reaches the PMMY sub-link and opens the panel.
  - 9 destinations, 0 nested interactive elements.
- **Bento:**
  - The diagram responds to the pointer (2 beams from the hovered node).
  - The placeholders contain no links or buttons.
- **Mobile/touch (390, `hasTouch`):** stacked cards with every summary visible (spine hidden, 349 px wide), and Currently stacks.
- **Content:** the real Lynxster logo returns 200, every `role="img"` is labelled, and there are no empty or TODO hrefs.

### Line calibration
`qa/measure-tail.mjs` renders the name at 4× with the line hidden, at 1440 px (208 px type) and 390 px (93.6 px type). The tail tip of the final "a" sits **+0.031 em / −0.050 em** from the end of the glyph's advance on the baseline at both sizes. The exit angle is about 26° (from the tail edges in `qa/screenshots/tail-1440.png`). The line starts 0.06 em inside the tail along that angle, and its first 0.26 em blends from ink to plum.

### Contrast (computed, WCAG)
- Ivory `#f7f4ee` text on the panel tones: umber 6.65, ochre 6.03, slate 7.63, graphite 7.51, olive 6.13, wine 8.02, teal 6.85.
- Secondary panel text `#e3ddd2`: ≥ 4.9 on every tone.
- Iteration-1 page contrasts are unchanged (text 14.3:1, muted 5.8:1, accent 7.5:1 on ivory).
- The plum line is decorative.

## Browser inspection

### Playwright screenshots (captured and viewed)
- **Before (iteration-1 build):** `qa/screenshots/it2-before-1440-{0…5200}.png`, `it2-before-{1440,768,375}-full.png`; sheet `qa/sheet-it2-before-a.png`.
- **After (final production build):**
  - `qa/screenshots/after-1440-{0,450,1000,1500,2050,2650,3300,3950,4600,5002}.png` → `qa/sheet-after-1440.png`
  - `after-768-{0,700,1300,2300,3300,4935}.png` → `qa/sheet-after-768.png`
  - `after-390-{0,600,1200,2200,3600,5200,6920}.png` → `qa/sheet-after-mobile.png`
- **Name join:** `qa/screenshots/after-join-*.png`, `join-*.png` → `qa/sheet-join.png` (1440 at scroll 0/120; 390 at 0/100/200).
- **Panels and bento:** `it2-panels-{default,hover-buzzworks,focus-inteli,focus-group}.png`, `it2-bento-hover.png` → `qa/sheet-it2-panels.png`. Card focus ring: `it2-focus-card.png`.
- **Reduced motion, full page:** `it2-full-{1440x900,768x1024,390x844}.png` → `qa/sheet-it2-full-{1440,768,390}.png`.
- **Detail pages (regression check, 1440):** `it2-detail-{lynxster,amnh,tmu-citation-tooling}.png` → `qa/sheet-it2-d.png`. Unchanged.

### Claude in Chrome (the user's Chrome, 110% zoom)
- **Homepage at 1374 CSS px wide:**
  - The first look found the line apparently detached from the "a" (REVIEW #4). The rebuild was fixed, and two fresh captures show it attached.
  - Scrolled through the hero sway, the sweep and trajectory, and the Currently knot and cards.
- **Real mouse hover:** opened *Research tooling* (683 px, summary visible), with the other panels at 171 px.
- **Tablet and phone:** the site was loaded in 768 px and 390 px iframes inside the user's Chrome, so media queries apply; the window was not resized.
  - Both frames use the narrow route; the line is 2.5 px and 2 px.
  - Panels show as a 2-column grid at 768 and 1 column at 390, and the line is attached at both.
  - Drawn fraction 0.28/0.18 → 0.71/0.60 forward, and exactly 0.28/0.18 again after scrolling back.
- **Console:** `read_console_messages`, errors only: none.

## Routes checked
`/` · `/work/lynxster` · `/work/amnh` · `/work/crackd-ai` · `/work/buzzworks` · `/work/tmu-citation-tooling` · `/work/inteli-lens` · `/work/gvi-conservation` · `/work/pmmy-research` · `/work/teenage-pregnancy-research` · `/work/esp-teaching` · `/work/adi-mentorship` · `/work/not-a-project` (404)

## How to run
```bash
npm install
npm run dev            # http://localhost:3100 (development)
npm run check          # typecheck + lint + production build
npm run start          # http://localhost:3100 (production preview)
node qa/check.mjs      # functional suite (server running)
node qa/pen.mjs 1440x900          # line draw/retract audit
node qa/join.mjs 1440x900 join    # name-join close-ups + numeric check
node qa/panels.mjs                # panel/bento interaction walkthrough
node qa/shoot.mjs / 1440x900 name --scroll=0,800 [--full] [--reduced]
```

## Remaining limitations
- The three reference recordings named in the brief were not found on this machine, so this pass follows the written specification.
- No AMNH logo was supplied, so a typographic placeholder is used. Other placeholders are unchanged: Lynxster screenshot, AMNH/GVI photographs, LinkedIn, résumé and paper URLs, 2027 end dates (see EDITING_CHECKLIST.md).
- Tested in Chrome only. The panels rely on `:has()` and the Currently alignment on CSS subgrid (Safari 16+, Firefox 121+), but Safari, Firefox and real touch devices were not tested.
- The Claude in Chrome capture at 110% zoom adds a blank band and crops the right edge. Visual sign-off uses the Playwright captures plus DOM checks in Chrome.
- Nothing has been committed, pushed, or deployed. `qa/screenshots/` is git-ignored.

---

## Iteration 1 summary (11 Oct 2026)
- typecheck, lint and build passed, and the 63-check suite passed 63/63. That suite covered the routes at 3 widths, anchors, Back restoration (4069 → 4069), the line's morph, hold and reverse, reduced motion, keyboard and content checks.
- The Claude in Chrome inspection showed no console errors, and Back restored 4227 → 4227.
- Screenshots: `qa/sheet-final-a.png`, `qa/sheet-final-b.png` and the earlier iteration sheets.
