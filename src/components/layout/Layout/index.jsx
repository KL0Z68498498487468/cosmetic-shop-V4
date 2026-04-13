import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer/index.jsx';
import Header from '@/components/layout/Header/index.jsx';
import ScrollToTop from '@/components/ui/ScrollToTop/index.jsx';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
