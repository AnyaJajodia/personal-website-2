"use client";

import { useState } from "react";

/**
 * A small interactive node diagram for the Experiments tile, in the spirit of
 * Magic UI's Animated Beam demo: point at (or tap) a node and beams run from
 * it along its connections; click pins it. Purely decorative (aria-hidden,
 * no focus stops) — it illustrates "experiments" without claiming any.
 * Beams only travel while the tile is hovered, and never with reduced motion.
 */

const NODES = [
  { x: 52, y: 118 },
  { x: 160, y: 52 },
  { x: 178, y: 168 },
  { x: 292, y: 104 },
  { x: 402, y: 44 },
  { x: 420, y: 172 },
  { x: 530, y: 102 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [3, 4],
  [3, 5],
  [2, 5],
  [4, 6],
  [5, 6],
];

const DEFAULT = 3;

function curve(a: number, b: number) {
  const p = NODES[a];
  const q = NODES[b];
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  // bow each edge slightly, alternating sides, so it reads as drawn
  const k = ((a + b) % 2 ? 1 : -1) * 0.12;
  const cx = mx - (q.y - p.y) * k;
  const cy = my + (q.x - p.x) * k;
  return `M${p.x} ${p.y}Q${cx} ${cy} ${q.x} ${q.y}`;
}

export default function ExperimentsDiagram() {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = hover ?? pinned ?? DEFAULT;
  const linked = new Set<number>([active]);
  EDGES.forEach(([a, b]) => {
    if (a === active) linked.add(b);
    if (b === active) linked.add(a);
  });

  return (
    <div className="bento__scene scene-lab" aria-hidden="true">
      <svg viewBox="0 0 580 220" preserveAspectRatio="xMidYMid meet" onPointerLeave={() => setHover(null)}>
        <g className="lab__edges">
          {EDGES.map(([a, b]) => {
            const on = a === active || b === active;
            return (
              <g key={`${a}-${b}`}>
                <path d={curve(a, b)} className={`lab__edge${on ? " is-on" : ""}`} />
                {on ? <path d={a === active ? curve(a, b) : curve(b, a)} className="lab__beam" pathLength={100} /> : null}
              </g>
            );
          })}
        </g>
        {NODES.map((n, i) => (
          <g
            key={i}
            className={`lab__node${i === active ? " is-active" : linked.has(i) ? " is-linked" : ""}${pinned === i ? " is-pinned" : ""}`}
            onPointerEnter={() => setHover(i)}
            onClick={() => setPinned((p) => (p === i ? null : i))}
          >
            {/* generous invisible hit area */}
            <circle cx={n.x} cy={n.y} r={22} className="lab__hit" />
            <circle cx={n.x} cy={n.y} r={i === active ? 10 : 7.5} className="lab__dot" />
          </g>
        ))}
      </svg>
    </div>
  );
}
