import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Input from '@/components/common/Input/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import useProducts from '@/hooks/useProducts.js';
import useWishlist from '@/hooks/useWishlist.js';
import { useUserStore } from '@/store/userStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { formatPrice } from '@/utils/formatPrice.js';
import { getInitials } from '@/utils/helpers.js';

const schema = yup.object({
  name: yup.string().min(2, 'Введите имя').required('Введите имя'),
  phone: yup.string().nullable(),
  city: yup.string().nullable(),
  address: yup.string().nullable()
});

const ProfilePage = () => {
  const profile = useUserStore((state) => state.profile);
  const orders = useUserStore((state) => state.orders);
  const authUser = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const { data: products = [] } = useProducts();
  const { items } = useWishlist(products);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      address: ''
    }
  });

  useEffect(() => {
    reset({
      name: profile.name || authUser?.user_metadata?.full_name || '',
      phone: profile.phone || '',
      city: profile.city || '',
      address: profile.address || ''
    });
  }, [authUser?.user_metadata?.full_name, profile.address, profile.city, profile.name, profile.phone, reset]);

  const email = authUser?.email ?? profile.email ?? '';
  const displayName = profile.name || authUser?.user_metadata?.full_name || 'Ваш профиль';
  const initials = getInitials(displayName || email || 'LP');
  const savedAddresses = profile.addresses.length ? profile.addresses : profile.address ? [profile.address] : [];

  const onSubmit = async (values) => {
    await updateProfile(values);
  };

  return (
    <>
      <Seo title="Личный кабинет | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }]} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-card overflow-hidden p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-semibold text-white shadow-glow">
                  {initials || 'LP'}
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.25em] text-roseBrown/60 dark:text-slate-400">
                    Профиль Lumina
                  </div>
                  <h1 className="mt-2 font-display text-3xl font-semibold text-ink dark:text-slate-100">
                    {displayName}
                  </h1>
                  <div className="mt-1 text-sm text-muted">{email || 'Email появится после входа'}</div>
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={signOut}>
                Выйти
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] bg-pearl p-5 dark:bg-slate-800">
                <div className="text-sm text-roseBrown/70 dark:text-slate-400">Email</div>
                <div className="mt-2 text-sm font-semibold text-ink dark:text-slate-100">{email || 'Не указан'}</div>
              </div>
              <div className="rounded-[1.75rem] bg-pearl p-5 dark:bg-slate-800">
                <div className="text-sm text-roseBrown/70 dark:text-slate-400">Телефон</div>
                <div className="mt-2 text-sm font-semibold text-ink dark:text-slate-100">{profile.phone || 'Добавьте номер'}</div>
              </div>
              <div className="rounded-[1.75rem] bg-pearl p-5 dark:bg-slate-800">
                <div className="text-sm text-roseBrown/70 dark:text-slate-400">Город</div>
                <div className="mt-2 text-sm font-semibold text-ink dark:text-slate-100">{profile.city || 'Добавьте город'}</div>
              </div>
            </div>
          </div>

          <div className="surface-card p-8">
            <div className="text-sm uppercase tracking-[0.25em] text-roseBrown/60 dark:text-slate-400">
              Доставка
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink dark:text-slate-100">
              Сохранённые данные
            </h2>
            <div className="mt-6 space-y-4 text-sm text-ink dark:text-slate-100">
              <div>
                <div className="text-roseBrown/70 dark:text-slate-400">Основной адрес</div>
                <div className="mt-1">{profile.address || 'Пока не добавлен'}</div>
              </div>
              <div>
                <div className="text-roseBrown/70 dark:text-slate-400">Количество заказов</div>
                <div className="mt-1">{orders.length}</div>
              </div>
              <div>
                <div className="text-roseBrown/70 dark:text-slate-400">Подтверждение email</div>
                <div className="mt-1">{authUser?.email_confirmed_at ? 'Подтверждён' : 'Ожидает подтверждения'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-card mt-8 p-8">
          <TabGroup>
            <TabList className="flex flex-wrap gap-3">
              {['Профиль', 'История заказов', 'Избранное'].map((tab) => (
                <Tab
                  key={tab}
                  className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink ui-selected:border-accent ui-selected:bg-accent ui-selected:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-8">
              <TabPanel>
                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                  <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <Input label="Имя" type="text" autoComplete="name" error={errors.name?.message} {...register('name')} />
                    <Input
                      label="Телефон"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+998 90 123 45 67"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Input
                      label="Город"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Ташкент"
                      error={errors.city?.message}
                      {...register('city')}
                    />
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">Адрес доставки</span>
                      <textarea
                        rows={5}
                        className="focus-ring w-full rounded-[1.5rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-roseBrown/60 focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                        placeholder="Улица, дом, квартира, ориентир"
                        {...register('address')}
                      />
                      {errors.address ? <span className="mt-2 block text-xs text-red-500">{errors.address.message}</span> : null}
                    </label>
                    <div className="pt-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Сохраняем…' : 'Сохранить профиль'}
                      </Button>
                    </div>
                  </form>

                  <div className="rounded-[2rem] bg-pearl p-6 dark:bg-slate-800">
                    <div className="text-sm uppercase tracking-[0.2em] text-roseBrown/60 dark:text-slate-400">
                      Что сохранится
                    </div>
                    <div className="mt-4 space-y-5 text-sm text-ink dark:text-slate-100">
                      <div>
                        <div className="font-semibold">Имя и контакты</div>
                        <div className="mt-1 text-muted">Эти данные будут подставляться в профиль после входа.</div>
                      </div>
                      <div>
                        <div className="font-semibold">Адрес доставки</div>
                        <div className="mt-1 text-muted">
                          Основной адрес сохраняется в кабинете и остаётся доступным на следующих визитах.
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">Список адресов</div>
                        <div className="mt-2 space-y-2">
                          {savedAddresses.length ? (
                            savedAddresses.map((item) => (
                              <div key={item} className="rounded-2xl bg-white/80 px-4 py-3 dark:bg-slate-900">
                                {item}
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl bg-white/80 px-4 py-3 text-muted dark:bg-slate-900">
                              Сохранённых адресов пока нет.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-[1.5rem] border border-line p-5 dark:border-slate-700">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-semibold text-ink dark:text-slate-100">{order.id}</div>
                          <div className="mt-1 text-sm text-roseBrown/70 dark:text-slate-400">{order.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-ink dark:text-slate-100">{formatPrice(order.total)}</div>
                          <div className="mt-1 text-sm text-accent">{order.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>

              <TabPanel>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.length ? (
                    items.map((item) => (
                      <div key={item.id} className="rounded-[1.5rem] border border-line p-4 dark:border-slate-700">
                        <div className="font-semibold text-ink dark:text-slate-100">{item.name}</div>
                        <div className="mt-2 text-sm text-roseBrown/70 dark:text-slate-400">{item.brand}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-line p-6 text-sm text-muted dark:border-slate-700">
                      Пока ничего не добавлено в избранное.
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
