import { Fragment, type ReactNode } from "react";

/** The genus of the behavioral research, named in plain strings in the content files. */
export const GENUS = "Chaeteessa";

/** Sets the genus in italics wherever it falls in a line of copy. */
export function withGenus(text: string): ReactNode {
  if (!text.includes(GENUS)) return text;
  return text.split(GENUS).map((part, i) => (
    <Fragment key={i}>
      {i ? <i className="genus">{GENUS}</i> : null}
      {part}
    </Fragment>
  ));
}
