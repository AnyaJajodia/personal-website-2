import Avatar from "@/components/Avatar";
import { esp } from "@/content/columbia";
import { ColumbiaShell, Hero, Section, Prose } from "./ColumbiaParts";

/**
 * Emerging Scholars Program — short by design: what ESP is, then the
 * progression that carries the page (student → teaching assistant → teaching,
 * on one thread with the real semesters), one session with its single
 * activity example, the program's own offerings set apart, and the reflection.
 */
export default function EspPage() {
  const e = esp;
  const s = e.session;
  return (
    <ColumbiaShell
      slug={e.slug}
      hero={<Hero name={e.name} dates={e.facts[1].value} title={e.title} subtitle={e.subtitle} facts={e.facts} />}
      sections={[e.what, e.path, s, e.values].map((x) => ({ id: x.id, label: x.heading }))}
    >
      <Section id={e.what.id} heading={e.what.heading}>
        <p className="cu-lead">{e.what.paragraphs[0]}</p>
        <Prose paragraphs={e.what.paragraphs.slice(1)} />
      </Section>

      <Section id={e.path.id} heading={e.path.heading} className="cu-path">
        <ol className="cu-stages">
          {e.path.stages.map((st, i) => (
            <li key={st.semester} className="cu-stage" data-final={i === e.path.stages.length - 1 ? "true" : undefined}>
              <span className="cu-stage__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="cu-stage__h">
                <span className="cu-stage__semester">{st.semester}</span>
                <span className="visually-hidden"> · </span>
                <span className="cu-stage__role">{st.role}</span>
              </h3>
              <p className="cu-stage__text">{st.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id={s.id} heading={s.heading} className="cu-session">
        <div className="cu-session__grid">
          <div>
            <Prose paragraphs={[s.intro]} />
            {/* the one activity example, from the same paragraph */}
            <p className="cu-example">
              <svg className="cu-example__bar" viewBox="0 0 64 40" aria-hidden="true" focusable="false">
                {Array.from({ length: 4 }, (_, r) =>
                  Array.from({ length: 6 }, (_, c) => <rect key={`${r}-${c}`} x={2 + c * 10} y={2 + r * 9} width="9" height="8" rx="1.5" />),
                )}
              </svg>
              <span>{s.example}</span>
            </p>
            <Prose paragraphs={[s.after]} />
          </div>
          <Avatar pose="raisedFinger" role="cu-explain" />
        </div>
        {/* the program's own offerings, kept apart from my teaching */}
        <p className="cu-program">{s.program}</p>
      </Section>

      <Section id={e.values.id} heading={e.values.heading} className="cu-values">
        <p className="cu-lead">{e.values.paragraphs[0]}</p>
        <Prose paragraphs={e.values.paragraphs.slice(1)} />
      </Section>
    </ColumbiaShell>
  );
}
