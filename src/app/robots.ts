import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** /robots.txt: the whole site may be crawled; the sitemap lists its pages */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
