/**
 * The GVI page's three photographs — Anya's own, to be supplied.
 *
 * To add one: put the file in public/work/gvi/ and set its `src` (and `alt`,
 * `width`, `height`). Until then the page shows a quiet, labelled placeholder
 * at the same proportions, so nothing shifts when the photograph arrives.
 * Never stock or generated images. The teaching photograph needs permission
 * and children's faces obscured; avoid sensitive wildlife locations.
 */

export type FieldPhoto = {
  id: string;
  /** null until the real photograph is supplied */
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  /** CSS aspect ratios: wide screens, and phones */
  ratio: string;
  ratioNarrow?: string;
  /** what belongs here, shown on the placeholder */
  wanted: string;
  /** the field-note caption, shown under the photograph either way */
  caption: string;
  /** a note that travels with the placeholder only (permissions, framing) */
  care?: string;
};

export const gviPhotos: Record<"opening" | "fieldwork" | "teaching", FieldPhoto> = {
  opening: {
    id: "opening",
    src: null,
    alt: "",
    ratio: "21 / 9",
    ratioNarrow: "4 / 3",
    wanted: "An animal within the wider bushveld, or documentary fieldwork",
    caption: "Karongwe Private Game Reserve, Limpopo · Summer 2024",
  },
  fieldwork: {
    id: "fieldwork",
    src: null,
    alt: "",
    ratio: "4 / 5",
    ratioNarrow: "4 / 3",
    wanted: "Fieldwork: monitoring, surveys or camera traps",
    caption: "In the field: monitoring, surveys, camera traps",
  },
  teaching: {
    id: "teaching",
    src: null,
    alt: "",
    ratio: "3 / 2",
    wanted: "Community teaching",
    caption: "Fortnightly visits to a local village",
    care: "With permission, children’s faces obscured",
  },
};
