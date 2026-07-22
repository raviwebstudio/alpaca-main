import ProductForm from "@/components/admin/ProductForm";
import { getProducts } from "@/lib/productStorage";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const products = await getProducts();
  const product = products.find((item) => String(item.id) === String(params.id));

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} productId={params.id} mode="edit" />;
}
