"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { getCategoryLabel, type Product } from "@/data/products";
import { formatPrice } from "@/lib/storefront";
import { getOptimizedImageUrl } from "@/lib/imageUtils";

export default function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const slug = product.slug?.trim();
  const href = slug ? `/product/${slug}` : "/shop";
  const rawImages = product.images as string[] | string;
  const images =
    typeof rawImages === "string"
      ? (() => {
          try {
            return JSON.parse(rawImages) as string[];
          } catch {
            return [];
          }
        })()
      : rawImages;
  const rawImage = images?.[0];
  const image = getOptimizedImageUrl(rawImage, product.updatedAt);

  const getCollectionLabel = (prod: Product) => {
    if (prod.type === "fashion") {
      return "OVERSIZED";
    }
    return getCategoryLabel(prod.category).toUpperCase();
  };

  const label = getCollectionLabel(product);
  const mrpPrice = product.mrp || (product.price === 349 ? 699 : product.price * 2);

  const badgeText = product.badge
    ?? (product.slug === "plain-white-t-shirt-for-mens" ? "Signature"
      : product.slug === "plain-black-t-shirt-for-mens" ? "Bestseller"
      : product.slug === "green-t-shirt-for-men" ? "New Drop"
      : product.slug === "maroon-t-shirt-for-men" ? "Limited Edition"
      : product.bestSeller ? "Bestseller"
      : product.newDrop ? "New Drop"
      : null);

  return (
    <div
      className={clsx(
        "group flex h-full flex-col rounded-2xl overflow-hidden bg-white shadow-soft cursor-pointer",
        className,
      )}
    >
      <Link href={href} className="block">
        <div className="relative w-full h-[360px] overflow-hidden">
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 24vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover object-center"
          />
          {badgeText ? (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-black/35 backdrop-blur-md border border-white/25 text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                {badgeText}
              </span>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1 font-semibold">
          {label}
        </p>
        <Link href={href}>
          <h3 className="text-xl text-stone-900 transition-colors hover:text-[#C8956C]">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-stone-500 mt-1 mb-3">
          {product.type === "decor" ? product.material : "ALPACA Studio"}
        </p>
        <p className="text-sm text-stone-400 truncate w-full mb-4">
          {product.summary && product.summary.trim().length > 0 ? product.summary : product.description}
        </p>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
            <span className="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 tracking-wide">
              50% OFF
            </span>
            <span className="text-sm text-stone-400 line-through font-medium">
              {formatPrice(mrpPrice)}
            </span>
          </div>
          <Link href={href} className="block mt-3">
            <span className="w-full bg-[#1C1917] text-white py-3 rounded-full text-sm font-medium hover:bg-[#C8956C] transition-colors duration-300 inline-flex items-center justify-center">
              View Product -&gt;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
