import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import BehavioralPage from "@/components/amnh/BehavioralPage";
import { behavioral } from "@/content/amnh";

export const metadata: Metadata = pageMeta({ title: "Chaeteessa · Behavioral research · AMNH — Anya Jajodia", description: behavioral.description, path: "/work/amnh/behavioral-research" });

export default function Page() {
  return <BehavioralPage />;
}
