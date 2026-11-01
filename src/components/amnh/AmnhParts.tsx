import Link from "next/link";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DetailLine from "@/components/DetailLine";
import WorkPager from "@/components/WorkPager";
import AvatarStage from "@/components/AvatarStage";
import type { Fact } from "@/content/amnh";
import "../case/case.css";
import "./amnh.css";

/**
 * Shared parts of the three AMNH pages: the page shell (header with this
 * page's drawer, the blue thread with its dragonfly-wing flourish, footer),
 * the opening, the facts set as a museum label, and the index card that
 * stands for the research on the overview and its own page.
 */

export type Crumb = { href?: string; label: string };

export function AmnhShell({
  drawer,
  pager,
  className = "",
  children,
}: {
  /** the page's slug for the drawers ("amnh", "amnh/diode", …) */
  drawer: string;
  pager: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`detail theme-amnh am-page ${className}`.trim()} data-line-root>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader variant="detail" drawer={drawer} />
      <DetailLine theme="amnh" />
      <main id="main" className="detail__main">
        {children}
        {pager}
      </main>
      <SiteFooter />
      <AvatarStage />
    </div>
  );
}

export function Pager({ slug, sibling }: { slug: string; sibling?: { href: string; title: string } }) {
  return (
    <WorkPager
      slug={slug}
      within={
        sibling
          ? {
              up: { href: "/work/amnh", label: "The museum", title: "AMNH overview" },
              sibling: { href: sibling.href, label: "Also at AMNH", title: sibling.title },
            }
          : undefined
      }
    />
  );
}

export function Hero({
  crumbs,
  title,
  subtitle,
  id,
  aside,
  children,
  className = "",
}: {
  crumbs: Crumb[];
  title: string;
  subtitle?: ReactNode;
  /** the identity line above the title (the museum's wordmark) */
  id?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`detail-hero case-hero am-hero ${className}`.trim()} data-line="top">
      <div className="container" data-line="content">
        <nav aria-label="Breadcrumb" className="breadcrumb label" data-line="crumb">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i ? <span aria-hidden="true"> / </span> : null}
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="case-hero__grid am-hero__grid">
          <div className="am-hero__main">
            {id ? <div className="case-hero__id">{id}</div> : null}
            <h1 className="detail-hero__title am-hero__title">
              <span data-line="title">{title}</span>
            </h1>
            {subtitle ? <p className="detail-hero__subtitle am-hero__subtitle">{subtitle}</p> : null}
            {children}
          </div>
          {aside}
        </div>
      </div>
    </header>
  );
}

/** the facts, lettered like a specimen label: small caps over the entry */
export function Facts({ facts }: { facts: Fact[] }) {
  // the thread ties its loop above the label and hangs it, like a field tag (DetailLine)
  return (
    <dl className="am-label" data-line="flourish" data-flourish="tag">
      {facts.map((f) => (
        <div key={f.label} className="am-label__row">
          <dt className="label">{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A collection index card: the department at its head, ruled lines and a
 * margin rule, and one handwritten entry on otherwise blank lines (the
 * behavioral research, on the overview and its own page).
 */
export function IndexCard({ entry, tilt = -1.2 }: { entry?: string; tilt?: number }) {
  return (
    <div className="am-card" style={{ "--tilt": `${tilt}deg` } as React.CSSProperties} aria-hidden="true">
      <span className="am-card__dept">Invertebrate Zoology</span>
      {entry ? <span className="am-card__entry">{entry}</span> : null}
    </div>
  );
}
