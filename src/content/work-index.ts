import { currently, selectedWork } from "./site";
import { getWork } from "./work";

/**
 * Every portfolio experience, for the two work drawers (WorkDrawer: Now and
 * Work), built from the homepage's own data (site.ts) so names, grouping and
 * routes stay in step.
 *
 * Tones and logos mirror the homepage panels (WorkPanels' LOOKS); they are
 * repeated here rather than imported so the homepage component is untouched.
 * Dates are deliberately left out: the homepage and the detail pages still
 * disagree on several (EDITING_CHECKLIST.md), and the drawer sits beside both.
 */

export type WorkMark = "lens" | "pages" | "mentor";

export type DrawerLogo =
  | { kind: "img"; src: string; w: number; h: number; dark?: boolean }
  | { kind: "mark"; mark: WorkMark }
  | { kind: "lynxster" }
  | { kind: "wordmark"; src: string; w: number; h: number };

/** `hash`: a section of a shared page; `detail`: quieter words after the label */
export type DrawerLink = { slug: string; label: string; hash?: string; detail?: string };

export type DrawerEntry = {
  key: string;
  title: string;
  /** one short line beside the name: a role (Currently) or the category;
   * left out where each sub-link carries its own role */
  note?: string;
  tone?: string;
  logo: DrawerLogo;
  /** one link: the whole entry is the link; several: listed under the title */
  links: DrawerLink[];
};

// `who`: the organisation, for entries whose name alone doesn't say where the
// work happened ("Citation tooling", "Conservation fieldwork"); shown before the category.
// `title` / `category`: the drawer's own wording where the homepage's is inaccurate
// (the TMU work built software, so it is engineering, not research)
const LOOKS: Record<string, { key: string; tone: string; logo: DrawerLogo; who?: string; title?: string; category?: string }> = {
  "crackd-ai": { key: "crackd", tone: "#f8d74d", logo: { kind: "img", src: "/logos/crackd-minimal.png", w: 148, h: 178, dark: true } },
  buzzworks: { key: "buzzworks", tone: "#e8b28d", logo: { kind: "img", src: "/logos/buzzworks-minimal.png", w: 162, h: 152 } },
  "tmu-citation-tooling": { key: "tmu", tone: "#a9c1d9", logo: { kind: "img", src: "/logos/tmu.png", w: 256, h: 140 }, who: "TMU", title: "Citation tooling", category: "Engineering" },
  "inteli-lens": { key: "inteli", tone: "#b9a4be", logo: { kind: "mark", mark: "lens" } },
  "gvi-conservation": { key: "gvi", tone: "#a5bdb0", logo: { kind: "img", src: "/logos/gvi.webp", w: 300, h: 237 }, who: "GVI" },
  "pmmy-research": { key: "pubs", tone: "#d3a1ad", logo: { kind: "mark", mark: "pages" } },
  // the Columbia crown, deep blue: its tile keeps the lavender tone in both themes
  "esp-teaching": { key: "teaching", tone: "#b0b9da", logo: { kind: "img", src: "/logos/columbia-crown-light.png", w: 300, h: 300 } },
};

// AMNH holds two roles on one shared page (for now): each is its own entry,
// pointing at its stream on that page, with the role as the label
const amnhLinks: DrawerLink[] = [
  { slug: "amnh", hash: "collections-digitization", label: "Volunteer", detail: "DIODE collections digitization" },
  { slug: "amnh", hash: "mantis-research", label: "Volunteer research", detail: "Mantis behavioral trials" },
];

export const drawerSelected: DrawerEntry[] = selectedWork.rows.map((row) => {
  const look = LOOKS[row.links[0].slug];
  return {
    key: look.key,
    // one visible name, as on the homepage panels: the short name for single projects
    title: look.title ?? (row.links.length === 1 ? row.links[0].label : row.title),
    note: look.who ? `${look.who} · ${look.category ?? row.category}` : (look.category ?? row.category),
    tone: look.tone,
    logo: look.logo,
    links: row.links,
  };
});


/** the Now drawer: the two commitments as the homepage's Currently tells them
 * (role, dates and status from home.md; AMNH's line is its page's subtitle) */
export type NowEntry = {
  key: string;
  slug: string;
  name: string;
  role: string;
  period: string;
  status?: string;
  line: string;
  cta: string;
  /** sections of the page, each its own link (AMNH's two roles) */
  links?: DrawerLink[];
};

export const nowEntries: NowEntry[] = currently.features.map((f) => ({
  key: f.slug,
  slug: f.slug,
  name: f.name,
  role: f.role,
  period: f.period,
  status: "status" in f ? f.status : undefined,
  line: "description" in f && f.description ? f.description : (getWork(f.slug)?.subtitle ?? ""),
  cta: f.cta,
  links: f.slug === "amnh" ? amnhLinks : undefined,
}));

export const nowLabels = { title: currently.label, heading: currently.heading };
export const workLabels = { title: selectedWork.label, heading: selectedWork.heading };
