"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress } from "@/components/storefront/checkout-progress";
import { FadeIn } from "@/components/storefront/fade-in";
import {
  type CheckoutAddress,
  useCart,
} from "@/components/storefront/cart-provider";
import { OrderSummaryCard } from "@/components/storefront/order-summary-card";

const normalizePhone = (value: string) => {
  const cleaned = (value || "").replace(/\D/g, "");

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned.slice(2);
  }

  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return cleaned.slice(1);
  }

  return cleaned;
};

const isValidIndianPhone = (value: string) => {
  const phone = normalizePhone(value);
  return /^[6-9]\d{9}$/.test(phone);
};

export function AddressPage() {
  const router = useRouter();
  const {
    hydrated,
    items,
    subtotal,
    shipping,
    total,
    checkoutAddress,
    saveCheckoutAddress,
  } = useCart();
  const [formState, setFormState] = useState<CheckoutAddress>(checkoutAddress);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormState(checkoutAddress);
  }, [checkoutAddress]);

  useEffect(() => {
    if (hydrated && !items.length) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  const handleChange =
    (field: keyof CheckoutAddress) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setErrorMessage(null);
      setFormState((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidIndianPhone(formState.phone)) {
      setErrorMessage("Please enter a valid Indian mobile number.");
      return;
    }

    setErrorMessage(null);
    const cleanPhone = normalizePhone(formState.phone);

    saveCheckoutAddress({
      name: formState.name.trim(),
      email: formState.email ? formState.email.trim() : "",
      phone: cleanPhone,
      address: formState.address.trim(),
      city: formState.city.trim(),
      state: formState.state.trim(),
      pincode: formState.pincode.trim(),
    });
    router.push("/checkout/payment");
  };

  if (!hydrated) {
    return (
      <section className="shell section-space">
        <FadeIn className="surface-card rounded-[32px] p-8 text-center">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-4 text-4xl text-dark sm:text-5xl">Preparing your checkout.</h1>
        </FadeIn>
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="shell section-space space-y-8">
      <FadeIn>
        <CheckoutProgress current="address" />
      </FadeIn>

      <div className="grid gap-10 md:grid-cols-3">
        <FadeIn className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="surface-card rounded-[32px] p-6 sm:p-8"
          >
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">Delivery Address</p>
            <h1 className="text-balance text-4xl text-dark sm:text-5xl">Where should we send it?</h1>
            <p className="text-base leading-7 text-text-secondary">
              Enter the shipping details for this order. After this step, you will choose your payment
              method.
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-dark">Name</span>
              <input
                required
                value={formState.name}
                onChange={handleChange("name")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="Full name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-dark">Email</span>
              <input
                type="email"
                required
                value={formState.email || ""}
                onChange={handleChange("email")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="name@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-dark">Phone</span>
              <input
                required
                type="tel"
                value={formState.phone}
                onChange={handleChange("phone")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="10-digit mobile number"
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-dark">Pincode</span>
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={formState.pincode}
                onChange={handleChange("pincode")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="6-digit pincode"
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-dark">Address</span>
              <textarea
                required
                rows={4}
                value={formState.address}
                onChange={handleChange("address")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="House number, street, landmark"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-dark">City</span>
              <input
                required
                value={formState.city}
                onChange={handleChange("city")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="City"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-dark">State</span>
              <input
                required
                value={formState.state}
                onChange={handleChange("state")}
                className="rounded-2xl border border-line bg-background px-4 py-3.5 text-sm text-dark outline-none transition focus:border-dark"
                placeholder="State"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Save address and continue
            </button>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
            >
              Back to cart
            </Link>
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            Next step: choose UPI, card, or net banking on the payment screen.
          </p>
          </form>
        </FadeIn>

        <FadeIn delay={0.08}>
          <OrderSummaryCard
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            note="Orders usually reach metro cities in 2-4 days after dispatch."
          />
        </FadeIn>
      </div>
    </section>
  );
}
