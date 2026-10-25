import Avatar from "@/components/Avatar";
import { pmmy, pmmySections, companion } from "@/content/research";
import Link from "next/link";
import { ResearchShell, Hero, PaperCard, Question, Section, Prose, Steps, Table, Reference } from "./ResearchParts";

/**
 * PMMY & women’s financial empowerment. Two strands of evidence — lending data
 * and a sample of tweets — shown as a methods diagram that keeps the sentiment
 * model's training material (movie reviews) apart from the PMMY sample, and
 * the paper's sentiment result as a directly labelled bar chart with its table.
 * No financial trend chart: the published figures need checking first.
 */

function MethodsDiagram() {
  return (
    <figure className="rs-methods" aria-labelledby="pmmy-methods-cap">
      <div className="rs-methods__lanes">
        <div className="rs-lane">
          <p className="rs-lane__name">Financial-program analysis</p>
          <ol className="rs-lane__flow">
            <li>
              <span className="rs-node__name">Secondary PMMY data</span>
              <span className="rs-node__note">Financial years 2015–16 to 2021–22</span>
            </li>
            <li>
              <span className="rs-node__name">Exploratory analysis</span>
              <span className="rs-node__note">Loan accounts; sanctioned, disbursed and outstanding amounts</span>
            </li>
            <li>
              <span className="rs-node__name">Category and year comparisons</span>
              <span className="rs-node__note">Shishu · Kishore · Tarun</span>
            </li>
          </ol>
        </div>
        <div className="rs-lane">
          <p className="rs-lane__name">Twitter sentiment</p>
          <ol className="rs-lane__flow">
            <li>
              <span className="rs-node__name">Collection</span>
              <span className="rs-node__note">Tweepy · 1,000 PMMY-related tweets</span>
            </li>
            <li>
              <span className="rs-node__name">Text preparation</span>
              <span className="rs-node__note">NLTK: segmentation, lemmatization, chunking</span>
            </li>
            <li>
              <span className="rs-node__name">TF-IDF features</span>
              <span className="rs-node__note">Relative importance of terms</span>
            </li>
            <li className="rs-node--fed">
              <span className="rs-node__name">Sentiment classification</span>
              <span className="rs-node__note">Positive · neutral · negative</span>
            </li>
          </ol>
          {/* not PMMY data: what the model learned from */}
          <div className="rs-training">
            <span className="rs-training__k">Training material</span>
            <span className="rs-training__name">Movie-review sentiment dataset</span>
            <span className="rs-training__note">trained the model applied in classification</span>
          </div>
        </div>
      </div>
      <p className="rs-methods__join">
        <span className="rs-node__name">Interpret</span>
        <span className="rs-node__note">Each strand read alongside the other, as partial evidence</span>
      </p>
      <figcaption id="pmmy-methods-cap" className="rs-caption">
        The study’s two strands. The sentiment model’s training material (movie reviews) is separate from the PMMY tweet sample it was applied to.
      </figcaption>
    </figure>
  );
}

function SentimentChart() {
  const s = pmmy.findings.sentiment;
  return (
    <figure className="rs-chart" aria-labelledby="pmmy-chart-cap">
      {/* the bars repeat the table beside them, so assistive tech reads the table */}
      <div className="rs-chart__plot" aria-hidden="true">
        <div className="rs-chart__scale">
          {[0, 25, 50, 75, 100].map((t) => (
            <span key={t} style={{ left: `${t}%` }}>
              <i>{t}%</i>
            </span>
          ))}
        </div>
        {s.rows.map((r) => (
          <div key={r.label} className={`rs-bar rs-bar--${r.label.toLowerCase()}`}>
            <span className="rs-bar__label">{r.label}</span>
            <span className="rs-bar__track">
              <span className="rs-bar__fill" style={{ width: `${r.value}%` }} />
              <span className="rs-bar__value" style={{ left: `${r.value}%` }}>
                {r.value}%
              </span>
            </span>
          </div>
        ))}
      </div>
      <table className="rs-chart__table">
        <caption className="visually-hidden">{s.caption}</caption>
        <thead>
          <tr>
            {s.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption id="pmmy-chart-cap" className="rs-caption">
        {s.caption}
      </figcaption>
    </figure>
  );
}

export default function PmmyPage() {
  const p = pmmy;
  const f = p.findings;
  const other = companion[p.slug];
  return (
    <ResearchShell slug={p.slug} accent="pmmy" sections={pmmySections} hero={<Hero paper={p} />}>
      <PaperCard paper={p} />
      <Question paper={p} />

      <Section id={p.sources.id} heading={p.sources.heading} className="rs-sources">
        <div className="rs-strands">
          {p.sources.strands.map((st, i) => (
            <div key={st.heading} className="rs-strand">
              <p className="rs-strand__n" aria-hidden="true">
                {i === 0 ? "A" : "B"}
              </p>
              <h3 className="rs-h3">{st.heading}</h3>
              <Prose paragraphs={st.paragraphs} />
            </div>
          ))}
        </div>
        <MethodsDiagram />
      </Section>

      <Section id={p.contribution.id} heading={p.contribution.heading} className="rs-contribution">
        <div className="rs-contribution__grid">
          <Prose paragraphs={p.contribution.paragraphs} />
          <Avatar pose="readingSeated" role="rs-reader" />
        </div>
      </Section>

      <Section id={p.pipeline.id} heading={p.pipeline.heading}>
        <Steps steps={p.pipeline.steps} label="From tweets to sentiment, step by step" />
      </Section>

      <Section id={f.id} heading={f.heading} className="rs-findings">
        <div className="rs-finding">
          <h3 className="rs-h3">{f.lending.heading}</h3>
          <Prose paragraphs={f.lending.paragraphs} />
          <p className="rs-note">{f.lending.note}</p>
        </div>
        <div className="rs-finding rs-finding--wide">
          <h3 className="rs-h3">{f.sentiment.heading}</h3>
          <p className="rs-finding__lead">{f.sentiment.lead}</p>
          <SentimentChart />
          <p className="rs-note">{f.sentiment.note}</p>
        </div>
        <div className="rs-finding">
          <h3 className="rs-h3">{f.access.heading}</h3>
          <Prose paragraphs={[f.access.paragraphs[0]]} />
          <ul className="rs-chips" aria-label="Barriers the paper discusses">
            {f.access.barriers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Prose paragraphs={f.access.paragraphs.slice(1)} />
        </div>
      </Section>

      <Section id={p.outreach.id} heading={p.outreach.heading} className="rs-outreach">
        <h3 className="rs-h3 rs-h3--sub">{p.outreach.subheading}</h3>
        <div className="rs-prose">
          <p>
            {p.outreach.paragraphs[0].split("spanning both of my research projects")[0]}
            {/* the partnership spanned both papers: the other one, a click away */}
            <Link href={`/work/${other.slug}`} className="rs-inline">
              spanning both of my research projects
            </Link>
            {p.outreach.paragraphs[0].split("spanning both of my research projects")[1]}
          </p>
          {p.outreach.paragraphs.slice(1).map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
        <p className="rs-separate">{p.outreach.separate}</p>
      </Section>

      <Section id={p.limits.id} heading={p.limits.heading} className="rs-limits">
        <ol className="rs-limits__list">
          {p.limits.paragraphs.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <p className="rs-limits__close">{p.limits.close}</p>
      </Section>

      <Section id={p.tools.id} heading={p.tools.heading}>
        <Table columns={p.tools.columns} rows={p.tools.rows} />
      </Section>

      <Section id={p.takeaways.id} heading={p.takeaways.heading} className="rs-takeaways">
        <p className="rs-lead">{p.takeaways.paragraphs[0]}</p>
        <Prose paragraphs={p.takeaways.paragraphs.slice(1)} />
      </Section>

      <Reference paper={p} />
    </ResearchShell>
  );
}
