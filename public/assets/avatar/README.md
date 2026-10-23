# Anya avatar library — 85 poses

## Install
Unzip this pack at the root of the working repository. It contains assets/avatar/ with 17 action folders, five transparent PNGs per action. If assets/avatar/ already exists, merge the folders. Do not delete the existing assets directory.

If the framework serves static files from public/, move the included avatar folder into public/assets/avatar/ instead, following the repository’s existing convention. Paths in manifest.json are relative to the avatar folder.

## Contents
01 typing; 02 matcha; 03 thinking; 04 walking; 05 idea; 06 untangling; 07 reading; 08 photography; 09 peeking; 10 waving; 11 break; 12 sleeping; 13 fieldwork; 14 digitization; 15 map; 16 airplane; 17 painting.

Each action folder contains five transparent RGBA PNGs. manifest.json lists all 85 pose IDs, filenames and dimensions. Open index.html locally for the full visual browser. previews/ contains opaque contact sheets for reference only. GENERATION-PROMPTS.json records the ten newly completed airplane/painting cutout prompts; other cutouts were recovered from the preceding generation pass.

## Visual rules for Claude
Use this as an option library, not a requirement to show every avatar. Select a small number of contextually relevant poses and keep those choices stable. Preserve the approved compact F5 character, face, espresso hair and scribble style. Every avatar has either prescription specs or sunglasses, never both. Fieldwork and digitization use prescription glasses. Preserve white wired earbuds where drawn; no earrings.

PNG alpha includes the spaces around and between scribble loops. Intentional action props remain: laptops, cups, furniture, books, cameras, easels, airplane seats/window fragments, and small ground patches under fieldwork figures. Do not give these PNGs an opaque background or card merely to conceal their edges.

## Motion
Stills support subtle whole-image translation, slight rotation, entrance transitions, peeking and restrained scroll-linked movement. Actual blinking, moving fingers, sipping or a walking cycle requires additional frames or a layered rig. Do not distort the whole figure to imitate limb animation. Use existing CSS or motion tooling, respect prefers-reduced-motion, avoid constant movement on all figures, reserve dimensions to prevent layout shifts and lazy-load below-fold assets. Decorative avatars should have empty alt text. Check mobile layouts for overlap.
