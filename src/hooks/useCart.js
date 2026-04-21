import { useEffect, useMemo } from 'react';
import { useCartStore } from '@/store/cartStore.js';

const useCart = (products = []) => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    removeUnavailableItems
  } =
    useCartStore();

  useEffect(() => {
    if (!products.length) {
      return;
    }

    removeUnavailableItems(products.map((product) => product.id));
  }, [products, removeUnavailableItems]);

  const enrichedItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((productItem) => productItem.id === item.productId);

          if (!product) {
            return null;
          }

          return {
            ...item,
            product,
            total: product.price * item.quantity
          };
        })
        .filter(Boolean),
    [items, products]
  );

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.total, 0);
  const delivery = subtotal > 250000 || subtotal === 0 ? 0 : 25000;
  const total = subtotal + delivery;

  return {
    items: enrichedItems,
    subtotal,
    delivery,
    total,
    rawItems: items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
};

export default useCart;
