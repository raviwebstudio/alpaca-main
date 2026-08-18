import { db } from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Edit Product</h1>
        <p className="text-[#78716C] text-sm mt-1">Update product details</p>
      </div>

      <ProductForm categories={categories} initialData={product} productId={id} mode="edit" />
    </div>
  );
}
