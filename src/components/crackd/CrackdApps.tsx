"use client";

import { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
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
 * named-step navigation, Previous/Next and the step count with a progress rail.
 * Escape closes; focus is trapped while open and returns to the button that
 * opened it. ←/→ move between steps.
 *
 * Moving between screens: the next screen is decoded before it is shown (its
 * neighbours are fetched ahead, at the size the stage will use), so a step
 * never flashes an empty box. The screens then cross: the new one slides in
 * from the side you are heading towards as the old one leaves the other way,
 * the step's words rise in, and the highlight in the screens list glides to
 * its name. Images load only when a tour opens. Reduced motion: no movement.
 */

const src = (stem: string, w: 1280 | 2048) => `${stem}-${w}.webp`;
const srcSet = (stem: string) => `${src(stem, 1280)} 1280w, ${src(stem, 2048)} 2048w`;
const SIZES = "(max-width: 760px) 100vw, min(72rem, 92vw)";

/** fetch and decode a screen at the size the stage will pick; resolves either way */
const warm = (stem: string) => {
  const img = new Image();
  img.sizes = SIZES;
  img.srcset = srcSet(stem);
  img.src = src(stem, 1280);
  return img.decode().catch(() => {});
};

// the screens cross: in from the side you are heading towards, out the other
const EASE = [0.32, 0.72, 0, 1] as const;
const screen: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 36, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -36, scale: 0.985, transition: { duration: 0.34, ease: EASE } }),
};

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
  const opener = useRef<HTMLElement | null>(null);
  const ticket = useRef(0);
  const [app, setApp] = useState<App | null>(null);
  const [i, setI] = useState(0);
  // which way the last move went: 1 forward, -1 back
  const [dir, setDir] = useState(1);
  const [nonce, setNonce] = useState(0);
  const uid = useId();
  const still = useReducedMotion() ?? false;

  const open = (a: App, step: number, from: HTMLElement) => {
    opener.current = from;
    ticket.current++;
    setApp(a);
    setI(step);
    setDir(1);
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

  // move once the screen is decoded (at most a beat later), so it arrives whole;
  // only the latest request lands
  const go = useCallback(
    (to: number) => {
      if (!app) return;
      const k = Math.max(0, Math.min(app.steps.length - 1, to));
      if (k === i) return;
      const mine = ++ticket.current;
      const ready = warm(app.steps[k].stem);
      void Promise.race([ready, new Promise((r) => window.setTimeout(r, 260))]).then(() => {
        if (ticket.current !== mine) return;
        setDir(k > i ? 1 : -1);
        setI(k);
      });
    },
    [app, i],
  );

  // the neighbours, fetched ahead so Previous and Next are immediate
  useEffect(() => {
    if (!app) return;
    for (const k of [i + 1, i - 1]) if (app.steps[k]) void warm(app.steps[k].stem);
  }, [app, i]);

  // dialog wiring: Escape, arrows, Tab wrap, overlay click, focus return
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      delete document.documentElement.dataset.tourOpen;
      ticket.current++;
      opener.current?.focus({ preventScroll: true });
    };
    const onClick = (e: MouseEvent) => {
      if (e.target === d) close();
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        // leave arrows alone inside the step list (roving)
        if (t.closest(".ck-tour__steps")) return;
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
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onClick);
      d.removeEventListener("keydown", onKey);
    };
  }, [close, go, i]);

  // leaving the page with a tour open
  useEffect(() => () => void delete document.documentElement.dataset.tourOpen, []);

  // keep the current screen's name in view in the screens list
  useEffect(() => {
    // (scrolled by hand: scrollIntoView could also move the locked page behind the dialog)
    const cur = dialog.current?.querySelector<HTMLElement>('.ck-tour__step[aria-current="step"]');
    const row = cur?.closest("ol");
    if (cur && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: cur.offsetLeft - row.offsetLeft - 16, behavior: still ? "auto" : "smooth" });
    }
  }, [i, app, still]);

  const step = app?.steps[i];
  const words = still ? { duration: 0 } : { duration: 0.42, ease: EASE };
  const glide = still ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 38 };

  return (
    <>
      <div className="ck-apps">
        {crackd.apps.map((a) => (
          <AppEntry key={a.id} app={a} onOpen={open} />
        ))}
      </div>

      <dialog ref={dialog} className="ck-tour" aria-labelledby={`${uid}-app`} aria-describedby={`${uid}-sub`}>
        {app && step ? (
          <div className="ck-tour__panel">
            <header className="ck-tour__head">
              <div className="ck-tour__titles">
                <p className="ck-tour__app" id={`${uid}-app`}>
                  {app.name} <span className="ck-tour__kind">· walkthrough</span>
                </p>
                <h2 className="ck-tour__title" aria-live="polite">
                  <span className="ck-tour__count">
                    {i + 1} / {app.steps.length}
                  </span>
                  <motion.span key={step.stem} className="ck-tour__words" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={words}>
                    {step.title}
                  </motion.span>
                </h2>
                <motion.p
                  key={step.stem}
                  className="ck-tour__sub"
                  id={`${uid}-sub`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={still ? words : { ...words, delay: 0.05 }}
                >
                  {step.subtitle}
                </motion.p>
              </div>
              <button type="button" className="ck-tour__close" onClick={close} aria-label="Close walkthrough">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="ck-tour__body">
              <div className="ck-tour__stage">
                {/* the prepared copy, at its own proportions; the outgoing and
                    incoming screens share the stage's one cell while they cross */}
                <AnimatePresence initial={false} custom={dir}>
                  <motion.img
                    key={step.stem}
                    className="ck-tour__img"
                    src={src(step.stem, 1280)}
                    srcSet={srcSet(step.stem)}
                    sizes={SIZES}
                    width={step.width}
                    height={step.height}
                    alt={step.alt}
                    decoding="async"
                    custom={dir}
                    variants={screen}
                    initial={still ? false : "enter"}
                    animate="center"
                    exit={still ? undefined : "exit"}
                    transition={still ? { duration: 0 } : undefined}
                  />
                </AnimatePresence>
              </div>

              <motion.nav className="ck-tour__steps" aria-label="Screens in this walkthrough" layoutScroll>
                <motion.ol layoutScroll>
                  {app.steps.map((st, k) => (
                    <li key={st.stem}>
                      <button type="button" className="ck-tour__step" aria-current={k === i ? "step" : undefined} onClick={() => go(k)}>
                        {/* the highlight glides from the last screen's name to this one */}
                        {k === i ? <motion.span className="ck-tour__step-mark" layoutId={`${uid}-${app.id}-mark`} transition={glide} aria-hidden="true" /> : null}
                        <span className="ck-tour__step-n" aria-hidden="true">
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        <span className="ck-tour__step-name">{st.title}</span>
                      </button>
                    </li>
                  ))}
                </motion.ol>
                <p className="ck-tour__note">{crackd.tourNote}</p>
              </motion.nav>
            </div>

            <footer className="ck-tour__foot">
              <div className="ck-tour__progress" aria-hidden="true">
                <span className="ck-tour__pos">
                  Step {i + 1} of {app.steps.length}
                </span>
                <span className="ck-tour__rail">
                  <span className="ck-tour__fill" style={{ "--p": (i + 1) / app.steps.length } as React.CSSProperties} />
                </span>
              </div>
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
