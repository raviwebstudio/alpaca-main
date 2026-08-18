"use client";

import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/storefront/section-heading";
import { FadeIn } from "@/components/storefront/fade-in";
import type { Product } from "@/data/products";

type ShopPageContentProps = {
  products: Product[];
  initialFilters?: any;
};

export function ShopPageContent({ products }: ShopPageContentProps) {
  const displayProducts = products.filter((product) => product.type === "fashion");

  return (
    <section className="shell section-space">
      <div className="space-y-12">
        <FadeIn>
          <SectionHeading
            eyebrow="Shop"
            title="Find the right product before you commit."
            description="Explore our curated collection of minimal, premium essentials built for movement and everyday rotation."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="w-full min-w-0">
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {displayProducts.map((product, index) => (
              <FadeIn key={product.id} delay={0.02 * index} className="h-full">
                <ProductCard product={product} className="h-full" />
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
