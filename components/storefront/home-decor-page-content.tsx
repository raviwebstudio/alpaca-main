"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { FadeIn } from "@/components/storefront/fade-in";
import { InteractiveSiteImage } from "@/components/storefront/interactive-site-image";
import {
  decorCategoryOptions,
  getBestSellerProducts,
  getNewDropProducts,
  products,
  type Product,
  type ProductCategory,
} from "@/data/products";
import { SITE_IMAGES } from "@/lib/siteImages";

type DecorFilters = {
  category: ProductCategory | "all";
  material: string;
  style: string;
  maxPrice: number;
};

const MATERIALS = ["all", "Wood", "Metal", "Glass", "Plastics", "Ceramic"];
const STYLES = ["all", "Minimal", "Modern"];

export function HomeDecorPageContent({ products: dynamicProducts }: { products?: Product[] }) {
  const allProductsList = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : products;
  const decorProducts = allProductsList.filter((product) => product.type === "decor");
  const maxCatalogPrice = Math.max(...decorProducts.map((product) => product.price), 1000);
  const [filters, setFilters] = useState<DecorFilters>({
    category: "all",
    material: "all",
    style: "all",
    maxPrice: maxCatalogPrice,
  });

  const filteredProducts = useMemo(
    () =>
      decorProducts.filter(
        (product) =>
          (filters.category === "all" || product.category === filters.category) &&
          (filters.material === "all" || product.material === filters.material) &&
          (filters.style === "all" || product.style === filters.style) &&
          product.price <= filters.maxPrice,
      ),
    [decorProducts, filters],
  );
  const bestInDecor = getBestSellerProducts(6, "decor", allProductsList);
  const recentlyAdded = getNewDropProducts(6, "decor", allProductsList);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[600px] overflow-hidden">
        <InteractiveSiteImage
          src={SITE_IMAGES.homeDecor.heroBanner}
          alt="ALPACA home decor"
          priority
          sizes="100vw"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 pointer-events-none" />
        <div className="relative z-[1] mx-auto flex min-h-[560px] max-w-7xl items-center px-6">
          <FadeIn className="max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
              HOME DECOR
            </p>
            <h1 className="mt-5 text-balance text-5xl leading-[0.96] text-white sm:text-7xl">
              Spaces that move with you
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
              Objects designed to bring calm, structure, and movement into your everyday space.
            </p>
            <Link
              href="#decor-products"
              className="mt-8 inline-flex rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:-translate-y-0.5"
            >
              Explore Collection
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <FadeIn>
          <p className="eyebrow">ALPACA Home Decor</p>
          <h2 className="mt-4 text-balance text-5xl text-dark sm:text-6xl">
            Designed for stillness.
          </h2>
        </FadeIn>
        <FadeIn delay={0.06}>
          <p className="max-w-2xl text-lg leading-9 text-text-secondary">
            ALPACA home pieces follow the same philosophy — minimal, functional, and timeless.
            Each object is designed to make the next step obvious: browse, choose, add to cart,
            and move through checkout with confidence.
          </p>
        </FadeIn>
      </section>

      <section id="decor-products" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FadeIn>
            <aside className="surface-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28">
              <div className="space-y-7">
                <div>
                  <p className="eyebrow">Filters</p>
                  <h2 className="mt-3 text-3xl text-dark">Find the right object.</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Decor filters focus on room use, material, style, and price.
                  </p>
                </div>

                <FilterGroup title="Category">
                  <FilterButton
                    active={filters.category === "all"}
                    onClick={() => setFilters((current) => ({ ...current, category: "all" }))}
                  >
                    All Decor
                  </FilterButton>
                  {decorCategoryOptions.map((category) => (
                    <FilterButton
                      key={category.value}
                      active={filters.category === category.value}
                      onClick={() =>
                        setFilters((current) => ({ ...current, category: category.value }))
                      }
                    >
                      {category.label}
                    </FilterButton>
                  ))}
                </FilterGroup>

                <FilterGroup title="Material">
                  {MATERIALS.map((material) => (
                    <FilterButton
                      key={material}
                      active={filters.material === material}
                      onClick={() => setFilters((current) => ({ ...current, material }))}
                    >
                      {material === "all" ? "All Materials" : material}
                    </FilterButton>
                  ))}
                </FilterGroup>

                <FilterGroup title="Style">
                  {STYLES.map((style) => (
                    <FilterButton
                      key={style}
                      active={filters.style === style}
                      onClick={() => setFilters((current) => ({ ...current, style }))}
                    >
                      {style === "all" ? "All Styles" : style}
                    </FilterButton>
                  ))}
                </FilterGroup>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p
                      id="price-filter-label"
                      className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary"
                    >
                      Price
                    </p>
                    <span className="text-sm font-semibold text-dark">
                      ₹{filters.maxPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={maxCatalogPrice}
                    step={100}
                    value={filters.maxPrice}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        maxPrice: Number(event.target.value),
                      }))
                    }
                    aria-labelledby="price-filter-label"
                    title="Maximum price"
                    className="w-full accent-[#1C1917]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      category: "all",
                      material: "all",
                      style: "all",
                      maxPrice: maxCatalogPrice,
                    })
                  }
                  className="w-full rounded-full border border-dark bg-dark px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Reset filters
                </button>
              </div>
            </aside>
          </FadeIn>

          <FadeIn delay={0.08} className="min-w-0">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Collection</p>
                <h2 className="mt-3 text-4xl text-dark sm:text-5xl">Home Decor</h2>
              </div>
              <p className="text-sm text-text-secondary">
                Showing <span className="font-semibold text-dark">{filteredProducts.length}</span>{" "}
                of <span className="font-semibold text-dark">{decorProducts.length}</span> pieces
              </p>
            </div>

            {filteredProducts.length ? (
              <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <FadeIn key={product.id} delay={0.02 * index}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="surface-card rounded-[32px] px-6 py-16 text-center">
                <h3 className="text-4xl text-dark">No decor pieces match those filters.</h3>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary">
                  Reset filters to return to the full Home Decor collection.
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      <HorizontalProductSection title="Best in Decor" products={bestInDecor} />
      <HorizontalProductSection title="Recently Added" products={recentlyAdded} />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {["Hand-finished materials", "Designed for modern spaces", "Built to last"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -3 }}
              className="surface-card rounded-[28px] p-6 text-center"
            >
              <p className="text-xl font-semibold text-dark">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-dark bg-dark text-white"
          : "border-line bg-white text-dark hover:-translate-y-0.5 hover:border-dark"
      }`}
    >
      {children}
    </button>
  );
}

function HorizontalProductSection({ title, products }: { title: string; products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <p className="eyebrow">ALPACA Decor</p>
        <h2 className="mt-3 text-4xl text-dark sm:text-5xl">{title}</h2>
      </div>
      <div className="min-w-0 overflow-hidden">
        <div className="flex snap-x gap-5 overflow-x-auto pb-4">
          {products.map((product) => (
            <div key={product.id} className="w-[280px] flex-none snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
