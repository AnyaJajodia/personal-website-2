# Build progress — Anya Jajodia portfolio

Goal: complete, browser-verified first version from `handoff/` (homepage + 11 detail routes + scroll-linked scribble), then REVIEW.md / QA.md / EDITING_CHECKLIST.md.

## Decisions (keep through compaction)
- Stack: Next.js 16.4 App Router, React 19, TypeScript 5.9, plain global CSS, @fontsource (Cormorant Garamond + Inter, locally bundled). No Tailwind/Motion (not needed).
- Content model: `src/content/site.ts` (homepage copy, contact, trajectory) and `src/content/work.ts` (11 entries, periods with `needsReview`).
- Missing start dates (GVI, Inteli-lens): period omitted publicly, `end: '2027'` stored with needsReview.
- Lynxster logo: `public/assets/lynxster/*.png` (unchanged copies) used as CSS mask so it can be recolored. SVG not used (autotraced multi-fill bitmap, 354KB).
- Lynxster reference screenshots NOT published (open item 9): intentional "screenshot awaiting selection" frame instead.
- AMNH imagery: captioned placeholder plates (no generated photos).
- Missing URLs (LinkedIn, papers, résumé): rendered as non-link "to come" text, never dead links.
- Scribble (home): fixed SVG behind content (z-index 0, pointer-events none). Poses = waypoint lists in document coords built from measured DOM rects → centripetal Catmull-Rom → resampled to N equal-arc-length points → interpolated between scroll keyframes (hold ranges). Phase 2 = released thread (document path, drawn on ahead of reader). Reduced motion: static hero + trajectory + full thread.
- Detail pages: document-anchored path drawn on with scroll (quieter), theme colored.

## Milestones
- [x] 1. Read handoff, inspect mockups/logos/references
- [x] 2. Scaffold project, content model, visual system
- [x] 3. Homepage sections + 11 detail routes
- [x] 4. Scribble + sticky header (redesigned: morph phase hero→knot→trajectory, then released thread drawn on down the margin — straight morphs between distant poses crossed body text)
- [x] 5. Build/lint/typecheck pass (re-run at end)
- [x] 6. Browser QA: Playwright screenshots + qa/check.mjs 63/63 PASS on production build; tablet + reduced-motion captured; Claude in Chrome inspection done; REVIEW.md written
- [x] 7. QA.md, EDITING_CHECKLIST.md, README.md written; production preview running on :3100

## Notes
- Dev server: `npm run dev` on port **3100** (port 3000 is occupied by another local app — do not touch it).
- Smooth scrolling is JS-only for in-page anchors (SmoothAnchors) so Back restoration stays instant.

## Iteration 2 — homepage visuals and motion (12 Oct 2026)
Decisions (keep through compaction):
- The line is now ONE fixed document path (`src/lib/home-route.ts`): name "a" → right → rounded turn down the right side (sway and loops) → sweep left over the trajectory → U-turn → trajectory left → right → margin, with knots and loops by the headings → Contact.
- Scroll only controls how much is drawn: `marks` pin waypoints to scroll positions, and `schedule()` makes it monotonic and capped at 14 px of line per px of scroll.
- The SVG is absolute over the document, not fixed, so the join can't lag the text.
- The start is calibrated to the "a" tail (`A_TAIL`, `qa/measure-tail.mjs`) and blends ink → plum over the first 0.26 em.
- Rebuilds run synchronously in a ResizeObserver, so the line and text update in the same frame.
- Line style: #493247, 3 px / 2.5 px (640–1023) / 2 px (<640).
- Currently: two equal subgrid cards with circular logo badges (Lynxster mark as a mask; AMNH typographic placeholder).
- Selected work: `WorkPanels.tsx`, two rows (4 + 3) of expanding panels, CSS `:has()` for hover and focus. Below 900 px or on touch: cards (2 columns ≥ 640 px).
- More: `MoreBento.tsx` + `ExperimentsDiagram.tsx` (Magic UI BentoGrid pattern; marquee, prints, beam diagram).
- iCloud Desktop sync creates `* 2` duplicates in `.next`. Delete them (generated only) if `tsc` complains.

- [x] Before screenshots (iteration-1 build)
- [x] Route + join + plum line; Currently; panels; bento; composition
- [x] Visual review → defects fixed (REVIEW.md iteration 2, #1–10)
- [x] typecheck / lint / build ✓; `qa/check.mjs` 75/75; pen, join and panel audits ✓
- [x] Claude in Chrome: desktop, tablet and phone (iframes), hover, reverse scroll, console
- [x] QA.md, REVIEW.md, EDITING_CHECKLIST.md updated; production preview running on :3100

## Iteration 3 — logos, bold panels, Currently, composition, dot field (12 Oct 2026)
Decisions (keep through compaction):
- **Logos:** `public/logos/` holds trimmed (transparent margins only) and partly downscaled copies of `handoff/assets/logos/*` and the Lynxster lockup. They load eagerly via `next/image` with `unoptimized`.
- **Panels** (`WorkPanels.tsx`, `LOOKS`):
  - Requested colours; Teaching deepened to #07757A. Ink text on Buzzworks and GVI.
  - Buzzworks and TMU on an ivory chip.
  - Stable left column (logo/name/date) sized with container units (`--idw`). Expansion reveals the right column (`--morew`). Rows 220–240 px.
  - Cards at < 1000 px or on touch.
- **Dates:** `dateFor()` uses content only and never invents a start date.
- **Currently:** free logos in `.feature__logo-zone`; Lynxster lockup as a mask in #101412; AMNH wordmark image. Cool vs cream card surfaces.
- **Trajectory:** band 184 px, ticks 12 px. Route `milestones` → `data-active` on the reached point (colour only).
- **Dot field** (`DotField.tsx`): canvas behind the hero and Contact. Animates only while the pointer is near or dots are settling; pauses off-screen; static on touch and reduced motion.
- **More:** stronger slips and diagram; graphic photo placeholder; narrow layout keeps prints right of the text.

- [x] Before screenshots (iteration-2 build)
- [x] Implementation; defects fixed (REVIEW.md iteration 3, #1–6)
- [x] typecheck / lint / build ✓; check.mjs 84/84; pen, join, milestone and dot audits ✓
- [x] Claude in Chrome: desktop hover, logos, tablet and phone iframes, console clean
- [x] QA.md, REVIEW.md, EDITING_CHECKLIST.md updated; production preview on :3100

## Iteration 4 — Impeccable design pass (12 Oct 2026)
Decisions (keep through compaction):
- **World:** "naturalist's working plate". Ivory ground, Cormorant/Inter, one plum thread, fine ink drawings, archival paper plates, saturated project fields only in Selected Work.
- **Hero:** `Specimen.tsx` (procedural dragonfly with venation, `wing()` exported), with a scale bar and *fig. 1* inside the SVG. Measured as `hero-plate`; the route avoids it.
- **Section eyebrows → `SectionRule`** (hairline with a `data-line` landmark).
- **Currently:** plates. Lynxster is a real funnel crop (`public/work`); AMNH is an index card with `RigDrawing`. The caption row has the mark as the h3, inline with role and date.
- **Panels:** no kickers (the category goes in the meta line unless the title contains it); single visible name; all logos on chips; subject `MOTIFS`.
- **Route:**
  - hero: over the plate, then drifting inward to the About heading row
  - trajectory: tangle at 01, crests at 02–04, knot at 05
  - after it: off-stage, a knot at Currently, off-stage through the work, then a loop and underline under "Say hello."
  - mobile: the flourish slips off the edge
- **More:** flat plates (nib flourish, contact sheet with its caption on the rebate, `ExperimentsDiagram` lens over a wing).
- **Review:** `.impeccable/review/` captures; `qa/review-shots.mjs` regenerates them. The finish reviewer went fix → fix → fix → ship (scoped).

- [x] Diagnose, choose direction, build
- [x] Detector 2 → 0 findings; reviewer rounds 1–4 applied
- [x] typecheck / lint / build ✓; check.mjs 90/90; pen, join, milestone and dot audits ✓
- [x] Claude in Chrome desktop, tablet and phone iframes; console clean
- [x] REVIEW.md, QA.md, EDITING_CHECKLIST.md updated; production preview on :3100

## Iteration 5 — refinement pass (21 Oct 2026)
Decisions (keep through compaction):
- Hero: the dragonfly (`Specimen.tsx`) was removed and not replaced. An empty, invisible `.hero__slot` (`data-line="hero-slot"`) holds the space for a future avatar, and the line is routed around it. No avatar was created.
- Line: it never leaves the page now.
  - Diagnosis: iteration 4 parked it at `vw + 70` (off-stage) from Currently to Contact, so nothing was visible for about 1,600 px (1440), 2,000 px (768) and 3,700 px (390) of scrolling.
  - New route (`home-route.ts`, `Margin` helper): the right margin (`gx = contentRight + gutter/2`) with a gentle, uneven meander beside full-width content. It steps in only into open space: the frame over the avatar slot, the About loop, the trajectory, a knot by "Two threads", stitches through the empty bands before Selected work and More, and the loop plus underline at "Say hello."
  - The narrow trajectory → margin crossing gets its own scroll stretch (it is no longer flicked).
- Panels:
  - Crackd uses `#F8D74D`, sampled from `crackd-minimal.png`, with dark text; its symbol sits on a dark translucent disc. Buzzworks uses `buzzworks-minimal.png` on a light translucent disc.
  - Other colours: GVI teal `#07757a`, Inteli-lens `#59305f`, Teaching cornflower `#6f86dc` with dark text (the start value `#627BD8` fails 4.5:1 with both ivory and ink).
  - Logos are sized by their visible artwork (`art` share × target `size`), not by file box.
  - Wordmarks are not shown when expanded: the name already appears as text, and Crackd's white lettering would fail on yellow.
  - Motifs are hidden on grouped panels (they sat under the links).
- The minimal logos were placed by the user in `public/logos/`. The filename is `crackd-minimal.png`, not `crakd-…`. Both are transparent: no baked-in white, no derived assets needed.
- AMNH:
  - Homepage card lists two workstreams: Collections digitization (existing copy) and Mantis behavioral research ("Joined a mantis behavioral research project. Details to come.").
  - Detail page: a `streams` model with an index, two separate `section.stream` blocks (each with its own placeholder plates; plate numbering continues), a pending note about what is unconfirmed, then the shared "What I'm exploring".
- Experiments: the wing and magnifier (`ExperimentsDiagram.tsx`) were deleted. The card is an empty plate with a dashed reserved frame and "Later".
- QA: new `qa/visible.mjs` (slow forward/back scroll; px of drawn line on screen, text collisions), `qa/layout.mjs`, `qa/detail-amnh.mjs`; `check.mjs` updated (108 checks).

Milestones:
- [x] Diagnose line visibility (before: 0 px visible over long stretches at all widths)
- [x] Hero, panels, AMNH, Experiments changes implemented; dev check 108/108
- [x] Production build + checks (108/108), visibility/pen/join/hold audits, Chrome (Playwright; extension not connected) films at three widths, REVIEW/QA/EDITING_CHECKLIST/README updated. Preview on :3100. Nothing committed.

## Iteration 6 — Selected work polish (21 Oct 2026)
- Panels:
  - Muted paper palette: Buzzworks `#e8b28d`, TMU `#a9c1d9`, Inteli-lens `#b9a4be`, GVI `#a5bdb0`, Publications `#d3a1ad`, Teaching `#b0b9da`; Crackd keeps `#f8d74d`.
  - Charcoal ink: `#242321`, with `#3a3733` for meta.
  - 2px corners and a 1px darker edge; no gradients, motifs or TMU bracket. Gap `--panel-gap: 12px` (desktop `--idw`/`--morew` account for the gaps and the border).
- Identifier: every panel has one `.panel__logo` (60×60, 6px corners). Only its background is translucent (light, or charcoal for Crackd), and the artwork is opaque. `WorkPanels.tsx`: `LOOKS` now has `tone`, `logo` and an optional `backing`; `MOTIFS` were removed.
- Trajectory: `Route.guide` (via `Pen.guideFrom()`/`guideTo()`) gives the trajectory span. `HomeScribble` draws `.scribble__guide`: the same `d`, dashed to that span, opacity 0.2, under the ink, hidden when static.
- QA:
  - `qa/context-shots.mjs` (in-context captures); `qa/visible.mjs` now reports reversal diffs and mid-run rebuilds.
  - `check.mjs` 116/116 on production. Preview on :3100. Nothing committed.

## Iteration 7 — avatar integration (21 Oct 2026)
Decisions (keep through compaction):
- Source pack `handoff/assets/avatar/` (85 PNGs) is untouched. `scripts/build-avatars.mjs` (sharp, alpha > 8 bbox + 6 px pad, WebP q90 / alpha 100) derives only the 20 poses used into `public/assets/avatar/` (1.9 MB total; 50–240 KB each). Registry with dimensions + anchor points: `src/content/avatars.ts`.
- `Avatar.tsx`: `.avatar` (placed, never animated, carries zero-size `data-line` probes the line route measures) › `.avatar__body` (entrance) › `.avatar__img` (reactions). aria-hidden, `alt=""`, pointer-events none, width/height reserved; only the hero is eager.
- `AvatarStage.tsx`: entrance once per figure (IntersectionObserver at `data-enter-at`), waits only for figures still moving on screen (≤ 900 ms), `data-in` queued → true → done after 2.4 s; one idle motion (peeker ducks every ~7.4 s, only on screen, tab visible, nothing else moving). Reduced motion: `data-in="still"`. CSS hides figures pre-cue only under `@media (scripting: enabled)`.
- Homepage moments: hero `break-01` sits on the line (route passes seat-L → seat-R probes, sags 3.5 px); trajectory `walking-02` walks the level last stretch (route flat at her feet) toward "Still following the thread." (≥ 860 px); "Two threads" `untangling-05` on the AMNH card top edge, line runs into her fist probe, down behind her, out past her heels (replaces the knot when she is shown); Selected work `peeking-03` over the grid top (clip at the edge, rises on panel hover/focus, idle duck); More: `photography-03` in the photo plate's empty lower corner, shutter flash + contact-sheet exposure on settle and on hover (≥ 1150 px), else `reading-04` on Writing's top edge (640–1149 px); Contact `waving-01` on the links' top rule (≥ 860), or `waving-near` standing on the line's last stretch beside "Say hello." (narrow; the route runs under her feet into the underline).
- Phones keep hero, untangler, wave. Never more than two figures in view (qa/av-density.mjs). Experiments stays empty.
- Detail pages: `detailAvatars` in `src/content/avatars.ts` — 1 per page, 2 for Lynxster (typing at desk; notebook) and AMNH (archival paper; copy stand, digitization stream only — nothing illustrates the mantis research). Standing on the rule under the section (left column; after the text, right-aligned, ≤ 899 px; the second hidden on narrow).
- Verified on the production build: check.mjs 164/164; visible.mjs pass at 1440/1024/768/390; detector 0 findings.

## Iteration 8 — avatar refinement (23 Oct 2026)
Decisions (keep through compaction):
- **Hero:** `data-static` + `eager`. The image is preloaded (`<link rel=preload>` from next/image `preload`), `decoding="sync"`, with no entrance and no JS gating. The homepage page-load fade skips `.hero` (`.home__main > :not(.hero)`).
- **Faint trajectory pre-trace:** removed (path element, route `guide`, CSS).
- **Walker:** replaced by `map-04` (role `ahead`), standing on the level last stretch. It is cued by the line itself: HomeScribble sets `data-line-reached` when the pen reaches `Route.cues.ahead`, and AvatarStage enters it on that (`enterAt="line"`).
- **Entrances:** CSS transitions, not keyframes, so they are interruptible.
  - Wrappers: `.avatar` (anchor and clip) › `.avatar__body` (entrance) › `.avatar__react` (reaction).
  - Each figure has a `--from` of 8–14px (`translateX(-12px)` for `ahead`, `translateX(14px)` for `greeting`, `translateY(-8px)` otherwise); 0.42s opacity / 0.52s transform with `cubic-bezier(.22,1,.36,1)`.
  - No idle motion. `data-in`: queued → true → done.
- **Peeker:**
  - Anchor `clip-path: inset(-80% -40% calc(var(--sink) + 1px) -40%)`, so nothing below 1px above the grid's top edge ever paints.
  - Hidden state is `translateY(66%)`: only the top of her hair shows. The reveal is 0.55s.
  - Lean via `--lean` / `--lean-x` (≤ 2.4°, ≤ 7px). It is set from the active card (pointerover / focusin) by AvatarStage, eased by a transition and reset on pointerleave / focusout.
- **Contact:** a single greeter at all widths (`greeting`), standing on the line's last stretch just past "Say hello." (`.contact__heading { width: fit-content }`, avatar `left: calc(100% + .6em)`). The wide route runs under her feet, makes a small loop in the gap, then draws the underline. The links-rule waver was removed.
- **More visitor:** the photographer from 1360px (larger, 84–100px). Below that the contact sheet comes down into her corner, so the reader takes the slot (640–1359px).
- **Public assets:** you copied the full pack into `public/assets/avatar/` (PNG folders, previews, `index.html`, manifest). It is left untouched; the site references only the derived WebPs.
- **Next.js notice:** `next dev` / `next build` print a Next.js security-vulnerability notice and stop once; a retry continues. No upgrade has been run.

## Iteration 9 — bold avatar pass (23 Oct 2026)
Decisions (keep through compaction):
- **Assets:** served as AVIF (alpha kept), about half the size of WebP. Hero `break-01` is 940px wide at 165 KB; the whole served set is about 1.0 MB for 17 poses. Each page loads only the poses it displays: 4 on the homepage at desktop, 3 on narrow screens.
- **Hero:**
  - **Avatar:** about 1.46–1.47× larger (422px wide at 1440, from 288), hung from just below the header in the right-hand third. Sized to the hero height (`--hero-h: clamp(38rem, 86svh, 60rem)`) so her feet stay inside it; the hero is no longer 100vh, so the trajectory heading starts at the foot of the first desktop screen. `.hero__inner` is `static` at ≥ 860px so the perch is placed against the hero.
  - **Below 860px:** she sits above the name, right-aligned, on the line rising out of the "a". The hero's padding-top reserves her height (`--pw * 1.545`), so short and landscape phones never put her under the header.
  - **Loading:** preloaded, sync decoding, no entrance.
- **Matcha (`MatchaCup.tsx`):** a labelled button over the cup (centred at 9.5% / 51% of the artwork, ≥ 44px). Mouse hover, keyboard focus (`:focus-visible`) and tap trigger it; each new trigger restarts a hand-drawn SVG plume (three bubbles, three fizz marks) drifting up and to the left. It defines its own `--settle`; with reduced motion the marks appear without motion.
- **Removed:** the trajectory traveller (`map-04`, the line cue), the More visitors (photographer and reader) and the small grid peeker (`peeking-03`). The faint pre-trace was already gone.
- **Edge peeker (`EdgePeeker.tsx`, `peeking-05`):**
  - **Lane:** at ≥ 1100px the grid gives up `--lane-in` on the right. The lane runs from the grid's edge plus 2.25rem to the screen edge (`.selected` is an inline-size container, so 100cqw is the screen width) and clips there, so there is no overflow.
  - **Entrance:** she is cued when `.selected` enters the viewport (`enterOn`) and never waits for other figures (`solo`); she slides out from behind the edge in 0.65s.
  - **Lean:** layered transforms (body: entrance; act: peekaboo; react: lean). The lean toward the active card's centre pivots on her hand (≤ 3.2°, 4–20px outward). `--gaze-x` / `--gaze-y` are published for a future gaze layer.
  - **Peekaboo:** the lane-sized button triggers duck → check → out.
  - **Line:** it runs down the gutter between the cards and her.
- **Kept:** the untangler (slightly larger) and the greeter, which now appears when the line reaches her feet (`enterAt="line"`).

## Iteration 10 — personality pass (23 Oct 2026)
- **Edge peeker fixes:**
  - The lane clips on x only (`overflow-x: clip; overflow-y: visible`), so her hair is no longer cut.
  - She is sized `min(lane/0.955, clamp(9rem, 16vw, 17rem))` and shifted `translate(4.5%)`, so the drawn wall edge sits on the screen edge.
  - The slide is scroll-linked (`--in`, set in EdgePeeker; the figure is `data-driven`, so AvatarStage skips it). She is out from the moment her top enters until the grid's top reaches 86% of the viewport, and slides back behind the edge as the grid's foot rises from 40% to 14%. It reverses on scroll up and holds when scrolling stops.
- **Heading marks (`Mark.tsx`, `MarkStage.tsx`):** a strike through "straightforward", a circle around "threads", an underline under "worked on" and a highlighter behind "other". Copy is unchanged (`Marked` splits the heading's own text). Each mark is drawn once when it scrolls into view; with reduced motion or without JS it is simply drawn.
- **Surface:**
  - fine paper grain (fixed `body::before`, SVG noise, own layer);
  - highlighter text selection;
  - a soft shadow under the settled header;
  - wavy pen underlines on the nav and the email.
- **Depth:**
  - washi tape on the Currently plates, which lift on hover;
  - panels and More cards on paper shadows, lifting on hover;
  - sticker shadows on the logo tiles;
  - drop shadows on the figures, with ground shadows under those that stand;
  - a glow on the matcha while it fizzes;
  - paper shadows on the project-page plates.
- **Details:** a highlighter swipe on the reached trajectory milestone; the scroll cue nudges three times.
- **QA:** `visible.mjs` now waits for two rendered frames, not 30ms. This Chrome renders at 30fps here even when idle, so a fixed 30ms delay read stale frames. New scripts: `qa/av-edge-scroll.mjs` and `qa/av-perf.mjs`.

## Iteration 11 — interaction & finish pass (23 Oct 2026)
- **Thread (`src/lib/thread-tug.ts`, wired in HomeScribble):** `Route.knots` records the hero loop, the first and "now" trajectory knots and the "Say hello" loop (`Pen.knot`). Each knot gets a ≥ 44px button.
  - **Mouse/pen:** drag deforms only the dense points within `max(70, 3r)` px (smooth falloff), with resistance (tanh, ≤ 34px), then springs back (k 170, c 9) to the exact original path.
  - **Hover / tap / Enter / Space:** a pluck. Arrow keys tug.
  - **Touch:** never drags (`touch-action: manipulation`), so it doesn't block scrolling.
  - **Reduced motion:** no handles.
- **Trajectory (`TrajectoryPicker.tsx`):** milestones are buttons (`aria-pressed`). Picking one moves the highlighter to it and shows its aside in the reserved `.trajectory__aside` (min-height, no reflow). Asides are verbatim About fragments (`trajectory.points[].aside`, validated by `quoted()`). With nothing picked, the aside follows the reached milestone.
- **Taped previews:** a corner lift (`perspective` rotateX/Y, origin at the taped corner) with a matching shadow; the tape stays put; a pencilled arrow draws toward the link on hover or focus.
- **Panels (`PanelFocus.tsx`):** the open panel is tracked per row (`data-open` / `data-engaged`), so crossing gaps never flashes the default. Sequence: widen → summary (0.22s delay) → arrow (0.46s). Closing is immediate. The CSS `:hover` fallback applies without JS.
- **Edge peeker:** face-and-hands pose `peeking-02`, exported trimmed at its drawn wall edge (`{ width: 480, right: 713 }` in `build-avatars.mjs`).
  - **Lane:** shown from 1200px (hover devices only), sized so the whole figure fits; a paper "wall" strip (`.edge-lane::after`) at the screen edge.
  - **Moods:** shy on pointer hover (act layer +18%); peekaboo hide → pause → check → out (0 / 950 / 2100ms), interruptible.
  - **Lean:** ≤ 2.6°, mostly rotation about the hand at the wall.
- **Supporting interactions:**
  - **Photography:** viewfinder corners (hidden at rest) close in on hover or focus.
  - **Writing:** the pen rests short of the end and finishes the stroke on hover or focus.
  - The Writing and Photography plates are focusable groups.
  - **Contact:** a separate copy-email control (clipboard with an execCommand fallback, a "Copied" label, a drawn check and a status message); the greeter is cued as `.contact` arrives.
- **Surfaces:**
  - **Corners:** panels 7px, logo tiles 9px, More plates 6px, previews and plates stay crisp at 2px.
  - **Depth:** restrained panel shadows; a lifted shadow on the previews; avatars get a soft contact shadow and a light drop shadow.
- **QA:** `qa/interact.mjs` (33 checks), `qa/interact-shots.mjs` (frames) and `qa/sections.mjs`.

## Iteration 12 — layered hero rig + light/dark theme (23 Oct 2026)
- **Hero rig:**
  - **Source:** the pack lives at `public/assets/avatar/hero-interactions/` (you placed it there, not under handoff/; originals untouched; a copy is also in ~/Downloads).
  - **Layers:** `scripts/build-avatars.mjs` exports the 4 layers as AVIF to `public/assets/avatar/rig/`, uniformly scaled and never trimmed (≈221 KB in total).
  - **Geometry:** `src/content/hero-rig.ts` holds the rig.json geometry (stage 1300×1600, per-layer display scale, pivots, z), the seat probes (205,1000)/(985,975), the straw and the motion keys (legs ±2.5°, cheers −9°).
  - **Component:** `HeroRig.tsx` server-renders all layers (preload, sync decode, reserved stage). Handlers attach after hydration; WAAPI gestures, with guards against repeats.
  - **Entry:** HomeScribble now grows the line from the name to the seat over 1s on a fresh top-of-page load, and the `perched` cue fires the one settling swing.
  - **Stopping:** gestures stop offscreen (IntersectionObserver), on a hidden tab and with reduced motion.
  - **Placement:** the perch is sized from the old figure width (`--fig-w`), so the stage is 1.4258× wide and offset, keeping the figure's scale.
  - **Replaced:** `MatchaCup.tsx` (removed); the hero's cup is now the rig's forearm.
- **Theme:**
  - **Pre-paint:** a script in `layout.tsx` sets `data-theme` / `data-theme-pref` on <html> before first paint (localStorage "theme"; System by default), with `suppressHydrationWarning` on <html>.
  - **Control:** `ThemeToggle.tsx` is in SiteHeader after the nav: a radio menu with arrows, Home/End, Enter/Space and Escape. It follows the OS live while on System. Switching changes attributes only, with a short colour transition (`data-theme-changing`, none with reduced motion).
  - **Tokens:** `--ink-2/3/4`, `--rule-strong`, `--shade` (all shadows are `rgb(var(--shade) / a)`), `--hl` / `--hl-k` / `--hl-blend`, `--selection`, `--dot` (DotField reads it, re-read on theme change), `--grain`, `--panel-dim`, `--tape-blend`, `--vf`, `--sheet-edge`, `--logo-ink`, plus dark values for the AMNH page tokens.
  - **Dark palette:** bg #211e1c, surface #2c2724, text #f2ebdd, muted #beb3a5, rule #463e37, accent #a3c1ea, line #d6c5ae, highlight #d8b85a.
  - **Objects:** coloured panels settle 10% into the page; paper previews and the contact sheet stay light objects; the AMNH wordmark sits on a small paper label; the Lynxster line mark uses `--logo-ink`.
- **Phone header:** it now fits the name, four links and the toggle on one row down to 320px.
- **QA:** `qa/hero-rig.mjs` (16), `qa/theme.mjs` (19), `qa/theme-shots.mjs`; check.mjs updated for the rig and for color(srgb) parsing.

## Iteration 13 — corrected matcha hand, motion easing, dark polish (23 Oct 2026)
- **Corrected forearm:** you replaced `public/assets/avatar/hero-interactions/layers/forearm-matcha.png` (17:30). It has the same 1226×1283 canvas; its cup (straw tip within 3px), sleeve and elbow match rig.json, so it is a drop-in.
  - The served `rig/forearm-matcha.avif` was re-exported from it.
  - Rig URLs carry `?v=2` (REV in hero-rig.ts), so no cached old hand is used.
- **Motion:** per-keyframe easing. The swing is a sine pendulum losing energy (legs −2.2/+1.6/−0.6°, 1.5s); the cheers is a 7° raise, hold and soft settle (pack limit 9°, not used).
- **Dark theme:**
  - **Panels:** per-panel dark tones (`--tone-d`; Light unchanged): Crackd #d4b852, Buzzworks #dea47c, TMU #97b2cf, Inteli-lens #b59fba, GVI #94b1a1, Publications #cd95a2, Teaching #a0aad2. Panel metadata #2f2c28.
  - **Text and links:** muted #cbc1b2; one warm link accent #e6b98f; normal font smoothing in dark.
  - **More cards:** #302a26 fill, a fine light border, restrained shadow.
  - **Link states:** `.feature__cta` and pager links underline on hover/focus, and arrows nudge on focus too.
- **Currently:** a shared caption height ≥ 700px, so rules, text and links align (within 1px). AMNH's activities are separated by a full rule with even spacing; `text-wrap: pretty` on the summaries.
- **Edge peeker:** quieter at rest (act layer 14% further behind the wall until a card is active; lean 1.8°).
- **QA:** `qa/contrast-audit.mjs` measures every text run against its real (blended) background.

## Iteration 14 — homepage copy from the revised home.md (25 Oct 2026)
- **Source:** all homepage copy follows the revised `handoff/content/home.md`.
- **Roles and dates:** homepage-only fields in `site.ts` (`currently.features[].role/period`, `selectedWork.rows[].date`). `work.ts` and the detail pages are untouched; the mismatches are listed in EDITING_CHECKLIST.md §1.
- **Hero tagline:** breaks only between sentences (`.hero__tagline-part`, max 21em), clear of the figure.
- **Panels (≥1000px with hover):** rows size to their tallest summary (min 220–240px); the three-panel row opens 2.6 shares.
- **Trajectory:** the note band reserves three lines; notes are re-quoted from the new About text.
- **LinkedIn:** now linked; Résumé is still a placeholder.
- **QA:** new `qa/copy.mjs` (93 checks plus screenshots in `qa/screenshots/copy/`).
