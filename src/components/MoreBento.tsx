/**
 * "More" as three drawn plates in a varied-span grid (the grid structure
 * follows Magic UI's BentoGrid: https://magicui.design/docs/components/bento-grid).
 * Writing has a nib that has just written the site's line; Wildlife
 * photography a drawn contact sheet labelled "Photographs to come".
 * Experiments is deliberately empty — a reserved plate with nothing in it, so
 * it claims no experiment. None of these have pages yet, so nothing here is a
 * link; the drawings are aria-hidden and claim no work.
 */

/** Writing: a nib that has just written a flourish in the site's own line. */
function WritingScene() {
  return (
    <div className="bento__scene scene-writing" aria-hidden="true">
      <svg viewBox="0 -60 966 240" preserveAspectRatio="xMidYMid meet" focusable="false">
        <g className="writing__rules">
          <path d="M20 70H936M20 110H936M20 150H936" />
        </g>
        <path
          className="writing__ink"
          pathLength={1}
          d="M40 118c30 -6 52 -30 60 -52c6 -18 -6 -26 -14 -12c-12 22 4 52 30 50c26 -2 34 -34 52 -34c15 0 9 30 22 34c23 -2 30 -30 46 -30c13 0 7 26 18 32c29 -2 38 -36 58 -36c17 0 10 32 24 34c22 -2 29 -28 44 -28c11 0 6 24 16 29c27 -2 35 -32 54 -32c15 0 9 28 22 32c25 -2 32 -30 50 -30c14 0 8 26 20 29c28 -2 36 -34 56 -34c15 0 9 30 22 35c23 -2 30 -26 46 -26c13 0 7 22 18 26c26 -2 34 -30 52 -30c14 0 8 26 20 29c24 -2 31 -28 48 -28c13 0 7 24 18 29c27 -2 35 -30 54 -30c14 0 8 26 20 30"
        />
        {/* the pen rests a little short of the end; on hover / focus it finishes the stroke */}
        <g className="writing__pen">
          <g className="writing__nib" transform="translate(896 105) rotate(-38)">
            <path d="M0 0 L-12 -58 C-14 -70 -6 -82 0 -88 C6 -82 14 -70 12 -58 Z" />
            <path d="M0 0 V-46 M0 -46 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
            <path d="M-14 -88 h28 l-3 -44 h-22 z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Photography: a contact sheet of drawn bushveld frames — explicitly a placeholder. */
function PhotoScene() {
  const frames = [
    // acacia on the horizon
    "M8 64h104M70 64v-18M52 46c6-8 30-8 38 0-6 3-32 3-38 0z M24 64c4-6 8-6 12 0",
    // grass and a low sun
    "M8 66h104M86 40m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M20 66l4-10 3 10M34 66l3-8 3 8M96 66l3-9 3 9",
    // two trees and a far ridge
    "M8 62c20-8 40-8 60-2s30 4 44-2M36 62v-14M24 48c4-6 20-6 24 0-4 2-20 2-24 0zM88 60v-12M78 48c3-5 17-5 20 0-3 2-17 2-20 0z",
    // a waterhole
    "M8 60h104M30 70c16-6 44-6 60 0-16 5-44 5-60 0zM50 60v-14M40 46c5-7 15-7 20 0-5 3-15 3-20 0z",
    // a kopje against the sky
    "M8 66h104M30 66c6-14 14-22 24-22s16 10 22 22M64 30m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0",
    // grass seed heads close up
    "M8 70h104M30 70c2-16 6-28 10-36M54 70c-1-18 2-30 8-40M80 70c1-14 4-24 10-32M40 34l-4-6M62 30l4-7M90 38l5-5",
  ];
  return (
    <div className="bento__scene scene-photo" aria-hidden="true">
      <div className="contact-sheet">
        {/* viewfinder corners: they close in on the sheet on hover / focus */}
        <span className="viewfinder" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        {frames.map((d, i) => (
          <svg key={i} className="contact-sheet__frame" viewBox="0 0 120 90" focusable="false">
            <rect x="0.5" y="0.5" width="119" height="89" className="contact-sheet__edge" />
            <path d={d} className="contact-sheet__drawing" />
          </svg>
        ))}
        {/* printed on the sheet's own border, like frame text on film */}
        <span className="contact-sheet__note">Photographs to come</span>
      </div>
    </div>
  );
}

const SCENES: Record<string, React.ReactNode> = {
  Writing: <WritingScene />,
  "Wildlife photography": <PhotoScene />,
  // an empty, reserved plate: a quiet frame and nothing else
  Experiments: <div className="bento__scene scene-empty" aria-hidden="true" />,
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
        <li
          key={item}
          className={`bento__card bento__card--${KEYS[item] ?? "other"}`}
          // Writing and Photography respond to focus as well as hover (nothing in them is a link)
          {...(item !== "Experiments" ? { tabIndex: 0, role: "group", "aria-label": `${item} — later` } : {})}
        >
          {SCENES[item] ?? null}
          <div className="bento__content">
            <h3 className="bento__name">{item}</h3>
            <span className="label bento__soon">Later</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
