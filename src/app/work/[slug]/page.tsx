import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import { WorkFigure } from "@/components/Figures";
import { work, getWork, formatPeriod, type WorkEntry, type Section } from "@/content/work";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import { detailAvatars, type PoseName } from "@/content/avatars";
import CrackdPage from "@/components/crackd/CrackdPage";
import BuzzworksPage from "@/components/buzzworks/BuzzworksPage";
import TmuPage from "@/components/tmu/TmuPage";
import GviPage from "@/components/gvi/GviPage";
import PmmyPage from "@/components/research/PmmyPage";
import TeenPage from "@/components/research/TeenPage";
import EspPage from "@/components/columbia/EspPage";
import AdiPage from "@/components/columbia/AdiPage";
import InteliPage from "@/components/inteli/InteliPage";
import LynxsterPage from "@/components/lynxster/LynxsterPage";

export const dynamicParams = false;

// AMNH has its own routes (app/work/amnh: the overview and its two projects)
export function generateStaticParams() {
  return work.filter((w) => w.slug !== "amnh").map((w) => ({ slug: w.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) return {};
  return pageMeta({ title: `${entry.name} — Anya Jajodia`, description: entry.description, path: `/work/${slug}` });
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

type Figure = { pose: PoseName; nth: number };

function DetailSection({
  s,
  level = 2,
  idPrefix = "s",
  pending,
  figure,
}: {
  s: Section;
  level?: 2 | 3;
  idPrefix?: string;
  pending?: string;
  /** a contextual avatar standing on the rule under this section */
  figure?: Figure;
}) {
  const id = `${idPrefix}-${slugify(s.heading)}`;
  const H = level === 2 ? "h2" : "h3";
  return (
    <section className={`detail-section${figure ? " detail-section--avatar" : ""}`} aria-labelledby={id}>
      <H className="detail-section__heading" id={id}>
        {s.heading}
      </H>
      <div className="prose detail-section__body">
        {s.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {pending ? <p className="stream__pending">{pending}</p> : null}
      </div>
      {figure ? <Avatar pose={figure.pose} role="detail" className={`avatar--detail-${figure.nth}`} /> : null}
    </section>
  );
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const entry = getWork(slug);
  if (!entry) notFound();
  // Lynxster, Crackd, Buzzworks, TMU, Inteli-lens, GVI, the two research papers
  // and the Columbia pages have their own pages (content/lynxster.ts, crackd.ts,
  // buzzworks.ts, tmu.ts, inteli.ts, gvi.ts, research.ts, columbia.ts);
  // every other entry uses the template below
  if (slug === "lynxster") return <LynxsterPage />;
  if (slug === "crackd-ai") return <CrackdPage />;
  if (slug === "buzzworks") return <BuzzworksPage />;
  if (slug === "tmu-citation-tooling") return <TmuPage />;
  if (slug === "inteli-lens") return <InteliPage />;
  if (slug === "gvi-conservation") return <GviPage />;
  if (slug === "pmmy-research") return <PmmyPage />;
  if (slug === "teenage-pregnancy-research") return <TeenPage />;
  if (slug === "esp-teaching") return <EspPage />;
  if (slug === "adi-mentorship") return <AdiPage />;
  const theme = entry.theme;
  const eyebrow = entry.eyebrow ?? (theme === "default" ? [entry.name] : []);
  // contextual figures, keyed by section heading ("stream-id/heading" in a stream)
  const figures = new Map<string, Figure>((detailAvatars[slug] ?? []).map((a, i) => [a.section, { pose: a.pose, nth: i + 1 }]));

  return (
    <div className={`detail theme-${theme}`} data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" drawer={slug} />
      <DetailLine theme={theme} />
      <main id="main" className="detail__main">
        <header className="detail-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#selected-work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{entry.name}</span>
            </nav>
            <div className="detail-hero__grid">
              <div className="detail-hero__main">
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

        {entry.figure ? (
          <div className="container detail-figure">
            <WorkFigure figure={entry.figure} />
          </div>
        ) : null}

        {entry.streams?.length ? (
          <>
            {/* two clearly separate workstreams, indexed up front */}
            <nav className="container streams-index" aria-label="Workstreams">
              <ol className="streams-index__list">
                {entry.streams.map((st) => (
                  <li key={st.id}>
                    <a href={`#${st.id}`} className="streams-index__link">
                      {st.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            {entry.streams.map((st, i) => {
              const before = entry.streams!.slice(0, i).reduce((n, x) => n + (x.figure?.kind === "plates" ? x.figure.plates.length : 0), 0);
              return (
                <section key={st.id} id={st.id} className="stream" aria-labelledby={`${st.id}-title`}>
                  <div className="container stream__head">
                    <h2 className="stream__title" id={`${st.id}-title`}>
                      {st.heading}
                    </h2>
                  </div>
                  {st.figure ? (
                    <div className="container detail-figure stream__figure">
                      <WorkFigure figure={st.figure} startAt={before + 1} />
                    </div>
                  ) : null}
                  <div className="container detail-sections stream__sections">
                    {st.sections.map((sec, j) => (
                      <DetailSection
                        key={sec.heading}
                        s={sec}
                        level={3}
                        idPrefix={st.id}
                        pending={j === st.sections.length - 1 ? st.pending : undefined}
                        figure={figures.get(`${st.id}/${sec.heading}`)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        ) : null}

        <div className="container detail-sections">
          {entry.sections.map((s) => (
            <DetailSection key={s.heading} s={s} figure={figures.get(s.heading)} />
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

        <WorkPager slug={slug} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
