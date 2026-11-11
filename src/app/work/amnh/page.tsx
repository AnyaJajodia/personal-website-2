import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import AmnhOverview from "@/components/amnh/AmnhOverview";
import { amnhOverview } from "@/content/amnh";

export const metadata: Metadata = pageMeta({ title: "American Museum of Natural History — Anya Jajodia", description: amnhOverview.description, path: "/work/amnh" });

export default function Page() {
  return <AmnhOverview />;
}
