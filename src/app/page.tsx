import { Fragment } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HomeScribble from "@/components/HomeScribble";
import SiteFooter from "@/components/SiteFooter";
import SmoothAnchors from "@/components/SmoothAnchors";
import Image from "next/image";
import { withGenus } from "@/components/amnh/genus";
import { LynxsterMark } from "@/components/Logo";
import { ContactList } from "@/components/ContactList";
import WorkPanels from "@/components/WorkPanels";
import PhotoStack from "@/components/wildlife/PhotoStack";
import { homepagePhotos } from "@/content/wildlife";
import ThreadPreview from "@/components/ThreadPreview";
import DotField from "@/components/DotField";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import HeroRig from "@/components/HeroRig";
import HeroLinks from "@/components/HeroLinks";
import HeroLede from "@/components/HeroLede";
import EdgePeeker from "@/components/EdgePeeker";
import { Marked } from "@/components/Mark";
import MarkStage from "@/components/MarkStage";
import TrajectoryPicker from "@/components/TrajectoryPicker";
import CopyEmail from "@/components/CopyEmail";
import type { Metadata } from "next";
import { hero, about, trajectory, currently, selectedWork, more, contact, person, site } from "@/content/site";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({ title: `${person.name} — ${hero.tagline}`, description: `${hero.intro} ${hero.location}`, path: "/" });

/**
 * Who this site is about, for search engines (schema.org JSON-LD): the name,
 * the roles and places already stated on this page, and the profiles it
 * links to, so a search for the name can find this as her own site. Only
 * facts the page itself shows.
 */
const PROFILES = contact.links.flatMap((l) => (l.url ? [l.url] : []));
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: person.name,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: person.name,
      url: site.url,
      email: `mailto:${person.email}`,
      image: `${site.url}/opengraph-image`,
      description: `${hero.intro} ${hero.location}`,
      jobTitle: "Chief Technology Officer & Co-founder",
      worksFor: { "@type": "Organization", name: "Lynxster" },
      affiliation: [
        { "@type": "CollegeOrUniversity", name: "Barnard College" },
        { "@type": "Museum", name: "American Museum of Natural History" },
      ],
      address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
      knowsAbout: ["Software engineering", "Full-stack development", "Cryptography", "Artificial intelligence", "Natural history collections", "Wildlife photography"],
      sameAs: PROFILES,
    },
  ],
};

/** A hairline opening each section. The headings carry the sections on their
 * own (the header nav names them); the rule gives the line a landmark. */
function SectionRule({ line }: { line: string }) {
  return <div className="section-rule" data-line={line} aria-hidden="true" />;
}

export default function Home() {
  return (
    <div className="home" data-line-root id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
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
            {/* three sentences; a line only ever breaks between them */}
            <p className="hero__tagline">
              {hero.tagline.split(/(?<=\.)\s+/).map((part, i, all) => (
                <Fragment key={part}>
                  <span className="hero__tagline-part">{part}</span>
                  {i < all.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
            <div className="hero__intro" data-line="hero-intro">
              {/* what she does, in ink, then how she works, in her own words */}
              <HeroLede />
              <div className="hero__act">
                <HeroLinks />
                <p className="label hero__location">{hero.location}</p>
              </div>
            </div>
            {/* she sits on the line: its run is routed through her seat (perch-l → perch-r);
                a layered rig, so her feet and her matcha can move (HeroRig) */}
            <div className="hero__perch" data-line="hero-slot">
              <HeroRig />
            </div>
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
              <span data-line="about-heading">
                <Marked text={about.heading} word="straightforward" kind="strike" />
              </span>
            </h2>

            <figure className="trajectory" data-line="traj" aria-labelledby="trajectory-title">
              <h3 id="trajectory-title" className="visually-hidden">
                {trajectory.srHeading}
              </h3>
              <div className="trajectory__band" data-line="traj-band" aria-hidden="true" />
              <ol className="trajectory__list">
                {trajectory.points.map((p, i) => (
                  <li key={p.title} className="trajectory__item">
                    {/* pick a milestone: the highlight moves to it, its aside appears below */}
                    <button type="button" className="trajectory__point" data-line="traj-point" data-i={i} aria-pressed="false">
                      <span className="trajectory__tick" aria-hidden="true" />
                      <span className="label trajectory__n">{String(i + 1).padStart(2, "0")}</span>
                      {/* the swipe is on an inline run, so a two-line title gets it under each line */}
                      <span className="trajectory__title">
                        <span className="trajectory__ink">{p.title}</span>
                      </span>
                      <span className="trajectory__caption">{p.caption}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="trajectory__end" data-line="traj-end">
                {trajectory.continuing}
              </p>
              {/* a margin note for the picked (or the reached) milestone, in space
                  reserved for it: lines quoted from the About text below */}
              <div className="trajectory__aside" aria-hidden="true">
                <svg className="trajectory__aside-arrow" viewBox="0 0 40 46" focusable="false">
                  <path d="M22 44c-6-10-9-22-6-34M10 16c3-4 5-8 6-12 2 4 5 7 9 9" />
                </svg>
                {trajectory.points.map((p, i) =>
                  p.aside ? (
                    <span key={p.title} className="trajectory__aside-text" data-i={i}>
                      {/^[A-Z]/.test(p.aside) ? "" : "…"}
                      {p.aside}
                      {/[.!?]$/.test(p.aside) ? "" : "…"}
                    </span>
                  ) : null,
                )}
              </div>
              <TrajectoryPicker />
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
          <div className="section currently" id="now" data-line="current">
            <div className="container">
            <SectionRule line="current-label" />
              <h2 className="section-heading">
                <span data-line="current-heading">
                  <Marked text={currently.heading} word="threads" kind="circle" />
                </span>
              </h2>
              <div className="features">
                {/* stands above the AMNH preview holding the thread up: the line runs into her fist */}
                <Avatar pose="untangling" role="untangling" enterAt={0.97} probes={{ fist: "untangle-fist", foot: "untangle-foot" }} />
                {currently.features.map((f) => {
                  return (
                    <article key={f.slug} className={`feature feature--${f.slug}`} data-line="feature">
                      {/* the preview also opens the page: a duplicate of the title link,
                          so it is skipped by keyboard and screen readers */}
                      <Link href={`/work/${f.slug}`} className="feature__visual" tabIndex={-1} aria-hidden="true">
                        {/* the mark drawn in thread over a scrap of its colour */}
                        <ThreadPreview which={f.slug} caption={f.preview} />
                      </Link>
                      <div className="feature__body">
                        {/* caption line: the organisation's own mark is the heading, set
                            inline with role and dates — no second name treatment */}
                        <div className="feature__caption">
                        <h3 className="feature__title">
                          {/* the organisation's mark is the title, and a link to its page */}
                          <Link href={`/work/${f.slug}`} className="feature__title-link">
                            {f.slug === "lynxster" ? (
                              // the mark alone (the preview above carries the wordmark)
                              <LynxsterMark className="feature__mark" label="Lynxster" />
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
                          </Link>
                        </h3>
                        <p className="feature__meta">
                          {f.role}
                          <span className="visually-hidden">, </span>
                          <span className="feature__period">{f.period}</span>
                        </p>
                        {"status" in f && f.status ? (
                          <p className="feature__status">
                            <span className="lx-status-pill">
                              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                                <circle cx="8" cy="8" r="6" />
                                <circle cx="8" cy="8" r="2.6" />
                              </svg>
                              {f.status}
                            </span>
                          </p>
                        ) : null}
                        </div>
                        {"description" in f && f.description ? <p className="feature__desc">{f.description}</p> : null}
                        {"streams" in f && f.streams ? (
                          // two rows inside the one commitment, each with its own line
                          <ul className="feature__streams">
                            {f.streams.map((st) => (
                              <li key={st.name} className="feature__stream">
                                {"href" in st && st.href ? (
                                  // a project with its own page (AMNH's two)
                                  <Link href={st.href} className="feature__stream-name feature__stream-link">
                                    {withGenus(st.name)}
                                    <span aria-hidden="true"> →</span>
                                  </Link>
                                ) : (
                                  <span className="feature__stream-name">{st.name}</span>
                                )}
                                <span className="feature__stream-text">{withGenus(st.text)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <p className="feature__foot">
                          <Link href={`/work/${f.slug}`} className="feature__cta">
                            {f.cta}
                            <span className="feature__arrow" aria-hidden="true">
                              →
                            </span>
                          </Link>
                          {/* a pencilled arrow back at the link, on hover / focus */}
                          <svg className="feature__nudge" viewBox="0 0 64 30" aria-hidden="true" focusable="false">
                            <path d="M60 20c-12 6-28 7-40 0-5-3-8-7-9-11" pathLength={1} />
                            <path d="M4 14l7-6 5 8" pathLength={1} />
                          </svg>
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------ Work: Selected */}
          <div className="section selected" id="selected-work" data-line="selected">
            <div className="container">
            <SectionRule line="selected-label" />
              <h2 className="section-heading">
                <span data-line="selected-heading">
                  <Marked text={selectedWork.heading} word="worked on" kind="underline" />
                </span>
              </h2>
              <div className="panels-stage">
                <WorkPanels rows={selectedWork.rows} />
                {/* peeking in from the right edge of the screen, in her own lane */}
                <EdgePeeker />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- More */}
        <section id="more" className="section more" data-line="more" aria-labelledby="more-heading">
          <div className="container">
            <SectionRule line="more-label" />
            {/* photography, why it matters to her, and three of the photographs */}
            <div className="more__grid">
              <div className="more__copy">
                <h2 className="section-heading" id="more-heading">
                  <span data-line="more-heading">
                    <Marked text={more.heading} word="afield" kind="highlight" />
                  </span>
                </h2>
                <div className="more__intro">
                  {more.intro.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
                <p className="more__go">
                  <Link href={more.cta.href} className="more__link">
                    {more.cta.label}
                    <span className="more__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </p>
              </div>
              <PhotoStack photos={homepagePhotos} href={more.cta.href} label="Wildlife photography: open the gallery" />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Contact */}
        <section id="contact" className="section contact" data-line="contact" aria-labelledby="contact-heading">
          <div className="container">
            <SectionRule line="contact-label" />
            <h2 className="section-heading contact__heading" id="contact-heading">
              <span data-line="contact-heading">{contact.heading}</span>
              {/* she stands on the line's last stretch, beside the words, waving —
                  settled as the section arrives, before the line reaches her */}
              <Avatar pose="waving" role="greeting" enterAt={1} enterOn=".contact" />
            </h2>
            <div className="contact__grid">
              <div>
                <p className="contact__intro">{contact.intro}</p>
                <p className="contact__address">
                  <a className="contact__email" href={`mailto:${person.email}`}>
                    {person.email}
                    <span className="contact__email-go" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                  <CopyEmail email={person.email} />
                </p>
              </div>
              <ContactList links={contact.links} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter toTop />
      <AvatarStage />
      <MarkStage />
    </div>
  );
}
