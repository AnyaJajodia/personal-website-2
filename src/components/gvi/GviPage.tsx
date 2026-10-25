import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage from "@/components/OnThisPage";
import PhotoSlot from "./PhotoSlot";
import ThemeLogo from "@/components/ThemeLogo";
import { gvi, gviChapters, gviSections } from "@/content/gvi";
import { gviPhotos } from "@/content/gvi-photos";
import { getNeighbours } from "@/content/work";
import "../case/case.css";
import "./gvi.css";

/**
 * GVI · South Africa — a field journal in the portfolio's own paper, serif and
 * thread. Bushveld colours (proposed accents, not GVI's brand) only mark,
 * annotate and occasionally tint a surface. The story moves through four
 * parts — fieldwork, data, practical and community work, what followed — and
 * opens and closes on the turn it took: where technology and conservation
 * could meet. Three photographs are still to come; their places are held
 * quietly (content/gvi-photos.ts). No maps, tracking data or stock imagery.
 */

function Chapter({ c }: { c: { n: string; label: string } }) {
  return (
    <p className="gvi-chapter">
      <span className="gvi-chapter__n" aria-hidden="true">
        {c.n}
      </span>
      <span className="gvi-chapter__label">{c.label}</span>
    </p>
  );
}

/** a field-note list: the things a paragraph names, written up as a log */
function Log({ title, items, className = "" }: { title: string; items: string[]; className?: string }) {
  return (
    <div className={`gvi-log ${className}`.trim()}>
      <p className="gvi-log__title">{title}</p>
      <ul className="gvi-log__list">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default function GviPage() {
  const { prev, next } = getNeighbours("gvi-conservation");
  const g = gvi;
  const period = g.meta.find((m) => m.label === "Period")!;
  const facts = g.meta.filter((m) => m.label !== "Period");

  return (
    <div className="detail theme-default theme-gvi" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="gvi-conservation" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero gvi-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{g.name}</span>
            </nav>
            <div className="gvi-hero__main">
              <p className="gvi-hero__dates">
                <span className="visually-hidden">{period.label}: </span>
                {period.value}
              </p>
              {/* dark-lettered in Light, the supplied white artwork in Dark — same canvas, same place, no tile */}
              <div className="gvi-logo">
                <ThemeLogo className="gvi-logo__mark" light="/logos/gvi.webp" dark="/logos/gvi-white.png" width={300} height={237} label="GVI" />
              </div>
              <h1 className="detail-hero__title gvi-hero__title">
                <span data-line="title">{g.title}</span>
              </h1>
              <p className="detail-hero__subtitle gvi-hero__subtitle">{g.subtitle}</p>
            </div>
            <dl className="gvi-facts">
              {facts.map((m) => (
                <div key={m.label} className="gvi-facts__item">
                  <dt className="label">{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* the opening photograph, the width of the page */}
          <div className="container">
            <PhotoSlot photo={gviPhotos.opening} className="gvi-photo--opening" priority />
          </div>
        </header>

        <div className="container case-layout">
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={gviSections} />
            </div>
          </div>

          <div className="case-content">
            {/* the turn, first: where the threads started meeting */}
            <section className="gvi-section gvi-threads" id={g.threads.id} aria-labelledby={`${g.threads.id}-title`}>
              <h2 className="gvi-h2" id={`${g.threads.id}-title`}>
                {g.threads.heading}
              </h2>
              <p className="gvi-lead">{g.threads.paragraphs[0]}</p>
              <div className="gvi-prose">
                {g.threads.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="gvi-turn">{g.threads.turn}</p>
            </section>

            <section className="gvi-section gvi-placement" id={g.placement.id} aria-labelledby={`${g.placement.id}-title`}>
              <h2 className="gvi-h2" id={`${g.placement.id}-title`}>
                {g.placement.heading}
              </h2>
              <div className="gvi-placement__grid">
                <div className="gvi-prose">
                  {g.placement.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {/* a field-note heading for the journal, from the copy above */}
                <dl className="gvi-entry" aria-label="Placement">
                  <div>
                    <dt>Program</dt>
                    <dd>GVI wildlife research</dd>
                  </div>
                  <div>
                    <dt>Reserve</dt>
                    <dd>Karongwe Private Game Reserve</dd>
                  </div>
                  <div>
                    <dt>Province</dt>
                    <dd>Limpopo, South Africa</dd>
                  </div>
                  <div>
                    <dt>When</dt>
                    <dd>Summer 2024 · Four-week program</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* I · fieldwork */}
            <Chapter c={gviChapters.field} />
            <section className="gvi-section gvi-section--first gvi-field" id={g.field.id} aria-labelledby={`${g.field.id}-title`}>
              <div className="gvi-field__grid">
                <div className="gvi-field__text">
                  <h2 className="gvi-h2" id={`${g.field.id}-title`}>
                    {g.field.heading}
                  </h2>
                  <h3 className="gvi-h3">{g.field.subheading}</h3>
                  <div className="gvi-prose">
                    {g.field.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                <PhotoSlot photo={gviPhotos.fieldwork} className="gvi-photo--field" />
              </div>
              <div className="gvi-field__logs">
                <Log title="Surveys" items={g.field.surveys} />
                <Log title="Beyond a single sighting" items={g.field.methods} />
                {/* watching, with binoculars: on the rule, beside the log, never over a photograph */}
                <Avatar pose="binoculars" role="gvi-watch" />
              </div>
            </section>

            <section className="gvi-section gvi-decisions" id={g.decisions.id} aria-labelledby={`${g.decisions.id}-title`}>
              <h2 className="gvi-h2" id={`${g.decisions.id}-title`}>
                {g.decisions.heading}
              </h2>
              <p className="gvi-lead">{g.decisions.paragraphs[0]}</p>
              <div className="gvi-observed">
                <div className="gvi-observed__entry">
                  <p className="gvi-observed__k">Observed</p>
                  <div className="gvi-prose">
                    <p>{g.decisions.paragraphs[1]}</p>
                    <p>{g.decisions.paragraphs[2]}</p>
                  </div>
                </div>
                <div className="gvi-observed__entry">
                  <p className="gvi-observed__k">Attended</p>
                  <div className="gvi-prose">
                    <p>{g.decisions.paragraphs[3]}</p>
                  </div>
                </div>
              </div>
              <p className="gvi-pull">{g.decisions.paragraphs[4]}</p>
            </section>

            {/* II · data */}
            <Chapter c={gviChapters.data} />
            <section className="gvi-section gvi-section--first gvi-data" id={g.data.id} aria-labelledby={`${g.data.id}-title`}>
              <h2 className="gvi-h2" id={`${g.data.id}-title`}>
                {g.data.heading}
              </h2>
              <h3 className="gvi-h3">{g.data.subheading}</h3>
              <div className="gvi-data__grid">
                <div className="gvi-prose">
                  {g.data.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <Log title="Formats" items={g.data.formats} className="gvi-log--formats" />
              </div>
            </section>

            <section className="gvi-section gvi-ai" id={g.ai.id} aria-labelledby={`${g.ai.id}-title`}>
              <h2 className="gvi-h2" id={`${g.ai.id}-title`}>
                {g.ai.heading}
              </h2>
              <p className="gvi-lead">{g.ai.paragraphs[0]}</p>
              <div className="gvi-prose">
                <p>{g.ai.paragraphs[1]}</p>
                <p>{g.ai.paragraphs[2]}</p>
              </div>
              <Log title="Questions beyond a demonstration" items={g.ai.questions} className="gvi-log--questions" />
              {/* the later ideas, kept apart from the internship's model work */}
              <div className="gvi-after">
                <p className="gvi-after__k">After the internship</p>
                <p className="gvi-after__text">{g.ai.after}</p>
              </div>
            </section>

            {/* III · practical and community work */}
            <Chapter c={gviChapters.practical} />
            <section className="gvi-section gvi-section--first gvi-roads" id={g.roads.id} aria-labelledby={`${g.roads.id}-title`}>
              <h2 className="gvi-h2" id={`${g.roads.id}-title`}>
                {g.roads.heading}
              </h2>
              <p className="gvi-lead">{g.roads.paragraphs[0]}</p>
              <div className="gvi-prose">
                {g.roads.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            <section className="gvi-section gvi-beyond" id={g.beyond.id} aria-labelledby={`${g.beyond.id}-title`}>
              <h2 className="gvi-h2" id={`${g.beyond.id}-title`}>
                {g.beyond.heading}
              </h2>
              <div className="gvi-beyond__teach">
                <div>
                  <h3 className="gvi-h3">{g.beyond.teaching.heading}</h3>
                  <div className="gvi-prose">
                    {g.beyond.teaching.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                <PhotoSlot photo={gviPhotos.teaching} className="gvi-photo--teach" />
              </div>
              <div className="gvi-run" id={g.beyond.antiPoaching.id}>
                <h3 className="gvi-h3">{g.beyond.antiPoaching.heading}</h3>
                <div className="gvi-prose">
                  {g.beyond.antiPoaching.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </section>

            {/* IV · what followed */}
            <Chapter c={gviChapters.followed} />
            <section className="gvi-section gvi-section--first gvi-training" id={g.training.id} aria-labelledby={`${g.training.id}-title`}>
              <h2 className="gvi-h2" id={`${g.training.id}-title`}>
                {g.training.heading}
              </h2>
              <div className="gvi-cert">
                <p className="gvi-cert__lead">{g.training.lead}</p>
                <ul className="gvi-cert__list">
                  {g.training.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* the close: open, on the page — a small label, the turn in green, the rest as prose */}
            <section className="gvi-section gvi-stayed" id={g.stayed.id} aria-labelledby={`${g.stayed.id}-title`}>
              <h2 className="gvi-stayed__label" id={`${g.stayed.id}-title`}>
                {g.stayed.heading}
              </h2>
              <p className="gvi-stayed__quote">{g.stayed.paragraphs[0]}</p>
              <div className="gvi-prose">
                {g.stayed.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          </div>
        </div>

        <nav className="container pager" aria-label="More work" data-line="end">
          <Link href="/#work" className="pager__back label">
            <span aria-hidden="true">←</span> Back to work
          </Link>
          <div className="pager__grid">
            {prev ? (
              <Link href={`/work/${prev.slug}`} className="pager__link pager__link--prev">
                <span className="label">
                  <span aria-hidden="true">← </span>Previous
                </span>
                <span className="pager__title">{prev.name}</span>
              </Link>
            ) : null}
            {next ? (
              <Link href={`/work/${next.slug}`} className="pager__link pager__link--next">
                <span className="label">
                  Next<span aria-hidden="true"> →</span>
                </span>
                <span className="pager__title">{next.name}</span>
              </Link>
            ) : null}
          </div>
        </nav>
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
