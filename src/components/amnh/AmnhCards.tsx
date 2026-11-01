import "./amnh-cards.css";

/**
 * The homepage's AMNH preview, after the two-colour cards study
 * (references/amnh/home-preview/): a collection card — a specimen packet
 * with its label lines and identifier square — overlapped by a research
 * notebook page with an abstract sketch (a trace and a tally, no animal:
 * conceptual artwork, not a record). On hover, or when the card's title or
 * button has keyboard focus, the two ease apart and a thread is drawn
 * between them; on touch and with reduced motion the thread rests drawn.
 *
 * Its colours are the AMNH tokens: blue leads by day with green secondary,
 * green leads at night with the blue quieter (amnh-cards.css). Decorative —
 * the card's title names AMNH.
 */
export default function AmnhCards() {
  return (
    <div className="amc" aria-hidden="true">
      <div className="amc__lock">
        <svg className="amc__art" viewBox="240 140 480 290" focusable="false">
          <defs>
            {/* a crisp line with a soft halo of its own colour (night only) */}
            <filter id="amc-halo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
              <feComponentTransfer in="b" result="h">
                <feFuncA type="linear" slope="0.42" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="h" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* the paper's contact shadow */}
            <filter id="amc-lift" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow className="amc__lift" dx="0" dy="4" stdDeviation="7" />
            </filter>
            <filter id="amc-floor" filterUnits="userSpaceOnUse" x="240" y="360" width="480" height="70">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>

          <ellipse className="amc__floor" cx="480" cy="404" rx="176" ry="7" filter="url(#amc-floor)" />

          {/* the thread runs behind both cards and out past either side */}
          <path className="amc__thread" pathLength={1} d="M206 330C286 262 392 340 474 300C552 262 636 338 752 274" />

          <g className="amc__card amc__card--a">
            <g transform="rotate(-6 400 270)">
              <rect className="amc__paper" x="300" y="170" width="210" height="200" filter="url(#amc-lift)" />
              <g className="amc__ink">
                <path d="M300 170h210v200h-210z" />
                <path d="M300 170l105 64l105 -64" />
                <path className="amc__fine" d="M316 280h94.5M316 294h126M316 308h73.5" />
                <path d="M470 326h26v26h-26z" />
              </g>
            </g>
          </g>

          <g className="amc__card amc__card--b">
            <g transform="rotate(5 560 280)">
              <path className="amc__paper" d="M460 182h202v196h-202a8 8 0 0 1 -8 -8v-180a8 8 0 0 1 8 -8z" filter="url(#amc-lift)" />
              <g className="amc__ink">
                <path d="M460 182h202v196h-202a8 8 0 0 1 -8 -8v-180a8 8 0 0 1 8 -8z" />
                <path className="amc__fine" d="M644 182v196" />
                <path className="amc__rule" d="M474 212h166M474 230h166M474 248h166M474 266h166M474 284h166M474 302h166M474 320h166" />
                {/* an abstract sketch: a trace with three marked points, and a tally */}
                <path className="amc__fine" d="M480 300C498 298 506 266 526 268S556 302 580 290S612 248 632 254" />
                <circle cx="526" cy="268" r="3.4" />
                <circle cx="580" cy="290" r="3.4" />
                <circle cx="632" cy="254" r="3.4" />
                <path className="amc__fine" d="M482 340v16M490 340v16M498 340v16M506 340v16M477 354l34 -12" />
              </g>
            </g>
          </g>
        </svg>
        <span className="amc__caption">collections · research</span>
      </div>
    </div>
  );
}
