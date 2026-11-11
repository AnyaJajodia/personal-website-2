import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import DiodePage from "@/components/amnh/DiodePage";
import { diode } from "@/content/amnh";

export const metadata: Metadata = pageMeta({ title: "DIODE · Collections digitization — Anya Jajodia", description: diode.description, path: "/work/amnh/diode" });

export default function Page() {
  return <DiodePage />;
}
