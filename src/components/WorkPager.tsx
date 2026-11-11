import Link from "next/link";
import { getNeighbours, work } from "@/content/work";
import { person } from "@/content/site";
import { withGenus } from "@/components/amnh/genus";

/**
 * The end of every project page, shared: a quiet close in the page's own
 * accent (one line and a way to write), then the way on, which is the
 * largest thing here — the next project's own headline, set as the next
 * thread to pick up, with the line it opens on. The whole of it is one link;
 * a thread draws along its foot as you reach for it. Beneath: back to the
 * work overview and the previous project, quietly. The last project's "next"
 * goes back to the first, so no page dead-ends.
 *
 * A page inside a body of work (AMNH's two projects) passes `within`
 * instead: its two ways on are that body's overview and its sibling page.
 *
 * The element itself carries the closing rule (its top border), which the
 * DetailLine ends on (data-line="end") and some pages' figures stand on.
 */
type Way = { href: string; label: string; title: string; name?: string; text?: string };

/**
 * Each project's own ink (its page's --accent, by day and at night): the way
 * on is drawn in the colour of the page it leads to, so the next thread shows
 * before you follow it. Lynxster and AMNH name the site-wide tokens their
 * pages use; Crackd's page links in plain ink, so its thread takes the deep
 * gold (and, at night, the yellow) of its mark.
 */
const INK: Record<string, [day: string, night: string]> = {
  lynxster: ["var(--lx-ink)", "var(--lx-ink)"],
  amnh: ["var(--amnh-accent)", "var(--amnh-accent)"],
  "crackd-ai": ["#7a5a00", "#e8c86a"],
  buzzworks: ["#a8430a", "#f4a670"],
  "tmu-citation-tooling": ["#004c9b", "#9cc3f2"],
  "inteli-lens": ["#51415e", "#c4afd4"],
  "gvi-conservation": ["#3d6248", "#b4cda2"],
  "pmmy-research": ["#793d55", "#e6b7c7"],
  "teenage-pregnancy-research": ["#28685e", "#a9d6ca"],
  "esp-teaching": ["#1e4f91", "#a8d2f7"],
  "adi-mentorship": ["#1e4f91", "#a8d2f7"],
};

export default function WorkPager({ slug, within }: { slug: string; within?: { up: Way; sibling: Way } }) {
  const { prev: p, next } = getNeighbours(slug);
  const first = work[0];
  const wrap = !next && first && first.slug !== slug ? first : undefined;
  const n = next ?? wrap;
  const prev: Way | undefined = within ? within.up : p ? { href: `/work/${p.slug}`, label: "Previous", title: p.name } : undefined;
  const onward: Way | undefined = within
    ? within.sibling
    : n
      ? { href: `/work/${n.slug}`, label: wrap ? "Back to the first thread" : "Next thread", name: n.name, title: n.title, text: n.subtitle }
      : undefined;
  const ink = !within && n ? INK[n.slug] : undefined;

  return (
    <div className="container pager" data-line="end">
      <aside className="pager__close" aria-labelledby="pager-close">
        <p className="pager__close-line" id="pager-close">
          That’s where this thread ends, for now.
        </p>
        <p className="pager__close-text">
          If it sparks a question or an idea, I’d love to hear it:{" "}
          <a className="pager__mail" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <span className="pager__or">
            {" "}
            or <Link href="/#contact">other ways to say hello</Link>.
          </span>
        </p>
      </aside>
      <nav className="pager__nav" aria-label="More work">
        {onward ? (
          <Link
            href={onward.href}
            className="pager__onward pager__link--next"
            style={ink ? ({ "--next": ink[0], "--next-night": ink[1] } as React.CSSProperties) : undefined}
          >
            <span className="pager__onward-label label">
              {onward.label}
              {onward.name ? <span className="pager__onward-name"> · {onward.name}</span> : null}
            </span>
            <span className="pager__onward-title">{withGenus(onward.title)}</span>
            {onward.text ? <span className="pager__onward-text">{withGenus(onward.text)}</span> : null}
            <span className="pager__onward-go" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M4 12h15.5M13.5 5.8 19.8 12l-6.3 6.2" />
              </svg>
            </span>
          </Link>
        ) : null}
        <div className="pager__ways">
          <Link href={slug === "lynxster" || slug.startsWith("amnh") ? "/#now" : "/#selected-work"} className="pager__back label">
            <span aria-hidden="true">←</span> Back to work
          </Link>
          {prev ? (
            <Link href={prev.href} className="pager__prev pager__link--prev">
              <span className="label">{prev.label}</span>
              <span className="pager__title">{withGenus(prev.title)}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
