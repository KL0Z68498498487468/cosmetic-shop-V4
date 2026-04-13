import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore.js';

const ThemeSync = () => {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return null;
};

export default ThemeSync;
