import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessPage } from "@/components/storefront/success-page";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your ALPACA order confirmation and delivery details.",
};

export default function CheckoutSuccessRoute() {
  return (
    <Suspense
      fallback={
        <section className="shell section-space">
          <div className="surface-card rounded-[32px] p-8 text-center">
            <p className="eyebrow">Order</p>
            <h1 className="mt-4 text-4xl text-dark sm:text-5xl">Loading confirmation...</h1>
          </div>
        </section>
      }
    >
      <SuccessPage />
    </Suspense>
  );
}
