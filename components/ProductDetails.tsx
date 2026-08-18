import Link from "next/link";
import { ArrowLeft, ShieldCheck, Store, Truck } from "lucide-react";
import {
  getCategoryLabel,
  getFallbackProducts,
  getRelatedProducts,
  products,
  ENABLE_HOME_DECOR,
  type Product,
} from "@/data/products";
import { FadeIn } from "@/components/storefront/fade-in";
import { ProductCarousel } from "@/components/storefront/product-carousel";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { PRODUCT_COLOR_HEX, PurchasePanel } from "@/components/storefront/purchase-panel";
import { formatPrice } from "@/lib/storefront";

const PRODUCT_FAQS = [
  {
    question: "How does checkout work?",
    answer:
      "Add the product to cart, review your bag, enter delivery address, and continue to payment.",
  },
  {
    question: "When will my order ship?",
    answer:
      "In-stock orders usually dispatch within 48 hours. You will see the next step clearly at each checkout stage.",
  },
];

export function ProductDetails({ product }: { product: Product }) {
  const isFashion = product.type === "fashion";
  const tshirtProducts = products.filter((item) => item.type === "fashion");
  const otherTshirts = tshirtProducts.filter((item) => item.slug !== product.slug);
  const similarProducts = isFashion
    ? (otherTshirts.length > 0 ? otherTshirts.slice(0, 4) : tshirtProducts.slice(0, 4))
    : ENABLE_HOME_DECOR
      ? getFallbackProducts(4, "decor").filter((item) => item.slug !== product.slug).slice(0, 4)
      : tshirtProducts.slice(0, 4);
  const backHref = product.type === "decor" && ENABLE_HOME_DECOR ? "/home-decor" : "/shop";

  return (
    <div className="shell section-space space-y-14">
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {product.type === "decor" && ENABLE_HOME_DECOR ? "home decor" : "shop"}
          </Link>
          <p className="text-sm text-text-secondary">
            {getCategoryLabel(product.category)} / Ships {(product.shippingLeadTime ?? "dispatches within 48 hours").toLowerCase()}
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <section className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="min-w-0">
            <ProductGallery images={product.images} alt={product.title} />
          </div>
          <div className="min-w-0">
            <PurchasePanel product={product} />
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
          <div className="space-y-8">
            <div className="surface-card rounded-[32px] p-6 sm:p-8">
              <p className="eyebrow">Description</p>
              <h2 className="mt-4 text-4xl text-dark sm:text-5xl">What you are getting.</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                {product.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {(product.highlights ?? []).map((highlight) => (
                  <div key={highlight} className="rounded-[24px] border border-line bg-background/80 p-4">
                    <p className="text-sm font-semibold text-dark">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6 sm:p-8">
              <p className="eyebrow">FAQ</p>
              <div className="mt-5 divide-y divide-line">
                {PRODUCT_FAQS.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="cursor-pointer list-none text-xl text-dark">
                      <span className="flex items-center justify-between gap-4">
                        {faq.question}
                        <span className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary transition group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-[32px] p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft">
                    <Truck className="h-5 w-5 text-dark" />
                  </span>
                  <div>
                    <h3 className="text-2xl text-dark">Delivery</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      {product.shippingLeadTime ?? "Dispatches within 48 hours"}. You will review your cart before entering address and
                      payment details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft">
                    <ShieldCheck className="h-5 w-5 text-dark" />
                  </span>
                  <div>
                    <h3 className="text-2xl text-dark">{product.type === "decor" ? "Material and finish" : "Fit and fabric"}</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      {product.type === "decor"
                        ? `Made from ${product.material?.toLowerCase() ?? "premium materials"} for modern spaces.`
                        : `Built for movement. Made from ${product.material?.toLowerCase() ?? "premium materials"}.`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft">
                    <Store className="h-5 w-5 text-dark" />
                  </span>
                  <div>
                    <h3 className="text-2xl text-dark">Sold by ALPACA Studio</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      Meerut, India. Usually responds within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6 sm:p-8">
              <p className="eyebrow">How checkout works</p>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-text-secondary sm:text-base">
                <li>1. Choose the product configuration.</li>
                <li>2. Add the product to cart or continue straight to cart.</li>
                <li>3. Confirm address and payment on the next screens.</li>
              </ol>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Related products</p>
              <h2 className="mt-4 text-balance text-4xl text-dark sm:text-5xl">
                Keep browsing before you commit.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
                These options follow the same product system, so adding new categories or future sellers
                will scale without changing the flow.
              </p>
            </div>
          </div>
          <div className="mt-10 min-w-0">
            <ProductCarousel products={similarProducts} />
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

export function ProductFallback({ slug }: { slug: string }) {
  const suggestions = getFallbackProducts(4);

  return (
    <div className="shell section-space space-y-10">
      <FadeIn className="surface-card rounded-[36px] p-8 sm:p-12">
        <p className="eyebrow">Product lookup</p>
        <h1 className="mt-4 text-balance text-5xl text-dark sm:text-6xl">
          We could not find &quot;{slug}&quot;.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
          The product link may be outdated, but you do not need to start over. Head back to the shop or
          open one of the available products below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95"
          >
            Browse all products
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:border-dark"
          >
            Review cart
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <section className="space-y-4">
          <div>
            <p className="eyebrow">Available now</p>
            <h2 className="mt-3 text-4xl text-dark sm:text-5xl">Try one of these instead.</h2>
          </div>
          <ProductCarousel products={suggestions} />
        </section>
      </FadeIn>
    </div>
  );
}
