import Link from "next/link";
import { getProducts, deleteProduct } from "@/lib/productStorage";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/storefront";

export default async function AdminProductsPage() {
  const products = await getProducts();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteProduct(id);
    revalidatePath("/admin/products");
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif text-[#1C1917]">Products</h2>
        <Link href="/admin/products/add" className="bg-[#1C1917] text-white px-6 py-2 rounded-full hover:bg-stone-800 transition">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    {product.images?.[0] && (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any).url) ? (
                      <img src={typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any).url} alt={product.title} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-stone-100 rounded-md"></div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-stone-900">{product.title}</td>
                  <td className="p-4 text-stone-500 capitalize">{product.category}</td>
                  <td className="p-4 text-stone-900">{formatPrice(product.price)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-blue-500 hover:underline font-medium px-2 py-1 text-sm"
                      >
                        Edit
                      </Link>
                      <form action={handleDelete} className="inline">
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="text-red-500 hover:text-red-700 font-medium px-2 py-1 text-sm">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
