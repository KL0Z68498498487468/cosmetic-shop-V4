import { useMemo } from 'react';
import { useCartStore } from '@/store/cartStore.js';

const useCart = (products = []) => {
  const { items, addItem, removeItem, updateQuantity, setPromoCode, promoCode, clearCart } =
    useCartStore();

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
  const discount = promoCode === 'LUMINA10' ? subtotal * 0.1 : 0;
  const delivery = subtotal > 250000 || subtotal === 0 ? 0 : 25000;
  const total = subtotal - discount + delivery;

  return {
    items: enrichedItems,
    promoCode,
    subtotal,
    discount,
    delivery,
    total,
    rawItems: items,
    addItem,
    removeItem,
    updateQuantity,
    setPromoCode,
    clearCart
  };
};

export default useCart;
