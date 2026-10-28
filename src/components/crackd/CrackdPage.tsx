import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage from "@/components/OnThisPage";
import { crackd, crackdSections } from "@/content/crackd";
import CrackdApps from "./CrackdApps";
import "../case/case.css";
import "./crackd.css";

/**
 * Crackd.ai — an engineering notebook in the portfolio's own hand: the serif,
 * the paper, the thread. Crackd's black and yellow appear only where they mean
 * something: its logo, the two chapter numbers, a highlighter, the matrix.
 *
 * The two dated phases are the spine. 01 (Sept–Dec 2025) is the shared
 * platform, set lightly on the page; 02 (Jan–May 2026) is my own build, on a
 * raised notebook sheet with an entry per application (CrackdApps), each with
 * its walkthrough. No screenshots on the page itself, and no architecture map.
 */

/** "Can a model learn to be funny?" with the highlighter on its last word */
function Title() {
  const [before, after] = crackd.title.split("funny");
  return (
    <>
      {before}
      <span className="ck-hl">funny</span>
      {after}
    </>
  );
}

/** a small drawn knot where the thread passes a chapter number */
function Knot() {
  return (
    <svg className="ck-knot" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M32 2c0 10-2 15-6 19-6 6-14 4-14 11s9 9 16 4c6-4 9-11 5-15-5-5-14 1-13 9 1 9 12 10 16 4 4-6-1-12-4-9" pathLength={1} />
      <path d="M33 38c-1 8-1 16-1 24" pathLength={1} />
    </svg>
  );
}

export default function CrackdPage() {
  const [p1, p2] = crackd.phases;
  const period = crackd.meta.find((m) => m.label === "Period")!;
  const facts = crackd.meta.filter((m) => m.label !== "Period");

  return (
    <div className="detail theme-default theme-crackd" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="crackd-ai" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero case-hero ck-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#selected-work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{crackd.name}</span>
            </nav>
            <div className="ck-hero__grid">
              <div className="ck-hero__main">
                {/* Crackd itself and its dates on one line, then the question */}
                <div className="case-hero__id">
                  {/* the real logo: white lettering, so it sits on its own black plate */}
                  <p className="ck-plate">
                    <Image className="ck-plate__logo" src="/logos/crackd.png" alt="Crackd" width={202} height={84} unoptimized preload />
                  </p>
                  <p className="ck-hero__dates">
                    <span className="visually-hidden">{period.label}: </span>
                    {period.value}
                  </p>
                </div>
                <h1 className="detail-hero__title ck-hero__title">
                  <span data-line="title">
                    <Title />
                  </span>
                </h1>
                <p className="detail-hero__subtitle ck-hero__subtitle">{crackd.subtitle}</p>
              </div>
              {/* the facts, hung from the thread like a tag (DetailLine) */}
              <dl className="ck-meta" data-line="flourish" data-flourish="tag">
                {facts.map((m) => (
                  <div key={m.label} className="ck-meta__item">
                    <dt className="label">{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        <div className="container case-layout">
          {/* the margin: where you are on this page (other work is in the header) */}
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={crackdSections} />
            </div>
          </div>

          <div className="case-content">
            {/* --------------------------------------------- what is Crackd */}
            <section className="ck-section ck-intro" id={crackd.intro.id} aria-labelledby={`${crackd.intro.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.intro.id}-title`}>
                {crackd.intro.heading}
              </h2>
              <div className="ck-prose">
                {crackd.intro.paragraphs.map((p) => (
                  <p key={p}>
                    {p.includes("“flavors,”") ? (
                      <>
                        {p.split("“flavors,”")[0]}
                        <span className="ck-term">“flavors,”</span>
                        {p.split("“flavors,”")[1]}
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>
              <p className="ck-bridge">
                {crackd.intro.bridge}
                <svg className="ck-bridge__arrow" viewBox="0 0 40 60" aria-hidden="true" focusable="false">
                  <path d="M10 2c14 10 20 26 14 50M16 44c3 4 6 7 8 10 3-4 6-7 10-9" />
                </svg>
              </p>
            </section>

            {/* ------------------------------------------------ the two phases */}
            <div className="ck-phases">
              <span className="ck-spine" aria-hidden="true" />

              <section className="ck-phase ck-phase--1" id={p1.id} aria-labelledby={`${p1.id}-title`}>
                <div className="ck-phase__marker">
                  <span className="ck-phase__n" aria-hidden="true">
                    <Knot />
                    {p1.n}
                  </span>
                  <p className="ck-phase__dates">{p1.dates}</p>
                </div>
                <div className="ck-phase__body">
                  <h2 className="ck-h2" id={`${p1.id}-title`}>
                    <span className="visually-hidden">
                      {p1.n} · {p1.dates}:{" "}
                    </span>
                    {p1.heading}
                  </h2>
                  <p className="ck-phase__lead">{p1.paragraphs[0]}</p>
                  <div className="ck-prose">
                    {p1.paragraphs.slice(1).map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </section>

              <section className="ck-phase ck-phase--2" id={p2.id} aria-labelledby={`${p2.id}-title`}>
                <div className="ck-phase__marker">
                  <span className="ck-phase__n" aria-hidden="true">
                    <Knot />
                    {p2.n}
                  </span>
                  <p className="ck-phase__dates">{p2.dates}</p>
                </div>
                <div className="ck-phase__body">
                  <div className="ck-sheet">
                    {/* building: sat on the sheet's top edge with her laptop */}
                    <Avatar pose="laptopFloor" role="ck-build" />
                    <h2 className="ck-h2" id={`${p2.id}-title`}>
                      <span className="visually-hidden">
                        {p2.n} · {p2.dates}:{" "}
                      </span>
                      {p2.heading}
                    </h2>
                    <div className="ck-prose ck-phase__intro">
                      {p2.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    <CrackdApps />
                  </div>
                </div>
              </section>
            </div>

            {/* --------------------------------------- inside the matrix */}
            <section className="ck-section ck-matrix" id={crackd.matrix.id} aria-labelledby={`${crackd.matrix.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.matrix.id}-title`}>
                {crackd.matrix.heading}
              </h2>
              <p className="ck-matrix__lead">{crackd.matrix.paragraphs[0]}</p>
              <div className="ck-prose">
                <p>{crackd.matrix.paragraphs[1]}</p>
              </div>
            </section>

            {/* ------------------------------------------- what I took */}
            <section className="ck-section ck-takeaways" id={crackd.takeaways.id} aria-labelledby={`${crackd.takeaways.id}-title`}>
              <h2 className="ck-h2" id={`${crackd.takeaways.id}-title`}>
                {crackd.takeaways.heading}
              </h2>
              <div className="ck-prose">
                {crackd.takeaways.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="ck-punchline">
                {crackd.takeaways.punchline.split("a fairly low bar")[0]}
                <span className="ck-hl ck-hl--late">a fairly low bar</span>
                {crackd.takeaways.punchline.split("a fairly low bar")[1]}
              </p>
            </section>

            {/* ------------------------------------------ tools + credit */}
            <section className="ck-section ck-colophon" id={crackd.tools.id} aria-labelledby={`${crackd.tools.id}-title`}>
              <h2 className="ck-h2 ck-h2--small" id={`${crackd.tools.id}-title`}>
                {crackd.tools.heading}
              </h2>
              <ul className="ck-tools">
                {crackd.tools.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="ck-credit">{crackd.tools.credit}</p>
            </section>
          </div>
        </div>

        <WorkPager slug={"crackd-ai"} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
