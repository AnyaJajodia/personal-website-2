# One continuous scribble
Approved storyboard: storyboard.png. Concept poses, not pixel-exact geometry.
The user specifically requires the same line moving around the screen to become the career trajectory in About. Do not create an unrelated timeline illustration.
## Homepage poses
1. Hero: small loose flourish by the name in negative space.
2. Approaching About: extension curls into a knot.
3. About: knot spreads horizontally into five career labels; some loops remain and revisit earlier positions.
4. Leaving About: trajectory releases and line resumes down the page.
5. Current/selected work: line frames a heading or image briefly, then follows the margin. Avoid text and controls.
6. Contact: quiet loose finishing flourish.
Scroll forward unfolds/morphs; reverse scroll reverses; no scrolling means no animation. No endless idle loop or cursor-following effect. No scroll hijacking, mandatory pauses, or artificial extra scroll distance.
## Implementation latitude
Use SVG with equivalent control-point topology for morph poses or another lightweight continuous-line method. Dots decides path interpolation and responsive coordinates. Do not assume stroke-dashoffset alone creates shape morphing. Use section-relative normalized scroll progress and document-position calculations; recalculate after font/image/layout changes. Keep one logical line even if implementation needs segments to maintain continuity.
The thin line may be on a fixed viewport overlay and take document content positions into account. pointer-events:none; no obstruction of focus or hit targets. Readable DOM timeline labels independent of decorative SVG.
Detail pages: same motif, quieter section-linked motion; Lynxster cyan, AMNH muted blue with optional wing-like flourish, other pages blue. No need for a complicated cross-route morph; a short consistent transition is sufficient.
Mobile: narrower motion region, vertical About trajectory; no horizontal page overflow. Reduced motion: show a static final composition and all labels, disable smooth scrolling and morphing. Content remains usable with JS unavailable.
