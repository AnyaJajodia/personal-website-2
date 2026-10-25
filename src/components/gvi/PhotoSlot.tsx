import Image from "next/image";
import type { FieldPhoto } from "@/content/gvi-photos";

/**
 * One of the page's photographs (content/gvi-photos.ts). With a `src`, the
 * photograph at its configured proportions; without one, a quiet placeholder
 * of the same shape — a viewfinder, what belongs there, and the caption — so
 * the composition holds and nothing shifts when the real photo arrives.
 */
export default function PhotoSlot({ photo, className = "", priority = false }: { photo: FieldPhoto; className?: string; priority?: boolean }) {
  const style = { "--ratio": photo.ratio, "--ratio-narrow": photo.ratioNarrow ?? photo.ratio } as React.CSSProperties;
  return (
    <figure className={`gvi-photo ${className}`.trim()} data-photo={photo.id} style={style}>
      <div className="gvi-photo__frame">
        {photo.src ? (
          <Image
            className="gvi-photo__img"
            src={photo.src}
            alt={photo.alt}
            width={photo.width ?? 1600}
            height={photo.height ?? 1000}
            unoptimized
            preload={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="gvi-photo__empty">
            <span className="gvi-photo__corners" aria-hidden="true" />
            <span className="gvi-photo__label">Photograph to come</span>
            <span className="gvi-photo__wanted">{photo.wanted}</span>
            {photo.care ? <span className="gvi-photo__care">{photo.care}</span> : null}
          </div>
        )}
      </div>
      <figcaption className="gvi-photo__caption">{photo.caption}</figcaption>
    </figure>
  );
}
