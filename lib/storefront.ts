import {
  categoryLabels,
  getBestSellerProducts,
  getCategoryLabel,
  getColorLabel,
  getFallbackProducts,
  getFeaturedProducts,
  getNewDropProducts,
  getProductBySlug,
  getRelatedProducts,
  productCategories,
  products,
  type Product,
  type ProductCategory,
} from "@/data/products";

export {
  categoryLabels,
  getBestSellerProducts,
  getCategoryLabel,
  getColorLabel,
  getFallbackProducts,
  getFeaturedProducts,
  getNewDropProducts,
  getProductBySlug,
  getRelatedProducts,
  productCategories,
  products,
};
export type { Product, ProductCategory };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  coverImage: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export type LegalDocument = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/home-decor", label: "Home Decor" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const collections = [
  {
    title: "Oversized",
    slug: "oversized",
    label: "Relaxed silhouettes",
    description:
      "Heavyweight cotton tees cut with room to move, layered neutrals, and clean structure.",
    href: "/shop?category=oversized",
    image: "/assets/images/portrait-03.webp",
  },
  {
    title: "Basics",
    slug: "basics",
    label: "Daily uniform",
    description:
      "Polished staples designed to anchor the wardrobe with softness, ease, and repeat wear.",
    href: "/shop?category=basics",
    image: "/assets/images/plain-clothing02.jpg",

  },
  {
    title: "Outerwear Utilities",
    slug: "outerwear",
    label: "Layered utility",
    description:
      "Soft hoodies, technical shells, and versatile outer layers designed for movement.",
    href: "/shop?category=outerwear",
    image: "/assets/images/plain-clothing01.jpg",
  },
  {
    title: "Casual Men Tshirts",
    slug: "casual-men-tshirts",
    label: "Casual Tshirts",
    description:
      "Soft hoodies, technical shells, and versatile outer layers designed for movement.",
    href: "/shop?category=casual-men-tshirts",
    image: "/assets/images/casual-men-tshirt.webp",
  },
  {
    title: "Printed Women Tshirts",
    slug: "printed-women-tshirts",
    label: "Party utility",
    description:
      "Soft hoodies, technical shells, and versatile outer layers designed for movement.",
    href: "/shop?category=printed-women-tshirts",
    image: "/assets/images/printed-woman-tshirt.webp",
  },
];

export const reasons = [
  {
    title: "Premium construction",
    description:
      "Dense fabrics, clean seams, and a hand-feel that stays elevated after repeat wear.",
  },
  {
    title: "Built for movement",
    description:
      "Every silhouette is shaped for commuting, layering, travel, and long days in motion.",
  },
  {
    title: "Quiet statement",
    description:
      "Minimal palettes and precise proportions create presence without visual noise.",
  },
  {
    title: "Drop-led curation",
    description:
      "Small capsules, considered edits, and fewer better choices across the storefront.",
  },
];

export const metrics = [
  { value: "48h", label: "dispatch for in-stock drops" },
  { value: "4.9/5", label: "average customer satisfaction" },
  { value: "92%", label: "repeat purchase rate on best sellers" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-build-a-modern-uniform",
    title: "How to build a modern uniform without overthinking your wardrobe",
    description:
      "A clean approach to getting dressed with fewer, better pieces and a stronger silhouette.",
    excerpt:
      "The strongest wardrobes are the easiest to return to. We break down the quiet formulas behind a repeatable daily uniform.",
    publishedAt: "2026-03-07",
    readingTime: "5 min read",
    category: "Style System",
    coverImage: "/assets/images/blog-image-02.webp",
    sections: [
      {
        heading: "Start with proportion, not quantity",
        paragraphs: [
          "A modern uniform works because it removes noise. Start with the shape that feels most natural on you, then repeat it across a few strong pieces.",
          "Oversized tops with cleaner trousers, cropped outerwear over relaxed layers, and tonal palettes all make the wardrobe feel more deliberate with less effort.",
        ],
      },
      {
        heading: "Choose three dependable anchors",
        paragraphs: [
          "Your anchor pieces do the heavy lifting: a heavyweight tee, a crisp overshirt, and one refined outer layer. If those pieces feel right, the rest of the wardrobe becomes easier to rotate.",
          "Quality matters here because these pieces get repeated often. Fabric, drape, and finishing become visible when the design is intentionally quiet.",
        ],
      },
    ],
  },
  {
    slug: "why-fabric-weight-changes-everything",
    title: "Why fabric weight changes everything in premium essentials",
    description:
      "Fabric weight influences drape, structure, comfort, and the way a basic piece feels over time.",
    excerpt:
      "The difference between forgettable and premium often starts in the cloth. Here is why weight, density, and finish matter.",
    publishedAt: "2026-03-15",
    readingTime: "4 min read",
    category: "Fabric Notes",
    coverImage: "/assets/images/plain-clothing01.jpg",
    sections: [
      {
        heading: "Weight defines presence",
        paragraphs: [
          "Heavier cotton tends to hold shape, skim the body differently, and keep a cleaner line through the shoulder and hem.",
          "That presence is part of why premium basics feel so different. The garment sits with confidence instead of collapsing into the body.",
        ],
      },
      {
        heading: "Comfort still matters",
        paragraphs: [
          "Premium weight should never feel stiff for the sake of stiffness. The best fabrics blend structure with softness, so movement remains easy.",
          "That balance is what makes an essential wearable all day, not just visually impressive on a hanger.",
        ],
      },
    ],
  },
  {
    slug: "packing-light-for-city-movement",
    title: "Packing light for city movement: the ALPACA weekend edit",
    description:
      "A compact capsule for short trips, daily commute, and long hours without outfit fatigue.",
    excerpt:
      "When movement is constant, your wardrobe should lighten the load. These are the pieces we keep in rotation for weekends away.",
    publishedAt: "2026-03-22",
    readingTime: "6 min read",
    category: "Movement",
    coverImage: "/inventory/men/tshirts/mens-black-t-shirt01.webp",
    sections: [
      {
        heading: "Pack in layers, not outfits",
        paragraphs: [
          "A travel capsule works best when every layer can move through multiple settings. One tee, one overshirt, one outer layer, and one trouser should create several combinations.",
          "That removes bulk while keeping you ready for transit, dinner, and cooler evenings without repacking your bag three times.",
        ],
      },
      {
        heading: "Keep the palette quiet",
        paragraphs: [
          "The more tonal the wardrobe, the more versatile each piece becomes. Neutral palettes reduce decision fatigue and make repeat wear feel intentional.",
          "A good travel uniform should feel effortless at 7 a.m. and still composed late in the evening.",
        ],
      },
    ],
  },
];

export const faqs = [
  {
    question: "How does sizing run?",
    answer:
      "Most ALPACA pieces are designed with a relaxed premium silhouette. Choose your usual size for the intended fit, or size down if you prefer a neater line.",
  },
  {
    question: "When will my order ship?",
    answer:
      "In-stock orders usually dispatch within 48 hours. Limited new-drop pieces may take an additional 1 to 2 business days during launch windows.",
  },
  {
    question: "Do you offer returns?",
    answer:
      "Yes. Unworn items can be returned within 7 days of delivery, subject to our refund policy and inspection for condition.",
  },
];

export const legalDocuments: LegalDocument[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How ALPACA collects, uses, and protects customer information.",
    sections: [
      {
        title: "Information we collect",
        body: [
          "We collect the information you provide when placing an order, joining the newsletter, or contacting support, including name, email address, shipping address, and order details.",
          "We may also collect basic device and browsing information to improve performance, security, and analytics across the storefront.",
        ],
      },
      {
        title: "How we use it",
        body: [
          "Your information is used to process orders, coordinate delivery, provide support, and send brand communications when you have opted in.",
          "ALPACA does not sell your personal information to third parties. Trusted service providers may process data only when needed to operate the store experience.",
        ],
      },
      {
        title: "Your choices",
        body: [
          "You may request access, correction, or deletion of your stored personal information by contacting support.",
          "Marketing emails include an unsubscribe option in every message.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    description: "The terms that govern use of the ALPACA storefront and purchases.",
    sections: [
      {
        title: "Store use",
        body: [
          "By using this website, you agree to use it lawfully and in a way that does not interfere with the experience of other customers or the operation of the brand.",
          "Product availability, pricing, and editorial content may change without prior notice.",
        ],
      },
      {
        title: "Orders and payment",
        body: [
          "Orders are subject to acceptance and stock verification. Payment must be completed through the available prepaid methods before an order is confirmed.",
          "ALPACA reserves the right to cancel or limit orders that appear fraudulent, duplicated, or inconsistent with fair purchase behavior.",
        ],
      },
      {
        title: "Liability",
        body: [
          "We aim to keep product information accurate, but minor variations in color, finish, or presentation may occur across screens and production batches.",
          "ALPACA is not liable for indirect or consequential losses arising from use of the site or delayed delivery caused by external logistics issues.",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "Return eligibility, inspection standards, and refund timing for ALPACA orders.",
    sections: [
      {
        title: "Eligibility",
        body: [
          "Returns can be requested within 7 days of delivery for unworn items in original condition with tags and packaging intact.",
          "Final sale items, gift cards, and products damaged after delivery are not eligible for refund.",
        ],
      },
      {
        title: "Inspection and approval",
        body: [
          "Returned items are inspected after they arrive at our facility. If approved, the refund is processed back to the original payment method.",
          "If a return does not meet our condition standards, the item may be sent back to the customer.",
        ],
      },
      {
        title: "Refund timing",
        body: [
          "Approved refunds are typically issued within 5 to 7 business days after inspection, depending on your payment provider.",
          "Shipping charges, if any, are non-refundable unless the return is due to a damaged or incorrect item.",
        ],
      },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    description: "Dispatch timelines, delivery windows, and shipping terms for ALPACA.",
    sections: [
      {
        title: "Dispatch timelines",
        body: [
          "In-stock products generally ship within 48 hours. Launch periods and high-volume drops may extend dispatch times slightly.",
          "You will receive tracking details once the order has been handed to our delivery partner.",
        ],
      },
      {
        title: "Delivery windows",
        body: [
          "Metro deliveries typically arrive within 2 to 4 business days after dispatch. Non-metro regions may require additional time depending on the carrier network.",
          "Delivery timelines are estimates and may shift during public holidays, weather disruptions, or exceptional demand periods.",
        ],
      },
      {
        title: "Shipping charges",
        body: [
          "Orders above ₹4,999 receive complimentary shipping. Orders below that threshold incur a standard shipping charge calculated at checkout.",
          "Undeliverable orders caused by inaccurate address details may incur re-shipping fees.",
        ],
      },
    ],
  },
];

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const categories = productCategories;

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const sortProducts = (items: Product[], sort: string | undefined) => {
  const sorted = [...items];

  switch (sort) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => Number(Boolean(b.newDrop)) - Number(Boolean(a.newDrop)));
    default:
      return sorted.sort((a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)));
  }
};
