"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav, person } from "@/content/site";
import ThemeToggle from "@/components/ThemeToggle";

type Props = {
  /** home: anchors scroll in-page and the name appears once the hero name recedes */
  variant: "home" | "detail";
  /** Start dark (Lynxster opening). Switches to light once the dark band has scrolled under the header. */
  darkUntilSelector?: string;
};

export default function SiteHeader({ variant, darkUntilSelector }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [settled, setSettled] = useState(variant === "detail");
  const [dark, setDark] = useState(Boolean(darkUntilSelector));

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const update = () => {
      const h = header.offsetHeight;
      if (variant === "home") {
        const name = document.querySelector("[data-line='hero-name']");
        if (name) setSettled(name.getBoundingClientRect().bottom < h + 8);
      } else {
        setSettled(true);
      }
      if (darkUntilSelector) {
        const band = document.querySelector(darkUntilSelector);
        if (band) setDark(band.getBoundingClientRect().bottom > h * 0.5);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [variant, darkUntilSelector]);

  const brandHref = variant === "home" ? "#top" : "/";

  return (
    <header
      ref={ref}
      className="site-header"
      data-settled={settled ? "true" : "false"}
      data-tone={dark ? "dark" : "light"}
      data-variant={variant}
    >
      <div className="site-header__inner container">
        {variant === "home" ? (
          <a className="site-header__brand" href={brandHref} tabIndex={settled ? 0 : -1} aria-hidden={!settled}>
            {person.name}.
          </a>
        ) : (
          <Link className="site-header__brand" href="/">
            {person.name}.
          </Link>
        )}
        <nav aria-label="Primary">
          <ul className="site-nav">
            {nav.map((item) =>
              variant === "home" ? (
                <li key={item.hash}>
                  <a href={`#${item.hash}`}>{item.label}</a>
                </li>
              ) : (
                <li key={item.hash}>
                  <Link href={`/#${item.hash}`} className={item.hash === "work" ? "is-current" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
