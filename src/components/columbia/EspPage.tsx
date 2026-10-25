import Avatar from "@/components/Avatar";
import { esp, espSections } from "@/content/columbia";
import { ColumbiaShell, Hero, Section, Prose } from "./ColumbiaParts";

/**
 * Emerging Scholars Program — the progression first (student → teaching
 * assistant → teaching, with the real semesters), then the course itself, one
 * small activity example, the program's own offerings set apart, and the
 * reflection. Short by design.
 */
export default function EspPage() {
  const e = esp;
  const w = e.weekly;
  return (
    <ColumbiaShell
      slug={e.slug}
      sections={espSections}
      hero={<Hero name={e.name} dates={e.facts[1].value} title={e.title} subtitle={e.subtitle} facts={e.facts} />}
    >
      <Section id={e.path.id} heading={e.path.heading} className="cu-path">
        <ol className="cu-stages">
          {e.path.stages.map((s, i) => (
            <li key={s.semester} className="cu-stage" data-final={i === e.path.stages.length - 1 ? "true" : undefined}>
              <p className="cu-stage__when">
                <span className="cu-stage__n" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="cu-stage__semester">{s.semester}</span>
                <span className="cu-stage__role">{s.role}</span>
              </p>
              <h3 className="cu-h3">
                <span className="visually-hidden">{s.semester} · </span>
                {s.verb}
              </h3>
              <Prose paragraphs={s.paragraphs} />
            </li>
          ))}
        </ol>
      </Section>

      <Section id={e.what.id} heading={e.what.heading}>
        <p className="cu-lead">{e.what.paragraphs[0]}</p>
        <Prose paragraphs={e.what.paragraphs.slice(1)} />
      </Section>

      <Section id={w.id} heading={w.heading} className="cu-weekly">
        <div className="cu-weekly__grid">
          <div>
            <Prose paragraphs={[w.sessions]} />
            {/* the one activity example */}
            <aside className="cu-example" aria-label="An activity example">
              <p className="cu-example__k">In a session · {w.example.area}</p>
              <div className="cu-example__body">
                <svg className="cu-example__bar" viewBox="0 0 64 40" aria-hidden="true" focusable="false">
                  {Array.from({ length: 4 }, (_, r) =>
                    Array.from({ length: 6 }, (_, c) => <rect key={`${r}-${c}`} x={2 + c * 10} y={2 + r * 9} width="9" height="8" rx="1.5" />),
                  )}
                </svg>
                <p>{w.example.text}</p>
              </div>
            </aside>
            <Prose paragraphs={[w.design, w.after]} />
          </div>
          <Avatar pose="raisedFinger" role="cu-explain" />
        </div>
        {/* the program's own offerings, kept apart from my teaching */}
        <div className="cu-program">
          <p className="cu-program__k">Across the program</p>
          <p className="cu-program__text">{w.program}</p>
        </div>
      </Section>

      <Section id={e.values.id} heading={e.values.heading} className="cu-values">
        <p className="cu-lead">{e.values.paragraphs[0]}</p>
        <Prose paragraphs={e.values.paragraphs.slice(1)} />
      </Section>
    </ColumbiaShell>
  );
}
