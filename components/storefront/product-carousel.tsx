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
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth py-2 no-scrollbar [scrollbar-width:none]"
      >
        {products.map((product, index) => (
          <div
            key={`${product.id}-${product.slug}-${index}`}
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
        className="absolute -left-8 sm:-left-10 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-stone-800 shadow-md border border-stone-200/80 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll products right"
        onClick={() => scrollByAmount(1)}
        disabled={!scrollState.canScrollRight}
        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-stone-800 shadow-md border border-stone-200/80 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
