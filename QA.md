# QA report — private preview, iteration 6 (21 Oct 2026)

**Preview:** http://localhost:3100 (production build, `npm run start`).

Iteration 6 is a focused polish of Selected work:
- muted coloured-paper palette
- three-layer logo identifiers
- flat panels
- a faint underdrawing beneath the About trajectory

Copy, dates, routes, panel behaviour, the two-row layout and mobile cards are unchanged.

## Commands and results (final build)

| Command | Result |
|---------|--------|
| `npm run typecheck` / `npm run lint` / `npm run build` | exit 0 / exit 0 / exit 0 (15 static pages) |
| `node qa/check.mjs` (production) | **116/116 PASS** → `qa/check-output.txt` (36/36 route × width: status 200, 0 overflow, 0 console errors, 0 failed requests) |
| `node qa/visible.mjs` 1440/1024/768/390 (+ reduced) | line in view at every 40 px position forward and back (minimum 597 / 498 / 687 / 486 px; reduced 987 px), monotonic, reversible, no text crossings → `qa/visible-output.txt` (see note) |
| `node qa/pen.mjs` 1440/768/390 | monotonic, reversible, no jumps, tip on screen → `qa/pen-output.txt` |
| `node qa/milestone.mjs` | milestones 1→5; layout unchanged by emphasis → `qa/milestone-output.txt` |
| `node qa/context-shots.mjs before|after` | in-context captures at 1440/768/390; **no console errors** |
| Impeccable detector (`detect.mjs --json`, changed files) | **0 findings** |

**Reversal note:**
- The first `visible.mjs` run at 768 after the server started reported `reversible: false`.
- Six further runs (768 ×3, 1440, 390, plus the final set) were reversible, and the script now also reports whether the route was rebuilt mid-run (it was not, in any of them).
- The cause of that first result was not found, so it is recorded as intermittent rather than resolved.

### New and updated checks in `qa/check.mjs` (116)
- **Identifier container:** one size and shape for all seven panels (60×60, 6 px). Its background alpha is between 0 and 1; the artwork has opacity 1 through every ancestor and `filter: none`.
- **Compact symbols:** Crackd and Buzzworks use the compact symbols, and Crackd's backing is charcoal.
- **Flat panels:** no gradients on the panel or its pseudo-elements, no watermark motifs, 2 px corners.
- **Palette:** the new palette, with Crackd unchanged.
- **Contrast:** charcoal text ≥ 4.5:1 on every panel (6.82–11.08), and small date/category text ≥ 4.5:1 (5.14–8.35).
- **Trajectory underdrawing** (at 1440/1024/768/390):
  - it uses the same `d` as the ink;
  - its opacity is ≤ 0.25;
  - it is dashed to cover only the trajectory span;
  - it sits beneath the ink;
  - it is hidden in reduced motion.
- **Carried over:** two rows of 240 px, width-only expansion, hover and keyboard expansion, grouped sub-links, 9 destinations with nothing nested, touch cards with summaries and dates, and the line checks.

## Browser inspection (captured and viewed)
- **Claude in Chrome:** not connected; Playwright driving installed Google Chrome was used.
- **Work section in context, before / after:** `qa/sheet-it6-before-work.png` / `qa/sheet-it6-after-work.png` (1440, 768, 390), and side by side at desktop: `qa/sheet-it6-before-after-desktop.png`.
- **Trajectory while scrolling:** before / after `qa/sheet-it6-before-traj.png` / `qa/sheet-it6-after-traj.png` (three forward positions plus one after scrolling back), with per-width frames in `qa/screenshots/ctx-after-{desktop,tablet,mobile}-traj-*.png`.
- **Panel states:** `qa/sheet-it6-panels.png` (resting with Crackd open; TMU hovered; Teaching sub-link keyboard-focused) and `qa/screenshots/it6-panels-touch.png` (390 touch, 2×: stacked cards, summaries and dates visible, logos opaque).

## Remaining limitations
- **Browser coverage:** the Claude in Chrome extension was not connected, so there was no check in your own Chrome profile. Only Chrome was tested.
- **Crackd yellow:** kept as requested; it is visibly the most saturated swatch.
- **TMU logo:** its lettering is very small at 1× inside the shared container.
- **Taller on small screens:** about 51 px on tablet and 91 px on phone, from the larger identifier containers.
- **Filename:** the compact Crackd file is `crackd-minimal.png` (no `crakd-minimal.png` exists); used unchanged.
- **Reversal audit:** one unexplained first-run result at 768 (see above).
- **Version control:** nothing has been committed or pushed.

---

# QA report — private preview, iteration 5 (21 Oct 2026)

**Preview:** http://localhost:3100 (production build, `npm run start`).

Iteration 5 is a refinement pass. Its scope:
- Hero dragonfly removed and the space held for an avatar.
- The line always partly in view.
- Two AMNH workstreams.
- Compact Crackd/Buzzworks symbols and the new panel palette.
- An empty Experiments plate.

Other copy, routes, typography, the cream foundation and the dot field are unchanged.

## Commands and results (final build)

| Command | Result |
|---------|--------|
| `npm run typecheck` / `npm run lint` / `npm run build` | exit 0 / exit 0 / exit 0 (15 static pages) |
| `node qa/check.mjs` (production) | **108/108 PASS** → `qa/check-output.txt` (36/36 route × width: status 200, 0 overflow, 0 console errors, 0 failed requests) |
| `node qa/visible.mjs` 1440/1280/1024/768/390, 40 px steps, forward then back | the drawn line is in view below the header at every position. Minimum visible: 597 / 522 / 498 / 687 / 486 px. Monotonic, reversible, no jumps, 0 text crossings → `qa/visible-output.txt` |
| `node qa/visible.mjs 1440x900 120 --reduced` | static full line; minimum 981 px visible; 0 text crossings |
| `node qa/pen.mjs` 1440/768/390 | monotonic ✓, reversible ✓, no jumps, pen tip always on screen → `qa/pen-output.txt` |
| `node qa/join.mjs` | line start within 0.05 px of the "a" tail → `qa/join-output.txt` |
| `node qa/hold.mjs` 1440/390 | drawn amount and scroll unchanged after 2 s idle at 4 positions each (holds) |
| `node qa/scroll-film.mjs` 1440/768/390 | 32 real-viewport frames each, scrolled by wheel forward then back: intermediate positions plus each section boundary at mid-viewport. 0 console errors; drawn amount identical forward and back (see note) |
| `node qa/milestone.mjs`, `node qa/dots.mjs` | milestones 1→5 with layout unchanged; dot field reacts, settles, pauses off-screen, static on touch and reduced motion |
| Impeccable detector (`detect.mjs --json`, changed files) | **0 findings** |

**Film reversal note:**
- The first film runs at 1440 and 768 reported one position each where forward and back differed.
- Cause: the script read the frame while Chrome's smooth wheel scrolling was still moving the page.
- After the script waited for the wheel animation to settle, five further runs (1440 ×2, 768, 390 ×2) matched at all 32 frames.
- The instant-scroll audits (`pen.mjs`, `visible.mjs`, `check.mjs`) were reversible throughout.

### New and updated checks in `qa/check.mjs` (108)
- **Hero:** no dragonfly; the avatar slot is empty and invisible; 0 line points inside it at 1440/1024/768/390.
- **Line:** never leaves the page horizontally, and partly in view at every 90 px scroll step, forward and back, at four widths. It ends under "Say hello.".
- **Panels:**
  - Crackd and Buzzworks use the `-minimal` files on round translucent backings.
  - The palette is as requested.
  - Text contrast ≥ 4.5:1 on all seven panels (5.05–12.22).
- **Currently:** the AMNH card lists both workstreams, with still two cards.
- **More:** Experiments has no graphic and reads "Later".
- **AMNH detail:**
  - Two separate sections, indexed.
  - Digitization copy preserved.
  - The research is described only as joining.
  - Three photo placeholders.
- **Removed checks:** the specimen-plate check, the off-stage check and the lens check.

## Browser inspection (captured and viewed)
- **Claude in Chrome:** not available this session ("Browser extension is not connected", two attempts). All inspection used Playwright driving installed Google Chrome (`channel: "chrome"`).
- **Scroll films:**
  - desktop forward and back: `qa/sheet-it5-film-desktop-{f,b}.png`
  - tablet: `qa/sheet-it5-film-tablet.png`
  - mobile: `qa/sheet-it5-film-mobile.png`
  - frames: `qa/screenshots/film-{desktop,tablet,mobile}/`
- **Review set:** `.impeccable/review/{desktop,tablet,mobile}.png` (full page, reduced motion) and `*-first-viewport.png`.
- **Panels:**
  - `qa/sheet-it5-panels.png` (resting, TMU hovered, Teaching link keyboard-focused)
  - `qa/screenshots/it5-panels-touch.png` (390 touch: stacked cards with summaries and dates)
- **Currently:** `qa/screenshots/it5-current.png`
- **More:** `qa/screenshots/it5-bento.png`
- **AMNH detail:** `qa/screenshots/it5-amnh-{1440,390}.png` (full page; no horizontal overflow)

## Remaining limitations
- **Browser coverage:**
  - The Claude in Chrome extension was not connected, so there was no inspection in your own Chrome profile or at its zoom level. Playwright-driven Chrome only.
  - Chrome only; Safari and Firefox are untested.
- **Reviewer:** no fresh-context finish-reviewer pass this round.
- **Narrow gutter:** on 390 px phones the line runs in a 20 px gutter (≥ 6 px from the edge), close to card edges.
- **Hero on tablet:** the avatar slot leaves a large intentional gap above the name on tablet.
- **Placeholders:** mantis research details, all AMNH photographs and the 2027 dates are still placeholders (EDITING_CHECKLIST.md).
- **Filename:** the supplied compact Crackd file is named `crackd-minimal.png`, not `crakd-minimal.png` as written in the brief; the existing file was used unchanged.
- **Version control:** nothing has been committed or pushed.

---

# QA report — private preview, iteration 4 (12 Oct 2026)

**Preview:** http://localhost:3100 (production build, `npm run start`).

Iteration 4 is the Impeccable design pass. Its scope:
- Hero plate, Currently plates, Selected Work refinements and the More drawings.
- The line's composition.
- Rhythm, typography and the ending.

Copy, facts, routes and detail pages are unchanged. Two things were removed: the visual section eyebrows ("01 / About" etc.), whose names remain in the nav; and blue on non-link text.

## Commands and results (final build)

| Command | Result |
|---------|--------|
| `npm run typecheck` / `npm run lint` / `npm run build` | exit 0 / exit 0 / exit 0 (15 static pages) |
| `node qa/check.mjs` (production) | **90/90 PASS** → `qa/check-output.txt` (36/36 route × width: 0 overflow, 0 console errors, 0 failed requests) |
| `node qa/pen.mjs` 1440/768/390 | monotonic ✓, reversible ✓, no jumps, pen tip always on screen → `qa/pen-output.txt` |
| `node qa/join.mjs` | line start within 0.01–0.05 px of the "a" tail at scroll 0/100/120/200 → `qa/join-output.txt` |
| `node qa/milestone.mjs` | milestone 1→5 as drawn; layout unchanged by emphasis → `qa/milestone-output.txt` |
| `node qa/dots.mjs` | animates near the pointer, settles and stops; paused off-screen; static on touch and reduced motion; `h1` under the cursor → `qa/dots-output.txt` |
| Impeccable detector (`detect.mjs --json`, changed files) | first run: 2 findings, both fixed; final run: **0 findings** |
| Finish reviewer (fresh-context subagent) | fix → fix → fix → **ship**, scoped to the scored fixes (REVIEW.md, iteration 4) |

### New and updated checks in `qa/check.mjs`
- **Line around the plate:** 0 points of the path fall inside the specimen plate (1440 and 390).
- **Off-stage through the work:** 0 visible path points beside the panels and More (1440 and 390).
- **Ending:** the path ends under "Say hello." (1440: end 96,4977 under heading bottom 4972; 390: likewise).
- **More:** the Experiments lens follows the pointer.
- **Reduced motion:** the Writing flourish doesn't animate.
- **Lynxster lockup:** at least 64 px and labelled.
- **Carried over:** panels (two rows, 220–250 px, expansion width-only, keyboard and hover, 9 destinations, nothing nested), logos undistorted, mobile cards with summaries and dates, Back restores scroll, line hold and retract and start-in-the-"a", reduced motion, keyboard rings.

## Browser inspection

### Playwright (captured and viewed)
- **Before (iteration-3 build):** `qa/screenshots/it3-before-*`; the iteration-3 after set at `qa/sheet-after3-*.png`.
- **Review set (final build):** `.impeccable/review/{desktop,tablet,mobile}.png` (full pages with reduced motion, so the whole line is visible) and `*-first-viewport.png`.
- **Working and close-up captures:**
  - Heroes at 1440/1280/768/390: `qa/sheet-it4-hero.png`, `it4-hero-final.png`
  - Currently: `it4-cur-1440.png`, `it4-cur-final.png`
  - Panels: `it4-panels-1440.png`
  - More: `it4-bento-final.png`, `it4-bento-lens.png`, `it4-bento-768.png`, `it4-photo-{1440,390}.png` → `qa/sheet-it4-photo.png`
  - Ending: the contact crop in scratchpad, plus `it4-b-1440-*.png` → `qa/sheet-it4-b.png`

### Claude in Chrome (your Chrome, 110% zoom, 1374 CSS px)
- **Images:** all six load (the funnel and five logos).
- **Hero:** the specimen plate is attached to the line.
- **Currently:** the plates render.
- **More:** a real hover moves the Experiments lens (330,96 → 231,124).
- **Panels:** rows are 234 px; the category echoes are gone.
- **Tablet and phone:** 768 and 390 iframes (media queries apply) show the plate above the name, the flourish slipping off the edge, the Currently plates stacked, no horizontal overflow (scrollWidth 768/390) and all images loaded.
- **Console:** no errors.

## Remaining limitations
- PRODUCT.md and DESIGN.md don't exist; record them with `/impeccable init` and `/impeccable document`. A newer Impeccable (v4.5.2) is available.
- The finish reviewer's final **ship** covers the fixes it scored across four rounds, not a fresh whole-surface review.
- Chrome only (Safari 16+ and Firefox 121+ are needed for `:has()`, container units and subgrid). Physical touch devices are untested.
- Illustrations are authored drawings, not records. The Lynxster crop is the only real product image, and the contact sheet stands in for photographs. The placeholders and 2027 dates listed in EDITING_CHECKLIST.md are unchanged.
- The Claude in Chrome capture artifact at 110% zoom (blank band, cropped edge) persists.
- Nothing has been committed, pushed or deployed.

---

## Iteration 3 report (12 Oct 2026)

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
