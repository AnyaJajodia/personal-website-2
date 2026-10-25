"use client";

import { useEffect, useRef } from "react";
import "./OnThisPage.css";

/**
 * "On this page": plain in-page links (they work without JavaScript; the
 * targets carry a scroll-margin for the fixed header). With JavaScript, a
 * choice scrolls there smoothly (instantly under reduced motion) and moves
 * focus to the section, and the section being read is marked
 * (aria-current="location"): the last heading that has passed a line just
 * under the header.
 */
export type TocItem = { id: string; label: string; n?: string };

export default function OnThisPage({ items, className = "" }: { items: TocItem[]; className?: string }) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = nav.current;
    if (!root) return;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
    const targets = links.map((a) => document.getElementById(a.hash.slice(1)));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 68) + window.innerHeight * 0.18;
      let active = -1;
      targets.forEach((t, i) => {
        if (t && t.getBoundingClientRect().top <= line) active = i;
      });
      // at the very end of the page, the last section is the one being read
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = targets.length - 1;
      links.forEach((a, i) => (i === active ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.hash.slice(1);
    const el = document.getElementById(id);
    if (!el || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
    // keyboard and screen-reader users continue from the section they chose
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  return (
    <nav ref={nav} className={`toc ${className}`.trim()} aria-labelledby="toc-title">
      <h2 className="toc__title" id="toc-title">
        On this page
      </h2>
      <ol className="toc__list">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="toc__link" onClick={go}>
              {it.n ? <span className="toc__n">{it.n}</span> : <span className="toc__n" aria-hidden="true" />}
              <span className="toc__label">{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
