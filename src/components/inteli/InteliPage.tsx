import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import { inteli } from "@/content/inteli";
import "../case/case.css";
import "./inteli.css";

/**
 * Inteli-lens — a short project note in the portfolio's own paper, serif and
 * thread: the question, the idea, the prototype (with an illustrative
 * reconstruction, labelled as such) and a look back. Three sections, so no
 * "On this page": each heading sits in the margin beside its text.
 *
 * Lavender and plum only mark and annotate. The one motif is a detection box,
 * drawn as corner brackets: it settles onto "movement" in the title once, and
 * frames the illustration like a viewfinder. It never labels or classifies
 * anything.
 */

/** the lens mark the homepage panel and the work drawer use */
function LensMark() {
  return (
    <svg className="il-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" r="6" />
      <path d="M20 6v8M33.3 15.7l-7.6 2.5M28.2 31.3l-4.7-6.5M11.8 31.3l4.7-6.5M6.7 15.7l7.6 2.5" />
    </svg>
  );
}

/** the title, with its one framed word */
function Title() {
  const [before, after] = inteli.title.split(inteli.framed);
  return (
    <>
      {before}
      <span className="il-box">{inteli.framed}</span>
      {after}
    </>
  );
}

export default function InteliPage() {
  const t = inteli;
  const m = t.mockup;

  return (
    <div className="detail theme-default theme-inteli" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="inteli-lens" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero case-hero il-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#selected-work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{t.name}</span>
            </nav>
            <div className="case-hero__grid il-hero__grid">
              <div className="il-hero__main">
                <div className="case-hero__id">
                  <p className="il-id">
                    <LensMark />
                    <span className="il-id__name">{t.name}</span>
                  </p>
                  <p className="il-hero__year">
                    <span className="visually-hidden">Year: </span>
                    {t.year}
                  </p>
                </div>
                <h1 className="detail-hero__title il-hero__title">
                  <span data-line="title">
                    <Title />
                  </span>
                </h1>
                <p className="detail-hero__subtitle il-hero__subtitle">{t.subtitle}</p>
              </div>
              {/* the facts, hung from the thread like a tag (DetailLine) */}
              <dl className="il-facts" data-line="flourish" data-flourish="tag">
                <div className="il-facts__item">
                  <dt className="label">Type</dt>
                  <dd>{t.type}</dd>
                </div>
                <div className="il-facts__item">
                  <dt className="label">Tools</dt>
                  <dd>
                    <ul className="il-tools">
                      {t.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="container il-body">
          {/* ------------------------------------------------------ the idea */}
          <section className="il-section" id={t.idea.id} aria-labelledby={`${t.idea.id}-title`}>
            <h2 className="il-h2" id={`${t.idea.id}-title`}>
              {t.idea.heading}
            </h2>
            <div className="il-prose">
              {t.idea.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------ the prototype */}
          <section className="il-section il-section--prototype" id={t.prototype.id} aria-labelledby={`${t.prototype.id}-title`}>
            <h2 className="il-h2" id={`${t.prototype.id}-title`}>
              {t.prototype.heading}
            </h2>
            <div className="il-prose">
              {t.prototype.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {/* a generated illustration, not a screenshot or a result; its own
                corner disclosure stays in the frame (nothing is cropped) */}
            <figure className="il-figure" aria-labelledby="il-figure-cap">
              <div className="il-figure__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="il-figure__img"
                  src={`${m.src}-1600.webp`}
                  srcSet={`${m.src}-960.webp 960w, ${m.src}-1600.webp 1597w`}
                  sizes="(max-width: 760px) calc(100vw - 2.5rem), min(66rem, calc(100vw - 8rem))"
                  width={m.width}
                  height={m.height}
                  alt={m.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="il-figure__cap" id="il-figure-cap">
                <span>{m.caption}</span>
                <a className="il-figure__full" href={m.original} target="_blank" rel="noopener noreferrer">
                  View full size<span aria-hidden="true"> ↗</span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </figcaption>
            </figure>

            <div className="il-prose il-limit">
              <p>
                <span className="il-limit__lead">{t.prototype.limitation.lead}</span> {t.prototype.limitation.rest}
              </p>
            </div>
          </section>

          {/* ------------------------------------------------- looking back */}
          <section className="il-section il-section--back" id={t.reflection.id} aria-labelledby={`${t.reflection.id}-title`}>
            <h2 className="il-h2" id={`${t.reflection.id}-title`}>
              {t.reflection.heading}
            </h2>
            <div className="il-back">
              {t.reflection.paragraphs.map((p) => (
                <p key={p} className="il-lead">
                  {p}
                </p>
              ))}
              <p className="il-more">{t.reflection.more}</p>
            </div>
            {/* thinking it over, standing on the closing rule */}
            <Avatar pose="lookingUp" role="il-think" />
          </section>
        </div>

        <WorkPager slug={"inteli-lens"} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
