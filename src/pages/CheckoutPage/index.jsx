import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Input from '@/components/common/Input/index.jsx';
import useCart from '@/hooks/useCart.js';
import useProducts from '@/hooks/useProducts.js';
import { formatPrice } from '@/utils/formatPrice.js';
import { supabase } from '@/lib/supabaseClient.js';

const schema = yup.object({
  name: yup.string().required('Введите имя'),
  phone: yup.string().required('Введите телефон'),
  email: yup.string().email('Некорректный email').required('Введите email'),
  delivery: yup.string().required(),
  payment: yup.string().required()
});

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const { data: products = [] } = useProducts();
  const { total, items, clearCart } = useCart(products);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      delivery: 'courier',
      payment: 'card'
    }
  });

  const stepTitle = useMemo(
    () => ['Контактные данные', 'Доставка', 'Оплата'][step - 1],
    [step]
  );

  const onNext = async () => {
    const valid = await trigger();

    if (valid) {
      setStep((value) => Math.min(3, value + 1));
    }
  };

  return (
    <>
      <Seo title="Оформление заказа | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Корзина', to: '/cart' },
            { label: 'Оформление заказа' }
          ]}
        />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="surface-card p-8">
            <div className="text-sm uppercase tracking-[0.3em] text-roseBrown/70 dark:text-slate-400">Шаг {step} из 3</div>
            <h1 className="mt-3 section-title">{stepTitle}</h1>

            <form
              onSubmit={handleSubmit(async (values) => {
                try {
                  // Сохранить заказ в Supabase
                  const orderData = {
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    delivery: values.delivery,
                    payment: values.payment,
                    items: items.map(item => ({
                      productId: item.productId,
                      variant: item.variant,
                      quantity: item.quantity,
                      price: item.product.price
                    })),
                    total: total,
                    created_at: new Date().toISOString()
                  };

                  const { error } = await supabase.from('orders').insert([orderData]);

                  if (error) {
                    console.error('Error saving order:', error);
                    toast.error('Ошибка при сохранении заказа');
                    return;
                  }

                  clearCart();
                  setStep(3);
                  toast.success('Заказ оформлен!');
                } catch (err) {
                  console.error('Error:', err);
                  toast.error('Ошибка при оформлении заказа');
                }
              })}
              className="mt-8 space-y-5"
            >
              {step === 1 ? (
                <>
                  <Input label="Имя" error={errors.name?.message} {...register('name')} />
                  <Input label="Телефон" error={errors.phone?.message} {...register('phone')} />
                  <Input label="Email" error={errors.email?.message} {...register('email')} />
                </>
              ) : null}

              {step === 2 ? (
                <div className="space-y-3">
                  {[
                    { label: 'Курьер', value: 'courier' },
                    { label: 'Самовывоз', value: 'pickup' },
                    { label: 'Постамат', value: 'locker' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <input type="radio" value={option.value} {...register('delivery')} />
                      {option.label}
                    </label>
                  ))}
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-3">
                  {[
                    { label: 'Онлайн картой', value: 'card' },
                    { label: 'Оплата при получении', value: 'cash' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <input type="radio" value={option.value} {...register('payment')} />
                      {option.label}
                    </label>
                  ))}
                  <Button type="submit" className="mt-4 w-full">
                    Подтвердить заказ
                  </Button>
                </div>
              ) : null}
            </form>

            {step < 3 ? (
              <Button type="button" className="mt-6" onClick={onNext}>
                Продолжить
              </Button>
            ) : null}
          </div>

          <div className="surface-card p-6">
            <h2 className="text-2xl font-semibold text-ink dark:text-slate-100">Подтверждение заказа</h2>
            <div className="mt-5 space-y-3 text-sm text-roseBrown/80 dark:text-slate-300">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="flex items-center justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="border-t border-line pt-4 text-lg font-bold text-ink dark:border-slate-700 dark:text-slate-100">
                Итого: {formatPrice(total)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
