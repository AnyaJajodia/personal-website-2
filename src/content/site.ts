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
  tagline: "Engineering, research, and other things.",
  intro: "I build software, ask questions, and follow the occasional question into a museum.",
  location: "Based in New York.",
  scrollCue: "Scroll to follow the thread",
};

export const about = {
  label: "About",
  heading: "A fairly straightforward career trajectory.",
  paragraphs: [
    "I’m a senior at Barnard College studying computer science, with minors in anthropology and English. I started out with QMSS and economics in mind. Then I discovered programming, got interested in AI, started building cryptographic systems, and found myself working with dragonfly archives.",
  ],
  aside: "Naturally, this was all part of the plan.",
  paragraphsAfter: [
    "I like making complicated things easier to work with—whether that means building software, untangling a research workflow, or figuring out how to digitize a century-old record. I’m interested in the technical problem, but also in the people using the tools and the things worth preserving.",
    "Outside of that: wildlife photography, writing, and squash. Some interests have remained reassuringly consistent.",
  ],
};

/** Five trajectory labels + a continuing phrase. Overlapping interests, not a dated sequence. */
export const trajectory = {
  srHeading: "Career trajectory",
  points: [
    { title: "QMSS + economics", caption: "The original plan." },
    { title: "Computer science", caption: "I liked making things." },
    { title: "Research, software, AI", caption: "One interest became several." },
    { title: "People + the natural world", caption: "Anthropology, conservation, and the questions around the code." },
    { title: "Lynxster + AMNH", caption: "Systems of trust. Records worth preserving." },
  ],
  continuing: "Still following the thread.",
};

export const currently = {
  label: "Currently",
  heading: "Two threads I’m following.",
  features: [
    {
      slug: "lynxster",
      name: "Lynxster",
      description:
        "Building software for independently verifiable records, from cryptographic implementation to the product around it.",
      cta: "Explore Lynxster",
    },
    {
      slug: "amnh",
      name: "American Museum of Natural History",
      description:
        "Digitizing archival dragonfly records, helping set up 3D-printed digitization rigs, and improving the workflows around them.",
      cta: "Explore AMNH",
    },
  ],
};

export type SelectedRow = {
  title: string;
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
      description: "LLM chains, cultural context, and the surprisingly complicated problem of making a model funny.",
      category: "Engineering",
      links: [{ slug: "crackd-ai", label: "Crackd.ai" }],
    },
    {
      title: "Buzzworks",
      description: "A WhatsApp-based HR system that turns multi-step onboarding into a conversation.",
      category: "Engineering",
      links: [{ slug: "buzzworks", label: "Buzzworks" }],
    },
    {
      title: "Research tooling · Toronto Metropolitan University",
      description: "A Python pipeline for tracing, replacing, and validating legal citations.",
      category: "Research",
      links: [{ slug: "tmu-citation-tooling", label: "Research tooling" }],
    },
    {
      title: "Inteli-lens",
      description: "A computer-vision prototype for identifying potentially intoxicated behavior in CCTV footage.",
      category: "Prototype",
      links: [{ slug: "inteli-lens", label: "Inteli-lens" }],
    },
    {
      title: "Conservation fieldwork · South Africa",
      description: "Wildlife monitoring, cheetah data, and learning to pay closer attention.",
      category: "Fieldwork",
      links: [{ slug: "gvi-conservation", label: "Conservation fieldwork" }],
    },
    {
      title: "Research publications",
      description:
        "Earlier work on women’s financial empowerment and the socioeconomic factors surrounding teenage pregnancy.",
      category: "Publications",
      links: [
        { slug: "pmmy-research", label: "PMMY & women’s financial empowerment" },
        { slug: "teenage-pregnancy-research", label: "Teenage pregnancy & fertility" },
      ],
    },
    {
      title: "Teaching & mentorship",
      description: "Peer teaching and technical mentorship through Columbia’s ESP and ADI communities.",
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
  intro: "For a project, a research question, or a conversation that might become either.",
  links: [
    { label: "LinkedIn", url: null, pendingNote: "Link to come" },
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
