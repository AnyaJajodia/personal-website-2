import Image from "next/image";
import { poses, type Pose, type PoseName } from "@/content/avatars";

/**
 * One decorative figure from the avatar set, anchored by the page around it.
 *
 *   .avatar         positioned (and, where needed, clipped) by its context;
 *                   never animated, so the points the line is routed
 *                   through stay put
 *   .avatar__body   the entrance (a transition, so it can be interrupted)
 *   .avatar__react  reactions to the page (the peeker's lean), composed on
 *                   top of the entrance instead of overwriting it
 *
 * Points the line needs (a seat, a fist) are rendered as zero-size probes
 * with `data-line` names, measured exactly like the rest of the homepage.
 * Decorative: aria-hidden, empty alt, no pointer events of its own.
 */
export default function Avatar({
  pose,
  role,
  eager = false,
  probes,
  className = "",
  enterAt,
  children,
}: {
  pose: PoseName;
  /** names the placement: `avatar--{role}` in CSS, `data-avatar` for the stage */
  role: string;
  /** above the fold only (the hero): preloaded, decoded with the page and
   * shown as is, with no entrance; everything else loads lazily */
  eager?: boolean;
  /** anchor name on the pose → data-line name of its probe */
  probes?: Record<string, string>;
  className?: string;
  /** see AvatarStage: how far up the viewport before it enters (0–1), or
   * "line": once the homepage line has been drawn under it */
  enterAt?: number | "line";
  /** extra decorative layers that move with the figure (a lens flash) */
  children?: React.ReactNode;
}) {
  const p: Pose = poses[pose];
  const anchors = p.anchors;
  return (
    <span
      className={`avatar avatar--${role} ${className}`.trim()}
      data-avatar={role}
      data-static={eager ? "true" : undefined}
      data-enter-at={enterAt}
      aria-hidden="true"
      style={{ "--ar": `${p.width} / ${p.height}`, "--base": p.base } as React.CSSProperties}
    >
      <span className="avatar__body">
        <span className="avatar__react">
          <Image
            className="avatar__img"
            src={p.src}
            alt=""
            width={p.width}
            height={p.height}
            unoptimized
            draggable={false}
            preload={eager}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "low"}
            decoding={eager ? "sync" : "async"}
          />
          {children}
        </span>
      </span>
      {probes && anchors
        ? Object.entries(probes).map(([anchor, line]) => {
            const a = anchors[anchor];
            return a ? <span key={anchor} className="avatar__probe" data-line={line} style={{ left: `${a.x * 100}%`, top: `${a.y * 100}%` }} /> : null;
          })
        : null}
    </span>
  );
}
