"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * One button that swaps Light and Dark. The default is System: until the
 * button is pressed the site follows the OS preference, live. A press swaps
 * to the other theme; a swap that lands back on the OS's own theme returns
 * to following the system (nothing stored), any other is remembered
 * (localStorage "theme"). The theme is applied before first paint by the
 * script in layout.tsx (data-theme and data-theme-pref on <html>); switching
 * changes attributes only — nothing reloads, scroll and any open interaction
 * stay.
 *
 * The icon names what a press does (a moon in Light, a sun in Dark). Both
 * are drawn in one glyph and CSS picks between them from data-theme, so the
 * server markup never disagrees with the theme already applied: the outgoing
 * one shrinks as its strokes undraw, the incoming one grows and draws itself
 * in (after 21st.dev's animated-theme-toggle). It is a toggle button:
 * pressed = Dark.
 *
 * A press reveals the new theme from the button outward, inside a soft
 * many-lobed outline that wobbles as it grows past the corners (after
 * 21st.dev's "Theme Toggle" organic page reveal), using a view transition.
 * Without view transitions, or with reduced motion, the colours ease over or
 * simply change.
 */

type Pref = "system" | "light" | "dark";

const dark = () => window.matchMedia("(prefers-color-scheme: dark)");
const readPref = (): Pref => {
  const p = document.documentElement.dataset.themePref;
  return p === "light" || p === "dark" ? p : "system";
};
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Twelve smooth lobes around `o`, in viewport pixels, past every corner at p = 1 */
function blob(p: number, o: { x: number; y: number }, w: number, h: number, phase: number) {
  const reach = Math.hypot(Math.max(o.x, w - o.x), Math.max(o.y, h - o.y)) / 0.72;
  const pts = Array.from({ length: 12 }, (_, k) => {
    const a = (k * Math.PI) / 6;
    const r = reach * p * (1 + 0.12 * Math.sin(a * 3 + p * 0.65 + phase) + 0.065 * Math.cos(a * 5 - p * 0.35 - phase * 0.7));
    return { x: o.x + Math.cos(a) * r, y: o.y + Math.sin(a) * r };
  });
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let k = 0; k < 12; k++) {
    const [b, s, e, n] = [pts[(k + 11) % 12], pts[k], pts[(k + 1) % 12], pts[(k + 2) % 12]];
    d += `C${f(s.x + (e.x - b.x) / 6)} ${f(s.y + (e.y - b.y) / 6)} ${f(e.x - (n.x - s.x) / 6)} ${f(e.y - (n.y - s.y) / 6)} ${f(e.x)} ${f(e.y)}`;
  }
  return d + "Z";
}

/** the button's own disc, kept inside the new view from the first frame */
const disc = (c: { x: number; y: number; r: number }) =>
  `M${c.x - c.r} ${c.y}A${c.r} ${c.r} 0 1 1 ${c.x + c.r} ${c.y}A${c.r} ${c.r} 0 1 1 ${c.x - c.r} ${c.y}Z`;

function set(pref: Pref) {
  const root = document.documentElement;
  const resolved = pref === "dark" || (pref === "system" && dark().matches) ? "dark" : "light";
  root.dataset.themePref = pref;
  root.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#211E1C" : "#F7F4EE");
}

/**
 * `from`: the control that asked, for the reveal's origin. Without it (the
 * OS changing its theme) the colours just ease over.
 */
export function applyTheme(pref: Pref, animate = true, from?: HTMLElement) {
  const root = document.documentElement;
  if (!animate || reduced()) return set(pref);

  const box = from?.getBoundingClientRect();
  const canReveal = box && typeof document.startViewTransition === "function" && CSS.supports("clip-path", 'path("M0 0L1 0L1 1Z")');
  if (!canReveal) {
    root.dataset.themeChanging = "true";
    set(pref);
    window.setTimeout(() => delete root.dataset.themeChanging, 420);
    return;
  }

  const w = root.clientWidth;
  const h = window.innerHeight;
  const o = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  const button = disc({ ...o, r: box.width / 2 + 2 });
  const phase = Math.random() * Math.PI * 2;
  // the same commands in every frame, so the browser can tween between them
  const frames = Array.from({ length: 16 }, (_, k) => ({ clipPath: `path("${blob(k / 15, o, w, h, phase)}${button}")` }));

  root.dataset.themeReveal = "";
  const vt = document.startViewTransition(() => set(pref));
  vt.ready
    .then(() => {
      root.animate(frames, {
        duration: 820,
        easing: "cubic-bezier(0.42, 0, 0.18, 1)",
        pseudoElement: "::view-transition-new(root)",
      });
    })
    .catch(() => {});
  vt.finished.finally(() => delete root.dataset.themeReveal);
}

// whether Dark is showing, kept in step with <html data-theme>
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const isDark = () => document.documentElement.dataset.theme === "dark";

export default function ThemeToggle() {
  const pressed = useSyncExternalStore(subscribe, isDark, () => false);

  // follow the OS while no choice is stored (on every page, via the header)
  useEffect(() => {
    const mq = dark();
    const onChange = () => {
      if (readPref() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const swap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark() ? "light" : "dark";
    const os = dark().matches ? "dark" : "light";
    const pref: Pref = next === os ? "system" : next;
    try {
      if (pref === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", pref);
    } catch {
      /* private mode: the swap still applies for this page */
    }
    applyTheme(pref, true, e.currentTarget);
  };

  return (
    <div className="theme-toggle">
      <button type="button" className="theme-toggle__button" aria-label="Dark theme" aria-pressed={pressed} onClick={swap}>
        {/* which half shows is decided by CSS from <html data-theme> */}
        <svg className="theme-toggle__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g className="theme-toggle__moon">
            <path pathLength="1" d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8z" />
          </g>
          <g className="theme-toggle__sun">
            <circle pathLength="1" cx="12" cy="12" r="4.2" />
            <g className="theme-toggle__rays">
              <path pathLength="1" d="M12 2.6v2.2" />
              <path pathLength="1" d="M12 19.2v2.2" />
              <path pathLength="1" d="M2.6 12h2.2" />
              <path pathLength="1" d="M19.2 12h2.2" />
              <path pathLength="1" d="M5.35 5.35l1.55 1.55" />
              <path pathLength="1" d="M17.1 17.1l1.55 1.55" />
              <path pathLength="1" d="M5.35 18.65l1.55-1.55" />
              <path pathLength="1" d="M17.1 6.9l1.55-1.55" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
