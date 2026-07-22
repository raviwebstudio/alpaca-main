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

export const products: Product[] = [
  {
    id: 1,
    title: "Plain White T-shirt for Mens",
    slug: "plain-white-t-shirt-for-mens",
    price: 490,
    type: "fashion",
    category: "oversized",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Warm Sand", "Black", "Soft Ivory"],
    material: "100% heavyweight cotton",
    images: [
      "/inventory/men/tshirts/plain-white-t-shirt01.jpg",
      "/inventory/men/tshirts/plain-white-t-shirt02.webp",
      "/inventory/men/tshirts/plain-white-t-shirt03.jpg",
    ],
    description: "A clean heavyweight cotton tee with a calm oversized shape and premium everyday finish.",
    summary: "A dense oversized tee built for everyday rotation and clean structure.",
    highlights: ["240 GSM knit", "Structured neckline", "Easy everyday drape"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    bestSeller: true,
  },
  {
    id: 2,
    title: "Plain Black T-shirt for Mens",
    slug: "plain-black-t-shirt-for-mens",
    price: 490,
    type: "fashion",
    category: "basics",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    material: "95% cotton, 5% elastane rib",
    images: [
      "/inventory/men/tshirts/mens-black-t-shirt01.webp",
      "/inventory/men/tshirts/mens-black-t-shirt02.webp",
    ],
    description: "A minimal black tee with a closer fit, soft hand-feel, and clean daily utility.",
    summary: "A close-fit tee designed for layering, warm days, and a cleaner line.",
    highlights: ["Soft stretch", "Clean shoulder line", "Layering-ready"],
    shippingLeadTime: "Dispatches within 48 hours",
    bestSeller: true,
  }, {
    id: 3,
    title: "Green T-shirt for Men",
    slug: "green-t-shirt-for-men",
    price: 599,
    type: "fashion",
    category: "oversized",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Warm Sand", "Black", "Soft Ivory"],
    material: "100% heavyweight cotton",
    images: [
      "/inventory/men/tshirts/green-men-tshirt-01.webp",
      "/inventory/men/tshirts/green-men-tshirt-02.webp",
    ],
    description: "A clean heavyweight cotton tee with a calm oversized shape and premium everyday finish.",
    summary: "A dense oversized tee built for everyday rotation and clean structure.",
    highlights: ["240 GSM knit", "Structured neckline", "Easy everyday drape"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    bestSeller: true,
  },
  {
    id: 4,
    title: "Men's Grey T-shirt",
    slug: "mens-grey-t-shirt",
    price: 599,
    type: "fashion",
    category: "basics",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    material: "95% cotton, 5% elastane rib",
    images: [
      "/inventory/men/tshirts/grey-mens-tshirt-01.webp",
      "/inventory/men/tshirts/grey-mens-tshirt-02.webp",
      "/inventory/men/tshirts/grey-mens-tshirt-03.webp",
    ],
    description: "A minimal black tee with a closer fit, soft hand-feel, and clean daily utility.",
    summary: "A close-fit tee designed for layering, warm days, and a cleaner line.",
    highlights: ["Soft stretch", "Clean shoulder line", "Layering-ready"],
    shippingLeadTime: "Dispatches within 48 hours",
    bestSeller: true,
  },

  {
    id: 101,
    title: "Radha Krishna Photo Frame | Home Decor |  12x18 inch",
    slug: "12x18-photo-frame",
    price: 399,
    type: "decor",
    category: "frames",
    material: "Wood",
    style: "Minimal",
    images: [
      "/home_decor/Frame-01/01.jpg",
      "/home_decor/Frame-01/02.jpg",
      "/home_decor/Frame-01/03.jpg",
      "/home_decor/Frame-01/04.jpg",
      "/home_decor/last01.jpg",
      "/home_decor/last02.jpg",
      "/home_decor/last03.jpg",
      "/home_decor/last04.jpg",
    ],
    description: "A slim wood frame designed to bring structure and warmth to calm everyday spaces.",
    summary: "Slim wood framing for shelves, desks, and quiet walls.",
    highlights: ["Hand-finished edge", "Portrait or landscape use", "Ready for modern rooms"],
    shippingLeadTime: "Dispatches within 48 hours",
    featured: true,
    bestSeller: true,
  },
  {
    id: 102,
    title: "Radha Krishna Photo Frame | Home Decor |  12x18 inch",
    slug: "radha-krishna-photo-frame",
    price: 399,
    type: "decor",
    category: "frames",
    material: "Wood",
    style: "Minimal",
    images: [
      "/home_decor/Frame-02/01.jpg",
      "/home_decor/Frame-02/02.jpg",
      "/home_decor/Frame-02/03.jpg",
      "/home_decor/Frame-02/04.jpg",
      "/home_decor/last01.jpg",
      "/home_decor/last02.jpg",
      "/home_decor/last03.jpg",
      "/home_decor/last04.jpg",
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
    slug: "12x18-photo-frame",
    price: 399,
    type: "decor",
    category: "frames",
    material: "Wood",
    style: "Minimal",
    images: [
      "/home_decor/Frame-03/01.jpg",
      "/home_decor/Frame-03/02.jpg",
      "/home_decor/Frame-03/03.jpg",
      "/home_decor/Frame-03/04.jpg",
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

export const productCategories = ["oversized", "basics", "outerwear"] as ProductCategory[];
export const decorCategories = ["frames", "wall-art", "table-decor"] as ProductCategory[];

export const productCategoryOptions: ProductCategoryOption[] = productCategories.map((value) => ({
  value,
  label: categoryLabels[value],
  description: categoryDescriptions[value],
}));

export const decorCategoryOptions: ProductCategoryOption[] = decorCategories.map((value) => ({
  value,
  label: categoryLabels[value],
  description: categoryDescriptions[value],
}));

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

export const productSizes = Array.from(
  new Set(products.filter((product) => product.type === "fashion").flatMap((product) => product.sizes ?? [])),
).sort((left, right) => sizeOrder.indexOf(left) - sizeOrder.indexOf(right));

export const getCategoryLabel = (category: ProductCategory | string) =>
  categoryLabels[category as ProductCategory] ?? category;

export const getColorLabel = (color: string) => color;

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getRelatedProducts = (slug: string, category: ProductCategory, limit = 4) =>
  products
    .filter((product) => product.slug !== slug && product.category === category)
    .slice(0, limit);

export const getFeaturedProducts = (limit = 15, type?: ProductType) =>
  products
    .filter((product) => product.featured && (!type || product.type === type))
    .slice(0, limit);

export const getBestSellerProducts = (limit = 6, type: ProductType = "fashion") =>
  products
    .filter((product) => product.bestSeller && product.type === type)
    .slice(0, limit);

export const getNewDropProducts = (limit = 6, type: ProductType = "fashion") =>
  products
    .filter((product) => product.newDrop && product.type === type)
    .slice(0, limit);

export const getFallbackProducts = (limit = 4, type?: ProductType) => {
  const scoped = type ? products.filter((product) => product.type === type) : products;
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
