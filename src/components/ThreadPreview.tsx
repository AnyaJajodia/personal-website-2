import { join } from "node:path";
import InView from "@/components/lynxster/InView";
import { namespacedSvg } from "@/lib/inline-svg";
import "./ThreadPreview.css";

/**
 * The homepage's two "Two threads" previews, after option 10 of the preview
 * studies ("On the page, with a colour scrap"): each mark drawn in thread on
 * the page itself, over a torn scrap of its colour — Lynxster's lynx, AMNH's
 * collection card and research page — with a quiet caption beneath.
 *
 * Files: public/assets/lynxster/home-preview.svg and
 * public/assets/amnh/home-preview.svg (the study's artwork, its loose thread
 * tails removed), inlined with their classes namespaced to pv-. The marks
 * draw once as they come into view (InView); on hover, or when the feature's
 * title or button has keyboard focus, the lynx lifts off its scrap and its
 * nodes tighten, and the AMNH cards part (ThreadPreview.css). Decorative —
 * the feature's title names it.
 */
const FILES = {
  lynxster: ["lynxster", "home-preview.svg"],
  amnh: ["amnh", "home-preview.svg"],
} as const;

export default function ThreadPreview({ which, caption }: { which: keyof typeof FILES; caption: string }) {
  // read as the page is rendered (the homepage is static: once, at build)
  const svg = namespacedSvg(join(process.cwd(), "public", "assets", ...FILES[which]), "pv");
  return (
    <InView className={`pv pv--${which}`}>
      <div className="pv__art" dangerouslySetInnerHTML={{ __html: svg }} />
      <span className="pv__caption">{caption}</span>
    </InView>
  );
}
