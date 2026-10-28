import type { ExternalLink } from "@/content/site";

/** A short, readable form of a profile URL, taken from the URL itself
 * (LinkedIn → "in/handle", GitHub → "handle", a PDF → "PDF"). */
function detail(url: string) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/+|\/+$/g, "");
    if (/\.pdf$/i.test(path)) return "PDF";
    if (/(^|\.)(linkedin|github)\.com$/.test(u.hostname) && path) return path;
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * The quieter ways to reach her, under the email: one ruled row each —
 * name, a short detail, and the way out. A link without a URL yet keeps the
 * same row, its note set where the detail goes (never a dead link).
 */
export function ContactList({ links }: { links: ExternalLink[] }) {
  return (
    <ul className="contact-list">
      {links.map((l) =>
        l.url ? (
          <li key={l.label}>
            <a href={l.url} className="contact-list__row" target="_blank" rel="noopener noreferrer">
              <span className="contact-list__label">{l.label}</span>
              <span className="contact-list__detail">{detail(l.url)}</span>
              <span className="contact-list__meta">
                <span className="visually-hidden">(opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </li>
        ) : (
          <li key={l.label}>
            <span className="contact-list__row contact-list__row--pending">
              <span className="contact-list__label">{l.label}</span>
              <span className="contact-list__detail contact-list__note">{l.pendingNote ?? "To come"}</span>
              <span className="contact-list__meta" aria-hidden="true" />
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
