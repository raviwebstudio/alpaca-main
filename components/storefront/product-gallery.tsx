"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getOptimizedImageUrl } from "@/lib/imageUtils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : ["/products/media/plain-white-t-shirt01.webp"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  return (
    <div className="min-w-0 space-y-4">
      <div className="surface-card group relative aspect-[5/5] overflow-hidden rounded-[32px] bg-surface-muted mb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={getOptimizedImageUrl(activeImage)}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/10 via-transparent to-transparent" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {safeImages.map((image, index) => (
          <motion.button
            key={`${image}-${index}`}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveImage(image)}
            className={`relative h-16 w-16 flex-none overflow-hidden rounded-xl border bg-white transition md:h-20 md:w-20 ${
              activeImage === image
                ? "border-dark ring-1 ring-dark"
                : "border-line opacity-80 hover:border-dark hover:opacity-100"
            }`}
          >
            <Image
              src={getOptimizedImageUrl(image)}
              alt={`${alt} view ${index + 1}`}
              fill
              sizes="(min-width: 768px) 80px, 64px"
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
