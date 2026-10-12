import type { ExternalLink } from "@/content/site";

/** Links with a URL become real links; missing ones render as quiet "to come" text. */
export function ContactList({ links }: { links: ExternalLink[] }) {
  return (
    <ul className="contact-list">
      {links.map((l) =>
        l.url ? (
          <li key={l.label}>
            <a href={l.url} className="contact-list__row" target="_blank" rel="noopener noreferrer">
              <span>{l.label}</span>
              <span className="contact-list__meta">
                <span className="visually-hidden">(opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </li>
        ) : (
          <li key={l.label}>
            <span className="contact-list__row contact-list__row--pending">
              <span>{l.label}</span>
              <span className="contact-list__meta">{l.pendingNote ?? "To come"}</span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
