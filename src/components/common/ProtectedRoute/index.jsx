import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const ready = useAuthStore((s) => s.ready);

  if (!ready || loading) {
    return (
      <div className="container-shell py-10">
        <div className="surface-card p-8">
          <div className="h-7 w-56 rounded-full bg-blush/70 dark:bg-slate-800" />
          <div className="mt-6 grid gap-3">
            <div className="h-12 rounded-2xl bg-blush/50 dark:bg-slate-800" />
            <div className="h-12 rounded-2xl bg-blush/50 dark:bg-slate-800" />
            <div className="h-12 w-44 rounded-full bg-blush/60 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;

