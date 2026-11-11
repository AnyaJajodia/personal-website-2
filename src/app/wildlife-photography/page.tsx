import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import WildlifePage from "@/components/wildlife/WildlifePage";
import { wildlife } from "@/content/wildlife";

export const metadata: Metadata = pageMeta({ title: wildlife.title, description: wildlife.description, path: "/wildlife-photography" });

export default function Page() {
  return <WildlifePage />;
}
