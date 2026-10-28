import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import Avatar from "@/components/Avatar";
import AvatarStage from "@/components/AvatarStage";
import WorkDrawer from "@/components/WorkDrawer";
import WildlifeGallery from "./WildlifeGallery";
import { hero, rows, sequence, wildlife } from "@/content/wildlife";
import "./wildlife.css";

/**
 * Wildlife photography — a personal collection in the portfolio's own paper,
 * serif and thread, with a moss-green accent of its own. The opening is one
 * row on a ground line that begins at the page's left edge — a small sketch of
 * trees standing on it, the title, the two-line introduction — with the count
 * under the line; then the collection as one continuous, evenly spaced body
 * (WildlifeGallery): the opening photograph at full width, then the rows.
 * Every photograph opens into a larger view. The thread begins where the
 * ground line ends. The photographer kneels on the
 * rule at the end of the collection, lens turned back on it.
 */

function Acacia() {
  // three flat-topped acacias, near to far, and a few tufts of grass; the
  // drawing's bottom edge is the ground, so it stands on the strip's line
  return (
    <svg className="wl-acacia" viewBox="0 0 200 64" aria-hidden="true" focusable="false">
      <path d="M60 64V43c0-4-3-7-7-9M60 49c3-4 7-6 11-7M60 43c0-3 1-5 3-7" />
      <path d="M33 33c8-10 39-11 51-1-8 4-43 5-51 1z" />
      <path d="M131 64V52c0-3 2-5 5-6M131 56c-2-2-4-3-7-3" />
      <path d="M116 50c5-6 24-7 31-1-5 3-26 3-31 1z" />
      <path d="M170 64v-7M162 57c3-4 13-4 17 0-3 2-14 2-17 0z" />
      <path d="M10 64c3-6 9-6 12 0M90 64l2-6 2 6M96 64l1.5-4 1.5 4M186 64l1.5-5 1.5 5" />
    </svg>
  );
}

export default function WildlifePage() {
  return (
    <div className="detail theme-default theme-wl" data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" workMenu={<WorkDrawer current="" />} />
      <DetailLine theme="default" />
      <main id="main" className="detail__main">
        <header className="detail-hero wl-hero" data-line="top">
          <div className="container" data-line="content">
            <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
              <Link href="/#more">More</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{wildlife.name}</span>
            </nav>
            {/* one row on a ground line that starts at the page's left edge: the
                trees standing on it, the title, the introduction; the thread
                begins where the line ends (DetailLine "underline") */}
            <div className="wl-strip" data-line="flourish" data-flourish="underline">
              <Acacia />
              <h1 className="detail-hero__title wl-hero__title">
                <span data-line="title">{wildlife.name}</span>
              </h1>
              <p className="wl-strip__lede">
                {wildlife.lede.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
            <div className="wl-strip__meta">
              <p className="wl-intro__count">
                <span className="wl-intro__num">{sequence.length}</span> photographs
              </p>
              <p className="wl-intro__hint">
                {/* corners opening outward: these open larger */}
                <svg className="wl-intro__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />
                </svg>
                {wildlife.hint}
              </p>
            </div>
          </div>
        </header>

        <section className="container wl-section" aria-label="The collection">
          <WildlifeGallery hero={hero} rows={rows} sequence={sequence} />
        </section>

        <nav className="container pager wl-pager" aria-label="More" data-line="end">
          {/* kneeling on the rule at the end of the collection, lens turned back on it */}
          <Avatar pose="kneelingCamera" role="wl-shoot" />
          <Link href="/#more" className="pager__back label">
            <span aria-hidden="true">←</span> Back to More
          </Link>
        </nav>
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
