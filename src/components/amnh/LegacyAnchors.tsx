"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AMNH_LEGACY_ANCHORS } from "@/content/amnh";

/**
 * The AMNH page used to hold both projects as sections
 * (/work/amnh#collections-digitization, #mantis-research). A link to one of
 * those anchors now opens the project's own page instead; any other hash is
 * left alone. Replaces the history entry, so Back doesn't bounce.
 */
export default function LegacyAnchors() {
  const router = useRouter();
  useEffect(() => {
    const go = () => {
      const to = AMNH_LEGACY_ANCHORS[window.location.hash.slice(1)];
      if (to) router.replace(to);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [router]);
  return null;
}
