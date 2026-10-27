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
 * serif and thread, with a moss-green accent of its own. The title, then the
 * opening photograph with a short introduction beside it, then the collection
 * in rows (WildlifeGallery); every photograph opens into a larger view.
 *
 * The one drawing is the acacia from the homepage's old placeholder contact
 * sheet; the thread ties its loop above it. The photographer kneels in the
 * space the narrower row of supporting photographs leaves, lens on them.
 */

function Acacia() {
  return (
    <svg className="wl-acacia" viewBox="0 0 120 70" aria-hidden="true" focusable="false">
      <path d="M4 62h112" className="wl-acacia__ground" />
      <path d="M70 62v-20c0-4-3-7-7-9M70 47c3-4 7-6 11-7M70 42c0-3 1-5 3-7" />
      <path d="M46 33c7-9 33-10 43-1-7 4-36 5-43 1z" />
      <path d="M20 62c3-6 9-6 12 0M95 62l2-6 2 6M101 62l1.5-4 1.5 4" />
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
              <Link href="/#more">Other things</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{wildlife.name}</span>
            </nav>
            <h1 className="detail-hero__title wl-hero__title">
              <span data-line="title">{wildlife.name}</span>
            </h1>
          </div>
        </header>

        <section className="container wl-section" aria-label="The collection">
          <WildlifeGallery
            hero={hero}
            rows={rows}
            sequence={sequence}
            intro={
              <>
                {/* the thread ties its loop just above the tree (DetailLine "tag") */}
                <div className="wl-intro__tree" data-line="flourish" data-flourish="tag">
                  <Acacia />
                </div>
                <p className="wl-intro__lede">{wildlife.lede}</p>
                <p className="wl-intro__count">
                  <span className="wl-intro__num">{sequence.length}</span> photographs
                </p>
                <p className="wl-intro__hint">{wildlife.hint}</p>
              </>
            }
            asides={{ 3: <Avatar pose="kneelingCamera" role="wl-shoot" /> }}
          />
        </section>

        <nav className="container pager wl-pager" aria-label="More" data-line="end">
          <Link href="/#more" className="pager__back label">
            <span aria-hidden="true">←</span> Back to other things
          </Link>
        </nav>
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}
