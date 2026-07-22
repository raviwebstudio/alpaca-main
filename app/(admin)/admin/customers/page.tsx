import { db } from '@/lib/db';
import CustomerListClient from './CustomerListClient';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await db.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      profile: true,
      orders: {
        where: { paymentStatus: 'PAID' },
        select: { total: true }
      },
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedCustomers = customers.map(c => ({
    ...c,
    totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    orderCount: c._count.orders
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Customers</h1>
        <p className="text-[#78716C] text-sm mt-1">View and manage your registered customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E0D8D0] overflow-hidden">
        <CustomerListClient customers={formattedCustomers} />
      </div>
    </div>
  );
}
