import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import useProducts from '@/hooks/useProducts.js';
import useWishlist from '@/hooks/useWishlist.js';
import { useUserStore } from '@/store/userStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const ProfilePage = () => {
  const profile = useUserStore((state) => state.profile);
  const orders = useUserStore((state) => state.orders);
  const { data: products = [] } = useProducts();
  const { items } = useWishlist(products);

  return (
    <>
      <Seo title="Личный кабинет | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }]} />
        <div className="mt-6">
          <h1 className="section-title">Личный кабинет</h1>
        </div>

        <div className="mt-8 rounded-[2.5rem] bg-white p-8 shadow-soft">
          <TabGroup>
            <TabList className="flex flex-wrap gap-3">
              {['Профиль', 'История заказов', 'Избранное'].map((tab) => (
                <Tab
                  key={tab}
                  className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink ui-selected:border-accent ui-selected:bg-accent ui-selected:text-white"
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-8">
              <TabPanel>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[2rem] bg-pearl p-6">
                    <div className="text-sm text-roseBrown/70">Имя</div>
                    <div className="mt-2 text-xl font-semibold">{profile.name}</div>
                  </div>
                  <div className="rounded-[2rem] bg-pearl p-6">
                    <div className="text-sm text-roseBrown/70">Email</div>
                    <div className="mt-2 text-xl font-semibold">{profile.email}</div>
                  </div>
                  <div className="rounded-[2rem] bg-pearl p-6">
                    <div className="text-sm text-roseBrown/70">Телефон</div>
                    <div className="mt-2 text-xl font-semibold">{profile.phone}</div>
                  </div>
                  <div className="rounded-[2rem] bg-pearl p-6">
                    <div className="text-sm text-roseBrown/70">Адреса доставки</div>
                    <div className="mt-2 space-y-2 text-sm text-ink">
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
                    <div key={order.id} className="rounded-[1.5rem] border border-line p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-semibold text-ink">{order.id}</div>
                          <div className="mt-1 text-sm text-roseBrown/70">{order.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-ink">{formatPrice(order.total)}</div>
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
                    <div key={item.id} className="rounded-[1.5rem] border border-line p-4">
                      <div className="font-semibold text-ink">{item.name}</div>
                      <div className="mt-2 text-sm text-roseBrown/70">{item.brand}</div>
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
