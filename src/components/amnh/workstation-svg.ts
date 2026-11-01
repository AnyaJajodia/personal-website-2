import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The tinted workstation SVG, read at build time and inlined so it keeps its
 * own vector structure: its colour tokens follow the site's theme
 * (<html data-theme>), its paper takes the ground it sits on (--plate), and
 * its parts (data-part) can be lit from the notes.
 *
 * Its classes are namespaced (.rig → .dw-rig, .panel → .dw-panel, …) so its
 * stylesheet and the site's can't reach each other, and its fixed size and
 * own label are dropped: the figure around it sizes and names it.
 */
let cached: string | null = null;

export function workstationSvg(): string {
  if (cached) return cached;
  // a literal path, so the build traces this one file only
  const raw = readFileSync(join(process.cwd(), "public", "assets", "amnh", "diode", "workstation-tinted.svg"), "utf8");
  cached = raw
    // every class in the drawing gets a dw- prefix (its own .panel, .card,
    // .screen… would otherwise meet the site's classes of the same names);
    // the root becomes .dw-rig
    .replace(/<style>[\s\S]*?<\/style>/, (css) => css.replace(/\.([a-z][a-z0-9]*)\b/g, (_, c: string) => (c === "rig" ? ".dw-rig" : `.dw-${c}`)))
    .replace(/class="([^"]*)"/g, (_, list: string) => {
      const names = list.trim().split(/\s+/).filter(Boolean);
      return `class="${names.map((c) => (c === "rig" ? "dw-rig" : `dw-${c}`)).join(" ")}"`;
    })
    .replace(/class="dw-rig"/, 'class="dw-rig" aria-hidden="true" focusable="false"')
    .replace(/\swidth="\d+"\sheight="\d+"/, "")
    .replace(/\srole="img"\saria-label="[^"]*"/, "");
  return cached;
}
