import type { ExternalLink } from "@/content/site";

/** A short, readable form of a link, taken from the URL itself
 * (LinkedIn → "in/handle", GitHub → "handle", a PDF → "PDF"). */
function detail(url: string) {
  try {
    const u = new URL(url, "https://local.invalid");
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
 * name, a short detail, and the way out (a new tab). A file of the site's own
 * (the résumé) also gets a Download link at the row's end. A link without a
 * URL yet keeps the same row, its note set where the detail goes (never a
 * dead link).
 */
export function ContactList({ links }: { links: ExternalLink[] }) {
  return (
    <ul className="contact-list">
      {links.map((l) => {
        if (!l.url)
          return (
            <li key={l.label}>
              <span className="contact-list__row contact-list__row--pending">
                <span className="contact-list__label">{l.label}</span>
                <span className="contact-list__detail contact-list__note">{l.pendingNote ?? "To come"}</span>
                <span className="contact-list__meta" aria-hidden="true" />
              </span>
            </li>
          );
        const row = (
          <a href={l.url} className="contact-list__row" target="_blank" rel="noopener noreferrer">
            <span className="contact-list__label">{l.label}</span>
            <span className="contact-list__detail">{detail(l.url)}</span>
            <span className="contact-list__meta">
              <span className="visually-hidden">(opens in a new tab)</span>
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        );
        if (!l.download) return <li key={l.label}>{row}</li>;
        return (
          <li key={l.label} className="contact-list__split">
            {row}
            <a href={l.url} className="contact-list__download" download={l.download}>
              Download
              <span className="visually-hidden"> {l.label} (PDF)</span>
              <svg className="contact-list__download-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path className="contact-list__download-arrow" d="M12 4.5v10.2M7.6 10.6 12 15l4.4-4.4" />
                <path d="M5 15.8v2.4c0 .9.7 1.6 1.6 1.6h10.8c.9 0 1.6-.7 1.6-1.6v-2.4" />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
