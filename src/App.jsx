import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Layout from '@/components/layout/Layout/index.jsx';
import AnimatedSection from '@/components/ui/AnimatedSection/index.jsx';

const HomePage = lazy(() => import('@/pages/HomePage/index.jsx'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage/index.jsx'));
const ProductPage = lazy(() => import('@/pages/ProductPage/index.jsx'));
const CartPage = lazy(() => import('@/pages/CartPage/index.jsx'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage/index.jsx'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage/index.jsx'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage/index.jsx'));
const LoginPage = lazy(() => import('@/pages/LoginPage/index.jsx'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage/index.jsx'));
const AboutPage = lazy(() => import('@/pages/AboutPage/index.jsx'));
const DeliveryPage = lazy(() => import('@/pages/DeliveryPage/index.jsx'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage/index.jsx'));
const BlogPage = lazy(() => import('@/pages/BlogPage/index.jsx'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage/index.jsx'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/index.jsx'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage/index.jsx'));
const ProtectedRoute = lazy(() => import('@/components/common/ProtectedRoute/index.jsx'));

const App = () => {
  return (
    <>
      <Seo />
      <Suspense
        fallback={
          <div className="min-h-screen bg-pearl px-4 py-20 dark:bg-slate-950">
            <AnimatedSection className="container-shell">
              <div className="h-12 w-48 rounded-full bg-blush/70 dark:bg-slate-800" />
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-80 rounded-[2rem] bg-gradient-to-r from-white via-blush/50 to-white bg-[length:200%_100%] shadow-card animate-shimmer dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
                  />
                ))}
              </div>
            </AnimatedSection>
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
