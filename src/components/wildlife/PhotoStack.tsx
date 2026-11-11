import Link from "next/link";
import type { Photo } from "@/content/wildlife";

/**
 * The homepage's Wildlife photography composition: two of the photographs
 * laid on the page, a little off-square — the leading one in front, the
 * other set behind it to the left, enough of it showing to know it
 * (content/wildlife-photos.json `homepage`). Each is the supplied file,
 * whole, at its own proportions, on a slim paper margin.
 *
 * The arrangement is one link to the gallery, named for it; the photographs
 * inside are decorative to it (the gallery describes them). On hover or
 * keyboard focus the one behind grows a little and the front one lifts.
 */
export default function PhotoStack({ photos, href, label }: { photos: Photo[]; href: string; label: string }) {
  const [lead, ...behind] = photos;
  return (
    <Link href={href} className="more__photos" aria-label={label}>
      {[...behind, lead].map((p) => (
        <span
          key={p.id}
          className={`more__photo more__photo--${p === lead ? "lead" : "behind"}`}
          style={{ "--ar": p.width / p.height, "--tone": p.tone.light, "--tone-dark": p.tone.dark } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} width={p.width} height={p.height} alt="" loading="lazy" decoding="async" draggable={false} />
        </span>
      ))}
    </Link>
  );
}
