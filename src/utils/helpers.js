import { clsx } from 'clsx';

export const cn = (...args) => clsx(args);

export const getDiscountPercent = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('');

export const createDelay = (data, timeout = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), timeout);
  });
