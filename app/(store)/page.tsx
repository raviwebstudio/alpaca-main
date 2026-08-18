import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { BlogCard } from "@/components/storefront/blog-card";
import { FadeIn } from "@/components/storefront/fade-in";
import { InteractiveSiteImage } from "@/components/storefront/interactive-site-image";
import { ProductCarousel } from "@/components/storefront/product-carousel";
import { SectionHeading } from "@/components/storefront/section-heading";
import { getBestSellerProducts, getFallbackProducts } from "@/data/products";
import { getProducts } from "@/lib/productStorage";
import { blogPosts, collections, metrics, reasons } from "@/lib/storefront";
import { SITE_IMAGES } from "@/lib/siteImages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MADE FOR THE MOVE",
  description:
    "Discover ALPACA's premium essentials, oversized t-shirts, minimal basics, and new drops in a refined fashion storefront.",
};

const whyAlpaca = [
  { title: "Soft dispatch", copy: "Fast prepaid fulfillment with careful finishing.", icon: Truck },
  { title: "Verified quality", copy: "Construction-first fabrics and quiet detail.", icon: ShieldCheck },
  { title: "Curated edits", copy: "Intentional releases instead of crowded choice.", icon: Sparkles },
  { title: "Move-ready", copy: "Made to travel from work, city, and weekend plans.", icon: PackageCheck },
];

export default async function HomePage() {
  const allProducts = await getProducts();
  const bestSellers = getBestSellerProducts(6, "fashion", allProducts);
  const homepageBestSellers = bestSellers.length ? bestSellers : getFallbackProducts(6, "fashion", allProducts);

  return (
    <>
      <Suspense fallback={<div className="h-96 bg-[#FAF8F5]" />}>
        <FadeIn>
          <section className="shell pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="space-y-8 motion-safe:animate-fade-up">
              <div className="space-y-5">
                <p className="eyebrow">ALPACA</p>
                <h1 className="max-w-4xl text-balance text-[3.6rem] leading-[0.92] text-dark sm:text-[4.8rem] lg:text-[5.5rem]">
                  MADE FOR
                  <br />
                  THE MOVE
                </h1>
                <p className="max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                  Premium Indian essentials with cleaner lines, quiet palettes, and enough softness to
                  move from morning commute to late city plans.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95"
                >
                  Browse catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((item) => (
                  <div key={item.label} className="surface-card rounded-[24px] p-5">
                    <p className="text-3xl text-dark">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_220px] motion-safe:animate-fade-up">
              <div className="surface-card overflow-hidden rounded-[36px] shadow-premium sm:h-[520px] relative h-[500px]">
                <InteractiveSiteImage
                  src={SITE_IMAGES.homepage.heroPrimary}
                  alt="Hero Image"
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  containerClassName="h-full w-full"
                >
                  <div className="absolute inset-0 flex items-end bg-black/20 p-8 pointer-events-none">
                    <div className="max-w-sm text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
                        Premium everyday
                      </p>
                      <h2 className="mt-2 text-3xl text-white sm:text-[2.1rem]">
                        Quiet layers built to carry long days well.
                      </h2>
                    </div>
                  </div>
                </InteractiveSiteImage>
              </div>

              <div className="grid gap-5">
                <div className="surface-card rounded-[28px] bg-[#F8F5F2] p-5">
                  <p className="eyebrow">Fabric first</p>
                  <p className="mt-4 text-xl text-dark">Heavyweight tees. Refined basics.</p>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Built around repeat wear, structure, and understated presence.
                  </p>
                </div>
                <div className="surface-card rounded-[28px] p-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[22px]">
                    <InteractiveSiteImage
                      src={SITE_IMAGES.homepage.heroSecondary}
                      alt="ALPACA secondary look"
                      sizes="220px"
                      containerClassName="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-[#FAF8F5]" />}>
        <FadeIn delay={0.05}>
          <section className="relative z-[1] w-full overflow-hidden py-16 bg-[#FAF8F5]">
            <div className="shell motion-safe:animate-fade-up">
              <SectionHeading
                eyebrow="Best Sellers"
                title="The pieces customers keep returning to."
                description="A horizontal edit with premium weight, softened structure, and clean utility across the week."
              />
              <div className="mt-10 relative w-full">
                <ProductCarousel products={homepageBestSellers} />
              </div>
            </div>
          </section>
        </FadeIn>
      </Suspense>


      <Suspense fallback={<div className="h-96 bg-[#FAF8F5]" />}>
        <FadeIn delay={0.08}>
          <section className="shell section-space pt-0 motion-safe:animate-fade-up">
            <div className="grid gap-5 lg:grid-cols-3">
              {collections.map((collection, index) => (
                <Link
                  key={collection.slug}
                  href={collection.href}
                  className={`group surface-card overflow-hidden rounded-[30px] transition duration-500 hover:-translate-y-1 hover:shadow-premium ${index === 0 ? "lg:col-span-2" : ""
                    }`}
                >
                  <div className={`grid h-full ${index === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
                    <div className="space-y-4 p-6 sm:p-8">
                      <p className="eyebrow">{collection.label}</p>
                      <h3 className="text-balance text-4xl text-dark sm:text-5xl">{collection.title}</h3>
                      <p className="max-w-md text-base leading-7 text-text-secondary">
                        {collection.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-dark">
                        Explore collection
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                    <div className="relative min-h-[300px] overflow-hidden">
                      <InteractiveSiteImage
                        src={collection.image}
                        alt={collection.title}
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        containerClassName="w-full h-full min-h-[300px]"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-[#FAF8F5]" />}>
        <FadeIn delay={0.12}>
          <section className="relative z-[1] w-full overflow-hidden py-16 bg-[#FAF8F5]">
            <div className="shell motion-safe:animate-fade-up">
              <div className="surface-card relative overflow-hidden rounded-[36px] p-8 sm:p-12 lg:p-14">
                <Image
                  src={SITE_IMAGES.homepage.movementNotesBg}
                  alt="ALPACA Fabric Texture Background"
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover object-center pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#FAF8F5]/85 backdrop-blur-[2px] pointer-events-none" />
                <div className="relative z-10">
                  <p className="eyebrow">Movement notes</p>
                  <h2 className="mt-4 text-balance text-5xl leading-[0.96] text-dark sm:text-6xl">
                    A quieter wardrobe with enough range for real life.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
                    ALPACA builds around tonal layering, premium fabric, and silhouettes that feel
                    resolved from first wear. That is what makes the essentials repeatable.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {reasons.slice(0, 2).map((reason) => (
                      <div key={reason.title} className="rounded-[24px] border border-line/80 bg-background/90 shadow-sm backdrop-blur-md p-5">
                        <h3 className="text-2xl text-dark">{reason.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">{reason.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-[#FAF8F5]" />}>
        <FadeIn delay={0.1}>
          <section className="shell section-space pt-0 motion-safe:animate-fade-up">
            <SectionHeading
              eyebrow="Why ALPACA"
              title="Minimal does not mean empty. It means every detail matters."
              description="The design language stays quiet so fabric, fit, and finishing can speak clearly."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {whyAlpaca.map((item) => (
                <div key={item.title} className="surface-card rounded-[28px] p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-dark">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-3xl text-dark">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">{item.copy}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-[#FAF8F5]" />}>
        <FadeIn delay={0.14}>
          <section className="shell section-space pt-0 motion-safe:animate-fade-up">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Journal"
                title="Stories behind the wardrobe."
                description="Thoughts on fabric, proportion, movement, and building a sharper daily uniform."
              />
              <Link href="/blog" className="hidden text-sm font-semibold text-dark md:block">
                View all posts
              </Link>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </FadeIn>
      </Suspense>
    </>
  );
}
