import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import useProducts from '@/hooks/useProducts.js';
import useWishlist from '@/hooks/useWishlist.js';
import { useUserStore } from '@/store/userStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const ProfilePage = () => {
  const profile = useUserStore((state) => state.profile);
  const orders = useUserStore((state) => state.orders);
  const authUser = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { data: products = [] } = useProducts();
  const { items } = useWishlist(products);

  return (
    <>
      <Seo title="Личный кабинет | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }]} />
        <div className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="section-title">Личный кабинет</h1>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-white/80 px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-accent dark:hover:text-accent"
            >
              Выйти
            </button>
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
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[2rem] bg-pearl p-6 dark:bg-slate-800">
                    <div className="text-sm text-roseBrown/70 dark:text-slate-400">Имя</div>
                    <div className="mt-2 text-xl font-semibold dark:text-slate-100">{profile.name}</div>
                  </div>
                  <div className="rounded-[2rem] bg-pearl p-6 dark:bg-slate-800">
                    <div className="text-sm text-roseBrown/70 dark:text-slate-400">Email</div>
                    <div className="mt-2 text-xl font-semibold dark:text-slate-100">{authUser?.email ?? profile.email}</div>
                  </div>
                  <div className="rounded-[2rem] bg-pearl p-6 dark:bg-slate-800">
                    <div className="text-sm text-roseBrown/70 dark:text-slate-400">Телефон</div>
                    <div className="mt-2 text-xl font-semibold dark:text-slate-100">{profile.phone}</div>
                  </div>
                  <div className="rounded-[2rem] bg-pearl p-6 dark:bg-slate-800">
                    <div className="text-sm text-roseBrown/70 dark:text-slate-400">Адреса доставки</div>
                    <div className="mt-2 space-y-2 text-sm text-ink dark:text-slate-100">
                      {profile.addresses.map((address) => (
                        <div key={address}>{address}</div>
                      ))}
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
                  {items.map((item) => (
                    <div key={item.id} className="rounded-[1.5rem] border border-line p-4 dark:border-slate-700">
                      <div className="font-semibold text-ink dark:text-slate-100">{item.name}</div>
                      <div className="mt-2 text-sm text-roseBrown/70 dark:text-slate-400">{item.brand}</div>
                    </div>
                  ))}
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
