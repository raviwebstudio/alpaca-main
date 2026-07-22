import type { Metadata } from "next";
import { SuccessPage } from "@/components/storefront/success-page";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your ALPACA order confirmation and delivery details.",
};

export default function CheckoutSuccessRoute() {
  return <SuccessPage />;
}
