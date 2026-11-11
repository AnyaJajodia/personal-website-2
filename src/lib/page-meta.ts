import type { Metadata } from "next";
import { hero, person } from "@/content/site";

/**
 * One page's search and share metadata: its title, description, canonical
 * path (resolved against the public address, layout.tsx metadataBase) and the
 * Open Graph / X card built from the same words. Next replaces a parent's
 * openGraph rather than merging it, so every page passes through here; the
 * share image is the site-wide one (app/opengraph-image.tsx).
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  // named on every page: a page's own openGraph would otherwise drop the
  // image file's (app/opengraph-image.tsx)
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${person.name} — ${hero.tagline}` }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: person.name, locale: "en_US", url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}
