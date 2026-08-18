import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const productsDir = path.join(contentDir, "products");
const categoriesDir = path.join(contentDir, "categories");
const ordersDir = path.join(contentDir, "orders");
const customersDir = path.join(contentDir, "customers");
const couponsDir = path.join(contentDir, "coupons");
const mediaDir = path.join(rootDir, "public", "products", "media");

// Ensure all directories exist
[productsDir, categoriesDir, ordersDir, customersDir, couponsDir, mediaDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log("✓ Directory structure initialized under content/ and public/products/media");

// 1. Seed Categories
const initialCategories = [
  {
    id: "cat-oversized",
    name: "Oversized",
    slug: "oversized",
    description: "Relaxed silhouettes with premium heavyweight cotton",
    image: "/assets/images/portrait-03.webp",
    type: "fashion",
    displayOrder: 1,
  },
  {
    id: "cat-basics",
    name: "Basics",
    slug: "basics",
    description: "Closer-to-body everyday essentials designed for repeat wear",
    image: "/assets/images/plain-clothing02.jpg",
    type: "fashion",
    displayOrder: 2,
  },
  {
    id: "cat-outerwear",
    name: "Outerwear",
    slug: "outerwear",
    description: "Layering pieces for commute, travel, and changing weather",
    image: "/assets/images/plain-clothing01.jpg",
    type: "fashion",
    displayOrder: 3,
  },
  {
    id: "cat-frames",
    name: "Frames",
    slug: "frames",
    description: "Structured frames for shelves, desks, and calm wall systems",
    image: "/home_decor/frames/vintage-frame.webp",
    type: "decor",
    displayOrder: 4,
  },
  {
    id: "cat-wall-art",
    name: "Wall Art",
    slug: "wall-art",
    description: "Quiet graphic pieces designed to anchor modern rooms",
    image: "/home_decor/frames/minimal-wood-frame.webp",
    type: "decor",
    displayOrder: 5,
  },
  {
    id: "cat-table-decor",
    name: "Table Decor",
    slug: "table-decor",
    description: "Small objects that bring function and stillness to daily spaces",
    image: "/home_decor/frames/acrylic-modern-frame.webp",
    type: "decor",
    displayOrder: 6,
  },
];

initialCategories.forEach((cat) => {
  const filePath = path.join(categoriesDir, `${cat.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cat, null, 2), "utf-8");
});
console.log(`✓ Seeded ${initialCategories.length} categories to content/categories/`);

// 2. Read products from data/products.json or data/products.ts
let rawProducts = [];
try {
  const pPath = path.join(rootDir, "data", "products.json");
  if (fs.existsSync(pPath)) {
    rawProducts = JSON.parse(fs.readFileSync(pPath, "utf-8"));
  }
} catch (e) {
  console.warn("Could not read data/products.json, using fallback array");
}

if (!rawProducts || rawProducts.length === 0) {
  rawProducts = [
    {
      id: 1,
      title: "Plain White T-shirt for Mens",
      slug: "plain-white-t-shirt-for-mens",
      price: 490,
      mrp: 999,
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
      mrp: 999,
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
      featured: true,
      newDrop: true,
    },
    {
      id: 3,
      title: "Green T-shirt for Men",
      slug: "green-t-shirt-for-men",
      price: 490,
      mrp: 999,
      type: "fashion",
      category: "oversized",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Moss Green", "Olive", "Forest"],
      material: "100% combed cotton",
      images: [
        "/inventory/men/tshirts/mens-green-t-shirt01.webp",
        "/inventory/men/tshirts/mens-green-t-shirt02.webp",
      ],
      description: "An earthy tone tee with an understated drape and relaxed collar construction.",
      summary: "Subtle olive wash on heavy jersey.",
      highlights: ["Garment-dyed wash", "Relaxed fit", "Ribbed collar"],
      shippingLeadTime: "Dispatches within 48 hours",
      bestSeller: true,
    },
    {
      id: 4,
      title: "Vintage Archival Wooden Frame",
      slug: "vintage-archival-wooden-frame",
      price: 1899,
      mrp: 2499,
      type: "decor",
      category: "frames",
      sizes: ["8x10", "12x16", "16x20"],
      colors: ["Dark Walnut", "Natural Oak"],
      material: "Solid Teakwood & Museum Glass",
      images: [
        "/home_decor/frames/vintage-frame.webp",
      ],
      description: "Solid wood frame crafted for gallery wall longevity with non-glare museum glass.",
      summary: "Artisan wood frame for prints and photographs.",
      highlights: ["Solid Teak", "Museum-grade UV protection", "Wall mount hardware included"],
      shippingLeadTime: "Dispatches within 24 hours",
      featured: true,
      bestSeller: true,
    }
  ];
}

rawProducts.forEach((p, idx) => {
  const slug = p.slug || `product-${p.id || idx + 1}`;
  const sizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL"];
  
  // Normalize colors to array of objects with name and hex
  let rawColors = Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["Standard"];
  const normalizedColors = rawColors.map((c) => {
    if (typeof c === "string") {
      const name = c;
      const lower = name.toLowerCase();
      const hex = lower.includes("black") ? "#111111" : lower.includes("white") ? "#FFFFFF" : lower.includes("green") ? "#4A5D4E" : lower.includes("sand") ? "#D1C4A5" : "#D2C2B2";
      return { name, hex };
    }
    return {
      name: c.name || "Standard",
      hex: c.hex || "#111111",
    };
  });

  // Normalize images to array of string paths
  let rawImages = Array.isArray(p.images) ? p.images : [];
  const normalizedImages = rawImages.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean);

  const price = typeof p.price === "number" ? p.price : 490;
  const mrp = p.mrp || p.comparePrice || Math.round(price * 1.6);
  const baseSku = p.sku || `ALP-${(p.category || "GEN").toUpperCase().slice(0, 3)}-${String(p.id || idx + 1).padStart(3, "0")}`;

  // Generate color + size variant matrix
  const variants = [];
  normalizedColors.forEach((colorObj) => {
    sizes.forEach((size) => {
      const colorCode = colorObj.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) || "STD";
      const variantSku = `${baseSku}-${colorCode}-${size}`;
      variants.push({
        sku: variantSku,
        size,
        color: colorObj.name,
        colorHex: colorObj.hex,
        price,
        mrp,
        stock: 25,
        image: normalizedImages[0] || "",
      });
    });
  });

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  const productDoc = {
    id: p.id || idx + 1,
    title: p.title || p.name || "Alpaca Product",
    slug,
    price,
    mrp,
    stock: totalStock,
    lowStockThreshold: 10,
    sku: baseSku,
    category: p.category || "oversized",
    type: p.type || "fashion",
    status: p.status || "published",
    sizes,
    colors: normalizedColors.map((c) => c.name),
    variants,
    images: normalizedImages,
    description: p.description || "Premium artisan craft item.",
    summary: p.summary || p.description || "",
    highlights: Array.isArray(p.highlights) ? p.highlights : ["Premium Quality", "Artisan Finished"],
    material: p.material || "100% Premium Cotton",
    shippingLeadTime: p.shippingLeadTime || "Dispatches in 24-48 hours",
    featured: Boolean(p.featured),
    bestSeller: Boolean(p.bestSeller),
    newDrop: Boolean(p.newDrop),
    seo: {
      metaTitle: `${p.title || "Alpaca Product"} | ALPAZA Luxury Essentials`,
      metaDescription: p.summary || p.description || "Discover minimalist luxury essentials by ALPAZA.",
      keywords: ["alpaca", p.category || "apparel", "luxury", "minimalist"].filter(Boolean),
    },
    updatedAt: new Date().toISOString(),
  };

  const filePath = path.join(productsDir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(productDoc, null, 2), "utf-8");
});
console.log(`✓ Seeded ${rawProducts.length} products to content/products/ with variants, SKU, MRP, and SEO schemas.`);

// 3. Seed Orders & Customers from data/orders.json
let rawOrders = [];
try {
  const oPath = path.join(rootDir, "data", "orders.json");
  if (fs.existsSync(oPath)) {
    rawOrders = JSON.parse(fs.readFileSync(oPath, "utf-8"));
  }
} catch (e) {
  console.warn("Could not read data/orders.json");
}

const customerMap = new Map();

rawOrders.forEach((o) => {
  const orderId = o.orderId || `ALP-${Date.now().toString().slice(-6)}`;
  const orderDoc = {
    orderId,
    placedAt: o.placedAt || new Date().toISOString(),
    customer: {
      name: o.address?.name || "Customer",
      email: o.address?.email || "",
      phone: o.address?.phone || "",
    },
    address: o.address || {},
    items: o.items || [],
    subtotal: o.subtotal || 0,
    shipping: o.shipping || 0,
    discount: o.discount || 0,
    total: o.total || 0,
    paymentMethod: o.paymentMethod || "UPI",
    paymentStatus: o.paymentStatus || "CONFIRMED",
    orderStatus: o.orderStatus || "PLACED",
    sheetSynced: Boolean(o.sheetSynced),
    sheetSyncError: o.sheetSyncError || null,
    sheetSyncTimestamp: o.sheetSyncTimestamp || null,
    trackingNumber: o.trackingNumber || null,
    notes: o.notes || null,
  };

  const filePath = path.join(ordersDir, `${orderId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(orderDoc, null, 2), "utf-8");

  // Track customer
  const phone = o.address?.phone || "UNKNOWN";
  if (phone !== "UNKNOWN") {
    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        id: `cust-${phone}`,
        name: o.address?.name || "Customer",
        email: o.address?.email || "",
        phone: o.address?.phone || "",
        address: o.address?.address || "",
        city: o.address?.city || "",
        state: o.address?.state || "",
        pincode: o.address?.pincode || "",
        totalSpent: 0,
        ordersCount: 0,
        createdAt: o.placedAt || new Date().toISOString(),
      });
    }
    const cust = customerMap.get(phone);
    cust.totalSpent += o.total || 0;
    cust.ordersCount += 1;
  }
});
console.log(`✓ Seeded ${rawOrders.length} orders to content/orders/`);

customerMap.forEach((cust, phone) => {
  const filePath = path.join(customersDir, `cust-${phone}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cust, null, 2), "utf-8");
});
console.log(`✓ Seeded ${customerMap.size} customers to content/customers/`);

// 4. Seed Coupons
const initialCoupons = [
  {
    code: "ALPACA10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    expiresAt: "2026-12-31T23:59:59.000Z",
    isActive: true,
    usageLimit: 500,
    usageCount: 42,
    description: "10% off on all orders above ₹999",
  },
  {
    code: "WELCOME500",
    discountType: "fixed",
    discountValue: 500,
    minOrderValue: 2499,
    maxDiscount: 500,
    expiresAt: "2026-12-31T23:59:59.000Z",
    isActive: true,
    usageLimit: 200,
    usageCount: 18,
    description: "Flat ₹500 off on first orders above ₹2,499",
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 249,
    minOrderValue: 1499,
    maxDiscount: 249,
    expiresAt: "2026-12-31T23:59:59.000Z",
    isActive: true,
    usageLimit: 1000,
    usageCount: 65,
    description: "Free shipping voucher on orders above ₹1,499",
  },
];

initialCoupons.forEach((coupon) => {
  const filePath = path.join(couponsDir, `${coupon.code}.json`);
  fs.writeFileSync(filePath, JSON.stringify(coupon, null, 2), "utf-8");
});
console.log(`✓ Seeded ${initialCoupons.length} coupons to content/coupons/`);

console.log("\n=======================================================");
console.log("🎉 ALL CONTENT INITIALIZATION COMPLETED SUCCESSFULLY!");
console.log("=======================================================");
