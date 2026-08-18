import { getContentOrders } from "@/lib/content";
import { OrderListClient } from "./OrderListClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = getContentOrders();

  return <OrderListClient orders={orders} />;
}
