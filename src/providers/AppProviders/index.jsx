import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import ThemeSync from '@/components/common/ThemeSync/index.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

const AppProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeSync />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: '18px',
              padding: '14px 18px',
              background: '#20161b',
              color: '#fff',
              boxShadow: '0 20px 45px rgba(32, 22, 27, 0.18)'
            }
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
