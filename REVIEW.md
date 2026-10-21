# Visual & functional review

## Iteration 6 — Selected work polish (21 Oct 2026)

**Method:**
- Ran the Impeccable polish playbook on the incumbent system, with the craft floor.
- Ran the design detector on the changed files: **0 findings**.
- Inspected in Google Chrome driven by Playwright: the Claude in Chrome extension was still not connected ("Browser extension is not connected").
- Took before and after viewport captures of the work section inside the surrounding page, and of the trajectory while scrolling, at 1440, 768 and 390, and viewed them.

**Before (`qa/sheet-it6-before-work.png`, `qa/sheet-it6-before-traj.png`):**
- **Panels:** saturated panels (orange, deep blue, aubergine, teal, raspberry, cornflower) each with a corner light gradient, a large tone-on-tone watermark drawing and mixed identifier treatments (discs for some logos, loose TMU and GVI logos, a yellow corner bracket on TMU). They read as a patchwork against the cream page.
- **Trajectory:** on the way in, its labels and ticks sat alone until the line arrived.

### Changes
1. **Palette.**
   - Muted coloured paper: Buzzworks `#E8B28D`, TMU `#A9C1D9` (the starting `#AABFD1`, nudged slightly bluer because it read grey beside the others), Inteli-lens `#B9A4BE`, GVI `#A5BDB0`, Publications `#D3A1AD`, Teaching `#B0B9DA`. Crackd keeps `#F8D74D`.
   - One charcoal ink everywhere: names and summaries `#242321`; dates and categories `#3a3733`, not a faded mix.
   - Measured contrast: 6.82–11.08 for names and summaries, 5.14–8.35 for the small date and category text.
2. **Logo layers.**
   - The same three layers on every panel: the muted surface; one 60×60 container (6 px corners) whose *background colour only* is translucent (`rgba(255,252,245,.5)`, or charcoal `.86` behind Crackd's yellow symbol); and the artwork itself.
   - Checked in the browser: computed opacity 1 through every ancestor, `filter: none`, supplied files unaltered.
   - Crackd and Buzzworks use their compact symbols (`crackd-minimal.png`, `buzzworks-minimal.png`; both already transparent, so no derived assets). The generic marks (Inteli-lens, Publications, Teaching) use the same container.
   - Artwork is sized by visible area.
3. **Coherence.**
   - Removed: the corner gradients, the watermark motifs (from code and CSS) and the TMU corner bracket.
   - Corners went from 6 px to 2 px, with a 1 px edge in a darker shade of each panel's colour, matching the Currently plates and More cards. Hover and focus darken the edge.
   - Gaps went from 10 px to 12 px. Desktop rows stay at 240 px, so the section is about 2 px taller at 1440; on tablet and phone it is 51 px and 91 px taller, from the larger identifier containers.
   - Interiors are unchanged in structure: identifier top-left; name, then dates and category, at the bottom of a fixed-width left column; summary and link revealed in a right column already laid out at its final width, so nothing re-wraps or jumps. Colour does not change on expansion.
4. **Trajectory underdrawing.**
   - The *same* path is pre-drawn very faintly (1.25 px, opacity 0.2) along the trajectory span only, beneath the scroll-drawn ink. The labels never sit stranded, and the ink traces over it, forward and back.
   - It is hidden in reduced motion, where the full line is drawn anyway.
   - It is one logical line: no new decoration and no new route.

### Critique of the result
- **Section:** now reads as part of the page: paper swatches pinned into the same editorial world as the Currently plates and More cards. The hue differences still separate projects at a glance.
- **Crackd's yellow:** the brief kept it, and it remains the brightest swatch. It works as the open-by-default lead panel, but it is noticeably more saturated than the rest. A slightly softer yellow (for example around `#F2D66B`) would sit more evenly if you want it later.
- **TMU logo:** its small lettering is legible on high-density screens but tiny at 1×. The blue tile and yellow bracket still identify it. That is the cost of identical containers.
- **Trajectory underdrawing:** quiet enough that it reads as pencil under ink, not as a second line.

## Iteration 5 — refinement pass (21 Oct 2026)

**Method:**
- Ran the Impeccable skill: context loader, refinement on the incumbent system (no PRODUCT.md or DESIGN.md exists) and the craft floor.
- Ran the design detector once on the changed files: **0 findings**.
- Inspected in Google Chrome driven by Playwright: the Claude in Chrome extension was not connected (two attempts: "Browser extension is not connected").
- Captured every screenshot listed below and viewed it.
- No fresh-context finish reviewer this round; that is noted in the limitations.

### Diagnosis before changes (measured, not eyeballed)
`qa/visible.mjs` scrolled the iteration-4 build in 40 px steps and measured the drawn line inside the viewport. **0 px was visible** over these stretches:

| Width | Scroll range with 0 px visible | Cause |
|---|---|---|
| 1440 | 2120–3720 | the route parked the line at `vw + 70` (off-stage) from Currently to Contact |
| 768 | 2280–4280 | same cause |
| 390 | 2360–6040, and a gap at 1600 | the narrow route also left the page after the hero |

- **Clipping and stacking were not the cause.** The SVG is absolute over the document, not clipped. It sits behind content (z 0 < main z 1), and the only element painted over it is the settled header, which is intended.
- **Section gaps were not the cause either:** the route itself left the page.

### Prioritised defects and fixes
1. **Line disappears for most of the page (P1). Fixed.**
   - The route never leaves the page now. It keeps to the right margin (`contentRight + gutter/2`) with a gentle, uneven meander wherever content runs full width. It steps into the page only where there is open space: a frame over the empty hero slot, the loop by About, the trajectory, a knot beside "Two threads I’m following.", one stitch through each empty band before Selected work and More, and the loop and underline at "Say hello.".
   - After the audit flagged a 6.6% jump at 768, the narrow trajectory → margin crossing got its own stretch of scroll.
   - After viewing captures, the margin meander was calmed (amplitude ≤ 9 px, wavelength 220 px) and the hero descent was given a slight hand sway, so neither reads as a ruled border.
2. **Hero dragonfly to be removed (P1, brief). Done.**
   - `Specimen.tsx` was deleted and not replaced.
   - An empty, invisible `.hero__slot` holds the space for a future avatar, and the line is routed around it (a check confirms 0 path points inside it at four widths).
   - No avatar or substitute illustration was added.
3. **AMNH workstreams not distinguished (P1, brief). Done.**
   - Homepage card: two labelled workstreams inside the existing card (Collections digitization with the existing copy; Mantis behavioral research with "Joined a mantis behavioral research project. Details to come."). There are still exactly two Currently cards.
   - Detail page: an index, then two separate sections. Digitization keeps all its existing copy and Plates 1–2. Mantis gets Plate 3 (placeholder), one sentence ("I’ve joined a mantis behavioral research project at the museum.") and an italic note that the question, methods, responsibilities and outcomes will be added once confirmed.
   - "What I’m exploring" stays as a shared closing section.
   - The 01/02 numbering was removed (a craft-floor rule: the order carries no information).
4. **Logos and panel palette (P2, brief). Done.**
   - Collapsed panels use `crackd-minimal.png` and `buzzworks-minimal.png`. Both files are transparent (alpha checked; no baked-in white), so no derived assets were needed.
   - Each symbol sits on a soft translucent disc: dark for Crackd's yellow, light for Buzzworks' orange. No white rectangular badges remain anywhere.
   - Logos are sized by visible artwork (`art` share × target), not file box. The TMU logo was enlarged (48 px) after its wording read too small in captures.
   - Palette: Crackd `#F8D74D` (sampled from the symbol) with dark text; GVI teal `#07757a`; Inteli-lens `#59305f`; Teaching cornflower `#6f86dc` with dark text. The starting `#627BD8` gives 3.7:1 with ivory and 4.4:1 with ink, so it was lightened.
   - All seven panels measure ≥ 4.5:1 (5.05–12.22).
   - Full wordmarks are not shown when expanded: the name is already set as text, and Crackd's white lettering would fail on yellow.
5. **Panel motif under text (P3, found in captures). Fixed.** On grouped panels (Publications, Teaching) the subject motif sat under the links when expanded. It is now hidden there.
6. **Experiments implies scientific work (P2, brief). Fixed.**
   - The wing and magnifier drawing (`ExperimentsDiagram.tsx`) was deleted.
   - The card is now an empty plate with a dashed reserved frame and "Later": no graphic, no link, no invented entry.

### Critique of the result
- **Line, works:** the line now reads as one thread that accompanies the reader. The margin is its quiet register beside the panels and cards, the gestures sit in open space, and the stitches mark section boundaries without crossing text.
- **Line, the trade-off:** the margin passages are long by design. On a 390 px phone the gutter is only 20 px, so the line runs close to the screen edge (≥ 6 px) and the card edges. It is visible and clear of text, but tight.
- **Hero:** the open right side is intentionally empty. The line frames it, which leaves an obvious place for the avatar. On tablet the open space sits above the name and is large; that is the reserved slot, not an omission.
- **Detail page:** the AMNH page now says plainly what is known and what is not; the mantis section is honestly thin.

### Not changed (out of scope or preserved)
- Copy outside the AMNH additions, routes, typography, the cream foundation and the dot field.
- Two copy items you may want to revisit:
  - the AMNH subtitle and eyebrow, which describe digitization and Invertebrate Zoology only;
  - "What I’m exploring", which says the anthropology/zoology direction is "not an established research project".
- Both are listed in EDITING_CHECKLIST.md.

## Iteration 4 — Impeccable design pass (12 Oct 2026)

**Method:**
- Used the Impeccable skill: its context loader, the extension playbook (`new-work.md`, extend-an-established-world) and the craft floor.
- No question round: you asked for directions to be decided autonomously.
- No PRODUCT.md or DESIGN.md exists, and none was invented (see Limitations).
- Code-led: no comps.
- The design detector ran once on the changed files.
- A fresh-context **finish reviewer** (Impeccable's degraded reviewer brief in a general-purpose subagent; the dedicated reviewer agent isn't installed in this harness) reviewed the captures in `.impeccable/review/`. Its verdicts are quoted as returned.

**Diagnosis (before):**
- **Empty hero:** the hero's right half was empty.
- **Currently:** logo-above-text cards.
- **Line:** it ruled the right margin and repeated loops beside every heading.
- **More:** demo-like tiles (Magic UI marquee, node graph, prints).
- **Eyebrow labels:** "01 / About" above every heading (a craft-floor ban).
- **Ending:** Contact and the footer ended weakly.

**Direction (internal; three considered).** I picked the "naturalist's working plate":
- **One ink thread** is drawn from the name through the person's interests, and the drawings are fine ink plates.
- **Rejected:** a field-notebook collage (too busy for the name) and a specimen-drawer grid (generic cards again).

### What changed
- **Hero:**
  - A procedurally drawn dragonfly specimen plate, with venation, pterostigmata in plum, a pin, a scale bar and *fig. 1*. It fills the open side, sitting below the line's flourish and left of its descent.
  - On tablet and phone it sits above the name.
  - It is an illustration, not documentation.
- **Section eyebrows removed:** hairline rules open each section, the headings carry the sections, and the nav keeps the names.
- **Currently:** two hairline-framed plates.
  - **Lynxster:** a real product crop, the Disclosure funnel card from your own reference screenshot (`public/work/lynxster-funnel.webp`). The browser chrome, firm and user names, DEV hash and ledger footer are all removed.
  - **AMNH:** a ruled archive index card with a line drawing of a digitization rig, titled with the "Invertebrate Zoology" department from the content.
  - **Caption row:** the organisation's mark is the heading, inline with role and date, so there's no second name.
- **Selected Work:**
  - Category kickers removed. The category now appears in the metadata line only when the title doesn't already say it.
  - One visible name per panel; the full titles stay in the headings for assistive technology.
  - Every logo sits on the same chip (deep for Crackd's light mark), and logos are sized by visual area.
  - Tone-on-tone subject motifs (speech marks, a chat, footnotes, detection boxes, rosettes, a journal page, a board) appear as a panel opens.
- **Line:**
  - Composed around content: it leaves the "a", flows over the plate, turns down beside it and drifts inward to the About heading.
  - It sweeps into the trajectory, which now has two gestures only (a small tangle at 01, a knot at 05) with quiet crests at 02–04.
  - It leaves the page beside the full-width About text, returns for one knot by "Two threads I'm following.", and stays off-stage through the cards, panels and More.
  - It ends as a loop and an underline beneath "Say hello."
  - On mobile the flourish slips off the edge instead of ruling it.
- **More:** three flat drawn plates (no icon tiles):
  - **Writing:** a nib that has just written the site's line across the plate.
  - **Wildlife photography:** a drawn bushveld contact sheet with "Photographs to come" printed on its border.
  - **Experiments:** a lens over a dragonfly wing that magnifies the venation in plum and follows the pointer.
- **Throughout:**
  - Link blue is reserved for links; the trajectory numerals and "Still following the thread." are now ink and plum.
  - Section padding is down to 54 px or less.
  - Labels are 0.78 rem at weight 600.
  - Contact heading is 8.5 rem with a large serif email, and the footer gains "Back to top".

### Review rounds (finish reviewer)

| Round | Disposition | Findings |
|-------|-------------|----------|
| 1 (full review) | **fix** | (1) panel kickers (floor ban); (2) line ruling the right margin on desktop and mobile; (3) five repetitive trajectory loops; (4) Currently still logo-above-text cards and the funnel sliced at the edge; (5) More still icon cards plus a generic node graph; (6) blue used on non-links; (7) about 150 px dead bands; (8) duplicate titles and uneven logo treatment |
| 2 (verdict) | **fix** | 1, 2, 3, 4, 6 and 7 resolved. 5 and 8 partial (the Experiments graph was only reframed, the Writing and Photography interiors were dead, and the Lynxster mark was light). Two regressions: category labels echoing titles, and the *fig. 1* bar floating. |
| 3 (verdict) | **fix** | All four items resolved. One regression: the "Photographs to come" caption was too faint or crowding the title. |
| 4 (verdict) | **ship** (scoped) | Caption resolved and no regression. Per the reviewer, this ship "covers only the scored fixes and regressions from the review rounds, not a fresh review of the whole surface." |

Earlier in this pass, issues found by my own inspection and fixed:
- The specimen's rotated box pushed the hero descent onto the window edge.
- Horizontal overflow at 390 and 768 from the plate (now clipped at the hero).
- The More nib was clipped.
- Two detector findings: a TMU corner accent built as a side border, and a decorative grid on the Lynxster plate.
- In your Chrome, a missing a11y separator meant the date and category read as "2027Engineering".

### Remaining observations (not material)
- **No PRODUCT.md / DESIGN.md.** The reviewer's persistence check fails on PRODUCT.md. I didn't invent product truth; `/impeccable init` and `/impeccable document` can record both with you.
- **Plain grounds.** The cream ground and the Cormorant/Inter faces are retained because the brief asked for them. Impeccable flags cream with a serif as a common default, but here it's pinned.
- **Illustrations, not documentation.** The specimen, rig, nib, contact sheet and lens are authored illustrations; the only real image is the Lynxster product crop. Replace the contact sheet once real photographs exist.

---

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
