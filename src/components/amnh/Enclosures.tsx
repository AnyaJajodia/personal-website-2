import { join } from "node:path";
import { behavioral } from "@/content/amnh";
import { namespacedSvg } from "@/lib/inline-svg";

/**
 * The behavioral research's drawings (public/assets/amnh/behavioral/): a
 * transparent enclosure with a twig, a few leaves and a stylized mantis,
 * drawn in the DIODE workstation's line and palette. Classes namespaced to
 * ch- (lib/inline-svg.ts), so they can sit beside the workstation's dw- drawing.
 */
const dir = () => join(process.cwd(), "public", "assets", "amnh", "behavioral");
let lid: string | null = null;
let row: string | null = null;

/** the enclosure with its lid open, drawn small: the overview's entry */
export function EnclosureThumb() {
  // drawn from its bottom-left corner: it starts on the title's edge and
  // stands on the same floor as the workstation beside it
  lid ??= namespacedSvg(join(dir(), "enclosure-lid-open.svg"), "ch").replace("<svg ", '<svg preserveAspectRatio="xMinYMax meet" ');
  return <div className="ch-art ch-thumb" dangerouslySetInnerHTML={{ __html: lid }} />;
}

/** three closed enclosures in a row: the research page's one illustration */
export function EnclosuresFigure() {
  row ??= namespacedSvg(join(dir(), "enclosures-row.svg"), "ch");
  return (
    <figure className="am-research__fig">
      <div className="ch-art ch-row" role="img" aria-label={behavioral.art.alt} dangerouslySetInnerHTML={{ __html: row }} />
      <figcaption className="dw-caption">{behavioral.art.caption}</figcaption>
    </figure>
  );
}
