"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/storefront/section-heading";
import { FadeIn } from "@/components/storefront/fade-in";
import {
  categoryDescriptions,
  filterProducts,
  getCategoryLabel,
  productCategoryOptions,
  productSizes,
  type ProductCategory,
  type Product,
} from "@/data/products";

type Filters = {
  category: ProductCategory | "all";
  size: string;
};

type ShopPageContentProps = {
  initialFilters: Filters;
  products: Product[];
};

export function ShopPageContent({ initialFilters, products }: ShopPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const sizes = ["all", ...productSizes];

  const updateFilters = (nextFilters: Filters) => {
    setFilters(nextFilters);

    startTransition(() => {
      const params = new URLSearchParams();

      if (nextFilters.category !== "all") {
        params.set("category", nextFilters.category);
      }

      if (nextFilters.size !== "all") {
        params.set("size", nextFilters.size);
      }

      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    });
  };

  const fashionProducts = products.filter((product) => product.type === "fashion");
  const filteredProducts = filterProducts(products, filters);
  const categoryScopedCount = (category: ProductCategory | "all") =>
    filterProducts(products, {
      category,
      size: filters.size,
    }).length;
  const sizeScopedCount = (size: string) =>
    filterProducts(products, {
      category: filters.category,
      size,
    }).length;

  return (
    <section className="shell section-space">
      <div className="space-y-10">
        <FadeIn>
          <SectionHeading
            eyebrow="Shop"
            title="Find the right product before you commit."
            description="Use the filters on the left to narrow by category and size. Then open a product card to choose color, add it to cart, and continue to checkout."
          />
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FadeIn delay={0.1}>
            <aside className="surface-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28">
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="eyebrow">Filters</p>
                  <h2 className="text-3xl text-dark">Narrow the catalog</h2>
                  {/* <p className="text-sm leading-6 text-text-secondary">
                    Start with a category, then pick the size you want to buy.
                    </p> */}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">
                    Category
                  </p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => updateFilters({ ...filters, category: "all" })}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        filters.category === "all"
                          ? "border-dark bg-dark text-white"
                          : "border-line bg-white hover:-translate-y-0.5 hover:border-dark"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">All products</span>
                        <span className="text-sm">{categoryScopedCount("all")}</span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          filters.category === "all" ? "text-white/80" : "text-text-secondary"
                        }`}
                      >
                        Browse the full catalog
                      </p>
                    </button>

                    {productCategoryOptions.map((category) => {
                      const active = filters.category === category.value;

                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => updateFilters({ ...filters, category: category.value })}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-dark bg-dark text-white"
                              : "border-line bg-white hover:-translate-y-0.5 hover:border-dark"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">{category.label}</span>
                            <span className="text-sm">{categoryScopedCount(category.value)}</span>
                          </div>
                          <p className={`mt-1 text-sm ${active ? "text-white/80" : "text-text-secondary"}`}>
                            {category.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const active = filters.size === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateFilters({ ...filters, size })}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                            active
                              ? "border-dark bg-dark text-white"
                              : "border-line bg-white text-dark hover:-translate-y-0.5 hover:border-dark"
                          }`}
                        >
                          <span>{size === "all" ? "All sizes" : size}</span>
                          <span className={active ? "text-white/80" : "text-text-secondary"}>
                            {sizeScopedCount(size)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateFilters({ category: "all", size: "all" })}
                  className="inline-flex items-center justify-center rounded-full border border-dark bg-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Reset filters
                </button>
              </div>
            </aside>
          </FadeIn>

          <FadeIn delay={0.15} className="min-w-0">
            <div className="min-w-0 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary">
                    Showing <span className="font-semibold text-dark">{filteredProducts.length}</span> of{" "}
                    <span className="font-semibold text-dark">{fashionProducts.length}</span> products
                  </p>
                  <p className="text-sm text-text-secondary">
                    {filters.category === "all"
                      ? "All categories selected."
                      : `${getCategoryLabel(filters.category)} selected. ${categoryDescriptions[filters.category]}`}
                  </p>
                </div>
                <p className="text-sm text-text-secondary">
                  {isPending ? "Updating filters..." : "Next step: open any product to choose size and color."}
                </p>
              </div>

              {(filters.category !== "all" || filters.size !== "all") && (
                <div className="flex flex-wrap gap-2">
                  {filters.category !== "all" ? (
                    <button
                      type="button"
                      onClick={() => updateFilters({ ...filters, category: "all" })}
                      className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
                    >
                      Category: {getCategoryLabel(filters.category)} x
                    </button>
                  ) : null}
                  {filters.size !== "all" ? (
                    <button
                      type="button"
                      onClick={() => updateFilters({ ...filters, size: "all" })}
                      className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
                    >
                      Size: {filters.size} x
                    </button>
                  ) : null}
                </div>
              )}

              {filteredProducts.length ? (
                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <FadeIn key={product.id} delay={0.02 * index}>
                      <ProductCard product={product} />
                    </FadeIn>
                  ))}
                </div>
              ) : (
                <div className="surface-card rounded-[32px] px-6 py-16 text-center sm:px-10">
                  <h2 className="text-4xl text-dark sm:text-5xl">No products match those filters.</h2>
                  <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                    Try broadening the category or size filter to get back to an available product.
                  </p>
                  <button
                    type="button"
                    onClick={() => updateFilters({ category: "all", size: "all" })}
                    className="mt-8 inline-flex rounded-full border border-dark bg-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Reset shop view
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
