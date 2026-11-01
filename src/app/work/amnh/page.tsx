import type { Metadata } from "next";
import AmnhOverview from "@/components/amnh/AmnhOverview";
import { amnhOverview } from "@/content/amnh";

export const metadata: Metadata = {
  title: "American Museum of Natural History — Anya Jajodia",
  description: amnhOverview.description,
};

export default function Page() {
  return <AmnhOverview />;
}
