import { ViewTransition } from "react";

/**
 * Page to page: the page you leave lifts away and fades, and the next one
 * settles up into place a beat later (globals.css "page transitions"). The
 * header is its own transition group, so it stays put rather than fading
 * with the page. Route changes are React transitions, so these run on every
 * navigation, including Back; reduced motion and browsers without view
 * transitions simply swap the page.
 *
 * Used by app/template.tsx (home ↔ work ↔ wildlife) and app/work/template.tsx
 * (one project to another), which remount on every navigation they cover.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
