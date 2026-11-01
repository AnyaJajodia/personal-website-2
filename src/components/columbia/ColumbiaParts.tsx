import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import AvatarStage from "@/components/AvatarStage";
import ThemeLogo from "@/components/ThemeLogo";
import OnThisPage, { type TocItem } from "@/components/OnThisPage";
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
  // the dates sit once, beside the wordmark; the facts keep everything else
  const period = facts.find((m) => m.value === dates);
  const rest = facts.filter((m) => m !== period);
  return (
    <header className="detail-hero case-hero cu-hero" data-line="top">
      <div className="container" data-line="content">
        <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
          <Link href="/#selected-work">Work</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{name}</span>
        </nav>
        <div className="case-hero__grid cu-hero__grid">
          <div className="cu-hero__main">
            <div className="case-hero__id">
              {/* on phones the thread's flourish ties off beside this row (DetailLine) */}
              <div className="cu-marks" data-line="phone-flourish">
                <ThemeLogo className="cu-wordmark" light={COLUMBIA_WORDMARK.light} dark={COLUMBIA_WORDMARK.dark} width={COLUMBIA_WORDMARK.width} height={COLUMBIA_WORDMARK.height} label="Columbia University" />
                {adi ? (
                  <span className="cu-pill" role="img" aria-label="ADI">
                    <Image src={ADI_MARK.src} alt="" width={ADI_MARK.width} height={ADI_MARK.height} unoptimized preload />
                  </span>
                ) : null}
              </div>
              <p className="cu-hero__dates">
                {period ? <span className="visually-hidden">{period.label}: </span> : null}
                {dates}
              </p>
            </div>
            <h1 className="detail-hero__title cu-hero__title">
              <span data-line="title">{title}</span>
            </h1>
            <p className="detail-hero__subtitle cu-hero__subtitle">{subtitle}</p>
          </div>
          {/* the facts beside the title, hung from the thread like a tag (DetailLine) */}
          <dl className="cu-facts" data-line="flourish" data-flourish="tag">
            {rest.map((m) => (
              <div key={m.label} className="cu-facts__item">
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

/**
 * The Columbia pages share the case studies' reading layout: the sticky "On
 * this page" rail on the left and the reading column beside it, so moving
 * between projects never shifts where the text starts. They are short, so
 * the index is short too.
 */
export function ColumbiaShell({
  slug,
  hero,
  sections,
  children,
}: {
  slug: string;
  hero: React.ReactNode;
  sections: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="detail theme-default theme-columbia" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" drawer={slug} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {hero}
        <div className="container case-layout">
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={sections} />
            </div>
          </div>
          <div className="case-content cu-content">{children}</div>
        </div>
        <WorkPager slug={slug} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
