import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import OnThisPage from "@/components/OnThisPage";
import { buzzworks, buzzworksSections, type Message } from "@/content/buzzworks";
import { getNeighbours } from "@/content/work";
import "../case/case.css";
import "./buzzworks.css";

/**
 * Buzzworks — the employee's journey, told in the portfolio's own paper,
 * serif and thread, with Buzzworks' orange used sparingly (markers, a
 * highlighter, the selected state) and WhatsApp's green kept inside the one
 * illustrative conversation.
 *
 *   1. what it is, and what I owned
 *   2. one conversation (fictional, captioned as a reconstruction)
 *   3. the documented flows, as an index the conversation points into
 *   4. the system, as a conceptual diagram of the relationships the copy states
 *   5. the three difficult parts
 *   6. deployment, performance, tools, lessons
 */

const flowName = (id?: string) => buzzworks.capabilities.items.find((c) => c.id === id)?.name;

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

function Bubble({ m, i }: { m: Message; i: number }) {
  const flow = flowName(m.flow);
  const me = m.from === "employee";
  return (
    <li className={`bz-chat__row bz-chat__row--${m.from}`}>
      {flow ? (
        // a margin note: which documented flow this step illustrates
        <a className="bz-chat__note" href={`#${m.flow}`}>
          <span className="bz-chat__note-n" aria-hidden="true">
            {String(i).padStart(2, "0")}
          </span>
          <span className="visually-hidden">Illustrates: </span>
          {flow}
        </a>
      ) : null}
      <div className={`bz-bubble${me ? " bz-bubble--out" : ""}${m.attachment ? " bz-bubble--media" : ""}`}>
        <span className="visually-hidden">{me ? "Employee" : buzzworks.conversation.contact}: </span>
        {m.attachment ? (
          <span className="bz-bubble__media">
            {/* a generic document, never a real one */}
            <svg viewBox="0 0 120 76" aria-hidden="true" focusable="false">
              <rect x="1" y="1" width="118" height="74" rx="7" />
              <rect x="10" y="12" width="26" height="30" rx="3" className="bz-doc__photo" />
              <path d="M46 16h52M46 26h40M46 36h48M10 54h88M10 63h60" />
            </svg>
            <span className="bz-bubble__media-label">{m.attachment}</span>
          </span>
        ) : null}
        {m.text ? <span className="bz-bubble__text">{m.text}</span> : null}
        {m.list ? (
          <ol className="bz-bubble__list">
            {m.list.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
        ) : null}
        <span className="bz-bubble__meta" aria-hidden="true">
          {m.time}
          {me ? (
            <svg viewBox="0 0 18 11" focusable="false">
              <path d="M1 6l3 3 6-7M7 9l1 1 6-8" />
            </svg>
          ) : null}
        </span>
      </div>
      {m.replies ? (
        <ul className="bz-replies" aria-label="Quick replies">
          {m.replies.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Conversation() {
  const c = buzzworks.conversation;
  let n = 0;
  return (
    <figure className="bz-chat" aria-labelledby={`${c.id}-title`}>
      <div className="bz-chat__phone">
        <div className="bz-chat__bar" aria-hidden="true">
          <span className="bz-chat__avatar">HR</span>
          <span className="bz-chat__who">
            <span className="bz-chat__name">{c.contact}</span>
            <span className="bz-chat__status">Illustration</span>
          </span>
        </div>
        <ol className="bz-chat__log" aria-label={`${c.label} (fictional)`}>
          {c.messages.map((m, i) => (
            <Bubble key={i} m={m} i={m.flow ? ++n : 0} />
          ))}
        </ol>
      </div>
      <figcaption className="bz-chat__caption">
        <span className="bz-chat__tag">Illustration</span>
        {c.caption}
      </figcaption>
    </figure>
  );
}

/** the relationships the copy states, and only those; drawn as a concept */
function SystemDiagram() {
  return (
    <figure className="bz-system" aria-labelledby="bz-system-cap">
      <div className="bz-system__frame">
        <p className="bz-system__frame-label">Modular services packaged with Docker · AWS EC2</p>
        <ol className="bz-system__flow">
          <li className="bz-node bz-node--edge">
            <span className="bz-node__name">Employee</span>
            <span className="bz-node__note">in WhatsApp</span>
          </li>
          <li className="bz-node">
            <span className="bz-node__name">Messaging integration</span>
            <span className="bz-node__note">Meta WhatsApp Business APIs · Wacto · webhooks</span>
          </li>
          <li className="bz-node bz-node--core">
            <span className="bz-node__name">Conversational workflow logic</span>
            <span className="bz-node__note">Redis-backed state machine · task handlers</span>
          </li>
          <li className="bz-node">
            <span className="bz-node__name">Backend API interactions</span>
            <span className="bz-node__note">Veytan and company REST APIs</span>
          </li>
          <li className="bz-node bz-node--edge">
            <span className="bz-node__name">Company systems</span>
            <span className="bz-node__note">account information, tasks, forms, and document operations</span>
          </li>
        </ol>
        <ul className="bz-system__also" aria-label="Also part of the application">
          <li>
            <span className="bz-system__also-k">Policy inquiries</span> Two-agent Claude system
          </li>
          <li>
            <span className="bz-system__also-k">Documents</span> Media APIs, OCR, file uploads, and company-backend storage integration
          </li>
        </ul>
      </div>
      <figcaption id="bz-system-cap" className="bz-system__caption">
        Conceptual diagram, simplified to the relationships described on this page. It is not a deployment or network map.
      </figcaption>
    </figure>
  );
}

export default function BuzzworksPage() {
  const { prev, next } = getNeighbours("buzzworks");
  const b = buzzworks;
  const period = b.meta.find((m) => m.label === "Period")!;
  const facts = b.meta.filter((m) => m.label !== "Period");
  const [policy, docs, align] = b.difficult.parts;

  return (
    <div className="detail theme-default theme-buzzworks" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="buzzworks" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        {/* ------------------------------------------------------ opening */}
        <header className="detail-hero bz-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#work">Work</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{b.name}</span>
            </nav>
            <div className="bz-hero__grid">
              <div className="bz-hero__main">
                <p className="bz-hero__dates">
                  <span className="visually-hidden">{period.label}: </span>
                  {period.value}
                </p>
                {/* the supplied minimal symbol, then the name in the page's own type (not a lockup) */}
                <p className="bz-brand">
                  <Image className="bz-brand__mark" src="/logos/buzzworks-minimal.png" alt="" width={162} height={152} unoptimized preload />
                  <span className="bz-brand__name">Buzzworks</span>
                </p>
                <h1 className="detail-hero__title bz-hero__title">
                  <span data-line="title">{b.title}</span>
                </h1>
                <p className="detail-hero__subtitle bz-hero__subtitle">{b.subtitle}</p>
              </div>
              <dl className="bz-facts">
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
              <p className="bz-lead">{b.intro.paragraphs[0]}</p>
              <div className="bz-prose">
                {b.intro.paragraphs.slice(1).map((p) => (
                  <p key={p}>
                    <Marked text={p} words={["extending the existing Veytan HR platform"]} />
                  </p>
                ))}
              </div>
            </section>

            <section className="bz-section bz-owned" id={b.owned.id} aria-labelledby={`${b.owned.id}-title`}>
              <h2 className="bz-h2" id={`${b.owned.id}-title`}>
                {b.owned.heading}
              </h2>
              <div className="bz-owned__grid">
                <div className="bz-prose">
                  <p className="bz-owned__first">
                    <Marked text={b.owned.paragraphs[0]} words={["sole developer", "from scratch"]} />
                  </p>
                  <p>{b.owned.paragraphs[1]}</p>
                  {/* where other teams' work met mine */}
                  <p className="bz-owned__others">{b.owned.paragraphs[2]}</p>
                  <p>{b.owned.paragraphs[3]}</p>
                </div>
                <Avatar pose="typingDesk" role="bz-desk" />
              </div>
            </section>

            {/* 2. one conversation */}
            <section className="bz-section bz-convo" id={b.conversation.id} aria-labelledby={`${b.conversation.id}-title`}>
              <h2 className="bz-h2 bz-h2--quiet" id={`${b.conversation.id}-title`}>
                {b.conversation.label}
              </h2>
              <Conversation />
            </section>

            {/* 3. the documented flows */}
            <section className="bz-section bz-caps" id={b.capabilities.id} aria-labelledby={`${b.capabilities.id}-title`}>
              <h2 className="bz-h2" id={`${b.capabilities.id}-title`}>
                {b.capabilities.heading}
              </h2>
              <ol className="bz-caps__list">
                {b.capabilities.items.map((c) => (
                  <li key={c.id} className="bz-cap" id={c.id}>
                    <h3 className="bz-cap__name">{c.name}</h3>
                    <p className="bz-cap__text">{c.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* 4. the system */}
            <section className="bz-section" id={b.personalized.id} aria-labelledby={`${b.personalized.id}-title`}>
              <h2 className="bz-h2" id={`${b.personalized.id}-title`}>
                {b.personalized.heading}
              </h2>
              <p className="bz-lead">{b.personalized.paragraphs[0]}</p>
              <div className="bz-prose">
                {b.personalized.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            <section className="bz-section bz-sys" id={b.system.id} aria-labelledby={`${b.system.id}-title`}>
              <h2 className="bz-h2" id={`${b.system.id}-title`}>
                {b.system.heading}
              </h2>
              <div className="bz-prose">
                {b.system.paragraphs.slice(0, 2).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <SystemDiagram />
              <div className="bz-prose">
                {b.system.paragraphs.slice(2).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* 5. the difficult parts */}
            <section className="bz-section bz-hard" id={b.difficult.id} aria-labelledby={`${b.difficult.id}-title`}>
              <h2 className="bz-h2" id={`${b.difficult.id}-title`}>
                {b.difficult.heading}
              </h2>

              <div className="bz-part bz-part--policy" id={policy.id}>
                <h3 className="bz-h3">{policy.heading}</h3>
                <p className="bz-part__contrast">{policy.paragraphs[0]}</p>
                <div className="bz-prose">
                  <p>{policy.paragraphs[1]}</p>
                </div>
              </div>

              <div className="bz-part bz-part--docs" id={docs.id}>
                <h3 className="bz-h3">{docs.heading}</h3>
                <div className="bz-prose">
                  <p>{docs.paragraphs[0]}</p>
                  <p>{docs.paragraphs[1]}</p>
                </div>
                {/* the paragraph above, set as its steps (its own words) */}
                <ol className="bz-steps" aria-label="A document upload, step by step">
                  <li>Receiving a file in WhatsApp</li>
                  <li>obtain the media through the relevant APIs</li>
                  <li>process the document where required</li>
                  <li>associate the resulting information and file references with the correct account and task</li>
                </ol>
                <div className="bz-prose">
                  <p>{docs.paragraphs[2]}</p>
                </div>
              </div>

              <div className="bz-part bz-part--align" id={align.id}>
                <h3 className="bz-h3">{align.heading}</h3>
                <div className="bz-align">
                  <ul className="bz-layers" aria-label="Three records of the same process">
                    <li>The chat</li>
                    <li>the in-progress form</li>
                    <li>the backend record</li>
                  </ul>
                  <div className="bz-prose">
                    {align.paragraphs.slice(0, 2).map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                <p className="bz-pull">
                  <Marked text={align.paragraphs[2]} words={["collecting an answer and completing a backend task were separate steps"]} />
                </p>
              </div>
            </section>

            {/* 6. deployment, performance, tools, lessons */}
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
                <span className="bz-status__dot" aria-hidden="true" />
                <span>
                  <Marked text={b.deployment.rollout} words={["being prepared for integration"]} />
                </span>
              </p>
              <div className="bz-perf" id={b.performance.id}>
                <h3 className="bz-h3">{b.performance.heading}</h3>
                <div className="bz-prose">
                  {b.performance.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
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
                {b.takeaways.paragraphs.slice(1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="bz-punchline">{b.takeaways.punchline}</p>
            </section>
          </div>
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
