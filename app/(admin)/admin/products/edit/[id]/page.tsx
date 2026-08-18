import { notFound } from "next/navigation";
import { getContentProductBySlug, getContentProductById } from "@/lib/content";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const product = getContentProductBySlug(decoded) || getContentProductById(decoded);

  if (!product) {
    notFound();
  }

  return <ProductEditorForm initialData={product} isEditing={true} />;
}
