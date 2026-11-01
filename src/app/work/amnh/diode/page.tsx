import type { Metadata } from "next";
import DiodePage from "@/components/amnh/DiodePage";
import { diode } from "@/content/amnh";

export const metadata: Metadata = {
  title: "DIODE · Collections digitization — Anya Jajodia",
  description: diode.description,
};

export default function Page() {
  return <DiodePage />;
}
