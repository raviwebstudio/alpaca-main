import Link from "next/link";
import clsx from "clsx";

const STEPS = [
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "address", label: "Address", href: "/checkout/address" },
  { id: "payment", label: "Payment", href: "/checkout/payment" },
  { id: "success", label: "Success", href: "/checkout/success" },
] as const;

type CheckoutStep = (typeof STEPS)[number]["id"];

export function CheckoutProgress({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <div className="flex flex-wrap gap-3">
      {STEPS.map((step, index) => {
        const active = index === currentIndex;
        const complete = index < currentIndex;
        const content = (
          <>
            <span
              className={clsx(
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-semibold",
                active ? "bg-white/16 text-white" : "bg-background text-dark",
              )}
            >
              {index + 1}
            </span>
            <span className="font-semibold">{step.label}</span>
          </>
        );

        const className = clsx(
          "inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition",
          active
            ? "border-dark bg-dark text-white"
            : complete
              ? "border-dark/15 bg-white text-dark hover:-translate-y-0.5"
              : "border-line bg-white/80 text-text-secondary",
        );

        if (active || complete) {
          return (
            <Link key={step.id} href={step.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <span key={step.id} className={className}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
