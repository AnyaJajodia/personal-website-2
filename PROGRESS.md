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
