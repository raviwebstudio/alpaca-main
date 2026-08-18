import Link from "next/link";
import { ENABLE_HOME_DECOR } from "@/data/products";
import { SITE_IMAGES } from "@/lib/siteImages";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0907] text-white mt-24">
      {/* ===== SECTION 1: HERO FOOTER BANNER ===== */}
      <section className="relative w-full px-4 pb-12 rounded-[32px] sm:px-8 lg:px-16" style={{ paddingTop: "50px" }}>
        <div className="group relative overflow-hidden rounded-[32px] bg-[#1C1917] rounded-[32px] transition-transform duration-500 hover:scale-[1.01]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={SITE_IMAGES.footer.heroBannerBg}
              alt="Premium clothing background"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start justify-center px-8 py-20 sm:px-12 lg:px-20 lg:py-28">
            <h2 className="max-w-2xl font-playfair text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
              Elevate everyday essentials.
            </h2>
            <p className="mt-5 max-w-lg text-base font-normal leading-relaxed text-white/90 sm:text-lg drop-shadow-sm">
              Premium clothing designed for movement, comfort, and daily life.
            </p>


            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="group/btn relative overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10">Shop Now</span>
              </Link>
              <Link
                href="/shop"
                className="group/btn relative overflow-hidden rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10">Explore Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: FOOTER GRID ===== */}
      <section className="px-4 pb-16 pt-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* LEFT SIDE: Brand & Description */}
            <div className="lg:col-span-1">
              <a href="/"><img src={SITE_IMAGES.logoWhite} alt="ALPACA" className="footer-logo mb-5" /></a>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Minimal, premium essentials for everyday movement. Curated
                oversized tees, refined basics, and new drops.
              </p>
              <div className="mt-3">
                <a href="mailto:contact@alpacaa.in" className="text-sm text-white/60 transition-colors duration-200 hover:text-white mt-2">Contact@alpacaa.in</a>
                <br />
                <a href="mailto:contact@alpacaa.in" className="text-sm text-white/60 transition-colors duration-200 hover:text-white">Support@alpacaa.in</a>
              </div>
              {/* <div className="social-icons d-flex">
                <a href="https://www.instagram.com/alpacaa.in/"><img src={SITE_IMAGES.socialIcons.instagram} alt="Instagram" className="w-8 h-8" /></a>
                <a href="https://www.facebook.com/alpacaa.in/"><img src={SITE_IMAGES.socialIcons.facebook} alt="Facebook" className="w-8 h-8" /></a>
                <a href="https://whatsapp://send?phone=+918262948016"><img src={SITE_IMAGES.socialIcons.whatsapp} alt="Whatsapp" className="w-8 h-8" /></a>
              </div> */}
            </div>

            {/* RIGHT SIDE: Link Columns */}
            <div className="grid grid-cols-2 gap-8 sm:col-span-1 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2 lg:pl-12">
              {/* Column 1: Company / Quick Links */}
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#C8956C]">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/shop"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Shop
                    </Link>
                  </li>
                  {ENABLE_HOME_DECOR && (
                    <li>
                      <Link
                        href="/shop?category=home-decor"
                        className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                      >
                        Home Decor
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/about"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Updates
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Support */}
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#C8956C]">
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Terms of services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/return-policy"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund-policy"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping-policy"
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      Shipping Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-white/40">
              © 2026 ALPACA — MADE FOR THE MOVE. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/40">Design by</span>
              <span className="rounded border border-[#C8956C]/30 px-2 py-0.5 text-xs font-medium tracking-wide text-[#C8956C]">
                CROWCENT
              </span>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}