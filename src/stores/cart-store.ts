"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  quantity: number;
  variantName?: string;
  variantValue?: string;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantValue?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantValue?: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantValue === item.variantValue
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantValue === item.variantValue
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.stock) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          };
        });
      },

      removeItem: (productId, variantValue) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantValue === variantValue)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantValue) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantValue);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantValue === variantValue
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "esy-cart" }
  )
);
