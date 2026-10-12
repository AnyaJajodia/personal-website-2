/**
 * Decorative line illustrations drawn for this site (not photographs, not
 * official marks). Always aria-hidden.
 */

export function DragonflyMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 200" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path d="M120 38c3 0 5 4 5 9s-2 8-5 8-5-3-5-8 2-9 5-9z" />
        <path d="M120 55c3 0 4 6 4 14s-1 14-4 14-4-6-4-14 1-14 4-14z" />
        <path d="M120 83 C121 110 121 140 120 178 M120 83 C119 110 119 140 120 178" />
        {/* forewings */}
        <path d="M124 62 C150 50 196 46 224 52 C228 58 214 66 190 70 C166 73 140 70 124 66" />
        <path d="M116 62 C90 50 44 46 16 52 C12 58 26 66 50 70 C74 73 100 70 116 66" />
        {/* hindwings */}
        <path d="M124 72 C146 74 186 82 208 94 C210 101 194 102 172 96 C152 90 134 82 124 76" />
        <path d="M116 72 C94 74 54 82 32 94 C30 101 46 102 68 96 C88 90 106 82 116 76" />
        {/* a few veins */}
        <path d="M128 64 C160 60 190 58 218 56 M128 74 C150 80 180 88 202 96 M112 64 C80 60 50 58 22 56 M112 74 C90 80 60 88 38 96" opacity="0.55" />
      </g>
    </svg>
  );
}
