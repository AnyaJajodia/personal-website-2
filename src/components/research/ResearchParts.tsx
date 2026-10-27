import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage, { type TocItem } from "@/components/OnThisPage";
import { getNeighbours } from "@/content/work";
import { companion, type Paper, type Publication, type Link as LinkT } from "@/content/research";
import "../case/case.css";
import "./research.css";

/**
 * The research-publication family (PMMY, teenage pregnancy): one editorial
 * structure — the paper and how to read it near the top, then the question,
 * methods, findings, contribution, outreach, limits and the reference — in
 * the portfolio's own paper, serif and thread. Each page sets only its accent
 * (.theme-research--pmmy / --teen).
 */

export function Out({ link, className = "" }: { link: LinkT; className?: string }) {
  return (
    <a className={`rs-out ${className}`.trim()} href={link.url} target="_blank" rel="noopener noreferrer">
      {link.label}
      <span aria-hidden="true"> ↗</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

export function Prose({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={`rs-prose ${className}`.trim()}>
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export function Section({ id, heading, className = "", children }: { id: string; heading: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rs-section ${className}`.trim()} id={id} aria-labelledby={`${id}-title`}>
      <h2 className="rs-h2" id={`${id}-title`}>
        {/* a line never starts with an em dash */}
        {heading.replace(/(\S)—/g, "$1\u2060—")}
      </h2>
      {children}
    </section>
  );
}

/** opening: the year, the page's name, the headline, its description, the facts */
export function Hero({ paper }: { paper: Paper }) {
  return (
    <header className="detail-hero case-hero rs-hero" data-line="top">
      <div className="container" data-line="content">
        <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
          <Link href="/#work">Work</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{paper.name}</span>
        </nav>
        <div className="case-hero__grid rs-hero__grid">
          <div className="rs-hero__main">
            <p className="rs-hero__kind">
              <span className="rs-hero__year">{paper.year}</span>
            </p>
            <h1 className="detail-hero__title rs-hero__title">
              <span data-line="title">{paper.title}</span>
            </h1>
            <p className="detail-hero__subtitle rs-hero__subtitle">{paper.subtitle}</p>
          </div>
          {/* the paper's masthead, hung from the thread like a tag (DetailLine) */}
          <dl className="rs-facts" data-line="flourish" data-flourish="tag">
            {paper.facts.map((m) => (
              <div key={m.label} className="rs-facts__item">
                <dt className="label">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}

/** the paper itself: its exact title, authors, where and when, and how to read it */
export function PaperCard({ paper }: { paper: Paper & { publication: Publication } }) {
  const p = paper.publication;
  return (
    <section className="rs-section rs-paper" id={p.id} aria-labelledby={`${p.id}-title`}>
      <h2 className="rs-h2 rs-h2--small" id={`${p.id}-title`}>
        {p.heading}
      </h2>
      <div className="rs-paper__card">
        <p className="rs-paper__k">Published title</p>
        <p className="rs-paper__title">{p.publishedTitle}</p>
        <dl className="rs-paper__meta">
          <div>
            <dt>Authors</dt>
            <dd>{p.authors}</dd>
          </div>
          <div>
            <dt>Journal</dt>
            <dd>
              <abbr title={p.journalFull.replace(/ \(IJSHRE\)$/, "")}>{p.journal}</abbr>
            </dd>
          </div>
          <div>
            <dt>Volume</dt>
            <dd>{p.volume}</dd>
          </div>
          <div>
            <dt>Issue</dt>
            <dd>{p.issue}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>{p.published}</dd>
          </div>
          <div>
            <dt>Pages</dt>
            <dd>{p.pages}</dd>
          </div>
        </dl>
        <p className="rs-paper__credit">{p.credit}</p>
        <p className="rs-paper__access">
          {p.paperLink ? <Out link={p.paperLink} className="rs-out--primary" /> : null}
          <a className="rs-paper__cite" href={`#${paper.reference.id}`}>
            Publication reference
            <span aria-hidden="true"> ↓</span>
          </a>
        </p>
      </div>
    </section>
  );
}

export function Question({ paper, children }: { paper: Paper; children?: React.ReactNode }) {
  const q = paper.question;
  return (
    <Section id={q.id} heading={q.heading} className="rs-question">
      <p className="rs-ask">{q.ask}</p>
      <Prose paragraphs={q.paragraphs} />
      {children}
    </Section>
  );
}

export function Steps({ steps, label }: { steps: { n: string; heading: string; paragraphs: string[] }[]; label: string }) {
  return (
    <ol className="rs-steps" aria-label={label}>
      {steps.map((s) => (
        <li key={s.n} className="rs-step">
          <span className="rs-step__n" aria-hidden="true">
            {s.n}
          </span>
          <div>
            <h3 className="rs-h3">
              <span className="visually-hidden">{s.n} · </span>
              {s.heading}
            </h3>
            <Prose paragraphs={s.paragraphs} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Table({ columns, rows, className = "" }: { columns: string[]; rows: [string, string][]; className?: string }) {
  return (
    <div className="rs-table-wrap">
      <table className={`rs-table ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <th scope="row">{a}</th>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** the reference as published, its links, and the companion paper */
export function Reference({ paper }: { paper: Paper }) {
  const r = paper.reference;
  const other = companion[paper.slug];
  return (
    <section className="rs-section rs-ref" id={r.id} aria-labelledby={`${r.id}-title`}>
      <h2 className="rs-h2 rs-h2--small" id={`${r.id}-title`}>
        {r.heading}
      </h2>
      <p className="rs-ref__text">{r.text}</p>
      {r.links.length ? (
        <p className="rs-ref__links">
          {r.links.map((l) => (
            <Out key={l.url} link={l} />
          ))}
        </p>
      ) : null}
      <aside className="rs-companion" aria-label="The companion paper">
        <p className="rs-companion__k">The companion paper · {other.month}</p>
        <Link href={`/work/${other.slug}`} className="rs-companion__link">
          <span className="rs-companion__name">{other.name}</span>
          <span className="rs-companion__title">{other.title}</span>
          <span className="rs-companion__go" aria-hidden="true">
            →
          </span>
        </Link>
      </aside>
    </section>
  );
}

/** the page frame: shared header (with the work drawer), thread, rail, pager */
export function ResearchShell({ slug, accent, sections, hero, children }: { slug: string; accent: "pmmy" | "teen"; sections: TocItem[]; hero: React.ReactNode; children: React.ReactNode }) {
  const { prev, next } = getNeighbours(slug);
  return (
    <div className={`detail theme-default theme-research theme-research--${accent}`} data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current={slug} />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {hero}
        <div className="container case-layout">
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={sections} />
            </div>
          </div>
          <div className="case-content">{children}</div>
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
