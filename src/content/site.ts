/**
 * Central, editable homepage content.
 * Source: handoff/content/home.md and handoff/content/trajectory.md.
 * Anything marked `url: null` is intentionally unavailable and renders as plain
 * "to come" text instead of a dead link (see EDITING_CHECKLIST.md).
 */

export type ExternalLink = {
  label: string;
  /** null = not supplied yet; rendered as non-clickable placeholder text */
  url: string | null;
  /** Shown instead of a link while url is null */
  pendingNote?: string;
};

export const person = {
  name: "Anya Jajodia",
  location: "New York",
  email: "anya@jajodia.org",
};

/**
 * The public site: its address (every canonical URL, the sitemap and the
 * share previews are built from it) and search-engine verification. Paste
 * Google Search Console's HTML-tag code into `google` (the content="…" value
 * only) and Bing's into `bing`; empty strings add nothing to the page.
 */
export const site = {
  url: "https://anya.jajodia.org",
  verification: { google: "", bing: "" },
};

export const hero = {
  nameLines: ["Anya", "Jajodia."],
  tagline: "Building ideas. Exploring possibilities. Asking better questions.",
  /** What she does, in facts already on the page (About + Currently): the
   * tagline's concrete twin, three plain sentences that only ever break
   * between each other. A `link` part is a quiet in-page link to Work. */
  identity: [
    ["Computer science senior at Barnard."],
    ["CTO & co-founder of ", { label: "Lynxster", href: "#now" }, "."],
    ["Digitizing dragonfly records at the ", { label: "American Museum of Natural History", href: "#now" }, "."],
  ] satisfies (string | { label: string; href: string })[][],
  intro:
    "I build end-to-end software, explore what technology could do differently, and follow the threads that pique my curiosity—occasionally into the backrooms of a museum.",
  location: "Based in New York.",
  /** the first screen's one way to act: the ending's heading, as a link to it */
  hello: { label: "Say hello", href: "#contact" },
  scrollCue: "Scroll to follow the thread",
};

export const about = {
  label: "About",
  heading: "A fairly straightforward career trajectory.",
  paragraphs: [
    "I’m a senior at Barnard College studying computer science, with minors in anthropology and English. I arrived with QMSS and economics in mind, discovered programming, and kept finding more things I wanted to do with it. Since then, I’ve worked across full-stack development, AI, and cryptographic systems—and somehow found my way into dragonfly archives and mantis behavioral research.",
  ],
  aside: "Naturally, this was all part of the plan.",
  paragraphsAfter: [
    "I like taking an idea far enough to find out whether it works: building the software, figuring out the details, and asking what could make it more useful. Conservation and animal behavior give me another set of questions to follow, while anthropology often changes how I look at them. Sometimes those interests overlap; sometimes I’m happy pursuing them alongside each other.",
    "Outside of that: wildlife photography, writing, and squash. Some interests have remained reassuringly consistent.",
  ],
};

/** A line quoted from the About text, for a milestone's aside — never new wording. */
const quoted = (source: string, words: string) => (source.includes(words) ? words : "");
const aboutText = [...about.paragraphs, ...about.paragraphsAfter].join(" ");

/** Five trajectory labels + a continuing phrase. Overlapping interests, not a dated sequence.
 * Each point's `aside` is a fragment of the About paragraphs, shown in the
 * timeline's margin when that milestone is picked. */
export const trajectory = {
  srHeading: "Career trajectory",
  points: [
    { title: "QMSS + economics", caption: "The original plan.", aside: quoted(aboutText, "I arrived with QMSS and economics in mind") },
    { title: "Computer science", caption: "I liked making things.", aside: quoted(aboutText, "discovered programming, and kept finding more things I wanted to do with it.") },
    { title: "Research, software, AI", caption: "One interest became several.", aside: quoted(aboutText, "I’ve worked across full-stack development, AI, and cryptographic systems") },
    {
      title: "People + the natural world",
      caption: "Anthropology, conservation, and the questions around the code.",
      aside: quoted(aboutText, "Conservation and animal behavior give me another set of questions to follow"),
    },
    { title: "Lynxster + AMNH", caption: "Systems of trust. Records worth preserving.", aside: quoted(aboutText, "somehow found my way into dragonfly archives and mantis behavioral research.") },
  ],
  continuing: "Still following the thread.",
};

export const currently = {
  label: "Currently",
  heading: "Two threads I’m following.",
  /** role and dates are the homepage's own (home.md); the detail pages keep theirs */
  features: [
    {
      slug: "lynxster" as const,
      name: "Lynxster",
      role: "CTO & Co-founder",
      period: "April 2026–present",
      /** a restrained status pill beside the role (lynxster.md) */
      status: "Patent pending",
      description: "Engineering, product development, and technical leadership for independently verifiable digital records.",
      cta: "Explore Lynxster",
      /** the preview's caption, under its drawing */
      preview: "lynxster",
      /** two rows, like AMNH's workstreams (condensed from lynxster.md) */
      streams: [
        { name: "From developer to co-founder", text: "Joined in April 2026 as a Junior Developer; now Chief Technology Officer and Co-founder." },
        { name: "What I work on", text: "Engineering and infrastructure · Cryptography and product · Agent-assisted development · Product and communication" },
      ],
    },
    {
      slug: "amnh" as const,
      name: "American Museum of Natural History",
      role: "Volunteer",
      period: "2026–present",
      cta: "Explore AMNH",
      preview: "collections · research",
      /** its two projects, each linking to its own page (amnh.md) */
      streams: [
        {
          name: "DIODE · Collections digitization",
          href: "/work/amnh/diode",
          text: "I prepare specimens and their collection labels for imaging, operate the existing capture setup, review the resulting images, and rehouse the specimens afterward.",
        },
        {
          name: "Chaeteessa · Behavioral research",
          href: "/work/amnh/behavioral-research",
          text: "I’m contributing to an ongoing study of feeding behavior in Chaeteessa mantises.",
        },
      ],
    },
  ],
};

export type SelectedRow = {
  title: string;
  /** the homepage's date for the row (home.md), shown in the panel's metadata */
  date: string;
  description: string;
  category: string;
  /** Single entry → whole row links to it. Multiple → each listed as a sub-link. */
  links: { slug: string; label: string }[];
};

export const selectedWork = {
  label: "Selected work",
  heading: "Other things I’ve worked on.",
  rows: [
    {
      title: "Crackd.ai",
      date: "2025–2026",
      description:
        "Building a complete AI humor platform: user-facing apps, admin tools, and an internal LLM chaining matrix for developing humor styles and emulating different voices, supported by prompt research and data workflows.",
      category: "Engineering",
      links: [{ slug: "crackd-ai", label: "Crackd.ai" }],
    },
    {
      title: "Buzzworks",
      date: "2025–2026",
      description:
        "Designing and developing a WhatsApp-based HR onboarding platform that Buzzworks uses internally and offers to client companies, turning multi-step employee onboarding into a conversation.",
      category: "Engineering",
      links: [{ slug: "buzzworks", label: "Buzzworks" }],
    },
    {
      title: "Citation tooling · Toronto Metropolitan University",
      date: "2025",
      description:
        "Building citation-conversion pipelines that turn footnotes and other reference formats into publication-ready in-text citations, including the final pipeline used for a book.",
      category: "Research",
      links: [{ slug: "tmu-citation-tooling", label: "Citation tooling" }],
    },
    {
      title: "Inteli-lens",
      // 2022 and this summary from the revised inteli-lens.md (home.md still has 2023)
      date: "2022",
      description:
        "An independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication.",
      category: "Prototype",
      links: [{ slug: "inteli-lens", label: "Inteli-lens" }],
    },
    {
      title: "Conservation fieldwork · South Africa",
      date: "2024",
      description:
        "Monitoring wildlife, processing data from camera traps, heat maps, GIS, and bird surveys, and learning to notice connections across disciplines.",
      category: "Fieldwork",
      links: [{ slug: "gvi-conservation", label: "Conservation fieldwork" }],
    },
    {
      title: "Research publications",
      date: "2022",
      description:
        "Published research examining the effectiveness of women’s financial empowerment initiatives and relationships between socioeconomic factors, teenage pregnancy, and fertility rates.",
      category: "Publications",
      links: [
        { slug: "pmmy-research", label: "PMMY & women’s financial empowerment" },
        { slug: "teenage-pregnancy-research", label: "Teenage pregnancy & fertility" },
      ],
    },
    {
      title: "Teaching & mentorship",
      date: "2024–2026",
      description:
        "Teaching computer science concepts through ESP and mentoring through ADI—from developing ideas and navigating classes to recruiting and figuring out a career path.",
      category: "Teaching",
      links: [
        { slug: "esp-teaching", label: "Emerging Scholars Program" },
        { slug: "adi-mentorship", label: "Application Development Initiative" },
      ],
    },
  ] satisfies SelectedRow[],
};

export const more = {
  label: "More",
  heading: "A little further afield.",
  /** why photography matters to her: Anya's own words (the gallery page
   * describes the photographs; this doesn't repeat it) */
  intro: [
    "I fell in love with photography when I was young, and wildlife has become one of my favorite reasons to pick up a camera. It’s something I do for myself, and something I want to keep getting better at.",
    "This is a growing collection of photographs I’m proud of. I’ll keep adding to it as I go—hopefully with a little progress visible along the way.",
  ],
  cta: { label: "Explore the photographs", href: "/wildlife-photography" },
  /** held back from this release, kept for later: Writing and Experiments
   * (MoreBento keeps their scenes, globals.css their layout). The former
   * heading was "There are other things.", the former intro "Writing,
   * wildlife photography, and a few experiments that don’t fit neatly under
   * “work.”", with the note "This part is still taking shape." */
  deferred: ["Writing", "Experiments"],
};

export const contact = {
  label: "Contact",
  heading: "Say hello.",
  intro: "Have something worth building, a question worth exploring, or an opportunity you think I’d be curious about? I’d love to hear.",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/anya-jajodia/" },
    { label: "GitHub", url: "https://github.com/AnyaJajodia" },
    // Résumé: no PDF supplied yet — never render a dead download button.
    { label: "Résumé", url: null, pendingNote: "Updated PDF to come" },
  ] satisfies ExternalLink[],
  footer: "Anya Jajodia · New York",
};

/** `routes`: the pages that belong to a section, so their header marks it
 * current (the first match wins). Work is split as the homepage is: Now is
 * Currently (Lynxster, AMNH), Work is Selected work; on detail pages each
 * opens its own drawer (WorkDrawer). */
export const nav: { label: string; hash: string; routes?: string[] }[] = [
  { label: "About", hash: "about" },
  { label: "Now", hash: "now", routes: ["/work/lynxster", "/work/amnh"] },
  { label: "Work", hash: "selected-work", routes: ["/work/"] },
  { label: "More", hash: "more", routes: ["/wildlife-photography"] },
  { label: "Contact", hash: "contact" },
];
