"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { LynxsterLockup } from "@/components/Logo";
import "./WorkDrawer.css";
import { drawerCurrent, drawerSelected, drawerLabels, drawerSubMarks, type DrawerEntry, type DrawerLogo, type WorkMark } from "@/content/work-index";

/**
 * "Browse work": a side sheet listing every portfolio experience, the current
 * page marked. Its trigger is the detail-page header's own "Work" item
 * (SiteHeader's `workMenu`), so it is there however far the page has scrolled,
 * on every screen size. The list opens with "Back to work overview" (the
 * homepage's work section). Pass the page's slug.
 *
 * Anatomy follows the common Sheet pattern (trigger, overlay, right-hand panel
 * with a title, description and close button). It is a native modal <dialog>:
 * the page behind becomes inert, so focus is trapped and assistive tech sees
 * only the sheet; Escape closes it (the dialog's cancel event). On top of that:
 *   - background scroll is locked (html[data-sheet-open]) without layout shift
 *   - focus starts on the current page's entry and returns to the trigger
 *   - Tab / Shift+Tab wrap within the sheet; ↑/↓, Home/End move between
 *     entries; a click on the overlay closes
 *   - a plain horizontal slide from the right edge with the overlay fading in
 *     (500ms soft deceleration in, 320ms eased out, no overshoot; a fade under reduced motion);
 *     its exit plays before the dialog closes
 * Entries are real links. Choosing one closes the sheet and navigates.
 */

const MARKS: Record<WorkMark, React.ReactNode> = {
  lens: (
    <>
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" r="6" />
      <path d="M20 6v8M33.3 15.7l-7.6 2.5M28.2 31.3l-4.7-6.5M11.8 31.3l4.7-6.5M6.7 15.7l7.6 2.5" />
    </>
  ),
  pages: (
    <>
      <path d="M13 7h14l6 6v20H13z" />
      <path d="M27 7v6h6M17 18h11M17 22.5h11M17 27h7" />
      <path d="M9 11v26h18" />
    </>
  ),
  mentor: (
    <>
      <circle cx="14" cy="15" r="6" />
      <circle cx="28" cy="27" r="4.5" />
      <path d="M18.6 18.9 24.6 24M8 33c1-4.5 3.4-7 6-7M30 9.5l1.4-3M33.5 12.5l3-1.4" />
    </>
  ),
};

function Tile({ logo }: { logo: DrawerLogo }) {
  if (logo.kind === "lynxster") return <LynxsterLockup className="sheet-feature__lockup" />;
  if (logo.kind === "wordmark") return <Image className="sheet-feature__wordmark" src={logo.src} alt="" width={logo.w} height={logo.h} unoptimized />;
  return (
    <span className={`sheet-entry__tile${logo.kind === "img" && logo.dark ? " sheet-entry__tile--dark" : ""}`} aria-hidden="true">
      {logo.kind === "mark" ? (
        <svg viewBox="0 0 40 40" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {MARKS[logo.mark]}
          </g>
        </svg>
      ) : (
        <Image src={logo.src} alt="" width={logo.w} height={logo.h} unoptimized />
      )}
    </span>
  );
}

const go = (
  <svg className="sheet-entry__go" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M3 8h9.5M8.5 4l4 4-4 4" />
  </svg>
);

const here = (
  <span className="sheet__here">
    <span className="visually-hidden">, </span>this page
  </span>
);

type Pick = (isHere: boolean) => (ev: React.MouseEvent) => void;

function Entry({ e, current, pick }: { e: DrawerEntry; current: string; pick: Pick }) {
  const style = e.tone ? ({ "--tone": e.tone } as React.CSSProperties) : undefined;
  if (e.links.length === 1) {
    const l = e.links[0];
    const isHere = l.slug === current;
    return (
      <li className={`sheet-entry sheet-entry--${e.key}`} style={style}>
        <Link href={`/work/${l.slug}`} className="sheet-entry__link" data-sheet-item aria-current={isHere ? "page" : undefined} onClick={pick(isHere)}>
          <Tile logo={e.logo} />
          <span className="sheet-entry__text">
            <span className="sheet-entry__name">{e.title}</span>
            <span className="sheet-entry__note">
              {e.note}
              {isHere ? here : null}
            </span>
          </span>
          {go}
        </Link>
      </li>
    );
  }
  // a group (publications, teaching): the title is a label, each page a link
  const id = `sheet-group-${e.key}`;
  return (
    <li className={`sheet-entry sheet-entry--group sheet-entry--${e.key}`} style={style}>
      <div className="sheet-entry__head">
        <Tile logo={e.logo} />
        <span className="sheet-entry__text">
          <span className="sheet-entry__name" id={id}>
            {e.title}
          </span>
          <span className="sheet-entry__note">{e.note}</span>
        </span>
      </div>
      <ul className="sheet-entry__subs" aria-labelledby={id}>
        {e.links.map((l) => (
          <li key={l.slug}>
            <Link href={`/work/${l.slug}`} className="sheet-entry__sub" data-sheet-item aria-current={l.slug === current ? "page" : undefined} onClick={pick(l.slug === current)}>
              {drawerSubMarks[l.slug] ? (
                <span className="sheet-entry__pill" aria-hidden="true">
                  <Image src={drawerSubMarks[l.slug].src} alt="" width={drawerSubMarks[l.slug].w} height={drawerSubMarks[l.slug].h} unoptimized />
                </span>
              ) : null}
              <span className="sheet-entry__sub-text">
                {l.label}
                {l.slug === current ? <> {here}</> : null}
              </span>
              {go}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

const noop = () => () => {};

export default function WorkDrawer({ current }: { current: string }) {
  // the sheet is rendered into <body> once hydrated, outside the header's
  // navigation landmark (the trigger lives in the nav; the list does not)
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const closing = useRef(false);

  const unlock = () => {
    const root = document.documentElement;
    delete root.dataset.sheetOpen;
    root.style.removeProperty("--sheet-scrollbar");
  };

  const finishClose = useCallback((restore: boolean) => {
    const d = dialog.current;
    closing.current = false;
    if (d?.open) d.close();
    delete d?.dataset.state;
    unlock();
    setOpen(false);
    if (restore) trigger.current?.focus({ preventScroll: true });
  }, []);

  const close = useCallback(
    (restore = true) => {
      const d = dialog.current;
      if (!d?.open || closing.current) return;
      closing.current = true;
      d.dataset.state = "closing";
      const panel = d.querySelector<HTMLElement>(".sheet__panel");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ms = reduced ? 0 : parseFloat(getComputedStyle(d).getPropertyValue("--sheet-out")) || 0;
      if (!panel || ms === 0) return finishClose(restore);
      window.setTimeout(() => finishClose(restore), ms);
    },
    [finishClose],
  );

  // another page: close and navigate; this page: just close, back to the trigger
  const pick: Pick = (isHere) => (ev) => {
    if (isHere) {
      ev.preventDefault();
      close();
    } else close(false);
  };

  const show = () => {
    const d = dialog.current;
    if (!d || d.open) return;
    const root = document.documentElement;
    // keep the page from shifting when its scrollbar disappears
    root.style.setProperty("--sheet-scrollbar", `${window.innerWidth - root.clientWidth}px`);
    root.dataset.sheetOpen = "true";
    d.dataset.state = "open";
    d.showModal();
    setOpen(true);
    // start where the reader is: this page's entry
    (d.querySelector<HTMLElement>('[aria-current="page"]') ?? d.querySelector<HTMLElement>("[data-sheet-item]"))?.focus();
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault(); // play the exit, then close
      close();
    };
    // a click on the overlay (the dialog box itself, outside the panel)
    const onClick = (e: MouseEvent) => {
      if (e.target === d) close();
    };
    const onKey = (e: KeyboardEvent) => {
      // Tab wraps inside the sheet (a modal dialog alone lets focus out to the browser's own controls)
      if (e.key === "Tab") {
        const stops = Array.from(d.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
        const first = stops[0];
        const last = stops[stops.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
      const items = Array.from(d.querySelectorAll<HTMLElement>("[data-sheet-item]"));
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (i < 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) return; // e.g. on the close button
      e.preventDefault();
      const next =
        e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("click", onClick);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("click", onClick);
      d.removeEventListener("keydown", onKey);
      unlock(); // leaving the page with the sheet open
    };
  }, [close, mounted]);

  return (
    <>
      {/* the header's own "Work" item: it opens the list of every project */}
      <button
        ref={trigger}
        type="button"
        className="sheet-trigger site-nav__work is-current"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="work-sheet"
        aria-label="Work: browse all projects"
        onClick={show}
      >
        <span className="site-nav__label">Work</span>
        <svg className="site-nav__chev" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M3 4.5 6 7.5 9 4.5" />
        </svg>
      </button>

      {mounted
        ? createPortal(
      <dialog ref={dialog} id="work-sheet" className="sheet" aria-labelledby="work-sheet-title" aria-describedby="work-sheet-desc">
        <div className="sheet__panel">
          <div className="sheet__head">
            <div>
              <h2 className="sheet__title" id="work-sheet-title">
                Browse work
              </h2>
              <p className="sheet__desc" id="work-sheet-desc">
                Every project in the portfolio. Use the arrow keys to move between them.
              </p>
            </div>
            <button type="button" className="sheet__close" aria-label="Close work list" onClick={() => close()}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="sheet__body" aria-label="All work">
            <Link href="/#work" className="sheet__overview" data-sheet-item onClick={pick(false)}>
              <span aria-hidden="true">←</span> Back to work overview
            </Link>
            <h3 className="sheet__group">{drawerLabels.current}</h3>
            <ul className="sheet__features">
              {drawerCurrent.map((e) => {
                const l = e.links[0];
                const isHere = l.slug === current;
                return (
                  <li key={e.key} className={`sheet-feature sheet-feature--${e.key}`}>
                    <Link href={`/work/${l.slug}`} className="sheet-feature__link" data-sheet-item aria-current={isHere ? "page" : undefined} onClick={pick(isHere)}>
                      <span className="sheet-feature__logo" aria-hidden="true">
                        <Tile logo={e.logo} />
                      </span>
                      <span className="sheet-entry__text">
                        <span className="sheet-entry__name">{e.title}</span>
                        <span className="sheet-entry__note">
                          {e.note}
                          {isHere ? here : null}
                        </span>
                      </span>
                      {go}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <h3 className="sheet__group">{drawerLabels.selected}</h3>
            <ul className="sheet__list">
              {drawerSelected.map((e) => (
                <Entry key={e.key} e={e} current={current} pick={pick} />
              ))}
            </ul>
          </nav>

        </div>
      </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
