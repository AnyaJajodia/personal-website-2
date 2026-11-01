"use client";

import Image from "next/image";
import { useState } from "react";
import { laptop } from "@/content/amnh-diode-art";

/**
 * The workstation's laptop, enlarged: one laptop, two of BugBase's screens —
 * camera control (the default) and image review — chosen with two labelled
 * buttons beneath it. Nothing plays by itself and nothing on the screens is
 * operable: the windows are illustrative recreations (HTML), adapted from
 * the supplied prototype.
 *
 * Switching changes only what is on the screen. Both windows stay mounted in
 * the same display area and crossfade (the inactive one is inert); the words
 * beside the laptop describe both views at once, the current one inked, so
 * nothing outside the screen changes size — the page's height, and with it
 * the thread drawn down the margin (DetailLine re-measures on resize), stay
 * exactly as they were.
 */
export default function LaptopDetail() {
  const [view, setView] = useState<(typeof laptop.views)[number]["key"]>("control");
  const [control, review] = laptop.views;

  return (
    <figure className="lt" aria-labelledby="lt-caption">
      <div className="lt__machine">
        <div className="lt__lid">
          <div className="lt__screen" id="lt-screen">
            {/* camera control */}
            <div className="lt__view" data-on={view === "control" || undefined} inert={view !== "control"} role="img" aria-label="Recreated BugBase CameraControl window: camera settings, the Start BugBase Process button with Pause, Return to Base and Resume, and the camera's live view.">
              <div className="lt-win" aria-hidden="true">
                <div className="lt-win__bar">
                  <i />
                  <i />
                  <i />
                  <span>CameraControl</span>
                </div>
                <div className="lt-win__body lt-cc">
                  <dl className="lt-cc__settings">
                    {control.settings.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="lt-cc__side">
                    <div className="lt-cc__proc">
                      <span className="lt-btn lt-btn--primary">Start BugBase Process</span>
                      <span className="lt-cc__row">
                        <span className="lt-btn">Pause</span>
                        <span className="lt-btn">Return to Base</span>
                        <span className="lt-btn">Resume</span>
                      </span>
                    </div>
                    <div className="lt-cc__preview">
                      <Image src={control.preview.src} alt="" width={control.preview.width} height={control.preview.height} sizes="(min-width: 1100px) 460px, 60vw" loading="eager" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* image review */}
            <div className="lt__view" data-on={view === "review" || undefined} inert={view !== "review"} role="img" aria-label={`Recreated image review window showing the saved file ${review.file}. ${review.image.alt}`}>
              <div className="lt-win lt-win--review" aria-hidden="true">
                <div className="lt-win__bar">
                  <i />
                  <i />
                  <i />
                  <span>{review.file}</span>
                  <small>2 documents</small>
                </div>
                <div className="lt-win__body lt-rv">
                  <div className="lt-rv__side">
                    <span className="lt-rv__thumb">
                      <span className="lt-rv__t lt-rv__t--empty" />
                      <span>…_card.JPG</span>
                    </span>
                    <span className="lt-rv__thumb is-sel">
                      <span className="lt-rv__t">
                        <Image src={review.image.src} alt="" width={review.image.width} height={review.image.height} sizes="80px" loading="eager" />
                      </span>
                      <span>…_specimen.JPG</span>
                    </span>
                  </div>
                  <div className="lt-rv__stage">
                    <Image src={review.image.src} alt="" width={review.image.width} height={review.image.height} sizes="(min-width: 1100px) 600px, 70vw" loading="eager" />
                  </div>
                </div>
              </div>
            </div>
            <span className="lt__dock" aria-hidden="true">
              <Image src={laptop.icon} alt="" width={160} height={160} loading="eager" />
            </span>
          </div>
        </div>
        <div className="lt__base" aria-hidden="true" />
      </div>

      <div className="lt__views" role="group" aria-label="Laptop screen">
        {laptop.views.map((v) => (
          <button key={v.key} type="button" className="lt__tab" aria-pressed={view === v.key} aria-controls="lt-screen" onClick={() => setView(v.key)}>
            {v.tab}
          </button>
        ))}
      </div>

      {/* both views described at once; the current one inked (no text swaps, no reflow) */}
      <figcaption className="lt__caption" id="lt-caption">
        <span className="lt__about">
          <span className="dw-caption__label">BugBase on the workstation’s laptop.</span> Two of its screens, recreated as illustrations.
        </span>
        <dl className="lt__list">
          {laptop.views.map((v) => (
            <div key={v.key} className="lt__item" data-on={view === v.key || undefined}>
              <dt>{v.tab}</dt>
              <dd>
                <span className="lt__words">{v.caption}</span>
                <span className="lt__note">{v.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  );
}
