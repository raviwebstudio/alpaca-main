import type { Metadata } from "next";
import { LegalDocument } from "@/components/storefront/legal-document";
import { legalDocuments } from "@/lib/storefront";

const document = legalDocuments.find((item) => item.slug === "shipping-policy")!;

export const metadata: Metadata = {
  title: document.title,
  description: document.description,
};

export default function ShippingPolicyPage() {
  return <LegalDocument document={document} />;
}
