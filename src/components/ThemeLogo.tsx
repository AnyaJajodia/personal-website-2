import Image from "next/image";
import "./ThemeLogo.css";

/**
 * A logo supplied in two colourways, one per site theme (light: deep artwork;
 * dark: pale artwork). Both are rendered in the same box; CSS shows the one
 * matching <html data-theme> — set before first paint by layout.tsx, and kept
 * in step by ThemeToggle — so there is no wrong-colour flash and no layout
 * shift. Without JavaScript, the system preference decides. Announced once:
 * the wrapper is the labelled image; both files are decorative.
 */
export default function ThemeLogo({
  light,
  dark,
  width,
  height,
  label,
  className = "",
}: {
  light: string;
  dark: string;
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  return (
    <span className={`theme-logo ${className}`.trim()} role="img" aria-label={label} style={{ aspectRatio: `${width} / ${height}` }}>
      <Image className="theme-logo__img theme-logo__img--light" src={light} alt="" width={width} height={height} unoptimized loading="eager" />
      <Image className="theme-logo__img theme-logo__img--dark" src={dark} alt="" width={width} height={height} unoptimized loading="eager" />
    </span>
  );
}
