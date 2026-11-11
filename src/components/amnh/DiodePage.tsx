import Avatar from "@/components/Avatar";
import { AMNH_ROUTES, diode as d } from "@/content/amnh";
import { tray } from "@/content/amnh-diode-art";
import { AmnhShell, Facts, Hero, Pager } from "./AmnhParts";
import AnnotatedArt from "./AnnotatedArt";
import LaptopDetail from "./LaptopDetail";
import { WorkstationFigure } from "./Workstation";

/**
 * DIODE · Collections digitization — a documentary walkthrough of the
 * volunteer work: what's at stake (the label stays with its specimen), the
 * imaging workstation drawn whole with its parts named, then three chapters
 * on one ruled spine — one tray position enlarged beside the preparation,
 * the laptop's two BugBase screens beneath the capture, and the rehousing —
 * what draws me to it, and the lab and tools credited as a museum label would.
 *
 * Paragraphs carry what I do; the notes carry what is visible
 * (content/amnh-diode-art.ts). The illustrations sit directly on the page.
 */
export default function DiodePage() {
  const [prep, capture, rehouse] = d.chapters;

  return (
    <AmnhShell
      drawer="amnh/diode"
      className="am-diode"
      pager={<Pager slug="amnh/diode" sibling={{ href: AMNH_ROUTES.behavioral, title: "Chaeteessa · Behavioral research" }} />}
    >
      <Hero
        crumbs={[{ href: "/#now", label: "Work" }, { href: AMNH_ROUTES.overview, label: "AMNH" }, { label: "DIODE" }]}
        title={d.title}
        subtitle={d.subtitle}
        aside={<Facts facts={d.facts} />}
      >
        {/* the three chapters, indexed up front */}
        <nav className="am-chapters" aria-label="The process">
          <ol>
            {d.chapters.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`}>
                  <span className="am-chapters__n" aria-hidden="true">
                    {c.n}
                  </span>
                  {c.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Hero>

      <section className="container am-intro" aria-labelledby={d.intro.id}>
        <h2 className="am-h2" id={d.intro.id}>
          {d.intro.heading}
        </h2>
        <div className="am-intro__body">
          <p className="am-lead">{d.intro.paragraphs[0]}</p>
          {d.intro.paragraphs.slice(1).map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      {/* the workstation, whole: the page's principal illustration */}
      <section className="container dw-spread" aria-label="The imaging workstation">
        <WorkstationFigure />
      </section>

      {/* the walkthrough: three chapters on one ruled spine */}
      <ol className="container am-walk">
        {d.chapters.map((c) => (
          <li key={c.id} className={`am-step am-step--${c.id}`}>
            <article id={c.id} className="am-step__inner" aria-labelledby={`${c.id}-h`}>
              <p className="am-step__n" aria-hidden="true">
                {c.n}
              </p>
              <div className="am-step__text">
                <h2 className="am-step__h" id={`${c.id}-h`}>
                  <span className="visually-hidden">{c.n} · </span>
                  {c.heading}
                </h2>
                <div className="am-prose">
                  {c.paragraphs.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </div>
              {c.id === prep.id ? (
                // the plate at a comfortable size, its notes beside it, and the
                // chapter's one principle as a quiet closing note
                <AnnotatedArt
                  id="dw-tray"
                  className="am-step__plate dw-art--tray"
                  notes={tray.notes}
                  // eslint-disable-next-line @next/next/no-img-element -- an SVG drawing, served as is
                  art={<img className="dw-tray__img" src={tray.src} alt="" width={tray.width} height={tray.height} decoding="async" />}
                  label={tray.alt}
                  ratio={tray.width / tray.height}
                  extra={c.pull ? <p className="dw-closing">{c.pull}</p> : null}
                  caption={
                    <>
                      <span className="dw-caption__label">{tray.label}.</span> {tray.caption}
                    </>
                  }
                />
              ) : null}
              {c.id === capture.id ? (
                <div className="am-step__plate">
                  <LaptopDetail />
                </div>
              ) : null}
              {c.id === rehouse.id ? <Avatar pose="copyStand" role="am-capture" /> : null}
            </article>
          </li>
        ))}
      </ol>

      <section className="container am-draws" aria-labelledby={d.draws.id}>
        <h2 className="am-h2" id={d.draws.id}>
          {d.draws.heading}
        </h2>
        <div className="am-prose am-draws__body">
          {d.draws.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      <section className="container am-credits-wrap" aria-labelledby={d.credits.id}>
        <div className="am-credits">
          <h2 className="am-credits__h" id={d.credits.id}>
            {d.credits.heading}
          </h2>
          <div className="am-credits__body">
            {d.credits.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
      </section>
    </AmnhShell>
  );
}
