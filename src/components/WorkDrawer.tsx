"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import "./WorkDrawer.css";
import { drawerSelected, nowEntries, nowLabels, workLabels, type DrawerEntry, type NowEntry } from "@/content/work-index";
import Vignette from "./ContentsVignettes";

/**
 * The two work drawers, one per header item, as the homepage splits its work:
 * "Now" (Currently: Lynxster and AMNH) and "Work" (Selected work). SiteHeader
 * renders this once per item, giving each its `part`. Pass the page's slug.
 *
 * Both are a sheet of the page's paper that unrolls downward from beneath the
 * header (the header stays in view, undimmed), hanging under the navigation
 * with its right edge on the page's column. What is on the paper differs:
 *
 * - Now: an open field notebook, one page per commitment. Each page carries
 *   its work's mark drawn large (ContentsVignettes), its dates, name, role and
 *   one line, and AMNH's two roles lettered beneath. Pencil at rest; the page
 *   pointed at, or the one you are on, is inked in the mark's colours.
 * - Work: a book's contents. Entries are numbered with serif names and dotted
 *   leaders to the category, ending in the mark's vignette; pointing at one
 *   inks it and the pen underlines the name in the same ink. Several pages are
 *   lettered a, b beneath the name. The page's own thread runs down the
 *   margin, and the pen circles the number of the page you are on.
 *
 * Behaviour is a native modal <dialog>: the page behind is inert, Escape
 * closes (the cancel event, after the exit plays), Tab wraps, ↑/↓ and
 * Home/End move between entries, focus starts on this page's entry and
 * returns to the trigger, background scroll is locked without a shift, and a
 * click outside the paper (the scrim, or the header strip above it) closes.
 *
 * Motion (WorkDrawer.css): the paper unrolls behind a soft-edged mask; the
 * entries ink in one after another and the pencil sketches draw themselves;
 * last, the pen circles where you are. It rolls back up, faster, to close.
 * Under reduced motion it fades and everything is simply there.
 */


/** the pen's circle around a number (or a sub-entry's letter): one stroke, not quite closed */
const ring = (
  <svg className="contents__ring" viewBox="0 0 48 36" aria-hidden="true" focusable="false">
    <path pathLength="1" d="M29.5 5.2C19 2.6 6.4 7.4 4.6 16.8c-1.7 9 8.6 15.4 20.1 14.6 11.3-.8 19.6-7.5 18.6-15.4C42.4 8.7 33 4.3 22.6 5.9" />
  </svg>
);

/** the pen's line under a name, in the project's ink, drawn when pointed at */
const swash = (
  <svg className="contents__swash" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path pathLength="1" d="M1 5.2C14 3.4 27 6.4 41 4.6S69 3 82 4.8 95 5.6 99 3.6" />
  </svg>
);

const here = (
  <span className="contents__here">
    <span className="visually-hidden">, </span>you are here
  </span>
);

type Pick = (isHere: boolean) => (ev: React.MouseEvent) => void;
/** `n`: the entry's number; `i`: its place in the ink-in stagger */
type Numbered = DrawerEntry & { n: number; i: number };

const two = (n: number) => String(n).padStart(2, "0");
const letter = (k: number) => String.fromCharCode(97 + k);

/** number, name (with its swash), leader, note and vignette: one line of the contents */
function Line({ e, isHere, nameId }: { e: Numbered; isHere: boolean; nameId?: string }) {
  return (
    <>
      <span className="contents__n" aria-hidden="true">
        {two(e.n)}
        {isHere ? ring : null}
      </span>
      <span className="contents__name" id={nameId}>
        <span className="contents__title">
          {e.title}
          {swash}
        </span>
        {isHere ? here : null}
      </span>
      <span className="contents__leader" aria-hidden="true" />
      {e.note ? (
        <span className="contents__note">
          <span className="visually-hidden">, </span>
          {e.note}
        </span>
      ) : (
        <span />
      )}
      <Vignette v={e.key} />
    </>
  );
}

function Row({ e, current, pick }: { e: Numbered; current: string; pick: Pick }) {
  const style = stagger(e.i);
  if (e.links.length === 1) {
    const l = e.links[0];
    const isHere = l.slug === current;
    return (
      <li className="contents__entry" style={style} data-v={e.key} data-here={isHere ? "" : undefined}>
        <Link
          href={`/work/${l.slug}`}
          className="contents__link"
          data-sheet-item
          aria-current={isHere ? "page" : undefined}
          onClick={pick(isHere)}
        >
          <Line e={e} isHere={isHere} />
        </Link>
      </li>
    );
  }
  // a body of work with several pages: its title is a label, each page a
  // lettered link beneath it. Links into sections of one shared page (AMNH's
  // two roles) are all "this page" when it is open, so the pen marks the
  // group, not one of them.
  const id = `contents-group-${e.key}`;
  const shared = e.links.every((l) => l.hash && l.slug === e.links[0].slug);
  const groupHere = shared && e.links[0].slug === current;
  const anyHere = e.links.some((l) => l.slug === current);
  return (
    <li className="contents__entry contents__entry--group" style={style} data-v={e.key} data-here={anyHere ? "" : undefined}>
      <div className="contents__link contents__link--label" data-here={groupHere ? "" : undefined}>
        <Line e={e} isHere={groupHere} nameId={id} />
      </div>
      <ul className="contents__subs" aria-labelledby={id}>
        {e.links.map((l, k) => {
          const onPage = l.slug === current;
          // a section link goes to its section, even from its own page
          const isHere = onPage && !l.hash;
          return (
            <li key={l.hash ?? l.slug}>
              <Link
                href={`/work/${l.slug}${l.hash ? `#${l.hash}` : ""}`}
                className="contents__sub"
                data-sheet-item
                aria-current={onPage ? "page" : undefined}
                onClick={pick(isHere)}
              >
                <span className="contents__letter" aria-hidden="true">
                  {letter(k)}
                  {isHere ? ring : null}
                </span>
                <span className="contents__sub-text">
                  {l.label}
                  {l.detail ? <span className="contents__sub-detail"> · {l.detail}</span> : null}
                  {isHere ? here : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/** Now: one notebook page per commitment */
function NowPage({ e, k, current, pick }: { e: NowEntry; k: number; current: string; pick: Pick }) {
  const isHere = e.slug === current;
  const id = `now-${e.key}`;
  return (
    <article className="now__page" data-v={e.key} data-here={isHere ? "" : undefined} style={stagger(k + 1)} aria-labelledby={id}>
      <div className="now__art">
        <Vignette v={e.key} />
      </div>
      <p className="now__when">{e.period}</p>
      <h3 className="now__name" id={id}>
        {/* the whole page opens the project; its roles sit above this link */}
        <Link href={`/work/${e.slug}`} className="now__link" data-sheet-item aria-current={isHere ? "page" : undefined} onClick={pick(isHere)}>
          <span className="contents__title">
            {e.name}
            {swash}
          </span>
        </Link>
        {isHere ? here : null}
      </h3>
      <p className="now__role">
        {e.role}
        {e.status ? <span className="now__status">{e.status}</span> : null}
      </p>
      <p className="now__line">{e.line}</p>
      {e.links ? (
        <ul className="now__roles" aria-label={`${e.name}: its two roles`}>
          {e.links.map((l, j) => (
            <li key={l.hash ?? l.slug}>
              <Link href={`/work/${l.slug}${l.hash ? `#${l.hash}` : ""}`} className="contents__sub" data-sheet-item onClick={pick(false)}>
                <span className="contents__letter" aria-hidden="true">
                  {letter(j)}
                </span>
                <span className="contents__sub-text">
                  {l.label}
                  {l.detail ? <span className="contents__sub-detail"> · {l.detail}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="now__cta" aria-hidden="true">
          {e.cta} <span>→</span>
        </p>
      )}
    </article>
  );
}

const noop = () => () => {};

// Work: one numbering in reading order; `i` counts every row for the stagger
const WORK = drawerSelected.map((e, k) => ({ ...e, n: k + 1, i: k + 1 }));
const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

type Part = "now" | "work";
const PART = {
  now: { label: "Now", aria: "Now: what I’m working on", title: nowLabels.title, desc: nowLabels.heading, home: "/#now" },
  work: { label: "Work", aria: "Work: browse selected work", title: workLabels.title, desc: workLabels.heading, home: "/#selected-work" },
} as const;

export default function WorkDrawer({ current, part = "work" }: { current: string; part?: Part }) {
  const P = PART[part];
  const sheetId = `${part}-sheet`;
  // the sheet is rendered into the page wrapper once hydrated, outside the header's
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
    if (d) {
      delete d.dataset.state;
      delete d.dataset.settled;
    }
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
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ms = reduced ? 0 : parseFloat(getComputedStyle(d).getPropertyValue("--sheet-out")) || 0;
      if (ms === 0) return finishClose(restore);
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
    // the paper hangs from the header's lower edge, wherever the header is
    const header = document.querySelector<HTMLElement>(".site-header");
    const top = Math.max(0, Math.round(header?.getBoundingClientRect().bottom ?? 0));
    d.style.setProperty("--sheet-top", `${top}px`);
    // keep the page from shifting when its scrollbar disappears
    root.style.setProperty("--sheet-scrollbar", `${window.innerWidth - root.clientWidth}px`);
    root.dataset.sheetOpen = "true";
    delete d.dataset.settled;
    d.dataset.state = "open";
    d.showModal();
    setOpen(true);
    // start where the reader is: this page's entry, scrolled into the list's
    // view if it sits below the fold (the list scrolls, never the page)
    const start = d.querySelector<HTMLElement>('[aria-current="page"]') ?? d.querySelector<HTMLElement>("[data-sheet-item]");
    start?.focus({ preventScroll: true });
    const body = d.querySelector<HTMLElement>(".sheet__body");
    if (start && body) {
      const r = start.getBoundingClientRect();
      const b = body.getBoundingClientRect();
      if (r.bottom > b.bottom - 24) body.scrollTop += r.bottom - b.bottom + b.height / 3;
    }
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault(); // play the exit, then close
      close();
    };
    // a click outside the paper: the scrim, or the header strip above it
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t === d || t.classList.contains("sheet__scrim")) close();
    };
    // the unroll is done: drop the mask so scrolling the list stays cheap
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "sheet-unroll" && d.dataset.state === "open") d.dataset.settled = "true";
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
    d.addEventListener("animationend", onEnd);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("click", onClick);
      d.removeEventListener("keydown", onKey);
      d.removeEventListener("animationend", onEnd);
      unlock(); // leaving the page with the sheet open
    };
  }, [close, mounted]);

  return (
    <>
      {/* the header's own item: it opens this drawer */}
      <button
        ref={trigger}
        type="button"
        className="sheet-trigger site-nav__work"
        data-part={part}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={sheetId}
        aria-label={P.aria}
        onClick={show}
      >
        <span className="site-nav__label">{P.label}</span>
        <svg className="site-nav__chev" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M3 4.5 6 7.5 9 4.5" />
        </svg>
      </button>

      {mounted
        ? createPortal(
            <dialog
              ref={dialog}
              id={sheetId}
              className="sheet"
              data-part={part}
              aria-labelledby={`${sheetId}-title`}
              aria-describedby={`${sheetId}-desc`}
            >
              <div className="sheet__scrim" aria-hidden="true" />
              <div className="sheet__panel">
                <div className="sheet__head">
                  <div>
                    <h2 className="sheet__title" id={`${sheetId}-title`}>
                      {P.title}
                    </h2>
                    <p className="sheet__desc" id={`${sheetId}-desc`}>
                      {P.desc}
                      {/* only where there is a keyboard-and-pointer setup to use it (WorkDrawer.css) */}
                      <span className="sheet__keys"> Arrow keys move between them.</span>
                    </p>
                  </div>
                  <button type="button" className="sheet__close" aria-label={`Close ${P.title}`} onClick={() => close()}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>

                <div className="sheet__body">
                  {part === "now" ? (
                    <nav className="now" aria-label={P.title}>
                      <div className="now__spread">
                        {nowEntries.map((e, k) => (
                          <NowPage key={e.key} e={e} k={k} current={current} pick={pick} />
                        ))}
                      </div>
                      <Link href={P.home} className="sheet__overview" data-sheet-item onClick={pick(false)} style={stagger(3)}>
                        <span aria-hidden="true">←</span> Back to work overview
                      </Link>
                    </nav>
                  ) : (
                    <nav className="contents" aria-label={P.title}>
                      <ol className="contents__list">
                        {WORK.map((e) => (
                          <Row key={e.key} e={e} current={current} pick={pick} />
                        ))}
                      </ol>
                      <Link href={P.home} className="sheet__overview" data-sheet-item onClick={pick(false)} style={stagger(WORK.length + 1)}>
                        <span aria-hidden="true">←</span> Back to work overview
                      </Link>
                    </nav>
                  )}
                </div>
              </div>
            </dialog>,
            // inside the page's theme wrapper, so the sheet inherits its accent
            // and tones (a modal dialog renders in the top layer regardless)
            document.querySelector(".detail") ?? document.body,
          )
        : null}
    </>
  );
}
