import Avatar from "@/components/Avatar";
import { pmmy, pmmySections, companion } from "@/content/research";
import Link from "next/link";
import { ResearchShell, Hero, Question, Section, Prose, Reference } from "./ResearchParts";

/**
 * PMMY & women’s financial empowerment, in the revised, concise structure: the
 * question, two strands of evidence (with the methods diagram that replaces the
 * old step-by-step walkthrough and keeps the sentiment model's movie-review
 * training material apart from the PMMY sample), the findings — the sentiment
 * result as directly labelled bars, its table as the screen-reader equivalent —
 * the results in context, the outreach, and one complete reference. No
 * financial chart: the published figures need checking first.
 */

function MethodsDiagram() {
  return (
    <figure className="rs-methods" aria-label="The study’s two strands: financial-program analysis and Twitter sentiment, read alongside each other">
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
    </figure>
  );
}

function SentimentChart() {
  const s = pmmy.findings.sentiment;
  return (
    <figure className="rs-chart" aria-labelledby="pmmy-chart-cap">
      {/* the bars are directly labelled; assistive tech reads the equivalent table instead */}
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
      <div className="visually-hidden">
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
      </div>
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
  const [before, after] = p.outreach.paragraphs[0].split("spanning both of my research projects");
  return (
    <ResearchShell slug={p.slug} accent="pmmy" sections={pmmySections} hero={<Hero paper={p} />}>
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

      <Section id={f.id} heading={f.heading} className="rs-findings">
        <div className="rs-finding">
          <h3 className="rs-h3">{f.lending.heading}</h3>
          <Prose paragraphs={f.lending.paragraphs} />
        </div>
        <div className="rs-finding rs-finding--wide">
          <h3 className="rs-h3">{f.sentiment.heading}</h3>
          <p className="rs-finding__lead">{f.sentiment.lead}</p>
          <SentimentChart />
          <Prose paragraphs={[f.sentiment.after]} />
        </div>
        <div className="rs-finding">
          <h3 className="rs-h3">{f.access.heading}</h3>
          <Prose paragraphs={f.access.paragraphs} />
        </div>
      </Section>

      <Section id={p.context.id} heading={p.context.heading} className="rs-context">
        <div className="rs-contribution__grid">
          <Prose paragraphs={p.context.paragraphs} />
          <Avatar pose="readingSeated" role="rs-reader" />
        </div>
      </Section>

      <Section id={p.outreach.id} heading={p.outreach.heading} className="rs-outreach">
        <div className="rs-prose">
          <p>
            {before}
            {/* the partnership spanned both papers: the other one, a click away */}
            <Link href={`/work/${other.slug}`} className="rs-inline">
              spanning both of my research projects
            </Link>
            {after}
          </p>
          <p>{p.outreach.paragraphs[1]}</p>
        </div>
      </Section>

      <Section id={p.takeaways.id} heading={p.takeaways.heading} className="rs-takeaways">
        <p className="rs-lead">{p.takeaways.paragraphs[0]}</p>
        <Prose paragraphs={p.takeaways.paragraphs.slice(1)} />
      </Section>

      <Section id={p.tools.id} heading={p.tools.heading} className="rs-tools">
        <ul className="rs-runlist">
          {p.tools.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Reference paper={p} />
    </ResearchShell>
  );
}
