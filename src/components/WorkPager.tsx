import Link from "next/link";
import { getNeighbours, work } from "@/content/work";
import { person } from "@/content/site";

/**
 * The end of every project page, shared: a quiet close in the page's own
 * accent (one line and a way to write), then the way on — back to the work
 * overview, the previous project, and the next. The last project's "next"
 * goes back to the first, so no page dead-ends.
 *
 * A page inside a body of work (AMNH's two projects) passes `within`
 * instead: its two ways on are that body's overview and its sibling page.
 *
 * The element itself carries the closing rule (its top border), which the
 * DetailLine ends on (data-line="end") and some pages' figures stand on.
 */
type Way = { href: string; label: string; title: string };

export default function WorkPager({ slug, within }: { slug: string; within?: { up: Way; sibling: Way } }) {
  const { prev: p, next } = getNeighbours(slug);
  const first = work[0];
  const wrap = !next && first && first.slug !== slug ? first : undefined;
  const n = next ?? wrap;
  const prev: Way | undefined = within ? within.up : p ? { href: `/work/${p.slug}`, label: "Previous", title: p.name } : undefined;
  const onward: Way | undefined = within
    ? within.sibling
    : n
      ? { href: `/work/${n.slug}`, label: wrap ? "Back to the first" : "Next", title: n.name }
      : undefined;

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
        <Link href={slug === "lynxster" || slug.startsWith("amnh") ? "/#now" : "/#selected-work"} className="pager__back label">
          <span aria-hidden="true">←</span> Back to work
        </Link>
        <div className="pager__grid">
          {prev ? (
            <Link href={prev.href} className="pager__link pager__link--prev">
              <span className="label">
                <span aria-hidden="true">← </span>
                {prev.label}
              </span>
              <span className="pager__title">{prev.title}</span>
            </Link>
          ) : null}
          {onward ? (
            <Link href={onward.href} className="pager__link pager__link--next">
              <span className="label">
                {onward.label}
                <span aria-hidden="true"> →</span>
              </span>
              <span className="pager__title">{onward.title}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
