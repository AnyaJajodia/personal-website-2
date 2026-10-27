/**
 * Real supplied Lynxster artwork (handoff/assets/lynxster, copied unchanged to
 * public/assets/lynxster). The PNGs are grey artwork on transparency, so they
 * are used as CSS masks and take their colour from `currentColor`.
 */

export function LynxsterLockup({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-mask logo-mask--lockup ${className}`} role="img" aria-label="Lynxster" />
  );
}

export function LynxsterMark({ className = "", label = "Lynxster logo" }: { className?: string; label?: string }) {
  return <span className={`logo-mask logo-mask--mark ${className}`} role="img" aria-label={label} />;
}
