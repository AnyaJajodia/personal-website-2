import { AMNH_ROUTES, behavioral as b } from "@/content/amnh";
import { AmnhShell, Facts, Hero, Pager } from "./AmnhParts";
import { EnclosuresFigure } from "./Enclosures";
import { withGenus } from "./genus";

/**
 * AMNH · Chaeteessa · Behavioral research — a short, finished page about
 * ongoing work: who and where (the facts as a specimen label, an Ongoing
 * status), then three brief sections on the ruled column the other AMNH
 * pages use — the study (with the page's one illustration, a row of
 * enclosures, captioned as illustrative), my contribution, and where it
 * stands. No results, counts or protocols
 * (handoff/content/work/amnh-behavioral-research.md).
 */
export default function BehavioralPage() {
  return (
    <AmnhShell
      drawer="amnh/behavioral-research"
      className="am-research"
      pager={<Pager slug="amnh/behavioral-research" sibling={{ href: AMNH_ROUTES.diode, title: "DIODE · Collections digitization" }} />}
    >
      <Hero
        crumbs={[{ href: "/#now", label: "Work" }, { href: AMNH_ROUTES.overview, label: "AMNH" }, { label: "Chaeteessa" }]}
        title={withGenus(b.title)}
        subtitle={b.lead}
        className="am-research__hero"
        aside={<Facts facts={b.facts} />}
      >
        <p className="am-research__status">
          <span className="lx-status-pill am-status">
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <circle cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="2.6" />
            </svg>
            <span className="visually-hidden">Status: </span>
            {b.status}
          </span>
        </p>
      </Hero>

      {b.sections.map((s, i) => (
        <section key={s.id} className="container am-intro am-research__section" aria-labelledby={s.id}>
          <h2 className="am-h2" id={s.id}>
            {s.heading}
          </h2>
          <div className="am-intro__body">
            {s.paragraphs.map((t) => (
              <p key={t} className={i === 0 ? "am-lead" : undefined}>
                {withGenus(t)}
              </p>
            ))}
          </div>
          {i === 0 ? <EnclosuresFigure /> : null}
        </section>
      ))}
    </AmnhShell>
  );
}
