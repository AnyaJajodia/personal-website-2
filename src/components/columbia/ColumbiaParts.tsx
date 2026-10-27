import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import ThemeLogo from "@/components/ThemeLogo";
import { getNeighbours } from "@/content/work";
import { COLUMBIA_WORDMARK, ADI_MARK } from "@/content/columbia";
import "../case/case.css";
import "./columbia.css";

/**
 * The Columbia pages (ESP, ADI): short siblings in the portfolio's own paper,
 * serif and thread, with Columbia-inspired blue as the only accent. The
 * Columbia wordmark follows the site theme (ThemeLogo); ADI's own mark sits in
 * a blue pill that is the same in both themes.
 */

export function Prose({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={`cu-prose ${className}`.trim()}>
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export function Section({ id, heading, className = "", children }: { id: string; heading: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`cu-section ${className}`.trim()} id={id} aria-labelledby={`${id}-title`}>
      <h2 className="cu-h2" id={`${id}-title`}>
        {heading}
      </h2>
      {children}
    </section>
  );
}

export function Hero({ name, dates, title, subtitle, facts, adi = false }: { name: string; dates: string; title: string; subtitle: string; facts: { label: string; value: string }[]; adi?: boolean }) {
  return (
    <header className="detail-hero case-hero cu-hero" data-line="top">
      <div className="container" data-line="content">
        <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
          <Link href="/#work">Work</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{name}</span>
        </nav>
        {/* the wordmark (and ADI's pill) with the dates; the thread knots off the end of the row (DetailLine) */}
        <div className="case-hero__id" data-line="flourish" data-flourish="mark" data-flourish-scale="0.55">
          <div className="cu-marks">
            <ThemeLogo className="cu-wordmark" light={COLUMBIA_WORDMARK.light} dark={COLUMBIA_WORDMARK.dark} width={COLUMBIA_WORDMARK.width} height={COLUMBIA_WORDMARK.height} label="Columbia University" />
            {adi ? (
              <span className="cu-pill" role="img" aria-label="ADI">
                <Image src={ADI_MARK.src} alt="" width={ADI_MARK.width} height={ADI_MARK.height} unoptimized preload />
              </span>
            ) : null}
          </div>
          <p className="cu-hero__dates">{dates}</p>
        </div>
        <h1 className="detail-hero__title cu-hero__title">
          <span data-line="title">{title}</span>
        </h1>
        <p className="detail-hero__subtitle cu-hero__subtitle">{subtitle}</p>
        <dl className="cu-facts">
          {facts.map((m) => (
            <div key={m.label} className="cu-facts__item">
              <dt className="label">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/**
 * The Columbia pages are short (four or five sections), so they skip the
 * case-study rail: one reading column, aligned with the opening, no sticky
 * "On this page" index.
 */
export function ColumbiaShell({ slug, hero, children }: { slug: string; hero: React.ReactNode; children: React.ReactNode }) {
  const { prev, next } = getNeighbours(slug);
  return (
    <div className="detail theme-default theme-columbia" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current={slug} />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {hero}
        <div className="container">
          <div className="case-content cu-content">{children}</div>
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
