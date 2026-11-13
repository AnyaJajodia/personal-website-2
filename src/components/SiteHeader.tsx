"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact, nav, person } from "@/content/site";
import ThemeToggle from "@/components/ThemeToggle";
import WorkDrawer from "@/components/WorkDrawer";

type Props = {
  /** home: anchors scroll in-page and the name appears once the hero name recedes */
  variant: "home" | "detail";
  /** Start dark (Lynxster opening). Switches to light once the dark band has scrolled under the header. */
  darkUntilSelector?: string;
  /** detail pages: the "Now" and "Work" items each open a drawer (WorkDrawer)
   * instead of linking home; this is the slug of the page you are on ("" for
   * a page outside the work list). The header renders the drawers itself, so
   * no element crosses the server/client boundary. */
  drawer?: string;
};

/** "Anya Jajodia" → "AJ": the brand on the narrowest phones (see globals.css "header") */
/** the résumé (content/site.ts contact.links): opens the PDF in a new tab,
 * where the browser's viewer saves it; Say hello also offers a Download link */
const resume = contact.links.find((l) => l.label === "Résumé");

/** an arrow settling into a tray, in the theme button's pen (24-unit grid, 1.7 stroke) */
const DownloadGlyph = () => (
  <svg className="resume-pill__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path className="resume-pill__arrow" d="M12 4.5v10.2M7.6 10.6 12 15l4.4-4.4" />
    <path d="M5 15.8v2.4c0 .9.7 1.6 1.6 1.6h10.8c.9 0 1.6-.7 1.6-1.6v-2.4" />
  </svg>
);

const initials = person.name
  .split(/\s+/)
  .map((w) => w[0])
  .join("");

export default function SiteHeader({ variant, darkUntilSelector, drawer }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [settled, setSettled] = useState(variant === "detail");
  const [dark, setDark] = useState(Boolean(darkUntilSelector));
  const pathname = usePathname() ?? "";
  // the section this page belongs to (Work for /work/*, More for the wildlife page)
  const section = variant === "detail" ? nav.find((item) => item.routes?.some((r) => pathname.startsWith(r)))?.hash : undefined;

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const update = () => {
      const h = header.offsetHeight;
      if (variant === "home") {
        const name = document.querySelector("[data-line='hero-name']");
        if (name) setSettled(name.getBoundingClientRect().bottom < h + 8);
      } else {
        setSettled(true);
      }
      if (darkUntilSelector) {
        const band = document.querySelector(darkUntilSelector);
        if (band) setDark(band.getBoundingClientRect().bottom > h * 0.5);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [variant, darkUntilSelector]);

  // the full name, and (on the narrowest phones, so every target keeps a
  // 44px hit area) its initials; the full name is always what is announced
  const brand = (
    <>
      <span className="site-header__brand-name">{person.name}</span>
      <span className="site-header__brand-mono" aria-hidden="true">
        {initials}
      </span>
      .
    </>
  );

  return (
    <header
      ref={ref}
      className="site-header"
      data-settled={settled ? "true" : "false"}
      data-tone={dark ? "dark" : "light"}
      data-variant={variant}
      // its own view-transition group: it holds still while pages change
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="site-header__inner container">
        {variant === "home" ? (
          <a className="site-header__brand" href="#top" tabIndex={settled ? 0 : -1} aria-hidden={!settled}>
            {brand}
          </a>
        ) : (
          <Link className="site-header__brand" href="/">
            {brand}
          </Link>
        )}
        <nav aria-label="Primary">
          <ul className="site-nav">
            {nav.map((item) => {
              const label = <span className="site-nav__label">{item.label}</span>;
              const current = item.hash === section;
              if (variant === "home")
                return (
                  <li key={item.hash}>
                    <a href={`#${item.hash}`}>{label}</a>
                  </li>
                );
              const part = item.hash === "now" ? "now" : item.hash === "selected-work" ? "work" : null;
              if (part && drawer !== undefined)
                return (
                  <li key={item.hash} data-current={current ? "true" : undefined}>
                    <WorkDrawer current={drawer} part={part} />
                  </li>
                );
              return (
                <li key={item.hash} data-current={current ? "true" : undefined}>
                  <Link href={`/#${item.hash}`} aria-current={current ? "true" : undefined}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {variant === "home" && resume ? (
          resume.url ? (
            <a className="resume-pill" href={resume.url} target="_blank" rel="noopener">
              <span className="resume-pill__label">{resume.label}</span>
              <span className="visually-hidden"> (PDF, opens in a new tab)</span>
              <DownloadGlyph />
            </a>
          ) : (
            // no PDF yet: in place, but it announces itself as unavailable
            // rather than leading nowhere
            <button className="resume-pill" type="button" aria-disabled="true" title={resume.pendingNote}>
              <span className="resume-pill__label">{resume.label}</span>
              <span className="visually-hidden"> ({resume.pendingNote})</span>
              <DownloadGlyph />
            </button>
          )
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}
