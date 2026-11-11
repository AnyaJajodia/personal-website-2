/**
 * Central, editable content for every detail route (/work/[slug]).
 * Source: handoff/content/work/*.md. Copy is the factual authority — do not
 * add claims here that are not in the handoff or supplied by Anya.
 *
 * Dates: uncertain end dates use the 2027 placeholder the user requested and
 * are flagged `needsReview: true` (listed in EDITING_CHECKLIST.md). Entries with
 * no known start date keep `start: null`, which omits the public period field.
 */

import type { ExternalLink } from "./site";

export type Theme = "lynxster" | "amnh" | "default";

export type Period = {
  label: "Period" | "Year";
  start: string | null;
  end: string | null;
  needsReview?: boolean;
  reviewNote?: string;
};

export type Section = { heading: string; paragraphs: string[] };

/** A distinct workstream within one organisation, with its own sections and figure. */
export type Stream = {
  id: string;
  heading: string;
  figure?: Figure;
  sections: Section[];
  /** an honest note about what is not yet confirmed */
  pending?: string;
};

export type FlowStep = { title: string; note: string };

export type Figure =
  | { kind: "flow"; steps: FlowStep[]; caption: string }
  | { kind: "plates"; plates: { caption: string; pattern: "ledger" | "grid" | "field" }[]; note: string };

export type WorkEntry = {
  slug: string;
  /** Short name used in breadcrumbs, pager and page <title> */
  name: string;
  theme: Theme;
  /** Small blue label lines above the title (organisation, department) */
  eyebrow?: string[];
  /** h1 — the editorial headline */
  title: string;
  subtitle: string;
  role?: { label: string; value: string };
  period?: Period;
  /** Additional metadata (Focus, Tools, Publication…) */
  meta?: { label: string; value: string }[];
  /** Lynxster: opening statement shown in the dark hero beside the title */
  lede?: string[];
  figure?: Figure;
  /** separate workstreams, shown before the shared `sections` */
  streams?: Stream[];
  sections: Section[];
  links?: (ExternalLink & { needsReview?: boolean })[];
  /** Short description used in <meta name="description"> */
  description: string;
};

export function formatPeriod(p?: Period): string | null {
  if (!p || !p.start) return null; // never invent a start date
  if (!p.end || p.end === p.start) return p.start;
  return `${p.start}–${p.end}`;
}

export const work: WorkEntry[] = [
  {
    // the page itself is components/lynxster/LynxsterPage.tsx (copy in
    // content/lynxster.ts); this entry gives the drawer, pager and <title>
    slug: "lynxster",
    name: "Lynxster",
    theme: "lynxster",
    title: "Building systems of trust.",
    subtitle: "Engineering, product development, and technical leadership for independently verifiable digital records.",
    role: { label: "Role", value: "Chief Technology Officer & Co-founder" },
    period: { label: "Period", start: "April 2026", end: "present" },
    sections: [],
    description: "Lynxster: engineering, product development, and technical leadership for independently verifiable digital records.",
  },
  {
    // the AMNH pages are components/amnh/ (copy in content/amnh.ts): the
    // overview at /work/amnh and its two projects beneath it. This record
    // gives the overview its place in the pager and the Now drawer its line.
    slug: "amnh",
    name: "AMNH",
    theme: "amnh",
    title: "Behind the collections. Into new questions.",
    subtitle: "Collections digitization and behavioral research in Invertebrate Zoology at the American Museum of Natural History.",
    role: { label: "Role", value: "Volunteer" },
    period: { label: "Period", start: "2026", end: "present" },
    sections: [],
    description: "Collections digitization and behavioral research in Invertebrate Zoology at the American Museum of Natural History.",
  },
  {
    // The Crackd page has its own layout and full copy (content/crackd.ts, from
    // handoff/content/work/crackd-ai.md). This record supplies its name, the
    // page <title>/description and its place in the pager.
    slug: "crackd-ai",
    name: "Crackd.ai",
    theme: "default",
    title: "Can a model learn to be funny?",
    subtitle: "Three applications, a prompt experimentation platform, and the surprisingly complicated business of campus humor.",
    role: { label: "Role", value: "Software development · UI implementation · Admin tooling · Prompt engineering" },
    period: { label: "Period", start: "September 2025", end: "May 2026" },
    sections: [],
    description: "Crackd.ai: Three applications, a prompt experimentation platform, and the surprisingly complicated business of campus humor.",
  },
  {
    // The Buzzworks page has its own layout and full copy (content/buzzworks.ts,
    // from handoff/content/work/buzzworks.md). This record supplies its name,
    // the page <title>/description and its place in the pager.
    slug: "buzzworks",
    name: "Buzzworks",
    theme: "default",
    title: "There’s a workflow behind that message.",
    subtitle: "Building a personalized WhatsApp HR platform, from account verification and onboarding to employee requests.",
    role: { label: "Role", value: "Full Stack Software Development Intern" },
    period: { label: "Period", start: "May 2025", end: "May 2026" },
    sections: [],
    description: "Buzzworks: Building a personalized WhatsApp HR platform, from account verification and onboarding to employee requests.",
  },
  {
    // The TMU page has its own layout and full copy (content/tmu.ts, from
    // handoff/content/work/tmu-citation-tooling.md). This record supplies its
    // name (kept, so neighbouring pages' pager labels are unchanged), the page
    // <title>/description and its place in the pager.
    slug: "tmu-citation-tooling",
    name: "Citation tooling · TMU",
    theme: "default",
    title: "Following the footnotes.",
    subtitle: "Turning a manuscript’s tangled references into in-text citations, organized bibliographies, and reviewable results.",
    role: { label: "Role", value: "Research Assistant — Ted Rogers School of Management" },
    // 2025 publicly; the end month (September or October 2025) is still to be settled
    period: { label: "Period", start: "2025", end: null },
    sections: [],
    description: "Toronto Metropolitan University: Turning a manuscript’s tangled references into in-text citations, organized bibliographies, and reviewable results.",
  },
  {
    // The Inteli-lens page has its own layout and full copy (content/inteli.ts,
    // from handoff/content/work/inteli-lens.md). This record supplies its name,
    // the page <title>/description and its place in the pager.
    slug: "inteli-lens",
    name: "Inteli-lens",
    theme: "default",
    title: "Could movement reveal signs of impairment?",
    subtitle: "An independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication.",
    role: { label: "Type", value: "Independent project" },
    period: { label: "Year", start: "2022", end: null },
    meta: [{ label: "Tools", value: "Python · JupyterLab · OpenCV · TensorFlow" }],
    sections: [],
    description: "Inteli-lens (2022): an independent computer-vision experiment exploring whether walking patterns and body language could help identify possible intoxication.",
  },
  {
    // The GVI page has its own layout and full copy (content/gvi.ts, from
    // handoff/content/work/gvi-conservation.md). This record supplies its name
    // (kept, so neighbouring pages' pager labels are unchanged), the page
    // <title>/description and its place in the pager.
    slug: "gvi-conservation",
    name: "GVI · South Africa",
    theme: "default",
    title: "Learning to look more closely.",
    subtitle: "Wildlife monitoring, conservation data, and four weeks in the bushveld that opened a new direction.",
    role: { label: "Role", value: "Wildlife Research Intern" },
    // Summer 2024 publicly; exact attendance dates are not established
    period: { label: "Period", start: "Summer 2024", end: null },
    sections: [],
    description: "GVI · South Africa: Wildlife monitoring, conservation data, and four weeks in the bushveld that opened a new direction.",
  },
  {
    // The two research pages have their own layout and full copy
    // (content/research.ts, from handoff/content/work/pmmy-research.md and
    // teenage-pregnancy-research.md). These records supply their names (kept,
    // so neighbouring pages' pager labels are unchanged), the page
    // <title>/description and their places in the pager.
    slug: "pmmy-research",
    name: "PMMY research",
    theme: "default",
    title: "Policy, data, and lived consequences.",
    subtitle: "Investigating women’s access to enterprise finance through PMMY lending data and public sentiment.",
    role: { label: "Role", value: "Lead Researcher" },
    period: { label: "Year", start: "2022", end: null },
    sections: [],
    description: "PMMY & women’s financial empowerment: lending data, public sentiment, and community education (IJSHRE, 2022).",
  },
  {
    slug: "teenage-pregnancy-research",
    name: "Teenage pregnancy research",
    theme: "default",
    title: "Looking beyond the numbers.",
    subtitle: "Studying adolescent pregnancy and fertility in Maharashtra, then taking the research into hospital discussions and community education.",
    role: { label: "Role", value: "Lead Researcher" },
    period: { label: "Year", start: "2022", end: null },
    sections: [],
    description: "Teenage pregnancy & fertility in Maharashtra: a study of NFHS data, a hospital discussion, and Project Ārogya (IJSHRE, 2022).",
  },
  {
    // The two Columbia pages have their own layout and full copy
    // (content/columbia.ts, from handoff/content/work/esp-teaching.md and
    // adi-mentorship.md). These records supply their names, the page
    // <title>/description and their places in the pager.
    slug: "esp-teaching",
    name: "Emerging Scholars Program",
    theme: "default",
    title: "A different side of computer science.",
    subtitle: "From exploring computer science to helping others find their way into it.",
    role: { label: "Roles", value: "Teaching Assistant · Peer Instructor" },
    period: { label: "Period", start: "Fall 2024", end: "Spring 2025" },
    sections: [],
    description: "Emerging Scholars Program at Columbia: from taking the course to teaching it.",
  },
  {
    slug: "adi-mentorship",
    name: "Application Development Initiative",
    theme: "default",
    title: "Working through it together.",
    subtitle: "Mentoring six students through classes, projects, recruiting, and finding their own direction in computer science.",
    role: { label: "Role", value: "Mentor" },
    period: { label: "Period", start: "Spring 2026", end: "Fall 2026" },
    sections: [],
    description: "Application Development Initiative at Columbia: individual mentorship across two cohorts.",
  },
];

export function getWork(slug: string): WorkEntry | undefined {
  return work.find((w) => w.slug === slug);
}

export function getNeighbours(slug: string) {
  const i = work.findIndex((w) => w.slug === slug);
  return {
    prev: i > 0 ? work[i - 1] : undefined,
    next: i >= 0 && i < work.length - 1 ? work[i + 1] : undefined,
  };
}
