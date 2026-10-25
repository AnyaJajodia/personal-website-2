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

export const hero = {
  nameLines: ["Anya", "Jajodia."],
  tagline: "Building ideas. Exploring possibilities. Asking better questions.",
  intro:
    "I build end-to-end software, explore what technology could do differently, and follow the threads that pique my curiosity—occasionally into the backrooms of a museum.",
  location: "Based in New York.",
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
      slug: "lynxster",
      name: "Lynxster",
      role: "Chief Technology Officer",
      period: "2026–now",
      description:
        "Building software that gives customers independently verifiable records, designed for FERPA requirements and US and Canadian legal frameworks.",
      cta: "Explore Lynxster",
    },
    {
      slug: "amnh",
      name: "American Museum of Natural History",
      role: "Volunteer",
      period: "2026–now",
      cta: "Explore AMNH",
      /** two separate workstreams within the museum */
      streams: [
        {
          name: "DIODE · Collections digitization",
          text: "Digitizing archival dragonfly records with Jessica Ware’s lab, helping set up 3D-printed digitization rigs, and improving the workflows around them.",
        },
        { name: "Mantis behavioral trials & research", text: "Details to come." },
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
      date: "2025",
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
      title: "Research tooling · Toronto Metropolitan University",
      date: "2025",
      description:
        "Building citation-conversion pipelines that turn footnotes and other reference formats into publication-ready in-text citations, including the final pipeline used for a book.",
      category: "Research",
      links: [{ slug: "tmu-citation-tooling", label: "Research tooling" }],
    },
    {
      title: "Inteli-lens",
      date: "2023",
      description:
        "A computer-vision prototype exploring walking patterns and body language for signs of intoxication, with the goal of helping reduce drunk-driving incidents in the US.",
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
      date: "2022–2024",
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
  heading: "There are other things.",
  intro: "Writing, wildlife photography, and a few experiments that don’t fit neatly under “work.”",
  /** Non-clickable placeholders — no routes exist for these yet. */
  items: ["Writing", "Wildlife photography", "Experiments"],
  note: "This part is still taking shape.",
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

export const nav = [
  { label: "About", hash: "about" },
  { label: "Work", hash: "work" },
  { label: "More", hash: "more" },
  { label: "Contact", hash: "contact" },
];
