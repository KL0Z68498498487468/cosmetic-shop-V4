import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore.js';

const AdminRoute = ({ children }) => {
  const { init, initialized, loading } = useAdminStore();

  useEffect(() => {
    void init();
  }, [init]);

  if (!initialized || loading) {
    return (
      <div className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl">
          <div className="surface-card p-8 sm:p-10">
            <div className="h-6 w-36 rounded-full bg-blush/70 dark:bg-slate-800" />
            <div className="mt-6 h-12 w-full rounded-2xl bg-blush/50 dark:bg-slate-800/70" />
            <div className="mt-4 h-12 w-full rounded-2xl bg-blush/50 dark:bg-slate-800/70" />
            <div className="mt-6 h-12 w-full rounded-full bg-blush dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
