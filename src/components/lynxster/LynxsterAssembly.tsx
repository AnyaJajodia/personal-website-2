import "./lynxster-brand.css";

/**
 * The Lynxster page's main visual, after the "09B Package assembly" study:
 * three abstract records — skeleton lines only, no text, data or interface —
 * drawn together and sealed with the Lynxster mark. It illustrates the
 * approved idea (independently verifiable digital records) and nothing more.
 * The sealed composition is its resting state. AssemblyPlayer starts with the
 * records laid out and unsealed, gathers and seals them once as the page loads
 * (under two seconds), and replays the seal's ripples on hover.
 */
function Sheet({ side }: { side: "l" | "r" | "c" }) {
  return (
    <div className={`lxb-sheet lxb-sheet--${side}`}>
      <i />
      <i />
      <i />
      <i />
      <i />
      {side === "c" ? <i className="lxb-block" /> : null}
    </div>
  );
}

export default function LynxsterAssembly() {
  return (
    <div className="lxb lxb-assembly" role="img" aria-label="Illustration: three abstract records drawn together under the Lynxster seal">
      <div className="lxb-stack" aria-hidden="true">
        <Sheet side="l" />
        <Sheet side="r" />
        <Sheet side="c" />
        <div className="lxb-seal">
          <span className="lxb-seal__disc" />
          <span className="lxb-seal__ring" />
          <span className="lxb-seal__ring" />
          <span className="lxb-seal__glow">
            <span className="lxb-mark" />
          </span>
        </div>
      </div>
    </div>
  );
}
