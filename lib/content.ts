import fs from "fs";
import path from "path";

// Types
export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  mrp?: number;
  stock: number;
  image?: string;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
}

export interface ContentProduct {
  id: number | string;
  title: string;
  slug: string;
  price: number;
  mrp?: number;
  stock: number;
  lowStockThreshold?: number;
  sku: string;
  category: string;
  type: "fashion" | "decor";
  status: "published" | "draft";
  sizes?: string[];
  colors?: string[];
  variants: ProductVariant[];
  images: string[];
  description: string;
  summary?: string;
  highlights?: string[];
  material?: string;
  shippingLeadTime?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newDrop?: boolean;
  seo?: ProductSEO;
  updatedAt?: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  type: "fashion" | "decor";
  displayOrder: number;
}

export interface ContentOrder {
  orderId: string;
  placedAt: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  address: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    productId?: string | number;
    title: string;
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  sheetSynced?: boolean;
  sheetSyncError?: string | null;
  sheetSyncTimestamp?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
}

export interface ContentCustomer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

export interface ContentCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  description?: string;
}

export interface InventoryItem {
  id: string;
  productTitle: string;
  productSlug: string;
  sku: string;
  category: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  mrp?: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  image?: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  totalInventoryUnits: number;
  lowStockCount: number;
  recentOrders: ContentOrder[];
  ordersByStatus: Record<string, number>;
  categoryBreakdown: Array<{ category: string; count: number; revenue: number }>;
  ordersByDay?: Array<{ date: string; orders: number; revenue: number }>;
  topProducts?: any[];
  lowStockProducts?: any[];
}

// Directory Paths
const contentDir = path.join(process.cwd(), "content");
const productsDir = path.join(contentDir, "products");
const categoriesDir = path.join(contentDir, "categories");
const ordersDir = path.join(contentDir, "orders");
const customersDir = path.join(contentDir, "customers");
const couponsDir = path.join(contentDir, "coupons");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonFiles<T>(dir: string): T[] {
  ensureDir(dir);
  try {
    const files = fs.readdirSync(dir);
    const results: T[] = [];
    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const raw = fs.readFileSync(path.join(dir, file), "utf-8");
          results.push(JSON.parse(raw) as T);
        } catch (e) {
          console.warn(`[ContentLayer] Error parsing ${file}:`, e);
        }
      }
    }
    return results;
  } catch (e) {
    console.error(`[ContentLayer] Error reading directory ${dir}:`, e);
    return [];
  }
}

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------

export function getContentProducts(): ContentProduct[] {
  const products = readJsonFiles<ContentProduct>(productsDir);
  if (products.length > 0) {
    return products.sort((a, b) => Number(a.id) - Number(b.id));
  }

  // Fallback to data/products.json if content/ is not yet populated
  try {
    const fallbackPath = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(fallbackPath)) {
      const fallbackRaw = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
      return fallbackRaw as ContentProduct[];
    }
  } catch {}

  return [];
}

export function getContentProductBySlug(slug: string): ContentProduct | null {
  const filePath = path.join(productsDir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentProduct;
    } catch {}
  }
  const all = getContentProducts();
  return all.find((p) => p.slug === slug) || null;
}

export function getContentProductById(id: number | string): ContentProduct | null {
  const all = getContentProducts();
  return all.find((p) => String(p.id) === String(id)) || null;
}

export function saveContentProduct(product: ContentProduct): void {
  ensureDir(productsDir);
  const slug = product.slug || `product-${product.id}`;
  const filePath = path.join(productsDir, `${slug}.json`);
  
  // Compute total stock from variants if available
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  }
  product.updatedAt = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(product, null, 2), "utf-8");

  // Keep data/products.json mirrored for backward compatibility
  try {
    const all = getContentProducts();
    const legacyPath = path.join(process.cwd(), "data", "products.json");
    fs.writeFileSync(legacyPath, JSON.stringify(all, null, 2), "utf-8");
  } catch {}
}

export function deleteContentProduct(slugOrId: string | number): boolean {
  ensureDir(productsDir);
  const prod = typeof slugOrId === "number" ? getContentProductById(slugOrId) : (getContentProductBySlug(String(slugOrId)) || getContentProductById(slugOrId));
  if (!prod) return false;

  const filePath = path.join(productsDir, `${prod.slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------

export function getContentCategories(): ContentCategory[] {
  const cats = readJsonFiles<ContentCategory>(categoriesDir);
  return cats.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export function getContentCategoryBySlug(slug: string): ContentCategory | null {
  const filePath = path.join(categoriesDir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentCategory;
    } catch {}
  }
  return getContentCategories().find((c) => c.slug === slug) || null;
}

export function saveContentCategory(category: ContentCategory): void {
  ensureDir(categoriesDir);
  const filePath = path.join(categoriesDir, `${category.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(category, null, 2), "utf-8");
}

// -------------------------------------------------------------
// ORDERS
// -------------------------------------------------------------

export function getContentOrders(): ContentOrder[] {
  const orders = readJsonFiles<ContentOrder>(ordersDir);
  return orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
}

export function getContentOrderById(orderId: string): ContentOrder | null {
  const filePath = path.join(ordersDir, `${orderId}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentOrder;
    } catch {}
  }
  return getContentOrders().find((o) => o.orderId === orderId) || null;
}

export function saveContentOrder(order: ContentOrder): void {
  ensureDir(ordersDir);
  const filePath = path.join(ordersDir, `${order.orderId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(order, null, 2), "utf-8");

  // Also record customer profile
  if (order.customer && order.customer.phone) {
    const phone = order.customer.phone;
    const custId = `cust-${phone.replace(/[^0-9]/g, "")}`;
    const custFilePath = path.join(customersDir, `${custId}.json`);
    
    let cust: ContentCustomer = {
      id: custId,
      name: order.customer.name || "Customer",
      email: order.customer.email || "",
      phone,
      address: order.address?.address || "",
      city: order.address?.city || "",
      state: order.address?.state || "",
      pincode: order.address?.pincode || "",
      totalSpent: order.total || 0,
      ordersCount: 1,
      createdAt: order.placedAt || new Date().toISOString(),
    };

    if (fs.existsSync(custFilePath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(custFilePath, "utf-8")) as ContentCustomer;
        cust = {
          ...existing,
          name: order.customer.name || existing.name,
          email: order.customer.email || existing.email,
          totalSpent: (existing.totalSpent || 0) + (order.total || 0),
          ordersCount: (existing.ordersCount || 0) + 1,
        };
      } catch {}
    }
    ensureDir(customersDir);
    fs.writeFileSync(custFilePath, JSON.stringify(cust, null, 2), "utf-8");
  }
}

export function updateContentOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  notes?: string
): ContentOrder | null {
  const order = getContentOrderById(orderId);
  if (!order) return null;

  order.orderStatus = status;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (notes !== undefined) order.notes = notes;

  saveContentOrder(order);
  return order;
}

// -------------------------------------------------------------
// CUSTOMERS
// -------------------------------------------------------------

export function getContentCustomers(): ContentCustomer[] {
  const customers = readJsonFiles<ContentCustomer>(customersDir);
  return customers.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
}

export function getContentCustomerById(id: string): ContentCustomer | null {
  const filePath = path.join(customersDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentCustomer;
    } catch {}
  }
  return getContentCustomers().find((c) => c.id === id) || null;
}

// -------------------------------------------------------------
// COUPONS
// -------------------------------------------------------------

export function getContentCoupons(): ContentCoupon[] {
  const coupons = readJsonFiles<ContentCoupon>(couponsDir);
  return coupons.sort((a, b) => a.code.localeCompare(b.code));
}

export function getContentCouponByCode(code: string): ContentCoupon | null {
  const upper = code.trim().toUpperCase();
  const filePath = path.join(couponsDir, `${upper}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentCoupon;
    } catch {}
  }
  return getContentCoupons().find((c) => c.code.toUpperCase() === upper) || null;
}

export function saveContentCoupon(coupon: ContentCoupon): void {
  ensureDir(couponsDir);
  const code = coupon.code.trim().toUpperCase();
  coupon.code = code;
  const filePath = path.join(couponsDir, `${code}.json`);
  fs.writeFileSync(filePath, JSON.stringify(coupon, null, 2), "utf-8");
}

export function deleteContentCoupon(code: string): boolean {
  ensureDir(couponsDir);
  const upper = code.trim().toUpperCase();
  const filePath = path.join(couponsDir, `${upper}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// INVENTORY CONTROL
// -------------------------------------------------------------

export function getInventoryItems(): InventoryItem[] {
  const products = getContentProducts();
  const items: InventoryItem[] = [];

  products.forEach((p) => {
    const threshold = p.lowStockThreshold || 10;

    if (Array.isArray(p.variants) && p.variants.length > 0) {
      p.variants.forEach((v) => {
        const stock = Number(v.stock) || 0;
        items.push({
          id: `${p.slug}_${v.sku || v.size + "_" + v.color}`,
          productTitle: p.title,
          productSlug: p.slug,
          sku: v.sku || `${p.sku}-${v.size}`,
          category: p.category,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          price: v.price || p.price,
          mrp: v.mrp || p.mrp,
          stock,
          lowStockThreshold: threshold,
          isLowStock: stock > 0 && stock <= threshold,
          isOutOfStock: stock <= 0,
          image: v.image || (p.images && p.images[0]) || "",
        });
      });
    } else {
      const stock = Number(p.stock) || 0;
      items.push({
        id: `${p.slug}_main`,
        productTitle: p.title,
        productSlug: p.slug,
        sku: p.sku,
        category: p.category,
        size: "Standard",
        color: "Standard",
        price: p.price,
        mrp: p.mrp,
        stock,
        lowStockThreshold: threshold,
        isLowStock: stock > 0 && stock <= threshold,
        isOutOfStock: stock <= 0,
        image: (p.images && p.images[0]) || "",
      });
    }
  });

  return items;
}

export function updateVariantStock(
  productSlug: string,
  variantSku: string,
  newStock: number
): boolean {
  const product = getContentProductBySlug(productSlug);
  if (!product) return false;

  let updated = false;
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const target = product.variants.find((v) => v.sku === variantSku);
    if (target) {
      target.stock = Math.max(0, newStock);
      updated = true;
    }
  }

  if (!updated && product.sku === variantSku) {
    product.stock = Math.max(0, newStock);
    updated = true;
  }

  if (updated) {
    saveContentProduct(product);
  }

  return updated;
}

// -------------------------------------------------------------
// ANALYTICS SUMMARY
// -------------------------------------------------------------

export function getAnalyticsSummary(): AnalyticsSummary {
  const orders = getContentOrders();
  const products = getContentProducts();
  const customers = getContentCustomers();
  const inventory = getInventoryItems();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalInventoryUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventory.filter((item) => item.isLowStock || item.isOutOfStock).length;

  const ordersByStatus: Record<string, number> = {
    PLACED: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  orders.forEach((o) => {
    const status = (o.orderStatus || "PLACED").toUpperCase();
    ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
  });

  const categoryMap = new Map<string, { count: number; revenue: number }>();
  products.forEach((p) => {
    if (!categoryMap.has(p.category)) {
      categoryMap.set(p.category, { count: 0, revenue: 0 });
    }
    categoryMap.get(p.category)!.count += 1;
  });

  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const prod = products.find((p) => String(p.id) === String(item.productId) || p.title === item.title);
      if (prod && categoryMap.has(prod.category)) {
        categoryMap.get(prod.category)!.revenue += item.price * (item.quantity || 1);
      }
    });
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    count: stats.count,
    revenue: stats.revenue,
  }));

  const lowStockProducts = inventory.filter((item) => item.isLowStock || item.isOutOfStock);

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalProducts: products.length,
    totalCustomers: customers.length,
    totalInventoryUnits,
    lowStockCount,
    recentOrders: orders.slice(0, 8),
    ordersByStatus,
    categoryBreakdown,
    ordersByDay: [],
    topProducts: products.slice(0, 5),
    lowStockProducts,
  };
}
