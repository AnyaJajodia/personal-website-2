# QA report — iteration 14: homepage copy from the revised home.md (25 Oct 2026)

**Preview:** http://localhost:3100 (production build). Chrome was driven by Playwright; the Claude in Chrome extension is still "not connected".

| Command | Result |
|---------|--------|
| `npm run typecheck` / `lint` / `build` | 0 / 0 / 0 |
| `node qa/copy.mjs` (new) | **93/93**. Covers: all 53 home.md strings present; no retired copy in page, title or description; roles/dates in their metadata positions; panel dates; contact links. Then, at 1920 / 1440 / 1280 / 1024 / 768 / 390 / 360 in Light and Dark: no horizontal overflow; hero text clear of the figure; every trajectory note inside its band; Currently cards stack cleanly; every work panel's summary fits when opened (hover on desktop, stacked on touch) |
| `node qa/check.mjs` | **184/184**. The panel-row check is now "≥ 220px, sized to the longest summary, ≤ 300px"; the AMNH stream names were updated |
| `node qa/interact.mjs` | **33/33** |
| `node qa/hero-rig.mjs` | **16/16**. The first run right after a cold server start failed the two keyboard-focus checks; two reruns passed 16/16, and the tagline change adds nothing focusable |
| `node qa/theme.mjs` | **19/19** |
| `node qa/contrast-audit.mjs` | 0 text runs below AA; smallest homepage text 5.57:1 in dark |
| `node qa/visible.mjs` | pass (monotonic, reversible, no jumps) |

**Screenshots viewed** (`qa/screenshots/copy/`):
- `hero-{1440,1280,1024,768,390}-*`
- `traj-{0–4}-{1440,390}-*`, `about-full-{1440,390}-*`
- `currently-1440-{light,dark}`
- `panel-{0–6}-{1440,1024}-*`
- `selected-{768,390}-light`
- `contact-{1440-dark,390-light}`, `footer-390-dark`

The dev overlay pill seen in the early captures is absent from the production run.

**Remaining discrepancies (content):** the homepage and detail pages now disagree on several roles and dates; see EDITING_CHECKLIST.md §1 "Homepage dates and roles now differ". The detail-page pass will reconcile them.

---

# QA report — iteration 13: corrected matcha hand, motion, dark polish (23 Oct 2026)

**Preview:** http://localhost:3100 (production build). Chrome was driven by Playwright; the Claude in Chrome extension is still "not connected".

| Command | Result |
|---------|--------|
| `npm run typecheck` / `lint` / `build` | 0 / 0 / 0 (the build retried once on Next.js's security notice) |
| `node qa/check.mjs` | **184/184** |
| `node qa/interact.mjs` | **33/33** |
| `node qa/hero-rig.mjs` | **16/16**: first-frame visible; entry swing after the line reaches the seat (560 → 677ms); no stacking; offscreen stop; touch; reduced motion |
| `node qa/theme.mjs` | **19/19**: System default and live OS changes, no first-frame flash, persistence, keyboard menu, scroll and interaction state kept |
| `node qa/contrast-audit.mjs dark` | every text run ≥ AA on 5 pages; smallest text ≥ 5.57:1 (was 4.37) → `qa/contrast-dark-output.txt` |
| `node qa/contrast-audit.mjs light` | every text run ≥ AA; smallest ≥ 5.14:1 (unchanged) |
| `node qa/visible.mjs` 1440 / 1024 / 768 / 390 | pass forward and back, reversible |
| `node qa/av-detail.mjs` 1440 / 390 | project pages clear, 0 console errors |
| Impeccable detector | 0 findings |

**Corrected hand:**
- **Served copy:** the site requests `/assets/avatar/rig/forearm-matcha.avif?v=2`, re-exported from your new PNG.
- **Geometry:** it matches the old canvas (straw tip within 3px, sleeve unchanged).
- **Poses:** rest, the 7° cheers and the 9° limit were captured in both themes: `qa/screenshots/avatar/rig-cheers-light.png` and `rig-cheers-dark.png`. The wrist stays inside the cuff and the cup stays upright.

**Screenshots, viewed:** `ud-sheet.png` / `ul-sheet.png` (dark / light, 1440), `um-sheet.png` (dark, 390), `cur-dark.png` (Currently alignment).

**Limitations:**
- **Testing:** Chrome only; touch and OS colour scheme emulated.
- **Hair scribbles:** the burgundy scribbles in the artwork read softer on the dark page. They are still visible, so they're left as drawn, with no filter.
- **Unused files:** the hero pack's preview and doc files in `public/` are unreferenced but would be published if deployed.
- **Next.js:** the security notice is unchanged.
- **Not done:** nothing committed.

---

# QA report — iteration 12: layered hero rig + light/dark theme (23 Oct 2026)

**Preview:** http://localhost:3100 (production build). Chrome was driven by Playwright; the Claude in Chrome extension is still "not connected".

| Command | Result |
|---------|--------|
| `npm run typecheck` / `lint` / `build` | 0 / 0 / 0 (the build retried once on Next.js's security notice) |
| `node qa/check.mjs` | **184/184** |
| `node qa/interact.mjs` | **33/33** |
| `node qa/hero-rig.mjs` | **16/16** |
| `node qa/theme.mjs` | **19/19** |
| `node qa/visible.mjs` 1440 / 1024 / 768 / 390 | pass forward and back (minimum in-view line 597 / 498 / 687 / 501 px), monotonic, reversible |
| `node qa/av-detail.mjs` 1440 / 390 | project pages: figures clear of text, 0 console errors |
| Impeccable detector | 0 findings |

**`qa/hero-rig.mjs` results:**
- **First frame:** all four layers painted, decoded and opaque on the first frame (76ms); the box is reserved, with no shift.
- **Entry:** the line reaches the seat at ≈570ms, then exactly one swing (≈690ms); no idle loop afterwards.
- **Hover:** swings the two lower legs only; repeated hovers and clicks while it plays don't stack; it settles to `transform: none`.
- **Cup:** raises only the forearm, and repeats are ignored; the target is ≥ 44px and labelled.
- **Keyboard:** focus on her swings the feet with a visible dashed ring; focus on the cup cheers.
- **Offscreen:** scrolling away stops a gesture.
- **Touch:** a tap on her swings; a tap on the cup cheers.
- **Reduced motion:** resting pose, working targets, nothing moves.
- **Joints at maximum rotation** (legs −2.5° / +2°, forearm −9°) were captured in both themes: `qa/screenshots/avatar/rig-sheet-light.png` and `rig-sheet-dark.png`. No exposed joints or detached feet.

**`qa/theme.mjs` results:**
- **System:** the default, following live OS changes (light → dark → light); no hydration warnings.
- **No flash:** the first frame already has the saved or system theme in all three cases (saved dark on a light OS, saved light on a dark OS, system dark).
- **Toggle:** it sits after Contact and is labelled. Enter opens System / Light / Dark with the current one checked and focused; arrows + Enter choose; the choice is stored and focus returns to the button; Escape closes.
- **Switching:** keeps the scroll position and an open trajectory note. A running cheers keeps going through a switch (verified: one keyframe animation, plus the colour transition).
- **Persistence:** the choice persists across pages and reloads, and ignores later OS changes; choosing System clears it.
- **Dark contrast:** text ≥ 5.79:1 and headings ≥ 12.4:1 on /, /work/amnh, /work/lynxster and /work/crackd-ai. No `invert` filter anywhere.

**Screenshots, viewed:**
- **Light / dark at 1440:** `tl-sheet.png`, `td-sheet.png`.
- **Project pages, dark:** `td-sheet-work.png`.
- **Dark at 390:** `tdm-sheet.png`.
- **System-dark at 768, and the menus:** `tdt-sheet.png`.
- **Narrow rig heroes:** `rig-hero-narrow.png`.

**Limitations:**
- **Testing:** Chrome only. Touch and the OS colour scheme were emulated.
- **Rig source:** the pack was found in `public/assets/avatar/hero-interactions/`, not `handoff/assets/avatar/`. Its preview JPG/GIF and docs stay there, unreferenced; they would be published if deployed.
- **Hair outline in dark:** the maroon scribble outline in the avatar artwork is lower-contrast on the dark page. It is left as drawn, not recoloured.
- **Next.js:** the security notice is unchanged.
- **Not done:** nothing committed.

---

# QA report — iteration 11: interaction & finish pass (23 Oct 2026)

**Preview:** http://localhost:3100 (production build). Chrome was driven by Playwright; the Claude in Chrome extension still reports "Browser extension is not connected".

| Command | Result |
|---------|--------|
| `npm run typecheck` / `lint` / `build` | 0 / 0 / 0 (the build retried once on Next.js's security notice) |
| `node qa/check.mjs` | **184/184 PASS** → `qa/check-output.txt` |
| `node qa/interact.mjs` | **33/33 PASS** → `qa/interact-output.txt` |
| `node qa/visible.mjs` 1440 / 1280 / 1024 / 768 / 390 | pass forward and back (minimum in-view line 597 / 522 / 498 / 687 / 501 px), monotonic, reversible, no text crossings |
| `node qa/av-edge-scroll.mjs` 1440, 1920 | the peeker's slide is reversible sample-for-sample and holds when scrolling stops |
| knot handles across a resize (1440 → 1100 → 768 → 390 → 1440) | handles stay on the line (2–10px from the path); overflow 0 |
| `node qa/av-detail.mjs` 1440 / 390 | project pages: figures clear of text, 0 console errors |
| Impeccable detector | 0 findings |

**What `qa/interact.mjs` covers:**
- **Thread:** a drag changes only segments within 82px of the knot (one continuous path); the knot's travel is bounded; surrounding content doesn't move; release settles to the identical path; Enter plucks and arrows tug; a touch tap plucks; no handles with reduced motion.
- **Trajectory:** picking moves the highlight only to that milestone; one aside at a time, quoted from the About text; zero layout shift when switching; picking again releases; keyboard focus picks.
- **Taped previews:** the corner lifts from the taped corner; the shadow follows; the tape doesn't move; the arrow draws; the same on keyboard focus.
- **Panels:** the order is widen → summary → arrow (measured at 120 / 330 / 520 / 900ms); 0 default-panel flashes across rapid switching; open summaries aren't clipped; leaving restores the default.
- **Edge peeker:** shy on hover and back on leave; hide → check → out; mid-sequence re-press restarts cleanly; keyboard activation works; the whole figure stays inside her lane, 150px clear of the cards.
- **More and Contact:**
  - viewfinder corners close in on hover and focus;
  - the pen finishes its stroke;
  - Experiments stays empty;
  - copy-email copies the address (clipboard verified) and shows "Copied" with a drawn check;
  - the greeter has settled as Contact comes into view.

**Screenshots, viewed:**
- in-section captures: `qa/screenshots/avatar/r1-sheet.png` (1440), `r2-sheet-768.png`, `r2-sheet-390.png`, `r3-aside.png`, `r4-hero-zoom.png`, `r4rm-1440-*` (reduced motion);
- interaction frames: `ix-sheet-thread.png` (pull and elastic return), `ix-sheet-panels.png` (open sequence), `ix-sheet-peek.png` (lean, shy, peekaboo), `ix-preview-lift.png`, `ix-traj-pick.png`, `ix-photo.png`, `ix-writing.png`, `ix-copy.png`.

**Limitations:**
- **Testing:** Chrome only; touch is emulated.
- **Edge peeker:** shown only on hover-capable screens ≥ 1200px.
- **Thread:** the tuggable knots exist where the route draws them (the hero loop only where there is room beside the name; the "Say hello" loop only at ≥ 860px).
- **Next.js:** the security notice is unchanged.
- **Not done:** nothing committed.

---

# QA report — iteration 10: personality pass (23 Oct 2026)

**Preview:** http://localhost:3100 (production build). Chrome was driven by Playwright; the Claude in Chrome extension was still "not connected".

| Command | Result |
|---------|--------|
| `npm run typecheck` / `lint` / `build` | 0 / 0 / 0 (the build retried once on Next.js's security notice) |
| `node qa/check.mjs` | **184/184 PASS** |
| `node qa/visible.mjs` 1440 / 1728 / 1100 / 768 / 390 | pass forward and back; minimum in-view line 597 / 765 / 522 / 687 / 504 px; monotonic, reversible, no text crossings |
| `node qa/av-edge-scroll.mjs` 1440 / 1100 / 1728 | the slide is reversible sample-for-sample and holds when scrolling stops; she is fully out before the cards are readable (1440: out by scroll 2258, readable at 2274) |
| `node qa/av-detail.mjs` | project pages clear of text, 0 console errors |
| `node qa/av-perf.mjs` | 33.3ms frames with the effects on and with them stripped: this machine's Chrome is capped at 30fps even when idle, so the effects add no measurable frame cost |
| Impeccable detector | 0 findings |

**Screenshots, viewed:**
- `qa/screenshots/avatar/p1-sheet.png` (1440, every section);
- `p2-sel.png` and `p2-cur.png` (1728);
- `p3-sheet-390.png` (phone);
- `es-strip.png` (scroll-linked slide);
- `nav-hover.png` and `amnh-plates.png`.

**Limitations:** Chrome only. The edge peeker shows only at ≥ 1100px. The Next.js security notice is unchanged. The source pack in `public/assets/avatar/` would be published if deployed. Nothing is committed.

---

# QA report — iteration 9: bold avatar pass (23 Oct 2026)

**Preview:** http://localhost:3100 (production build).
**Browser:** Google Chrome through Playwright. The Claude in Chrome extension again reported "Browser extension is not connected". Motion was checked per animation frame, plus frozen-frame captures of the matcha plume and frame strips of the edge peeker.

## Commands and results (production build)

| Command | Result |
|---------|--------|
| `npm run typecheck` / `lint` / `build` | 0 / 0 / 0 (the first build stopped on Next.js's security notice; the retry passed) |
| `node qa/check.mjs` | **184/184 PASS** → `qa/check-output.txt` |
| `node qa/visible.mjs` 1440/1100/1024/768/390 | pass forward and back, minimum in-view line 597 / 522 / 498 / 687 / 504 px, monotonic, reversible, no rebuild → `qa/visible-output.txt` |
| `node qa/av-edge.mjs` 1440, 1100 | see the edge-peeker details below |
| `node qa/av-hero.mjs` (1024 → 1920, 768, 600, 390, 375×667, 667×375) | her head clears the header at every size (≥ 18px); her feet stay inside the hero; the about heading starts 737–1026px down, right at the foot of each desktop screen |
| `node qa/av-matcha.mjs` 1440 / 390 touch | hover, keyboard focus, Enter and tap all fizz; the figure never moves |
| `node qa/av-density.mjs` 1920 → 390 | at most 2 figures in view |
| `node qa/av-detail.mjs d4` 1440 / 390 | 11 project pages: figures clear of text, 0 console errors |
| Impeccable detector (changed files) | 0 findings |

**Edge peeker (`av-edge.mjs`):**
- **Timing:** enters at scroll 1852, settled by 1978; the cards become readable at 2274 (1440).
- **Clearance:** never closer than 36px to a card in any frame, through her entrance and rapid switching.
- **Lean:** further cards draw her further out; keyboard focus leans her too; leaving returns her to neutral.
- **Peekaboo:** hide → check → out, by click and by keyboard.
- **Leaving:** she scrolls away with the section; horizontal overflow is 0.

**New and changed checks:**
- **Figure sets:** hero, untangler, edge peeker (≥ 1100px) and greeter. No figure in the trajectory or in More.
- **Edge peeker:** settled before the cards are readable (1440, 1100); ≥ 24px from the cards in every frame; lean by pointer and keyboard, neutral after leaving; peekaboo by click and keyboard; labelled, focusable button; leaves with the section, no overflow; hidden at 1024.
- **Matcha:** a labelled ≥ 44px button over the cup. It fizzes on hover and keyboard focus (1440) and on tap (390); every bubble and mark animates; the figure stays put.
- **Assets:** AVIF only, and only displayed figures load.

## Screenshots (captured and viewed)
- **Settled composition:** `qa/screenshots/avatar/d3-sheet-wide.png` (1440 and 1100) and `d3-sheet-narrow.png` (768, 390, reduced motion).
- **Hero heights:** `c3-narrow-hero.png`.
- **Matcha plume:** `mt-strip.png`, frozen at 150 / 350 / 550 / 800 / 1050ms.
- **Edge peeker:** `edge-enter.png` (entrance) and `edge-lean-peek.png` (lean across card switches, then peekaboo); raw frames in `edge-1440/`.

## Limitations
- **Browsers:** Chrome only, through Playwright. Touch was emulated (tap, coarse pointer), not tried on a physical phone.
- **Edge peeker width:** she needs ≥ 1100px. Below that there is no room for her lane without covering cards, so she isn't shown, and tablets and phones have no figure in Selected work.
- **Grid width:** on wide screens the grid is about 144px narrower (at 1440) to make room for her lane, so some card names wrap onto two lines ("Research tooling").
- **Peeker gaze:** her eyes are baked into the artwork, so the response is posture only. `--gaze-x` / `--gaze-y` are ready for a future gaze layer.
- **Public assets:** `public/assets/avatar/` still holds the full source pack you copied there (about 196 MB). It is untouched and unreferenced, but it would be published if deployed.
- **Next.js:** still prints a security-vulnerability notice. No upgrade has been run.
- **Not done:** nothing committed or pushed.

---

# QA report — iteration 8: avatar refinement (23 Oct 2026)

**Preview:** http://localhost:3100 (production build).
**Browser:** Google Chrome driven by Playwright. The Claude in Chrome extension again reported "Browser extension is not connected". Motion was watched as Chrome's own screencast (every painted frame, through the DevTools protocol) and measured per animation frame, not judged from stills alone.

## Commands and results (production build)

| Command | Result |
|---------|--------|
| `npm run typecheck` / `npm run lint` / `npm run build` | 0 / 0 / 0. The first `build` exited 1 after compiling all 15 pages, on Next.js's security-vulnerability notice; the retry passed. |
| `node qa/check.mjs` | **172/172 PASS** → `qa/check-output.txt` |
| `node qa/visible.mjs` 1440/1024/768/390 | pass forward and back; minimum in-view line 597 / 498 / 687 / 456 px; monotonic, reversible, no rebuild mid-run → `qa/visible-output.txt` |
| `node qa/av-timing.mjs` 1440, 768 | Every entrance is a settle of 8–14px over 533–535ms with no overshoot. The peeker rises 53–70px over 549–567ms, from behind the grid's edge only. |
| `node qa/av-film.mjs final 1440x900` (+ `f2 768x1024`) | See the per-area results below. |
| `node qa/av-density.mjs` 1920 → 390 | at most 2 figures in view |
| `node qa/av-detail.mjs d2 1440x900 390x844` | 11 project pages: figures entered, clear of text, 0 console errors |

**`av-film.mjs` results:**
- **Hero:** loaded, opaque and untransformed from the first animation frame (69ms at 1440; 102ms at 768), on every frame after.
- **Peeker:** across 90 + 416 + 363 frames (reveal, rapid pointer switching, keyboard tabbing), her clip line was never closer than 1px above the grid's top edge. The lean returns to neutral after leaving the grid.
- **Fast scrolling down and back up:** no stuck or replayed entrance.
- **Resize:** figures follow the reflow.

**New checks in `qa/check.mjs`:**
- **Hero:** visible and still from the first frame, and preloaded.
- **Pre-trace:** gone at 4 widths and with reduced motion.
- **Entrances:** short, non-bouncing settles.
- **Peeker clipping:** clip line never below the grid edge in any frame of rapid switching. A pixel-identical strip under the edge with and without her (from the first whole pixel row; the fractional border row is covered by the geometry check).
- **Lean:** toward the active card by pointer and keyboard, neutral after leaving.
- **Line placement:** the figure at the trajectory's end and the greeter stand on the line, at every width where they show.

## Screenshots (captured and viewed)
- **Production, settled:** `qa/screenshots/avatar/final2-sheet-1440.png`.
- **Dev-build composition sheets:** `b2-sheet-1440.png`, `b2-sheet-1280-misc.png` (with the resize and reduced-motion frames), `b2-sheet-768.png`, `b2-sheet-390.png` (with reduced motion).
- **Close-ups:** `c-sheet.png`.
- **Frame strips:**
  - `fs-reload.png`: the hero on the first painted frame.
  - `fs-peek.png`: the reveal.
  - `fs-cards-zoom.png`: the lean while panels expand and collapse beneath her.
  - `ah-strip.png`: the map figure appearing as the line reaches her feet.
  - `es-e1.png`: entrances.
- **Raw screencasts:** `film-final-1440/`, `film-f1-1440/`, `film-f2-768/`.

## Limitations
- **Browsers:** Chrome only, through Playwright. Touch was checked as layout and behaviour; figures never take taps.
- **Photographer:** shown only at ≥ 1360px. Below that the contact sheet fills her corner and a smaller figure looked stranded, so the reader takes More's slot (640–1359px). Phones have no More figure.
- **Map figure:** only with the horizontal trajectory (≥ 860px).
- **Reverse scrolling:** figures stay once entered. If you scroll back above the trajectory, the line retracts while the map figure stays in place.
- **Next.js:** the installed version prints a security-vulnerability notice (see REVIEW). It has not been upgraded.
- **Public assets:** `public/assets/avatar/` now also holds the full source pack you copied there (about 196 MB, including the contact-sheet previews). It would be published with the site if deployed, although the pages reference only the derived WebPs.
- **Not done:** nothing committed or pushed.

---

# QA report — private preview, iteration 7: avatars (21 Oct 2026)

**Preview:** http://localhost:3100 (production build, `npm run start`).

Iteration 7 places a small selection of the approved avatar poses on the homepage and the 11 project pages. Copy, routes, the line's behaviour, panels, More plates and dots are otherwise unchanged; Experiments stays empty.

**Browser:** Google Chrome driven by Playwright. The Claude in Chrome extension reported "Browser extension is not connected" again, so no extension-driven inspection was possible. Every visual claim below rests on screenshots that were captured and viewed.

## Commands and results (production build)

| Command | Result |
|---------|--------|
| `npm run typecheck` / `npm run lint` / `npm run build` | exit 0 / exit 0 / exit 0 (15 static pages) |
| `node qa/check.mjs` | **164/164 PASS** → `qa/check-output.txt` (36/36 route × width: 200, 0 overflow, 0 console errors, 0 failed requests) |
| `node qa/visible.mjs` 1440/1024/768/390 | pass at every 40 px position forward and back (minimum 597 / 498 / 687 / 456 px drawn line in view), monotonic, reversible, no mid-run rebuild; the only contacts are the intended ones with avatar boxes, no text crossings → `qa/visible-output.txt` |
| `node qa/av-density.mjs` 1440/1366/1280/1150/1024/768/390 | at most **2** figures in view at any scroll position |
| `node qa/av-shots.mjs final …` / `final-rm … --reduced` | every figure entered and settled; hidden figures never load; **0 console errors** |
| `node qa/av-detail.mjs` 1440/768/390 | all 11 project pages: figures entered, **no text overlap**, 0 console errors |
| `node qa/av-motion.mjs` | entrance and reaction frame strips; idle duck observed |
| Impeccable detector on changed files | **0 findings** |

### New checks in `qa/check.mjs` (164)
- **Hero:** one avatar, loaded; across her seat the line runs at seat height (±9 px) and never through her upper body (1440/1024/768/390).
- **Decorative:** every figure is aria-hidden, has `alt=""`, `pointer-events: none` and reserved width and height. Only the hero is eager. The ARIA snapshot holds only the three real images (1440/1024/768/390).
- **Loading:** only displayed figures load, as WebP. No contact sheets or source PNGs are requested (7 / 7 / 5 / 3 files).
- **Breakpoints:** 6 figures at ≥ 860, ≤ 5 on tablet, 3 on phones, with the right More visitor per width. Never more than 2 in view.
- **Motion:** each figure entered once and settled, with no running animation left. With reduced motion, every figure is in place and unanimated, on the homepage and on project pages.
- **Line:** runs into the untangler's fist (1.8–1.9 px). The walker rests on it (2.1 px). The narrow greeter stands on its last stretch (2.5–2.8 px).
- **Nothing covered:** no text sits under a figure, and every work and contact link is the topmost element at its centre.
- **Project pages:** 1–2 figures each (2 for Lynxster and AMNH), each standing on the rule under its section.

## Screenshots (captured and viewed)
- Homepage in context, settled: `qa/screenshots/avatar/final-1440-*.png`, `final-1280-*.png`, `final-768-*.png`, `final-390-*.png`; sheets `final-sheet-1440.png`, `final-sheet-1280-rm.png` (with reduced motion), `final-sheet-390.png`.
- Project pages: `d1-1440-*.png`, `d1-390-*.png`, `dfinal-768-*.png`; sheets `d1-sheet-1440.png`, `d1-sheet-390.png`, `final-sheet-768-detail.png`.
- Motion: `ms-hero.png` (drops onto the line and settles), `ms-walk.png`, `ms-peek.png`, `ms-wave.png`, `ms-react.png` (peek rest / panel hover / keyboard focus / idle duck / photo plate hover). The shutter was confirmed numerically: lens flash opacity peaks at 0.86–0.97 and the contact sheet at 0.40–0.42, on settle and on hover.
- Iteration views kept for comparison: `a1`–`a5`, `p-sheet.png`, `p2-sheet.png`.

## Limitations
- Chrome only (Playwright-driven). Touch was checked as layout and behaviour: hover reactions do nothing harmful, and figures never take taps (`pointer-events: none`). It was not tested on a physical phone.
- The Wildlife photography figure appears only at ≥ 1150 px. On narrower plates the contact sheet leaves no clear corner, so the reader on Writing takes its place (640–1149 px). On phones More has no figure.
- From 1150 to 1359 px the photographer is small (62 px wide) to stay clear of the contact sheet (2–5 px at 1150–1280).
- The walker is shown only with the horizontal trajectory (≥ 860 px).
- Entrances are time-based once cued; they are not scrubbed by scroll. Scrolling back up does not replay them, by design.
- Nothing has been committed or pushed.

---

# QA report — iteration 6 (21 Oct 2026)

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
