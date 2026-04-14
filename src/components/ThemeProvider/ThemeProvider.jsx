// components/ThemeProvider.jsx
import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export const ThemeProvider = ({ children }) => {
  const { isDark } = useThemeStore();
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  return children;
};