# Visual & functional review

## Iteration 21 — navigation and accent refinement (25 Oct 2026)

**Navigation:**
- On detail pages, the right-side **Work** item is now the drawer's trigger: a real `<button>` with a small chevron, `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls="work-sheet"`, a 2px focus ring and a hit area of at least 44px.
- The separate "Browse work" pill beside the name is gone (`SiteHeader` takes `workMenu` in place of `lead`). On the homepage, Work stays a link to `#work`.
- The drawer opens with **"← Back to work overview"** (`/#work`), then the experience list, with the current page still marked. The old footer of homepage section links was removed because it duplicated the header.
- Focus trap and restore, Escape, scroll lock, close-on-navigate and the restrained slide/fade are unchanged.

**Navbar accents:**
- The hard-coded blue scribble background is replaced by a `::after` pen-stroke mask filled with `currentColor`.
- On detail pages, the active Work text and its underline take each page's `--accent`, so they follow Light, Dark and System.
- On the homepage, the underline appears on hover in the navbar's hover colour.

**Buzzworks:**
- **Header:** the full logo on a white tile is replaced by the minimal orange symbol (`/logos/buzzworks-minimal.png`, proportions kept) next to "Buzzworks" set in the portfolio serif.
- **Conversation, desktop:** the window grew from about 23.5rem to 31rem (≈32%). Bubbles wrap at 72% of the window, the radius is calmer, and the annotation gap is rebalanced.
- **Conversation, mobile:** each annotation now sits below its exchange.

**Crackd (Light):**
- The near-black applications panel is gone.
- The user app reads as open page text, marked by a short yellow rule.
- Admin and the matrix sit on warm pale-stone surfaces (#efe8da) with a fine rule and a soft shadow.
- Yellow remains in the rules, markers, chain and matrix accent.
- Dark keeps the previous panel exactly (re-scoped under `[data-theme="dark"]` and the System fallback).

**GVI:**
- **Logo:** `gvi-white.png` in Dark and the existing logo in Light, swapped through `ThemeLogo` in one shared box, with no cream tile.
- **Closing section:** "What stayed with me" is now open: a small forest label, a green serif pull quote (21ch), normal-width paragraphs, and one fine rule with a short sage thread dropping from it. No card, border or gradient.

**Found and fixed while verifying:**

| # | Pri | Defect | Fix |
|---|-----|--------|-----|
| 1 | P1 | The Work button inherited body colour instead of the accent. | `.site-nav__work { color: var(--accent) }` |
| 2 | P1 | The dialog rendered inside the nav `<li>`, so the drawer's links counted as part of the Primary navigation landmark. | Portaled the dialog to `document.body` after hydration. |
| 3 | P2 | Work's text and underline sat 1.4–4px off the neighbouring links. | Baseline alignment on detail headers; underline drawn on the label span; label line-height matched. |
| 4 | P2 | The Work hit area was under 44px. | `::before` inset `-0.7rem -0.4rem`. |

**Remaining (not material):**
- The drawer now takes the site's tokens rather than each page's, because it lives under `body`. Its current-page mark still uses the site accent.
- On phones, the Work underline sits up to 0.8px from the other links' underline (exact on desktop).

**Follow-up — drawer motion and hover:**
- **Why the drawer felt like a pop:** frame sampling showed it covered half its 430px trip in the first ~50ms, then crept the rest. Closing sped up the whole way and was still at full speed when it vanished.
- **Open:** now 500ms with a soft drawer curve, `cubic-bezier(0.32, 0.72, 0, 1)`. It builds to about 59px per frame by ~100ms, then settles.
- **Close:** now 320ms, eased at both ends (`--sheet-out: 320`). The overlay fades on the same timings.
- **Hover:** each entry lifts 2px with a deeper shadow, like the homepage cards, and a project with sub-pages lifts as one card. Pressing settles it back. The overview arrow nudges left. Dark gets a stronger black shadow so the lift reads. Under reduced motion, hover keeps only its border and shadow.

## Iteration 20 — ESP and ADI pages, Columbia/ADI logos (25 Oct 2026)

**Sources:** `handoff/content/work/esp-teaching.md` and `adi-mentorship.md` (found by title). Both already held the supplied replacement text exactly. Every approved line is on its page and nothing from the notes. "Peer Instructor" is shown as the copy has it, never as an appointment; participation (Spring 2024) is kept apart from the teaching dates; program-wide offerings are set apart. ADI shows six anonymous mentees across two cohorts, with no outcomes or placements.

**Logos:** they live in `public/logos/` (the brief said `public/assets/logos/`).
- **Colour mapping:** confirmed by pixel inspection, deep (light theme) and pale (dark theme), identical bounds.
- **`ThemeLogo` component:** renders both variants in one box and swaps them with the pre-paint `data-theme`, so there's no wrong-colour first frame, no shift, and a single labelled image for screen readers.
- **ADI:** `adi-mark.png` is a cropped copy of `ADI.png` with deliberate padding, shown in a fully rounded, overflow-hidden pill. Its blue and white are identical in both themes, and the original is kept.

**Homepage (logo only):** the Teaching & mentorship card's generic icon and tile are replaced by the standalone Columbia crown, in the same 60px slot, 38px of visible artwork, centred. It's deep blue in both themes because the lavender card stays light. Markup differs only by that element, and pixels change only inside the slot (0 outside).

**Drawer:** the Teaching entry shows the crown untiled, with ADI's pill beside its link.

**Pages:** `content/columbia.ts` + `components/columbia/{ColumbiaParts,EspPage,AdiPage}.tsx` + `columbia.css`, with the Columbia wordmark in both headers (ADI adds its pill). Accents are the wordmark's own blue #1E4F91 in light and #a8d2f7 in dark.
- **ESP:** the progression first (Spring 2024 student → Fall 2024 teaching assistant → Spring 2025 teaching, on one thread), then "What is ESP?", the week with one small algorithms example and "Across the program" set apart, and the reflection. One figure.
- **ADI:** what ADI is, how matching worked (three steps, plus two cohorts of three anonymous dots), the four themes as a numbered editorial index with the closing line as a pull, continuity, and the reflection.

**Found and fixed while verifying:** the QA flagged "2027" in hashed asset names on the dev build. The claim checks now read visible text only.

## Iteration 19 — research publications (PMMY, teenage pregnancy) + consistency pass (25 Oct 2026)

**Sources:** `handoff/content/work/pmmy-research.md` and `handoff/content/work/teenage-pregnancy-research.md` (found by title). Every approved line is on each page and nothing from their notes.
- **Attribution kept:** exact published titles; both authors; Anya as lead researcher; Reetu Jain as mentor and co-author.
- **Links:** only the two supplied in the teenage-pregnancy file (paper PDF, Project Ārogya), both checked live. No PMMY link was supplied, so none is shown.

**Built:** `content/research.ts` + `components/research/{ResearchParts,PmmyPage,TeenPage}.tsx` + `research.css`.
- **Shared parts:** hero, publication card (exact title, authors, journal, volume, issue, month, pages; paper access; a jump to the reference), question, numbered steps, tables, and a reference with the companion paper. Each page sets only its accent (PMMY burgundy/rose; teen teal/aqua/apricot), lifted in dark mode on the site's own night.
- **Cross-links:** the companion-paper card, plus contextual links where Saksharta spans both projects.
- **PMMY figures:**
  - a methods diagram of the two strands, with the movie-review training material drawn apart (dashed) from the tweet flow;
  - the sentiment chart as directly labelled HTML bars drawn to 78 / 12 / 10, with the data table beside it (the plot is hidden from assistive tech; the table carries the data) and the notes' caption plus the copy's own "not approval or accuracy" line;
  - the barriers as chips;
  - no financial trend chart.
- **Teen figures and sections:**
  - five NFHS rounds across 1992–2021, "in order, not to scale" (no invented round years), feeding preparation → exploratory analysis / linear regression → interpretation;
  - findings in words, each with its association-not-causation note;
  - the hospital as one 2022 event in three parts (presented, led the discussion, retained internally);
  - Project Ārogya with the 200+ reach, the four roles in the copy's words, one small optional photo slot, the Ārogya link and the participation-not-outcomes line;
  - no regression metric values.
- **Consistency pass** (`qa/consistency.mjs`) across TMU, GVI, both research pages, Crackd and Buzzworks: identical header and drawer, On this page, h1/h2/body scale, line height, section rhythm, content column, measure, and light/dark backgrounds, plus a skip link, main landmark and one h1 on each. No regressions, so no changes were needed.

**Found and fixed while verifying:**
1. The hero repeated the page name under the breadcrumb. The approved "Publication" fact replaces it.
2. A heading and its TOC label could start a line with an em dash. Word joiners keep the dash with the preceding word.
3. Link arrows sat tight against their labels.
4. The detector flagged a thick accent border on the rounded publication card. It's now a short running-head rule above the card's label.

## Iteration 18 — GVI conservation case study (25 Oct 2026)

**Source:** `handoff/content/work/gvi-conservation.md`. Every approved line is on the page and nothing from its internal notes.
- **Boundaries kept:** an early working model, not a deployed system; the lion relocation observed, not performed; the 50 km event "helped organize and participated in", with no fundraising total or personal distance; aerial surveys omitted; the certificate as text.

**Built:** `content/gvi.ts`, `content/gvi-photos.ts` (the replaceable photo configuration) and `components/gvi/{GviPage,PhotoSlot}.tsx` + `gvi.css`, routed in `[slug]`. It reuses the header drawer, theme control, "On this page" and `case.css`. The work.ts name "GVI · South Africa" is kept for the pager labels.

**Design:** a personal field journal in the portfolio's own background, serif and thread. Proposed bushveld accents (forest, sage, earth, sand) mark and annotate only; dark mode keeps the site's night with a faint green tint on surfaces, and the forest accent is lifted to #b4cda2.
- **The turn first and last:** the opening ends on "It opened a direction…" in large forest serif under a pencilled rule. "What stayed with me" closes the page on its one tinted panel.
- **Four parts:** I · Fieldwork, II · Data, III · Practical and community work, IV · What followed, each a numbered marker with a fading sage rule.
- **Field-note devices from the copy's own words:**
  - a placement entry heading;
  - survey and method logs;
  - observed / attended entries for the decisions section;
  - a formats log;
  - the questions beyond a demonstration;
  - an "After the internship" note keeping the later ideas apart from the model work;
  - the certificate set as text in a double-ruled frame.
- **Photographs:** three slots only — a wide opening (21:9, 4:3 on phones), a portrait fieldwork image beside "In the field", and community teaching (3:2). Each placeholder is quiet: a viewfinder, "Photograph to come", what belongs there, and a field-note caption. No stock images, video or autoplay.
- **Figure:** the binocular figure stands on the rule beside the field logs, away from every photograph.

**Found and fixed while verifying:**
1. The breadcrumb didn't name the page; it now carries the approved name, "GVI · South Africa".
2. The thread check flagged a full-width dates box. The line is now its own width; the thread never touched the text.
3. The detector flagged a side-stripe accent on the turning-point line. It's now a short rule above the line.
4. The field logs had uneven heights, and the opening photograph was capped to stay modest on short screens.

## Iteration 17 — TMU citation-tooling case study (25 Oct 2026)

**Source:** `handoff/content/work/tmu-citation-tooling.md`. Every approved line is on the page; nothing from its internal notes, and nothing confidential: no notebook, manuscript, sources or outputs, and no links or downloads. Date: "2025". Metrics: only the confirmed 800+ / 92% / 30%.

**Built:** `content/tmu.ts` + `components/tmu/{TmuPage,Walkthrough}.tsx` + `tmu.css`, routed in `[slug]`. It reuses the header drawer, theme control, "On this page" and `case.css`. The work.ts name "Research tooling · TMU" is kept, so the neighbouring pages are unchanged.

**Design:** an annotated research notebook in the portfolio's own background, serif and thread. TMU blue (#004C9B, lifted to #9cc3f2 in dark) marks stages, borders, links, the thread and selection; gold (#FFDC00) only annotates; the logo is unchanged.
- **Problem first:** the intro and the problem, with Id., Ibid. and Supra set as signals and a pull line.
- **Results:** "What I built", with one output panel for the confirmed results (the figures above the verbatim sentence).
- **Walkthrough:** "One reference, followed through", one fictional reference across the five stages (original footnote → source match → in-text citation → bibliography entry → review row).
  - Without JavaScript every stage, example and explanation is shown under plain headings, with no inert buttons.
  - With JavaScript each stage is a button that reveals its explanation (one at a time); arrow keys and Home/End move between them, and touch works. Under reduced motion nothing moves.
- **Six stages:** numbered cells ([01]–[06]) with a sentence from each set as a gold margin note. Stage 03 lists the source types. Stage 05 has a two-column bibliography output (a chapter list, and a master list where a doubly cited source appears once). Stage 06 lists the six documented columns, then an example review matrix with synthetic rows covering a shared source, an exception record and a retained explanatory note. On phones the matrix rows become labelled records.
- **Editorial work:** "Beyond the code" as a proofreader's checklist (the paragraph's own phrases) beside the prose, with the reading figure standing on its rule.
- **Closing:** "Engineering the workflow" as five connected modules; the Outputs and Tools tables; the lessons and the closing line.

**Found and fixed while verifying:**
1. The page thread's flourish looped through the hero's facts card. The facts became a full-width strip under the hero.
2. The review matrix overflowed its panel at 1440px. Output panels now span the cell and the table fits; tablets scroll it in its own region.
3. Under reduced motion the stage chevrons and the TOC marker still slid. They no longer transition.
4. Lint rejected setting state in an effect for the "hydrated" flag. It now uses `useSyncExternalStore`.

## Iteration 16 — Crackd refined, Buzzworks case study, shared detail navigation (25 Oct 2026)

**Shared navigation (every detail page; homepage untouched):**
- **Header:** "Browse work" now sits beside the name in the sticky header, through SiteHeader's new `lead` slot. The name stays a separate home link, and the sidebar trigger is gone.
- **Phones:** the control reads "Work" (its accessible name is still "Browse work"). The four section links move into the sheet's footer, so the row fits at 360px.
- **Motion:** a plain horizontal slide, 280ms in with gentle deceleration and 200ms out ease-in, with a backdrop fade. No blur, overshoot, scaling, stagger or hover movement, and the page behind never moves.
- **Kept:** the native modal `<dialog>`, focus trap and restoration, Escape, scroll lock, current-page marking and real links. No shadcn MCP was connected.
- **"On this page":** a shared `case.css` layout for both pages. Smooth scrolling now comes from the TOC itself, because document-level `scroll-behavior` was cutting short the browser's scroll restoration on Back (see 3 below).

**Crackd (refined, not redesigned):**
- **Light palette:** warm paper (#f5efe2), near-black ink, deliberate yellow.
- **Hero:** September 2025–May 2026 sits above the title on a yellow label, then the real logo as the Crackd title on its own black plate (white lettering, never filtered), then the question and description. Role and Context are on an index card, and Period appears once.
- **Chapter markers:** stronger, with black tabs and yellow numerals in light; dark mode keeps its yellow tabs.
- **Applications:** the three sit on one near-black panel inside the light sheet, and each keeps its own register. A container query stacks them when the panel is narrow.
- **Links:** table rows are marked as in-page jumps (↑, "section on this page"), distinct from the ↗ GitHub repositories. Demos are still omitted.

**Buzzworks (new):** `content/buzzworks.ts` (verbatim) + `components/buzzworks/`.
- **Look:** warm paper and charcoal, the supplied logo (on a paper label at night), and orange only for markers, highlights and selected states. The thread is in charcoal.
- **Journey:** introduction and ownership ("sole developer", "from scratch" highlighted; where other teams' work met hers set apart), then one illustrative WhatsApp conversation.
  - The conversation is fictional HTML with screen-reader speaker names, WhatsApp colours kept inside it, the notes' own caption, and numbered margin notes that jump to the documented flows.
- **Then:** the nine flows as an index; personalisation; a conceptual system diagram (connections, not directions; labelled conceptual); the three difficult parts (a contrast line, the upload paragraph set as its own four steps, the chat / form / record layers); deployment with the rollout shown as "being prepared"; performance without numbers; tools; lessons.

**Found and fixed while verifying:**
1. The rollout note's text broke into flex columns.
2. The conversation's list lost its numbers.
3. The page thread used the orange accent. It's now charcoal on Buzzworks only.
4. Crackd's plate tape collided with the date label, so the tape was removed. The user-app highlight was muddy on black and is now a yellow stroke.
5. Crackd app names clipped at 1280px; they now stack by container query.
6. The header trigger's hit area was exactly 44px, so a sub-pixel position failed it. It's now 46px.
7. A translucent admin-card fill read as opaque to the theme test. The admin and matrix surfaces are now solid colour mixes.
8. Back from a case study sometimes restored the homepage to the top (2 of 4 runs). Cause: `html { scroll-behavior: smooth }` from the case layout. Fixed as above; Back now restores exactly.

## Iteration 15 — Crackd.ai page + work drawer (25 Oct 2026)

**Source:** `handoff/content/work/crackd-ai.md` (revised). Every approved line is on the page (82 lines, `qa/crackd.mjs`); nothing from its implementation notes, retired claims (40% / 35%, TensorFlow, self-critique) or demo URLs is rendered.

**Built:**
- **Own page component:** `components/crackd/CrackdPage.tsx` + `content/crackd.ts`, chosen in the `[slug]` route. The other ten detail pages and the homepage are unchanged in markup and pixels (`qa/unchanged.mjs`).
- **Look:** an engineering notebook in the portfolio's serif, paper and thread.
  - Crackd black and yellow only where they mean something: the real logo as a taped sticker, yellow chapter tabs, a highlighter on "funny" (the one arrival moment) and on "a fairly low bar", and the black matrix card.
  - The dark theme is a slightly deeper night (#1a1816).
- **Backbone:** two dated phases joined by a thread that draws as you scroll, with a knot above each tab.
  - **01 · September–December 2025 — "Contributions to the shared platform":** four short notes on the page.
  - **02 · January–May 2026 — "My own implementations of the three applications":** a raised, ruled notebook sheet, with a figure seated on its edge.
- **Three apps, three presentations:**
  - User application: open and wide, in ink.
  - Admin application: a tool panel with a ledger of the interfaces its paragraph names.
  - LLM chaining matrix: a black card crossed by a knotted thread. The thread is decoration, not a diagram.
  - Each app links only its own GitHub repository.
- **Closing sections:** the questions set as a list beside a thinking figure, the punchline, the applications table (rows link to the app entries), tools, and credits.
- **"On this page":** a sticky margin rail at ≥1100px, a compact index under the opening below that. Sections land 24px under the fixed header, and the current section is marked.
- **"Browse work" drawer:** `components/WorkDrawer.tsx`, reusable and mounted only here.
  - No shadcn MCP was connected and the project has no Radix or Tailwind, so it follows the Sheet anatomy on a native modal `<dialog>`.
  - Behaviour: the background is inert, Tab wraps, Escape, overlay click or the close button dismiss it, scroll is locked, and focus starts on Crackd (marked "This page") and returns to the trigger.
  - Arrow, Home and End keys move between entries; every entry is a real link; reduced motion fades it instead of sliding.
  - Entries come from `site.ts`, styled with the homepage panels' tones and logos (the homepage components are untouched).
  - On phones the trigger becomes a pill fixed at the bottom of the screen.

**Found and fixed while verifying:**
1. **Focus trap:** Tab could leave the modal for the browser's own controls. Tab and Shift+Tab now wrap inside the sheet.
2. **Thread through the markers:** the phase thread crossed the dates and scope text. The text now sits beside the thread, and the marker column was widened.
3. **Repo names:** names broke mid-word ("…interfac / e"). They now break only after `_` or `-`; the admin card was relaid so its repo link has room.
4. **User-app highlight:** on a wrapped name it painted one full-width bar. It now follows each line.
5. **Sticker tape:** the tape covered the logo's eyes on phones. It now sits on the corner.
6. **Late highlight:** it finished too late in the scroll. Its range now ends earlier.
7. **QA:** `check.mjs`'s template-avatar test assumed Crackd used the template. It now checks the other ten pages and Crackd's own placement separately.

## Iteration 14 — homepage copy from the revised home.md (25 Oct 2026)

**Source:** `handoff/content/home.md` (revised) is the authority for every homepage string. All 53 approved strings are on the page and none of the retired copy remains (`qa/copy.mjs`).

**Updated (`src/content/site.ts` unless noted):**
- **Hero:** new tagline and intro. The page `<title>` and meta description are built from the same strings verbatim (`layout.tsx`).
- **About:** both rewritten paragraphs.
  - The trajectory margin notes are re-quoted from the new About text, still verbatim.
  - The old fragments would have silently left the notes empty.
- **Currently:**
  - Lynxster: "Chief Technology Officer · 2026–now", plus the new FERPA / US & Canadian frameworks description.
  - AMNH: "Volunteer · 2026–now", with the streams "DIODE · Collections digitization" (now naming Jessica Ware's lab) and "Mantis behavioral trials & research — Details to come."
  - Roles and dates are homepage fields, so the detail pages keep theirs.
- **Selected work:** all seven new descriptions, and each panel's date taken from home.md (a `date` field replaces the dates derived from `work.ts`).
- **Contact:**
  - new intro;
  - LinkedIn now links to the supplied URL;
  - Résumé stays "Updated PDF to come" (home.md: "to come").

**Layout defects found and fixed:**
1. **Hero tagline under the figure** (1024–1440px): the longer tagline ran under her hand. It now breaks only between sentences (each sentence is an inline block, line capped at 21em): two lines on desktop, a three-line triad on phones.
2. **Work panels clipped their summaries.** Rows were a fixed `clamp(220px, 17vw, 240px)` high with bottom-aligned content, so text spilled off the top.
   - At 1024/1280px Crackd, Buzzworks, Publications and Teaching were affected; Publications was affected at every width.
   - Fix: the panel content is no longer absolutely positioned, so each row takes the height of its tallest summary. Every summary is already laid out at its open width, so the row height is fixed whichever panel is open, and expansion still changes width only. The old height remains the minimum.
   - The open panel in the three-panel row is a little wider (2.6 vs 2.2 shares).
3. **Trajectory notes overflowed** their reserved band (three lines vs two). The band now reserves three lines (6.7rem), and the People + natural world note is a shorter verbatim fragment, so it also fits on phones.
4. **(Pre-existing)** The undrawn pencil arrow beside "Explore Lynxster/AMNH" could leave a round-cap dot at rest. It is now hidden until it draws.

**Not changed:** visual direction, avatars, scribble, motion, colours, theme system, More section copy (identical in home.md), detail pages.

## Iteration 13 — corrected matcha hand, motion easing, dark polish (23 Oct 2026)

**Changes:**
- **Hand:** the corrected matcha hand is wired in and versioned.
- **Gestures:** easing refined; the cheers is gentler (7°).
- **Dark mode:**
  - text lifted to AA everywhere (smallest 5.57:1);
  - balanced panel tones, Crackd no longer dominating;
  - lifted More cards;
  - one warm link accent with clear hover/focus.
- **Currently:** Lynxster/AMNH captions, text and links align; AMNH's activities clearly spaced.
- **Peeker:** quieter at rest.

**Fixed while verifying:**
1. The quieter-rest offset first went on the scroll-linked layer, adding lag. It moved to the action layer.
2. Its leaning rule then beat the shy state by source order; fixed with `:not([data-shy]):not([data-peek])`.
3. The interaction test now expects her quieter rest position.

## Iteration 12 — layered hero rig + light/dark theme (23 Oct 2026)

**Hero rig:**
- The supplied rig is ported as calibrated: whole-canvas layers, display scales and pivots on the 1300×1600 stage, scaled uniformly. Her figure keeps the previous on-page scale.
- On a fresh load the line now grows from the name to her seat, and one settling swing follows.
- Hover, focus or tap: a short leg swing, or a small cheers with fizz. The torso never moves, and nothing loops.

**Theme:**
- A pre-paint System / Light / Dark system built on shared tokens.
- Dark is a warm night notebook: warm charcoal page, raised umber surfaces, cream ink, sand-coloured line, a muted gold highlighter, and pale blue links.
- Coloured panels stay coloured paper, settled slightly; paper previews stay light objects.
- Dark-only fixes for logos:
  - the Lynxster line mark takes the light ink, as on its own dark page;
  - the AMNH wordmark keeps its black on a small paper label rather than being inverted.

**Defects found while verifying, all fixed:**
1. **Phone header:** the theme button was pushed off-screen at every phone width (header content was about 37px too wide). Type and gaps are now tightened, with a further step below 360px; it fits down to 320px.
2. **Logos in dark:** the Lynxster lockup and AMNH wordmark nearly vanished.
3. **Narrow hero:** the stage's box grazed the empty ascent space above "Anya". Lifted 10px, with headroom reserved.
4. **Contrast tests:** the parsers misread color-mix's `color(srgb …)`. Fixed with canvas conversion, which proved the panels unchanged in light (exact original colours).
5. **Stale checks:** checks written for the old single-image hero (assets count, decorative flag, seat line, preload name) were updated to the rig. The seat check now samples the body layer's alpha, so it proves the line never crosses her artwork above the seat.

## Iteration 11 — interaction & finish pass (23 Oct 2026)

**Built:**
- **Signature moments:** a tuggable thread at four knots; a face-and-hands edge peeker round a paper wall, with shy, peekaboo and lean responses; taped previews with a corner lift and a pencilled arrow.
- **Supporting interactions:** a trajectory picker with margin notes quoted from the About text; a staged panel opening with flash-free switching; viewfinder corners, the pen finishing its stroke, and copy-email with a drawn check; the greeter now settles as Contact arrives.
- **Surfaces:** a refined corner and shadow hierarchy.

**Defects found while verifying, all fixed:**
1. **Duplicated knot handles:** a stale font-ready callback from React's double-mounted effect recreated them after cleanup. `ThreadTug` now ignores calls after it's destroyed.
2. **Peeker edge stripe:** the artwork's drawn wall edge slid into view when she leaned. The export is now trimmed at the stripe, and a paper wall strip makes the edge deliberate.
3. **Narrow trajectory:** the aside read as a continuation of "Still following the thread." It now has spacing and its own arrow.
4. **Viewfinder corners:** visible at rest and crowding the plate label at tablet width. They are hidden until hover or focus, with a tighter inset on narrow screens.
5. **Stale port:** an old production server was still holding port 3100 and served the old pose. I stopped only that process (pid 19194); the separate app on port 3000 was left alone.

## Iteration 9 — bold avatar pass (23 Oct 2026)

**Critique going in:**
- The page felt sparse.
- The figures were small stickers.
- The hero left an empty band below the copy.
- The timeline traveller appeared late.
- The small grid peeker and the More visitors were detached decorations.

**Decisions:**
- **Hero:**
  - **Scale and placement:** she is now about 1.5× larger and fills the right-hand third, sitting on the line, which passes behind the cup and under her hands. She is present from the first frame.
  - **Height:** the hero is no longer a full screen, so "A fairly straightforward career trajectory." starts at the foot of the first desktop screen.
  - **Narrow screens:** she sits above the name on the line rising out of the "a", and the hero reserves her height.
  - **Matcha:** the cup is a small accessible toy, with a hand-drawn plume of bubbles and fizz marks in the line's ink.
- **Removed:** the timeline traveller, the grid peeker, the photographer and the reader.
- **Signature edge peeker:**
  - A larger figure (`peeking-05`) peeks in from behind the screen's right edge, beside the work grid, in a lane the grid gives up for her. The line runs down the gutter between the cards and her.
  - She slides out as the section arrives and is settled before the cards are read.
  - She leans toward the active card (pointer, keyboard or open), returns to neutral when the grid is left, and ducks away and peeks back on tap or keyboard.
- **Kept:** the untangler (slightly larger) and the greeter, who now appears when the line reaches her feet.

**Defects found while verifying, all fixed:**
1. **Hero head:** at 1280–1920 her head ran into the header nav. She is now hung from the header and sized to the hero's height.
2. **Narrow screens:**
   - Tablet: the cup crowded the intro text.
   - Phone: her legs hid the "a." of "Jajodia.".
   - Short phones: her head went under the header.
   - She is now above the name, with headroom reserved.
3. **Matcha plume:**
   - The plume was clamped by the global `svg { max-width: 100% }`.
   - The fizz marks never animated: they used `var(--settle)`, which was undefined outside `.avatar`, so the animation declaration was dropped. Their non-scaling stroke also broke the path-length dash.
   - The plume drifted into her hair; it now goes to the clear side.
4. **Edge peeker timing:** she arrived after the cards were readable. She was cued from her own tall box, then held behind the untangler's entrance. She is now cued by the section and never queued.

**Blockers:** none in the work itself. The Next.js security notice is unchanged and still awaits your decision on upgrading.

## Iteration 8 — avatar refinement (23 Oct 2026)

**Critique of iteration 7, all fixed:**
1. **Hero:** she faded and dropped in after the line. She is now present, opaque and still from the first frame (preloaded, no entrance), and the page-load fade skips the hero.
2. **Timeline pre-trace:** the faint grey pre-trace is removed.
3. **Walker:** a frozen walking PNG slid along the line. It is replaced by a stationary pose (15.4, standing with a map, looking on ahead) on the line's level last stretch. She appears only when the line has been drawn under her feet.
4. **Entrances:** they had large travel, a bounce on the hero, a hop on the wave, and a repeating idle duck. Now every entrance is a 8–14px decelerating settle over about 0.53s, as an interruptible transition. There is no idle motion.
5. **Peeker crossing the panels:**
   - Problem: her fingers sat over the panels, and her rise started from inside the panel strip.
   - Fix: she is now clipped 1px above the grid's top edge, with a hint of hair waiting there. She rises into the cream margin and leans a little toward the active card (pointer or keyboard), returning to neutral when the grid is left. The reveal does not replay.
   - Proven per frame through rapid switching, and by an identical pixel strip with and without her.
6. **Detached figures:**
   - Contact: the wave now stands on the line's last stretch beside "Say hello." at every width, with the line under her feet.
   - Photographer: larger in the photo plate's corner (≥ 1360px).
   - Map figure: larger, and the trajectory's band no longer stretches for her.
7. **Found while verifying:**
   - A CSS specificity bug made the peeker's hair hint invisible.
   - Chrome's IntersectionObserver counts the target's own `clip-path`, so the peeker never reached a 0.9 threshold (now 0.6).
   - One antialiased row of her clip met the panel's fractional top border; the clip moved 1px higher.

**Blocker noted, not acted on:** `next dev` and `next build` print "Your version of Next.js is affected by a known security vulnerability", stop once, and ask the agent to offer `next upgrade --agent=security …`. A retry continues. The upgrade is left for you to decide.

## Iteration 7 — avatar integration (21 Oct 2026)

**Method:**
- Read the pack's README and manifest and viewed all three preview sheets. The sheets were used only to choose poses and are never served.
- Derived 20 poses and placed them.
- Inspected the live page in Google Chrome via Playwright at 1440, 1366, 1280, 1150, 1024, 768 and 390. The Claude in Chrome extension was not connected.
- Critiqued the result, fixed what failed and re-captured.

**Defects found while iterating, and fixes (in priority order):**
1. **Text under figures.**
   - Problem: on phones, the contact wave stood over the intro and email. At 1024–1280 the photographer's lens sat over the More intro; even at 1440 it was only 34 px from the text.
   - Fix: on narrow screens the greeter stands on the line's last stretch beside "Say hello.", and the route now runs under her feet into the underline. The photographer moved inside the photo plate's empty lower corner and is sized per width. A check now fails if any text sits under a figure, at 4 widths.
2. **Crowding.**
   - Problem: three figures were in view at once in the Selected work → More band (peeker, reader, photographer).
   - Fix: More has one visitor per width (photographer ≥ 1150, reader below). Checked: never more than 2 in view.
3. **Walker floating above the line.**
   - Problem: as an explicitly placed grid item she pushed the trajectory band into row 2.
   - Fix: the band is pinned to row 1. A route kink where the level stretch began was also removed.
4. **Entrances queued behind figures already scrolled away.**
   - Problem: after a fast scroll the photographer waited about 2.4 s.
   - Fix: a figure now waits only for others still moving on screen, at most 0.9 s.
5. **Hero on phones.**
   - Problem: her feet were about 15 px from "Jajodia.".
   - Fix: she is a little smaller and higher on phones.
6. **Stitch.**
   - Problem: the stitch before More passed close to the photographer's head.
   - Fix: it closes 44 px above the plates.

**Result:**
- **Hero:** the largest figure sits on the line itself, which runs under her hands and her cup. She drops onto it after the line appears and settles.
- **Trajectory:** a walker crosses the level last stretch, then rests above "Still following the thread."
- **Two threads:** an untangler stands on the AMNH card and holds the thread up: the line runs into her fist, down behind her and away past her heels.
- **Selected work:** a peeker's hands grip the grid's top edge. She rises from behind it, comes up a little when a panel opens (hover or keyboard focus) and ducks now and then.
- **Wildlife photography:** a crouched photographer in the plate's corner; her shutter lights the contact sheet.
- **Contact:** a wave, from the contact links' top rule on wide screens, or standing on the line's last stretch on narrow ones.
- **Project pages:** contextual figures stand on section rules. AMNH's stay with digitization.
- **Motion and access:** each figure enters once and settles. Reduced motion shows everything in place; decorative figures are absent from the accessibility tree.

**Remaining (see QA limitations):**
- The photography moment needs ≥ 1150 px.
- The photographer is small at 1150–1359.
- Testing was Chrome only.

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
