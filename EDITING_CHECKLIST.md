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
| AMNH | 2026–present | Resolved by amnh.md (31 Oct 2026); start month still to confirm |
| Crackd.ai | September 2025–May 2026 | Resolved by crackd-ai.md (25 Oct 2026) |
| Buzzworks | May 2025–May 2026 | Resolved by buzzworks.md (25 Oct 2026) |
| TMU research tooling | 2025 | Shown as "2025" (tmu-citation-tooling.md). The end month, September or October 2025, is still to be settled |
| ADI mentorship | Spring–Fall 2026 | Resolved by adi-mentorship.md (25 Oct 2026) |
| Inteli-lens | 2022 | Resolved by the revised inteli-lens.md (26 Oct 2026) |
| GVI · South Africa | Summer 2024 · Four-week program | Resolved by gvi-conservation.md (25 Oct 2026); certificate issued July 2024, exact attendance dates not established |

Confirmed and unchanged: ESP Jan 2024–Dec 2024; both publications 2022.

### AMNH behavioral research (revised 10 Nov 2026)
`/work/amnh/behavioral-research` is now a short, finished page, *Chaeteessa* · Behavioral research (Ongoing), from the copy supplied 10 Nov 2026 (`handoff/content/work/amnh-behavioral-research.md` → `src/content/amnh.ts`). The overview, homepage and drawer summaries were updated to match. Still open:
- [ ] Your role label and start date for this project (the page shows neither; the overview's "Volunteer · 2026–present" covers AMNH as a whole)
- [ ] Any images that may be shared publicly (none are used or invented)
- [ ] Update "Where it stands" when the trials and analysis move on (it says processing and analysis are still to come)
- [ ] DIODE: the BugBase developer credit, if you'd like one shown (none is invented)

### Held back from this release (10 Nov 2026)
Writing and Experiments are hidden from the homepage's More section (they had no pages, only "Later" cards). To bring one back, add its name to `more.items` in `src/content/site.ts` (`more.deferred` lists them and keeps the former intro and note); `MoreBento.tsx` and `globals.css` still hold their artwork and layout. The About paragraph still mentions writing as an interest.

### Homepage dates and roles now differ from the detail pages (25 Oct 2026)
The homepage takes its roles and dates from the revised `handoff/content/home.md` (`site.ts` → `currently.features[].role/period`, `selectedWork.rows[].date`). The detail pages were deliberately not rewritten in this pass, so `work.ts` still shows the older values. Reconcile them in the detail-page pass:

| Entry | Homepage (home.md) | Detail page (`work.ts`) |
|-------|--------------------|-------------------------|
| Lynxster | Chief Technology Officer · 2026–now | "Engineering & technical leadership" · 2026–2027 |
| AMNH | Volunteer · 2026–now | Volunteer · 2026–2027 |
| Crackd.ai | 2025 | September 2025–May 2026 (crackd-ai.md) — update home.md to match? |
| Buzzworks | 2025–2026 | May 2025–May 2026 (buzzworks.md) — consistent |
| TMU research tooling | 2025 | 2025 (tmu-citation-tooling.md) — consistent |
| Inteli-lens | 2022 (updated 26 Oct 2026 from inteli-lens.md; home.md still says 2023) | 2022 (inteli-lens.md) — consistent |
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
| Résumé PDF | `contact.links` in `site.ts` | `url: null` → shows "Updated PDF to come" in Say hello, and the homepage header's Résumé pill is a placeholder (aria-disabled). Add the PDF to `public/` and set `url`: both become download links |
| PMMY paper | `src/content/research.ts` → `pmmy.publication.paperLink` | No verified URL supplied, so none is shown (no placeholder). Add `paperLink: { label, url }` once a publisher URL or public PDF exists |
| Teenage pregnancy paper | `src/content/research.ts` | **Linked** (supplied in the Markdown, checked live: IJSHRE PDF), with Project Ārogya’s page |
| Crackd.ai repositories | `src/content/crackd.ts` → `apps[].repo` | One per application, each linked from its own application (all three checked public, 26 Oct) |
| Crackd.ai live apps | `src/content/crackd.ts` → `apps[].live` | Checked 26 Oct. **User app** (crackdspring2026.vercel.app) answered with Google sign-in, labelled "Sign-in limited to Columbia, Barnard, and Stanford email addresses" (from the notes). **Matrix** (crackdmatrix.vercel.app) redirected to sign-in, labelled "Requires sign-in"; confirm any domain restriction. **Admin** (crackd-admin-panel.vercel.app) returned **404**, so no link is shown; add `live` once the address works |
| GitHub profile | `site.ts` | Live: https://github.com/AnyaJajodia |
| Other repo/demo URLs | `links` on any entry | Optional |

## 3. Missing images (intentional placeholders now)

| Placeholder | Where | Needed |
|-------------|-------|--------|
| Lynxster application screenshot | `/work/lynxster` (dark frame "Application screenshot · To be selected") | Pick a screenshot, crop the browser chrome, and replace or redact identifying demo data (e.g. "Smoke Test Law Firm", hashes, the DEV bar in the supplied references). The reference screenshots were deliberately **not** copied into `public/`. Implement in `ScreenshotFrame` (`src/components/Figures.tsx`) |
| DIODE illustrations | `/work/amnh/diode`, homepage AMNH preview, `/work/amnh` | Supplied and integrated 31 Oct 2026 (`public/assets/amnh/diode/`). Still to confirm: public-use permission for the specimen images and the BugBase screen recreations; the corresponding label image for AMNH_IZC 00560622 (the review view shows an empty card thumbnail); an optional rehousing photograph |
| *Chaeteessa* illustrations | `/work/amnh`, `/work/amnh/behavioral-research` | Supplied and integrated 10 Nov 2026 (`public/assets/amnh/behavioral/`, from the selected “lid” and “row” options; the row redrawn as three closed enclosures without the camera). Stylized and captioned as illustrative; replace if real photographs become shareable |
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
- Panel dates come from `period` in `src/content/work.ts`. (Inteli-lens now shows 2022, from its revised inteli-lens.md.) Teaching shows the ESP + ADI span (Jan 2024–2027).
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
- [x] Demo links: user app and matrix shown; admin 404 (see §2)
- [x] Walkthroughs built from the supplied screenshots (26 Oct; see below)
- [ ] The matrix experiment (goal, chain stages, what changed, outputs, assessment, phase). The staging paragraph is omitted until it's ready
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

## Content to reconcile (26 Oct 2026, from the design pass)
- `handoff/content/home.md` lists Crackd as (2025) and Research publications as (2022-2024). The homepage now shows 2025–2026 and 2022, matching the detail pages. Update home.md if those are right.
- ESP/ADI revised text: integrated (26 Oct).

## Evidence still missing (26 Oct 2026, content pass)
- **Buzzworks — Manage leave:** the reconstruction stops at balances and a sample policy. The actual leave-request sequence needs confirming before it can be shown (notes).
- **Buzzworks — references:** the notes mention private reference screenshots. None are in the repo, so the reconstruction follows the interaction types the notes describe (buttons, lists, document cards, confirmations).
- **PMMY:** no verified publisher link or PDF was supplied, so none is shown. The financial figures still need checking before any financial chart.
- **Teen:** the hospital and outreach photographs are optional, and no placeholder is shown.
- **GVI:** confirm the prey species for Taba's caption (unchanged).

## Crackd.ai walkthrough assets (26 Oct 2026)
- Originals: `handoff/assets/crackd-source/` (never served). Prepared copies: `public/assets/crackd/` via `node scripts/build-crackd-walkthroughs.mjs`. Edit a rule and rerun to change any crop or blur.
- **Balloon photograph:** obscured in user 03/05/06 and admin 01/02. The admin app marks its record Private, and it is the account's own upload. If it may be published, set `PERSONAL_PHOTO = false` and rerun.
- **Admin step 2 ("Inspect image context"):** the record is private, so its photo, IDs and generated description are blurred. The screen shows only the panel layout and labels. **Flag: replace with a capture of a public record.**
- **User step 2 ("Rate a caption"):** shows a person's face from the platform's voting content (not private-marked); left as supplied. Confirm it may be shown.
- **User step 3:** the upload filename ("WhatsApp Image…") is visible; the thumbnail is blurred.
- **Sequence:** tours are presented as selected screens. The user results aren't claimed as the pictured upload's outcome, and the matrix gallery subtitle says it shows a different image from the test-set step.

## Inteli-lens page (26 Oct 2026)
Page: `components/inteli/InteliPage.tsx` + `inteli.css`; copy: `content/inteli.ts` (verbatim from the revised `inteli-lens.md`).
- [ ] **Homepage summary changed.** The homepage card now uses the Markdown's own summary ("An independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication.") and 2022. `handoff/content/home.md` still has 2023 and the old drunk-driving line, so update it if you want the handoff to match. The drawer shows no dates; its label stays "Prototype".
- [ ] **Illustration.** `public/assets/inteli-lens/mockup.png` is a generated reconstruction, captioned "Illustrative reconstruction of the early prototype." Its own corner label is kept: nothing is cropped. The page serves `mockup-960.webp` / `mockup-1600.webp`, made with `cwebp -q 84 -resize 960 0` and `cwebp -q 86`, and "View full size" opens the PNG. Rerun both commands if you replace the PNG. On phones the notebook text is too small to read inline, which is why the full-size link is there.
- [ ] **Archival screenshot not used.** The blurry Jupyter screenshot described in the notes was not supplied in the repo. If you add it, crop its black border and caption it "An early video-detection experiment in Jupyter." Don't present its labels as results.
- [ ] **Unconfirmed tools still unconfirmed.** PyQt5, FFmpeg, SQLite, preprocessing and augmentation are from older résumés and are not on the page. Add them only once they're checked against the original project.
- [ ] "More details to come as I revisit the original project materials." stays until you have those materials.


## Wildlife photography page (26 Oct 2026, final selection)
Page: `/wildlife-photography` (`components/wildlife/`). The collection, its copy and its order are in `content/wildlife-photos.json`. The homepage plate shows `highlights/homepage.png`.

**Experiment branch (`experiment/design-pass`) only:** the supplied files stay untouched, but the pages now serve web-sized WebP copies made from them (`node scripts/build-wildlife-web.mjs` → `public/assets/wildlife-web/`; run it after adding or replacing a photograph). Page weight: gallery 44 MB → 1.6 MB, homepage 9.4 MB → 1.1 MB. To go back to the originals, revert `wildlife.ts`, `WildlifeGallery.tsx` and `PhotoStack.tsx`. On the committed baseline the following still holds. **The photographs are served exactly as supplied.** There are no resized or re-encoded copies; checksums were identical before and after this pass. `scripts/build-wildlife-photos.mjs` only reads them, for pixel size and a loading colour, and it fails on any of these:
- a missing file
- a file in the folders that isn't in the collection
- a photograph listed twice

**To add, swap or reorder:**
1. Put the file in `highlights/`, `main-gallery/` or `secondary-gallery/`. The folder sets its size on the page: main photos are larger, secondary ones smaller.
2. Edit the JSON (`photos`, plus a place in `rows`).
3. Run the script.

Photos in a row share one height. A nested list in `rows` stacks photos in a column, and the column is exactly as tall as the row. Widths are worked out in `content/wildlife.ts`. `"width": 0.8` narrows a row. All photographs sit the same small distance apart (one continuous collection).

**Sequence:** the opening photo, then five rows:
1. Golden hour lion + Elephant among trees
2. Hornbill over Perched raptor (stacked) + Walking leopard (large)
3. Collared cheetah over Feeding giraffe + Jacana (largest) + Elephant family over Elephant profile
4. Sunset giraffes + African fish eagle
5. Twilight hippos

The camera avatar kneels on the closing rule after the hippos.

That's 14 photographs.

- [ ] **Page weight.** The originals are PNGs of 1.5–5.1 MB, about 44 MB for the whole page and 3 MB more on the homepage for the preview. They load lazily, a few at a time as you scroll, with a soft colour in each place until they arrive. On slow connections they appear late. If you want, smaller WebP copies could be served with the originals kept as the master files (a scripted, reversible step), but only with your go-ahead, since this pass was told not to resize or regenerate.
- [x] **Copy:** every photograph now has your title, a short hover caption (`hover`) and a longer caption for the opened view (`caption`), all in `content/wildlife-photos.json`. The alt text was updated to match your identifications: lioness, white lion, tawny eagle, southern yellow-billed hornbill, African jacana, Taba, and the female leopard.
- [ ] The earlier temporary files (`1.png`–`7.png`, `IMG_…`, the screenshot, and their renamed copies) are gone from the folder, so the old filename mapping no longer applies.


## Lynxster page (27 Oct 2026)
Page: `/work/lynxster` (`components/lynxster/`). Copy: `content/lynxster.ts`, verbatim from the revised `handoff/content/work/lynxster.md`; its internal notes are not rendered. Homepage card: `content/site.ts`, shown as “CTO & Co-founder · April 2026–present · Patent pending”.

**Visuals (27 Oct 2026, second pass).** These were adapted from your three HTML studies, which now live in `.local-references/lynxster/` (gitignored, never served or committed):
- homepage: 01 Floating
- page header: 05 Watching
- main visual: 09B Package assembly, rebuilt with abstract records only, so no product data or claims

They use the real `lynxster-mark.png` and a Jost Light wordmark, with navy in light mode and teal in dark.

- [ ] **Copy:** confirm the one typo I corrected from the Markdown, “interally” → “internally”.
- [x] **home.md now matches:** its Lynxster entry reads “CTO & Co-founder · April 2026–present · Patent pending” with the lynxster.md line; the FERPA / legal-frameworks claim is removed.
- [ ] **Reference images:** the two new references were moved from `public/assets/lynxster/` to `.local-references/lynxster/`, which is gitignored (as is `public/**/*-mode-reference.png`). They were never committed, pushed or served.
- [ ] **Older screens are already in git history and on GitHub:**
  - `handoff/assets/references/lynxster-{light,dark}-{dashboard,terms}.png` and `handoff/design/lynxster-detail-mockup.png` (committed in `d00542b`; under `handoff/`, so not served by the site).
  - `public/work/lynxster-funnel.webp` (the old homepage screenshot). It's deleted in the working tree, but committed and pushed, and it would have been publicly reachable on any deployment made from those commits.
  - Removing them from history needs a rewrite and force push. Not done; your call.


## Labels still to decide (27 Oct 2026)
- **TMU "Research" elsewhere.** The drawer now says "Citation tooling · TMU · Engineering". The homepage panel ("Research tooling · Toronto Metropolitan University", category Research) and the pager name (`work.ts`: "Research tooling · TMU") are unchanged. Align them if you want the same wording everywhere.
- **AMNH's two roles** link to `#collections-digitization` and `#mantis-research` on `/work/amnh`. When each gets its own page, change `amnhLinks` in `src/content/work-index.ts` to the new slugs.

## Icons and AMNH colours (28 Oct 2026)
- **Drawer icons** for Lynxster, AMNH and Teaching come from `currently-icons-svg.zip` (Regular, Museum, Ionic column), in `src/components/ContentsVignettes.tsx` (`ICONS`). To swap one, replace its strokes, fill and nodes there.
- **AMNH colours** are from amnh.org (blue #004BB4, lime #D7FA88) and live in `globals.css` (`--amnh-*`) and the drawer (`.sheet [data-v="amnh"]`).
