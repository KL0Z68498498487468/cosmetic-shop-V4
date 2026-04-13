import { Link } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import EmptyState from '@/components/common/EmptyState/index.jsx';
import QuantitySelector from '@/components/common/QuantitySelector/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import useCart from '@/hooks/useCart.js';
import useProducts from '@/hooks/useProducts.js';
import { useWishlistStore } from '@/store/wishlistStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const CartPage = () => {
  const { data: products = [] } = useProducts();
  const { items, subtotal, discount, delivery, total, promoCode, setPromoCode, updateQuantity, removeItem } =
    useCart(products);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  return (
    <>
      <Seo title="Корзина | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Корзина' }]} />
        <div className="mt-6">
          <h1 className="section-title">Корзина</h1>
        </div>

        {!items.length ? (
          <div className="mt-8">
            <EmptyState
              title="В корзине пока пусто"
              description="Сохраните любимые товары или вернитесь в каталог, чтобы собрать заказ."
              actionLabel="Перейти в каталог"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="rounded-[2rem] bg-white p-5 shadow-card">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-36 w-full rounded-[1.5rem] object-cover sm:w-36"
                    />
                    <div className="flex-1">
                      <div className="text-sm uppercase tracking-[0.2em] text-roseBrown/70">
                        {item.product.brand}
                      </div>
                      <div className="mt-2 text-xl font-semibold text-ink">{item.product.name}</div>
                      <div className="mt-2 text-sm text-roseBrown/70">Вариант: {item.variant}</div>
                      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(value) =>
                            updateQuantity(item.productId, item.variant, value)
                          }
                        />
                        <div className="text-xl font-bold text-ink">{formatPrice(item.total)}</div>
                      </div>
                      <div className="mt-4 flex gap-4 text-sm font-semibold">
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variant)}
                          className="text-roseBrown/80 transition hover:text-accent"
                        >
                          Удалить
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleWishlist(item.productId);
                            removeItem(item.productId, item.variant);
                          }}
                          className="text-roseBrown/80 transition hover:text-accent"
                        >
                          Переместить в избранное
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-ink">Ваш заказ</h2>
              <div className="mt-6 space-y-4 text-sm text-roseBrown/80">
                <label className="block">
                  <span className="mb-2 block font-semibold text-ink">Промокод</span>
                  <input
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="Например, LUMINA10"
                    className="h-12 w-full rounded-2xl border border-line px-4"
                  />
                </label>
                <div className="flex items-center justify-between">
                  <span>Сумма товаров</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Скидка</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Доставка</span>
                  <span>{delivery ? formatPrice(delivery) : 'Бесплатно'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4 text-lg font-bold text-ink">
                  <span>Итого</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button as={Link} to="/checkout" className="mt-6 w-full">
                Перейти к оформлению
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
