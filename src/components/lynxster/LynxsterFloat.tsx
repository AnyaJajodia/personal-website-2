import "./lynxster-brand.css";

/**
 * The homepage's Lynxster preview, after the "01 Floating" study: the mark
 * drifts gently above its wordmark, glowing in the theme's colour (navy in
 * light, teal in dark), with a soft shadow beneath. Decorative — the card's
 * title names Lynxster. With reduced motion it simply rests, glow included.
 */
export default function LynxsterFloat() {
  return (
    <div className="lxb lxb-float" aria-hidden="true">
      <div className="lxb-float__lock">
        <div className="lxb-float__bob">
          <span className="lxb-mark" />
        </div>
        <span className="lxb-float__shadow" />
        <span className="lxb-word">lynxster</span>
      </div>
    </div>
  );
}
