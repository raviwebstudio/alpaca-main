"use client";

import { SITE_IMAGES } from "@/lib/siteImages";
import { InteractiveSiteImage } from "@/components/storefront/interactive-site-image";

export function AboutHeroImage() {
  return (
    <InteractiveSiteImage
      src={SITE_IMAGES.about.hero}
      alt="ALPACA Brand Story Editorial"
      priority
      sizes="(min-width: 1280px) 1200px, 100vw"
      containerClassName="w-full h-[400px] sm:h-[540px] lg:h-[640px] xl:h-[680px] rounded-[36px] sm:rounded-[50px] lg:rounded-[56px] border border-line shadow-soft bg-[#FAF8F5]"
    />
  );
}
