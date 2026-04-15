import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Seo from '@/components/common/Seo/index.jsx';
import Input from '@/components/common/Input/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import { isSupabaseConfigured } from '@/lib/supabaseClient.js';
import { useAuthStore } from '@/store/authStore.js';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Введите email'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Введите пароль')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signInWithPassword = useAuthStore((s) => s.signInWithPassword);
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const from = location.state?.from || '/profile';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const onSubmit = async (values) => {
    const res = await signInWithPassword(values);
    if (res?.ok) navigate(from, { replace: true });
  };

  return (
    <>
      <Seo title="Войти | Lumina" description="Вход в личный кабинет" />
      <div className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl">
          <div className="surface-card p-8 sm:p-10">
            <div className="text-sm font-bold uppercase tracking-[0.28em] text-roseBrown/60 dark:text-slate-400">
              Личный кабинет
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink dark:text-slate-100">
              Войти
            </h1>
            <p className="mt-3 text-muted">
              Введите email и пароль, чтобы продолжить покупки и видеть историю заказов.
            </p>

            {!isSupabaseConfigured ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-200">
                Supabase не настроен. Добавьте переменные окружения{' '}
                <span className="font-semibold">VITE_SUPABASE_URL</span> и{' '}
                <span className="font-semibold">VITE_SUPABASE_ANON_KEY</span>.
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Пароль"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={isSubmitting || !isSupabaseConfigured} className="sm:min-w-[180px]">
                  {isSubmitting ? 'Входим…' : 'Войти'}
                </Button>
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <Link to="/register" className="text-roseBrown/80 hover:text-accent dark:text-slate-300">
                    Регистрация
                  </Link>
                  <Link to="/" className="text-roseBrown/80 hover:text-accent dark:text-slate-300">
                    На главную
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

