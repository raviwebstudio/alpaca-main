import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ENABLE_HOME_DECOR } from "@/data/products";
import { HomeDecorPageContent } from "@/components/storefront/home-decor-page-content";

export const metadata: Metadata = {
  title: "Home Decor",
  description:
    "Explore ALPACA Home Decor: minimal frames, wall art, and table decor designed for calm modern spaces.",
};

export default function HomeDecorPage() {
  if (!ENABLE_HOME_DECOR) {
    redirect("/shop");
  }
  return <HomeDecorPageContent />;
}
