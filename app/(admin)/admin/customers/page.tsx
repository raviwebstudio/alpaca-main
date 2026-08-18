import { getContentCustomers } from "@/lib/content";
import { CustomerListClient } from "./CustomerListClient";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = getContentCustomers();

  return <CustomerListClient customers={customers} />;
}
