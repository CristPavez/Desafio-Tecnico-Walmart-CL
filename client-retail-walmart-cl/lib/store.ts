import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;

        const sku = product.sku || product.id;
        const quantityToAdd = product.quantity || 1;
        const existingItem = items.find((i) => i.sku === sku);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.sku === sku
                ? { ...i, quantity: i.quantity + quantityToAdd }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                sku: sku,
                quantity: quantityToAdd,
              },
            ],
          });
        }
      },

      removeItem: (sku) => {
        set({ items: get().items.filter((i) => i.sku !== sku) });
      },

      updateQuantity: (sku, quantity) => {
        if (quantity === 0) {
          get().removeItem(sku);
        } else {
          set({
            items: get().items.map((i) =>
              i.sku === sku ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
