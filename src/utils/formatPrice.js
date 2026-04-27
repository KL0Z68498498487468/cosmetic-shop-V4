const localeMap = {
  ru: 'ru-RU',
  en: 'en-US',
  uz: 'uz-UZ'
};

const resolveLocale = () => {
  const currentLanguage =
    document?.documentElement?.lang || window?.localStorage?.getItem('lumina-language') || 'ru';

  return localeMap[currentLanguage] || localeMap.ru;
};

export const formatPrice = (price) =>
  new Intl.NumberFormat(resolveLocale(), {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0
  }).format(price);
