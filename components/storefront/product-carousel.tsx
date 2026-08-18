"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const productCount = products?.length ?? 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: productCount > 0,
  });

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;

      setScrollState({
        canScrollLeft: element.scrollLeft > 8,
        canScrollRight: element.scrollLeft < maxScrollLeft - 8,
      });
    };

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [productCount]);

  const scrollByAmount = (direction: number) => {
    scrollRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar [scrollbar-width:none]"
      >
        {products.map((product, index) => (
  <div
    key={`${product.id}-${product.slug}-${index}`} // 🔥 bulletproof
    className="flex-shrink-0 w-[280px] md:w-[280px]"
  >
    <ProductCard product={product} className="h-full" />
  </div>
))}
      </div>

      <button
        type="button"
        aria-label="Scroll products left"
        onClick={() => scrollByAmount(-1)}
        disabled={!scrollState.canScrollLeft}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow md:inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll products right"
        onClick={() => scrollByAmount(1)}
        disabled={!scrollState.canScrollRight}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow md:inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
