import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { hero, person } from "@/content/site";
import HomeSectionLinks from "@/components/HomeSectionLinks";

// the approved hero copy, verbatim (src/content/site.ts)
export const metadata: Metadata = {
  title: `${person.name} — ${hero.tagline}`,
  description: `${hero.intro} ${hero.location}`,
  robots: { index: false, follow: false }, // private preview — remove before publishing
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
