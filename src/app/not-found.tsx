import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// a page that isn't there is never a search result
export const metadata: Metadata = { title: "Page not found — Anya Jajodia", robots: { index: false, follow: true } };

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
          {/* the thread that led here: it wanders in, ties itself in a knot
              and stops */}
          <svg className="not-found__thread" viewBox="0 0 640 170" aria-hidden="true" focusable="false">
            <path
              pathLength="1"
              d="M-12 96C48 70 96 128 160 104S244 34 292 70c26 20 6 60-22 50-30-11-12-66 34-62 44 4 52 62 14 74-34 10-52-36-14-52 42-18 86 30 138 20s58-52 100-46c22 3 30 26 14 34-13 6-24-6-17-17"
            />
          </svg>
        </div>
      </main>
      <SiteFooter toTop={false} />
    </div>
  );
}
