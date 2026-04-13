import { create } from 'zustand';

export const initialFilters = {
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: 700000,
  rating: 0,
  inStock: false,
  newOnly: false,
  discountOnly: false,
  search: '',
  sortBy: 'popular'
};

export const useFilterStore = create((set) => ({
  filters: initialFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    })),
  resetFilters: () => set({ filters: initialFilters })
}));
