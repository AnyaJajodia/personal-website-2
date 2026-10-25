"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * System / Light / Dark. The choice is applied before first paint by the
 * script in layout.tsx (data-theme and data-theme-pref on <html>); this
 * control only changes it. "System" follows the OS preference, live; an
 * explicit choice is remembered (localStorage "theme"). Switching changes
 * attributes only — nothing reloads, scroll and any open interaction stay.
 *
 * The button's icon is chosen in CSS from data-theme-pref, so the server
 * markup never disagrees with the theme already applied. The menu is a
 * small radio menu: arrows move, Enter/Space choose, Escape closes.
 */

type Pref = "system" | "light" | "dark";
const PREFS: { value: Pref; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const dark = () => window.matchMedia("(prefers-color-scheme: dark)");
const readPref = (): Pref => {
  const p = document.documentElement.dataset.themePref;
  return p === "light" || p === "dark" ? p : "system";
};

export function applyTheme(pref: Pref, animate = true) {
  const root = document.documentElement;
  const resolved = pref === "dark" || (pref === "system" && dark().matches) ? "dark" : "light";
  const soft = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (soft) root.dataset.themeChanging = "true";
  root.dataset.themePref = pref;
  root.dataset.theme = resolved;
  if (soft) window.setTimeout(() => delete root.dataset.themeChanging, 420);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#211E1C" : "#F7F4EE");
}

export default function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [pref, setPref] = useState<Pref>("system");
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // follow the OS while "System" is chosen (on every page, via the header)
  useEffect(() => {
    const mq = dark();
    const onChange = () => {
      if (readPref() === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = useCallback((focusButton: boolean) => {
    setOpen(false);
    if (focusButton) btn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    // focus the current choice
    menu.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  const choose = (p: Pref) => {
    try {
      if (p === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", p);
    } catch {
      /* private mode: the choice still applies for this page */
    }
    applyTheme(p);
    setPref(p);
    close(true);
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") close(false);
  };

  return (
    <div className="theme-toggle">
      <button
        ref={btn}
        type="button"
        className="theme-toggle__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="theme-menu"
        aria-label="Colour theme"
        onClick={() => {
          setPref(readPref());
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setPref(readPref());
            setOpen(true);
          }
        }}
      >
        {/* which icon shows is decided by CSS from <html data-theme-pref> */}
        <svg className="theme-toggle__icon theme-toggle__icon--system" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="7.2" />
          <path d="M12 4.8a7.2 7.2 0 0 1 0 14.4z" className="theme-toggle__fill" />
        </svg>
        <svg className="theme-toggle__icon theme-toggle__icon--light" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
        </svg>
        <svg className="theme-toggle__icon theme-toggle__icon--dark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8z" />
        </svg>
      </button>
      {open ? (
        <div ref={menu} id="theme-menu" className="theme-toggle__menu" role="menu" aria-label="Colour theme" onKeyDown={onMenuKey}>
          {PREFS.map((p) => (
            <button
              key={p.value}
              type="button"
              role="menuitemradio"
              aria-checked={pref === p.value}
              tabIndex={pref === p.value ? 0 : -1}
              className="theme-toggle__item"
              onClick={() => choose(p.value)}
            >
              <span className="theme-toggle__check" aria-hidden="true" />
              {p.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
