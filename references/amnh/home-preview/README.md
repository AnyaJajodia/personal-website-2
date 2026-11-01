# AMNH homepage preview — source material (not served)

Supplied 1 Nov 2026 (from ~/Downloads). The chosen artwork for the homepage's AMNH preview, isolated in
light and dark versions.

- `amnh-two-color-cards-reference.html` — the study (comparison page, not embedded). The site adapts its
  SVG and motion in `src/components/amnh/AmnhCards.tsx` + `amnh-cards.css`:
  - colours come from the AMNH tokens (`--amnh-blue`, `--amnh-lime`, `--amnh-accent`): blue leads by day,
    lime by night; the caption, thread and glow follow the leading colour;
  - the art is laid out like `LynxsterFloat` (focal size, caption line, 6s breath), strokes are
    non-scaling and sized to the plate;
  - the hover separation is about half the study's, and the thread is longer so it shows past both cards;
  - the research page's sketch is abstract (a trace and a tally) rather than an animal.
- The DIODE workstation drawing stays on `/work/amnh` and `/work/amnh/diode`.
