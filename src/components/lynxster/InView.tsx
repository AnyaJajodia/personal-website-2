"use client";

import { useEffect, useRef } from "react";

/**
 * Marks its element `data-inview="true"` once it is well inside the viewport
 * (once; never taken back), so CSS can play a one-time entrance. Without
 * JavaScript the CSS shows the finished state.
 */
export default function InView({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.inview = "false";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.inview = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
