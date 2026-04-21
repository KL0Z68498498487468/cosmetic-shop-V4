import { create } from 'zustand';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient.js';

let authSubscription = null;

const getAdminAccess = async (user) => {
  if (!supabase || !user?.id) {
    return false;
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Admin access check failed:', error);
    return false;
  }

  return Boolean(data?.user_id);
};

const syncAdminSession = async (session, set) => {
  const user = session?.user ?? null;

  if (!user) {
    set({ isLoggedIn: false, user: null, initialized: true, loading: false });
    return;
  }

  const hasAdminAccess = await getAdminAccess(user);

  if (!hasAdminAccess) {
    await supabase.auth.signOut();
    set({ isLoggedIn: false, user: null, initialized: true, loading: false });
    return;
  }

  set({ isLoggedIn: true, user, initialized: true, loading: false });
};

export const useAdminStore = create((set, get) => ({
  isLoggedIn: false,
  loading: false,
  initialized: false,
  user: null,

  init: async () => {
    if (!supabase) {
      set({ initialized: true, loading: false });
      return;
    }

    if (!authSubscription) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        void syncAdminSession(session, set);
      });
      authSubscription = data.subscription;
    }

    if (get().initialized) {
      return;
    }

    set({ loading: true });

    const {
      data: { session }
    } = await supabase.auth.getSession();

    await syncAdminSession(session, set);
  },

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error('Неверные данные');
        set({ loading: false, initialized: true });
        return { ok: false };
      }

      const hasAdminAccess = await getAdminAccess(data.user);

      if (!hasAdminAccess) {
        await supabase.auth.signOut();
        set({ isLoggedIn: false, user: null, loading: false, initialized: true });
        toast.error('У этого аккаунта нет доступа к админке');
        return { ok: false };
      }

      set({ isLoggedIn: true, user: data.user, loading: false, initialized: true });
      toast.success('Добро пожаловать в админку');
      return { ok: true };
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Ошибка входа');
      set({ loading: false, initialized: true });
      return { ok: false };
    }
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    set({ isLoggedIn: false, user: null, initialized: true });
    toast.success('Вы вышли из админки');
  }
}));
