# Hero interactions — layered avatar add-on

## Where this goes

Unzip the included `hero-interactions` folder inside your existing avatar asset directory:

    handoff/assets/avatar/hero-interactions/

If your avatar source directory is `assets/avatar/`, use that instead. This is an add-on: keep the existing 17 action folders and 85 poses. Do not replace the root avatar manifest with rig.json.

## What is included

- `layers/body.png`: fixed head, torso, hair, supporting hand and upper thighs.
- `layers/leg-viewer-left.png`: separate lower leg and sneaker on the viewer's left.
- `layers/leg-viewer-right.png`: separate lower leg and sneaker on the viewer's right.
- `layers/forearm-matcha.png`: separate sleeve, hand and cup for a small cheers.
- `rig.json`: source dimensions, assembled positions, draw order, joint pivots and seat anchor.
- `hero-rig.js` and `hero-rig.css`: framework-neutral reference assembly and interaction code.
- `preview.html`: open locally to try hover, buttons, keyboard and background switching.
- `motion-preview.gif`: looping demonstration only. Do not use this GIF as the website hero.
- `assembly-preview.jpg`: resting pose and maximum intended rotations.
- `dark-background-check.jpg`: assembled artwork on a warm dark background.
- `GENERATION-PROMPTS.json`: prompts used with the built-in image editor.

The parts are genuine transparent RGBA PNGs. Transparent source padding is intentional. Assemble using the supplied geometry; do not center every PNG independently or automatically trim it.

This layered adaptation puts the cup into a hand on the viewer's right so it can be raised. The face/body use the established illustrated character style. The original flat hero remains available in the existing pose library.

## Quick preview

Open `preview.html` in a browser. Hover over the character to trigger one short foot swing. Hover/tap the cup to trigger one small cheers. Both targets can receive keyboard focus. The buttons alongside the preview trigger the same gestures.

## Instructions for Claude

Port the reference assembly into the app's existing component/motion system. Follow its asset-serving convention; files under handoff/ may need selected copies in public/. The reference script takes an `assetBase` option for the served URL.

Keep the body stationary. Draw both legs behind the body; draw the matcha forearm behind the body but above the legs. The generous overlapping shapes hide the joints during the small permitted rotations. Keep the same relative geometry at every responsive size. Knee pivots and elbow pivot are already in stage coordinates in rig.json.

The source leg images use deliberately different horizontal/vertical display scales in the assembled rig to retain the compact, baggy silhouette. Use those supplied display dimensions rather than the source aspect ratios in isolation.

Use the stable seat anchor [720,970] in the 1300×1600 stage as the starting point for aligning the page's scribble. Check the visible hand/seat against the actual line in the final layout and tune the entire assembly's position, not individual body layers.

### Motion behavior

- Entry: render the resting layers visibly from the first paint. After the page's line reaches the seat, invoke one foot swing. Do not gate visibility on the entry animation or slide the whole figure in.
- Hover/focus: one short foot swing, then settle. No continuous idle loop.
- Cup hover/focus/tap: raise the cup once, hold briefly, then lower it. The supplied movement is intentionally small, not a full shoulder-height toast.
- Repeated inputs: ignore repeats while that gesture is already playing. Do not stack or queue animations.
- Reduced motion: retain the assembled resting pose and working focus targets; do not move the limbs.
- Offscreen: pause/cancel ongoing gestures when the hero leaves view; the starter already cancels when the document becomes hidden.

Stay around 2–2.5 degrees for the legs and at most 9 degrees for the cheers. Larger movements can expose joints or make the cup tip excessively. Keep independent layout and animation wrappers. Preserve the original PNG files.

The vanilla reference mounts dynamically for an easy standalone preview. In the actual React/Next app, render the same resting layer markup with the initial page output so the avatar does not appear late. Attach animation handlers after hydration. Dispose handlers/animations on unmount. Lazy-load unrelated pose assets, but load the hero layers early and reserve the stage dimensions.

## Verification

The transparent layers and assembled resting/maximum-motion poses were inspected. The JavaScript passes a syntax check. A headless browser was unavailable here, so verify the interactive preview in the target browser before integration. The starter is an implementation reference, not a claim that the portfolio itself has been modified or browser-tested.

In the app, check cream/dark backgrounds, knee/sleeve overlaps, the final seat alignment, hover/focus/touch, rapid repeated activation, reduced motion, and desktop/mobile resizing. Do not use the opaque JPEG contact sheets as site assets. No dark-mode implementation is included in this asset pack.
