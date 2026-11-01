/**
 * The DIODE page's illustrations and their annotations.
 * Files: public/assets/amnh/diode/ (sources and alternatives in
 * references/amnh/diode/). Wording from handoff/content/work/amnh-diode.md.
 *
 * Points are percentages of each artwork (x, y from the top left), checked
 * against the rendered artwork (the supplied diode-annotation-anchors.json
 * was the starting point). `parts` are the workstation SVG's own groups
 * (data-part) lit when a note is pointed at or focused. `more` links a part
 * to its enlarged detail further down the page (a guided move).
 *
 * The tray and the screens are illustrated reconstructions, not original
 * records: captions say so. Don't point a note at anything it doesn't
 * describe (the tray position shown has no detached parts, so that note is
 * not used here).
 */

export type ArtNote = {
  key: string;
  label: string;
  text: string;
  /** one or more points on the artwork, % */
  at: [number, number][];
  parts?: string[];
  /** a link to where this part is shown enlarged */
  more?: { href: string; label: string };
};

// the workstation drawing: public/assets/amnh/diode/workstation-tinted.svg,
// inlined by components/amnh/workstation-svg.ts

export const workstation = {
  caption: "An illustrated view of the existing digitization setup.",
  alt: "Illustration of the DIODE imaging workstation: an overhead camera and lights on a frame above a motorized stage holding a prepared tray, a laptop running BugBase, and prepared trays waiting beside it.",
  notes: [
    {
      key: "camera",
      label: "Camera",
      text: "Photographs specimens and their associated labels.",
      at: [[30, 22.5]],
      parts: ["cam", "lens"],
    },
    {
      key: "lighting",
      label: "Lighting",
      text: "Illuminates the imaging area.",
      at: [[18.2, 18]],
      parts: ["panel"],
    },
    {
      key: "stage",
      label: "Motorized stage",
      text: "Positions the loaded tray beneath the camera.",
      at: [[30, 81.6]],
      parts: ["rail", "motor1", "motor2", "ctrl"],
    },
    {
      key: "tray",
      label: "Prepared tray",
      text: "Keeps specimens and associated labels organized for capture.",
      at: [[37, 63]],
      parts: ["tray"],
      more: { href: "#preparing", label: "One tray position, enlarged" },
    },
    {
      key: "software",
      label: "Control software",
      text: "BugBase coordinates the imaging sequence.",
      at: [[67.7, 56.8]],
      parts: ["laptop"],
      more: { href: "#capture", label: "Its two screens, capture and review" },
    },
    {
      key: "waiting",
      label: "Waiting specimens",
      text: "Prepared batches ready for imaging.",
      at: [[74, 86.1]],
      parts: ["wtray"],
    },
  ] satisfies ArtNote[],
};

export const tray = {
  src: "/assets/amnh/diode/tray-position-reconstruction.svg",
  width: 1640,
  height: 2000,
  alt: "Reconstruction of one tray position: the collection label for Libellula semifasciata Burmeister (Edge of pond, Wolf’s Pond Park, Richmond Co., New York City, N. Y., 13 June 1961, R. Faden) with identifier AMNH_IZC 00560655, above the photographed specimen on its platform with a color target and centimeter scale.",
  label: "One tray position",
  caption:
    "An illustrated reconstruction, redrawn from a photograph: the label is transcribed, the identifier regenerated from its scanned value, and the specimen is the real photograph. Not an original digitization output.",
  notes: [
    { key: "pair", label: "Specimen and label", text: "The specimen and its collection label remain associated throughout the process.", at: [[50, 16], [43, 82]] },
    { key: "id", label: "Identifier", text: "A unique identifier connects the specimen with its digital images and records.", at: [[93.5, 11]] },
    { key: "color", label: "Color target", text: "The color target provides a reference for interpreting image color.", at: [[67.5, 60]] },
    { key: "scale", label: "Scale", text: "The scale provides a size reference in the captured image.", at: [[90, 84]] },
  ] satisfies ArtNote[],
};

export const laptop = {
  label: "BugBase on the workstation’s laptop",
  icon: "/assets/amnh/diode/bugbase-icon.jpg",
  views: [
    {
      key: "control",
      tab: "Camera control",
      caption: "I use BugBase to run the imaging sequence and monitor the camera view.",
      note: "An illustrative recreation of the CameraControl window, simplified from a photograph of the screen.",
      preview: { src: "/assets/amnh/diode/bugbase-camera-preview.jpg", width: 900, height: 627, alt: "The camera’s live view: a collection label card on the imaging platform." },
      settings: [
        ["AEMode", "M"],
        ["TV", "125"],
        ["AV", "11"],
        ["ISO", "800"],
        ["WhiteBalance", "Custom1"],
        ["ImageQuality", "Large Fine Jpeg"],
      ],
    },
    {
      key: "review",
      tab: "Image review",
      caption: "I check the captured specimen-and-label pairs and approve or reject images before continuing.",
      note: "An example saved specimen image, with its identifier, scale and color reference visible (AMNH_IZC 00560622, a different specimen from the tray position above). The window is an illustrative recreation; the label image isn’t shown.",
      image: { src: "/assets/amnh/diode/specimen-AMNH_IZC-00560622-saved.jpg", width: 1400, height: 837, alt: "Saved specimen image AMNH_IZC 00560622: a dragonfly on the grey platform, with its identifier, a color target and a centimeter scale in frame." },
      file: "AMNHIZC00560622_specimen.JPG",
    },
  ],
} as const;
