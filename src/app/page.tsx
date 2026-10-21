import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HomeScribble from "@/components/HomeScribble";
import SiteFooter from "@/components/SiteFooter";
import SmoothAnchors from "@/components/SmoothAnchors";
import Image from "next/image";
import RigDrawing from "@/components/RigDrawing";
import { LynxsterLockup } from "@/components/Logo";
import { ContactList } from "@/components/ContactList";
import WorkPanels from "@/components/WorkPanels";
import MoreBento from "@/components/MoreBento";
import DotField from "@/components/DotField";
import { hero, about, trajectory, currently, selectedWork, more, contact, person } from "@/content/site";
import { getWork, formatPeriod } from "@/content/work";

/** A hairline opening each section. The headings carry the sections on their
 * own (the header nav names them); the rule gives the line a landmark. */
function SectionRule({ line }: { line: string }) {
  return <div className="section-rule" data-line={line} aria-hidden="true" />;
}

export default function Home() {
  return (
    <div className="home" data-line-root id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SmoothAnchors />
      <SiteHeader variant="home" />
      {/* faint dot fields behind the hero and Contact, under the line */}
      <DotField target='[data-line="hero"]' />
      <DotField target='[data-line="contact"]' />
      <HomeScribble />
      <main id="main" className="home__main">
        {/* ---------------------------------------------------------- Hero */}
        <section className="hero" data-line="hero" aria-labelledby="hero-name">
          <div className="container hero__inner">
            <h1 className="hero__name" id="hero-name" data-line="hero-name">
              <span className="hero__line">
                {hero.nameLines[0]}
                {/* zero-size probe on the baseline: where the line leaves the "a" */}
                <span className="hero__name-end" data-line="name-end" aria-hidden="true" />
              </span>{" "}
              <span className="hero__line">{hero.nameLines[1]}</span>
            </h1>
            <p className="hero__tagline">{hero.tagline}</p>
            <div className="hero__intro" data-line="hero-intro">
              <p>{hero.intro}</p>
              <p className="label hero__location">{hero.location}</p>
            </div>
            {/* held open for a future avatar: empty and invisible; the line keeps clear of it */}
            <div className="hero__slot" data-line="hero-slot" aria-hidden="true" />
          </div>
          <div className="container hero__cue-wrap">
            <a className="hero__cue label" href="#about" data-line="hero-cue">
              {hero.scrollCue} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        {/* --------------------------------------------------------- About */}
        <section id="about" className="section about" data-line="about" aria-labelledby="about-heading">
          <div className="container" data-line="content">
            <SectionRule line="about-label" />
            <h2 className="section-heading about__heading" id="about-heading">
              <span data-line="about-heading">{about.heading}</span>
            </h2>

            <figure className="trajectory" data-line="traj" aria-labelledby="trajectory-title">
              <h3 id="trajectory-title" className="visually-hidden">
                {trajectory.srHeading}
              </h3>
              <div className="trajectory__band" data-line="traj-band" aria-hidden="true" />
              <ol className="trajectory__list">
                {trajectory.points.map((p, i) => (
                  <li key={p.title} className="trajectory__point" data-line="traj-point">
                    <span className="trajectory__tick" aria-hidden="true" />
                    <span className="label trajectory__n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="trajectory__title">{p.title}</span>
                    <span className="trajectory__caption">{p.caption}</span>
                  </li>
                ))}
              </ol>
              <p className="trajectory__end" data-line="traj-end">
                {trajectory.continuing}
              </p>
            </figure>

            <div className="about__body">
              <div className="prose">
                {about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="about__aside">{about.aside}</p>
              </div>
              <div className="prose">
                {about.paragraphsAfter.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Work: Currently */}
        <section id="work" className="work" aria-label="Work">
          <div className="section currently" data-line="current">
            <div className="container">
            <SectionRule line="current-label" />
              <h2 className="section-heading">
                <span data-line="current-heading">{currently.heading}</span>
              </h2>
              <div className="features">
                {currently.features.map((f) => {
                  const entry = getWork(f.slug);
                  const period = entry?.period ? formatPeriod(entry.period) : null;
                  return (
                    <article key={f.slug} className={`feature feature--${f.slug}`} data-line="feature">
                      <div className="feature__visual">
                        {f.slug === "lynxster" ? (
                          <Image
                            className="feature__shot"
                            src="/work/lynxster-funnel.webp"
                            alt="The disclosure funnel in the Lynxster application"
                            width={1096}
                            height={532}
                            unoptimized
                            loading="eager"
                          />
                        ) : (
                          <div className="archive-card" aria-hidden="true">
                            <span className="archive-card__dept">Invertebrate Zoology</span>
                            <RigDrawing className="archive-card__rig" />
                          </div>
                        )}
                      </div>
                      <div className="feature__body">
                        {/* caption line: the organisation's own mark is the heading, set
                            inline with role and dates — no second name treatment */}
                        <div className="feature__caption">
                        <h3 className="feature__title">
                          {f.slug === "lynxster" ? (
                            <LynxsterLockup className="feature__lockup" />
                          ) : (
                            <Image
                              className="feature__wordmark"
                              src="/logos/amnh.png"
                              alt={f.name}
                              width={960}
                              height={209}
                              unoptimized
                              loading="eager"
                            />
                          )}
                        </h3>
                        <p className="feature__meta">
                          {entry?.role?.value}
                          {period ? <span className="feature__period">{period}</span> : null}
                        </p>
                        </div>
                        {"streams" in f && f.streams ? (
                          // two workstreams inside the one commitment, each with its own line
                          <ul className="feature__streams">
                            {f.streams.map((st) => (
                              <li key={st.name} className="feature__stream">
                                <span className="feature__stream-name">{st.name}</span>
                                <span className="feature__stream-text">{st.text}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="feature__desc">{f.description}</p>
                        )}
                        <p className="feature__foot">
                          <Link href={`/work/${f.slug}`} className="feature__cta">
                            {f.cta}
                            <span className="feature__arrow" aria-hidden="true">
                              →
                            </span>
                          </Link>
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------ Work: Selected */}
          <div className="section selected" data-line="selected">
            <div className="container">
            <SectionRule line="selected-label" />
              <h2 className="section-heading">
                <span data-line="selected-heading">{selectedWork.heading}</span>
              </h2>
              <WorkPanels rows={selectedWork.rows} />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- More */}
        <section id="more" className="section more" data-line="more" aria-labelledby="more-heading">
          <div className="container">
            <SectionRule line="more-label" />
            <div className="more__head">
              <h2 className="section-heading" id="more-heading">
                <span data-line="more-heading">{more.heading}</span>
              </h2>
              <p className="more__intro">{more.intro}</p>
            </div>
            <MoreBento items={more.items} />
            <p className="more__note">{more.note}</p>
          </div>
        </section>

        {/* ------------------------------------------------------- Contact */}
        <section id="contact" className="section contact" data-line="contact" aria-labelledby="contact-heading">
          <div className="container">
            <SectionRule line="contact-label" />
            <h2 className="section-heading contact__heading" id="contact-heading">
              <span data-line="contact-heading">{contact.heading}</span>
            </h2>
            <div className="contact__grid">
              <div>
                <p className="contact__intro">{contact.intro}</p>
                <a className="contact__email" href={`mailto:${person.email}`}>
                  {person.email} <span aria-hidden="true">↗</span>
                </a>
              </div>
              <ContactList links={contact.links} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter toTop />
    </div>
  );
}
