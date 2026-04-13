import { useMemo } from 'react';
import { useWishlistStore } from '@/store/wishlistStore.js';

const useWishlist = (products = []) => {
  const { ids, toggle } = useWishlistStore();

  const items = useMemo(
    () => products.filter((product) => ids.includes(product.id)),
    [ids, products]
  );

  return {
    ids,
    items,
    toggle
  };
};

export default useWishlist;
