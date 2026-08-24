"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutProgress } from "@/components/storefront/checkout-progress";
import { FadeIn } from "@/components/storefront/fade-in";
import { formatPrice } from "@/lib/storefront";
import { useCart, type OrderRecord } from "@/components/storefront/cart-provider";

export function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const { hydrated, lastOrder, clearLastOrder } = useCart();
  const [orderData, setOrderData] = useState<OrderRecord | null>(lastOrder);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lastOrder && (!orderIdParam || lastOrder.reference === orderIdParam)) {
      setOrderData(lastOrder);
      return;
    }

    if (orderIdParam) {
      setLoading(true);
      fetch(`/api/orders/${encodeURIComponent(orderIdParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrderData({
              reference: data.order.orderId || orderIdParam,
              items: data.order.items || [],
              subtotal: data.order.subtotal || 0,
              shipping: data.order.shipping || 0,
              discount: data.order.discount || 0,
              total: data.order.total || 0,
              address: data.order.address || {
                name: "Customer",
                email: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
              },
              paymentMethod: data.order.paymentMethod || "upi",
              paymentStatus: data.order.paymentStatus || "CONFIRMED",
              orderStatus: data.order.orderStatus || "PLACED",
              placedAt: data.order.placedAt || new Date().toISOString(),
              sheetSynced: data.order.sheetSynced ?? (data.order.sheetSyncStatus === "synced"),
              sheetSyncStatus: data.order.sheetSyncStatus || (data.order.sheetSynced ? "synced" : "failed"),
              sheetSyncError: data.order.sheetSyncError,
            });
          }
        })
        .catch((err) => console.error("[SuccessPage] Error fetching order:", err))
        .finally(() => setLoading(false));
    }
  }, [lastOrder, orderIdParam]);

  useEffect(() => {
    if (hydrated && !orderData && !orderIdParam && !loading) {
      router.replace("/cart");
    }
  }, [hydrated, orderData, orderIdParam, loading, router]);

  if (!hydrated || loading || (!orderData && orderIdParam)) {
    return (
      <section className="shell section-space">
        <FadeIn className="surface-card rounded-[32px] p-8 text-center">
          <p className="eyebrow">Order Confirmation</p>
          <h1 className="mt-4 text-4xl text-dark sm:text-5xl">Retrieving your order details...</h1>
        </FadeIn>
      </section>
    );
  }

  if (!orderData) {
    return null;
  }

  const isSynced = Boolean(orderData.sheetSynced || orderData.sheetSyncStatus === "synced");

  return (
    <section className="shell section-space space-y-8">
      <FadeIn>
        <CheckoutProgress current="success" />
      </FadeIn>

      <FadeIn className="surface-card rounded-[36px] p-8 sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#F0E7DD] text-dark">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="eyebrow mt-6">Order confirmed</p>
          <h1 className="mt-4 text-balance text-5xl text-dark sm:text-6xl">
            Your ALPACA order is placed.
          </h1>
          <p className="mt-4 text-base leading-7 text-text-secondary sm:text-lg">
            We are getting it ready now. Dispatch updates will follow shortly on your registered phone
            number and email.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <p className="rounded-full bg-[#F8F5F2] border border-line px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-dark">
              Order ID: {orderData.reference}
            </p>
            {isSynced ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Saved to Google Sheets
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-medium text-rose-800">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                {orderData.sheetSyncError ? `Sheet Error: ${orderData.sheetSyncError}` : "Google Sheet Sync Failed"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-line bg-[#F8F5F2] p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Delivery details
              </p>
              <p className="mt-4 text-xl font-semibold text-dark">{orderData.address.name}</p>
              {orderData.address.email && (
                <p className="mt-1 text-sm text-text-secondary">{orderData.address.email}</p>
              )}
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {orderData.address.address}, {orderData.address.city}, {orderData.address.state} -{" "}
                {orderData.address.pincode}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{orderData.address.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-line/60 pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  Payment Method
                </p>
                <p className="mt-1 text-sm font-medium text-dark">
                  {orderData.paymentMethod === "netbanking"
                    ? "Net banking"
                    : orderData.paymentMethod.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  Payment Status
                </p>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  {orderData.paymentStatus || "CONFIRMED"}
                </p>
              </div>
            </div>

            <div className="border-t border-line/60 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Order Status
              </p>
              <p className="mt-1 inline-flex items-center rounded-full bg-[#EAE2D8] px-3 py-1 text-xs font-semibold text-dark">
                {orderData.orderStatus || "PLACED"}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-line bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Order summary
            </p>
            <div className="mt-5 space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-sm border-b border-line/40 pb-3 last:border-b-0">
                  <div>
                    <p className="font-semibold text-dark">{item.title}</p>
                    {item.sellerName && (
                      <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-text-secondary">
                        {item.sellerName}
                      </p>
                    )}
                    <p className="mt-1 text-text-secondary">
                      {item.color} / {item.size} / Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-dark">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm text-text-secondary">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-dark">{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-dark">
                  {orderData.shipping === 0 ? "Free" : formatPrice(orderData.shipping)}
                </span>
              </div>
              {orderData.discount ? (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold">-{formatPrice(orderData.discount)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t border-line pt-4">
                <span className="text-base font-semibold text-dark">Total paid</span>
                <span className="text-base font-semibold text-dark">{formatPrice(orderData.total)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span>Estimated delivery</span>
                <span className="font-semibold text-dark">2-4 business days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            onClick={clearLastOrder}
            className="inline-flex items-center justify-center rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            onClick={clearLastOrder}
            className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
          >
            Back to home
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
