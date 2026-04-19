import { create } from 'zustand';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient.js';

export const useAdminStore = create((set, get) => ({
  isLoggedIn: false,
  loading: false,
  user: null,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ isLoggedIn: true, user: session.user });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Неверные данные');
        set({ loading: false });
        return { ok: false };
      }

      set({ isLoggedIn: true, user: data.user, loading: false });
      toast.success('Добро пожаловать в админку');
      return { ok: true };
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Ошибка входа');
      set({ loading: false });
      return { ok: false };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isLoggedIn: false, user: null });
    toast.success('Вы вышли из админки');
  }
}));