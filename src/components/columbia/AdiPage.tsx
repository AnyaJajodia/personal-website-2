import { adi } from "@/content/columbia";
import { ColumbiaShell, Hero, Section, Prose } from "./ColumbiaParts";

/**
 * Application Development Initiative — individual peer mentorship, short by
 * design: what ADI is (with the two cohorts as six anonymous marks), the three
 * kinds of guidance, and the contact that continued past a semester — the
 * spring cohort's thread runs on through the fall.
 */
export default function AdiPage() {
  const a = adi;
  return (
    <ColumbiaShell
      slug={a.slug}
      hero={<Hero name={a.name} dates={a.facts[1].value} title={a.title} subtitle={a.subtitle} facts={a.facts} adi />}
      sections={[a.what, a.themes, a.beyond].map((x) => ({ id: x.id, label: x.heading }))}
    >
      <Section id={a.what.id} heading={a.what.heading} className="cu-what">
        <p className="cu-lead">{a.what.paragraphs[0]}</p>
        <div className="cu-what__grid">
          <Prose paragraphs={a.what.paragraphs.slice(1)} />
          {/* six anonymous mentees across two cohorts; the spring thread continues into the fall */}
          <ul className="cu-cohorts" aria-label="Two cohorts, three mentees each">
            {a.what.cohorts.map((c, i) => (
              <li key={c.name} className="cu-cohorts__row" data-cohort={i === 0 ? "earlier" : "later"}>
                <span className="cu-cohorts__name">{c.name}</span>
                <span className="cu-cohorts__dots" aria-hidden="true">
                  {Array.from({ length: c.mentees }, (_, j) => (
                    <span key={j} />
                  ))}
                </span>
                <span className="visually-hidden">{c.mentees} mentees</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id={a.themes.id} heading={a.themes.heading} className="cu-themes">
        <ul className="cu-themes__list">
          {a.themes.items.map((t) => (
            <li key={t.heading} className="cu-theme">
              <h3 className="cu-h3">{t.heading}</h3>
              <p className="cu-theme__text">{t.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id={a.beyond.id} heading={a.beyond.heading} className="cu-beyond">
        <p className="cu-lead">{a.beyond.paragraphs[0]}</p>
        <p className="cu-pull">{a.beyond.paragraphs[1]}</p>
      </Section>
    </ColumbiaShell>
  );
}
