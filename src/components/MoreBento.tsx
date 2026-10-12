import ExperimentsDiagram from "./ExperimentsDiagram";

/**
 * "More" as a bento grid — adapted from Magic UI's BentoGrid / BentoCard
 * (https://magicui.design/docs/components/bento-grid): a varied-span grid of
 * cards, each with a decorative background scene and its content anchored
 * at the bottom; hovering lifts the scene and shrinks the icon.
 * Re-styled for this site (ivory surfaces, hairline borders, serif names)
 * and without the demo's CTA buttons: these are still placeholders with no
 * pages, so nothing here is a link. All scenes are aria-hidden and abstract —
 * no invented writing, photographs, or projects.
 */

const SLIP_LINES = [
  [92, 70, 84, 56],
  [64, 88, 76, 90, 40],
  [80, 52, 94, 68],
  [72, 90, 60, 84, 50],
  [88, 66, 78],
  [58, 92, 70, 86, 44],
];

function Slip({ lines, i }: { lines: number[]; i: number }) {
  return (
    <span className={`slip slip--${i % 3}`}>
      <span className="slip__head" style={{ width: `${38 + ((i * 17) % 30)}%` }} />
      {lines.map((w, j) => (
        <span key={j} className="slip__line" style={{ width: `${w}%` }} />
      ))}
    </span>
  );
}

function WritingScene() {
  const row = (offset: number) =>
    [...SLIP_LINES, ...SLIP_LINES].map((l, i) => <Slip key={i} lines={l} i={i + offset} />);
  return (
    <div className="bento__scene scene-writing" aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track">{row(0)}</div>
      </div>
      <div className="marquee marquee--reverse">
        <div className="marquee__track">{row(2)}</div>
      </div>
    </div>
  );
}

/** A deliberate placeholder print (no photograph, generated or otherwise):
 * crop marks, an aperture, and a plain caption saying what goes here. */
function PhotoScene() {
  return (
    <div className="bento__scene scene-photo" aria-hidden="true">
      <span className="print print--back" />
      <span className="print print--mid" />
      <span className="print print--front">
        <span className="print__corner print__corner--tl" />
        <span className="print__corner print__corner--tr" />
        <span className="print__corner print__corner--bl" />
        <span className="print__corner print__corner--br" />
        <svg className="print__aperture" viewBox="0 0 40 40" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
            <circle cx="20" cy="20" r="15" />
            <path d="M20 5 27.5 18M35 20H20M27.5 32 20 20M12.5 32 20 20M5 20h15M12.5 8 20 20" />
          </g>
        </svg>
        <span className="print__caption">Photographs to come</span>
      </span>
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  Writing: (
    <path d="M5 19c2-.4 3.6-1.6 4.8-3.6L17.6 4.6a1.6 1.6 0 0 1 2.4 2l-8.4 10.4C10 19 7.8 19.6 5 19zm0 0 2.6-2.4M14 21h6" />
  ),
  "Wildlife photography": (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7 10 4.5h4L15.5 7" />
      <circle cx="12" cy="13.5" r="3.6" />
    </>
  ),
  Experiments: (
    <>
      <circle cx="6" cy="6.5" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <circle cx="9" cy="18" r="2.2" />
      <path d="M8 7.2 15.9 8.6M7 8.6 8.4 15.8M10.8 16.6 16.4 10.6" />
    </>
  ),
};

const SCENES: Record<string, React.ReactNode> = {
  Writing: <WritingScene />,
  "Wildlife photography": <PhotoScene />,
  Experiments: <ExperimentsDiagram />,
};

const KEYS: Record<string, string> = {
  Writing: "writing",
  "Wildlife photography": "photo",
  Experiments: "experiments",
};

export default function MoreBento({ items }: { items: string[] }) {
  return (
    <ul className="bento" aria-label="Coming later">
      {items.map((item) => (
        <li key={item} className={`bento__card bento__card--${KEYS[item] ?? "other"}`}>
          {SCENES[item] ?? null}
          <div className="bento__content">
            <svg className="bento__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[item]}
              </g>
            </svg>
            <h3 className="bento__name">{item}</h3>
            <span className="label bento__soon">Later</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
