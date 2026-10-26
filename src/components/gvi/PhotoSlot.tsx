"use client";

import Image, { type ImageLoader } from "next/image";
import type { FieldPhoto } from "@/content/gvi-photos";

/**
 * One of the page's photographs (content/gvi-photos.ts): a figure at the
 * photograph's own proportions, served from the pre-sized WebP copies
 * (scripts/build-gvi-photos.mjs) through a responsive srcset, with its
 * caption. The opening photograph can carry its caption over the open road
 * in its lower-left corner when the frame is wide enough (gvi.css); every
 * other case, and every narrow screen, sets it beneath the frame.
 */
export default function PhotoSlot({ photo, className = "", priority = false }: { photo: FieldPhoto; className?: string; priority?: boolean }) {
  // the smallest exported width that covers the request, else the largest
  const loader: ImageLoader = ({ src, width }) => `${src}-${photo.widths.find((w) => w >= width) ?? photo.widths[photo.widths.length - 1]}.webp`;
  const style = { "--ratio": `${photo.width} / ${photo.height}` } as React.CSSProperties;
  return (
    <figure className={`gvi-photo${photo.overlay ? " gvi-photo--overlay" : ""} ${className}`.trim()} data-photo={photo.id} style={style}>
      <div className="gvi-photo__frame">
        <Image
          className="gvi-photo__img"
          loader={loader}
          src={photo.stem}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={photo.sizes}
          preload={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      <figcaption className="gvi-photo__caption">
        <span>{photo.caption}</span>
      </figcaption>
    </figure>
  );
}
