export const formatPrice = (price) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0
  }).format(price);
