import type { Metadata } from "next";
import { ShopPageContent } from "@/components/storefront/shop-page-content";
import { normalizeProductCategory, normalizeProductSize } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse ALPACA's oversized tees, minimal basics, and outerwear with working category filters.",
};

type ShopPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    size?: string | string[];
  }>;
};

import { getProducts } from "@/lib/productStorage";

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const initialFilters = {
    category: normalizeProductCategory(params.category),
    size: normalizeProductSize(params.size),
  };

  const products = await getProducts();

  return <ShopPageContent initialFilters={initialFilters} products={products} />;
}
