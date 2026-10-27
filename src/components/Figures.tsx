import type { Figure } from "@/content/work";

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
