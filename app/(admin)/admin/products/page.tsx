import { getContentProducts } from "@/lib/content";
import { ProductListClient } from "./ProductListClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = getContentProducts();

  return <ProductListClient initialProducts={products} />;
}
