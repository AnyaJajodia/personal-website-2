import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { work } from "@/content/work";
import { AMNH_ROUTES } from "@/content/amnh";

/**
 * /sitemap.xml: every public page, from the same lists the routes are built
 * from (content/work.ts, the AMNH routes), so a new project page is listed
 * without touching this file. Writing and Experiments are not routes in this
 * release, so they never appear.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const at = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  });
  return [
    at("/", 1),
    // the two current commitments lead, then the rest of the work
    ...work.map((w) => at(w.slug === "amnh" ? AMNH_ROUTES.overview : `/work/${w.slug}`, w.slug === "lynxster" || w.slug === "amnh" ? 0.9 : 0.7)),
    at(AMNH_ROUTES.diode, 0.8),
    at(AMNH_ROUTES.behavioral, 0.8),
    at("/wildlife-photography", 0.6),
  ];
}
