/**
 * Held back from this release (content/site.ts `more.deferred`): the loose
 * pieces Writing and Experiments were laid out as. Wildlife photography now
 * has its own composition (wildlife/PhotoStack.tsx); this keeps the other
 * two for later: loose things laid on the page, not cards — a sheet of
 * ruled writing paper and a slip of graph paper for experiments. Each sits
 * a touch off-square on its own short paper shadow with its caption
 * underneath on the page itself.
 * On hover / focus a piece straightens and lifts a little.
 *
 * Writing's sheet has a nib that has just written the site's line. The
 * graph-paper slip is blank, so it claims no experiment. An item with a page
 * (`links`) is one link, stretched over the whole piece and its caption; the
 * others are not links (their caption says "Later"). Drawings are
 * aria-hidden and claim no work.
 */
import Link from "next/link";

/** Writing: a nib that has just written a flourish in the site's own line. */
function WritingScene() {
  return (
    <div className="bento__scene scene-writing" aria-hidden="true">
      <svg viewBox="0 -60 966 240" preserveAspectRatio="xMidYMid meet" focusable="false">
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

const SCENES: Record<string, React.ReactNode> = {
  Writing: <WritingScene />,
  // a slip of graph paper: drawn in CSS, nothing on it yet
  Experiments: <div className="bento__scene scene-graph" aria-hidden="true" />,
};

const KEYS: Record<string, string> = {
  Writing: "writing",
  Experiments: "experiments",
};

export default function MoreBento({ items, links = {} }: { items: string[]; links?: Record<string, string> }) {
  return (
    <ul className="bento" aria-label="Other things">
      {items.map((item) => {
        const href = links[item];
        return (
          <li key={item} className={`bento__card bento__card--${KEYS[item] ?? "other"}${href ? " bento__card--link" : ""}`}>
            <div className="bento__piece">{SCENES[item] ?? <div className="bento__scene scene-graph" aria-hidden="true" />}</div>
            <div className="bento__content">
              <h3 className="bento__name">
                {href ? (
                  <Link href={href} className="bento__link">
                    {item}
                  </Link>
                ) : (
                  item
                )}
              </h3>
              <span className="label bento__soon">
                {href ? (
                  <>
                    View
                    {" "}
                    <span className="bento__go" aria-hidden="true">
                      →
                    </span>
                  </>
                ) : (
                  "Later"
                )}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
