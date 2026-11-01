import { workstation } from "@/content/amnh-diode-art";
import AnnotatedArt from "./AnnotatedArt";
import { workstationSvg } from "./workstation-svg";

/** the artwork's width / height (its viewBox) */
const RATIO = 1357.9 / 775.9;

function Art({ className = "" }: { className?: string }) {
  return <div className={`dw-ws ${className}`.trim()} dangerouslySetInnerHTML={{ __html: workstationSvg() }} />;
}

/**
 * The DIODE imaging workstation, the page's principal illustration: the
 * tinted drawing (about two-thirds of the width) with a numbered point on
 * each of its six parts, and the numbered key beside it.
 */
export function WorkstationFigure() {
  return (
    <AnnotatedArt
      id="dw-ws"
      className="dw-art--ws"
      notes={workstation.notes}
      art={<Art />}
      label={workstation.alt}
      ratio={RATIO}
      caption={
        <>
          <span className="dw-caption__label">The imaging workstation.</span> {workstation.caption}
        </>
      }
    />
  );
}

/** the same drawing without notes: the homepage preview and the overview's DIODE entry */
export function WorkstationThumb({ className = "" }: { className?: string }) {
  return <Art className={`dw-thumb ${className}`.trim()} />;
}
