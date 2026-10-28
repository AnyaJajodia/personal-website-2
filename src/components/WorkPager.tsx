import Link from "next/link";
import { getNeighbours, work } from "@/content/work";
import { person } from "@/content/site";

/**
 * The end of every project page, shared: a quiet close in the page's own
 * accent (one line and a way to write), then the way on — back to the work
 * overview, the previous project, and the next. The last project's "next"
 * goes back to the first, so no page dead-ends.
 *
 * The element itself carries the closing rule (its top border), which the
 * DetailLine ends on (data-line="end") and some pages' figures stand on.
 */
export default function WorkPager({ slug }: { slug: string }) {
  const { prev, next } = getNeighbours(slug);
  const first = work[0];
  const wrap = !next && first && first.slug !== slug ? first : undefined;
  const onward = next ?? wrap;

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
        <Link href={slug === "lynxster" || slug === "amnh" ? "/#now" : "/#selected-work"} className="pager__back label">
          <span aria-hidden="true">←</span> Back to work
        </Link>
        <div className="pager__grid">
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="pager__link pager__link--prev">
              <span className="label">
                <span aria-hidden="true">← </span>Previous
              </span>
              <span className="pager__title">{prev.name}</span>
            </Link>
          ) : null}
          {onward ? (
            <Link href={`/work/${onward.slug}`} className="pager__link pager__link--next">
              <span className="label">
                {wrap ? "Back to the first" : "Next"}
                <span aria-hidden="true"> →</span>
              </span>
              <span className="pager__title">{onward.name}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
