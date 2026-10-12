import Image from "next/image";
import Link from "next/link";
import type { SelectedRow } from "@/content/site";
import { getWork, formatPeriod } from "@/content/work";

/**
 * Selected work as compact expanding panels in two rows.
 *
 * Every panel keeps a stable left column — logo (or a small drawn mark where
 * no logo was supplied), name and dates — and opening it (hover or keyboard
 * focus) reveals a right column with the existing summary and the way in.
 * Expansion changes width only. A single-project panel is one link; a grouped
 * panel holds one link per page (no nested interactive elements). Touch and
 * narrow screens get stacked cards with everything visible (CSS).
 *
 * Panel colours are portfolio colours, not official brand tokens. Logos are
 * the supplied files (handoff/assets/logos → public/logos, transparent
 * margins trimmed only); Buzzworks and TMU sit on an ivory inset so their own
 * colours read, Crackd's white/yellow mark sits on the dark violet, GVI's
 * black mark on yellow.
 */

type Logo =
  | { kind: "img"; src: string; w: number; h: number; chip?: boolean; height: number }
  | { kind: "mark"; mark: "lens" | "pages" | "mentor" };

type Look = { key: string; tone: string; ink: string; logo: Logo };

const LOOKS: Record<string, Look> = {
  "crackd-ai": { key: "crackd", tone: "#47216b", ink: "#fbf9f5", logo: { kind: "img", src: "/logos/crackd.png", w: 202, h: 84, height: 46 } },
  buzzworks: { key: "buzzworks", tone: "#ef7424", ink: "#1d1a17", logo: { kind: "img", src: "/logos/buzzworks.png", w: 362, h: 96, chip: true, height: 30 } },
  "tmu-citation-tooling": { key: "tmu", tone: "#14549a", ink: "#fbf9f5", logo: { kind: "img", src: "/logos/tmu.png", w: 256, h: 140, chip: true, height: 42 } },
  "inteli-lens": { key: "inteli", tone: "#434bd5", ink: "#fbf9f5", logo: { kind: "mark", mark: "lens" } },
  "gvi-conservation": { key: "gvi", tone: "#f3cb35", ink: "#1d1a17", logo: { kind: "img", src: "/logos/gvi.webp", w: 300, h: 237, height: 40 } },
  "pmmy-research": { key: "pubs", tone: "#af3158", ink: "#fbf9f5", logo: { kind: "mark", mark: "pages" } },
  "esp-teaching": { key: "teaching", tone: "#07757a", ink: "#fbf9f5", logo: { kind: "mark", mark: "mentor" } },
};

const MARKS = {
  // a lens / aperture
  lens: (
    <>
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" r="6" />
      <path d="M20 6v8M33.3 15.7l-7.6 2.5M28.2 31.3l-4.7-6.5M11.8 31.3l4.7-6.5M6.7 15.7l7.6 2.5" />
    </>
  ),
  // two papers
  pages: (
    <>
      <path d="M13 7h14l6 6v20H13z" />
      <path d="M27 7v6h6M17 18h11M17 22.5h11M17 27h7" />
      <path d="M9 11v26h18" />
    </>
  ),
  // one larger and one smaller node, linked: teaching and mentorship
  mentor: (
    <>
      <circle cx="14" cy="15" r="6" />
      <circle cx="28" cy="27" r="4.5" />
      <path d="M18.6 18.9 24.6 24M8 33c1-4.5 3.4-7 6-7M30 9.5l1.4-3M33.5 12.5l3-1.4" />
    </>
  ),
};

/** Dates from existing content only; a group spans its entries. Missing start dates stay missing. */
function dateFor(row: SelectedRow): string | null {
  const periods = row.links.map((l) => getWork(l.slug)?.period);
  if (periods.some((p) => !p?.start)) return null; // never invent a start
  const shown = periods.map((p) => formatPeriod(p));
  if (shown.every((d) => d === shown[0])) return shown[0];
  // e.g. "Jan 2024–Dec 2024" + "Jan 2024–2027" → "Jan 2024–2027"
  const year = (v: string) => Number(v.match(/\d{4}/)?.[0] ?? 0);
  const start = periods[0]!.start!;
  if (!periods.every((p) => p!.start === start)) return null;
  const end = periods.map((p) => p!.end ?? p!.start!).reduce((a, e) => (year(e) > year(a) ? e : a));
  return `${start}–${end}`;
}

function LogoBlock({ logo }: { logo: Logo }) {
  if (logo.kind === "mark") {
    return (
      <span className="panel__logo panel__logo--mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {MARKS[logo.mark]}
          </g>
        </svg>
      </span>
    );
  }
  return (
    <span className={`panel__logo${logo.chip ? " panel__logo--chip" : ""}`} aria-hidden="true">
      <Image
        src={logo.src}
        alt=""
        width={logo.w}
        height={logo.h}
        unoptimized
        loading="eager"
        style={{ height: logo.height, width: "auto" }}
      />
    </span>
  );
}

function Panel({ row }: { row: SelectedRow }) {
  const single = row.links.length === 1;
  const look = LOOKS[row.links[0].slug];
  const short = single ? row.links[0].label : row.title;
  const showFull = short !== row.title;
  const date = dateFor(row);

  const id = (
    <span className="panel__id">
      <LogoBlock logo={look.logo} />
      <span className="panel__label">
        {showFull ? (
          <span className="panel__name" aria-hidden="true">
            {short}
          </span>
        ) : (
          <span className="panel__name" role="heading" aria-level={3}>
            {row.title}
          </span>
        )}
        {date ? <span className="panel__date">{date}</span> : null}
      </span>
    </span>
  );
  const more = (
    <>
      <span className="panel__cat">{row.category}</span>
      {showFull ? (
        <span className="panel__title" role="heading" aria-level={3}>
          {row.title}
        </span>
      ) : null}
      <span className="panel__desc">{row.description}</span>
    </>
  );

  return (
    <li className={`panel panel--${look.key}`} style={{ "--tone": look.tone, "--ink": look.ink } as React.CSSProperties}>
      {single ? (
        <Link href={`/work/${row.links[0].slug}`} className="panel__inner panel__link">
          {id}
          <span className="panel__more">
            {more}
            <span className="panel__go" aria-hidden="true">
              →
            </span>
          </span>
        </Link>
      ) : (
        <div className="panel__inner">
          {id}
          <div className="panel__more">
            {more}
            <ul className="panel__links">
              {row.links.map((l) => (
                <li key={l.slug}>
                  <Link href={`/work/${l.slug}`} className="panel__sublink">
                    {l.label}
                    {"\u00a0"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

/** first row: built things; second: fieldwork, publications, teaching */
const FIRST_ROW = 4;

export default function WorkPanels({ rows }: { rows: SelectedRow[] }) {
  const groups = [rows.slice(0, FIRST_ROW), rows.slice(FIRST_ROW)];
  return (
    <div className="panels" data-line="panels">
      {groups.map((g, gi) => (
        <ul key={gi} className={`panels__row panels__row--${g.length}`}>
          {g.map((row) => (
            <Panel key={row.title} row={row} />
          ))}
        </ul>
      ))}
    </div>
  );
}
