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
