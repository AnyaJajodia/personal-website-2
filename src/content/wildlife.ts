/**
 * Wildlife photography — the page's copy and its collection.
 *
 * The collection (files, titles, captions, the viewing sequence) lives in
 * wildlife-photos.json; each file's pixel size and loading tone are read from
 * the photographs themselves by scripts/build-wildlife-photos.mjs into
 * wildlife-photos.generated.json. The photographs are served exactly as
 * supplied: no resized or re-encoded copies.
 *
 * Visual weight comes from the folder a file sits in (main-gallery → larger,
 * secondary-gallery → smaller); it shapes the layout only and is never shown.
 * Titles and both captions are Anya's own copy.
 */
import manifest from "./wildlife-photos.json";
import generated from "./wildlife-photos.generated.json";

type Generated = { width: number; height: number; bytes: number; tone: { light: string; dark: string } };
type ManifestPhoto = { file: string; title: string; hover: string; caption: string; alt: string };
type ManifestRow = { photos: (string | string[])[]; width?: number; space?: "tight" | "wide" };

export type Photo = {
  id: string;
  src: string;
  title: string;
  /** the short caption: shown on hover and keyboard focus */
  hover: string;
  /** the longer caption: shown in the opened, larger view */
  caption: string;
  /** what the image shows, for screen readers (the captions don't replace it) */
  alt: string;
  width: number;
  height: number;
  /** larger placements for the main selection, smaller for supporting photographs */
  weight: "main" | "support";
  /** its place's colour while it loads */
  tone: { light: string; dark: string };
};

/** one place in a row: a photograph, or a column of photographs stacked */
export type Cell = {
  photos: Photo[];
  /** its width, as CSS: chosen so every cell in the row is exactly as tall */
  width: string;
};

export type Row = {
  cells: Cell[];
  /** every photograph in the row, in reading order (columns top to bottom) */
  photos: Photo[];
  /** share of the collection's width (1 = full) */
  width: number;
  /** space above: tight keeps it with the row before, wide opens a new passage */
  space: "tight" | "normal" | "wide";
};

const gen = generated as Record<string, Generated>;
const all = manifest.photos as Record<string, ManifestPhoto>;

function photo(id: string): Photo {
  const p = all[id];
  const g = p && gen[p.file];
  if (!p || !g) throw new Error(`wildlife: no data for "${id}" — run node scripts/build-wildlife-photos.mjs`);
  return {
    id,
    src: `/assets/wildlife-photography/${p.file}`,
    title: p.title,
    hover: p.hover,
    caption: p.caption,
    alt: p.alt,
    width: g.width,
    height: g.height,
    weight: p.file.startsWith("secondary-gallery/") ? "support" : "main",
    tone: g.tone,
  };
}

/**
 * Widths that give every cell in a row one height H, each photograph at its
 * own proportions. With W the row's width, g the gap, a single photograph of
 * aspect a is H·a wide; a stack of n photographs whose inverse aspects sum to
 * S is (H − (n−1)·g) / S wide. Adding the widths and gaps up to W gives
 *   H = (W − g·c) / A,  A = Σ a + Σ 1/S,  c = (cells − 1) − Σ (n−1)/S
 * — constants per row, so the CSS is exact at every width (W = 100%, g = --g).
 */
function layoutRow(groups: Photo[][]): Cell[] {
  const ar = (p: Photo) => p.width / p.height;
  const S = (ps: Photo[]) => ps.reduce((t, p) => t + 1 / ar(p), 0);
  const A = groups.reduce((t, ps) => t + (ps.length === 1 ? ar(ps[0]) : 1 / S(ps)), 0);
  const c = groups.length - 1 - groups.reduce((t, ps) => t + (ps.length > 1 ? (ps.length - 1) / S(ps) : 0), 0);
  const H = `((100% - var(--g) * ${+c.toFixed(6)}) / ${+A.toFixed(6)})`;
  return groups.map((ps) => ({
    photos: ps,
    width: ps.length === 1 ? `calc(${H} * ${+ar(ps[0]).toFixed(6)})` : `calc((${H} - var(--g) * ${ps.length - 1}) / ${+S(ps).toFixed(6)})`,
  }));
}

export const hero: Photo = photo(manifest.hero);
export const rows: Row[] = (manifest.rows as ManifestRow[]).map((r) => {
  const cells = layoutRow(r.photos.map((x) => (Array.isArray(x) ? x : [x]).map(photo)));
  return { cells, photos: cells.flatMap((c) => c.photos), width: r.width ?? 1, space: r.space ?? "normal" };
});
/** the whole collection in viewing order: the opening photograph, then the rows */
export const sequence: Photo[] = [hero, ...rows.flatMap((r) => r.photos)];
export const homepagePhoto: Photo = photo(manifest.homepage);

export const wildlife = {
  name: "Wildlife photography",
  title: "Wildlife photography — Anya Jajodia",
  description: "Wildlife photographs by Anya Jajodia: lions, leopards, cheetahs, elephants, giraffes, hippos and birds.",
  /** two sentences, set as two lines beside the title */
  lede: ["I love wildlife, and I enjoy photographing it.", "Here are some of the animals I’ve photographed so far."],
  hint: "Select a photograph to see it larger.",
};
