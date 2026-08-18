import type { Metadata } from "next";
import { HomeDecorPageContent } from "@/components/storefront/home-decor-page-content";

export const metadata: Metadata = {
  title: "Home Decor",
  description:
    "Explore ALPACA Home Decor: minimal frames, wall art, and table decor designed for calm modern spaces.",
};

export default function HomeDecorPage() {
  return <HomeDecorPageContent />;
}
