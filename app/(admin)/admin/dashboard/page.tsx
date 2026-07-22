"use client";

import { formatPrice } from "@/lib/storefront";

export default function AdminDashboard() {
  return (
    <div className="flex-1 p-10">
      <h2 className="text-3xl font-serif text-[#1C1917] mb-6">Welcome, Admin!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Total Sales</h3>
          <p className="text-3xl font-light text-[#1C1917]">{formatPrice(12450)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Active Orders</h3>
          <p className="text-3xl font-light text-[#1C1917]">34</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">New Customers</h3>
          <p className="text-3xl font-light text-[#1C1917]">128</p>
        </div>
      </div>
    </div>
  );
}
