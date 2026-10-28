/**
 * The Contents' vignettes: each body of work's mark, redrawn as a few pen
 * strokes (WorkDrawer). At rest they are pencil; pointing at an entry inks
 * its vignette over the pencil in the mark's own colours (WorkDrawer.css,
 * `--v1` and, where a mark has two, `--v2`, set per entry by `data-v`).
 *
 * Drawn from the real marks, simplified to what a pen can say in a 48×40
 * box: Crackd's squint-and-grin, Buzzworks' folded ribbon, TMU's block with
 * its yellow corner, a lens over a walking gait for Inteli-lens, GVI's
 * lowercase letters and a stack of pages for the publications. Lynxster,
 * AMNH and teaching use the supplied icons (ICONS below). Every stroke has
 * pathLength 1 so it can be drawn on.
 */

type Stroke = { d: string; two?: boolean };

const ring = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const VIGNETTES: Record<string, Stroke[]> = {
  crackd: [
    { d: "M13 5.5 L19.5 9.6 L13 13.4" },
    { d: "M35 5.5 L28.5 9.6 L35 13.4" },
    { d: "M7.5 18.5 C14 21 32 21 40.5 17.5 C38.5 30 31 35.8 23.5 35.8 C15.5 35.8 9 29.5 7.5 18.5 Z" },
  ],
  // a ring of ribbon, turned so its far side shows narrow, with its fold at the top right
  buzzworks: [
    { d: "M29 6.5 C38.5 8 42 18.5 37 27.5 C32 36.5 18 38.5 11.5 31 C5 23.5 8.5 11 18.5 7.5 C22 6.3 25.5 6 29 6.5" },
    { d: "M29 6.5 C33 10.5 33.5 17 31 23 C28 30 21 32.5 16.5 29 C12.5 25.5 13.5 18 18.5 14 C21.5 11.5 25 11 28.5 12", two: true },
    { d: "M28.5 12 C30 10 30.2 8 29 6.5", two: true },
  ],
  tmu: [
    { d: "M7.5 11.5 L35.5 11 L36 36 L8 36.5 Z" },
    { d: "M12.5 18.5 H29" },
    { d: "M12.5 24 H31" },
    { d: "M12.5 29.5 H26" },
    { d: "M31 5.8 L41.2 5.8 L41.2 29", two: true },
  ],
  inteli: [
    { d: ring(20, 17, 11) },
    { d: "M28.2 25 L39.5 36.5" },
    { d: "M12.5 19 C14.5 14 16.5 14 18.5 19 C20.5 24 22.5 24 24.5 19 C25.5 16.5 26.5 16 27.5 17", two: true },
  ],
  gvi: [
    { d: ring(14, 17.5, 4.5) },
    { d: "M18.5 13 V27 C18.5 32.5 11 33 9.5 29" },
    { d: "M22.5 13 L27 23 L31.5 13" },
    { d: "M36 13 V23" },
    { d: ring(36, 8, 1.4), two: true },
  ],
  pubs: [
    { d: "M15 5.5 H35.5 V29" },
    { d: "M10 9.5 H30.5 V35.5 H10 Z" },
    { d: "M14.5 16.5 H26", two: true },
    { d: "M14.5 21.5 H26", two: true },
    { d: "M14.5 26.5 H21.5", two: true },
  ],
};

/**
 * Supplied icons (currently-icons-svg.zip, 27 Oct 2026), in a 64×64 frame:
 * Lynxster (traced from the mark: the regular cut, its fill simplified to a
 * polygon for this size), AMNH's museum facade and the Ionic column for
 * teaching. Lines draw on like the pen vignettes; the filled parts and the
 * accent nodes arrive once the lines are down.
 */
type Icon = { box: string; strokes: Stroke[]; fill?: string; nodes?: [number, number, number][] };

const ICONS: Record<string, Icon> = {
  lynxster: {
    box: "0.5 6.5 63 52.5",
    strokes: [
      { d: "M3.08 10.3L14.08 18.5L21.53 23.62" },
      { d: "M21.53 23.62L41.31 23.85" },
      { d: "M41.31 23.85L60.86 10.3" },
      { d: "M3.08 10.3L9.31 26.53L5.41 38.11" },
      { d: "M60.86 10.3L54.63 26.59L58.88 38.11" },
      { d: "M5.41 38.11L18.85 46.25C21.53 48.58 25.37 52.48 31.82 54.81" },
      { d: "M58.88 38.11L45.09 46.25C42.12 48.58 38.28 52.48 31.82 54.81" },
      { d: "M9.31 26.53L14.31 31.3" },
      { d: "M54.63 26.59L50.15 31.19" },
      { d: "M41.31 23.85C40.14 29.67 38.86 34.91 37.93 37.82L36.42 44.1" },
      { d: "M26.65 40.26L27.93 44.1" },
      { d: "M31.77 48.99L31.77 51.78" },
    ],
    fill: "M31.36 55.01L30.14 54.6L29.01 54.05L28.33 53.44L28.89 52.89L29.5 52.86L30.14 52.68L30.53 52.48L30.81 52.19L31.1 51.66L31.18 50.88L31.8 50.27L32.35 50.92L32.49 51.66L32.64 51.94L32.99 52.28L33.57 52.62L34.21 52.74L35.46 52.77L36.01 53.32L35.42 53.88L33.98 54.6L32.64 55.01L31.36 55.01ZM31.42 49.26L31.01 48.76L30.2 48.38L29.5 47.94L28.51 46.95L28.28 46.63L27.84 45.44L27.58 44.4L27.86 44.03L28.13 43.75L28.74 44.25L29.09 44.42L29.79 44.6L32.32 44.68L34.15 44.65L34.5 44.6L35.08 44.36L35.42 44.16L35.98 43.64L36.54 44.29L36.1 45.79L35.69 46.49L34.27 47.88L33.63 48.32L32.41 48.87L31.73 49.57L31.42 49.26ZM26.24 40.59L25.7 40.03L24.96 39.59L23.56 39.42L21.47 39.36L20.89 39.18L20.36 39.13L19.26 38.66L18.45 38.17L17.05 36.83L16.55 36.19L14.92 32.93L14.49 32.19L13.9 31.51L14.21 31.2L14.57 30.95L15.59 31.74L19.72 34.06L21.35 34.88L22.98 35.58L23.62 35.81L25.27 36.25L25.7 36.55L26.01 36.96L26.33 37.76L27.15 40.27L26.55 40.9L26.24 40.59ZM41.42 39.42L41.02 39.36L40.06 39.04L39.46 38.69L38.75 38.14L38.28 37.9L37.96 37.88L37.47 37.38L37.64 36.46L38.2 35.83L38.46 36.04L38.75 36.16L39.21 36.16L40.73 35.75L43.98 34.53L45.09 34.01L47.13 32.9L48.98 31.65L50.01 30.83L50.62 31.45L49.51 33L47.27 36.71L46.89 37.24L46.08 38.05L45.26 38.63L44.39 39.04L43.63 39.18L43.23 39.36L42.01 39.45L41.42 39.42Z",
    nodes: [[3.08, 10.3, 0.99], [14.08, 18.5, 1.28], [21.53, 23.62, 1.75], [41.31, 23.85, 1.8], [60.86, 10.3, 0.99], [9.31, 26.53, 1.72], [54.63, 26.59, 1.75], [5.41, 38.11, 1.72], [58.88, 38.11, 1.66], [18.85, 46.25, 1.63], [45.09, 46.25, 1.63]],
  },
  amnh: {
    box: "3 8.5 58 48.3",
    strokes: [
      { d: "M10 24 L32 12 L54 24 Z" },
      { d: "M8 28 L56 28" },
      { d: "M16 31 L16 47" },
      { d: "M26 31 L26 47" },
      { d: "M38 31 L38 47" },
      { d: "M48 31 L48 47" },
      { d: "M8 50 L56 50" },
      { d: "M5 54 L59 54" },
    ],
    nodes: [[32.0, 20.5, 2.1]],
  },
  teaching: {
    box: "5 13 54 45",
    strokes: [
      { d: "M10 16 L54 16" },
      { d: "M14 20 L50 20" },
      { d: "M20 20 C20 28 44 28 44 20" },
      { d: "M14 20 C8 20 7 30 13 31 C17.5 31.5 18.5 25.5 14.5 25" },
      { d: "M50 20 C56 20 57 30 51 31 C46.5 31.5 45.5 25.5 49.5 25" },
      { d: "M22 30 L22 52 M42 30 L42 52" },
      { d: "M27 32 L27 51 M32 32 L32 51 M37 32 L37 51" },
      { d: "M18 52 L46 52 M14 56 L50 56" },
    ],
    nodes: [[14.4, 26.4, 1.6], [49.6, 26.4, 1.6]],
  },
};

export const hasVignette = (key: string) => key in VIGNETTES || key in ICONS;

export default function Vignette({ v }: { v: string }) {
  const icon = ICONS[v];
  const strokes = icon?.strokes ?? VIGNETTES[v];
  if (!strokes) return null;
  const paths = (ink: boolean) =>
    strokes.map((st, k) => (
      <path
        key={k}
        d={st.d}
        pathLength={1}
        className={ink && st.two ? "vignette__two" : undefined}
        style={ink ? ({ "--k": k } as React.CSSProperties) : undefined}
      />
    ));
  const extras = (ink: boolean) =>
    icon ? (
      <>
        {icon.fill ? <path className="vignette__fill" d={icon.fill} /> : null}
        {icon.nodes?.map(([cx, cy, r], k) => (
          <circle key={k} className="vignette__node" cx={cx} cy={cy} r={r} style={ink ? ({ "--k": k } as React.CSSProperties) : undefined} />
        ))}
      </>
    ) : null;
  return (
    <span className={`vignette${icon ? " vignette--icon" : ""}`} aria-hidden="true">
      <svg viewBox={icon?.box ?? "0 0 48 40"} focusable="false">
        <g className="vignette__pencil">
          {paths(false)}
          {extras(false)}
        </g>
        <g className="vignette__ink">
          {paths(true)}
          {extras(true)}
        </g>
      </svg>
    </span>
  );
}
