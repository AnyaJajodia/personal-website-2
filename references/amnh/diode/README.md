# DIODE workstation — source material (not served)

Supplied 31 Oct 2026 (from ~/Downloads/diode-workstation-assets). Production copies live in
`public/assets/amnh/diode/`; the page's annotation data is `src/content/amnh-diode-art.ts`.

- `diode-workstation-prototype.html` — the standalone prototype (toolbar, layout/theme switches). The site
  adapts its laptop views and annotations; nothing is embedded from it. Its four embedded images were
  extracted to `public/assets/amnh/diode/` (camera preview, saved specimen image, BugBase icon) or were
  duplicates of files here (the specimen cutout).
- `diode-annotation-anchors.json` — the supplied anchors (starting point). Verified against the artwork:
  camera moved onto the body; tray label/identifier/specimen points corrected; motorized stage added.
- `diode-imaging-station-ink.svg` and the PNG renders (ink/tinted, light/dark) — alternatives; the site
  inlines `workstation-tinted.svg`, which carries its own light/dark tokens.
- `diode-bugbase-control.png` — a render of the CameraControl window; the site rebuilds it in HTML.
- `diode-specimen-AMNH_IZC-00560655-cutout.png`, `diode-tray-position-recreation.png` — already embedded
  in `tray-position-reconstruction.svg`.
