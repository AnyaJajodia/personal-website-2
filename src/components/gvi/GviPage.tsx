import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage from "@/components/OnThisPage";
import PhotoSlot from "./PhotoSlot";
import ThemeLogo from "@/components/ThemeLogo";
import { gvi, gviSections } from "@/content/gvi";
import { gviPhotos } from "@/content/gvi-photos";
import "../case/case.css";
import "./gvi.css";

/**
 * GVI · South Africa — a field journal in the portfolio's own paper, serif and
 * thread. Bushveld colours (proposed accents, not GVI's brand) only mark and
 * annotate. Revised copy (26 Oct 2026): the threads meeting, the field and its
 * data (with Taba's photograph), the AI work, conservation as observed, the
 * reserve and community (with the preschool photograph), the turn it took, and
 * the certificate as compact supporting information. The opening photograph
 * stays short (16:9). No maps, tracking data or stock imagery.
 */

export default function GviPage() {
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
        <header className="detail-hero case-hero gvi-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#selected-work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{g.name}</span>
            </nav>
            <div className="case-hero__grid gvi-hero__grid">
              <div className="gvi-hero__main">
                {/* dark-lettered in Light, the supplied white artwork in Dark — same canvas, same place, no tile — with the dates */}
                <div className="case-hero__id">
                  <div className="gvi-logo">
                    <ThemeLogo className="gvi-logo__mark" light="/logos/gvi.webp" dark="/logos/gvi-white.png" width={300} height={237} label="GVI" />
                  </div>
                  <p className="gvi-hero__dates">
                    <span className="visually-hidden">{period.label}: </span>
                    {period.value}
                  </p>
                </div>
                <h1 className="detail-hero__title gvi-hero__title">
                  <span data-line="title">{g.title}</span>
                </h1>
                <p className="detail-hero__subtitle gvi-hero__subtitle">{g.subtitle}</p>
              </div>
              {/* the field entry's facts, hung from the thread like a tag (DetailLine) */}
              <dl className="gvi-facts" data-line="flourish" data-flourish="tag">
                {facts.map((m) => (
                  <div key={m.label} className="gvi-facts__item">
                    <dt className="label">{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          {/* the opening photograph: the width of the page, kept short (16:9, trimmed from the top) */}
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
              <div className="gvi-prose">
                <p>{g.threads.paragraphs[0]}</p>
              </div>
              <p className="gvi-turn">{g.threads.paragraphs[1]}</p>
            </section>

            {/* observations and the data made from them, Taba beside the first */}
            <section className="gvi-section gvi-field" id={g.field.id} aria-labelledby={`${g.field.id}-title`}>
              <h2 className="gvi-h2" id={`${g.field.id}-title`}>
                {g.field.heading}
              </h2>
              <div className="gvi-field__grid">
                <div className="gvi-part">
                  <h3 className="gvi-h3">{g.field.collecting.heading}</h3>
                  <div className="gvi-prose">
                    {g.field.collecting.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                <PhotoSlot photo={gviPhotos.fieldwork} className="gvi-photo--field" />
              </div>
              <div className="gvi-part gvi-part--formats">
                <div>
                  <h3 className="gvi-h3">{g.field.formats.heading}</h3>
                  <div className="gvi-prose">
                    {g.field.formats.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                {/* watching, with binoculars: on the rule, never over a photograph */}
                <Avatar pose="binoculars" role="gvi-watch" />
              </div>
            </section>

            <section className="gvi-section gvi-ai" id={g.ai.id} aria-labelledby={`${g.ai.id}-title`}>
              <h2 className="gvi-h2" id={`${g.ai.id}-title`}>
                {g.ai.heading}
              </h2>
              <div className="gvi-prose">
                {g.ai.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* what she observed and attended, kept apart from her own contributions */}
            <section className="gvi-section gvi-practice" id={g.practice.id} aria-labelledby={`${g.practice.id}-title`}>
              <h2 className="gvi-h2" id={`${g.practice.id}-title`}>
                {g.practice.heading}
              </h2>
              <div className="gvi-observed">
                <div className="gvi-observed__entry">
                  <p className="gvi-observed__k">Observed</p>
                  <div className="gvi-prose">
                    {g.practice.observed.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                <div className="gvi-observed__entry">
                  <p className="gvi-observed__k">Attended</p>
                  <div className="gvi-prose">
                    <p>{g.practice.attended}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="gvi-section gvi-community" id={g.community.id} aria-labelledby={`${g.community.id}-title`}>
              <h2 className="gvi-h2" id={`${g.community.id}-title`}>
                {g.community.heading}
              </h2>
              <div className="gvi-part gvi-part--short">
                <h3 className="gvi-h3">{g.community.reserve.heading}</h3>
                <div className="gvi-prose">
                  <p>{g.community.reserve.text}</p>
                </div>
              </div>
              <div className="gvi-teach">
                <div className="gvi-part">
                  <h3 className="gvi-h3">{g.community.teaching.heading}</h3>
                  <div className="gvi-prose">
                    {g.community.teaching.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                <PhotoSlot photo={gviPhotos.teaching} className="gvi-photo--teach" />
              </div>
              <div className="gvi-part gvi-part--short">
                <h3 className="gvi-h3">{g.community.antiPoaching.heading}</h3>
                <div className="gvi-prose">
                  <p>{g.community.antiPoaching.text}</p>
                </div>
              </div>
            </section>

            {/* the close: open, on the page — a small label, the turn in green, the rest as prose */}
            <section className="gvi-section gvi-stayed" id={g.stayed.id} aria-labelledby={`${g.stayed.id}-title`}>
              <h2 className="gvi-stayed__label" id={`${g.stayed.id}-title`}>
                {g.stayed.heading}
              </h2>
              <p className="gvi-stayed__quote">{g.stayed.turn}</p>
              <div className="gvi-prose">
                {g.stayed.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* compact supporting information */}
            <section className="gvi-section gvi-training" id={g.training.id} aria-labelledby={`${g.training.id}-title`}>
              <h2 className="gvi-h2 gvi-h2--quiet" id={`${g.training.id}-title`}>
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
          </div>
        </div>

        <WorkPager slug={"gvi-conservation"} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
