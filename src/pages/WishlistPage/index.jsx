import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import EmptyState from '@/components/common/EmptyState/index.jsx';
import ProductCard from '@/components/product/ProductCard/index.jsx';
import useProducts from '@/hooks/useProducts.js';
import useWishlist from '@/hooks/useWishlist.js';

const WishlistPage = () => {
  const { data: products = [] } = useProducts();
  const { items } = useWishlist(products);

  return (
    <>
      <Seo title="Избранное | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Избранное' }]} />
        <div className="mt-6">
          <h1 className="section-title">Избранное</h1>
        </div>
        {!items.length ? (
          <div className="mt-8">
            <EmptyState
              title="Избранное пока пусто"
              description="Сохраняйте товары сердечком, чтобы вернуться к ним позже."
              actionLabel="Открыть каталог"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
