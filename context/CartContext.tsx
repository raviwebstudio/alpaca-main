"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  productId: number;
  sellerId: string;
  sellerName: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  colorHex: string;
  quantity: number;
};

export type CheckoutAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type PaymentMethod = "upi" | "card" | "netbanking";

export type OrderRecord = {
  reference: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  placedAt: string;
  sheetSynced?: boolean;
  sheetSyncStatus?: "synced" | "failed" | "pending";
  sheetSyncError?: string | null;
  paymentStatus?: string;
  orderStatus?: string;
};

export type CheckoutOverrides = {
  address?: CheckoutAddress;
  paymentMethod?: PaymentMethod;
  turnstileToken?: string;
};

type CartProductInput = Omit<CartItem, "id" | "quantity">;

type CartContextValue = {
  hydrated: boolean;
  items: CartItem[];
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  totalPrice: number;
  checkoutAddress: CheckoutAddress;
  paymentMethod: PaymentMethod;
  lastOrder: OrderRecord | null;
  addItem: (item: CartProductInput) => void;
  addToCart: (item: CartProductInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (
    oldId: string,
    updates: { size?: string; color?: string; colorHex?: string }
  ) => void;
  removeItem: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  saveCheckoutAddress: (address: CheckoutAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  completeOrder: (overrides?: CheckoutOverrides) => OrderRecord | null;
  submitOrder: (overrides?: CheckoutOverrides) => Promise<OrderRecord | null>;
  clearLastOrder: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "alpaca_cart";
const LAST_ORDER_KEY = "alpaca_last_order";

const DEFAULT_ADDRESS: CheckoutAddress = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const getShipping = (subtotal: number, itemCount: number) =>
  subtotal >= 4999 ? 0 : itemCount ? 249 : 0;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutAddress, setCheckoutAddress] = useState<CheckoutAddress>(DEFAULT_ADDRESS);
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>("upi");
  const [lastOrder, setLastOrderState] = useState<OrderRecord | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const setLastOrder = (order: OrderRecord | null) => {
    setLastOrderState(order);
    try {
      if (order) {
        localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      } else {
        localStorage.removeItem(LAST_ORDER_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setItems(stored ? (JSON.parse(stored) as CartItem[]) : []);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setItems([]);
    }

    try {
      const storedOrder = localStorage.getItem(LAST_ORDER_KEY);
      if (storedOrder) {
        setLastOrderState(JSON.parse(storedOrder));
      }
    } catch {
      localStorage.removeItem(LAST_ORDER_KEY);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore unavailable storage so cart interactions keep working in memory.
    }
  }, [hydrated, items]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];

        if (parsed.some((item) => item.quantity > 10)) {
          localStorage.removeItem(STORAGE_KEY);
          setItems([]);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setItems(stored ? (JSON.parse(stored) as CartItem[]) : []);
      } catch {
        setItems([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = (newItem: CartProductInput) => {
    setItems((prev) => {
      const itemId = `${newItem.sellerId}-${newItem.productId}-${newItem.size}-${newItem.colorHex}`;
      const existingIndex = prev.findIndex(
        (item) => item.id === itemId,
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...newItem,
          id: itemId,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
        .filter((entry) => entry.quantity > 0),
    );
  };

  const updateItem = (
    oldId: string,
    updates: { size?: string; color?: string; colorHex?: string }
  ) => {
    setItems((prev) => {
      const targetIndex = prev.findIndex((item) => item.id === oldId);
      if (targetIndex === -1) return prev;

      const target = prev[targetIndex];
      const newSize = updates.size ?? target.size;
      const newColor = updates.color ?? target.color;
      const newColorHex = updates.colorHex ?? target.colorHex;

      const newId = `${target.sellerId}-${target.productId}-${newSize}-${newColorHex}`;

      if (newId === oldId) {
        return prev;
      }

      const existingNewIndex = prev.findIndex((item) => item.id === newId);

      if (existingNewIndex > -1) {
        // Merge quantities and remove old item
        const updated = [...prev];
        updated[existingNewIndex] = {
          ...updated[existingNewIndex],
          quantity: updated[existingNewIndex].quantity + target.quantity,
        };
        return updated.filter((item) => item.id !== oldId);
      }

      const updated = [...prev];
      updated[targetIndex] = {
        ...target,
        id: newId,
        size: newSize,
        color: newColor,
        colorHex: newColorHex,
      };
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const saveCheckoutAddress = (address: CheckoutAddress) => {
    setCheckoutAddress(address);
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethodState(method);
  };

  const clearLastOrder = () => {
    setLastOrder(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = getShipping(subtotal, itemCount);
  const total = subtotal + shipping;

  const completeOrder = (overrides?: CheckoutOverrides) => {
    if (!items.length) {
      return null;
    }

    const address = overrides?.address ?? checkoutAddress;
    const method = overrides?.paymentMethod ?? paymentMethod;

    const order: OrderRecord = {
      reference: `ALP-${Date.now().toString().slice(-6)}`,
      items: [...items],
      subtotal,
      shipping,
      discount: 0,
      total,
      address,
      paymentMethod: method,
      placedAt: new Date().toISOString(),
      sheetSynced: false,
      sheetSyncStatus: "failed",
      sheetSyncError: "Offline order fallback",
      paymentStatus: "CONFIRMED",
      orderStatus: "PLACED",
    };

    setLastOrder(order);
    setItems([]);
    setCheckoutAddress(DEFAULT_ADDRESS);
    setPaymentMethodState("upi");

    return order;
  };

  const submitOrder = async (overrides?: CheckoutOverrides): Promise<OrderRecord | null> => {
    if (!items.length) {
      return null;
    }

    const address = overrides?.address ?? checkoutAddress;
    const method = overrides?.paymentMethod ?? paymentMethod;

    const payload = {
      items: [...items],
      address,
      subtotal,
      shipping,
      discount: 0,
      total,
      paymentMethod: method,
      paymentStatus: "CONFIRMED",
      orderStatus: "PLACED",
      placedAt: new Date().toISOString(),
      turnstileToken: overrides?.turnstileToken,
    };

    const response = await fetch("/api/orders/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const order: OrderRecord = {
        reference: data.orderId || data.order?.orderId || `ALP-${Date.now().toString().slice(-6)}`,
        items: [...items],
        subtotal,
        shipping,
        discount: 0,
        total,
        address,
        paymentMethod: method,
        placedAt: data.order?.placedAt || payload.placedAt,
        sheetSynced: true,
        sheetSyncStatus: "synced",
        sheetSyncError: null,
        paymentStatus: "CONFIRMED",
        orderStatus: "PLACED",
      };

      setLastOrder(order);
      setItems([]);
      setCheckoutAddress(DEFAULT_ADDRESS);
      setPaymentMethodState("upi");

      return order;
    }

    const errorMsg =
      data.error ||
      data.sheetSyncError ||
      `Order submission failed (HTTP ${response.status}).`;
    console.error("[CartContext] Google Sheet write failure:", errorMsg);
    throw new Error(errorMsg);
  };

  const value: CartContextValue = {
    hydrated,
    items,
    cartItems: items,
    itemCount,
    subtotal,
    shipping,
    total,
    totalPrice: total,
    checkoutAddress,
    paymentMethod,
    lastOrder,
    addItem,
    addToCart: addItem,
    updateQuantity,
    updateItem,
    removeItem,
    removeFromCart: removeItem,
    clearCart,
    saveCheckoutAddress,
    setPaymentMethod,
    completeOrder,
    submitOrder,
    clearLastOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
