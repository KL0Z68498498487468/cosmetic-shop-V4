import { create } from 'zustand';
import toast from 'react-hot-toast';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient.js';

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

    set({
      session: data.session ?? null,
      user: data.session?.user ?? null,
      loading: false,
      ready: true
    });

    supabase.auth.onAuthStateChange((_event, session) => {
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
      toast.error('Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY или VITE_SUPABASE_PUBLISHABLE_KEY.');
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

  signUpWithPassword: async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY или VITE_SUPABASE_PUBLISHABLE_KEY.');
      return { ok: false };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      toast.error(error.message);
      return { ok: false, error };
    }

    if (data?.session) {
      toast.success('Аккаунт создан, вы вошли');
    } else {
      toast.success('Аккаунт создан. Подтвердите email и затем войдите.');
    }

    return { ok: true, requiresEmailConfirmation: !data?.session };
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
