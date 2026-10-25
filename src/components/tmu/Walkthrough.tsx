"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { walkthrough, example, ILLUSTRATIVE_LABEL } from "@/content/tmu";

/**
 * One fictional reference, followed through five stages:
 * original footnote → source match → in-text citation → bibliography entry → review row.
 *
 * Every stage's example is always on the page, so the chain reads in full
 * without touching anything. Without JavaScript every explanation is shown
 * too, under plain headings (no inert buttons). With JavaScript each stage's
 * name becomes a button that reveals its explanation (one at a time, the first
 * open), ↑/↓ and Home/End move between stages, and the chosen stage is marked.
 */

function StageExample({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <ol className="walk-ex walk-ex--notes" aria-label="Footnotes 13 and 14">
          <li>
            <span className="walk-ex__n">13</span>
            {example.note13}
          </li>
          <li className="is-focus">
            <span className="walk-ex__n">14</span>
            {example.note14}
          </li>
        </ol>
      );
    case 1:
      return (
        <div className="walk-ex walk-ex--match">
          <p className="walk-ex__trace">
            <span className="walk-ex__chip">Id. at 212</span>
            <span className="walk-ex__arrow" aria-hidden="true">→</span>
            <span className="visually-hidden"> resolves to </span>
            <span className="walk-ex__chip">note 13</span>
            <span className="walk-ex__arrow" aria-hidden="true">→</span>
            <span className="visually-hidden"> which cites </span>
            <span className="walk-ex__chip walk-ex__chip--src">Hale 2016</span>
          </p>
          <dl className="walk-ex__fields">
            <div>
              <dt>Author</dt>
              <dd>Hale</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>2016</dd>
            </div>
            <div>
              <dt>Title</dt>
              <dd>The Ledger and the Law</dd>
            </div>
            <div>
              <dt>Pinpoint</dt>
              <dd>
                <s>198–240</s> 212
              </dd>
            </div>
          </dl>
          <p className="walk-ex__bib">
            <span className="walk-ex__k">Original bibliography entry</span>
            {example.originalBib}
          </p>
        </div>
      );
    case 2:
      return (
        <div className="walk-ex walk-ex--cite">
          <p className="walk-ex__before">
            <span className="walk-ex__k">Before</span>
            {example.sentenceBefore}.<sup>14</sup>
          </p>
          <p className="walk-ex__after">
            <span className="walk-ex__k">After</span>
            {example.sentenceBefore} <mark className="walk-ex__mark">{example.citation}</mark>.
          </p>
        </div>
      );
    case 3:
      return (
        <div className="walk-ex walk-ex--bib">
          <p>
            <span className="walk-ex__k">{example.chapter} · References</span>
            {example.generatedBib}
          </p>
          <p>
            <span className="walk-ex__k">Master bibliography</span>
            Listed once, alphabetically, with the book’s other sources.
          </p>
        </div>
      );
    default:
      return (
        <dl className="walk-ex walk-ex--row">
          {[
            ["Original reference number", "14"],
            ["Original footnote", example.note14],
            ["Converted in-text citation", example.citation],
            ["Generated bibliography entry", example.generatedBib],
            ["Original bibliography entry", example.originalBib],
            ["Associated chapter", example.chapter],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      );
  }
}

const noop = () => () => {};

export default function Walkthrough() {
  // interactive only once hydrated (false on the server and during
  // hydration, true after), so no button is ever rendered that does nothing
  const ready = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLOListElement>(null);

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = walkthrough.stages.length;
    const to = e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    root.current?.querySelectorAll<HTMLButtonElement>(".walk__stage")[to]?.focus();
  };

  return (
    <div className="walk" data-ready={ready ? "true" : undefined}>
      <p className="walk__label">
        <span className="walk__tag">Illustrative</span>
        {ILLUSTRATIVE_LABEL}
      </p>
      <ol className="walk__list" ref={root}>
        {walkthrough.stages.map((s, i) => {
          const isOpen = !ready || open === i;
          const panel = `${s.id}-explain`;
          return (
            <li key={s.id} className="walk__step" data-open={isOpen ? "true" : undefined} data-current={ready && open === i ? "true" : undefined}>
              <span className="walk__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="walk__name">
                {ready ? (
                  <button
                    type="button"
                    className="walk__stage"
                    aria-expanded={open === i}
                    aria-controls={panel}
                    onClick={() => setOpen(i)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    {s.name}
                    <span className="walk__chev" aria-hidden="true" />
                  </button>
                ) : (
                  s.name
                )}
              </h3>
              <div className="walk__body">
                <StageExample i={i} />
                <p className="walk__explain" id={panel} hidden={!isOpen}>
                  {s.explain}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
