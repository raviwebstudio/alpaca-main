import type { ReactNode } from "react";
import clsx from "clsx";
import { formatPrice } from "@/lib/storefront";
import { CartItem } from "@/components/storefront/cart-provider";

type OrderSummaryCardProps = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  title?: string;
  note?: string;
  className?: string;
  footer?: ReactNode;
};

export function OrderSummaryCard({
  items,
  subtotal,
  shipping,
  total,
  title = "Order Summary",
  note,
  className,
  footer,
}: OrderSummaryCardProps) {
  // Calculate total MRP based on ₹699 per ₹349 item or 2x price
  const totalMrp = items.reduce((sum, item) => {
    const itemMrp = item.price === 349 ? 699 : item.price * 2;
    return sum + itemMrp * item.quantity;
  }, 0);

  const launchOfferDiscount = Math.max(totalMrp - subtotal, 0);

  return (
    <aside className={clsx("rounded-[28px] border border-line/70 bg-[#F8F5F2] p-6", className)}>
      <h2 className="text-lg font-semibold text-dark">{title}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
            <div>
              <p className="font-semibold text-dark">{item.title}</p>
              <p className="mt-1 text-text-secondary">
                {item.color} / {item.size} / Qty {item.quantity}
              </p>
            </div>
            <span className="font-semibold text-dark">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-line/80 pt-6 text-sm text-text-secondary">
        {/* Total MRP with Strikethrough */}
        <div className="flex items-center justify-between">
          <span>MRP</span>
          <span className="line-through text-[#78716C] font-medium">{formatPrice(totalMrp)}</span>
        </div>

        {/* Launch Offer Discount with Badge */}
        {launchOfferDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-700">
            <span className="flex items-center gap-1.5">
              Launch Offer
              <span className="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 tracking-wide">
                50% OFF
              </span>
            </span>
            <span className="font-semibold">-{formatPrice(launchOfferDiscount)}</span>
          </div>
        )}

        {/* Selling Price / Subtotal */}
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-dark">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping with Strikethrough ₹249 -> FREE */}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="line-through text-[#78716C] text-xs">₹99</span>
            <span className="text-emerald-700 font-bold">FREE</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-line/80 pt-4">
          <span className="text-base font-semibold text-dark">Total Payable</span>
          <span className="text-base font-semibold text-dark">{formatPrice(total)}</span>
        </div>
      </div>

      {footer ? <div className="mt-6">{footer}</div> : null}
      {note ? <p className="mt-4 text-sm leading-6 text-text-secondary">{note}</p> : null}
    </aside>
  );
}
