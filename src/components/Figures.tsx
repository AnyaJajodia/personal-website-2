import type { Figure } from "@/content/work";
import { LynxsterMark } from "./Logo";

export function WorkFigure({ figure, startAt = 1 }: { figure: Figure; startAt?: number }) {
  if (figure.kind === "flow") {
    const compact = figure.steps.every((s) => !s.note);
    return (
      <figure className={`flow${compact ? " flow--compact" : ""}`}>
        <ol className="flow__steps" style={{ ["--steps" as string]: figure.steps.length }}>
          {figure.steps.map((s, i) => (
            <li key={s.title} className="flow__step">
              <span className="label flow__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="flow__title">{s.title}</span>
              {s.note ? <span className="flow__note">{s.note}</span> : null}
            </li>
          ))}
        </ol>
        <figcaption className="caption">{figure.caption}</figcaption>
      </figure>
    );
  }
  return (
    <figure className={`plates plates--${figure.plates.length}`}>
      <div className="plates__grid">
        {figure.plates.map((p, i) => (
          <div key={p.caption} className="plate">
            <div
              className={`plate__frame plate__frame--${p.pattern}`}
              role="img"
              aria-label={`Placeholder for an original photograph: ${p.caption}`}
            >
              <span className="plate__placeholder">Original photograph to come</span>
            </div>
            <p className="caption plate__caption">
              <span className="label">Plate {startAt + i}</span> {p.caption}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="visually-hidden">{figure.note}</figcaption>
    </figure>
  );
}

/** Lynxster: screenshot space straddling the dark opening and the light case study. */
export function ScreenshotFrame() {
  return (
    <div className="lx-shot">
      <div className="container">
        <figure className="lx-shot__figure">
          <div
            className="lx-shot__screen"
            role="img"
            aria-label="Placeholder for a selected Lynxster application screenshot"
          >
            <LynxsterMark className="lx-shot__mark" />
            <span className="lx-shot__text">Application screenshot</span>
            <span className="label lx-shot__sub">To be selected</span>
          </div>
          <figcaption className="caption">The Lynxster application. A selected, cropped screenshot will appear here.</figcaption>
        </figure>
      </div>
    </div>
  );
}
