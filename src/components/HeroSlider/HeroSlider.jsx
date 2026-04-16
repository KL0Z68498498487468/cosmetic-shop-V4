import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { siteTexts } from '@/constants/texts.js';
import { useThemeStore } from '@/store/themeStore.js'; // Импорт стора

// ── Вспомогательный компонент для анимации чисел ─────────────────────
const AnimatedNumber = ({ end, duration = 1500, suffix = '', trigger }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(ease * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration, trigger]);

  return <>{value.toLocaleString('ru-RU')}{suffix}</>;
};

export default function HeroSection({ recommendations = [], formatPrice }) {
  const isDark = useThemeStore((state) => state.isDark); // Получаем состояние темы
  const [mounted, setMounted] = useState(false);
  const hero = siteTexts?.hero ?? {};
  const cats = siteTexts?.categories ?? [];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const featured   = recommendations[0] ?? null;
  const secondary  = recommendations[1] ?? null;
  const tertiary   = recommendations[2] ?? null;

  return (
    <section className={`overflow-hidden rounded-2xl transition-colors duration-300 sm:rounded-3xl ${
      isDark ? 'bg-slate-900' : 'bg-[#FAF7F4]'
    }`}>

      {/* ── Главный блок ───────────────────────────────────────────── */}
      <div className="relative px-5 pb-0 pt-6 sm:px-8 sm:pt-8 lg:grid lg:min-h-[400px] lg:grid-cols-[1fr_340px] lg:items-center lg:gap-6">

        {/* Фоновый декор */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-40 transition-opacity"
          style={{
            background: isDark 
              ? 'radial-gradient(ellipse at 80% 30%, #334155 0%, transparent 65%)'
              : 'radial-gradient(ellipse at 80% 30%, #f9e4d4 0%, transparent 65%)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 opacity-30 transition-all"
          style={{
            background: isDark ? 'radial-gradient(circle, #475569 0%, transparent 70%)' : 'radial-gradient(circle, #fce8e0 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* ── Левая колонка ──────────────────────────────────── */}
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <span className={`h-px w-5 ${isDark ? 'bg-slate-500' : 'bg-[#C48B72]'}`} />
            <span className={`text-[9px] font-bold uppercase tracking-[0.25em] ${isDark ? 'text-slate-400' : 'text-[#C48B72]'}`}>
              {hero.overline ?? 'Новая коллекция · 2026'}
            </span>
          </div>

          <h1
            className={`mt-3 font-display leading-[0.95] transition-all duration-700 ${
              isDark ? 'text-slate-100' : 'text-[#1C1410]'
            }`}
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '80ms',
            }}
          >
            {hero.title ?? (
              <>
                Красота,<br />
                которая<br />
                <em className={`not-italic ${isDark ? 'text-slate-400' : 'text-[#C48B72]'}`}>остаётся</em>
              </>
            )}
          </h1>

          <p
            className={`mt-4 max-w-[340px] text-[13px] leading-[1.6] transition-all duration-700 ${
              isDark ? 'text-slate-400' : 'text-[#6B5C54]'
            }`}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '160ms',
            }}
          >
            {hero.description ?? 'Премиальная косметика и парфюмерия с доставкой по Ташкенту. Только оригинальные бренды.'}
          </p>

          {/* CTA Кнопки */}
          <div
            className="mt-5 flex flex-wrap items-center gap-2.5 transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '240ms',
            }}
          >
            <Link
              to="/catalog"
              className={`group inline-flex h-10 items-center gap-2 rounded-full px-5 text-[12px] font-semibold text-white transition-all ${
                isDark ? 'bg-slate-100 !text-slate-900 hover:bg-white' : 'bg-[#1C1410] hover:bg-[#C48B72]'
              }`}
            >
              {hero.ctaPrimary ?? 'В каталог'}
              <span className={`grid h-4 w-4 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${
                isDark ? 'bg-slate-900/10' : 'bg-white/15'
              }`}>
                <FiArrowRight size={10} />
              </span>
            </Link>

            <Link
              to="/blog"
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-5 text-[12px] font-semibold transition-all ${
                isDark 
                ? 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100' 
                : 'border-[#E0D5CF] text-[#1C1410] hover:border-[#C48B72] hover:text-[#C48B72]'
              }`}
            >
              {hero.ctaSecondary ?? 'Бьюти-блог'}
            </Link>
          </div>

          {/* Статистика с анимацией цифр */}
          <div
            className={`mt-6 flex flex-wrap items-center gap-4 border-t pt-5 transition-all duration-700 ${
              isDark ? 'border-slate-800' : 'border-[#E8DDD8]'
            }`}
            style={{ opacity: mounted ? 1 : 0, transitionDelay: '340ms' }}
          >
            <div>
              <div className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-[#1C1410]'}`}>
                <AnimatedNumber end={4800} suffix="+" trigger={mounted} />
              </div>
              <div className={`mt-0.5 text-[10px] ${isDark ? 'text-slate-500' : 'text-[#9C8880]'}`}>клиентов</div>
            </div>
            <div className={`h-5 w-px ${isDark ? 'bg-slate-800' : 'bg-[#E0D5CF]'}`} />
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={10} fill={isDark ? '#64748b' : '#C48B72'} stroke="none" />
                ))}
              </div>
              <div className={`mt-0.5 text-[10px] ${isDark ? 'text-slate-500' : 'text-[#9C8880]'}`}>рейтинг 4.9</div>
            </div>
            <div className={`h-5 w-px ${isDark ? 'bg-slate-800' : 'bg-[#E0D5CF]'}`} />
            <div>
              <div className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-[#1C1410]'}`}>
                <AnimatedNumber end={500} suffix="+" trigger={mounted} />
              </div>
              <div className={`mt-0.5 text-[10px] ${isDark ? 'text-slate-500' : 'text-[#9C8880]'}`}>брендов</div>
            </div>
          </div>
        </div>

        {/* ── Правая колонка: Карточки ─────────────────────────── */}
        <div
          className="relative hidden transition-all duration-700 lg:block"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: '120ms',
          }}
        >
          {featured && (
            <Link
              to={`/catalog/${featured.slug}`}
              className={`group relative z-20 block overflow-hidden rounded-[1.25rem] transition-all duration-300 hover:-translate-y-1 ${
                isDark 
                ? 'bg-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-slate-750' 
                : 'bg-white shadow-[0_8px_30px_rgba(28,20,16,0.06)]'
              }`}
            >
              <div className={`absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                isDark ? 'bg-slate-100 text-slate-900' : 'bg-[#1C1410] text-white'
              }`}>
                Хит
              </div>
              <img src={featured.image} alt={featured.name} className="h-48 w-full object-cover grayscale-[0.2] transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]" />
              <div className="flex items-center justify-between p-3.5">
                <div>
                  <div className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-[#C48B72]'}`}>
                    {featured.brand}
                  </div>
                  <div className={`mt-0.5 text-[13px] font-semibold ${isDark ? 'text-slate-100' : 'text-[#1C1410]'}`}>{featured.name}</div>
                  <div className={`mt-0.5 text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-[#1C1410]'}`}>{formatPrice(featured.price)}</div>
                </div>
                <span className={`grid h-7 w-7 place-items-center rounded-full transition ${
                  isDark ? 'bg-slate-700 text-white group-hover:bg-slate-100 group-hover:text-slate-900' : 'bg-[#F4EDE9] group-hover:bg-[#1C1410] group-hover:text-white'
                }`}>
                  <FiArrowRight size={12} />
                </span>
              </div>
            </Link>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">
            {[secondary, tertiary].filter(Boolean).map((p) => (
              <Link
                key={p.id}
                to={`/catalog/${p.slug}`}
                className={`group flex items-center gap-2 overflow-hidden rounded-xl p-2 transition-all hover:-translate-y-0.5 ${
                  isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white shadow-[0_2px_10px_rgba(28,20,16,0.04)]'
                }`}
              >
                <img src={p.image} className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className={`truncate text-[11px] font-semibold ${isDark ? 'text-slate-100' : 'text-[#1C1410]'}`}>{p.name}</div>
                  <div className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-[#6B5C54]'}`}>{formatPrice(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Нижняя полоса: Категории ──────────────────────────────────── */}
      {cats.length > 0 && (
        <div className={`mt-5 grid divide-x border-t transition-all duration-700 sm:grid-cols-3 ${
          isDark ? 'divide-slate-800 border-slate-800' : 'divide-[#E8DDD8] border-[#E8DDD8]'
        }`}
        style={{ opacity: mounted ? 1 : 0, transitionDelay: '420ms' }}>
          {cats.slice(0, 3).map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog?category=${cat.slug}`}
              className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
                isDark ? 'hover:bg-slate-800/50' : 'hover:bg-[#F0E9E5]'
              }`}
            >
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg">
                <img src={cat.image} className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-[12px] font-bold ${isDark ? 'text-slate-200' : 'text-[#1C1410]'}`}>{cat.title}</div>
                <div className={`truncate text-[10px] ${isDark ? 'text-slate-500' : 'text-[#9C8880]'}`}>{cat.description}</div>
              </div>
              <FiArrowRight size={12} className={`transition-transform group-hover:translate-x-0.5 ${isDark ? 'text-slate-600' : 'text-[#C8B5AB]'}`} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}