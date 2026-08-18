import { getInventoryItems } from "@/lib/content";
import { InventoryManagerClient } from "@/components/admin/InventoryManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const items = getInventoryItems();

  return <InventoryManagerClient initialItems={items} />;
}
