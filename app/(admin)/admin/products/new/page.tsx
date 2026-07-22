import { db } from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } });
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Add New Product</h1>
        <p className="text-[#78716C] text-sm mt-1">Create a new product listing</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
