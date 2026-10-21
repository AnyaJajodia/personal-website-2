import { contact } from "@/content/site";

export default function SiteFooter({ toTop = false }: { toTop?: boolean }) {
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
