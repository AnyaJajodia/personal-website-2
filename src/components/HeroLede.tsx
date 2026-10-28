import { Fragment, type ReactNode } from "react";
import { hero } from "@/content/site";

/** phrases that read as one word and never break across a line */
const KEEP = ["CTO & co-founder", "end-to-end"];
const KEEP_RE = new RegExp(`(${KEEP.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);

function keep(text: string): ReactNode {
  return text.split(KEEP_RE).map((piece, i) =>
    KEEP.includes(piece) ? (
      <span key={i} className="hero__keep">
        {piece}
      </span>
    ) : (
      piece
    ),
  );
}

/**
 * The hero's run-in lede: what she does, plainly and in ink (the tagline's
 * concrete twin, in facts from About and Currently), then how she works, in
 * her own muted voice — one paragraph, so the facts cost no extra block.
 */
export default function HeroLede() {
  return (
    <p className="hero__lede">
      <span className="hero__identity">
        {hero.identity.map((sentence, i) => (
          <Fragment key={i}>
            {i > 0 ? " " : null}
            {sentence.map((part, j) =>
              typeof part === "string" ? (
                <Fragment key={j}>{keep(part)}</Fragment>
              ) : (
                <a key={j} className="hero__identity-link" href={part.href}>
                  {part.label}
                </a>
              ),
            )}
          </Fragment>
        ))}
      </span>{" "}
      {/* never a lone "I" at a line's end */}
      {keep(hero.intro.replace(/^I /, "I "))}
    </p>
  );
}
