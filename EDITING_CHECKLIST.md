# Editing checklist — before publishing

Everything below is editable in two files:
- `src/content/site.ts` — homepage copy, trajectory, contact links
- `src/content/work.ts` — all 11 detail pages (titles, copy, roles, periods, metadata, figures, links)

Nothing here blocks the private preview. Placeholders render as quiet, non-clickable "to come" text, never as dead links.

## 1. 2027 end-date placeholders (`needsReview: true` in `src/content/work.ts`)

Per your request, uncertain end dates show **2027** in the preview. Replace with the real end (or "Present").

| Page | Shown now | What to confirm |
|------|-----------|-----------------|
| Lynxster | 2026–2027 | End date; start month (not verified); formal title (currently "Engineering & technical leadership") |
| AMNH | 2026–2027 | End date; start month |
| Crackd.ai | Sep 2025–2027 | End date |
| Buzzworks | May 2025–2027 | End date |
| TMU research tooling | May 2025–2027 | End date. The résumé versions disagree (Sep vs Oct 2025) |
| ADI mentorship | Jan 2024–2027 | End date |
| Inteli-lens | *(period hidden)* | Start date not supplied. `end: "2027"` is stored but the period is hidden until a start is added (no invented dates) |
| GVI · South Africa | *(period hidden)* | Same as Inteli-lens |

Confirmed and unchanged: ESP Jan 2024–Dec 2024; both publications 2022.

### AMNH mantis research (added 21 Oct 2026)
The research is described only as joining. The homepage reads "Joined a mantis behavioral research project. Details to come."; the detail page reads "I’ve joined a mantis behavioral research project at the museum." followed by a note that the details will be added once confirmed. All of this is in `src/content/work.ts` → `amnh.streams` and `src/content/site.ts` → `currently.features[1].streams`.
- [ ] The research question, methods, your responsibilities and any outcomes (then delete the `pending` note)
- [ ] Whether it sits in Invertebrate Zoology: the page eyebrow currently names only that department
- [ ] Whether the AMNH subtitle ("Digitizing dragonfly records…") and "What I’m exploring" ("not an established research project") still read correctly next to the new workstream

## 2. Missing URLs

| Item | Where | Status |
|------|-------|--------|
| LinkedIn profile | `contact.links` in `site.ts` | `url: null` → shows "Link to come" |
| Résumé PDF | `contact.links` in `site.ts` | `url: null` → shows "Updated PDF to come". Add the PDF to `public/` and set `url` |
| PMMY paper | `pmmy-research` → `links` | `url: null` → "Paper link to come" |
| Teenage pregnancy paper | `teenage-pregnancy-research` → `links` | `url: null` → "Paper link to come" |
| Crackd.ai repo | `crackd-ai` → `links` | Shown as "llm_chaining_matrix on GitHub" (`needsReview: true`). Confirm it belongs on this page; the label deliberately doesn't call it the full Crackd.ai codebase |
| GitHub profile | `site.ts` | Live: https://github.com/AnyaJajodia |
| Other repo/demo URLs | `links` on any entry | Optional |

## 3. Missing images (intentional placeholders now)

| Placeholder | Where | Needed |
|-------------|-------|--------|
| Lynxster application screenshot | `/work/lynxster` (dark frame "Application screenshot · To be selected") | Pick a screenshot, crop the browser chrome, and replace or redact identifying demo data (e.g. "Smoke Test Law Firm", hashes, the DEV bar in the supplied references). The reference screenshots were deliberately **not** copied into `public/`. Implement in `ScreenshotFrame` (`src/components/Figures.tsx`) |
| AMNH Plate 1 — archival dragonfly record | `/work/amnh` | Original photograph |
| AMNH Plate 2 — 3D-printed digitization rig | `/work/amnh` | Original photograph |
| AMNH Plate 3 — mantis behavioral research | `/work/amnh` (Mantis behavioral research section) | Original photograph |
| GVI fieldwork photograph | `/work/gvi-conservation` | Original photograph |
| Logos (supplied) | `public/logos/` ← `handoff/assets/logos/` | AMNH, Crackd, Buzzworks, TMU and GVI are now used. Runtime copies have transparent margins trimmed (some downscaled); the originals are untouched. Check each organisation's brand guidelines (clear space, approved backgrounds) before publishing |
| Lynxster product crop | `public/work/lynxster-funnel.webp` (Currently) | Cropped from your reference `lynxster-light-dashboard.png`: the Disclosure funnel card only, with no browser chrome, names or hashes. It shows demo data from that screenshot; swap it for an approved product image before publishing |
| Illustrations | `Specimen.tsx`, `RigDrawing.tsx`, More drawings | Authored drawings (dragonfly plate *fig. 1*, digitization rig, nib, bushveld contact sheet, wing under a lens). They illustrate interests, not your actual work; replace or keep as you prefer |
| Inteli-lens / Publications / Teaching marks | `MARKS` in `src/components/WorkPanels.tsx` | No logos exist, so small drawn marks are used (lens, papers, linked nodes). Swap in real logos if any exist |
| More tiles | `src/components/MoreBento.tsx` | Abstract scenes only (paper slips, blank prints, node diagram). When Writing / Photography / Experiments have content, swap the scenes for real material and add links |
| Portrait | — | Optional; the layout doesn't need one |

## 4. Facts to confirm

- Lynxster formal title, start month, end date (above).
- Lynxster palette was sampled from screenshot pixels. Compare with the real Lynxster theme tokens when available (`--lx-*` in `src/app/globals.css`).
- Graduation date is intentionally **not** shown (unconfirmed).
- The More section items (Writing / Wildlife photography / Experiments) are non-clickable placeholders with no routes. Add pages when ready.
- Selected-work panel colours (`LOOKS` in `src/components/WorkPanels.tsx`) are portfolio colours, not official brand tokens. Teaching was deepened to #07757A for text contrast. Keep text at ≥ 4.5:1 if you change them.
- Panel dates come from `period` in `src/content/work.ts`. GVI and Inteli-lens show **no date** until a start date is added there. Teaching shows the ESP + ADI span (Jan 2024–2027).
- The photo plate in More is a drawn contact sheet printed "Photographs to come". Replace it with real photographs only.
- Section labels ("About", "Currently", …) are no longer shown above headings; they remain in the header nav. The labels are still in `src/content/site.ts` if you want them back.
- The homepage line's tail calibration (`A_TAIL` in `src/lib/home-route.ts`) is specific to Cormorant Garamond 500. If the hero font or weight changes, re-run `node qa/measure-tail.mjs` and update it.

## 4b. Avatars (optional review)
- [ ] Poses chosen per moment and per project page are in `src/content/avatars.ts` (`poses`, `detailAvatars`). To swap one: add it to `POSES` in `scripts/build-avatars.mjs`, run `node scripts/build-avatars.mjs`, copy the printed size into `avatars.ts`, and re-read its anchor points (seat, fist) if the line is routed through it.
- [ ] Nothing illustrates the mantis research; add a figure there only once the research details are confirmed.

## 5. Before going public

- Remove `robots: { index: false, follow: false }` from `src/app/layout.tsx` (set for the private preview).
- Re-run `npm run check` and `node qa/check.mjs` (with `npm run start` running).
- No deployment, push, or publishing has been done.
