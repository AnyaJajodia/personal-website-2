import Link from "next/link";
import Avatar from "@/components/Avatar";
import { teen, teenSections, companion } from "@/content/research";
import { ResearchShell, Hero, PaperCard, Question, Section, Prose, Steps, Table, Reference, Out } from "./ResearchParts";

/**
 * Teenage pregnancy & fertility — the study, the Chirayu discussion and
 * Project Ārogya as three distinct parts of one question. The figure shows the
 * data (five NFHS rounds, 1992–2021; spacing not to scale, so no round is
 * given a year the copy doesn't) feeding the workflow. Findings stay in words:
 * no invented values, no metrics headlined as accuracy, adolescent fertility
 * never conflated with total fertility rate.
 */

function StudyFigure() {
  return (
    <figure className="rs-nfhs" aria-labelledby="teen-study-cap">
      <div className="rs-nfhs__data">
        <p className="rs-lane__name">The data</p>
        <ol className="rs-nfhs__rounds" aria-label="Five NFHS rounds, Maharashtra data">
          {[1, 2, 3, 4, 5].map((n) => (
            <li key={n}>
              <span className="rs-nfhs__dot" aria-hidden="true" />
              <span className="rs-nfhs__round">Round {n}</span>
            </li>
          ))}
        </ol>
        <p className="rs-nfhs__span">
          <span>1992</span>
          <span className="rs-nfhs__state">Maharashtra · National Family Health Survey</span>
          <span>2021</span>
        </p>
      </div>
      <ol className="rs-flow" aria-label="The workflow">
        <li>
          <span className="rs-node__name">Preparation</span>
          <span className="rs-node__note">Extract, integrate and clean · Python, Pandas, NumPy</span>
        </li>
        <li className="rs-flow__pair">
          <span className="rs-flow__half">
            <span className="rs-node__name">Exploratory analysis</span>
            <span className="rs-node__note">Trends and group comparisons · Matplotlib</span>
          </span>
          <span className="rs-flow__half">
            <span className="rs-node__name">Linear regression</span>
            <span className="rs-node__note">Teenage marriage and pregnancy/motherhood</span>
          </span>
        </li>
        <li>
          <span className="rs-node__name">Interpretation</span>
          <span className="rs-node__note">In the context of education, early marriage, economic circumstances and access to services</span>
        </li>
      </ol>
      <figcaption id="teen-study-cap" className="rs-caption">
        Five NFHS rounds of Maharashtra data, 1992–2021, through the study’s workflow. Rounds are shown in order, not to scale.
      </figcaption>
    </figure>
  );
}

export default function TeenPage() {
  const t = teen;
  const other = companion[t.slug];
  const a = t.arogya;
  return (
    <ResearchShell slug={t.slug} accent="teen" sections={teenSections} hero={<Hero paper={t} />}>
      <PaperCard paper={t} />
      <Question paper={t} />

      {/* part one: the study */}
      <Section id={t.study.id} heading={t.study.heading}>
        <StudyFigure />
        <Steps steps={t.study.steps} label="Building the study, step by step" />
      </Section>

      <Section id={t.findings.id} heading={t.findings.heading} className="rs-findings">
        {t.findings.items.map((fi) => (
          <div key={fi.heading} className="rs-finding">
            <h3 className="rs-h3">{fi.heading}</h3>
            <Prose paragraphs={fi.paragraphs} />
            {fi.note ? <p className="rs-note">{fi.note}</p> : null}
          </div>
        ))}
      </Section>

      <Section id={t.contribution.id} heading={t.contribution.heading} className="rs-contribution">
        <div className="rs-contribution__grid">
          <Prose paragraphs={t.contribution.paragraphs} />
          <Avatar pose="turningPage" role="rs-reader" />
        </div>
      </Section>

      {/* part two: one presentation and discussion, 2022 */}
      <Section id={t.hospital.id} heading={t.hospital.heading} className="rs-hospital">
        <ol className="rs-event" aria-label="Chirayu Hospital, Bhopal · 2022">
          <li>
            <span className="rs-event__k">Presented</span>
            <span className="rs-event__v">{t.hospital.paragraphs[0]}</span>
          </li>
          <li>
            <span className="rs-event__k">Led the discussion</span>
            <span className="rs-event__v">{t.hospital.paragraphs[1]}</span>
          </li>
          <li>
            <span className="rs-event__k">Retained internally</span>
            <span className="rs-event__v">{t.hospital.paragraphs[2]}</span>
          </li>
        </ol>
        <Prose paragraphs={[t.hospital.paragraphs[3]]} />
      </Section>

      {/* part three: Project Ārogya */}
      <Section id={a.id} heading={a.heading} className="rs-arogya">
        <h3 className="rs-h3 rs-h3--sub">{a.subheading}</h3>
        <div className="rs-arogya__grid">
          <div>
            <Prose paragraphs={a.paragraphs} />
            <p className="rs-separate">{a.separate}</p>
            <p className="rs-arogya__link">
              <Out link={a.link} className="rs-out--primary" />
              <span className="rs-arogya__also">
                Saksharta’s partnership also spanned{" "}
                <Link href={`/work/${other.slug}`} className="rs-inline">
                  my PMMY research
                </Link>
                .
              </span>
            </p>
          </div>
          {/* the documented reach, beside the section: participation, kept apart from the study's measures */}
          <figure className="rs-reach" aria-label="Project Ārogya’s documented reach">
            <p className="rs-reach__value">{a.reach.value}</p>
            <figcaption className="rs-reach__text">{a.reach.text}</figcaption>
          </figure>
        </div>
      </Section>

      <Section id={t.limits.id} heading={t.limits.heading} className="rs-limits">
        <Prose paragraphs={t.limits.paragraphs} />
      </Section>

      <Section id={t.tools.id} heading={t.tools.heading}>
        <Table columns={t.tools.columns} rows={t.tools.rows} />
      </Section>

      <Section id={t.takeaways.id} heading={t.takeaways.heading} className="rs-takeaways">
        <p className="rs-lead">{t.takeaways.paragraphs[0]}</p>
        <Prose paragraphs={t.takeaways.paragraphs.slice(1)} />
      </Section>

      <Reference paper={t} />
    </ResearchShell>
  );
}
