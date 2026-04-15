import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const createDefaultProfile = () => ({
  name: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  addresses: []
});

const normalizeAddresses = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeProfile = (payload = {}) => {
  const name = payload.name?.trim() ?? '';
  const email = payload.email?.trim() ?? '';
  const phone = payload.phone?.trim() ?? '';
  const city = payload.city?.trim() ?? '';
  const address = payload.address?.trim() ?? '';
  const addresses = normalizeAddresses(payload.addresses);

  if (address && !addresses.includes(address)) {
    addresses.unshift(address);
  }

  return {
    name,
    email,
    phone,
    city,
    address,
    addresses
  };
};

const defaultOrders = [
  {
    id: 'LUM-2026-0142',
    date: '09 апреля 2026',
    total: 618000,
    status: 'В пути'
  },
  {
    id: 'LUM-2026-0087',
    date: '26 марта 2026',
    total: 279000,
    status: 'Доставлен'
  }
];

export const useUserStore = create(
  persist(
    (set) => ({
      profile: createDefaultProfile(),
      orders: defaultOrders,
      updateProfile: (payload) =>
        set((state) => ({
          profile: normalizeProfile({
            ...state.profile,
            ...payload
          })
        })),
      hydrateProfile: (payload) =>
        set((state) => ({
          profile: normalizeProfile({
            ...state.profile,
            ...payload
          })
        })),
      resetProfile: () =>
        set(() => ({
          profile: createDefaultProfile()
        }))
    }),
    {
      name: 'lumina-user'
    }
  )
);
