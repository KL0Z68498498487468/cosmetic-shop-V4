import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources.js';

const STORAGE_KEY = 'lumina-language';
const SUPPORTED_LANGUAGES = ['ru', 'en', 'uz'];

const detectLanguage = () => {
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (SUPPORTED_LANGUAGES.includes(saved)) {
    return saved;
  }

  const browserLanguage = navigator.language?.slice(0, 2)?.toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(browserLanguage)) {
    return browserLanguage;
  }

  return 'ru';
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false
  }
});

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  window.localStorage.setItem(STORAGE_KEY, language);
});

document.documentElement.lang = i18n.language;

export default i18n;
