"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { AppliedCoupon, CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  clearCoupon: () => void;
  totalItems: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "delivery-app-cart";
const COUPON_KEY = "delivery-app-coupon";
const VERSION_KEY = "delivery-app-version";
const DATA_VERSION = "international-v1";
const LOADER_DELAY_MS = 2000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const currentVersion = window.localStorage.getItem(VERSION_KEY);
    if (currentVersion !== DATA_VERSION) {
      window.localStorage.removeItem(CART_KEY);
      window.localStorage.removeItem(COUPON_KEY);
      window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }

    const storedItems = window.localStorage.getItem(CART_KEY);
    const storedCoupon = window.localStorage.getItem(COUPON_KEY);

    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }

    if (storedCoupon) {
      setAppliedCoupon(JSON.parse(storedCoupon));
    }

    const timeoutId = window.setTimeout(() => {
      setHydrated(true);
    }, LOADER_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (appliedCoupon) {
      window.localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
    } else {
      window.localStorage.removeItem(COUPON_KEY);
    }
  }, [appliedCoupon, hydrated]);

  const addItem = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.productId === item.productId);

      if (!existing) {
        return [...current, item];
      }

      return current.map((entry) =>
        entry.productId === item.productId
          ? { ...entry, quantity: Math.min(99, entry.quantity + item.quantity) }
          : entry,
      );
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(99, quantity) } : item,
      ),
    );
  };

  const removeItem = (productId: number) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon: setAppliedCoupon,
        clearCoupon: () => setAppliedCoupon(null),
        totalItems,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
