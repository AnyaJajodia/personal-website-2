/**
 * The GVI page's three photographs — Anya's own, from the placement.
 *
 * Originals live in public/assets/gvi/ (untouched); the page serves resized
 * WebP copies from public/assets/gvi/web/, made by scripts/build-gvi-photos.mjs.
 * `widths` lists the exported files; `width`/`height` are the original's, so
 * every frame reserves the photograph's own proportions (nothing is cropped).
 * The community photograph's face-obscuring edits are part of the supplied
 * file and are kept exactly; it is only ever scaled down.
 */

export type FieldPhoto = {
  id: string;
  /** /assets/gvi/web/<stem>-<w>.webp */
  stem: string;
  widths: number[];
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** the responsive `sizes` for its place on the page */
  sizes: string;
  /** set the caption over the photograph where it has room (the opening only) */
  overlay?: boolean;
};

export const gviPhotos: Record<"opening" | "fieldwork" | "teaching", FieldPhoto> = {
  opening: {
    id: "opening",
    stem: "/assets/gvi/web/gvi-lioness-relocation",
    widths: [480, 800, 1200, 1600, 2400],
    width: 5472,
    height: 3648,
    alt: "Reserve staff in green field uniforms carry a sedated lioness in a canvas sling along a dirt road, her tail hanging free.",
    caption: "A tranquilized lioness being transported for relocation to another reserve.",
    sizes: "(max-width: 1340px) calc(100vw - 2.5rem), 1240px",
    overlay: true,
  },
  fieldwork: {
    id: "fieldwork",
    stem: "/assets/gvi/web/gvi-cheetah-observation",
    widths: [480, 800, 930],
    width: 930,
    height: 1396,
    alt: "A cheetah stands in tall dry grass beneath thorn trees, holding an animal in its jaws.",
    caption: "Taba, one of the reserve’s two female cheetahs, carrying her prey.",
    sizes: "(max-width: 899px) min(24rem, calc(100vw - 2.5rem)), 22rem",
  },
  teaching: {
    id: "teaching",
    stem: "/assets/gvi/web/gvi-community-learning",
    widths: [480, 800, 1200, 1600, 2400],
    width: 4320,
    height: 3240,
    alt: "Young children, their faces obscured, stand together in a covered outdoor classroom with a painted giraffe mural and backpacks on the wall.",
    caption: "The local preschool, where our team visited every other week to help teach lessons.",
    sizes: "(max-width: 899px) calc(100vw - 2.5rem), 30rem",
  },
};
