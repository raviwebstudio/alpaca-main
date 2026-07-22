import type { Metadata } from "next";
import { LegalDocument } from "@/components/storefront/legal-document";
import { legalDocuments } from "@/lib/storefront";

const document = legalDocuments.find((item) => item.slug === "refund-policy")!;

export const metadata: Metadata = {
  title: document.title,
  description: document.description,
};

export default function RefundPolicyPage() {
  return <LegalDocument document={document} />;
}
