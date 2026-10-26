import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage from "@/components/OnThisPage";
import { crackd, crackdSections, type App } from "@/content/crackd";
import { getNeighbours } from "@/content/work";
import "../case/case.css";
import "./crackd.css";

/**
 * Crackd.ai — an engineering notebook in the portfolio's own hand: the serif,
 * the paper, the thread. Crackd's black and yellow appear only where they mean
 * something: its logo, the two chapter numbers, a highlighter, the matrix.
 *
 * The two dated phases are the spine. 01 (Sept–Dec 2025) is the shared
 * platform, set as notes on the page; 02 (Jan–May 2026) is my own build, set
 * on a raised notebook sheet with an entry per application. A thread runs from
 * one chapter to the next. No screenshots or architecture are drawn: they are
 * still to come, and nothing stands in for them.
 */

/** "Can a model learn to be funny?" with the highlighter on its last word */
function Title() {
  const [before, after] = crackd.title.split("funny");
  return (
    <>
      {before}
      <span className="ck-hl">funny</span>
      {after}
    </>
  );
}

/** a small drawn knot where the thread passes a chapter number */
function Knot() {
  return (
    <svg className="ck-knot" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M32 2c0 10-2 15-6 19-6 6-14 4-14 11s9 9 16 4c6-4 9-11 5-15-5-5-14 1-13 9 1 9 12 10 16 4 4-6-1-12-4-9" pathLength={1} />
      <path d="M33 38c-1 8-1 16-1 24" pathLength={1} />
    </svg>
  );
}

function RepoLink({ app }: { app: App }) {
  return (
    <a className="ck-repo" href={app.repo.url} target="_blank" rel="noopener noreferrer">
      <svg className="ck-repo__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
      </svg>
      <span className="ck-repo__text">
        <span className="ck-repo__kind">Code on GitHub</span>
        {/* a long repository name may break only after an underscore or hyphen */}
        <span className="ck-repo__name">
          {app.repo.label.split(/(?<=[_-])/).map((part, i) => (
            <Fragment key={i}>
              {i ? <wbr /> : null}
              {part}
            </Fragment>
          ))}
        </span>
      </span>
      <span className="ck-repo__go" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

/** the three applications, each in its own register */
function UserApp({ app }: { app: App }) {
  return (
    <article className="ck-app ck-app--user" id={app.id} aria-labelledby={`${app.id}-title`}>
      <div className="ck-app__head">
        <h3 className="ck-app__name" id={`${app.id}-title`}>
          <span className="ck-app__mark">{app.name}</span>
        </h3>
        <p className="ck-app__lede">{app.lede}</p>
      </div>
      <div className="ck-app__body">
        {app.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <RepoLink app={app} />
      </div>
    </article>
  );
}

function AdminApp({ app }: { app: App }) {
  // the three interfaces the paragraph names, ticked off a ledger (its own words)
  const ledger = ["inspecting database records", "managing permissions", "reviewing statistics"].filter((w) => app.paragraphs[0].includes(w));
  return (
    <article className="ck-app ck-app--admin" id={app.id} aria-labelledby={`${app.id}-title`}>
      <div className="ck-app__head">
        <h3 className="ck-app__name" id={`${app.id}-title`}>
          {app.name}
        </h3>
        <p className="ck-app__lede">{app.lede}</p>
      </div>
      <div className="ck-app__body">
        {app.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <RepoLink app={app} />
      </div>
      <ul className="ck-ledger" aria-hidden="true">
        {ledger.map((w) => (
          <li key={w}>
            <svg viewBox="0 0 20 20" focusable="false">
              <path d="M4 10.5l4 4 8-9" pathLength={1} />
            </svg>
            {w}
          </li>
        ))}
      </ul>
    </article>
  );
}

function MatrixApp({ app }: { app: App }) {
  return (
    <article className="ck-app ck-app--matrix" id={app.id} aria-labelledby={`${app.id}-title`}>
      {/* decoration only: a thread passing through three knots — one step's
          output becoming the next one's input. Not a diagram of the app. */}
      <svg className="ck-chain" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          d="M0 34c40-2 70-8 96-6 22 2 30 18 46 14 14-4 6-24-8-20-14 5-4 22 14 22 60 0 96-14 150-12 22 1 30 18 46 14 14-4 6-24-8-20-14 5-4 22 14 22 60 0 100-12 154-10 20 1 30 16 46 12 14-4 6-23-8-19-14 5-4 21 14 21 30 0 40-4 44-5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="ck-app__head">
        <h3 className="ck-app__name" id={`${app.id}-title`}>
          {app.name}
        </h3>
        <p className="ck-app__lede">{app.lede}</p>
      </div>
      <div className="ck-app__body">
        {app.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <RepoLink app={app} />
      </div>
    </article>
  );
}

export default function CrackdPage() {
  const { prev, next } = getNeighbours("crackd-ai");
  const [p1, p2] = crackd.phases;
  const [user, admin, matrix] = crackd.apps;
  const period = crackd.meta.find((m) => m.label === "Period")!;
  const facts = crackd.meta.filter((m) => m.label !== "Period");

  return (
    <div className="detail theme-default theme-crackd" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="crackd-ai" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero ck-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{crackd.name}</span>
            </nav>
            <div className="ck-hero__grid">
              <div className="ck-hero__main">
                {/* the dates, then Crackd itself, then the question */}
                <p className="ck-hero__dates">
                  <span className="visually-hidden">{period.label}: </span>
                  {period.value}
                </p>
                {/* the real logo: white lettering, so it sits on its own black plate */}
                <p className="ck-plate">
                  <Image className="ck-plate__logo" src="/logos/crackd.png" alt="Crackd" width={202} height={84} unoptimized preload />
                </p>
                <h1 className="detail-hero__title ck-hero__title">
                  <span data-line="title">
                    <Title />
                  </span>
                </h1>
                <p className="detail-hero__subtitle ck-hero__subtitle">{crackd.subtitle}</p>
              </div>
              {/* the remaining facts, on an index card */}
              <dl className="ck-meta">
                {facts.map((m) => (
                  <div key={m.label} className="ck-meta__item">
                    <dt className="label">{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        <div className="container case-layout">
          {/* the margin: where you are on this page (other work is in the header) */}
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={crackdSections} />
            </div>
          </div>

          <div className="case-content">
            {/* --------------------------------------------- what is Crackd */}
            <section className="ck-section ck-intro" id={crackd.intro.id} aria-labelledby={`${crackd.intro.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.intro.id}-title`}>
                {crackd.intro.heading}
              </h2>
              <p className="ck-intro__opening">{crackd.intro.opening}</p>
              <div className="ck-prose">
                {crackd.intro.paragraphs.map((p) => (
                  <p key={p}>
                    {p.includes("“flavors.”") ? (
                      <>
                        {p.split("“flavors.”")[0]}
                        <span className="ck-term">“flavors.”</span>
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>
              <p className="ck-bridge">
                {crackd.intro.bridge}
                <svg className="ck-bridge__arrow" viewBox="0 0 40 60" aria-hidden="true" focusable="false">
                  <path d="M10 2c14 10 20 26 14 50M16 44c3 4 6 7 8 10 3-4 6-7 10-9" />
                </svg>
              </p>
            </section>

            {/* ------------------------------------------------ the two phases */}
            <div className="ck-phases">
              <span className="ck-spine" aria-hidden="true" />

              <section className="ck-phase ck-phase--1" id={p1.id} aria-labelledby={`${p1.id}-title`}>
                <div className="ck-phase__marker">
                  <span className="ck-phase__n" aria-hidden="true">
                    <Knot />
                    {p1.n}
                  </span>
                  <p className="ck-phase__dates">{p1.dates}</p>
                  <p className="ck-phase__scope">{p1.scope}</p>
                </div>
                <div className="ck-phase__body">
                  <h2 className="ck-h2" id={`${p1.id}-title`}>
                    <span className="visually-hidden">
                      {p1.n} · {p1.dates}:{" "}
                    </span>
                    {p1.heading}
                  </h2>
                  <div className="ck-prose ck-phase__intro">
                    {p1.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="ck-notes">
                    {p1.notes.map((n) => (
                      <div key={n.heading} className="ck-note">
                        <h3 className="ck-note__title">{n.heading}</h3>
                        {n.paragraphs.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="ck-phase ck-phase--2" id={p2.id} aria-labelledby={`${p2.id}-title`}>
                <div className="ck-phase__marker">
                  <span className="ck-phase__n" aria-hidden="true">
                    <Knot />
                    {p2.n}
                  </span>
                  <p className="ck-phase__dates">{p2.dates}</p>
                  <p className="ck-phase__scope">{p2.scope}</p>
                </div>
                <div className="ck-phase__body">
                  <div className="ck-sheet">
                    <span className="ck-sheet__tape ck-sheet__tape--l" aria-hidden="true" />
                    <span className="ck-sheet__tape ck-sheet__tape--r" aria-hidden="true" />
                    {/* building: sat on the sheet's top edge with her laptop */}
                    <Avatar pose="laptopFloor" role="ck-build" />
                    <h2 className="ck-h2" id={`${p2.id}-title`}>
                      <span className="visually-hidden">
                        {p2.n} · {p2.dates}:{" "}
                      </span>
                      {p2.heading}
                    </h2>
                    <div className="ck-prose ck-phase__intro">
                      {p2.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    <div className="ck-apps">
                      <UserApp app={user} />
                      <AdminApp app={admin} />
                      <MatrixApp app={matrix} />
                    </div>
                    <p className="ck-sheet__outro">{crackd.appsOutro}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* --------------------------------------- inside the matrix */}
            <section className="ck-section ck-matrix" id={crackd.matrix.id} aria-labelledby={`${crackd.matrix.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.matrix.id}-title`}>
                {crackd.matrix.heading}
              </h2>
              <h3 className="ck-h3">{crackd.matrix.subheading}</h3>
              <div className="ck-prose">
                {crackd.matrix.before.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="ck-questions">
                <p className="ck-questions__lead">{crackd.matrix.questionsLead}</p>
                <ol className="ck-questions__list">
                  {crackd.matrix.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </div>
              <div className="ck-prose">
                {crackd.matrix.after.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* ------------------------------------------- what I took */}
            <section className="ck-section ck-takeaways" id={crackd.takeaways.id} aria-labelledby={`${crackd.takeaways.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.takeaways.id}-title`}>
                {crackd.takeaways.heading}
              </h2>
              <div className="ck-prose">
                {crackd.takeaways.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="ck-punchline">
                {crackd.takeaways.punchline.split("a fairly low bar")[0]}
                <span className="ck-hl ck-hl--late">a fairly low bar</span>
                {crackd.takeaways.punchline.split("a fairly low bar")[1]}
              </p>
            </section>

            {/* ------------------------------------- the applications, in brief */}
            <section className="ck-section ck-table-section" id={crackd.table.id} aria-labelledby={`${crackd.table.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.table.id}-title`}>
                {crackd.table.heading}
              </h2>
              <div className="ck-table-wrap">
                <table className="ck-table">
                  <thead>
                    <tr>
                      {crackd.table.columns.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {crackd.table.rows.map((r) => (
                      <tr key={r.app}>
                        <th scope="row">
                          {/* a jump to the application's entry above, not an external link */}
                          <a href={`#${r.anchor}`} className="ck-jump">
                            {r.app}
                            <span className="ck-jump__arrow" aria-hidden="true">
                              ↑
                            </span>
                            <span className="visually-hidden"> (section on this page)</span>
                          </a>
                        </th>
                        <td>{r.what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ------------------------------------------ tools + credits */}
            <section className="ck-section ck-colophon" id={crackd.tools.id} aria-labelledby={`${crackd.tools.id}-title`}>
              <div className="ck-colophon__tools">
                <h2 className="ck-h2" id={`${crackd.tools.id}-title`}>
                  {crackd.tools.heading}
                </h2>
                <dl className="ck-tools">
                  {crackd.tools.items.map((t) => (
                    <div key={t.label} className="ck-tools__item">
                      <dt>{t.label}</dt>
                      <dd>{t.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="ck-colophon__credits">
                <h2 className="ck-h2 ck-h2--small">{crackd.credits.heading}</h2>
                <p className="ck-credits__lead">{crackd.credits.lead}</p>
                <dl className="ck-credits">
                  {crackd.credits.phases.map((c) => (
                    <div key={c.dates} className="ck-credits__item">
                      <dt>{c.dates}</dt>
                      <dd>{c.text}</dd>
                    </div>
                  ))}
                </dl>
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
