/**
 * One authored moment at a time. The homepage has a few small entrances that
 * are cued by scrolling — a figure arriving (AvatarStage), a heading's pen
 * mark being drawn (MarkStage). When two are cued together they take turns
 * instead of moving at once: each asks for a slot and is told how long to
 * wait. Only the next one in line waits, and never for long, so nothing
 * feels late; anything already scrolled past simply finishes.
 */

let busyUntil = 0;

/**
 * Reserve the next slot for a moment lasting `ms`. Returns how long to wait
 * before starting it (0 when nothing else is moving). The slot is held for
 * most of the moment, so the next one can start as this one settles.
 */
export function claimMoment(ms: number, maxWait = 650): number {
  const now = performance.now();
  const wait = Math.min(maxWait, Math.max(0, busyUntil - now));
  busyUntil = now + wait + ms * 0.7;
  return wait;
}
