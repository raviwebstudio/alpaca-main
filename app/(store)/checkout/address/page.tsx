import type { Metadata } from "next";
import { AddressPage } from "@/components/storefront/address-page";

export const metadata: Metadata = {
  title: "Delivery Address",
  description: "Enter your delivery address for ALPACA checkout.",
};

export default function CheckoutAddressRoute() {
  return <AddressPage />;
}
