import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const exists = get().ids.includes(productId);

        set({
          ids: exists
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId]
        });

        toast.success(
          exists ? 'Товар удален из избранного' : 'Товар добавлен в избранное'
        );
      }
    }),
    {
      name: 'lumina-wishlist'
    }
  )
);
