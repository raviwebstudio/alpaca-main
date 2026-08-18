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
  return (
    <aside className={clsx("rounded-[28px] border border-line/70 bg-[#F8F5F2] p-6", className)}>
      <h2 className="text-lg font-semibold text-dark">{title}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
            <div>
              <p className="font-semibold text-dark">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-secondary">
                {item.sellerName}
              </p>
              <p className="mt-1 text-text-secondary">
                {item.color} / {item.size} / Qty {item.quantity}
              </p>
            </div>
            <span className="font-semibold text-dark">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-line/80 pt-6 text-sm text-text-secondary">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-dark">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-dark">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-line/80 pt-4">
          <span className="text-base font-semibold text-dark">Total</span>
          <span className="text-base font-semibold text-dark">{formatPrice(total)}</span>
        </div>
      </div>

      {footer ? <div className="mt-6">{footer}</div> : null}
      {note ? <p className="mt-4 text-sm leading-6 text-text-secondary">{note}</p> : null}
    </aside>
  );
}
