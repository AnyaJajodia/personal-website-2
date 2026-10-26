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
| Crackd.ai | September 2025–May 2026 | Resolved by crackd-ai.md (25 Oct 2026) |
| Buzzworks | May 2025–May 2026 | Resolved by buzzworks.md (25 Oct 2026) |
| TMU research tooling | 2025 | Shown as "2025" (tmu-citation-tooling.md). The end month, September or October 2025, is still to be settled |
| ADI mentorship | Spring–Fall 2026 | Resolved by adi-mentorship.md (25 Oct 2026) |
| Inteli-lens | *(period hidden)* | Start date not supplied. `end: "2027"` is stored but the period is hidden until a start is added (no invented dates) |
| GVI · South Africa | Summer 2024 · Four-week program | Resolved by gvi-conservation.md (25 Oct 2026); certificate issued July 2024, exact attendance dates not established |

Confirmed and unchanged: ESP Jan 2024–Dec 2024; both publications 2022.

### AMNH mantis research (added 21 Oct 2026)
The research is described only as joining. The homepage now reads "Mantis behavioral trials & research — Details to come." (home.md, 25 Oct 2026); the detail page reads "I’ve joined a mantis behavioral research project at the museum." followed by a note that the details will be added once confirmed. All of this is in `src/content/work.ts` → `amnh.streams` and `src/content/site.ts` → `currently.features[1].streams`.
- [ ] The research question, methods, your responsibilities and any outcomes (then delete the `pending` note)
- [ ] Whether it sits in Invertebrate Zoology: the page eyebrow currently names only that department
- [ ] Whether the AMNH subtitle ("Digitizing dragonfly records…") and "What I’m exploring" ("not an established research project") still read correctly next to the new workstream

### Homepage dates and roles now differ from the detail pages (25 Oct 2026)
The homepage takes its roles and dates from the revised `handoff/content/home.md` (`site.ts` → `currently.features[].role/period`, `selectedWork.rows[].date`). The detail pages were deliberately not rewritten in this pass, so `work.ts` still shows the older values. Reconcile them in the detail-page pass:

| Entry | Homepage (home.md) | Detail page (`work.ts`) |
|-------|--------------------|-------------------------|
| Lynxster | Chief Technology Officer · 2026–now | "Engineering & technical leadership" · 2026–2027 |
| AMNH | Volunteer · 2026–now | Volunteer · 2026–2027 |
| Crackd.ai | 2025 | September 2025–May 2026 (crackd-ai.md) — update home.md to match? |
| Buzzworks | 2025–2026 | May 2025–May 2026 (buzzworks.md) — consistent |
| TMU research tooling | 2025 | 2025 (tmu-citation-tooling.md) — consistent |
| Inteli-lens | 2023 | period hidden (no start date) |
| Conservation fieldwork · South Africa | 2024 | Summer 2024 (gvi-conservation.md) — consistent |
| Research publications | 2022–2024 | both papers 2022 |
| Teaching & mentorship | 2024–2026 | ESP Fall 2024–Spring 2025 (taken Spring 2024); ADI Spring–Fall 2026 — consistent |

- [ ] Confirm the publications range: home.md says 2022–2024, but both papers are dated 2022 on their pages
- [ ] Crackd.ai: the detail page now says September 2025–May 2026 (crackd-ai.md); the homepage still says 2025 (home.md). Update home.md if the homepage should match
- home.md writes ranges with hyphens ("2025-2026"); the site sets them with en dashes, as in "2026–now"

## 2. Missing URLs

| Item | Where | Status |
|------|-------|--------|
| LinkedIn profile | `contact.links` in `site.ts` | **Supplied (home.md, 25 Oct 2026):** https://www.linkedin.com/in/anya-jajodia/ |
| Résumé PDF | `contact.links` in `site.ts` | `url: null` → shows "Updated PDF to come". Add the PDF to `public/` and set `url` |
| PMMY paper | `src/content/research.ts` → `pmmy.publication.paperLink` | No verified URL supplied, so none is shown (no placeholder). Add `paperLink: { label, url }` once a publisher URL or public PDF exists |
| Teenage pregnancy paper | `src/content/research.ts` | **Linked** (supplied in the Markdown, checked live: IJSHRE PDF), with Project Ārogya’s page |
| Crackd.ai repositories | `src/content/crackd.ts` → `apps[].repo` | One per application, each linked from its own application (all three checked public). Not shown: the demo URLs (crackdspring2026 / crackd-admin-panel / crackdmatrix on vercel.app) — crackd-ai.md says their status still needs confirmation. Add them to `apps[]` once confirmed |
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

## Crackd.ai page — content and assets to come (25 Oct 2026)
The page follows `handoff/content/work/crackd-ai.md`; its implementation notes are not rendered. Everything below is deliberately absent, not shown as a placeholder:
- [ ] Demo links for the three applications (status to confirm; see §2)
- [ ] Application screenshots, for the planned screenshot walkthrough dialogs (not built yet, by design)
- [ ] Pipeline / output examples
- [ ] The system architecture map — its connections must come from the actual implementations
- [ ] Precise frameworks, languages, model providers, hosting and MCP tools (the Tools section lists only confirmed capabilities)
- [ ] Michael Roger's preferred name and affiliation before adding the longer biography (the short credit is used)
- Drawer: "Browse work" (WorkDrawer) is mounted on Crackd only. Its entries come from `site.ts`; its tones and logos mirror the homepage panels (`src/content/work-index.ts` — keep in step if a panel's colour or logo changes). Dates are left out of the drawer until homepage and detail dates agree

## Buzzworks page — still to confirm (25 Oct 2026)
The page follows `handoff/content/work/buzzworks.md`; its internal notes are not rendered. Everything below is deliberately absent:
- [ ] Final programming languages, frameworks, service names and Docker setup (FastAPI is not mentioned until confirmed)
- [ ] The actual document storage destination and file lifecycle (no storage provider, retention, encryption or deletion is named)
- [ ] Each Claude agent's responsibility, how it reaches policy documents, and how unanswered questions are handled (the page says only "two-agent Claude system")
- [ ] Status of nominee and prior-employment forms, reminders, session recovery and advanced editing (not shown)
- [ ] The earlier "sub-200ms at 10K+ sessions" claim — withheld pending what was timed, concurrent vs total sessions, workload and environment
- [ ] ICICI: the page says the platform "was being prepared for integration"; update only if the rollout is confirmed
- Screenshots: none, by design (confidential). The conversation on the page is a fictional reconstruction, captioned with the notes' wording
- The detail-page header now carries "Browse work" on every project page (WorkDrawer); the homepage header is unchanged

## TMU citation-tooling page — notes (25 Oct 2026)
The page follows `handoff/content/work/tmu-citation-tooling.md`; its internal notes are not rendered.
- [ ] Settle the end month (September or October 2025) if a range should replace "2025"
- Confidential by design: no notebook, manuscript passages, source documents, review files or outputs are linked, embedded or offered for download. The development notebook is not presented as the final system
- The walkthrough, review rows and bibliography lines are fictional (one invented reference, note 14 → note 13 → "Hale 2016") and are labelled illustrative wherever they appear (`src/content/tmu.ts`)
- Metrics shown are only the confirmed 800+ footnotes, 92% accuracy and 30% fewer manual review cycles; no benchmark method or timing is stated

## GVI page — photographs (supplied 25 Oct 2026; resized copies via `node scripts/build-gvi-photos.mjs`)
Set each one's `src`, `alt`, `width` and `height` in `src/content/gvi-photos.ts`, with the file in `public/work/gvi/`. The placeholders already hold the right proportions.
- [ ] **Opening** (wide, 21:9 on desktop, 4:3 on phones): an animal within the wider bushveld, or a documentary fieldwork image
- [ ] **Fieldwork** (portrait 4:5; 4:3 on phones): monitoring, surveys or camera traps
- [ ] **Community teaching** (3:2): only with permission and with children's faces obscured
- Your own photographs only (no stock or generated imagery); avoid sensitive wildlife locations or tracking details
- The lion relocation video is deliberately not on the page; add it later, never as the hero and never autoplaying
- Aerial-survey involvement is omitted until your exact participation is clarified
- The certificate is shown as text; no certificate file is linked

## Research pages — notes (25 Oct 2026)
Both pages follow `handoff/content/work/pmmy-research.md` and `teenage-pregnancy-research.md`; their internal notes are not rendered.
- [ ] **PMMY paper link:** none supplied. The page gives the full reference and journal details only
- [ ] **PMMY financial figures:** some category values and totals in the published tables look inconsistent, so no financial trend chart is drawn until they're checked
- [ ] **Teen regression metrics:** shown only as "correlation and error metrics" (public copy). The values in the notes are deliberately not displayed or headlined as accuracy
- [ ] **Optional Project Ārogya photograph:** one small slot (`arogyaPhoto.src` in `src/content/research.ts`, file in `public/work/research/`). Only an image suitable for public sharing
- Removed from the old records: "helping secure startup loans for 50+ women" and the "annual panel" at Chirayu Hospital (neither is in the approved copy)

## ESP / ADI pages and Columbia logos — notes (25 Oct 2026)
- Logos are served from `public/logos/` (not `public/assets/logos/`): `columbia-crown-light.png` / `-dark.png`, `columbia-wordmark-light.png` / `-dark.png` and `ADI.png`. `adi-mark.png` is a derived, tightly cropped copy of `ADI.png` used in the pills; the original is unchanged.
- **Theme mapping (confirmed by inspecting the files):** `-light` is deep blue (light theme) and `-dark` is pale blue (dark theme); each pair has identical artwork bounds.
- **Homepage Teaching card:** the deep-blue crown is used in both themes, because the card's lavender surface stays light in dark mode, where the pale-blue crown would nearly disappear (≈1.3:1). The same applies to the drawer's Teaching entry.
- Stale claims removed with the old records: "10+ students", internships at Google, Meta and Duolingo, and the Jan 2024 / 2027 dates
- Please confirm with Columbia and ADI that their logos may be used this way before publishing

## Navigation / Buzzworks / GVI refinement — notes (25 Oct 2026)
- The GVI white logo is served from `public/logos/gvi-white.png` (not `public/assets/logos/`). It is used only in Dark; Light keeps `gvi.webp`.
- The Buzzworks header uses `public/logos/buzzworks-minimal.png` beside "Buzzworks" set in the site serif. This is page typography, not the official wordmark.

- GVI: Taba's caption deliberately doesn't name the prey species. Add it to `content/gvi-photos.ts` once confirmed.
