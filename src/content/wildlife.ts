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
 * Titles follow the supplied filenames; captions are factual.
 */
import manifest from "./wildlife-photos.json";
import generated from "./wildlife-photos.generated.json";

type Generated = { width: number; height: number; bytes: number; tone: { light: string; dark: string } };
type ManifestPhoto = { file: string; title: string; caption: string; alt: string };
type ManifestRow = { photos: string[]; width?: number; space?: "tight" | "wide" };

export type Photo = {
  id: string;
  src: string;
  title: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  /** larger placements for the main selection, smaller for supporting photographs */
  weight: "main" | "support";
  /** its place's colour while it loads */
  tone: { light: string; dark: string };
};

export type Row = {
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
    caption: p.caption,
    alt: p.alt,
    width: g.width,
    height: g.height,
    weight: p.file.startsWith("secondary-gallery/") ? "support" : "main",
    tone: g.tone,
  };
}

export const hero: Photo = photo(manifest.hero);
export const rows: Row[] = (manifest.rows as ManifestRow[]).map((r) => ({ photos: r.photos.map(photo), width: r.width ?? 1, space: r.space ?? "normal" }));
/** the whole collection in viewing order: the opening photograph, then the rows */
export const sequence: Photo[] = [hero, ...rows.flatMap((r) => r.photos)];
export const homepagePhoto: Photo = photo(manifest.homepage);

export const wildlife = {
  name: "Wildlife photography",
  title: "Wildlife photography — Anya Jajodia",
  description: "Wildlife photographs by Anya Jajodia: lions, leopards, cheetahs, elephants, giraffes, hippos and birds.",
  lede: "I love wildlife, and I enjoy photographing it. Here are some of the animals I’ve photographed so far.",
  hint: "Select a photograph to see it larger.",
};
