import Image from "next/image";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { amnhOverview as o } from "@/content/amnh";
import { AmnhShell, Facts, Hero, IndexCard, Pager } from "./AmnhParts";
import LegacyAnchors from "./LegacyAnchors";
import { WorkstationThumb } from "./Workstation";

/**
 * AMNH — the entrance to the museum work, not a third case study: who and
 * where (the museum's wordmark, the title, the facts as a specimen label),
 * the two projects — the DIODE workstation drawn small, and the research's
 * index card with its one entry — each opening its own page, and one
 * closing paragraph.
 */
export default function AmnhOverview() {
  const [diode, research] = o.threads.projects;
  return (
    <AmnhShell drawer="amnh" pager={<Pager slug="amnh" />} className="am-overview">
      <LegacyAnchors />
      <Hero
        crumbs={[{ href: "/#now", label: "Work" }, { label: "AMNH" }]}
        id={<Image className="am-wordmark" src="/logos/amnh.png" alt={o.name} width={960} height={209} unoptimized loading="eager" />}
        title={o.title}
        subtitle={o.subtitle}
        aside={<Facts facts={o.facts} />}
      />

      <section className="container am-threads" aria-labelledby="two-threads">
        <div className="am-threads__head">
          <h2 className="am-h2" id="two-threads">
            {o.threads.heading}
          </h2>
          <p className="am-threads__intro">{o.threads.intro}</p>
        </div>
        <ul className="am-projects">
          {[
            { p: diode, card: <WorkstationThumb /> },
            { p: research, card: <IndexCard entry="Feeding behavior" tilt={1.1} /> },
          ].map(({ p, card }) => (
            <li key={p.key} className={`am-project am-project--${p.key}`}>
              <div className="am-project__plate">{card}</div>
              <h3 className="am-project__title">
                {/* the title is the link; it covers the whole entry */}
                <Link href={p.href} className="am-project__link">
                  {p.title}
                </Link>
              </h3>
              <p className="am-project__text">{p.text}</p>
              <p className="am-project__cta" aria-hidden="true">
                {p.cta} <span className="am-project__arrow">→</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container am-further" aria-labelledby="further">
        <h2 className="am-h2" id="further">
          {o.further.heading}
        </h2>
        <div className="am-further__body">
          {o.further.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <Avatar pose="archivalPaper" role="am-further" />
      </section>
    </AmnhShell>
  );
}
