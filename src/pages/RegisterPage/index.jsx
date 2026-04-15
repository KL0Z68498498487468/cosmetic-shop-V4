import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  password: yup.string().min(6, 'Минимум 6 символов').required('Введите пароль'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтвердите пароль')
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const signUpWithPassword = useAuthStore((s) => s.signUpWithPassword);
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  useEffect(() => {
    if (user) navigate('/profile', { replace: true });
  }, [user, navigate]);

  const onSubmit = async ({ email, password }) => {
    const res = await signUpWithPassword({ email, password });
    if (!res?.ok) return;

    if (res.requiresEmailConfirmation) {
      navigate('/login', { replace: true });
      return;
    }

    navigate('/profile', { replace: true });
  };

  return (
    <>
      <Seo title="Регистрация | Lumina" description="Создайте аккаунт в Lumina" />
      <div className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl">
          <div className="surface-card p-8 sm:p-10">
            <div className="text-sm font-bold uppercase tracking-[0.28em] text-roseBrown/60 dark:text-slate-400">
              Новый аккаунт
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink dark:text-slate-100">
              Регистрация
            </h1>
            <p className="mt-3 text-muted">Создайте аккаунт, чтобы оформить заказ и управлять историей покупок.</p>

            {!isSupabaseConfigured ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-200">
                Supabase не настроен. Добавьте переменные окружения{' '}
                <span className="font-semibold">VITE_SUPABASE_URL</span> и{' '}
                <span className="font-semibold">VITE_SUPABASE_ANON_KEY</span> РёР»Рё{' '}
                <span className="font-semibold">VITE_SUPABASE_PUBLISHABLE_KEY</span>.
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
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Подтверждение пароля"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={isSubmitting || !isSupabaseConfigured} className="sm:min-w-[180px]">
                  {isSubmitting ? 'Создаем…' : 'Зарегистрироваться'}
                </Button>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-roseBrown/80 hover:text-accent dark:text-slate-300"
                >
                  Уже есть аккаунт? Войти
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
