import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, person } from "@/content/site";

/**
 * The link preview for every page (LinkedIn, iMessage, Slack, search): the
 * name in the site's serif on its paper, the tagline, a line of the thread,
 * and the waving figure from Say hello. Rendered once, at build.
 */
export const alt = `${person.name} — ${hero.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const root = process.cwd();
  const [serif, figure] = await Promise.all([
    readFile(join(root, "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff")),
    readFile(join(root, "public/assets/avatar/10-waving/waving-01.png")),
  ]);
  const src = `data:image/png;base64,${figure.toString("base64")}`;
  const [first, last] = person.name.split(" ");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#f7f4ee", fontFamily: "Cormorant" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0 }}>
          <path
            d="M-20 560C120 548 210 590 330 556S520 470 600 500c50 19 34 74-8 66-44-9-24-80 30-78 70 3 96 92 190 88s130-140 236-150"
            fill="none"
            stroke="#493247"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 70px 88px", width: 780 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 150, lineHeight: 0.9, letterSpacing: -3, color: "#242321" }}>
            <span>{first}</span>
            <span>{last}.</span>
          </div>
          <div style={{ marginTop: 38, fontSize: 40, lineHeight: 1.2, color: "#3d3a35", maxWidth: 640 }}>{hero.tagline}</div>
        </div>
        <img src={src} width={360} height={540} alt="" style={{ position: "absolute", right: 70, bottom: 30 }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: serif, weight: 500, style: "normal" }] },
  );
}
