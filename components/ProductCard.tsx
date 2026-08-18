"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { getCategoryLabel, type Product } from "@/data/products";
import { formatPrice } from "@/lib/storefront";

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
  const image = images?.[0];
  const label = getCategoryLabel(product.category);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "group flex h-full flex-col rounded-2xl overflow-hidden bg-white shadow-soft cursor-pointer",
        className,
      )}
    >
      <Link href={href} className="block">
        <div className="relative w-full aspect-[5/4] overflow-hidden">
          <Image
            src={image ?? "/inventory/men/tshirts/plain-white-t-shirt01.jpg"}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 24vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 z-10">
            {product.bestSeller ? (
              <span className="bg-[#1C1917] text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                Best Seller
              </span>
            ) : product.newDrop ? (
              <span className="bg-[#1C1917] text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                New Drop
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
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
          {product.summary ?? product.description}
        </p>
        <div className="mt-auto">
          <p className="text-lg font-semibold text-stone-900 mb-1">
            {formatPrice(product.price)}
          </p>
          <Link href={href} className="block mt-3">
            <span className="w-full bg-[#1C1917] text-white py-3 rounded-full text-sm font-medium hover:bg-[#C8956C] transition-colors duration-300 inline-flex items-center justify-center">
              View Product -&gt;
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export { ProductCard };
