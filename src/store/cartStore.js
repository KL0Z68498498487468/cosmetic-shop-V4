import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant) => {
        const existingItem = get().items.find(
          (item) => item.productId === product.id && item.variant === variant
        );

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.productId === product.id && item.variant === variant
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                productId: product.id,
                quantity: 1,
                variant
              }
            ]
          });
        }

        toast.success('Товар добавлен в корзину');
      },
      removeItem: (productId, variant) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.variant === variant)
          )
        });
      },
      updateQuantity: (productId, variant, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variant === variant
              ? { ...item, quantity }
              : item
          )
        });
      },
      moveToWishlist: (productId, variant) => {
        get().removeItem(productId, variant);
        toast.success('Товар перенесен в избранное');
      },
      removeUnavailableItems: (availableProductIds) => {
        const validIds = new Set(availableProductIds);
        const nextItems = get().items.filter((item) => validIds.has(item.productId));

        if (nextItems.length !== get().items.length) {
          set({ items: nextItems });
        }
      },
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'lumina-cart'
    }
  )
);
