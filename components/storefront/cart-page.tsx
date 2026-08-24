"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Edit2 } from "lucide-react";
import { CheckoutProgress } from "@/components/storefront/checkout-progress";
import { FadeIn } from "@/components/storefront/fade-in";
import { OrderSummaryCard } from "@/components/storefront/order-summary-card";
import { useCart, type CartItem } from "@/components/storefront/cart-provider";
import { getOptimizedImageUrl } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/storefront";
import { products } from "@/data/products";

const PRODUCT_COLOR_HEX: Record<string, string> = {
  White: "#FFFFFF",
  Black: "#111111",
  Maroon: "#800000",
  Green: "#2E5A36",
};

const DEFAULT_SIZES = ["M", "L", "XL"];
const DEFAULT_COLORS = ["White", "Black", "Green", "Maroon"];

export function CartPage() {
  const { items, subtotal, shipping, total, removeFromCart, updateQuantity, updateItem } = useCart();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editSize, setEditSize] = useState<string>("");
  const [editColor, setEditColor] = useState<string>("");

  const handleStartEdit = (item: CartItem) => {
    setEditingItemId(item.id);
    setEditSize(item.size);
    setEditColor(item.color);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditSize("");
    setEditColor("");
  };

  const handleSaveEdit = (item: CartItem) => {
    if (!editSize || !editColor) return;

    const colorHex = PRODUCT_COLOR_HEX[editColor] ?? item.colorHex;
    updateItem(item.id, {
      size: editSize,
      color: editColor,
      colorHex,
    });

    handleCancelEdit();
  };

  if (!items.length) {
    return (
      <section className="shell section-space">
        <FadeIn className="surface-card rounded-[32px] px-6 py-16 text-center sm:px-10">
          <p className="eyebrow">Your cart</p>
          <h1 className="mt-4 text-5xl text-dark sm:text-6xl">Nothing here yet.</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            Start with the pieces that move the most: heavyweight tees, refined basics, and the
            latest drops.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full border border-dark bg-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Continue shopping
          </Link>
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="shell section-space space-y-8">
      <FadeIn>
        <CheckoutProgress current="cart" />
      </FadeIn>

      <div className="grid gap-10 md:grid-cols-3">
        <FadeIn className="space-y-5 md:col-span-2">
          <div className="space-y-3">
            <p className="eyebrow">Shopping bag</p>
            <h1 className="text-balance text-4xl text-dark sm:text-5xl">Your selected wardrobe.</h1>
            <p className="max-w-2xl text-base leading-7 text-text-secondary">
              Review the pieces, adjust quantity, then continue to your address and payment steps.
            </p>
          </div>

          {items.map((item) => {
            const productData = products.find(
              (p) => p.id === item.productId || p.slug === item.slug
            );
            const availableSizes =
              productData?.sizes && productData.sizes.length > 0
                ? productData.sizes
                : DEFAULT_SIZES;
            const availableColors =
              productData?.colors && productData.colors.length > 0
                ? productData.colors
                : DEFAULT_COLORS;
            const isEditing = editingItemId === item.id;

            return (
              <article
                key={item.id}
                className="surface-card grid gap-5 rounded-[28px] p-5 sm:grid-cols-[160px_1fr] transition-all duration-200"
              >
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-surface-muted">
                  <Image
                    src={getOptimizedImageUrl(item.image)}
                    alt={item.title}
                    fill
                    sizes="160px"
                    className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-2xl text-dark transition hover:underline sm:text-3xl"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                          Sold by {item.sellerName}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Size {item.size} / {item.color}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-dark">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-sm text-text-secondary">{item.color}</span>
                    </div>
                  </div>

                  {/* Inline Edit Panel (200ms smooth expand/collapse) */}
                  {isEditing && (
                    <div className="rounded-[20px] border border-line bg-[#F8F5F2] p-4 sm:p-5 space-y-4 animate-[fade-up_0.2s_ease_both]">
                      {/* Size Selector */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                          Select Size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setEditSize(size)}
                              className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition ${
                                editSize === size
                                  ? "border-dark bg-dark text-white"
                                  : "border-line bg-white text-dark hover:-translate-y-0.5 hover:border-dark"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Selector */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                          Select Color
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setEditColor(color)}
                              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                                editColor === color
                                  ? "border-dark bg-white text-dark shadow-xs ring-1 ring-dark"
                                  : "border-line bg-white/80 text-text-secondary hover:-translate-y-0.5 hover:border-dark"
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="h-3 w-3 rounded-full border border-dark/10"
                                  style={{ backgroundColor: PRODUCT_COLOR_HEX[color] ?? "#1C1917" }}
                                  aria-hidden="true"
                                />
                                <span>{color}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item)}
                          className="inline-flex items-center justify-center rounded-xl border border-dark bg-dark px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2 text-xs font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex items-center rounded-full border border-line bg-background p-1">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.title}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-dark transition hover:bg-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold text-dark">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.title}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-dark transition hover:bg-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => (isEditing ? handleCancelEdit() : handleStartEdit(item))}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                          isEditing
                            ? "border-dark bg-dark text-white"
                            : "border-line bg-white text-dark hover:-translate-y-0.5 hover:border-dark"
                        }`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        {isEditing ? "Close" : "Edit"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition hover:text-dark"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </FadeIn>

        <FadeIn delay={0.08}>
          <OrderSummaryCard
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            note="Complimentary shipping unlocks automatically on orders above INR 4,999."
            footer={
              <Link
                href="/checkout/address"
                className="inline-flex w-full items-center justify-center rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Continue to address
              </Link>
            }
            className="h-fit md:sticky md:top-28"
          />
        </FadeIn>
      </div>
    </section>
  );
}
