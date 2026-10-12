import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import { LynxsterLockup } from "@/components/Logo";
import { WorkFigure, ScreenshotFrame } from "@/components/Figures";
import { work, getWork, getNeighbours, formatPeriod, type WorkEntry } from "@/content/work";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) return {};
  return { title: `${entry.name} — Anya Jajodia`, description: entry.description };
}

function MetaRow({ entry }: { entry: WorkEntry }) {
  const items: { label: string; value: string }[] = [];
  if (entry.role) items.push(entry.role);
  const period = formatPeriod(entry.period);
  if (period && entry.period) items.push({ label: entry.period.label, value: period });
  if (entry.meta) items.push(...entry.meta);
  return (
    <dl className="meta-row">
      {items.map((m) => (
        <div key={m.label} className="meta-row__item">
          <dt className="label">{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) notFound();
  const { prev, next } = getNeighbours(slug);
  const theme = entry.theme;
  const eyebrow = entry.eyebrow ?? (theme === "default" ? [entry.name] : []);

  return (
    <div className={`detail theme-${theme}`} data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" darkUntilSelector={theme === "lynxster" ? "[data-dark-band]" : undefined} />
      <DetailLine theme={theme} />
      <main id="main" className="detail__main">
        <header className="detail-hero" data-line="top" {...(theme === "lynxster" ? { "data-dark-band": "" } : {})}>
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{entry.name}</span>
            </nav>
            <div className="detail-hero__grid">
              <div className="detail-hero__main">
                {theme === "lynxster" ? <LynxsterLockup className="detail-hero__logo" /> : null}
                {eyebrow.length ? (
                  <p className="eyebrow">
                    {eyebrow.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                ) : null}
                <h1 className="detail-hero__title">
                  <span data-line="title">{entry.title}</span>
                </h1>
                <p className="detail-hero__subtitle">{entry.subtitle}</p>
                <MetaRow entry={entry} />
              </div>
              {entry.lede ? (
                <div className="detail-hero__lede">
                  <span className="detail-hero__rule" aria-hidden="true" />
                  {entry.lede.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {theme === "lynxster" ? <ScreenshotFrame /> : null}

        {entry.figure ? (
          <div className="container detail-figure">
            <WorkFigure figure={entry.figure} />
          </div>
        ) : null}

        <div className="container detail-sections">
          {entry.sections.map((s) => (
            <section key={s.heading} className="detail-section" aria-labelledby={`s-${slugify(s.heading)}`}>
              <h2 className="detail-section__heading" id={`s-${slugify(s.heading)}`}>
                {s.heading}
              </h2>
              <div className="prose detail-section__body">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          {entry.links?.length ? (
            <section className="detail-section detail-links" aria-labelledby="s-links">
              <h2 className="detail-section__heading" id="s-links">
                Links
              </h2>
              <ul className="detail-links__list">
                {entry.links.map((l) => (
                  <li key={l.label}>
                    {l.url ? (
                      <a href={l.url} className="text-link" target="_blank" rel="noopener noreferrer">
                        {l.label} <span aria-hidden="true">↗</span>
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="pending">
                        {l.label} <span className="pending__note">— {l.pendingNote ?? "to come"}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
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
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
