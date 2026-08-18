"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CheckoutProgress } from "@/components/storefront/checkout-progress";
import { FadeIn } from "@/components/storefront/fade-in";
import { OrderSummaryCard } from "@/components/storefront/order-summary-card";
import { useCart } from "@/components/storefront/cart-provider";
import { formatPrice } from "@/lib/storefront";

export function CartPage() {
  const { items, subtotal, shipping, total, removeFromCart, updateQuantity } = useCart();

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

          {items.map((item) => (
            <article
              key={item.id}
              className="surface-card grid gap-5 rounded-[28px] p-5 sm:grid-cols-[160px_1fr]"
            >
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-surface-muted">
                <Image
                  src={item.image}
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

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-dark"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
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
