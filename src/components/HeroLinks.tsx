import { contact, hero } from "@/content/site";

/**
 * The first screen's quiet way to act: "Say hello" (down to the ending, where
 * the email, links and résumé live), then her profiles. Only links with a
 * URL appear here — the résumé joins the row on its own once contact.links
 * gives it one; a "to come" item never shows in the hero.
 */
export default function HeroLinks() {
  const profiles = contact.links.filter((l): l is typeof l & { url: string } => !!l.url);
  return (
    <ul className="hero-links" aria-label="Get in touch">
      <li>
        <a className="hero-links__link hero-links__link--hello" href={hero.hello.href}>
          {hero.hello.label}
          <span className="hero-links__arrow" aria-hidden="true">
            →
          </span>
        </a>
      </li>
      {profiles.map((l) => (
        <li key={l.label}>
          <a className="hero-links__link" href={l.url} target="_blank" rel="noopener noreferrer">
            {l.label}
            <span className="visually-hidden"> (opens in a new tab)</span>
            <span className="hero-links__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
