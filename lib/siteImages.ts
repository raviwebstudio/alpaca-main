/**
 * Centralized configuration for all NON-PRODUCT / site images across the ALPACA website.
 * Update image URLs here to replace static imagery throughout the site.
 */

export const SITE_IMAGES = {
  // Brand & Identity
  logo: "/assets/logo-black.png",
  logoWhite: "/assets/logo-white.png",
  favicon: "/assets/favicon-black.png",

  // Homepage Hero & Lifestyle Imagery
  homepage: {
    heroPrimary: "/assets/images/portrait-01.webp",
    heroSecondary: "/assets/images/portrait-02.webp",
    movementNotesBg: "/assets/images/movement-notes-bg.jpg",
  },

  // Collection Cards & Category Imagery
  collections: {
    oversized: "/assets/images/portrait-03.webp",
    basics: "/assets/images/plain-clothing02.jpg",
    outerwear: "/assets/images/plain-clothing01.jpg",
    casualMenTshirts: "/assets/images/casual-men-tshirt.webp",
    printedWomenTshirts: "/assets/images/printed-woman-tshirt.webp",
  },

  // About Page Imagery
  about: {
    hero: "/assets/images/about-img.webp",
  },

  // Home Decor Page Imagery
  homeDecor: {
    heroBanner: "/assets/images/home-decor-bg.webp",
  },

  // Blog Covers
  blog: {
    post1: "/assets/images/blog-image-02.webp",
    post2: "/assets/images/plain-clothing01.jpg",
    post3: "/products/media/mens-black-t-shirt01.webp",
  },

  // Footer Imagery & Social Icons
  footer: {
    heroBannerBg: "/assets/images/plain-clothing02.jpg",
  },
  socialIcons: {
    instagram: "https://thumbs.dreamstime.com/b/social-media-instagram-icon-transparent-background-172928815.jpg",
    facebook: "https://www.logo.wine/a/logo/Facebook/Facebook-f_Logo-Blue-Logo.wine.svg",
    whatsapp: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/3840px-WhatsApp.svg.png",
  },

  // Placeholders / Fallbacks for non-product listings
  placeholders: {
    product: "/assets/images/plain-clothing01.jpg",
  },
} as const;

export type SiteImages = typeof SITE_IMAGES;
