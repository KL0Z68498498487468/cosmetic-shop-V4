import { create } from 'zustand';
import toast from 'react-hot-toast';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient.js';
import { useUserStore } from '@/store/userStore.js';

const profileMessage =
  'Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY или VITE_SUPABASE_PUBLISHABLE_KEY.';

const extractProfileFromUser = (user) => {
  const metadata = user?.user_metadata ?? {};

  return {
    name: metadata.full_name || metadata.name || '',
    email: user?.email || '',
    phone: metadata.phone || '',
    city: metadata.city || '',
    address: metadata.address || '',
    addresses: metadata.address ? [metadata.address] : []
  };
};

const syncProfileFromUser = (user) => {
  if (!user) return;
  useUserStore.getState().hydrateProfile(extractProfileFromUser(user));
};

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  loading: true,
  ready: false,

  init: async () => {
    if (get().ready) return;
    set({ loading: true });

    if (!isSupabaseConfigured || !supabase) {
      set({ session: null, user: null, loading: false, ready: true });
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      set({ session: null, user: null, loading: false, ready: true });
      return;
    }

    syncProfileFromUser(data.session?.user);

    set({
      session: data.session ?? null,
      user: data.session?.user ?? null,
      loading: false,
      ready: true
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      syncProfileFromUser(session?.user);

      set({
        session: session ?? null,
        user: session?.user ?? null,
        loading: false,
        ready: true
      });
    });
  },

  signInWithPassword: async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error(profileMessage);
      return { ok: false };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return { ok: false, error };
    }

    toast.success('Вы вошли');
    return { ok: true };
  },

  signUpWithPassword: async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error(profileMessage);
      return { ok: false };
    }

    const cleanName = fullName?.trim() ?? '';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: cleanName,
          name: cleanName
        }
      }
    });

    if (error) {
      toast.error(error.message);
      return { ok: false, error };
    }

    useUserStore
      .getState()
      .updateProfile({ name: cleanName, email, addresses: [] });

    if (data?.user) {
      syncProfileFromUser(data.user);
    }

    if (data?.session) {
      toast.success('Аккаунт создан, вы вошли');
    } else {
      toast.success('Аккаунт создан. Подтвердите email и затем войдите.');
    }

    return { ok: true, requiresEmailConfirmation: !data?.session };
  },

  updateProfile: async ({ name, phone, city, address }) => {
    const payload = {
      name: name?.trim() ?? '',
      phone: phone?.trim() ?? '',
      city: city?.trim() ?? '',
      address: address?.trim() ?? ''
    };

    useUserStore.getState().updateProfile(payload);

    if (!isSupabaseConfigured || !supabase || !get().user) {
      toast.success('Профиль сохранён');
      return { ok: true };
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...(get().user?.user_metadata ?? {}),
        full_name: payload.name,
        name: payload.name,
        phone: payload.phone,
        city: payload.city,
        address: payload.address
      }
    });

    if (error) {
      toast.error(error.message);
      return { ok: false, error };
    }

    if (data?.user) {
      syncProfileFromUser(data.user);
      set((state) => ({
        ...state,
        user: data.user
      }));
    }

    toast.success('Профиль сохранён');
    return { ok: true };
  },

  signOut: async () => {
    if (!supabase) {
      set({ session: null, user: null, loading: false, ready: true });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success('Вы вышли');
  }
}));
