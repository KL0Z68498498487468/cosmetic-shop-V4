import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import ProductQuickView from '@/components/product/ProductQuickView/index.jsx';
import ProductCard from '@/components/product/ProductCard/index.jsx';
import ProductCardSkeleton from '@/components/product/ProductCard/ProductCardSkeleton.jsx';
import FilterSidebar from '@/components/ui/FilterSidebar/index.jsx';
import AnimatedSection from '@/components/ui/AnimatedSection/index.jsx';
import EmptyState from '@/components/common/EmptyState/index.jsx';
import useProducts from '@/hooks/useProducts.js';
import { useFilterStore } from '@/store/filterStore.js';
import { filterProducts, sortProducts } from '@/utils/filterProducts.js';

const formatCategoryLabel = (category) =>
  String(category)
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const CatalogPage = () => {
  const { data: products = [], isLoading } = useProducts();
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

  const categoryOptions = useMemo(() => {
    return [...new Set(products.map((product) => product.category).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second))
      .map((category) => ({
        value: category,
        label: formatCategoryLabel(category)
      }));
  }, [products]);

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

        <AnimatedSection className="surface-card mt-6 p-8">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div>
              <FilterSidebar
                brands={[...new Set(products.map((product) => product.brand).filter(Boolean))]}
                categories={categoryOptions}
              />
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
                  className="focus-ring h-12 rounded-full border border-line bg-white px-5 text-ink transition hover:border-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="popular">По популярности</option>
                  <option value="priceAsc">Цена по возрастанию</option>
                  <option value="priceDesc">Цена по убыванию</option>
                  <option value="newest">По новизне</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState
                      title="Товаров пока нет"
                      description="Обновляем каталог, загляните позже"
                    />
                  </div>
                ) : (
                  filteredProducts.slice(0, visibleCount).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))
                )}
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
