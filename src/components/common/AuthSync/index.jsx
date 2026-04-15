import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore.js';

const AuthSync = () => {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
};

export default AuthSync;

