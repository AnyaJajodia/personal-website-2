import { readFileSync } from "node:fs";

/**
 * An illustration's SVG, read at build time and inlined so it keeps its own
 * vector structure: its colour tokens follow the site's theme
 * (<html data-theme>), its paper takes the ground it sits on (--plate), and
 * its parts (data-part) can be styled from the page.
 *
 * Each drawing is namespaced with its own prefix (.rig → .dw-rig, .panel →
 * .dw-panel, …), since several share class names (the AMNH ones share one
 * stylesheet, the .rig family): two on one page can't reach each other, nor
 * the site's classes of the same names. Their fixed size and own label are dropped: the figure
 * around each one sizes and names it.
 */
export function namespacedSvg(file: string, prefix: string): string {
  const raw = readFileSync(file, "utf8");
  const ns = (c: string) => `${prefix}-${c}`;
  return raw
    .replace(/<style>[\s\S]*?<\/style>/, (css) => css.replace(/\.([a-z][a-z0-9]*)\b/g, (_, c: string) => `.${ns(c)}`))
    .replace(/class="([^"]*)"/g, (_, list: string) => `class="${list.trim().split(/\s+/).filter(Boolean).map(ns).join(" ")}"`)
    .replace(/<svg /, '<svg aria-hidden="true" focusable="false" ')
    .replace(/\swidth="\d+"\sheight="\d+"/, "")
    .replace(/\srole="img"(\saria-label="[^"]*")?/, "");
}
