import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anya Jajodia — Engineering, research, and other things",
  description:
    "Anya Jajodia builds software, asks questions, and follows the occasional question into a museum. Based in New York.",
  robots: { index: false, follow: false }, // private preview — remove before publishing
};

export const viewport: Viewport = {
  themeColor: "#F7F4EE",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
