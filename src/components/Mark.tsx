/**
 * A hand-drawn mark on one word of a heading — the site's line, picking
 * things out the way you would with a pen in a margin. The copy is never
 * changed: `Marked` splits the heading's own text around the word.
 *
 *   circle     a loose loop around the word, ink
 *   underline  one swooping stroke beneath it, ink
 *   strike     a wobbly line through it (for "straightforward"), ink
 *   highlight  a highlighter swipe behind it, Crackd yellow
 *
 * The stroke is drawn once, when the heading scrolls into view (MarkStage
 * sets data-drawn); with reduced motion, or without JavaScript, it is simply
 * there. Decorative: the SVG is aria-hidden and the word reads as normal text.
 */

export type MarkKind = "circle" | "underline" | "strike" | "highlight";

const PATHS: Record<MarkKind, { viewBox: string; d: string }> = {
  circle: {
    viewBox: "0 0 200 80",
    d: "M118 9C79 3 26 11 11 33c-11 17 9 34 52 39 45 5 108-2 125-24 13-17-10-35-55-40-30-3-62 0-83 6",
  },
  underline: {
    viewBox: "0 0 200 24",
    d: "M4 15c38-7 92-11 140-8 18 1 35 3 52 6M150 17c-12 2-26 3-38 5",
  },
  strike: {
    viewBox: "0 0 200 24",
    d: "M3 14c16-6 26 4 42-1s24-8 40-3 26 6 42 0 26-7 40-2 20 5 30 1",
  },
  highlight: {
    viewBox: "0 0 200 40",
    d: "M6 24c40-4 92-6 142-5 16 0 31 1 46 3",
  },
};

export function Mark({ kind, children }: { kind: MarkKind; children: React.ReactNode }) {
  const p = PATHS[kind];
  return (
    <span className={`mark mark--${kind}`} data-mark="">
      {children}
      <svg className="mark__ink" viewBox={p.viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={p.d} pathLength={1} />
      </svg>
    </span>
  );
}

/** The heading's own text, with `word` marked. Falls back to the plain text. */
export function Marked({ text, word, kind }: { text: string; word: string; kind: MarkKind }) {
  const i = text.indexOf(word);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <Mark kind={kind}>{word}</Mark>
      {text.slice(i + word.length)}
    </>
  );
}
