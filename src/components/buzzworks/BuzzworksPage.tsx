import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import OnThisPage from "@/components/OnThisPage";
import Reconstruction from "./Reconstruction";
import { buzzworks, buzzworksSections } from "@/content/buzzworks";
import "../case/case.css";
import "./buzzworks.css";

/**
 * Buzzworks — told in the portfolio's own paper, serif and thread, with
 * Buzzworks' orange used sparingly (markers, the highlighter, the selected
 * state) and WhatsApp's green kept inside the reconstruction.
 *
 *   1. what it is, and my part (sole developer of the conversational app)
 *   2. explore the experience: four fictional journeys in one window
 *   3. the UX decisions, set as a short index
 *   4. behind the conversation: the conceptual architecture
 *   5. engineering decisions: the two-stage policy workflow, uploads as tasks
 *   6. deployment, tools, lessons
 * Three visuals only (the reconstruction and two diagrams), as the notes ask.
 */

/** emphasise words already in the sentence (ownership, the rollout status) */
function Marked({ text, words }: { text: string; words: string[] }) {
  const parts: React.ReactNode[] = [];
  let rest = text;
  for (const w of words) {
    const i = rest.indexOf(w);
    if (i < 0) continue;
    parts.push(rest.slice(0, i), <mark key={w} className="bz-mark">{w}</mark>);
    rest = rest.slice(i + w.length);
  }
  parts.push(rest);
  return <>{parts}</>;
}

/** the confirmed relationships, and only those; drawn as a concept */
function SystemDiagram() {
  return (
    <figure className="bz-system" aria-labelledby="bz-system-cap">
      <ol className="bz-arch">
        <li className="bz-arch__host" aria-hidden="true">
          <span className="bz-arch__host-label">AWS EC2 · services packaged with Docker</span>
        </li>
        <li className="bz-node bz-node--edge">
          <span className="bz-node__name">Employee or candidate</span>
          <span className="bz-node__note">in WhatsApp</span>
        </li>
        <li className="bz-node">
          <span className="bz-node__name">Messaging integration</span>
          <span className="bz-node__note">Meta WhatsApp Business APIs · Wacto · webhooks</span>
        </li>
        <li className="bz-node bz-node--core">
          <span className="bz-node__name">Workflow logic</span>
          <span className="bz-node__note">Redis-backed state machine · task handlers</span>
        </li>
        <li className="bz-node">
          <span className="bz-node__name">Backend API interactions</span>
          <span className="bz-node__note">Veytan and company APIs</span>
        </li>
        <li className="bz-node bz-node--edge">
          <span className="bz-node__name">Company systems</span>
          <span className="bz-node__note">and document operations</span>
        </li>
      </ol>
      <figcaption id="bz-system-cap" className="bz-system__caption">
        <span className="visually-hidden">The three services in the middle are packaged with Docker and hosted on AWS EC2. </span>
        Conceptual diagram, simplified to the relationships described on this page. It is not a deployment or network map.
      </figcaption>
    </figure>
  );
}

/** the two-stage policy workflow, as the copy describes it */
function PolicyDiagram() {
  return (
    <figure className="bz-system bz-policy" aria-labelledby="bz-policy-cap">
      <ol className="bz-flow">
        <li className="bz-node bz-node--edge">
          <span className="bz-node__name">The question</span>
          <span className="bz-node__note">with document titles and descriptions</span>
        </li>
        <li className="bz-node bz-node--core">
          <span className="bz-node__stage">Stage 1 · Claude</span>
          <span className="bz-node__name">Selects relevant files</span>
        </li>
        <li className="bz-node">
          <span className="bz-node__name">Content API</span>
          <span className="bz-node__note">retrieves the selected documents and returns their processed, chunked content</span>
        </li>
        <li className="bz-node bz-node--core">
          <span className="bz-node__stage">Stage 2 · Claude</span>
          <span className="bz-node__name">Answers using the returned content</span>
        </li>
        <li className="bz-node bz-node--edge">
          <span className="bz-node__name">The answer</span>
          <span className="bz-node__note">delivered in WhatsApp</span>
        </li>
      </ol>
      <figcaption id="bz-policy-cap" className="bz-system__caption">
        Selection before answering: the first stage reads titles and descriptions, the second only the selected documents’ processed content, as returned by the content API.
      </figcaption>
    </figure>
  );
}

export default function BuzzworksPage() {
  const b = buzzworks;
  const period = b.meta.find((m) => m.label === "Period")!;
  const facts = b.meta.filter((m) => m.label !== "Period");
  const d = b.decisions;

  return (
    <div className="detail theme-default theme-buzzworks" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" drawer="buzzworks" />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero case-hero bz-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#selected-work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{b.name}</span>
            </nav>
            <div className="bz-hero__grid">
              <div className="bz-hero__main">
                {/* the supplied minimal symbol and the name in the page's own type (not a lockup), with the dates */}
                <div className="case-hero__id">
                  <p className="bz-brand">
                    <Image className="bz-brand__mark" src="/logos/buzzworks-minimal.png" alt="" width={162} height={152} unoptimized preload />
                    <span className="bz-brand__name">Buzzworks</span>
                  </p>
                  <p className="bz-hero__dates">
                    <span className="visually-hidden">{period.label}: </span>
                    {period.value}
                  </p>
                </div>
                <h1 className="detail-hero__title bz-hero__title">
                  <span data-line="title">{b.title}</span>
                </h1>
                <p className="detail-hero__subtitle bz-hero__subtitle">{b.subtitle}</p>
              </div>
              <dl className="bz-facts" data-line="flourish" data-flourish="tag">
                {facts.map((m) => (
                  <div key={m.label} className="bz-facts__item">
                    <dt className="label">{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        <div className="container case-layout">
          <div className="case-rail">
            <div className="case-rail__inner">
              <OnThisPage items={buzzworksSections} />
            </div>
          </div>

          <div className="case-content">
            {/* 1. the product, and my part in it */}
            <section className="bz-section bz-intro" id={b.intro.id} aria-labelledby={`${b.intro.id}-title`}>
              <h2 className="bz-h2" id={`${b.intro.id}-title`}>
                {b.intro.heading}
              </h2>
              <div className="bz-intro__grid">
                <div className="bz-prose">
                  <p>{b.intro.paragraphs[0]}</p>
                  <p>{b.intro.paragraphs[1]}</p>
                  <p>
                    <Marked text={b.intro.paragraphs[2]} words={["sole developer"]} />
                  </p>
                </div>
                <Avatar pose="typingDesk" role="bz-desk" />
              </div>
            </section>

            {/* 2. four journeys, one window */}
            <section className="bz-section bz-explore" id={b.explore.id} aria-labelledby={`${b.explore.id}-title`}>
              <h2 className="bz-h2" id={`${b.explore.id}-title`}>
                {b.explore.heading}
              </h2>
              <div className="bz-prose">
                {b.explore.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Reconstruction />
            </section>

            {/* 3. the UX decisions, prominent */}
            <section className="bz-section bz-design" id={b.design.id} aria-labelledby={`${b.design.id}-title`}>
              <h2 className="bz-h2" id={`${b.design.id}-title`}>
                {b.design.heading}
              </h2>
              <div className="bz-decisions">
                {b.design.decisions.map((x) => (
                  <div key={x.heading} className="bz-decision">
                    <h3 className="bz-h3">{x.heading}</h3>
                    <div className="bz-prose">
                      {x.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. the system */}
            <section className="bz-section bz-behind" id={b.behind.id} aria-labelledby={`${b.behind.id}-title`}>
              <h2 className="bz-h2" id={`${b.behind.id}-title`}>
                {b.behind.heading}
              </h2>
              <div className="bz-prose">
                {b.behind.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <SystemDiagram />
            </section>

            {/* 5. engineering decisions */}
            <section className="bz-section bz-engineering" id={d.id} aria-labelledby={`${d.id}-title`}>
              <h2 className="bz-h2" id={`${d.id}-title`}>
                {d.heading}
              </h2>
              <div className="bz-part">
                <h3 className="bz-h3">{d.policy.heading}</h3>
                <div className="bz-prose">
                  {d.policy.paragraphs.slice(0, 2).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <PolicyDiagram />
                <div className="bz-prose">
                  <p>{d.policy.paragraphs[2]}</p>
                </div>
              </div>
              <div className="bz-part">
                <h3 className="bz-h3">{d.upload.heading}</h3>
                <p className="bz-part__contrast">{d.upload.paragraphs[0]}</p>
                <div className="bz-prose">
                  {d.upload.paragraphs.slice(1).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. deployment, tools, lessons */}
            <section className="bz-section bz-deploy" id={b.deployment.id} aria-labelledby={`${b.deployment.id}-title`}>
              <h2 className="bz-h2" id={`${b.deployment.id}-title`}>
                {b.deployment.heading}
              </h2>
              <div className="bz-prose">
                {b.deployment.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="bz-status">
                <Marked text={b.deployment.rollout} words={["being prepared for integration"]} />
              </p>
            </section>

            <section className="bz-section" id={b.tools.id} aria-labelledby={`${b.tools.id}-title`}>
              <h2 className="bz-h2" id={`${b.tools.id}-title`}>
                {b.tools.heading}
              </h2>
              <div className="bz-table-wrap">
                <table className="bz-table">
                  <thead>
                    <tr>
                      {b.tools.columns.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.tools.rows.map(([area, tools]) => (
                      <tr key={area}>
                        <th scope="row">{area}</th>
                        <td>{tools}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bz-section bz-takeaways" id={b.takeaways.id} aria-labelledby={`${b.takeaways.id}-title`}>
              <h2 className="bz-h2" id={`${b.takeaways.id}-title`}>
                {b.takeaways.heading}
              </h2>
              <p className="bz-lead">{b.takeaways.paragraphs[0]}</p>
              <div className="bz-prose">
                <p>{b.takeaways.paragraphs[1]}</p>
              </div>
            </section>
          </div>
        </div>

        <WorkPager slug={"buzzworks"} />
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
