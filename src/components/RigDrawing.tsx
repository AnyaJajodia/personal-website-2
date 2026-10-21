/**
 * Line drawing of a copy-stand digitization rig photographing a specimen
 * envelope — an illustration of the kind of work described on the AMNH
 * page, not documentation of the actual rig (no photograph exists yet).
 */
export default function RigDrawing({ className = "" }: { className?: string }) {
  return (
    <svg className={`rig ${className}`} viewBox="0 0 420 300" aria-hidden="true" focusable="false">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* baseboard in light perspective */}
        <path className="rig__line" d="M40 250 L300 250 L372 214 L118 214 Z" />
        <path className="rig__fine" d="M40 250 v8 h260 v-8 M300 258 l72 -36 v-8" />
        {/* column and clamp */}
        <path className="rig__line" d="M330 228 V40 M338 224 V44 M330 40 h8" />
        <path className="rig__line" d="M322 92 h24 v18 h-24 z" />
        {/* arm and camera */}
        <path className="rig__line" d="M322 100 H214" />
        <path className="rig__line" d="M176 86 h52 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 h-52 a6 6 0 0 1 -6 -6 v-24 a6 6 0 0 1 6 -6 z" />
        <path className="rig__line" d="M186 86 l6 -8 h20 l6 8" />
        <path className="rig__line" d="M188 122 h28 v18 h-28 z M192 140 h20 v10 h-20 z" />
        {/* light arms */}
        <path className="rig__fine" d="M330 150 L250 168 M330 150 L262 132" />
        <path className="rig__line" d="M234 160 l24 -6 6 18 -24 6 z M246 124 l24 2 -2 18 -24 -2 z" />
        {/* field of view */}
        <path className="rig__dash" d="M196 150 L142 232 M208 150 L262 232" />
        {/* specimen envelope on the board */}
        <path className="rig__line" d="M128 240 L276 240 L300 226 L152 226 Z" />
        <path className="rig__fine" d="M140 234 h40 M146 238 h26" />
        {/* the dragonfly inside, very small */}
        <path className="rig__accent" d="M226 233 h22 M237 229 l-6 -3 M237 229 l6 -3 M237 237 l-6 3 M237 237 l6 3" />
        {/* scale bar */}
        <path className="rig__fine" d="M58 272 h80 M58 268 v8 M78 270 v4 M98 268 v8 M118 270 v4 M138 268 v8" />
      </g>
    </svg>
  );
}
