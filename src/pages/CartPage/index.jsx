import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import EmptyState from '@/components/common/EmptyState/index.jsx';
import QuantitySelector from '@/components/common/QuantitySelector/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Modal from '@/components/common/Modal/index.jsx';
import useCart from '@/hooks/useCart.js';
import useProducts from '@/hooks/useProducts.js';
import { sendTelegramCartOrder } from '@/services/api.js';
import { useWishlistStore } from '@/store/wishlistStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const CartPage = () => {
  const { data: products = [] } = useProducts();
  const { items, subtotal, delivery, total, updateQuantity, removeItem, clearCart } =
    useCart(products);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const orderMutation = useMutation({
    mutationFn: (orderData) => sendTelegramCartOrder({ cart: items, order: orderData, total }),
    onSuccess: () => {
      toast.success('Заказ отправлен в Telegram');
      clearCart();
      setOrderModalOpen(false);
    },
    onError: () => {
      toast.error('Не удалось отправить заказ. Попробуйте позже.');
    }
  });

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
                <div key={`${item.productId}-${item.variant}`} className="surface-card p-5">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-36 w-full rounded-[1.5rem] object-cover sm:w-36"
                    />
                    <div className="flex-1">
                      <div className="text-sm uppercase tracking-[0.2em] text-roseBrown/70 dark:text-slate-400">
                        {item.product.brand}
                      </div>
                      <div className="mt-2 text-xl font-semibold text-ink dark:text-slate-100">{item.product.name}</div>
                      <div className="mt-2 text-sm text-roseBrown/70 dark:text-slate-400">Вариант: {item.variant}</div>
                      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(value) =>
                            updateQuantity(item.productId, item.variant, value)
                          }
                        />
                        <div className="text-xl font-bold text-ink dark:text-slate-100">{formatPrice(item.total)}</div>
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

            <div className="surface-card p-6">
              <h2 className="text-2xl font-semibold text-ink dark:text-slate-100">Ваш заказ</h2>
              <div className="mt-6 space-y-4 text-sm text-roseBrown/80 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Сумма товаров</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Доставка</span>
                  <span>{delivery ? formatPrice(delivery) : 'Бесплатно'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4 text-lg font-bold text-ink dark:border-slate-700 dark:text-slate-100">
                  <span>Итого</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button onClick={() => setOrderModalOpen(true)} className="mt-6 w-full">
                Оформить заказ через Telegram
              </Button>

              <Modal
                isOpen={isOrderModalOpen}
                onClose={() => setOrderModalOpen(false)}
                title="Оформить заказ"
              >
                <OrderForm
                  onSubmit={(data) => orderMutation.mutate(data)}
                  isLoading={orderMutation.isLoading}
                  onCancel={() => setOrderModalOpen(false)}
                />
              </Modal>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;

const OrderForm = ({ onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: '', phone: '', comment: '' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('name')}
        placeholder="Ваше имя"
        className="focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <input
        {...register('phone')}
        placeholder="Телефон"
        className="focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <textarea
        {...register('comment')}
        rows="4"
        placeholder="Комментарий к заказу"
        className="focus-ring w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Отправляется...' : 'Отправить заказ'}
        </Button>
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};
