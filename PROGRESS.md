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

## Iteration 15 — Crackd.ai page + work drawer (25 Oct 2026)
- **Crackd page:** `content/crackd.ts` (from crackd-ai.md) + `components/crackd/CrackdPage.tsx` + `crackd.css`, chosen in `app/work/[slug]/page.tsx` (`slug === "crackd-ai"`).
  - `work.ts`'s Crackd record now only supplies the name, title, description and pager place; the retired claims are removed.
- **Reusable components:** `components/WorkDrawer.tsx/.css` (native modal `<dialog>` sheet; data from `content/work-index.ts`) and `components/OnThisPage.tsx/.css`. Both are mounted on Crackd only.
- **CSS scope:** component CSS only, scoped to `.theme-crackd`, `.sheet*` and `.toc*`; `globals.css` is untouched. The only document-level rules are `html[data-sheet-open]` and `html:has(.theme-crackd)`.
- **QA:** new `qa/crackd.mjs` (61) and `qa/unchanged.mjs` (snapshots in `qa/screenshots/unchanged/base`; re-snap after intended changes elsewhere).

## Iteration 16 — Crackd refined, Buzzworks, shared detail navigation (25 Oct 2026)
- **Header:** `SiteHeader` takes `lead`. Every detail page passes `<WorkDrawer current={slug} />`; the homepage passes nothing. Header styles live in `WorkDrawer.css` (`.site-header .sheet-trigger`, and `.site-header[data-lead]` on phones).
- **Layout:** `components/case/case.css` holds the shared case-study layout (`.case-layout/.case-rail/.case-content`). There is no document-level smooth scroll; OnThisPage scrolls itself.
- **Buzzworks:** `content/buzzworks.ts` + `components/buzzworks/{BuzzworksPage.tsx,buzzworks.css}`, routed in `[slug]`. `work.ts` keeps only its name, title, description and pager place; the old sub-200ms claim is removed.
- **QA:** new `qa/buzzworks.mjs` and `qa/case-shots.mjs`; `qa/unchanged.mjs --mask-header`.

## Iteration 17 — TMU citation-tooling case study (25 Oct 2026)
- **Page:** `content/tmu.ts` (verbatim copy plus clearly separated fictional examples) + `components/tmu/{TmuPage.tsx,Walkthrough.tsx,tmu.css}`, routed in `[slug]`.
- **work.ts:** the TMU record keeps its name and pager place, with period "2025" (end null); the old 2027 placeholder and figure are removed.
- **QA:** new `qa/tmu.mjs` (33). The unchanged guard skips the three bespoke pages.

## Iteration 18 — GVI conservation case study (25 Oct 2026)
- **Page:** `content/gvi.ts` (verbatim) + `content/gvi-photos.ts` (three photo slots: set `src` to replace a placeholder) + `components/gvi/{GviPage.tsx,PhotoSlot.tsx,gvi.css}`, routed in `[slug]`.
- **work.ts:** the GVI record keeps its name and pager place, with period "Summer 2024"; the 2027 placeholder and old figure are removed.
- **QA:** new `qa/gvi.mjs` (32). The unchanged guard skips the four bespoke pages.

## Iteration 19 — research publications + consistency (25 Oct 2026)
- **Pages:** `content/research.ts` (both papers verbatim, plus `companion` and `arogyaPhoto`) + `components/research/{ResearchParts.tsx,PmmyPage.tsx,TeenPage.tsx,research.css}`, routed in `[slug]`.
- **work.ts:** the two records keep their names and pager places; the old claims and "Paper link to come" entries are removed.
- **QA:** new `qa/research.mjs` (56) and `qa/consistency.mjs` (18). The unchanged guard skips all six bespoke pages.

## Iteration 20 — ESP and ADI, Columbia/ADI logos (25 Oct 2026)
- **Pages:** `content/columbia.ts` + `components/columbia/*` (routed in `[slug]`) and `components/ThemeLogo.{tsx,css}` (theme-variant logos, CSS-swapped from `data-theme`).
- **Homepage:** WorkPanels' Teaching look uses `/logos/columbia-crown-light.png` with `backing: "bare"` (`.panel__logo--bare` in globals.css).
- **Drawer:** `work-index.ts` has the crown on Teaching and `drawerSubMarks` for the ADI pill.
- **Assets:** derived `public/logos/adi-mark.png`.
- **QA:** new `qa/columbia.mjs` (53).

## Iteration 21 — navigation and accent refinement (25 Oct 2026)
- **Nav:** `SiteHeader` takes `workMenu` (replacing `lead`). `WorkDrawer` renders the nav Work button with a chevron and portals the dialog to `body`; the drawer starts with "Back to work overview". The underline is a `currentColor` mask in globals.css.
- **Pages:** the Buzzworks `.bz-brand` symbol and serif name, plus a 31rem chat window. Crackd Light stone apps, with Dark re-scoped. GVI uses `ThemeLogo` (`gvi.webp` / `gvi-white.png`) and an open close.
- **QA:** new `qa/refine.mjs` (30); trigger and brand checks updated in crackd, buzzworks and gvi.
- **Follow-up:** drawer timing is 500ms in (`cubic-bezier(.32,.72,0,1)`) and 320ms out (`--sheet-out`); hover lift on entries (WorkDrawer.css); `qa/drawer-motion.mjs` added.

## Iteration 22 — design pass (25 Oct 2026)
- **Drawer:** an editorial index (rows, colour tiles, a thread for groups, a wash for the current page). The hover tint, tile lift and arrow live in `WorkDrawer.css`; the markup adds `.sheet-entry__go` and `.sheet-entry__sub-text`.
- **Pages:** boxed cards, pills, checklists and circled numbers are replaced by open rules and lists in each page's CSS; one hero date mark across all eight. The crown on the homepage Teaching card is tiled (`WorkPanels.tsx`; `.panel__logo--bare` removed).
- **Avatars:** Crackd's think figure is removed; ESP's figure stands on the program rule; standing figures share one height.
- **QA:** `qa/pass-shots.mjs` (full-page frames) added; refine, check and columbia assertions updated.

## Iteration 23 — GVI photographs (25 Oct 2026)
- `scripts/build-gvi-photos.mjs` → `public/assets/gvi/web/*.webp`. `content/gvi-photos.ts` (files, widths, captions, alt, sizes, `overlay`); `PhotoSlot.tsx` is a client component with a width-picking loader; the photo styles and the container-query overlay live in gvi.css.
- **Follow-up:** the GVI opening photograph is 16:9, anchored to the bottom (gvi.css `.gvi-photo--opening`).

## Iteration 24 — detail-page design pass (26 Oct 2026)
- `.case-hero` / `.case-hero__id` / `.case-hero__grid` / `.case-hero__mark` in `components/case/case.css`. DetailLine follows an optional `data-line="flourish"` anchor (`data-flourish="tag|mark"`, `data-flourish-scale`).
- ColumbiaShell has no rail (`.cu-content`). Crackd tapes removed. Drawer `who` labels live in `work-index.ts`. Homepage dates are set in `site.ts`.
- QA: `qa/pass24.mjs`, `qa/hero-shots.mjs`; crackd, copy and columbia assertions updated.

## Iteration 25 — revised content, seven pages (26 Oct 2026)
- Content from the current Markdown in `content/{buzzworks,gvi,research,columbia,tmu}.ts`; the Buzzworks scenarios live in `content/buzzworks.ts` (`scenarios`) and `components/buzzworks/Reconstruction.tsx`.
- PMMY has no publication card (`Publication` type split in research.ts); teen `arogya.reach`; ESP `session`, ADI `what.cohorts`.
- QA: new `qa/buzzworks-recon.mjs`; buzzworks, gvi, research, columbia, refine and pass24 updated.

## Iteration 26 — Crackd.ai completed (26 Oct 2026)
- Content: `content/crackd.ts` (revised Markdown; apps with steps from walkthroughs.json). Page: `components/crackd/CrackdPage.tsx`. Apps and the walkthrough dialog: `components/crackd/CrackdApps.tsx`. Styles: `crackd.css`.
- Assets: `scripts/build-crackd-walkthroughs.mjs` reads `handoff/assets/crackd-source/` and writes `public/assets/crackd/*-{1280,2048}.webp`.
- QA: new `qa/crackd-tour.mjs` and `qa/crackd-shots.mjs`; `crackd.mjs`, `refine.mjs` and `check.mjs` updated.

## Iteration 27 — Inteli-lens page (26 Oct 2026)
- Content: `content/inteli.ts` (revised inteli-lens.md, verbatim; notes not copied). Page: `components/inteli/InteliPage.tsx` + `inteli.css`, routed in `app/work/[slug]/page.tsx`. `work.ts` entry reduced to name/metadata/pager (Year 2022; old PyQt5/CCTV/validation copy and flow figure removed).
- Design: case-hero opening (lens mark + "Inteli-lens — 2022", question title, facts tag on the thread); three sections with headings in the margin, no TOC; mockup full-width with viewfinder brackets; data limitation led by its first sentence; reflection in the serif; dashed "more details" box; `lookingUp` avatar on the closing rule. Lavender #8B78A2 draws thread/brackets/mark, plum #51415E carries accent text (light); #C4AFD4 both (dark). Brackets settle once onto "movement" (0.95s; none under reduced motion).
- Homepage card: 2022 + the Markdown's summary (`site.ts`). Drawer unchanged (no dates; "Prototype").
- QA: new `qa/inteli.mjs` (38 checks), `qa/inteli-shots.mjs`; `pass24.mjs` (Inteli-lens joins the tag-flourish openings) and `copy.mjs` (Inteli date/summary) updated.


## Iteration 28 — Wildlife photography page (26 Oct 2026)
- Route `app/wildlife-photography/page.tsx` → `components/wildlife/WildlifePage.tsx`.
  - Hero: breadcrumb “Other things”, the h1, a one-paragraph lede, and the acacia as the thread's tag anchor.
  - A rule row with the count, the note, the hint, and the `kneelingCamera` avatar (photography-02, newly exported).
  - The gallery comes from `WildlifeGallery.tsx`.
- Masonry (`masonry.ts`): shortest-column placement precomputed for 1, 2 and 3 columns as CSS variables (`--cN/--aN/--kN`). Positions are scaled by container-query units, so the server renders it, there's no JS measuring, and DOM order = photo order.
- Larger view: a native `<dialog>`.
  - Open and close are a FLIP with the Web Animations API: spring `linear()` easing, radius matched to the tile, and a frosted scrim in the page colour.
  - Drag down to dismiss, swipe to change photo, ←/→ keys, Escape and scrim click.
  - Focus moves to Close and returns to the tile; scroll is locked with the drawer's lock.
  - Reduced motion is a fade.
- Photos: renamed in `public/assets/wildlife-photography/`. The manifest is `content/wildlife-photos.json` (with `was`). `scripts/build-wildlife-photos.mjs` builds `web/*.webp` and `wildlife-photos.generated.json` (sizes plus a loading tone per theme).
- Accent: moss #4B6540 for text and leaf #7E9667 for lines (dark: #B9CB9E / #94AA7E). Corners are 14 px on tiles and 18 px on the view; a leaf mark sits before each caption title.
- Homepage: `MoreBento` takes `links` (`site.ts` `more.links`). The Wildlife plate is one stretched link reading “View →”, and its sheet says “18 photographs”. The `globals.css` bento link rules were added, and the photo-plate focus selectors were extended to the link.
- `HomeScribble`: added a guard for a detached root (NaN errors after navigating away from deep in the page).
- QA: new `qa/wildlife.mjs` (99 checks) and `qa/wildlife-shots.mjs`; `check.mjs` and `interact.mjs` updated for the link.


## Iteration 29 — Wildlife photography, final selection (26 Oct 2026)
- Photos are served as supplied from `public/assets/wildlife-photography/{highlights,main-gallery,secondary-gallery}/`. No derivatives; the old `web/` copies and temporary files are gone.
- `scripts/build-wildlife-photos.mjs` is now read-only: it writes sizes and loading tones to `wildlife-photos.generated.json` and validates the collection.
- `content/wildlife-photos.json` holds `hero`, `homepage`, `photos` (id → file, title, caption, alt) and `rows` (photos, width, space). `content/wildlife.ts` exports `hero`, `rows`, `sequence` and `homepagePhoto`; weight comes from the folder.
- `WildlifeGallery` renders the opening (introduction + hero tile) and justified rows: each item is `flex: <aspect> 1 0%`, so a row shares one height. The page passes `intro` and `asides` (the avatar beside row 4). `masonry.ts` was removed. The expanded view uses the same file as the tile.
- Phones get a single column, with supporting photos at 74% on alternating sides.
- Homepage: `MoreBento`'s photo plate shows `homepage.png` whole (container units: `min(100cqw, 100cqh × ratio)`) with viewfinder corners. The label reads “14 photographs →”. The contact-sheet CSS was removed.
- QA: `qa/wildlife.mjs` (107) and `qa/wildlife-shots.mjs` updated for the new collection.

- Composition revised (your request): row 2 stacks the Hornbill over the Perched raptor beside a large Walking leopard. Row 3 is cheetah/feeding giraffe (stacked) + a large Jacana + elephant family/profile (stacked). Stacks use `wl-stack`, and cell widths come from `layoutRow()` in `content/wildlife.ts`, so every cell is exactly as tall. The avatar moved to the closing rule (`.wl-pager`). On phones stacks dissolve (`display: contents`).
- `Feeding_Giraffe.png` changed on disk at 21:18 (outside this session's commands; same 1928×1295). The data was reread; the suite checks the file served matches the one on disk.
- Opening revised (your request): a smaller title (clamp 2.3–3.6rem). Under it is one horizontal strip on a ground line: a redrawn sketch of three acacias standing on the line, the tagline, and the count with the hint (the thread's tag loop now sits above the count). The opening photograph is now the full width of the page (1240 px at 1440). On phones the trees stand on the line below the words.
- Opening and spacing revised again (your request):
  - The opening is one row on a ground line that begins at the viewport's left edge (`.wl-strip`, negative margin) and ends with the container. In it: the trees (same size) standing on the line, “Wildlife photography” at its earlier size (clamp 2.75–5.25rem), and the tagline as two lines spread over the title's exact height.
  - The tagline is 15–22 px and sits beside the title from 1180 px up; below that it moves under the title.
  - The count and hint sit under the line at the right.
  - The thread now begins where the line ends: a new `underline` flourish kind in DetailLine, used only by this page.
  - Photos have square corners (tiles and the larger view; the FLIP no longer animates radius).
  - The collection is one evenly spaced body: the same gap, clamp 6–12px, between all photos and rows, including after the opening photo. The “tight/normal/wide” passages were removed.
- Tweaks (your requests):
  - Dark mode on this page uses --bg #141414 (with surface and rules to match), set on `:root:has(.theme-wl)`.
  - The ground line is 2px in leaf green, the same as the thread; the thread starts at the border's centre, so the two read as one line.
  - The doodle sits ~16px in from the edge, and the title keeps its place.
  - The tagline's lines sit close together, the second on the title's baseline (within 1px).
- Hover captions (your request): a horizontal progressive blur after the motion-primitives ProgressiveBlur.
  - Six stacked `backdrop-filter` layers (0–7.5px), each masked to a band; strongest at the left edge and clearing by ~58% across.
  - A bottom-left wash, with the caption (title + line) as plain white text and no icon.
  - Faded in by Motion (`motion` 12 added as a dependency): `whileHover`/`whileFocus` variants, layers hidden at rest, `MotionConfig reducedMotion="user"`. The CSS image zoom on hover was removed.
  - Measured caption contrast against the blurred photo behind it: ≥ 7.6:1 on all 14.
- Expanded view (your request): the photo stays centred. On a six-column grid of the screen, the title and caption begin at column 2 and the arrows end at column 4, for every photo (≥ 640px; on phones the row spans the screen).
- QA: `qa/wildlife.mjs` 119 checks (caption contrast now sampled from the screen; six-column grid check added).
- Hover captions: blur removed (your request). Only the bottom-left wash and plain white text remain, still faded by Motion. Lowest measured caption contrast: 7.5:1.
- Cheetah enlarged (your request): row 3 is now Collared cheetah + Jacana (both large, ~731/499 × 548 at 1440); the supporting trio (Feeding giraffe · Elephant family · Elephant profile) has its own row (~334 tall).
- Expanded view: the caption row is now one fixed, centred row, half the screen wide (25%–75%), with the title on the left and arrows on the right, the same for every photo. The suite checks it.
- Copy (your goal, 27 Oct 2026): titles, hover captions and longer expanded captions for all 14 photos, from your text. In `wildlife-photos.json` they're `title` / `hover` / `caption`, plus alt text updated to the confirmed identifications.
  - Tiles show the hover line; the opened view shows the title + longer caption (`aria-describedby`).
  - The opened view measures its caption (`--cap-h`, with a ResizeObserver) and sizes the photo to leave room, so the longest caption fits on desktop, a short laptop (1280×720) and phones. On phones the caption takes the full width, with the arrows below.
  - QA: `qa/wildlife.mjs` 141 checks, with per-photo copy/image matching and caption-fit checks at 1440 (both themes), 1280×720 and 390 (both themes).

## Lynxster pass (27 Oct 2026)
- The page has its own component (`components/lynxster/`):
  - **LynxsterPage:** opening, preview, then the problem (statement), developer → co-founder (two stops on a thread that draws in once), what I work on (a 2×2 ruled register with authored icons; the patent note inside “Product and communication”), what I'm learning, and more to come. One avatar (notebook) on a section rule.
  - **LynxsterVisual:** a branded seal-and-mark preview, swappable for the light/dark mockups. **InView:** a one-time entrance.
- **Themes:** one complete treatment each, with tokens on `:root:has(.theme-lx)` covering the header, body, drawer, links, rules and focus. Light: #f3f5f8 / deep blue #1f4384. Dark: #080b0a / teal #5cb8c3. The thread follows `--lx-accent`, and the header is no longer a dark band in light mode.
- **Homepage:** Lynxster is “CTO & Co-founder”, April 2026–present, with a Patent pending pill and the description from lynxster.md (the FERPA/legal line is removed). The preview and the title link to the detail page for both Lynxster and AMNH; the preview is a pointer-only duplicate (`aria-hidden`, `tabindex=-1`); the title link has a focus ring and lifts the card.
- **Removed:** the generic template's Lynxster branches (dark band, ScreenshotFrame) and the old screenshot CSS. The references were moved to `.local-references/` (gitignored).
- **QA:** new `qa/lynxster.mjs` (64) and `qa/lynxster-shots.mjs`. `check`, `copy` and `pass24` were updated for the new design.

## Lynxster pass 2 (27 Oct 2026): visuals from the studies, recomposed page
- **Studies:** 01 Floating, 05 Watching and 09B Package assembly, moved to `.local-references/lynxster/` (never committed or served).
- **Brand pieces** (`lynxster-brand.css`): the real mark as a mask, with the glow on a parent so the mask doesn't clip it, and a Jost Light wordmark (`@fontsource/jost`). Light is navy #24467C with a navy glow; dark is mark #7FD6CC with a teal #4CC7BC glow. This fixes the studies' teal glow in light mode.
- **Homepage:**
  - LynxsterFloat (01: gentle bob, glow pulse, shadow; static with reduced motion).
  - The mark alone beside the role (`.feature__mark`, navy/teal).
  - The lockup rule is removed.
- **Detail page:**
  - **Header band:** LynxsterWatch (05: a pointer glow, the mark tilting, eyes as cut-outs in the band colour when the pointer comes near; mouse and pen only, no tilt with reduced motion). Light is a near-white #FCFDFE band over #EEF1F5; dark is a near-black #070908 band over #111514.
  - **Main visual:** LynxsterAssembly (09B: three abstract records fan, gather and are sealed, in under 2s; the finished state rests, and is shown at once with reduced motion). It straddles the band edge.
  - **Body:** an editorial problem spread; the path with each stop carrying its own paragraph (a vertical thread on phones); the areas as a ruled list with ringed icons and the patent note; a learning band in the header colour with the notebook figure on its edge; then More to come.
- **home.md:** the Lynxster entry now agrees with lynxster.md.
- **QA:** `qa/lynxster.mjs` has 93 checks. `check` (mark and figure assertions) and `copy` (home.md meta) were updated.
- Refinements (your requests, 27 Oct 2026):
  - **Assembly:** it plays once the whole preview is in view (`AssemblyPlayer`: `data-play` wait → run; complete and still with reduced motion or without JS). Hovering afterwards replays only the seal's two ripples (`data-ripple`, its own `lxb-ripple` keyframes).
  - **Progression:** the thread runs exactly dot to dot, with its loop between, plus a faint dashed “ongoing” tail past today.
  - **Homepage Lynxster card:**
    - the small mark is in the portfolio's ink;
    - the Patent pending pill and “Explore Lynxster” are in Lynxster colours;
    - the dark preview fades to the page's warm night at its edges;
    - two rows (“From developer to co-founder”, “What I work on”) fill the space above the link and mirror AMNH's;
    - the tapes are swapped (sage on Lynxster, yellow on AMNH).
  - **QA:** `qa/lynxster.mjs` 102.

## Impeccable pass, parallel agents (27 Oct 2026)
- Driven by `analysis.md`. Five builder agents, each with its own files:
  - A1: hero, identity line, CTA row, dot-field CLS
  - A2: Selected work, More, Contact
  - A3: coherence, type, motion
  - A4: header, nav, mobile, thread
  - A5: detail pages, Lynxster, wildlife
- `src/` and `qa/` were backed up before any edits.
- All five were interrupted by the usage limit at ~17:51 and resumed after it reset.
- Still to do once they report: `next build`, every qa/*.mjs suite, a fresh independent design review, one batch of fixes, then update REVIEW.md and QA.md.
- Integration (lead): all five builders reported.
  - Tests rewritten for the fixed-grid panels, quieter tapes and announced brand text.
  - Inter got a metric-matched fallback.
  - Stale `.next/types/* 2.ts` duplicates removed.
  - `npm run check` passes.

## Targeted edits (27 Oct 2026, your /goal)
- **Teaching & mentorship pages (ESP, ADI):**
  - The opening is now the family's two-column hero: facts on the right as a ruled tag, with the thread's `tag` flourish off its corner. The dates show once.
  - Phones: a new `data-line="phone-flourish"` anchor (DetailLine) ties the flourish beside the wordmark row.
- **Work drawer → "Contents"** (your pick):
  - Paper unrolls from under the undimmed header.
  - Numbered serif entries with leaders, the page's thread down the margin, and the pen circling the current number.
  - A logo plate beside the list on wide screens.
  - It inherits the page theme (portalled into `.detail`) and uses the `.contents*` classes; `.toc` belongs to "On this page".
- **Lynxster homepage plate:**
  - Explored 8 palettes per theme.
  - Applied linen (light) and umber with teal (dark), homepage card only.
- **QA:** crackd, columbia, pass24, refine and lynxster were updated for the new drawer, opening and palette.
- Follow-ups (27 Oct 2026):
  - The Lynxster assembly plays on load.
  - The Contents plate is gone; the paper hangs under the nav (54rem, right edge on the page column).
  - The Lynxster band glow continues over the stage's dark top (`.lx-stage__glow`, `[data-watch-glow]`).
  - The theme control is one Light/Dark swap button, defaulting to System; a swap back to the OS theme clears the stored choice.
  - All suites and `npm run check` are green.


## Iteration 31 (27 Oct 2026, your /goal)
- **Crackd tour:**
  - No Enlarge.
  - The next screen is decoded before the swap (`warm()`, ≤260 ms), and its neighbours are warmed ahead.
  - The screens cross (AnimatePresence, direction-aware); the words rise in.
  - The step highlight glides (`layoutId`); a progress rail fills.
- **Theme:**
  - The `ThemeToggle` glyph is a CSS sun/moon morph (pathLength draw-on with scale).
  - `applyTheme(pref, animate, from)` runs a view-transition reveal clipped to a 12-lobe path growing from the button.
  - Fallbacks: the colour ease, or instant under reduced motion.
- **Drawer:**
  - TMU is "Citation tooling", "TMU · Engineering" (drawer-only overrides in `LOOKS`).
  - AMNH has two hash sub-links (`amnhLinks`), and the group is marked "you are here" on /work/amnh.
- **QA:** all touched suites are green; build passes.


## Iteration 32 (27 Oct 2026, your follow-up)
- **Contents:**
  - `ContentsVignettes.tsx`: pen redraws of each mark.
  - The `data-v` per entry sets `--v1`/`--v2` (light and dark) in WorkDrawer.css.
  - Pencil at rest; inked on hover, focus or this page.
  - The swash is a `clip-path` wipe; sub-pages are lettered.
  - The ADI pill and `drawerSubMarks` are gone.
- **Page transitions:**
  - `PageTransition` (React `ViewTransition`, `page-enter`/`page-exit`) via `app/template.tsx` and `app/work/template.tsx`.
  - The header carries `view-transition-name: site-header`, dropped while `data-theme-reveal` is set.
- **Homepage journeys:**
  - `HomeSectionLinks` (in the layout) catches `/#section` links off the homepage and stores `home:to` in sessionStorage.
  - `SmoothAnchors` then opens at the top, waits 550 ms and travels with motion `animate` (0.8–2.4 s, re-aiming every frame).
  - The reader takes over on wheel, touch or keys; reduced motion jumps.
- **QA:** `qa/transitions.mjs` 16/16. See QA.md for the rest.


## Iteration 33 (27 Oct 2026, your /goal: two work drawers)
- **Nav:** About · Now (`#now`, routes /work/lynxster and /work/amnh) · Work (`#selected-work`, other /work/) · More · Contact.
- **Wiring:** SiteHeader clones the page's `workMenu` (`<WorkDrawer current>`) per item with `part="now" | "work"`, so page call sites are unchanged. Sheet ids are `now-sheet` and `work-sheet`.
- **Now drawer:** the field-notebook spread (`.now*` in WorkDrawer.css; data `nowEntries` in work-index.ts). **Work drawer:** the contents list (7 entries, 01–07).
- **Rejected candidates** (specimen labels, index cards) were deleted after screenshots; see REVIEW.md iteration 33.
- **Phone header:** "AJ." below 480px, no chevrons below 640px, 40px links below 360px and tighter gaps below 340px.


## Iteration 34 (28 Oct 2026, your /goal: icons + AMNH colours)
- **ContentsVignettes:** an `ICONS` map holds the supplied Lynxster, AMNH (facade) and Columbia (column) icons, each with a viewBox crop, strokes, an optional fill and nodes. In WorkDrawer.css `.vignette--icon` sets heavier strokes, `.vignette__fill` and `.vignette__node`.
- **AMNH theme** (`globals.css`):
  - variables: `--amnh-accent` is #004bb4 by day and #d7fa88 at night; `--amnh-lime` and `--amnh-mark` added.
  - the dark ground is #181918.
  - `.theme-amnh` sets `--accent`, and has the lime selection and title mark.
  - the homepage AMNH card has its CTA in `--amnh-accent` and a lime tape.
- **Drawer:** AMNH `--v1` is #004bb4 by day and #d7fa88 at night; Lynxster's `--v2` is #2f9e8c.
- **Iteration 33 QA, finished:** every older suite now targets the right drawer (Now or Work) and the new anchors (#now, #selected-work).
