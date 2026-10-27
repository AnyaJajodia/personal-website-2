"use client";

import { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";
import { crackd, type App } from "@/content/crackd";

/**
 * The three applications and their walkthroughs.
 *
 * On the page: each application as an editorial entry — letter, name, its
 * one-line description, what I built, the tour's named screens (each opens the
 * walkthrough at that screen), one primary "View walkthrough" button and a
 * secondary repository link (plus the live app, where it answered, with its
 * access requirement). No screenshots on the page: their palettes belong to the
 * walkthroughs.
 *
 * The walkthrough: one native modal <dialog> shared by all three — application
 * name, step title and subtitle, the prepared screenshot at its own proportions,
 * named-step navigation, Previous/Next and the step count. "Enlarge" shows the
 * screenshot at full resolution inside the same dialog (scrollable; no second
 * dialog). Escape leaves the enlarged view first, then closes; focus is trapped
 * while open and returns to the button that opened it. ←/→ move between steps.
 * Images load only when a tour opens (with the next one preloaded). Reduced
 * motion: no transitions.
 */

const src = (stem: string, w: 1280 | 2048) => `${stem}-${w}.webp`;

function RepoLink({ app }: { app: App }) {
  return (
    <a className="ck-repo" href={app.repo.url} target="_blank" rel="noopener noreferrer">
      <svg className="ck-repo__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
      </svg>
      <span className="ck-repo__text">
        <span className="ck-repo__kind">Code on GitHub</span>
        {/* a long repository name may break only after an underscore or hyphen */}
        <span className="ck-repo__name">
          {app.repo.label.split(/(?<=[_-])/).map((part, i) => (
            <Fragment key={i}>
              {i ? <wbr /> : null}
              {part}
            </Fragment>
          ))}
        </span>
      </span>
      <span className="ck-repo__go" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

function AppEntry({ app, onOpen }: { app: App; onOpen: (app: App, step: number, from: HTMLElement) => void }) {
  return (
    <article className={`ck-app ck-app--${app.id}`} id={app.id} aria-labelledby={`${app.id}-title`}>
      <p className="ck-app__n" aria-hidden="true">
        {app.n}
      </p>
      <div className="ck-app__main">
        <h3 className="ck-app__name" id={`${app.id}-title`}>
          {app.name}
        </h3>
        <p className="ck-app__lede">{app.lede}</p>
        <p className="ck-app__body">{app.body}</p>
        {/* the tour's screens by name: a contents list that opens the walkthrough there */}
        <ol className="ck-app__screens" aria-label={`${app.name} walkthrough screens`}>
          {app.steps.map((st, i) => (
            <li key={st.stem}>
              <button type="button" className="ck-screen" onClick={(e) => onOpen(app, i, e.currentTarget)} aria-haspopup="dialog">
                <span className="ck-screen__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {st.title}
              </button>
            </li>
          ))}
        </ol>
        <div className="ck-app__actions">
          <button type="button" className="ck-tour-btn" onClick={(e) => onOpen(app, 0, e.currentTarget)} aria-haspopup="dialog">
            View walkthrough
            <span className="ck-tour-btn__count">{app.steps.length} screens</span>
          </button>
          <RepoLink app={app} />
          {app.live ? (
            <a className="ck-live" href={app.live.url} target="_blank" rel="noopener noreferrer">
              <span className="ck-live__label">
                Live app<span aria-hidden="true"> ↗</span>
              </span>
              <span className="ck-live__access">{app.live.access}</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function CrackdApps() {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [app, setApp] = useState<App | null>(null);
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [nonce, setNonce] = useState(0);
  const uid = useId();

  const open = (a: App, step: number, from: HTMLElement) => {
    opener.current = from;
    setApp(a);
    setI(step);
    setZoom(false);
    setNonce((n) => n + 1);
  };

  // open once the tour's contents have rendered, then start focus on the current screen's name
  useEffect(() => {
    const d = dialog.current;
    if (!nonce || !d || d.open) return;
    document.documentElement.dataset.tourOpen = "true";
    d.showModal();
    d.querySelector<HTMLElement>('.ck-tour__step[aria-current="step"]')?.focus({ preventScroll: true });
  }, [nonce]);

  const close = useCallback(() => {
    const d = dialog.current;
    if (d?.open) d.close();
  }, []);

  const go = useCallback(
    (to: number) => {
      if (!app) return;
      setI(Math.max(0, Math.min(app.steps.length - 1, to)));
      setZoom(false);
    },
    [app],
  );

  // dialog wiring: Escape (leave the enlarged view first), arrows, Tab wrap, overlay click, focus return
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      if (zoom) {
        e.preventDefault();
        setZoom(false);
      }
    };
    const onClose = () => {
      delete document.documentElement.dataset.tourOpen;
      setZoom(false);
      opener.current?.focus({ preventScroll: true });
    };
    const onClick = (e: MouseEvent) => {
      if (e.target === d) close();
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        // leave arrows alone inside the step list (roving) and inside the zoomed image (scrolling)
        if (t.closest(".ck-tour__steps") || zoom) return;
        e.preventDefault();
        go(i + (e.key === "ArrowRight" ? 1 : -1));
        return;
      }
      if (e.key !== "Tab") return;
      const stops = Array.from(d.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex='0']")).filter((x) => x.offsetParent !== null);
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onClick);
      d.removeEventListener("keydown", onKey);
    };
  }, [close, go, i, zoom]);

  // leaving the page with a tour open
  useEffect(() => () => void delete document.documentElement.dataset.tourOpen, []);

  // a new step starts at the top-left of the enlarged image, with its name in view in the screens list
  useEffect(() => {
    stage.current?.scrollTo({ top: 0, left: 0 });
    // (scrolled by hand: scrollIntoView could also move the locked page behind the dialog)
    const cur = dialog.current?.querySelector<HTMLElement>('.ck-tour__step[aria-current="step"]');
    const row = cur?.closest("ol");
    if (cur && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: cur.offsetLeft - row.offsetLeft - 16 });
    }
  }, [i, zoom, app]);

  const step = app?.steps[i];
  const next = app?.steps[i + 1];

  return (
    <>
      <div className="ck-apps">
        {crackd.apps.map((a) => (
          <AppEntry key={a.id} app={a} onOpen={open} />
        ))}
      </div>

      <dialog ref={dialog} className="ck-tour" aria-labelledby={`${uid}-app`} aria-describedby={`${uid}-sub`}>
        {app && step ? (
          <div className="ck-tour__panel" data-zoom={zoom ? "true" : undefined}>
            <header className="ck-tour__head">
              <div className="ck-tour__titles">
                <p className="ck-tour__app" id={`${uid}-app`}>
                  {app.name} <span className="ck-tour__kind">· walkthrough</span>
                </p>
                <h2 className="ck-tour__title" aria-live="polite">
                  <span className="ck-tour__count">
                    {i + 1} / {app.steps.length}
                  </span>
                  {step.title}
                </h2>
                <p className="ck-tour__sub" id={`${uid}-sub`}>
                  {step.subtitle}
                </p>
              </div>
              <button type="button" className="ck-tour__close" onClick={close} aria-label="Close walkthrough">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="ck-tour__body">
              <div
                ref={stage}
                className="ck-tour__stage"
                tabIndex={zoom ? 0 : -1}
                role={zoom ? "region" : undefined}
                aria-label={zoom ? "Enlarged screenshot — scroll to explore" : undefined}
              >
                {/* the prepared copy, at its own proportions; reserves its box while loading */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={step.stem}
                  className="ck-tour__img"
                  src={src(step.stem, zoom ? 2048 : 1280)}
                  srcSet={zoom ? undefined : `${src(step.stem, 1280)} 1280w, ${src(step.stem, 2048)} 2048w`}
                  sizes={zoom ? undefined : "(max-width: 760px) 100vw, min(72rem, 92vw)"}
                  width={step.width}
                  height={step.height}
                  alt={step.alt}
                  decoding="async"
                />
                {/* the next screen, fetched quietly so Next feels immediate */}
                {next ? <link rel="preload" as="image" href={src(next.stem, 1280)} /> : null}
              </div>

              <nav className="ck-tour__steps" aria-label="Screens in this walkthrough">
                <ol>
                  {app.steps.map((st, k) => (
                    <li key={st.stem}>
                      <button type="button" className="ck-tour__step" aria-current={k === i ? "step" : undefined} onClick={() => go(k)}>
                        <span className="ck-tour__step-n" aria-hidden="true">
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        {st.title}
                      </button>
                    </li>
                  ))}
                </ol>
                <p className="ck-tour__note">{crackd.tourNote}</p>
              </nav>
            </div>

            <footer className="ck-tour__foot">
              <button type="button" className="ck-tour__zoom" aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {zoom ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
                </svg>
                <span className="ck-tour__zoom-label">{zoom ? "Fit to window" : "Enlarge"}</span>
              </button>
              <p className="ck-tour__pos" aria-hidden="true">
                Step {i + 1} of {app.steps.length}
              </p>
              <div className="ck-tour__nav">
                <button type="button" className="ck-tour__btn" onClick={() => go(i - 1)} disabled={i === 0}>
                  <span aria-hidden="true">←</span> Previous
                </button>
                <button type="button" className="ck-tour__btn ck-tour__btn--next" onClick={() => go(i + 1)} disabled={i === app.steps.length - 1}>
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
            </footer>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
