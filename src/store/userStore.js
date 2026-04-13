import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      profile: {
        name: 'Алина Сафарова',
        email: 'alina@lumina-demo.uz',
        phone: '+998 90 777 11 22',
        addresses: [
          'Ташкент, Мирзо-Улугбекский район, ул. Осиё, 17',
          'Ташкент, Юнусабад, мкр. 8, дом 21'
        ]
      },
      orders: [
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
      ],
      updateProfile: (payload) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...payload
          }
        }))
    }),
    {
      name: 'lumina-user'
    }
  )
);
