"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/storefront/cart-provider";
import { formatPrice } from "@/lib/storefront";

export function CheckoutForm() {
  const { items, subtotal, submitOrder } = useCart();
  const [complete, setComplete] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "card" as "card" | "upi",
  });
  const shipping = subtotal >= 4999 ? 0 : items.length ? 249 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const order = await submitOrder({
      address: {
        name: fullName,
        email: formData.email.trim(),
        phone: "",
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },
      paymentMethod: formData.paymentMethod,
    });

    setIsSubmitting(false);
    if (order) {
      setOrderReference(order.reference);
      setComplete(true);
    }
  };

  if (!items.length && !complete) {
    return (
      <section className="shell section-space">
        <div className="surface-card rounded-[32px] px-6 py-16 text-center sm:px-10">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-4 text-5xl text-dark sm:text-6xl">Your bag is empty.</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            Add a few pieces to continue to checkout.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full border border-dark bg-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Shop now
          </Link>
        </div>
      </section>
    );
  }

  if (complete) {
    return (
      <section className="shell section-space">
        <div className="surface-card rounded-[32px] px-6 py-16 text-center sm:px-10">
          <p className="eyebrow">Order confirmed</p>
          <h1 className="mt-4 text-5xl text-dark sm:text-6xl">You are all set.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            Your ALPACA order has been placed successfully. A confirmation email and tracking
            details will follow shortly.
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-text-secondary">
            Order reference · {orderReference}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex rounded-full border border-dark bg-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Continue shopping
            </Link>
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
            >
              Read the journal
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="shell section-space grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        className="surface-card grid gap-5 rounded-[32px] p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-3">
          <p className="eyebrow">Checkout</p>
          <h1 className="text-balance text-5xl text-dark sm:text-6xl">Complete your order.</h1>
          <p className="max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            Prepaid checkout only. Card and UPI are available. Cash on delivery is not offered.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-dark">First name</span>
            <input
              required
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-dark">Last name</span>
            <input
              required
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-dark">Email</span>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-dark">Address</span>
          <input
            required
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="grid gap-2 sm:col-span-1">
            <span className="text-sm font-semibold text-dark">City</span>
            <input
              required
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            />
          </label>
          <label className="grid gap-2 sm:col-span-1">
            <span className="text-sm font-semibold text-dark">State</span>
            <input
              required
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            />
          </label>
          <label className="grid gap-2 sm:col-span-1">
            <span className="text-sm font-semibold text-dark">PIN code</span>
            <input
              required
              value={formData.pincode}
              onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value }))}
              className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            />
          </label>
        </div>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold text-dark">Payment method</legend>
          <label className="flex items-center gap-3 rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={() => setFormData((prev) => ({ ...prev, paymentMethod: "card" }))}
            />
            Credit or debit card
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={formData.paymentMethod === "upi"}
              onChange={() => setFormData((prev) => ({ ...prev, paymentMethod: "upi" }))}
            />
            UPI
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          {isSubmitting ? "Processing..." : "Place prepaid order"}
        </button>
      </form>

      <aside className="surface-card h-fit rounded-[32px] p-6 sm:p-8 lg:sticky lg:top-28">
        <p className="eyebrow">Summary</p>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-dark">{item.title}</p>
                <p className="text-text-secondary">
                  {item.color} · {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-dark">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm text-text-secondary">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-dark">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-dark">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-base font-semibold text-dark">Total</span>
            <span className="text-base font-semibold text-dark">{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
