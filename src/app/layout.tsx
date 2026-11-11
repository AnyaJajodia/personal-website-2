import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { hero, person, site } from "@/content/site";
import HomeSectionLinks from "@/components/HomeSectionLinks";

// the approved hero copy, verbatim (src/content/site.ts)
// every page's canonical URL and share preview resolve against the public
// address; each page names its own canonical path (alternates)
const description = `${hero.intro} ${hero.location}`;
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${person.name} — ${hero.tagline}`,
  description,
  applicationName: person.name,
  authors: [{ name: person.name, url: site.url }],
  creator: person.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: person.name,
    locale: "en_US",
    title: person.name,
    description,
  },
  twitter: { card: "summary_large_image", title: person.name, description },
  verification: {
    google: site.verification.google || undefined,
    other: site.verification.bing ? { "msvalidate.01": site.verification.bing } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4EE" },
    { media: "(prefers-color-scheme: dark)", color: "#211E1C" },
  ],
};

/**
 * Applies the colour theme before first paint, so there is never a flash of
 * the wrong one: an explicit choice (localStorage "theme": light | dark) or
 * the system preference. ThemeToggle changes it afterwards.
 */
const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("theme");if(p!=="light"&&p!=="dark")p="system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.dataset.themePref=p;}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // the theme attributes are set by THEME_SCRIPT before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <HomeSectionLinks />
        {children}
      </body>
    </html>
  );
}
