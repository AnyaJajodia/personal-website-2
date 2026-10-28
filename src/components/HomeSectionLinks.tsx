"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** sessionStorage key: the homepage section to travel down to on arrival (SmoothAnchors) */
export const HOME_TO = "home:to";

/**
 * From any other page, a link to a homepage section ("/#about", "/#contact",
 * the breadcrumbs' "/#work"…) opens the homepage at its top and then travels
 * down to the section on its own, so the line draws its way there, instead of
 * opening at the section. The section is handed over in sessionStorage and the
 * URL gets its hash once the journey ends. Modified clicks (new tab and so on)
 * and the homepage's own in-page links are left alone.
 */
export default function HomeSectionLinks() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (location.pathname === "/") return;
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="/#"]');
      if (!a || a.target === "_blank") return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(2));
      if (!id) return;
      // before Next's own Link handler, which would open the page at the section
      e.preventDefault();
      try {
        sessionStorage.setItem(HOME_TO, id);
      } catch {
        // storage unavailable: open at the section as before
        router.push(`/#${id}`);
        return;
      }
      router.push("/");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);
  return null;
}
