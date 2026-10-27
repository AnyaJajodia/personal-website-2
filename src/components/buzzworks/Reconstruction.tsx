"use client";

import { useEffect, useId, useRef, useState } from "react";
import { scenarios, buzzworks, type Action, type Beat } from "@/content/buzzworks";

/**
 * "Explore the experience": four fictional journeys through the WhatsApp
 * application in one shared window (scenario tabs above it). Nothing is live:
 * no typing, uploads, authentication, backend or AI — each journey follows one
 * scripted path. The person's next step is offered where WhatsApp would offer
 * it (quick-reply buttons, a selection list, the composer with a prepared reply
 * or a sample attachment); the path's choice is the one you can take, the
 * others stay visible for context. Next / Back / Restart step through it too.
 *
 * The window keeps one height across scenarios (the conversation scrolls
 * inside it), new messages are announced politely, and with reduced motion
 * they simply appear.
 */

function choiceOf(act: Action): string | null {
  if (act.kind === "buttons" || act.kind === "list") return act.pick;
  if (act.kind === "reply") return act.text;
  return null;
}

function Sent({ act, time }: { act: Action; time: string }) {
  if (act.kind === "attach") {
    return (
      <li className="wa-row wa-row--me">
        <div className="wa-bubble wa-bubble--me wa-bubble--media">
          {act.file.kind === "signature" ? (
            <svg className="wa-file wa-file--sig" viewBox="0 0 160 70" aria-hidden="true" focusable="false">
              <path d="M12 48c14-30 22-32 26-18s-6 26 4 20 16-34 26-26-2 22 8 20 14-16 22-14 6 12 18 8 16-10 30-8" />
              <path d="M10 60h140" className="wa-file__line" />
            </svg>
          ) : (
            <svg className="wa-file" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
              <rect x="1" y="1" width="158" height="108" rx="6" />
              <circle cx="80" cy="44" r="18" />
              <path d="M44 100c4-22 20-32 36-32s32 10 36 32" />
            </svg>
          )}
          <span className="wa-bubble__caption">{act.file.name}</span>
          <span className="wa-meta">
            {time}
            <Ticks />
          </span>
        </div>
      </li>
    );
  }
  return (
    <li className="wa-row wa-row--me">
      <p className="wa-bubble wa-bubble--me">
        {choiceOf(act)}
        <span className="wa-meta">
          {time}
          <Ticks />
        </span>
      </p>
    </li>
  );
}

function Ticks() {
  return (
    <svg className="wa-ticks" viewBox="0 0 18 11" aria-hidden="true" focusable="false">
      <path d="M1 6l3 3 6-7M7 9l1 1 7-8" />
    </svg>
  );
}

const clock = (i: number, half: 0 | 1) => {
  const m = 2 + i * 1 + half;
  return `10:${String(m).padStart(2, "0")}`;
};

export default function Reconstruction() {
  const [si, setSi] = useState(0);
  const [step, setStep] = useState(0);
  const logRef = useRef<HTMLOListElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const sc = scenarios[si];
  const beats = sc.beats;
  const current: Beat = beats[step];
  const done = !current.act;
  const total = beats.length;

  // keep the newest message in view, inside the window only
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    log.scrollTo({ top: log.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [si, step]);

  const choose = (k: number) => {
    setSi(k);
    setStep(0);
  };
  const next = () => setStep((s) => (beats[s].act ? Math.min(s + 1, total - 1) : s));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => setStep(0);

  const onTabKey = (e: React.KeyboardEvent, k: number) => {
    const n = scenarios.length;
    let to = -1;
    if (e.key === "ArrowRight") to = (k + 1) % n;
    else if (e.key === "ArrowLeft") to = (k - 1 + n) % n;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    choose(to);
    tabRefs.current[to]?.focus();
  };

  const act = current.act;
  return (
    <figure className="wa" aria-labelledby={`${uid}-cap`}>
      <div className="wa__tabs" role="tablist" aria-label="Choose a journey">
        {scenarios.map((s, k) => (
          <button
            key={s.id}
            ref={(el) => {
              tabRefs.current[k] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${s.id}`}
            aria-selected={k === si}
            aria-controls={`${uid}-panel`}
            tabIndex={k === si ? 0 : -1}
            className="wa__tab"
            onClick={() => choose(k)}
            onKeyDown={(e) => onTabKey(e, k)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="wa__panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${sc.id}`}>
        <div className="wa__window">
          <div className="wa__bar">
            <span className="wa__avatar" aria-hidden="true">
              HR
            </span>
            <span className="wa__who">
              <span className="wa__name">{buzzworks.explore.contact}</span>
              <span className="wa__status">Illustration</span>
            </span>
          </div>

          <ol className="wa__log" ref={logRef} role="log" aria-live="polite" aria-label={`${sc.label}: conversation`} tabIndex={0}>
            {beats.slice(0, step + 1).map((b, k) => {
              const isNow = k === step;
              const a = b.act;
              return (
                <BeatView key={`${sc.id}-${k}`} beat={b} k={k} isNow={isNow} onPick={next}>
                  {!isNow && a ? <Sent act={a} time={clock(k, 1)} /> : null}
                </BeatView>
              );
            })}
          </ol>

          {/* the composer: a prepared reply or a sample attachment, when that is the next step */}
          <div className="wa__composer">
            {act && act.kind === "reply" ? (
              <>
                <span className="wa__field">
                  <span className="visually-hidden">Prepared reply: </span>
                  {act.text}
                </span>
                <button type="button" className="wa__send" onClick={next} aria-label={`Send “${act.text}”`}>
                  <SendIcon />
                </button>
              </>
            ) : act && act.kind === "attach" ? (
              <>
                <span className="wa__field wa__field--file">
                  <span className="visually-hidden">Sample attachment: </span>
                  {act.file.name}
                </span>
                <button type="button" className="wa__send" onClick={next} aria-label={`Send the ${act.file.name.toLowerCase()}`}>
                  <SendIcon />
                </button>
              </>
            ) : (
              <span className="wa__field wa__field--idle">{done ? "End of this example" : "Choose an option above"}</span>
            )}
          </div>
        </div>

        <div className="wa__controls">
          <p className="wa__progress" aria-live="polite">
            Step {step + 1} of {total}
          </p>
          <div className="wa__buttons">
            <button type="button" className="wa__ctl" onClick={back} disabled={step === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="wa__ctl wa__ctl--next" onClick={next} disabled={done}>
              Next <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="wa__ctl" onClick={restart} disabled={step === 0}>
              Restart
            </button>
          </div>
        </div>
      </div>

      <figcaption id={`${uid}-cap`} className="wa__caption">
        <span className="bz-chat__tag">Illustration</span>
        {buzzworks.explore.caption}
      </figcaption>
    </figure>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M3 10l14-6-5 14-2.5-5.5z" />
    </svg>
  );
}

/** the assistant's message, and — while it is the latest — its options */
function BeatView({ beat, k, isNow, onPick, children }: { beat: Beat; k: number; isNow: boolean; onPick: () => void; children?: React.ReactNode }) {
  const b = beat.bot;
  const a = beat.act;
  const live = isNow && a && (a.kind === "buttons" || a.kind === "list");
  return (
    <>
      <li className="wa-row wa-row--bot">
        <div className="wa-bubble">
          {b.text ? <p>{b.text}</p> : null}
          {b.lines ? (
            <ul className="wa-bubble__lines">
              {b.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : null}
          {b.doc ? (
            <span className="wa-doc">
              <svg viewBox="0 0 24 28" aria-hidden="true" focusable="false">
                <path d="M3 1h12l6 6v20H3z" />
                <path d="M15 1v6h6" />
              </svg>
              <span className="wa-doc__text">
                <span className="wa-doc__name">{b.doc.name}</span>
                <span className="wa-doc__meta">{b.doc.meta}</span>
              </span>
            </span>
          ) : null}
          {b.sample ? <span className="wa-bubble__sample">{b.sample}</span> : null}
          <span className="wa-meta">{clock(k, 0)}</span>
        </div>
      </li>
      {a && (a.kind === "buttons" || a.kind === "list") ? (
        <li className={`wa-row wa-row--bot wa-row--opts${a.kind === "list" ? " wa-row--list" : ""}`}>
          {a.kind === "list" ? <p className="wa-list__title">{a.button}</p> : null}
          <ul className="wa-opts" aria-label={a.kind === "list" ? a.button : "Quick replies"}>
            {a.options.map((o) => {
              const path = o === a.pick;
              return (
                <li key={o}>
                  <button type="button" className={`wa-opt${path && live ? " wa-opt--path" : ""}`} disabled={!live || !path} aria-pressed={!isNow && path ? true : undefined} onClick={onPick}>
                    {a.kind === "list" ? <span className="wa-opt__radio" aria-hidden="true" /> : null}
                    {o}
                  </button>
                </li>
              );
            })}
          </ul>
          {live ? <p className="visually-hidden">This example follows one path; the other options are shown for context.</p> : null}
        </li>
      ) : null}
      {children}
    </>
  );
}
