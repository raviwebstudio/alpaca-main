"use client";

import { useState } from "react";
import {
  Users,
  Search,
  IndianRupee,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/storefront";
import type { ContentCustomer } from "@/lib/content";

interface CustomerListClientProps {
  customers: ContentCustomer[];
}

export function CustomerListClient({ customers: initialCustomers }: CustomerListClientProps) {
  const [customers] = useState<ContentCustomer[]>(initialCustomers);
  const [search, setSearch] = useState("");

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrdersAll = customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);
  const avgCustomerLTV = customers.length > 0 ? Math.round(totalSpentAll / customers.length) : 0;

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Customer Profiles</h1>
          <p className="text-sm text-[#78716C] mt-1">
            Customer directory saved to <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">content/customers/*.json</span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Total Customers</p>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{customers.length}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Total Customer Spend</p>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{formatPrice(totalSpentAll)}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <IndianRupee size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0D8D0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">Avg Customer Value</p>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{formatPrice(avgCustomerLTV)}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0D8D0] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#C8956C]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8D0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 text-[#78716C] text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-3.5">Customer Name</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Total Orders</th>
                <th className="px-6 py-3.5">Lifetime Spend</th>
                <th className="px-6 py-3.5">First Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-xs text-[#1C1917]">{c.name}</p>
                      {c.email && (
                        <p className="text-[11px] text-stone-500">{c.email}</p>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-stone-700">
                      {c.phone}
                    </td>

                    <td className="px-6 py-4 text-xs text-stone-600">
                      {c.city ? `${c.city}, ${c.state || ""}` : "India"}
                    </td>

                    <td className="px-6 py-4 font-semibold text-xs text-stone-800">
                      {c.ordersCount} order(s)
                    </td>

                    <td className="px-6 py-4 font-semibold text-xs text-[#1C1917]">
                      {formatPrice(c.totalSpent || 0)}
                    </td>

                    <td className="px-6 py-4 text-xs text-stone-500">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
