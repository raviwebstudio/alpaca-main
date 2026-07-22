import type { Metadata } from "next";
import { CartPage } from "@/components/storefront/cart-page";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your ALPACA cart and continue to secure prepaid checkout.",
};

export default function CartRoute() {
  return <CartPage />;
}
