import { contact } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>{contact.footer}</p>
      </div>
    </footer>
  );
}
