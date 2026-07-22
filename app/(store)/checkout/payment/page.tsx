import type { Metadata } from "next";
import { PaymentPage } from "@/components/storefront/payment-page";

export const metadata: Metadata = {
  title: "Payment",
  description: "Choose your payment method for ALPACA checkout.",
};

export default function CheckoutPaymentRoute() {
  return <PaymentPage />;
}
