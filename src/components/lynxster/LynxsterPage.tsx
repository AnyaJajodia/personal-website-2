import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import LynxsterWatch from "./LynxsterWatch";
import LynxsterAssembly from "./LynxsterAssembly";
import InView from "./InView";
import AssemblyPlayer from "./AssemblyPlayer";
import { lynxster } from "@/content/lynxster";
import { getNeighbours } from "@/content/work";
import "./lynxster-brand.css";
import "./lynxster.css";

/**
 * Lynxster — the portfolio's serif, navigation, drawer and thread inside
 * Lynxster's own world. Light: a near-white header band over a deeper cool
 * tint, navy marks. Dark: a near-black band over charcoal, teal marks.
 *
 *   band       title, subtitle, the facts (with "Patent pending"), and the
 *              watching mark (LynxsterWatch: glow, tilt, eyes on hover)
 *   stage      the assembled-records illustration, straddling band and body
 *   problem    an editorial spread: the problem large, the answer beside it
 *   path       Junior Developer → CTO & Co-founder on one thread, each stop
 *              with its own paragraph (no date is given for the change)
 *   areas      a ruled index of the four areas; the patent as its one note
 *   learning   a band in the header's colour, the reflection in the serif
 *   more       a short close
 * Copy: content/lynxster.ts (from lynxster.md).
 */

/** keep "Co-founder" whole when a role wraps (a non-breaking hyphen) */
const nb = (s: string) => s.replace(/-/g, "\u2011");

const RING = (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6" />
    <circle cx="8" cy="8" r="2.6" />
  </svg>
);

function Pill() {
  return (
    <span className="lx-pill">
      {RING}
      {lynxster.status}
    </span>
  );
}

/** one quiet line drawing per area — abstract, never a depiction of the system */
const AREA_ICONS: Record<string, React.ReactNode> = {
  engineering: <path d="M12 3.5 20 7.5 12 11.5 4 7.5Z M4 11.5l8 4 8-4 M4 15.5l8 4 8-4" />,
  cryptography: <path d="M8.5 13.5a4.5 4.5 0 1 1 3.4-1.6L20 20 M16.5 16.5l2-2 M18.5 18.5l1.5-1.5" />,
  agents: <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z M18.5 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" />,
  communication: <path d="M6.5 3.5h8l4 4v13h-12Z M14.5 3.5v4h4 M9.5 11.5h6 M9.5 14.5h6 M9.5 17.5h3.5" />,
};

export default function LynxsterPage() {
  const { prev, next } = getNeighbours("lynxster");
  const t = lynxster;
  const [lead, ...rest] = t.problem.paragraphs[0].split(/(?<=\.)\s+/);

  return (
    <div className="detail theme-lx" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="lynxster" />} />
      <DetailLine theme="lynxster" />
      <main id="main" className="detail__main">
        {/* ----------------------------------------------- the header band */}
        <LynxsterWatch className="lx-band" data-line="top" data-eyes="closed">
          <div className="container lx-band__inner" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{t.name}</span>
            </nav>
            <div className="lx-band__grid">
              <div className="lx-band__text">
                <h1 className="lx-title">
                  <span data-line="title">{t.title}</span>
                </h1>
                <p className="lx-subtitle">{t.subtitle}</p>
                <dl className="lx-meta">
                  <div>
                    <dt className="label">Role</dt>
                    <dd>{nb(t.role)}</dd>
                  </div>
                  <div>
                    <dt className="label">Period</dt>
                    <dd>{t.period}</dd>
                  </div>
                  <div>
                    <dt className="label">Status</dt>
                    <dd>
                      <Pill />
                    </dd>
                  </div>
                </dl>
              </div>
              {/* the watching mark, hung from the thread like a tag (DetailLine) */}
              <div className="lxb lx-watch" data-watch-mark data-line="flourish" data-flourish="tag" role="img" aria-label="Lynxster">
                <div className="lx-watch__tilt">
                  <span className="lxb-mark" />
                  <svg className="lx-watch__eyes" viewBox="0 0 1138 844" aria-hidden="true" focusable="false">
                    <ellipse cx="420" cy="512" rx="22" ry="9" />
                    <ellipse cx="718" cy="508" rx="22" ry="9" />
                  </svg>
                </div>
                <span className="lxb-word lx-watch__word" aria-hidden="true">
                  lynxster
                </span>
              </div>
            </div>
          </div>
        </LynxsterWatch>

        {/* the illustration starts in the band and carries over its edge */}
        <div className="lx-stage">
          {/* it assembles once the whole illustration is in view; hovering it
              afterwards replays the seal's ripples */}
          <AssemblyPlayer className="container">
            <LynxsterAssembly />
          </AssemblyPlayer>
        </div>

        <div className="container lx-body">
          {/* ---------------------------------------------------- the problem */}
          <section className="lx-problem" aria-labelledby="lx-problem">
            <h2 className="lx-label" id="lx-problem">
              {t.problem.heading}
            </h2>
            <div className="lx-problem__text">
              <p className="lx-problem__lead">{lead}</p>
              <p className="lx-problem__big">{rest.join(" ")}</p>
            </div>
            <div className="lx-problem__answer">
              <span className="lxb lx-problem__mark" aria-hidden="true">
                <span className="lxb-mark" />
              </span>
              <p>{t.problem.statement}</p>
            </div>
          </section>

          {/* ------------------------------------------- developer → co-founder */}
          <section className="lx-path" aria-labelledby="lx-path">
            <h2 className="lx-h2" id="lx-path">
              {t.progression.heading}
            </h2>
            <InView className="lx-path__track">
              {/* the thread between the two, drawn once as it comes into view */}
              {/* from the first dot's centre to the second's, with one loop on the way;
                  past today it carries on, dashed */}
              <svg className="lx-path__line" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M0 20 C 220 20 400 20 520 20 C 560 20 578 3 562 1 C 545 -1 541 19 562 23 C 610 31 760 20 1000 20" pathLength={1} vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="lx-path__onward" aria-hidden="true" />
              <ol className="lx-path__stops">
                <li className="lx-path__stop lx-path__stop--from">
                  <span className="lx-path__when">{t.progression.from.when}</span>
                  <span className="lx-path__role">{t.progression.from.role}</span>
                  <p>{t.progression.paragraphs[0]}</p>
                </li>
                <li className="lx-path__stop lx-path__stop--to">
                  <span className="lx-path__when">{t.progression.to.when}</span>
                  <span className="lx-path__role">{nb(t.progression.to.role)}</span>
                  <p>{t.progression.paragraphs[1]}</p>
                </li>
              </ol>
            </InView>
          </section>

          {/* -------------------------------------------------- what I work on */}
          <section className="lx-areas" aria-labelledby="lx-areas">
            <h2 className="lx-h2" id="lx-areas">
              {t.areas.heading}
            </h2>
            <ul className="lx-areas__list">
              {t.areas.items.map((a) => (
                <li key={a.key} className="lx-area">
                  <span className="lx-area__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      {AREA_ICONS[a.key]}
                    </svg>
                  </span>
                  <h3 className="lx-area__title">{a.title}</h3>
                  <div className="lx-area__body">
                    <p>{a.text}</p>
                    {"note" in a && a.note ? (
                      <p className="lx-area__note">
                        <Pill />
                        <span>{a.note}</span>
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ------------------------------------------- what I'm learning (band) */}
        <section className="lx-learning" aria-labelledby="lx-learning">
          {/* writing it down: a figure with her notebook, on the band's top edge */}
          <div className="container lx-learning__inner">
            <Avatar pose="notebook" role="lx-notes" />
            <h2 className="lx-h2" id="lx-learning">
              {t.learning.heading}
            </h2>
            <div className="lx-learning__text">
              {t.learning.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- more to come */}
        <section className="container lx-more" aria-labelledby="lx-more">
          <h2 className="lx-label" id="lx-more">
            {t.more.heading}
          </h2>
          <p>{t.more.text}</p>
        </section>

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
