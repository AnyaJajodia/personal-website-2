# Visual & functional review

## Iteration 3 — logos, bolder panels, Currently, composition, dot field (12 Oct 2026)

Scope: real supplied logos, compact bold Selected-work panels with dates, larger Currently logos, tighter composition with an active trajectory milestone, stronger More scenes and a graphic photo placeholder, and a faint interactive dot field. Wording, facts, routes, detail pages, the hero and the line route are unchanged.

**Assets.** The supplied files are mapped as follows:

| File in `handoff/assets/logos/` | Used for |
|---|---|
| `amnh.png` | AMNH |
| `crackd.png` | Crackd.ai |
| `buzzworks.png` | Buzzworks |
| `tmu.png` | Research tooling (TMU) |
| `gvi.webp` | Conservation fieldwork (South Africa) |

The Lynxster lockup comes from `handoff/assets/lynxster/lynxster-logo.png`.
- **Runtime copies:** stored in `public/logos/`. Only fully transparent margins were trimmed; TMU, AMNH and Buzzworks were also downscaled to about 3× their display size. The aspect ratio is preserved (verified: rendered ratio equals file ratio for all 5 images in the check suite).
- **Originals:** untouched.
- **Surfaces each logo needs:**
  - AMNH and GVI are black artwork, so they go on light (AMNH) or yellow (GVI) surfaces.
  - Crackd is white and yellow, so it sits on deep violet.
  - Buzzworks (navy and orange) and TMU (its own blue box) get an ivory inset.
- **Recolouring:** none of these logos is recoloured. The Lynxster lockup is single-colour grey artwork applied as a mask in Lynxster's own dark ink (`#101412`). That's the same technique the detail page uses, chosen for contrast on the light card.

**Method:**
- **Before set:** taken from the iteration-2 production build: `qa/sheet-it3-before.png`.
- **Working captures:** `qa/sheet-it3-sel*.png`, `sheet-it3-cur.png`, `sheet-it3-a.png`, `sheet-it3-390*.png`, `sheet-it3-bento.png`, `sheet-it3-photo.png`, `sheet-it3-dots.png`, `screenshots/it3-milestone-*.png`.
- **Final after set:** `qa/sheet-after3-1440.png`, `sheet-after3-768.png`, `sheet-after3-390.png`, `sheet-after3-sel.png`.
- **Real Chrome:** inspection through Claude in Chrome.

### Defects found and fixed

| # | Pri | Defect (where observed) | Fix | Rechecked |
|---|-----|-------------------------|-----|-----------|
| 1 | P1 | Logos missing in mobile captures: `next/image` lazy-loading left the inset chips empty until scrolled (`sheet-it3-390`). | Logos load eagerly (they're small). Heavy runtime copies were downscaled (TMU 95 → 36 KB). | `sheet-it3-390b`, check: 5/5 logos loaded |
| 2 | P1 | Mobile/tablet photo tile: the placeholder prints overlapped the "Wildlife photography" heading (`sheet-it3-bento`). | On narrow cards the prints sit right and centred, and the name wraps in a 56% left column. The bottom crop marks are hidden on small prints. | `sheet-it3-photo` (390 + 768) |
| 3 | P2 | 1024 px: panel dates wrapped ("May 2025–\n2027"). The Publications arrow wrapped onto its own line. | Dates `nowrap`; a non-breaking space before every sub-link arrow. | `it3-panels-1024`, `after3-sel-1440-focus` |
| 4 | P2 | The bottom fade on the Experiments tile washed out half of the diagram. | Horizontal fade (behind the text only) for Experiments; a shorter fade for Photography. | `sheet-it3-bento` |
| 5 | P2 | Panels captured at half width at 1280 (`sheet-it3-sel`). Diagnosed as a capture artifact: Playwright's element screenshot of a taller-than-viewport element resizes the page mid-transition. The DOM measured full width (1147 px). | The `qa/shoot-el.mjs` helper now clips the viewport instead. | `it3-panels-1280` |
| 6 | P3 | Dot field slightly too present at rest in the real Chrome view. | Opacity 0.26 → 0.19. | `after3-hero-1440` |

### Critique against the request (final state)
- **Selected work:**
  - Two rows of bold panels in the requested colours. Teaching is darkened slightly from #087F83 to #07757A, because ivory text measured 4.57:1 on the original (5.21:1 now). Buzzworks and GVI use dark ink text.
  - Rows are 234–240 px high, and the heading plus both rows fit in 1366×768 (693 of 700 px), 1280×800 and 1440×900.
  - Collapsed panels show the logo or mark, the name at ≥ 18 px, and dates from content: Sep 2025–2027, May 2025–2027, May 2025–2027, 2022, and Jan 2024–2027 (the span of ESP and ADI). Inteli-lens and GVI have no supplied start date, so no date is shown.
  - Opening a panel changes width only: heights are unchanged, and the logo offset stays 19 px → 19 px.
  - Inteli-lens, Publications and Teaching use small drawn marks (lens, papers, linked nodes). TMU carries a yellow corner accent that echoes its logo.
- **Currently:** the Lynxster lockup (189×116 px) and the AMNH wordmark sit freely in a shared logo zone. The two cards use subtly contrasting surfaces (cool paper vs archival cream), with aligned descriptions and border/shadow-only hover feedback. They stack on mobile.
- **Composition:**
  - Section padding cut to ≤ 72 px.
  - Trajectory ticks shortened (12 px), so the labels sit about 30 px under the loops.
  - The milestone the pen has reached turns plum (title, number, tick; caption darkens), using colour only. Label boxes are identical before and after (`qa/milestone-output.txt`).
- **More:** paper slips and the diagram have clearly stronger contrast. The photo tile shows an explicit graphic placeholder (crop marks, aperture, "Photographs to come"), not an image.
- **Dot field:** behind the hero and Contact, under the line.
  - It parts within 120 px of the pointer, springs back, and stops animating once settled.
  - It's paused off-screen, and static on touch and reduced motion.
  - It never intercepts input (the point under the cursor is the `h1`).
- **Line:** unchanged route. It adapted to the new layout automatically: monotonic, exactly reversible, the pen always on screen at 3 widths, and the join within 0.03 px.

### Remaining observations (not material)
- **Logo use:** the logos are used as supplied. Brand guidelines (clear space, minimum sizes, approved backgrounds) weren't provided, so check them before publishing.
- **Panel colours:** portfolio colours, not official brand tokens (as instructed).
- **Logo-less panels:** Inteli-lens, Publications and Teaching have no logos; their marks are generic line drawings.
- **Missing dates:** GVI and Inteli-lens show no date because no start date exists in the content.
- **Dot field on hybrid devices:** it uses `(hover: none), (pointer: coarse)` to decide static mode. A touch laptop with a mouse attached gets the interactive version.

---

## Iteration 2 — homepage visuals and motion (12 Oct 2026)

Scope: new line route and name join, plum line, Currently side-by-side, More bento, Selected-work expanding panels, tighter composition. Copy, facts, routes and detail pages unchanged.

Reference recordings: the three recordings mentioned in the brief were **not found** locally (searched the repo, `~/Downloads`, `~/Desktop`, `~/Movies` for recent video files). This pass follows the written specification instead. Magic UI's BentoGrid structure was taken from its docs page.

Method:
- **Before set:** captured from the iteration-1 production build (`qa/screenshots/it2-before-*`, sheet `qa/sheet-it2-before-a.png`).
- **Iterations:** Playwright captures viewed as contact sheets after each change (`qa/sheet-it2-a/b/c/d/full-*/route/panels/join.png`).
- **Final after set:** `qa/sheet-after-1440.png`, `qa/sheet-after-768.png`, `qa/sheet-after-mobile.png`, `qa/sheet-join.png`.
- **Real Chrome:** inspection through Claude in Chrome.

### Defects found and fixed

| # | Pri | Defect (where observed) | Fix | Rechecked |
|---|-----|-------------------------|-----|-----------|
| 1 | P1 | Lynxster logo invisible in its Currently circle: the mask element was 0×0 (`sheet-it2-b`, 1440 @2000). | The badge is now a fixed-size flex circle, and the mark is 62% of it. | `qa/probe.mjs` (73×54 px mark); `sheet-it2-c`, `after-1440-2050` |
| 2 | P1 | Grouped panels (Publications, Teaching) showed their sub-links while collapsed, overlapping the vertical name (`sheet-it2-b`, 1440 @3300). | Sub-links moved inside the summary body, which only appears when the panel is open. Keyboard focus on a sub-link opens its panel. | `sheet-it2-panels` (focus-group), check suite |
| 3 | P1 | The line crossed the More intro paragraph (`sheet-it2-b`, 1440 @4000). | The More loop now sits in the empty band between the panels and the More rule. | `sheet-it2-c` @3900, `after-1440-3950` |
| 4 | P1 | In the user's Chrome (110% zoom) the line's start was seen away from the "a". The DOM geometry was correct; the text reflowed during a viewport change while the line's rebuild waited 60 ms. | Rebuild synchronously in the ResizeObserver callback (after layout, before paint), so the line and the reflowed letter always change in the same frame. | Re-captured in Chrome twice: attached. `qa/join.mjs`: start within 0.03 px of the tail at every scroll position |
| 5 | P2 | About 560 px of nearly straight line down the right margin between the hero and About read as a border (Chrome inspection). | A broad sway into the open space beside the About heading, with one small loop. | `sheet-it2-route` (1440 + 1024), `after-1440-450/1000` |
| 6 | P2 | The second panel row (3 panels) gave its open panel two-thirds of the width. | Per-row open ratio (`--open: 2.7` on row 2). | `sheet-it2-panels` |
| 7 | P2 | Tablet: seven full-width stacked cards made a very long column. | Two-column card grid at 640–899 px and on touch screens; an odd last card spans both columns. | `sheet-it2-d`, `after-768-3300`, Chrome iframe @768 |
| 8 | P3 | Experiments diagram small and faint on desktop. | Larger diagram, stronger edges, bigger nodes. | `it2-bento-hover`, `sheet-it2-panels` |
| 9 | P3 | QA evidence: the pointer hit-test sampled off-screen points ("none"), and the Currently CTAs reported "no outline" although their card shows the ring. | The hit-test now runs at scroll 0 (hits `h1`). The keyboard check reads the card's ring (`card-outline`). Visual confirmation: `it2-focus-card.png`. | `qa/check-output.txt` |
| 10 | env | iCloud-synced Desktop created `* 2` duplicates of generated files in `.next`, which broke `tsc`. | Removed only the duplicated generated files in `.next`. Nothing in source was affected. | typecheck exit 0 |

### Critique against the request (final state)
- **Route:** the line leaves the "a" along its tail (26°, measured), rises to x-height, makes one handwritten loop, then a rounded turn down the right side. It sways with two small loops, sweeps left above the trajectory, U-turns, then runs left to right through the five points (tangle, loop, three loops, a wide revisiting loop, a knot). From there it continues: a knot by *Two threads*, loops by *Other things*, a loop above More, and a flourish by *Say hello.* (`after-1440-*`).
- **Join:** the path starts inside the tail. A short ink-to-plum gradient ribbon moves the colour change just outside the glyph (`sheet-join.png`). The tail position was calibrated from 4× renders at 208 px and 94 px and agrees to within 0.001 em at both sizes (`qa/measure-tail.mjs`).
- **Motion:** scroll only changes how much of a fixed path is drawn. Drawing is monotonic and exactly reversible, never more than 6% of the path per 60 px of scroll, and the pen tip stays on screen at 1440/768/390 (`qa/pen-output.txt`).
- **Line style:** `#493247` at 3 px (desktop), 2.5 px (640–1023), 2 px (<640). It is drawn behind content with `pointer-events: none`; links stay blue, and the Lynxster detail page stays cyan.
- **Currently:** two equal cards, using subgrid so logo circles, titles, descriptions and links align. Stacks below 700 px.
- **More:** bento grid (Writing 2 cols, Photography tall, Experiments 2 cols); the placeholder wording and "Later" status are unchanged; there are no links.
- **Selected work:** 7 panels in two rows, 9 destinations, no nested interactive elements.
- **Composition:** section padding cut from ≤168 px to ≤88 px. Internal headings capped at 56 px (were 76 px); the hero name stays 208 px. Trajectory captions are 22ch and staggered.

### Remaining observations (not material)
- **Recordings:** not available locally (see above). If they show a different panel or bento behaviour, the next pass can match it.
- **AMNH:** no official logo was supplied, so the card shows a typographic "AMNH" placeholder labelled "logo to come" (EDITING_CHECKLIST).
- **Panel colours:** muted tones chosen for the palette. No logos exist for those projects, so none are imitated.
- **Writing marquee:** drifts slowly (80–96 s per loop), pauses on hover, and is off under reduced motion. The Experiments diagram responds to pointer only and is decorative (`aria-hidden`).
- **Mobile edge:** with a 20 px gutter the line runs at the screen edge and goes off-canvas between its step-ins. It never crosses text in resting positions.
- **Browser support:** `:has()` and CSS subgrid are required for the panel expansion and card alignment (Chrome 117+, Safari 16+, Firefox 121+). Only Chrome was tested.
- **Capture artifact:** the Claude in Chrome capture at 110% zoom still adds a blank band and crops the right edge (an iteration-1 note). DOM measurements confirm the layout is correct.

---

## Iteration 1

Review method: Playwright (driving the installed Google Chrome) screenshots at 375/390, 768 and 1440 px, viewed as contact sheets (`qa/sheet-*.png`) against `handoff/design/*-mockup.png` and `handoff/motion/storyboard.png`; spot inspection in the connected Chrome via Claude in Chrome. Defects are listed in the order found, with priority (P1 = material, P2 = noticeable, P3 = polish) and outcome. (The homepage line, Currently, Selected work and More described below were redesigned in iteration 2.)

## Fixed

| # | Pri | Defect (where observed) | Fix | Rechecked |
|---|-----|-------------------------|-----|-----------|
| 1 | P1 | Scribble: knot → trajectory morph swept diagonally across the About heading (`home-1440-1100`, first build). | Knot pose now enters from the left *below* the heading and rises into the knot, so the spread into the trajectory stays below the text. | `home-1440-820/1050`, `final-home-1440-820` |
| 2 | P1 | Scribble: trajectory → Currently morph crossed the About bio paragraphs (`home-1440-2000`, first build). Straight-line morphs between distant poses can't route around content. | Redesigned phase 2: after the trajectory the same thread is "released" as one document-anchored path down the margin (knot by *Two threads*, loops by *Other things*, flourish by *Say hello.*), drawn on just ahead of the reader. Reverse scroll retracts it; it never crosses text. | `sheet-b`, `final-home-1440-2400/4100/6113`, check suite |
| 3 | P1 | Browser Back returned to the top of the homepage (check suite: before 4069 → after 0). | CSS `scroll-behavior: smooth` conflicted with Next.js restoration. Removed it; in-page anchors now smooth-scroll via a small click handler (`SmoothAnchors`) that respects reduced motion and moves focus. | Playwright: 4069 → 4069; real Chrome: 4227 → 4227 |
| 4 | P2 | Mobile scribble: hero → knot and knot → trajectory transitions crossed the intro text and labels (`home-390-500/900`). | Narrow layouts: knot forms in the gap under the heading where the vertical trajectory begins; hero flourish holds for 0.42 vh before morphing; trajectory exits through the empty gap below *Still following the thread.* | `sheet-m3`, `final-home-375-1150` |
| 5 | P2 | Lynxster detail: ivory strip between the dark opening and the screenshot band; every figure indented 40 px (default `figure` margin). | Global `figure { margin: 0 }`. | `sheet-d1`, `sc-lynxster-700` |
| 6 | P2 | Metadata rows: items wrapping to a second line kept a stray left divider (Lynxster *Focus*, Crackd *Tools*). | Divider-clipping layout (negative margin + overflow) so the first item on every line has no rule; single-column hero grid when there is no lede, so most rows fit on one line. | `sheet-r`, `final-lynxster-1440` |
| 7 | P2 | Detail titles wrapped into narrow 3-line stacks ("Building / systems / of trust."). | `max-width` 13–14ch; now matches the two-line mockup composition. | `final-lynxster-1440`, `sheet-r` |
| 8 | P2 | Mobile detail flourish sat under the fixed header (invisible) and later crossed the breadcrumb. | Phone-specific compact flourish anchored beside the breadcrumb, entering and leaving at the right edge. | `sheet-mt2`, `final-*-375` |
| 9 | P3 | Detail lines began in mid-air; AMNH flourish read as a ribbon rather than wings. | Lines now arrive from under the header; AMNH wings are longer, narrower, and angled like a dragonfly's fore/hind wings. | `sheet-d1`, `final-amnh-1440` |
| 10 | P3 | Hero flourish began in mid-air and its three loops looked stamped. | Flourish now continues from the baseline of the final "a" in *Anya*; loops vary in size and are slanted like handwriting. | `final-home-1440-0` |
| 11 | P3 | Contact flourish: incoming and outgoing strokes ran parallel. | Thread now sweeps in above the label row, drops beside the heading, then leaves quietly. | `final-home-1440-6113` |
| 12 | P3 | First-page pager left an empty grid cell (gap before *Next* on mobile). | Missing neighbours render nothing; *Next* pinned to column 2 on desktop. | `sheet-md` (recaptured) |
| 13 | P3 | Arbitrary hairline in the Lynxster homepage panel; faint AMNH dragonfly strokes. | Removed hairline; illustration stroke 1 → 1.35. | `final-home-1440-2400` |
| 14 | P3 | 404 console error for `/favicon.ico`. | Added `src/app/icon.svg` (a small thread mark). | check suite: 0 console errors / failed requests on all routes |

## Remaining observations (not material)

- **Transitional crossings:** during a morph (mid-scroll, never in a resting state) the line can briefly pass behind a line of text on very narrow screens. It sits behind the content (z-index 0), has `pointer-events: none`, and the resting poses are clear.
- **Claude in Chrome capture at 110% zoom:** the user's Chrome runs at 110% page zoom (devicePixelRatio 2.2). Some extension screenshots came back cropped and offset (blank band above the header). The DOM check (`elementFromPoint`) confirmed the header is at y = 0, and the Playwright captures at 100% render correctly. This is a capture artifact, not a site defect.
- **Placeholders by design:** the Lynxster screenshot frame, AMNH plates, GVI plate, LinkedIn/résumé/paper "to come" rows. They are intentional, labelled, and non-clickable until the assets exist (see EDITING_CHECKLIST.md).
- **Desktop hero whitespace:** lots of open space to the right and below the name at 1440×900. Intentional (the flourish needs it), but an optional portrait could later occupy part of it.
- **Detail flourish:** identical on every shared-template page. This is consistent by design; a per-project variation could be added later.
