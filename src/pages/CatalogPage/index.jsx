import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import ProductQuickView from '@/components/product/ProductQuickView/index.jsx';
import ProductCard from '@/components/product/ProductCard/index.jsx';
import FilterSidebar from '@/components/ui/FilterSidebar/index.jsx';
import AnimatedSection from '@/components/ui/AnimatedSection/index.jsx';
import useProducts from '@/hooks/useProducts.js';
import { useFilterStore } from '@/store/filterStore.js';
import { filterProducts, sortProducts } from '@/utils/filterProducts.js';

const CatalogPage = () => {
  const { data: products = [] } = useProducts();
  const { filters, setFilter } = useFilterStore();
  const [visibleCount, setVisibleCount] = useState(8);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const triggerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    if (category) {
      setFilter('category', category);
    }
  }, [location.search, setFilter]);

  const filteredProducts = useMemo(() => {
    return sortProducts(filterProducts(products, filters), filters.sortBy);
  }, [filters, products]);

  useEffect(() => {
    setVisibleCount(8);
  }, [filters]);

  useEffect(() => {
    const node = triggerRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((value) => Math.min(value + 4, filteredProducts.length));
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [filteredProducts.length]);

  return (
    <>
      <Seo title="Каталог | Lumina" description="Каталог косметики, парфюмерии и beauty-товаров Lumina." />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]} />

        <AnimatedSection className="mt-6 rounded-[2.5rem] bg-white/80 p-8 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div>
              <FilterSidebar brands={[...new Set(products.map((product) => product.brand))]} />
            </div>

            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="section-title">Каталог</h1>
                  <p className="mt-3 text-muted">
                    {filteredProducts.length} товаров с живыми фильтрами, сортировкой и быстрым просмотром.
                  </p>
                </div>
                <select
                  value={filters.sortBy}
                  onChange={(event) => setFilter('sortBy', event.target.value)}
                  className="h-12 rounded-full border border-line bg-white px-5"
                >
                  <option value="popular">По популярности</option>
                  <option value="priceAsc">Цена по возрастанию</option>
                  <option value="priceDesc">Цена по убыванию</option>
                  <option value="newest">По новизне</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>

              <div ref={triggerRef} className="h-10" />
            </div>
          </div>
        </AnimatedSection>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
};

export default CatalogPage;
