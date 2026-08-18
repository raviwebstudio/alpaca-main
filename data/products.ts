export type ProductType = "fashion" | "decor";

export type ProductCategory =
  | "oversized"
  | "basics"
  | "outerwear"
  | "frames"
  | "wall-art"
  | "table-decor";

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  mrp?: number;
  type: ProductType;
  category: ProductCategory;
  sizes?: string[];
  colors?: string[];
  material?: string;
  style?: "Minimal" | "Modern";
  images: string[];
  description: string;
  summary?: string;
  highlights?: string[];
  shippingLeadTime?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newDrop?: boolean;
  badge?: string;
  updatedAt?: string;
};

export type ProductFilters = {
  category: ProductCategory | "all";
  size: string | "all";
};

export type ProductCategoryOption = {
  value: ProductCategory;
  label: string;
  description: string;
};

export const categoryLabels: Record<ProductCategory, string> = {
  oversized: "Oversized",
  basics: "Basics",
  outerwear: "Outerwear",
  frames: "Frames",
  "wall-art": "Wall Art",
  "table-decor": "Table Decor",
};

export const categoryDescriptions: Record<ProductCategory, string> = {
  oversized: "Relaxed silhouettes with premium weight",
  basics: "Closer-to-body everyday essentials",
  outerwear: "Layering pieces for commute, travel, and changing weather",
  frames: "Structured frames for shelves, desks, and calm wall systems.",
  "wall-art": "Quiet graphic pieces designed to anchor modern rooms.",
  "table-decor": "Small objects that bring function and stillness to daily spaces.",
};

export const ENABLE_HOME_DECOR = false;

export const allProducts: Product[] = [
  {
    id: 1,
    title: "Plain White T-shirt for Mens",
    slug: "plain-white-t-shirt-for-mens",
    price: 349,
    type: "fashion",
    category: "oversized",
    sizes: ["M", "L", "XL"],
    colors: ["White"],
    material: "100% Cotton",
    images: [
      "/products/media/plain-white-t-shirt01.webp",
      "/products/media/plain-white-t-shirt02.webp",
      "/products/media/plain-white-t-shirt03.jpg",
    ],
    description: " ",
    summary: "Clean heavyweight cotton tee for everyday wear.",
    highlights: ["180 GSM Pure 100% Cotton", "Structured neckline", "Easy everyday drape"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    bestSeller: true,
    badge: "Signature",
  },
  {
    id: 2,
    title: "Plain Black T-shirt for Mens",
    slug: "plain-black-t-shirt-for-mens",
    price: 349,
    type: "fashion",
    category: "basics",
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    material: "100% Cotton",
    images: [
      "/products/media/mens-black-t-shirt01.webp",
      "/products/media/mens-black-t-shirt02.webp",
    ],
    description: "A minimal black tee with a closer fit, soft hand-feel, and clean daily utility.",
    summary: "A minimal black tee with a closer fit, soft hand-feel, and clean daily utility.",
    highlights: ["Soft stretch", "Clean shoulder line", "Layering-ready"],
    shippingLeadTime: "Dispatches within 48 hours",
    bestSeller: true,
    badge: "Bestseller",
  }, {
    id: 3,
    title: "Green T-shirt for Men",
    slug: "green-t-shirt-for-men",
    price: 349,
    type: "fashion",
    category: "oversized",
    sizes: ["M", "L", "XL"],
    colors: ["Green"],
    material: "100% Cotton",
    images: [
      "/products/media/green-men-tshirt-01.webp",
      "/products/media/green-men-tshirt-02.webp",
    ],
    description: " ",
    summary: "Bold oversized tee built for everyday movement.",
    highlights: ["180 GSM Pure 100% Cotton", "Structured neckline", "Easy everyday drape"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    bestSeller: true,
    badge: "New Drop",
  },
  {
    id: 4,
    title: "Maroon T-shirt for Men",
    slug: "maroon-t-shirt-for-men",
    price: 349,
    mrp: 958,
    type: "fashion",
    category: "oversized",
    sizes: ["M", "L", "XL"],
    colors: ["Maroon"],
    material: "100% Cotton",
    images: [
      "/products/media/maroon-mens-tshirt-01.webp",
    ],
    description: "A rich maroon tee with a calm oversized shape and premium everyday finish.",
    summary: "Rich maroon tee with a clean relaxed fit.",
    highlights: ["180 GSM Pure 100% Cotton", "Relaxed fit", "Ribbed collar"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    bestSeller: true,
    badge: "Limited Edition",
  },
  {
    id: 101,
    title: "Radha Krishna Photo Frame | Home Decor |  12x18 inch",
    slug: "12x18-photo-frame",
    price: 399,
    type: "decor",
    category: "frames",
    style: "Minimal",
    material: "Wood",
    images: [
      "/home_decor/Frame-01/01.jpg",
    ],
    description: "A balanced wall piece with quiet geometry and enough presence to anchor a room.",
    summary: "Modern wall art with restrained proportion and soft contrast.",
    highlights: ["Matte finish", "Lightweight mount", "Modern graphic system"],
    shippingLeadTime: "Dispatches within 2-3 days",
    newDrop: true,
  },
  {
    id: 102,
    title: "Radha Krishna Photo Frame | Home Decor |  12x18 inch",
    slug: "12x18-photo-frame-new",
    price: 499,
    type: "decor",
    category: "frames",
    style: "Modern",
    material: "Wood",
    images: [
      "/home_decor/Frame-02/01.jpg",
    ],
    description: "A balanced wall piece with quiet geometry and enough presence to anchor a room.",
    summary: "Modern wall art with restrained proportion and soft contrast.",
    highlights: ["Matte finish", "Lightweight mount", "Modern graphic system"],
    shippingLeadTime: "Dispatches within 2-3 days",
    newDrop: true,
  },
  {
    id: 103,
    title: "Photo Frame | Home Decor |  12x18 inch",
    slug: "photo-frame-new",
    price: 499,
    type: "decor",
    category: "frames",
    style: "Modern",
    material: "Wood",
    images: [
      "/home_decor/Frame-02/01.jpg",
      "/home_decor/Frame-02/02.jpg",
      "/home_decor/Frame-02/03.jpg",
      "/home_decor/Frame-02/04.jpg",
    ],
    description: "A balanced wall piece with quiet geometry and enough presence to anchor a room.",
    summary: "Modern wall art with restrained proportion and soft contrast.",
    highlights: ["Matte finish", "Lightweight mount", "Modern graphic system"],
    shippingLeadTime: "Dispatches within 2-3 days",
    newDrop: true,
  },
  {
    id: 104,
    title: "Frame | Home Decor | 12x18 inch",
    slug: "wood-frame",
    price: 349,
    type: "decor",
    category: "frames",
    style: "Minimal",
    material: "Wood",
    images: [
      "/home_decor/last01.jpg",
      "/home_decor/last02.jpg",
      "/home_decor/last03.jpg",
      "/home_decor/last04.jpg",
    ],
    "description": "A slim wood frame designed to bring structure and warmth to calm everyday spaces.",
    "summary": "Slim wood framing for shelves, desks, and quiet walls.",
    highlights: ["Hand-finished surface", "Compact footprint", "Works solo or grouped"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    newDrop: true,
  },
];

export const products: Product[] = ENABLE_HOME_DECOR
  ? allProducts
  : allProducts.filter((p) => p.type !== "decor");

export const productCategories = ["oversized", "basics", "outerwear"] as ProductCategory[];
export const decorCategories = ["frames", "wall-art", "table-decor"] as ProductCategory[];

export const productCategoryOptions: ProductCategoryOption[] = productCategories.map((value) => ({
  value,
  label: categoryLabels[value],
  description: categoryDescriptions[value],
}));

export const decorCategoryOptions: ProductCategoryOption[] = ENABLE_HOME_DECOR
  ? decorCategories.map((value) => ({
    value,
    label: categoryLabels[value],
    description: categoryDescriptions[value],
  }))
  : [];

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

export const productSizes = Array.from(
  new Set(products.filter((product) => product.type === "fashion").flatMap((product) => product.sizes ?? [])),
).sort((left, right) => sizeOrder.indexOf(left) - sizeOrder.indexOf(right));

export const getCategoryLabel = (category: ProductCategory | string) =>
  categoryLabels[category as ProductCategory] ?? category;

export const getColorLabel = (color: string) => color;

export const getProductBySlug = (slug: string, source: Product[] = products) =>
  source.find((product) => product.slug === slug);

export const getRelatedProducts = (slug: string, category: ProductCategory, limit = 4, source: Product[] = products) =>
  source
    .filter((product) => product.slug !== slug && product.category === category)
    .slice(0, limit);

export const getFeaturedProducts = (limit = 15, type?: ProductType, source: Product[] = products) =>
  source
    .filter((product) => product.featured && (!type || product.type === type))
    .slice(0, limit);

export const getBestSellerProducts = (limit = 6, type: ProductType = "fashion", source: Product[] = products) =>
  source
    .filter((product) => product.bestSeller && product.type === type)
    .slice(0, limit);

export const getNewDropProducts = (limit = 6, type: ProductType = "fashion", source: Product[] = products) =>
  source
    .filter((product) => product.newDrop && product.type === type)
    .slice(0, limit);

export const getFallbackProducts = (limit = 4, type?: ProductType, source: Product[] = products) => {
  const scoped = type ? source.filter((product) => product.type === type) : source;
  const featured = scoped.filter((product) => product.featured).slice(0, limit);
  return featured.length ? featured : scoped.slice(0, limit);
};

export const filterProducts = (items: Product[], filters: ProductFilters) =>
  items
    .filter((product) => product.type === "fashion")
    .filter(
      (product) =>
        (filters.category === "all" || product.category === filters.category) &&
        (filters.size === "all" || (product.sizes ?? []).includes(filters.size)),
    );

export const normalizeProductCategory = (
  value: string | string[] | null | undefined,
): ProductCategory | "all" => {
  if (typeof value !== "string") return "all";
  return productCategories.includes(value as ProductCategory) ? (value as ProductCategory) : "all";
};

export const normalizeProductSize = (value: string | string[] | null | undefined) => {
  if (typeof value !== "string") return "all";
  return productSizes.includes(value) ? value : "all";
};
