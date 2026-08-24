"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { CheckoutProgress } from "@/components/storefront/checkout-progress";
import { FadeIn } from "@/components/storefront/fade-in";
import {
  type PaymentMethod,
  useCart,
} from "@/components/storefront/cart-provider";
import { OrderSummaryCard } from "@/components/storefront/order-summary-card";
import { TurnstileWidget } from "@/components/storefront/turnstile-widget";

const PAYMENT_OPTIONS: Array<{ id: PaymentMethod; label: string; description: string }> = [
  {
    id: "upi",
    label: "UPI",
    description: "Fastest checkout for mobile-first prepaid orders.",
  },
  {
    id: "card",
    label: "Card",
    description: "Secure credit and debit card payment.",
  },
  {
    id: "netbanking",
    label: "Net banking",
    description: "Pay directly through supported Indian banks.",
  },
];

export function PaymentPage() {
  const router = useRouter();
  const {
    hydrated,
    items,
    subtotal,
    shipping,
    total,
    checkoutAddress,
    paymentMethod,
    setPaymentMethod,
    submitOrder,
  } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethod);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    setSelectedMethod(paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    if (!hydrated || isSubmitting || orderCompleted) {
      return;
    }

    if (!items.length) {
      router.replace("/cart");
      return;
    }

    if (!checkoutAddress.name || !checkoutAddress.address) {
      router.replace("/checkout/address");
    }
  }, [checkoutAddress.address, checkoutAddress.name, hydrated, isSubmitting, items.length, orderCompleted, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || orderCompleted) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setPaymentMethod(selectedMethod);

    try {
      const order = await submitOrder({
        paymentMethod: selectedMethod,
        turnstileToken,
      });

      if (order) {
        setOrderCompleted(true);
        router.push(`/checkout/success?orderId=${encodeURIComponent(order.reference)}`);
      } else {
        setErrorMessage("Unable to complete order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <section className="shell section-space">
        <FadeIn className="surface-card rounded-[32px] p-8 text-center">
          <p className="eyebrow">Payment</p>
          <h1 className="mt-4 text-4xl text-dark sm:text-5xl">Loading your order.</h1>
        </FadeIn>
      </section>
    );
  }

  if (!orderCompleted && (!items.length || !checkoutAddress.name || !checkoutAddress.address)) {
    return null;
  }

  return (
    <section className="shell section-space space-y-8">
      <FadeIn>
        <CheckoutProgress current="payment" />
      </FadeIn>

      <div className="grid gap-10 md:grid-cols-3">
        <FadeIn className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="surface-card rounded-[32px] p-6 sm:p-8"
          >
          {/* Invisible Cloudflare Turnstile bot verification */}
          <TurnstileWidget onVerify={handleTurnstileVerify} />

          <div className="space-y-3">
            <p className="eyebrow">Payment</p>
            <h1 className="text-balance text-4xl text-dark sm:text-5xl">Choose a prepaid method.</h1>
            <p className="text-base leading-7 text-text-secondary">
              Select how you want to pay for this order. Once you confirm, we will place the order and
              show your confirmation screen.
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="mt-8 rounded-[28px] border border-line bg-[#F8F5F2] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Shipping to
            </p>
            <p className="mt-3 text-lg font-semibold text-dark">{checkoutAddress.name}</p>
            {checkoutAddress.email && (
              <p className="mt-1 text-sm leading-6 text-text-secondary">{checkoutAddress.email}</p>
            )}
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {checkoutAddress.address}, {checkoutAddress.city}, {checkoutAddress.state} -{" "}
              {checkoutAddress.pincode}
            </p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{checkoutAddress.phone}</p>
          </div>

          <fieldset className="mt-8 space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Payment options
            </legend>
            {PAYMENT_OPTIONS.map((option) => {
              const active = selectedMethod === option.id;

              return (
                <label
                  key={option.id}
                  className={clsx(
                    "flex cursor-pointer items-start gap-4 rounded-[24px] border p-5 transition",
                    active
                      ? "border-dark bg-white shadow-soft"
                      : "border-line bg-background hover:border-dark/40",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={active}
                    disabled={isSubmitting}
                    onChange={() => setSelectedMethod(option.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-lg font-semibold text-dark">{option.label}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95",
                isSubmitting && "cursor-not-allowed opacity-75 hover:translate-y-0"
              )}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing order...
                </>
              ) : (
                "Place order and pay"
              )}
            </button>
            <Link
              href="/checkout/address"
              className={clsx(
                "inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark",
                isSubmitting && "pointer-events-none opacity-50"
              )}
            >
              Edit address
            </Link>
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            Cash on delivery is not available for this flow.
          </p>
          </form>
        </FadeIn>

        <FadeIn delay={0.08}>
          <OrderSummaryCard
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            note="Secure prepaid checkout. You will receive order confirmation immediately after payment."
          />
        </FadeIn>
      </div>
    </section>
  );
}
