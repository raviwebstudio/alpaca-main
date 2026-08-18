import { formatPrice } from '@/lib/storefront';

export default function SellerDashboardPage() {
  const stats = [
    { label: 'Products', value: '12' },
    { label: 'Open Orders', value: '8' },
    { label: 'Earnings', value: formatPrice(28450) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#1C1917]">Seller Dashboard</h1>
        <p className="mt-1 text-sm text-[#78716C]">Manage products, orders, and earnings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E0D8D0] bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#78716C]">{stat.label}</p>
            <p className="mt-3 text-3xl font-light text-[#1C1917]">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#E0D8D0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-[#1C1917]">Seller tools</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {['Add products', 'Edit products', 'Manage orders', 'View earnings'].map((item) => (
            <div key={item} className="rounded-xl bg-[#FAF8F5] px-4 py-3 text-sm font-medium text-[#1C1917]">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
