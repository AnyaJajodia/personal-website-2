import { join } from "node:path";
import { namespacedSvg } from "@/lib/inline-svg";

/**
 * The tinted workstation SVG, inlined with its classes namespaced to dw-
 * (.rig → .dw-rig, .panel → .dw-panel, …); see lib/inline-svg.ts.
 */
let cached: string | null = null;

export function workstationSvg(): string {
  // a literal path, so the build traces this one file only
  cached ??= namespacedSvg(join(process.cwd(), "public", "assets", "amnh", "diode", "workstation-tinted.svg"), "dw");
  return cached;
}
