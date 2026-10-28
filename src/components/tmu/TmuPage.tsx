import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage from "@/components/OnThisPage";
import Walkthrough from "./Walkthrough";
import { tmu, tmuSections, walkthrough, reviewRows, bibliographyExample, ILLUSTRATIVE_LABEL } from "@/content/tmu";
import "../case/case.css";
import "./tmu.css";

/**
 * TMU citation tooling — an annotated research notebook in the portfolio's own
 * paper, serif and thread. Narrative passages read as text; the six stages are
 * numbered processing cells with margin notes; the outputs (bibliographies,
 * the review matrix) get panels of their own. TMU blue marks stages, links and
 * selection; gold only annotates. Not an IDE: nothing runs, nothing downloads,
 * and nothing from the confidential notebook or manuscript appears — the
 * examples are fictional and say so.
 */

/** the legal signals, set apart in the prose that names them */
function Signals({ text }: { text: string }) {
  const parts = text.split(/(Id\.|Ibid\.|Supra)/);
  return (
    <>
      {parts.map((p, i) =>
        /^(Id\.|Ibid\.|Supra)$/.test(p) ? (
          <span key={i} className="tmu-signal">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

function Stage({ s, children }: { s: (typeof tmu.stages)[number]; children?: React.ReactNode }) {
  return (
    <section className="tmu-cell" id={s.id} aria-labelledby={`${s.id}-title`}>
      <span className="tmu-cell__n" aria-hidden="true">
        [{s.n}]
      </span>
      <div className="tmu-cell__main">
        <h2 className="tmu-h2 tmu-cell__title" id={`${s.id}-title`}>
          <span className="visually-hidden">{s.n} · </span>
          {s.heading}
        </h2>
        <div className="tmu-prose">
          {s.paragraphs.map((p) => (
            <p key={p}>
              <Signals text={p} />
            </p>
          ))}
        </div>
      </div>
      {"note" in s && s.note ? (
        <p className="tmu-note">{s.note}</p>
      ) : null}
      {children ? <div className="tmu-cell__out">{children}</div> : null}
    </section>
  );
}

export default function TmuPage() {
  const t = tmu;
  const period = t.meta.find((m) => m.label === "Period")!;
  const facts = t.meta.filter((m) => m.label !== "Period");
  const [extract, follow, convert, replace, bibs, review] = t.stages;

  return (
    <div className="detail theme-default theme-tmu" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="tmu-citation-tooling" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero case-hero tmu-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#selected-work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">Research tooling</span>
            </nav>
            <div className="tmu-hero__grid">
              <div className="tmu-hero__main">
                {/* the supplied logo, unchanged, with the dates */}
                <div className="case-hero__id">
                  <p className="tmu-logo">
                    <Image className="tmu-logo__img" src="/logos/tmu.png" alt="Toronto Metropolitan University" width={256} height={140} unoptimized preload />
                  </p>
                  <p className="tmu-hero__dates">
                    <span className="visually-hidden">{period.label}: </span>
                    {period.value}
                  </p>
                </div>
                {/* the thread makes a small loop after the title: its footnote mark (DetailLine) */}
                <h1 className="detail-hero__title tmu-hero__title">
                  <span data-line="title">{t.title}</span>
                  <span className="case-hero__mark" data-line="flourish" data-flourish="mark" data-flourish-scale="0.62" aria-hidden="true" />
                </h1>
                <p className="detail-hero__subtitle tmu-hero__subtitle">{t.subtitle}</p>
              </div>
              <dl className="tmu-facts">
                {facts.map((m) => (
                  <div key={m.label} className="tmu-facts__item">
                    <dt className="label">{m.label}</dt>
                    <dd>
                      {m.label === "Tools" ? (
                        <ul className="tmu-facts__tools">
                          {m.value.split(" · ").map((tool) => (
                            <li key={tool}>{tool}</li>
                          ))}
                        </ul>
                      ) : (
                        m.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        <div className="container case-layout">
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={tmuSections} />
            </div>
          </div>

          <div className="case-content">
            {/* the problem first */}
            <section className="tmu-section" id={t.intro.id} aria-labelledby={`${t.intro.id}-title`}>
              <h2 className="tmu-h2" id={`${t.intro.id}-title`}>
                {t.intro.heading}
              </h2>
              <p className="tmu-lead">{t.intro.paragraphs[0]}</p>
              <div className="tmu-prose">
                {t.intro.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            <section className="tmu-section" id={t.problem.id} aria-labelledby={`${t.problem.id}-title`}>
              <h2 className="tmu-h2" id={`${t.problem.id}-title`}>
                {t.problem.heading}
              </h2>
              <div className="tmu-prose">
                <p>
                  <Signals text={t.problem.paragraphs[0]} />
                </p>
              </div>
              <p className="tmu-pull">{t.problem.paragraphs[1]}</p>
              <div className="tmu-prose">
                <p>{t.problem.paragraphs[2]}</p>
              </div>
            </section>

            <section className="tmu-section" id={t.built.id} aria-labelledby={`${t.built.id}-title`}>
              <h2 className="tmu-h2" id={`${t.built.id}-title`}>
                {t.built.heading}
              </h2>
              <div className="tmu-prose">
                {t.built.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {/* the confirmed results of the final workflow */}
              <figure className="tmu-results" aria-labelledby="tmu-results-cap">
                <ul className="tmu-results__figures">
                  {t.built.figures.map((f) => (
                    <li key={f.value}>
                      <span className="tmu-results__value">{f.value}</span>
                      <span className="tmu-results__label">{f.label}</span>
                    </li>
                  ))}
                </ul>
                <figcaption id="tmu-results-cap" className="tmu-results__cap">
                  {t.built.results}
                </figcaption>
              </figure>
            </section>

            <section className="tmu-section tmu-walk" id={walkthrough.id} aria-labelledby={`${walkthrough.id}-title`}>
              <h2 className="tmu-h2" id={`${walkthrough.id}-title`}>
                {walkthrough.heading}
              </h2>
              <Walkthrough />
            </section>

            {/* the six stages, as numbered cells */}
            <div className="tmu-stages" id="stages">
              <Stage s={extract} />
              <Stage s={follow} />
              <Stage s={convert} />
              <Stage s={replace} />
              <Stage s={bibs}>
                <figure className="tmu-out tmu-bibs" aria-labelledby="tmu-bibs-cap">
                  <div className="tmu-bibs__col">
                    <p className="tmu-out__title">{bibliographyExample.chapter.title}</p>
                    <ol className="tmu-bibs__list">
                      {bibliographyExample.chapter.entries.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="tmu-bibs__col">
                    <p className="tmu-out__title">{bibliographyExample.master.title}</p>
                    <ol className="tmu-bibs__list">
                      {bibliographyExample.master.entries.map((e) => (
                        <li key={e.text}>
                          {e.text}
                          {e.note ? <span className="tmu-bibs__note">{e.note}</span> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <figcaption id="tmu-bibs-cap" className="tmu-out__cap">
                    <span className="walk__tag">Illustrative</span>
                    Fictional entries showing the shape of the output: one chapter’s list, and the master list where a source cited in two chapters appears once.
                  </figcaption>
                </figure>
              </Stage>
              <Stage s={review}>
                <div className="tmu-matrix">
                  <p className="tmu-matrix__lead">{review.matrixLead}</p>
                  <ul className="tmu-matrix__cols">
                    {review.matrix!.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
                <figure className="tmu-out tmu-review" aria-labelledby="tmu-review-cap">
                  <div className="tmu-review__scroll" tabIndex={0} role="region" aria-label="Example review matrix (illustrative)">
                    <table className="tmu-review__table">
                      <thead>
                        <tr>
                          <th scope="col">Original reference number</th>
                          <th scope="col">Original footnote</th>
                          <th scope="col">Converted in-text citation</th>
                          <th scope="col">Generated bibliography entry</th>
                          <th scope="col">Original bibliography entry</th>
                          <th scope="col">Associated chapter</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviewRows.map((r) => (
                          <tr key={r.ref} data-status={r.status}>
                            <th scope="row" data-label="Original reference number">
                              {r.ref}
                            </th>
                            <td data-label="Original footnote">{r.footnote}</td>
                            <td colSpan={r.status ? 3 : 1} className={r.status ? "tmu-review__status" : undefined} data-label={r.status ? "Review" : "Converted in-text citation"}>
                              {r.status ? r.statusNote : r.citation}
                            </td>
                            {r.status ? null : (
                              <>
                                <td data-label="Generated bibliography entry">{r.generated}</td>
                                <td data-label="Original bibliography entry">{r.original}</td>
                              </>
                            )}
                            <td data-label="Associated chapter">{r.chapter}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <figcaption id="tmu-review-cap" className="tmu-out__cap">
                    <span className="walk__tag">Illustrative</span>
                    {ILLUSTRATIVE_LABEL} Rows 13–14 share one source; 16 is an exception record; 17 is an explanatory note kept as a note.
                  </figcaption>
                </figure>
                <div className="tmu-prose tmu-cell__after">
                  {review.after!.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Stage>
            </div>

            {/* the editorial half of the work */}
            <section className="tmu-section tmu-editorial" id={t.editorial.id} aria-labelledby={`${t.editorial.id}-title`}>
              <h2 className="tmu-h2" id={`${t.editorial.id}-title`}>
                {t.editorial.heading}
              </h2>
              <p className="tmu-lead">{t.editorial.paragraphs[0]}</p>
              <div className="tmu-editorial__grid">
                <div className="tmu-prose">
                  {t.editorial.paragraphs.slice(1).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <Avatar pose="standingBook" role="tmu-reader" />
              </div>
            </section>

            <section className="tmu-section" id={t.engineering.id} aria-labelledby={`${t.engineering.id}-title`}>
              <h2 className="tmu-h2" id={`${t.engineering.id}-title`}>
                {t.engineering.heading}
              </h2>
              <div className="tmu-prose">
                {t.engineering.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            <section className="tmu-section" id={t.outputs.id} aria-labelledby={`${t.outputs.id}-title`}>
              <h2 className="tmu-h2" id={`${t.outputs.id}-title`}>
                {t.outputs.heading}
              </h2>
              <div className="tmu-table-wrap">
                <table className="tmu-table tmu-table--outputs">
                  <thead>
                    <tr>
                      {t.outputs.columns.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.outputs.rows.map(([d, p]) => (
                      <tr key={d}>
                        <th scope="row">{d}</th>
                        <td>{p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="tmu-section" id={t.tools.id} aria-labelledby={`${t.tools.id}-title`}>
              <h2 className="tmu-h2" id={`${t.tools.id}-title`}>
                {t.tools.heading}
              </h2>
              <div className="tmu-table-wrap">
                <table className="tmu-table">
                  <thead>
                    <tr>
                      {t.tools.columns.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.tools.rows.map(([a, b]) => (
                      <tr key={a}>
                        <th scope="row">{a}</th>
                        <td>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="tmu-section tmu-takeaways" id={t.takeaways.id} aria-labelledby={`${t.takeaways.id}-title`}>
              <h2 className="tmu-h2" id={`${t.takeaways.id}-title`}>
                {t.takeaways.heading}
              </h2>
              <p className="tmu-lead">{t.takeaways.paragraphs[0]}</p>
              <div className="tmu-prose">
                {t.takeaways.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="tmu-punchline">{t.takeaways.punchline}</p>
            </section>
          </div>
        </div>

        <WorkPager slug={"tmu-citation-tooling"} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
