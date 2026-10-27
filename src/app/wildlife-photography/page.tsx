import type { Metadata } from "next";
import WildlifePage from "@/components/wildlife/WildlifePage";
import { wildlife } from "@/content/wildlife";

export const metadata: Metadata = { title: wildlife.title, description: wildlife.description };

export default function Page() {
  return <WildlifePage />;
}
