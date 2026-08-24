"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCategoryLabel, type Product } from "@/data/products";
import { useCart } from "@/components/storefront/cart-provider";
import { formatPrice } from "@/lib/storefront";

export const PRODUCT_COLOR_HEX: Record<string, string> = {
  White: "#FFFFFF",
  Black: "#111111",
  Maroon: "#800000",
  Green: "#2E5A36",
};

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const isFashion = product.type === "fashion";
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "One Size");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? product.material ?? "Natural");

  const handleBuyNow = () => {
    if (isFashion && (!selectedSize || !selectedColor)) return;

    addToCart({
      productId: product.id,
      sellerId: "alpaca-studio",
      sellerName: "ALPACA Studio",
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: isFashion ? selectedSize : "One Size",
      color: isFashion ? selectedColor : product.material ?? "Decor",
      colorHex: PRODUCT_COLOR_HEX[selectedColor] ?? "#1C1917",
    });

    router.push("/cart");
  };

  return (
    <div className="surface-card space-y-8 rounded-[32px] p-6 sm:p-8">
      <div className="space-y-4">
        <p className="eyebrow">{getCategoryLabel(product.category)}</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-dark sm:text-4xl">
            {product.title}
          </h1>
          <p className="max-w-xl text-base leading-7 text-text-secondary">
            {product.summary?.trim() || product.description?.trim()}
          </p>
        </div>
        <p className="text-3xl font-semibold text-dark">{formatPrice(product.price)}</p>
      </div>

      <div className="space-y-6">
        {isFashion ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-dark">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${selectedSize === size
                      ? "border-dark bg-dark text-white"
                      : "border-line bg-white text-dark hover:-translate-y-0.5 hover:border-dark"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-line bg-background/80 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-text-secondary">
              Material
            </p>
            <p className="mt-2 text-lg font-semibold text-dark">{product.material}</p>
          </div>
        )}

        {isFashion ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-dark">Color</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${selectedColor === color
                      ? "border-dark bg-white text-dark"
                      : "border-line bg-white/70 text-text-secondary hover:-translate-y-0.5 hover:border-dark"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-dark/10"
                      style={{ backgroundColor: PRODUCT_COLOR_HEX[color] ?? "#1C1917" }}
                      aria-hidden="true"
                    />
                    <span>{color}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={handleBuyNow}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95"
        >
          Buy Now
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-sm text-text-secondary">
          Next step: review your cart, then enter address and payment details.
        </p>
      </div>

      <div className="grid gap-4 border-t border-line pt-6 text-sm text-text-secondary sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-[0.24em] text-dark">
            {isFashion ? "Fit" : "Style"}
          </p>
          <p className="mt-2 leading-6">
            {isFashion ? "Built for movement with a calm premium silhouette." : product.style ?? "Minimal"}
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.24em] text-dark">Material</p>
          <p className="mt-2 leading-6">{product.material}</p>
        </div>
      </div>
    </div>
  );
}
