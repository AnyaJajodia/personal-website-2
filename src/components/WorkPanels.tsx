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
 * Panels are flat coloured paper: muted, distinct hues (Crackd's yellow,
 * sampled from its symbol, sets the softness), one charcoal ink throughout.
 * These are portfolio colours, not official brand tokens.
 *
 * Every identifier uses the same three layers:
 *   1. the muted panel surface;
 *   2. a small square container whose BACKGROUND alone is translucent (light
 *      paper, or charcoal behind Crackd's yellow symbol so it stays visible);
 *   3. the logo artwork, fully opaque, on its own transparent background.
 * Logos are the supplied files, unaltered (Crackd and Buzzworks use their
 * compact `-minimal` symbols). Each is sized by its VISIBLE artwork: `art` is
 * the share of the image height the artwork occupies and `size` the target
 * visible height, so padded symbols and full-bleed marks match optically.
 */

type Logo =
  | {
      kind: "img";
      src: string;
      w: number;
      h: number;
      /** visible artwork height as a share of the image height */
      art: number;
      /** target visible artwork height, px */
      size: number;
    }
  | { kind: "mark"; mark: "lens" | "pages" | "mentor" };

type Look = { key: string; tone: string; logo: Logo; backing?: "dark" };

const LOOKS: Record<string, Look> = {
  "crackd-ai": {
    key: "crackd",
    tone: "#f8d74d",
    backing: "dark",
    logo: { kind: "img", src: "/logos/crackd-minimal.png", w: 148, h: 178, art: 156 / 178, size: 32 },
  },
  buzzworks: {
    key: "buzzworks",
    tone: "#e8b28d",
    logo: { kind: "img", src: "/logos/buzzworks-minimal.png", w: 162, h: 152, art: 124 / 152, size: 33 },
  },
  "tmu-citation-tooling": {
    key: "tmu",
    tone: "#a9c1d9",
    logo: { kind: "img", src: "/logos/tmu.png", w: 256, h: 140, art: 138 / 140, size: 28 },
  },
  "inteli-lens": { key: "inteli", tone: "#b9a4be", logo: { kind: "mark", mark: "lens" } },
  "gvi-conservation": {
    key: "gvi",
    tone: "#a5bdb0",
    logo: { kind: "img", src: "/logos/gvi.webp", w: 300, h: 237, art: 1, size: 27 },
  },
  "pmmy-research": { key: "pubs", tone: "#d3a1ad", logo: { kind: "mark", mark: "pages" } },
  "esp-teaching": { key: "teaching", tone: "#b0b9da", logo: { kind: "mark", mark: "mentor" } },
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

function LogoBlock({ logo, backing }: { logo: Logo; backing?: "dark" }) {
  return (
    <span className={`panel__logo${backing ? ` panel__logo--${backing}` : ""}`} aria-hidden="true">
      {logo.kind === "mark" ? (
        <svg viewBox="0 0 40 40" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {MARKS[logo.mark]}
          </g>
        </svg>
      ) : (
        <Image
          src={logo.src}
          alt=""
          width={logo.w}
          height={logo.h}
          unoptimized
          loading="eager"
          style={{ height: Math.round(logo.size / logo.art), width: "auto" }}
        />
      )}
    </span>
  );
}

function Panel({ row }: { row: SelectedRow }) {
  const single = row.links.length === 1;
  const look = LOOKS[row.links[0].slug];
  const short = single ? row.links[0].label : row.title;
  const showFull = short !== row.title;
  const date = dateFor(row);

  // one visible name per panel: the short name; the full title (e.g. with the
  // university or country the logo already shows) stays in the heading for AT
  const id = (
    <span className="panel__id">
      <LogoBlock logo={look.logo} backing={look.backing} />
      <span className="panel__label">
        <span className="panel__name" role="heading" aria-level={3}>
          <span aria-hidden={showFull || undefined}>{short}</span>
          {showFull ? <span className="visually-hidden">{row.title}</span> : null}
        </span>
        <span className="panel__meta">
          {date ? <span className="panel__date">{date}</span> : null}
          {/* the category only where the title doesn't already say it */}
          {row.title.toLowerCase().includes(row.category.toLowerCase()) ? null : (
            <span className="panel__cat">
              {date ? <span className="visually-hidden">, </span> : null}
              {row.category}
            </span>
          )}
        </span>
      </span>
    </span>
  );
  const more = <span className="panel__desc">{row.description}</span>;

  return (
    <li className={`panel panel--${look.key}`} style={{ "--tone": look.tone } as React.CSSProperties}>
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
