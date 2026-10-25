"use client";

import { useRef, useState } from "react";

/**
 * A separate control beside the email link: copies the address, says so, and
 * draws a small check. The link itself still opens mail as before.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // older browsers / no permission: copy through a hidden field
      const t = document.createElement("textarea");
      t.value = email;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <button type="button" className="copy-email" data-copied={copied || undefined} onClick={copy}>
        <span className="copy-email__label">{copied ? "Copied" : "Copy email"}</span>
        <svg className="copy-email__check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 13c2 1.6 3.6 3.4 5 5.6C12 12 15.6 8 20.5 5" pathLength={1} />
        </svg>
      </button>
      <span className="visually-hidden" role="status">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
