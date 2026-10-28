# Design analysis: anyajajodia portfolio

*Branch `testing` · 27 October 2026 · analysis only, no code changed*

> **Assumptions, set after the first draft:**
> - **Audience:** the site is both **recruitment material** and **a representation of you**, so it is judged against both jobs.
> - **Placeholders:** the résumé, the AMNH photographs and mantis section, Writing, Experiments and every "to come" are placeholders you will fill. They are treated **as if they already exist in the same design language and vibe** as the rest of the site, with some project pages mixing the company's style and yours, as they already do.
>
> This analysis therefore judges only the **finished elements and the overall design system**. Content gaps are not counted as design problems.

This is a review of the website's **design**: its style, mood, and what that says about you to the people who see it. It is not mainly a review of the work itself, though there's a short section on the work near the end.

---

## 0. How this was reviewed

- **Two independent passes, then combined.** This follows the `/impeccable critique` method.
  - **Pass A, design review.** I viewed the live site and took screenshots of every route:
    - the homepage at 1440, 1280 and 390 px, in light mode, dark mode and with reduced motion;
    - all 11 project pages, and the wildlife page on desktop and mobile;
    - interactions: the Work drawer, the theme menu, keyboard focus, the timeline, and hovering the Selected work cards.
  - **Pass B, automated evidence.** This used the Impeccable design detector, run once on the source code and once inside the browser on 5 pages. It also measured page weight, layout shift, overflow and console errors.
- **Reference data from UI/UX Pro Max** for the categories "portfolio/personal" and "editorial / hand-drawn / organic".
- **I looked at the screenshots myself** before writing anything that depends on what the page looks like. The evidence list is in the [Appendix](#appendix-evidence).
- **Deliberate choices I treat as settled:**
  - the shorter hero;
  - the muted coloured panels in Selected work;
  - full-quality original wildlife photographs.

  Where this analysis pushes against one of these, it says so. The point is to show the trade-off, not to reopen the decision.

---

## 1. The short version

> **This site reads like a person, not a template.** It's warm, literary and a bit playful. It's clearly made by hand, by someone who builds things *and* cares how they feel.

**What a professional will remember:**
- the giant serif name;
- the illustrated girl sitting on a pen line;
- that line straightening into a "fairly ~~straightforward~~ career trajectory";
- project pages that are unusually thorough and honest.

**What they might *not* come away with in the first 30 seconds:**
- that you're a **CS senior at Barnard**;
- that you're **CTO & co-founder of a startup**.

**Portfolio type.** A *narrative, editorial, generalist builder* portfolio: what designers would call a "personal site" more than a "portfolio". It turns breadth into a story (one thread connecting everything) instead of hiding it.

**Who it suits best:**
- product-minded startups, founders and investors;
- design-engineering teams (companies whose own websites are crafted);
- museums, science and conservation organisations;
- research groups and graduate admissions, interdisciplinary programmes especially;
- anyone hiring for taste plus range.

**Who it suits least:**
- high-volume big-tech screening and quant/finance, where reviewers want facts in 10 seconds;
- very serious enterprise or security buyers who read illustration as "unserious";
- hard-core infrastructure engineers who'd rather see a GitHub graph than a dragonfly wing.

**The single biggest opportunity:** keep the charm, but put the facts up front. A one-line "who/what" in the hero, plus the résumé and profile links findable from the first screen, would turn this from *memorable* into *memorable and easy to act on*.

**For a site doing both jobs (recruitment and a portrait of you):**
- The portrait side is already excellent.
- The recruitment side mostly needs **speed to the facts** and **less decorative competition** around the work. It doesn't need a different personality.

---

## 2. The visual world: what you've actually built

### 2.1 Palette
- **Base:** warm ivory paper (`#f7f4ee`), near-black ink, and an **aubergine thread** (`#493247`). It's an "archival notebook" palette, the opposite of the white-and-blue tech portfolio.
- **Accents:** a muted ink-blue for links and the email, plus a yellow highlighter used as a mark.
- **Per-project worlds.** Each project page gets one accent and one tint:
  - Lynxster: navy, becoming cyan on near-black in dark mode;
  - AMNH: archival cream and slate blue;
  - Crackd: yellow and black;
  - Buzzworks: orange;
  - GVI: sage;
  - PMMY: plum;
  - teenage-pregnancy research: teal;
  - teaching: Columbia blue.

  They behave as **one family wearing different colours**, not a patchwork. Every page shares the same frame and type.
- **Selected work** is the one place the palette goes **loud**: seven saturated coloured panels (yellow, peach, blue, lilac, sage, pink, periwinkle). It was a deliberate choice, and it is also the biggest change in temperature on the homepage (see 6.2).
- **Dark mode** is properly redesigned rather than inverted: a warm near-black, with the cream thread recoloured. The exception is the Selected work panels, which stay almost as bright as in light mode.

### 2.2 Typography
- **Cormorant Garamond** for display text and italic asides, with **Inter** for body (18 px) and labels (small, tracked, uppercase). Jost appears only in the Lynxster wordmark.
- It is a classic *literary editorial* pairing. It says "magazine, essay, museum label" before it says "software engineer". At display sizes it looks expensive.
- **Weak point:** Cormorant at *small* sizes. The wildlife intro (~15 px), italic margin notes and captions get thin and spindly, especially on mobile.

### 2.3 Motifs (the signature)
| Motif | Where | What it signals |
|---|---|---|
| **The thread**: one hand-drawn line that follows your scroll | Loops off the "a" in Anya → straightens into the career timeline → runs down the right margin → underlines "Say hello." Appears on every project page in the gutter, and forms dragonfly wings on AMNH. | "My path isn't linear, and that's the point." It's the site's **big idea**, and it's executed for real: the line follows the scroll and still makes sense with motion turned off. |
| **The avatar**: an illustrated version of you in ~20 poses (matcha, wired earbuds, brown jacket, baggy jeans) | Hero, timeline, "Two threads", Selected work edge, More, Contact, and 1–2 per project page | Warmth, self-awareness and Gen-Z personal brand. It's also the strongest "this is a *person*" signal on the site. |
| **Hand marks** | Strikethrough on "straightforward", circle on "threads", underline, highlighter | Editorial wit: you're annotating your own story. |
| **Paper objects** | Washi tape on the Currently cards, notebook page for AMNH, numbered "plates", viewfinder corners | Scrapbook / field notebook / archive. |
| **Dot grid** | Behind the hero and Contact | Graph paper, a quiet engineering nod. |

### 2.4 Layout and motion
- **Layout:** generous margins, a 12-column editorial grid, and big headings set against small labels.
- **Project pages** share one frame:
  - breadcrumb;
  - logo with a date rule;
  - a serif hero that is often a **question** ("Can a model learn to be funny?", "There's a workflow behind that message.");
  - a role/scope column;
  - "On this page" contents;
  - the body;
  - Back / Previous / Next.
- **Motion** mostly follows what you do on the page: the thread follows the scroll, avatars arrive once and settle, the Lynxster illustration assembles, and the Selected work panels expand on hover. With reduced motion on, it falls back to a clean static version (checked).

---

## 3. Vibe

**In five words:** *warm, literary, crafted, witty, curious.*
**The less flattering five:** *busy in places, a little precious, unfinished in places.*

**What it feels like:**
- **It feels like** a beautifully kept field notebook that happens to contain production software. You reach for the words "editorial" and "museum", rarely "tech".
- **It resembles:**
  - the craft end of personal websites: indie-web personal sites, design-engineer portfolios and studio sites, where the site itself is evidence of taste;
  - an illustrated essay more than a résumé.
- **It does not resemble:**
  - a GitHub-README portfolio;
  - a dark-mode terminal aesthetic;
  - a Webflow template;
  - a Notion page;
  - a Dribbble-shot showcase.

**Tone of voice** (this matters as much as the visuals):
- Dry, self-aware humour: "Naturally, this was all part of the plan", "I'm comfortable with that outcome", "technically correct is a fairly low bar for a joke."
- Plus scrupulous honesty: "Illustrative reconstruction… fictional information", and access limits stated up front.
- A reader trusts this voice. The one generic line on the site is the hero tagline, *"Building ideas. Exploring possibilities. Asking better questions."*, which could sit on anyone's site.

---

## 4. What kind of portfolio is this?

Most portfolios fall into one of a few archetypes. Yours sits between three of them:

| Archetype | Typical shape | You? |
|---|---|---|
| **Engineer portfolio** | Project grid, tech stack badges, GitHub links, dark mode, terse | Partly: deep, technical project pages (Crackd, Buzzworks, TMU), but the *presentation* is the opposite of terse |
| **Designer case-study portfolio** | 3–6 polished case studies, process, outcomes, visual-first | Partly: project pages read like case studies, with question-led headlines and reflections |
| **Résumé / CV site** | Facts first, timeline, PDF | Least: facts are in the prose, and the résumé sits at the bottom in Contact |
| **Personal site / digital garden** | Voice, interests, writing, photography, "more" sections, a character | **Strongly:** the avatar, More, the wildlife page and the voice |
| **Narrative / "one thread" portfolio** | The whole site *is* a story with a through-line | **This is the defining one** |

**Verdict:** a ***narrative generalist-builder portfolio***. It's a personal site carrying engineering-grade case studies.

**How it handles breadth:**
- **The problem it solves:** you've done software (an AI humour platform, a WhatsApp HR platform, research tooling, computer vision), a startup CTO role, a patent, museum digitisation, conservation fieldwork, published economics and public-health research, teaching, and wildlife photography.
- **Why breadth is risky:** on most portfolios this much range reads as *unfocused*.
- **The design's answer:** the thread metaphor ("follow the thread", "two threads I'm following", "still following the thread") turns *scattered* into *connected*. It's the right answer, and it's why the site works.
- **The risk:** the metaphor is used about six times in the copy, so it starts to feel leaned on.

---

## 5. What it signals to a professional

### 5.1 Positive signals
1. **Taste and craft.** Hand-tuned type, a coherent palette, and motion that follows your scroll and still works with motion off. Detail like that is hard to fake. Anyone who builds UI will notice.
2. **The ability to finish complex front-end work.** A scroll-linked line that morphs across a whole page, themed project pages, a WhatsApp flow simulator, walkthrough viewers, a photo gallery that expands in place. The site is itself a portfolio piece.
3. **Product sense.** Project pages explain *why* decisions were made ("Make choices easier to navigate", "Let people correct an answer", "Work within the platform's limits"). That's how product engineers think.
4. **Range with a through-line.** Engineering, research, fieldwork and teaching all hang on one story instead of fighting for attention.
5. **Integrity.** Labelled reconstructions, no invented metrics, the patent credited to the team, nothing overstated. Senior readers trust this.
6. **A real personality.** Memorable in a stack of 200 near-identical portfolios. People will say "the one with the thread and the matcha girl."

### 5.2 Risky signals
1. **"Who is this, and what does she want?" isn't answered fast.**
   - Time to understand each fact (measured while reviewing):
     - name: under 1 second;
     - "builds software in New York": 5–8 seconds;
     - Barnard CS senior: 15–25 seconds (it's in the About paragraph);
     - startup CTO: 20–30 seconds (third screen).
   - What you're *looking for*, a job, collaborators or something else, is never stated.
2. **Out of scope here: placeholders.**
   - The résumé, AMNH photographs, mantis, Writing and Experiments are assumed filled.
   - The one design point to keep: when they are filled, the **More** section and the AMNH plates should follow the same rules as the finished pages:
     - one motif;
     - the summary always visible;
     - the paper palette.
3. **Style over speed, to an efficiency-minded reader.**
   - Illustration, tape, notebook paper and four different heading marks can read as *decorated* to someone who wants density.
   - The Selected work panels hide five of seven summaries until hover. A skimmer sees logos and colours, not what you did.
4. **The illustrated avatar is a polarising signal.** Most people find it delightful. A minority (some enterprise, finance and security reviewers) may read it as *young* or *unserious*, especially next to "CTO & co-founder" and "patent pending". This is a choice, not a mistake, but you should know the trade.

### 5.3 What they'll take away (by attention span)
| Time spent | What they take away |
|---|---|
| **10 seconds** (hero only) | "Anya Jajodia. Creative, warm, builds software, New York. Clearly cares about design." |
| **30 seconds** (hero → About → Currently) | "+ Barnard CS, interdisciplinary (anthropology, conservation). CTO of a startup with a patent pending. Volunteers at AMNH. Has a sense of humour." |
| **3 minutes** (+ one project page) | "+ Real engineering depth: built and shipped full-stack apps end to end; thinks in product decisions; honest about scope. The craft on this site is hers." |
| **10+ minutes** | "+ Research publications, fieldwork, teaching; a photographer. A rare engineer-with-taste generalist. Opens the résumé to check dates and stack." |

The site rewards depth extremely well and rewards skimming only moderately. Most hiring reads are skims.

---

## 6. Who it will impress, appeal to or put off

### 6.1 By industry or reader
These are general tendencies in what each kind of reader looks for, not guarantees.

| Reader | What they look for | Fit | Why |
|---|---|---|---|
| **Early-stage startups and founders** | Ownership, range, shipping, taste, "can she wear many hats" | **Strong** | The CTO/co-founder story, end-to-end builds and the craft all signal "generalist who ships". The narrative format suits founders, who read stories. |
| **VCs and accelerators** (about Lynxster) | Founder clarity, credibility, conviction | **Mixed** | The personality is memorable, but the hero doesn't say "founder". The avatar may read as young next to an investor pitch. The Lynxster page is restrained and credible. |
| **Design-engineering and product-led tech** (companies whose own sites are crafted) | Taste, front-end craft, attention to detail, product thinking | **Very strong** | This is the audience that will *notice* the scroll-linked line, the reduced-motion handling, the type. The site is the proof. |
| **Big-tech new-grad SWE recruiting** | Fast facts: school, grad year, languages, internships, impact | **Weak at first look, strong on depth** | Recruiters skim for ~30 seconds and want a résumé. They get charm first and facts third, and the résumé sits at the very bottom in Contact. Engineers who click into Crackd or Buzzworks will be impressed. |
| **AI labs and applied-AI teams** | Technical depth, experiments, rigour | **Moderate to strong** | The Crackd chaining matrix, Inteli-lens and the AI-assisted development environment are relevant, and the honest framing helps. Research-heavy labs may want more metrics or papers up front. |
| **Security, crypto and verification** | Rigour, seriousness, precision | **Moderate** | The Lynxster page itself is precise and sober (good). The surrounding whimsy is a mild risk with very conservative readers. |
| **Museums, natural history, conservation, science** | Care, curiosity, documentation, interdisciplinary fluency | **Very strong** | The archival palette, field-notebook motifs, wildlife photography, AMNH and GVI. You're speaking their visual language. Once AMNH has its photographs, this is your best-matched audience. |
| **Grad school and research programmes** (especially interdisciplinary: HCI, info science, computational social science, ecology + CS) | Intellectual range, writing, research experience, curiosity | **Strong** | Publications, research tooling, fieldwork and a reflective writing voice are exactly what personal statements try to convey. |
| **Product management** | Judgment, communication, user empathy | **Strong** | The decision-led case studies and clear writing are PM signals. |
| **Creative tech, agencies, studios, museum digital teams** | Visual craft, interaction ideas, originality | **Very strong** | The illustrated character, scroll storytelling and themed worlds are their language. |
| **Consulting, finance, quant** | Polish, brevity, credentials, numbers | **Weak** | Too expressive and slow to the point. They'll want a one-page PDF and won't scroll for a thread metaphor. |
| **Policy, NGOs, social impact** | Mission, research, communication | **Moderate to strong** | The PMMY and teenage-pregnancy research, teaching and conservation fit. The warmth reads well. |
| **Enterprise IT, government, defence** | Conventional professionalism | **Weak** | The illustration and playful copy can read as informal. Not your audience anyway. |

### 6.2 Who it puts off, and why
- **The 10-second skimmer.** No headline facts in the first screen, and the résumé is only at the bottom. → They leave with a vibe, not a shortlist decision.
- **The density-seeker** (wants a list of projects, stacks and links). → The Selected work panels hide the text until hover, so they have to *play* to read.
- **The "serious business" reader.** The avatar and handwriting marks feel informal next to "CTO" and "patent pending".
- **A mobile-first reader on a slow connection.**
  - The homepage is ~8,500 px tall on a phone.
  - The header's touch targets are ~30 px, under the 44 px guideline.
  - The wildlife page downloads ~44 MB of original images. This is a deliberate full-quality choice, but it has a real cost on mobile data.

### 6.3 Who it appeals to most
- People who **make things and care how they feel**: designers, design engineers, product people, founders.
- People who value **interdisciplinarity**: museums, research labs, conservation tech, grad programmes.
- Anyone who reads more than one screen. **The site gets better the more you read.**

---

## 7. Design scorecard

### 7.1 Heuristics (0–4)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | The sticky header, active "On this page" item and "This page" marker in the drawer are good. On `/wildlife-photography` the nav highlights **Work**, not **More**. |
| 2 | Match with the real world | 3 | Plain, human language. "More" vs "Other things" naming, and the heavy thread metaphor, blur it slightly. |
| 3 | User control and freedom | 3 | Back / Previous / Next, Esc on the drawer, and a System/Light/Dark theme choice. Selected work panels reflowing on hover take some control away. |
| 4 | Consistency and standards | 2 | The project-page family is consistent. The Selected work palette, "More"/"Other things" naming drift, the nav state on the wildlife page and the uneven project-page line are not. |
| 5 | Error prevention | 3 | No dead links. Missing URLs show as text, and live-app sign-in limits are stated up front. |
| 6 | Recognition rather than recall | 3 | Logos in the drawer and panels, and contents lists. Selected work summaries are hidden until hover. |
| 7 | Flexibility and efficiency | n/a | A portfolio has no expert workflows (arrow keys in the drawer and Copy email are nice touches). |
| 8 | Aesthetic and minimalist design | 2 | Beautiful parts, but too many motifs on the homepage and friction in Selected work (placeholders excluded from scoring). |
| 9 | Error recovery | n/a | No forms (Copy email does confirm). |
| 10 | Help and documentation | n/a | Not needed. Micro-hints exist ("Select a photograph to see it larger"). |
| **Total** | | **19 / 28 (68%)** | **Acceptable, close to Good.** |

With placeholders excluded, the score is unchanged: none of the heuristics above was scored down because of them alone. Usability heuristics undervalue expressive sites. On *design specificity*, which matters most for a personal portfolio, this site is in the top tier. The score above is about friction, not beauty.

### 7.2 Cognitive load (8-point checklist)
- **Single focus.** Partial fail: Selected work puts seven equal-weight coloured panels, an avatar and the line in one viewport.
- **Chunking.** Pass.
- **Grouping.** Pass.
- **Visual hierarchy.** Partial fail: the panel sizes don't map to importance.
- **One thing at a time.** Fail in Selected work: hovering reflows what you're reading. The timeline shows two "current" states (the picked item and the reached item).
- **Minimal choices.** Fails at three decision points:
  - Selected work: 9 destinations at once.
  - Contact: 5 actions.
  - Long contents lists: up to 11 items.
- **Working memory.** Pass.
- **Progressive disclosure.** Used, but on the wrong content: it hides the one-line summaries a skimmer needs.

**Result: moderate load**, concentrated almost entirely in **Selected work**.

### 7.3 Emotional journey (homepage)
- **First 5 s, delight.** The giant name, the pen line, the girl with matcha. It's warm and personal immediately.
- **Peak 1, About.** "Straightforward" struck through while the line straightens into five milestones, with margin quotes. **The best screen on the site.**
- **Currently.** Confident and clearly primary. The Lynxster and AMNH cards are well balanced.
- **Valley 1, Selected work.** A sudden jump in colour; most panels are silent until hovered.
- **More** (assuming Writing and Experiments are filled). A pleasant pause. Its risk is design, not content: the cards use the same thin-border, soft-shadow treatment as the panels above, so two card grids in a row blur together.
- **Ending, "Say hello."** Strong: a giant serif, the waving avatar standing on the line's last stretch, and an email you can copy. The ending is the strongest moment after About.
- **Recruitment note on the ending:** the résumé lives only here, at the very bottom. The end of a visit weighs heavily, so this is a good place for it, but it shouldn't be the *only* place.

---

## 8. What's working (keep these)

1. **The thread, as a concept and in execution.** A single line that is the scroll indicator, the career timeline and the section divider at once, used to tell a non-linear story honestly. It's an idea a reviewer will remember and retell. The reduced-motion fallback is well handled.
2. **The project pages.** A coherent family:
   - a shared frame;
   - one accent and one signature object each: Crackd walkthroughs, the Buzzworks WhatsApp simulator, TMU stats with a footnote stepper, the PMMY chart, the NFHS timeline;
   - question-led headlines;
   - honest labelling.

   These are the strongest evidence on the site, and the design gets out of their way.
3. **Type and voice.** The Cormorant/Inter pairing is handled with care; the copy is specific, funny and honest. **Dark mode** is a properly designed second theme, not an inversion.
4. **The hero and the About section** are among the most distinctive first impressions a student portfolio can have.
5. **The wildlife page.** Edge-to-edge justified rows, uncropped originals and a gentle green line. The photography carries itself.

---

## 9. Priority issues (design, not code)

**[P1] The first screen says *who* but not *what*.**
- The tagline is the one generic line on the site.
- **Option:** replace or extend it with one concrete line, for example: *CS senior at Barnard · CTO & co-founder of Lynxster · digitizing dragonfly records at AMNH.* Keep the witty intro underneath it.
- **Option:** make the résumé, LinkedIn and GitHub reachable from the first screen (a quiet line in the hero, or the header), not only from Contact. This is the single most useful change for recruitment, and it costs nothing in personality.

*(Placeholders are out of scope. The résumé, AMNH photographs and mantis section, Writing and Experiments are assumed filled in the site's own design language.)*

**[P1] Selected work is the one place the visual world breaks.**
- **What breaks:**
  - The colour shifts from ivory editorial to seven saturated panels, which stay bright in dark mode.
  - Summaries are hidden until hover.
  - Neighbouring panels jump when one expands.
- **Your choice:** you deliberately chose coloured, muted panels. The question isn't "go back to plain rows" but how to keep them while fixing the friction:
  - **always show a one-line summary**;
  - **fix panel sizes by importance, with no hover reflow**;
  - **dim the panels much further in dark mode**;
  - optionally lower the saturation one more step towards the paper tint.

**[P2] Too many motifs on the homepage.**
- **What's competing:**
  - the dot grid;
  - the aubergine thread;
  - the avatars' crimson scribble loops (a *second* thread colour, which looks like a messy halo in dark mode);
  - washi tape;
  - four different heading marks in a row (strike, circle, underline, highlighter);
  - notebook paper;
  - coloured panels;
  - the avatar peeking from the edge.
- **Option:** make the thread the *only* hero motif. Keep the strikethrough, the best mark, plus at most one other. Consider removing the tape or the edge-peeking avatar.
- **Optional:** soften the crimson loops on the avatars so there's only one "thread".

**[P2] Naming and state consistency.**
- "More" (nav) vs "There are other things." (section) vs "Other things" (breadcrumb and back link).
- "Other things I've worked on" sits directly above "There are other things", so the same phrase appears twice in a row.
- The wildlife page highlights **Work** in the nav.
- ADI, the last project, ends with only "Previous" and no route back to Contact.

**[P2] Mobile polish.**
- Header touch targets are ~30 px; aim for 44.
- On the phone, the line crosses the timeline's margin note ("…behavioral research").
- The Work drawer says "Use the arrow keys" on touch devices.
- Crackd's nested indents squeeze the text column to ~260 px.
- The project-page line shows only as a fragment at the top on mobile.

**[P2] Performance that's visible to visitors.**
- **Layout shift:** the homepage measured a **layout shift of 0.80** at desktop size (0.23 on mobile), all from the hero's dot-grid canvas resizing after load. The good-practice threshold is 0.1.
- **Wildlife page weight:** the wildlife page loads **~44 MB** and the homepage ~4 MB. Most of that is the original PNGs, including a 3.3 MB homepage preview photo.
- **Your choice:** you've chosen full-quality originals. That's a valid stance for a photography page, but know that slow phones will feel it.
- These numbers come from the dev server; production will differ somewhat.

**[P3] Smaller points.**
- **Lynxster:** before it assembles, the illustration shows as a faint "ghost", which can read as a loading state.
- **Lynxster:** "Patent pending" appears three times on its page.
- **Wildlife:** the H1 is indented away from its breadcrumb, which reads as misaligned.
- **Wildlife:** the first photo's subject (the lion cub) sits below the fold.
- **Small Cormorant italics:** they carry meaning but are hard to read at small sizes.
- **Copy email button:** the label sits slightly off-centre.

---

## 10. Section-by-section notes

| Area | What works | What to watch |
|---|---|---|
| **Hero** | Massive serif name, pen line looping off the "a", the seated avatar: an instantly personal first impression | Generic tagline; no headline facts; avatar's crimson loops |
| **About + timeline** | The best idea on the site: the strikethrough, the line straightening, margin quotes | Two "current" states when you click a milestone; on mobile the line crosses text |
| **Currently** | Balanced Lynxster/AMNH pair; Lynxster in its own colours; tape gives a pinned-up feel | Tape is one more motif among many |
| **Selected work** | Colour makes it lively; logos help recognition | Breaks the palette; hover-only summaries; reflow; bright in dark mode; edge avatar adds noise |
| **More** | Wildlife card with a real photograph is lovely | A second card grid right after Selected work, with the same border-and-shadow cards; make it feel different (more paper, less card) |
| **Contact** | Giant "Say hello.", waving avatar on the line, copyable email | 5 actions at once; the résumé shouldn't live *only* here |
| **Project pages** | A coherent family; signature artefact per page; question headlines; honest reconstructions | Line ends mid-page and restarts; ADI dead end; some heroes leave the middle column empty |
| **Lynxster page** | Sober, precise, credible; navy/cyan world; watching mark is a nice touch | Assembly illustration feels like generic product-site art; ghost state before playing |
| **Wildlife page** | Photos lead; uncropped; justified rows; restrained chrome | Heavy page; title misaligned with breadcrumb; tiny Cormorant intro; lead photo's subject below the fold |

---

## 11. Automated detector results (what a design linter sees)

**Source code scan: 0 findings.** No banned patterns in the code.

**In-browser scan.** What it flagged, and whether it's real:

| Finding | Where | Real? |
|---|---|---|
| Cream / ivory palette | Every page | **True, and intentional.** It's flagged as a common AI-style choice; here it's justified by the archive/notebook concept. |
| Thin border + wide soft shadow | Selected work panels, More cards, Currently visuals, AMNH plates, Lynxster sheets, Crackd sheet | **True.** Treat it as advice: it's the most "generic card" detail on the site. |
| Radial glow | Lynxster float/stage, AMNH field plate | **True.** On-brand for Lynxster, but a common modern-SaaS trope. |
| Tight line-height | Display serif lines (pull quotes, subtitles) | **Mostly false positives.** Tight leading is right at display sizes. Real only for the 19.5 px timeline margin notes and the 35 px Lynxster "learning" paragraphs. |
| All-caps body text, eyebrow pill | Short labels or metadata | **False positives.** |
| Uneven heading spacing | Lynxster "The problem" and area titles | **Real but minor.** |
| Repeated text | Crackd "View walkthrough" / "Code on GitHub" | **False positive** (once per app, by design). |

**Mechanical checks:**
- no horizontal overflow on any page;
- 0 console errors;
- 0 failed requests;
- 2 main font families, plus Jost for the Lynxster wordmark;
- homepage layout shift 0.80, wildlife page ~44 MB.

---

## 12. A short note on the work itself

You asked for mainly design. Here's how the *work* reads through this design:

- **The strongest cases** are Crackd, Buzzworks and TMU. They show full ownership, end-to-end builds and real constraints (WhatsApp's 10-item limit, a book's citation pipeline). Their project pages are the most convincing evidence of engineering ability on the site.
- **Lynxster is the headline but the least shown,** for good reasons (confidentiality, a pending patent). The design compensates with tone and precision. Paired with a visible title ("CTO & co-founder") in the hero, it would carry more weight.
- **AMNH, once its photographs and mantis work are in,** pairs naturally with Lynxster: one systems-of-trust story, one archive story. Together they are a strong "Currently".
- **The research, fieldwork and teaching** make you unusually well-rounded. The design's job is to keep them from diluting the engineering story, and the "one thread" framing does that well.
- **What would help hiring readers most:**
  - a one-line summary of what you're looking for;
  - maybe one or two outcome numbers where you're allowed to share them (users, adoption, scale).

---

## 13. Questions and experiments for the `testing` branch

These are the levers most likely to move outcomes, roughly in order of impact:

1. **Hero headline experiment.**
   - Version A: the current tagline.
   - Version B: a concrete one-line identity (school · role · current work).
   - Version C: both, with B small and above the name.
2. **Résumé and links above the fold.** A small "Résumé · LinkedIn · GitHub" line in the hero or header.
3. **Selected work: three variants of your coloured panels.**
   - always-visible summaries + no reflow;
   - same, with paper-tint colours at about half the saturation;
   - same, with much dimmer panels in dark mode.

   Compare in light and dark mode.
4. **The "one motif" pass.** Remove tape, the edge-peeking avatar and two of the four heading marks, then compare screenshots side by side.
5. **Mobile and consistency pass.**
   - 44 px tap targets in the header.
   - A touch-appropriate hint in the Work drawer.
   - "More" / "Other things" naming unified.
   - The nav state on the wildlife page fixed.
   - ADI's closing link.
   - The line no longer crossing the mobile timeline note.
6. **Stability pass.** Stop the hero dot-grid layout shift, and decide what the Lynxster illustration shows before it plays.
7. **Recruitment and portrait balance check.** After 1–4, re-run the 30-second skim test (section 5.3). The goal is the facts within 10 seconds, with the vibe unchanged.

---

## Appendix: evidence

**How the screenshots were captured:**
- Playwright (Chrome) against the dev server on `localhost:3100`. The viewport was captured at each scroll step, and every capture listed was viewed.
- Dark mode was emulated through the system colour scheme.

**Where they are:** the session scratchpad (not in the repo), in `…/scratchpad/critique-a/shots/` and `…/scratchpad/critique-b/`.

**What was captured:**
- **Homepage:** desktop light (`home-d-00` → `06`) and dark (`home-dark-00/02/04/06`); 1280 (`x-home-1280`); mobile (`sheet-home-m-0/1/2`); reduced motion (`x-reduced-00/01`).
- **Interactions:**
  - focus ring;
  - timeline click;
  - Selected work hover;
  - Work drawer (desktop and mobile);
  - theme menu;
  - avatar zoom;
  - mobile timeline/line collision.
- **Wildlife:** desktop (`wild-d-00`, `sheet-wild-d-0/1`) and mobile (`sheet-wild-m-0/1`).
- **Project pages:**
  - Lynxster: desktop, mobile and dark;
  - AMNH: desktop and dark;
  - Crackd: desktop and mobile;
  - Buzzworks;
  - GVI;
  - TMU;
  - Inteli-lens;
  - PMMY;
  - teenage pregnancy;
  - ESP;
  - ADI.

**Routes checked:**
- `/`
- `/wildlife-photography`
- `/work/` + `lynxster`, `amnh`, `crackd-ai`, `buzzworks`, `tmu-citation-tooling`, `inteli-lens`, `gvi-conservation`, `pmmy-research`, `teenage-pregnancy-research`, `esp-teaching`, `adi-mentorship`.

**Limitations:**
- Performance numbers come from the dev server, not production.
- Industry fit (section 6) reflects general hiring tendencies, not data about specific companies.
- No code was changed.
