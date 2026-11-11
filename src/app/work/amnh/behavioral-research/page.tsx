import type { Metadata } from "next";
import BehavioralPage from "@/components/amnh/BehavioralPage";
import { behavioral } from "@/content/amnh";

export const metadata: Metadata = {
  title: "Chaeteessa · Behavioral research · AMNH — Anya Jajodia",
  description: behavioral.description,
};

export default function Page() {
  return <BehavioralPage />;
}
