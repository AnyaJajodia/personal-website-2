import Link from "next/link";
import { AMNH_ROUTES, behavioral as b } from "@/content/amnh";
import { AmnhShell, Hero, IndexCard, Pager } from "./AmnhParts";

/**
 * AMNH · Behavioral research — an intentional, temporary page: the one
 * sentence that is confirmed, the note that more is coming, and the way
 * back. Its index card holds a single entry on blank lines. No methods,
 * organism, dates, results or imagery until they are confirmed
 * (handoff/content/work/amnh-behavioral-research.md).
 */
export default function BehavioralPage() {
  return (
    <AmnhShell
      drawer="amnh/behavioral-research"
      className="am-research"
      pager={<Pager slug="amnh/behavioral-research" sibling={{ href: AMNH_ROUTES.diode, title: "DIODE · Collections digitization" }} />}
    >
      <Hero
        crumbs={[{ href: "/#now", label: "Work" }, { href: AMNH_ROUTES.overview, label: "AMNH" }, { label: "Behavioral research" }]}
        title={b.title}
        subtitle={b.lead}
        className="am-research__hero"
        aside={
          // the card hangs from the thread like a field tag (DetailLine)
          <div className="am-research__card" data-line="flourish" data-flourish="tag">
            <IndexCard entry="Feeding behavior" tilt={1.4} />
          </div>
        }
      >
        <p className="am-research__note">{b.note}</p>
        <p className="am-research__back">
          <Link href={AMNH_ROUTES.overview} className="am-back">
            <span aria-hidden="true">←</span> {b.back}
          </Link>
        </p>
      </Hero>
    </AmnhShell>
  );
}
