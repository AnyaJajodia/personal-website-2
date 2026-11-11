import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="detail detail--short theme-default">
      <SiteHeader variant="detail" />
      <main id="main" className="detail__main not-found">
        <div className="container">
          <p className="label">404</p>
          <h1 className="detail-hero__title">This thread doesn’t lead anywhere.</h1>
          <p className="detail-hero__subtitle">The page you were looking for isn’t here.</p>
          <p>
            <Link href="/" className="text-link">
              Back to the homepage <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
