import { contact } from "@/content/site";

/**
 * The foot of every page: the name and place, and a way back to the top
 * (every page is long enough to want one except the 404, which says so).
 * "#top" is the homepage's own anchor; elsewhere the browser takes it as the
 * top of the document.
 */
export default function SiteFooter({ toTop = true }: { toTop?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>{contact.footer}</p>
        {toTop ? (
          <a className="site-footer__top" href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        ) : null}
      </div>
    </footer>
  );
}
