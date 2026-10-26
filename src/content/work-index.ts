import { currently, selectedWork } from "./site";

/**
 * Every portfolio experience, for the work drawer (WorkDrawer), built from the
 * homepage's own data (site.ts) so names, grouping and routes stay in step.
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

export type DrawerLink = { slug: string; label: string };

export type DrawerEntry = {
  key: string;
  title: string;
  /** one short line under the name: a role (Currently) or the category */
  note: string;
  tone?: string;
  logo: DrawerLogo;
  /** one link: the whole entry is the link; several: listed under the title */
  links: DrawerLink[];
};

const LOOKS: Record<string, { key: string; tone: string; logo: DrawerLogo }> = {
  "crackd-ai": { key: "crackd", tone: "#f8d74d", logo: { kind: "img", src: "/logos/crackd-minimal.png", w: 148, h: 178, dark: true } },
  buzzworks: { key: "buzzworks", tone: "#e8b28d", logo: { kind: "img", src: "/logos/buzzworks-minimal.png", w: 162, h: 152 } },
  "tmu-citation-tooling": { key: "tmu", tone: "#a9c1d9", logo: { kind: "img", src: "/logos/tmu.png", w: 256, h: 140 } },
  "inteli-lens": { key: "inteli", tone: "#b9a4be", logo: { kind: "mark", mark: "lens" } },
  "gvi-conservation": { key: "gvi", tone: "#a5bdb0", logo: { kind: "img", src: "/logos/gvi.webp", w: 300, h: 237 } },
  "pmmy-research": { key: "pubs", tone: "#d3a1ad", logo: { kind: "mark", mark: "pages" } },
  // the Columbia crown, deep blue: its tile keeps the lavender tone in both themes
  "esp-teaching": { key: "teaching", tone: "#b0b9da", logo: { kind: "img", src: "/logos/columbia-crown-light.png", w: 300, h: 300 } },
};

export const drawerCurrent: DrawerEntry[] = currently.features.map((f) => ({
  key: f.slug,
  title: f.name,
  note: f.role,
  logo: f.slug === "lynxster" ? { kind: "lynxster" } : { kind: "wordmark", src: "/logos/amnh.png", w: 960, h: 209 },
  links: [{ slug: f.slug, label: f.name }],
}));

export const drawerSelected: DrawerEntry[] = selectedWork.rows.map((row) => {
  const look = LOOKS[row.links[0].slug];
  return {
    key: look.key,
    // one visible name, as on the homepage panels: the short name for single projects
    title: row.links.length === 1 ? row.links[0].label : row.title,
    note: row.category,
    tone: look.tone,
    logo: look.logo,
    links: row.links,
  };
});

export const drawerLabels = { current: currently.label, selected: selectedWork.label };

/** a small mark beside a sub-link (ADI's own blue pill; identical in both themes) */
export const drawerSubMarks: Record<string, { src: string; w: number; h: number; label: string }> = {
  "adi-mentorship": { src: "/logos/adi-mark.png", w: 381, h: 183, label: "ADI" },
};
