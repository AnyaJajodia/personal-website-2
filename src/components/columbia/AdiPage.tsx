import { adi, adiSections } from "@/content/columbia";
import { ColumbiaShell, Hero, Section, Prose } from "./ColumbiaParts";

/**
 * Application Development Initiative — the individual mentorship program:
 * how matching worked and the two cohorts (three different mentees each, kept
 * anonymous), then what the conversations covered as an editorial index, the
 * continuity beyond a semester, and the reflection. Short by design.
 */
export default function AdiPage() {
  const a = adi;
  const total = a.how.cohorts.reduce((n, c) => n + c.mentees, 0);
  return (
    <ColumbiaShell
      slug={a.slug}
      sections={adiSections}
      hero={<Hero name={a.name} dates={a.facts[1].value} title={a.title} subtitle={a.subtitle} facts={a.facts} adi />}
    >
      <Section id={a.what.id} heading={a.what.heading}>
        <p className="cu-lead">{a.what.paragraphs[0]}</p>
        <Prose paragraphs={a.what.paragraphs.slice(1)} />
      </Section>

      <Section id={a.how.id} heading={a.how.heading} className="cu-how">
        <div className="cu-how__grid">
          <Prose paragraphs={a.how.paragraphs} />
          <figure className="cu-cohorts" aria-labelledby="cu-cohorts-cap">
            <ol className="cu-match" aria-label="How matching worked">
              {a.how.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <ul className="cu-cohorts__list">
              {a.how.cohorts.map((c) => (
                <li key={c.name}>
                  <span className="cu-cohorts__name">{c.name}</span>
                  <span className="cu-cohorts__dots" aria-hidden="true">
                    {Array.from({ length: c.mentees }, (_, i) => (
                      <span key={i} />
                    ))}
                  </span>
                  <span className="cu-cohorts__n">
                    {c.mentees} mentees
                  </span>
                </li>
              ))}
            </ul>
            <figcaption id="cu-cohorts-cap" className="cu-caption">
              Two cohorts, three different mentees each: {total === 6 ? "six" : total} in all, kept anonymous.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id={a.themes.id} heading={a.themes.heading} className="cu-themes">
        <ol className="cu-themes__list">
          {a.themes.items.map((t, i) => (
            <li key={t.heading} className="cu-theme">
              <span className="cu-theme__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cu-h3">{t.heading}</h3>
              <p className="cu-theme__text">{t.text}</p>
            </li>
          ))}
        </ol>
        <p className="cu-pull">{a.themes.close}</p>
      </Section>

      <Section id={a.beyond.id} heading={a.beyond.heading} className="cu-beyond">
        <p className="cu-lead">{a.beyond.paragraphs[0]}</p>
        <Prose paragraphs={a.beyond.paragraphs.slice(1)} />
      </Section>

      <Section id={a.values.id} heading={a.values.heading} className="cu-values">
        <p className="cu-lead">{a.values.paragraphs[0]}</p>
        <Prose paragraphs={a.values.paragraphs.slice(1)} />
      </Section>
    </ColumbiaShell>
  );
}
