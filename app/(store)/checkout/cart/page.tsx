import type { Metadata } from "next";
import { CartPage } from "@/components/storefront/cart-page";

export const metadata: Metadata = {
  title: "Checkout Cart",
  description: "Review your ALPACA cart before entering delivery details.",
};

export default function CheckoutCartRoute() {
  return <CartPage />;
}
