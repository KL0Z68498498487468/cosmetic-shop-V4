import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiGift, FiShield } from 'react-icons/fi';
import { useThemeStore } from '@/store/themeStore.js';

const INTERVAL = 5000;

function buildSlides({ recommendations = [], discounts = [], formatPrice, siteTexts, isDark }) {
  const hero = siteTexts?.hero ?? {};
  const cats = siteTexts?.categories ?? [];

  return [
    // ── Слайд 0: Главный ─────────────────────────────────────────
    {
      id: 'main',
      accent: '#FF6B6B',
      label: 'Новинки',
      bg: 'from-[#fff5f0] to-[#ffe8e0]',
      product: recommendations[0],
      content: ({ accent, product }) => (
        <div
          className={`relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-3xl sm:min-h-[420px] ${
            isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-[#fff5f0] to-[#ffe8e0]'
          }`}
        >
          <Circle size={300} top="-60px" right="-60px" color="#FF6B6B" opacity={0.08} />
          <Circle size={150} bottom="40px" left="30px" color="#FF6B6B" opacity={0.06} />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 lg:grid lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <Tag color={accent}>✦ {hero.overline ?? 'Новинки сезона'}</Tag>

              <h1 className={`mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>
                {hero.title ?? (
                  <>Beauty<br />Ритуалы</>
                )}
              </h1>

              <p className={`mt-4 max-w-sm text-sm leading-6 ${isDark ? 'text-slate-300/80' : 'text-[#1a1a1a]/60'}`}>
                {hero.description ?? 'Премиальная косметика и парфюмерия — только лучшее для вашей кожи.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <PillLink to="/catalog" bg="#1a1a1a" color="#fff">
                  {hero.ctaPrimary ?? 'Смотреть каталог'} <FiArrowRight size={14} />
                </PillLink>
                <PillLink to="/blog" bg="transparent" color="#1a1a1a" border>
                  {hero.ctaSecondary ?? 'Beauty-блог'}
                </PillLink>
              </div>

              <div className="mt-8 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: <FiTruck size={12} />, text: 'Доставка день в день' },
                  { icon: <FiGift  size={12} />, text: 'Подарок от 400к сум' },
                  { icon: <FiShield size={12} />, text: 'Оригинал 100%' },
                ].map((b) => (
                  <div
                    key={b.text}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-medium backdrop-blur-sm ${
                      isDark ? 'bg-slate-900/70 text-slate-100' : 'bg-white/70 text-[#1a1a1a]'
                    }`}
                  >
                    <span style={{ color: accent }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {product && (
              <Link to={`/catalog/${product.slug}`}
                className={`group mt-8 block overflow-hidden rounded-2xl transition hover:-translate-y-1 lg:mt-0 ${
                  isDark ? 'bg-slate-900 shadow-[0_10px_30px_rgba(2,6,23,0.45)]' : 'bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]'
                }`}
              >
                <div className="overflow-hidden">
                  <img src={product.image} alt={product.name}
                    className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{product.brand}</div>
                  <div className={`mt-1 text-base font-semibold ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>{product.name}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>{formatPrice(product.price)}</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full text-white transition group-hover:opacity-80"
                      style={{ background: accent }}>
                      <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      ),
    },

    // ── Слайд 1: Акции ───────────────────────────────────────────
    {
      id: 'promo',
      accent: '#FFD93D',
      label: 'Скидки',
      bg: 'from-[#1a1a1a] to-[#2d1f00]',
      product: discounts[0],
      content: ({ accent }) => (
        <div className="relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl bg-[#1a1a1a] sm:min-h-[420px]">
          <Circle size={350} top="-80px" right="-80px" color={accent} opacity={0.07} />
          <Circle size={180} bottom="-40px" left="10%" color={accent} opacity={0.05} />

          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: accent }} />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-8">
            <div>
              <Tag color={accent} dark>🔥 Горячие скидки</Tag>

              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-white">
                До<br />
                <span style={{ color: accent }}>−30%</span><br />
                на уход
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
                Финальные часы весенней акции. Успейте забрать бестселлеры по лучшей цене.
              </p>

              <PillLink to="/catalog" bg={accent} color="#1a1a1a" className="mt-6">
                Смотреть акции <FiArrowRight size={14} />
              </PillLink>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2.5 lg:mt-0">
              {discounts.slice(0, 4).map((p) => {
                const disc = Math.round((1 - p.price / p.oldPrice) * 100);
                return (
                  <Link key={p.id} to={`/catalog/${p.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black text-[#1a1a1a]"
                      style={{ background: accent }}>
                      −{disc}%
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">{p.brand}</div>
                    <div className="mt-1 text-xs font-semibold leading-snug text-white line-clamp-2">{p.name}</div>
                    <div className="mt-2 flex flex-col items-start gap-0.5 sm:flex-row sm:items-end sm:gap-2">
                      <span className="text-sm font-bold text-white">{formatPrice(p.price)}</span>
                      <span className="text-[10px] text-white/30 line-through">{formatPrice(p.oldPrice)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },

    // ── Слайд 2: Рекомендации ────────────────────────────────────
    {
      id: 'picks',
      accent: '#6BCB77',
      label: 'Хиты',
      bg: 'from-[#f0fff4] to-[#e0f5e9]',
      content: ({ accent }) => (
        <div
          className={`relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl sm:min-h-[420px] ${
            isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-[#f0fff4] to-[#e0f5e9]'
          }`}
        >
          <Circle size={280} top="-50px" right="-50px" color={accent} opacity={0.15} />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Tag color={accent}>✦ Персонально для вас</Tag>
                <h2 className={`mt-4 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[0.95] ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>
                  Хиты с высоким рейтингом
                </h2>
                <p className={`mt-2 max-w-sm text-sm ${isDark ? 'text-slate-300/80' : 'text-[#1a1a1a]/55'}`}>
                  Покупают снова и снова — проверено клиентами.
                </p>
              </div>
              <PillLink to="/catalog" bg={accent} color="#1a1a1a" className="mt-1 hidden shrink-0 sm:flex">
                Все товары <FiArrowRight size={14} />
              </PillLink>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {recommendations.slice(0, 4).map((p, i) => (
                <Link key={p.id} to={`/catalog/${p.slug}`}
                  className={`group overflow-hidden rounded-xl transition hover:-translate-y-1 ${
                    isDark
                      ? 'bg-slate-900 shadow-[0_4px_14px_rgba(2,6,23,0.4)] hover:shadow-[0_8px_22px_rgba(2,6,23,0.55)]'
                      : 'bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]'
                  }`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="overflow-hidden">
                    <img src={p.image} alt={p.name}
                      className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{p.brand}</div>
                    <div className={`mt-1 text-xs font-semibold leading-snug line-clamp-2 ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>{p.name}</div>
                    <div className={`mt-1.5 text-sm font-bold ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>{formatPrice(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // ── Слайд 3: Категории ───────────────────────────────────────
    {
      id: 'cats',
      accent: '#A78BFA',
      label: 'Разделы',
      content: ({ accent }) => (
        <div
          className={`relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl sm:min-h-[420px] ${
            isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-[#f5f0ff] to-[#ede8ff]'
          }`}
        >
          <Circle size={300} top="-80px" left="-60px" color={accent} opacity={0.1} />
          <Circle size={150} bottom="0" right="5%" color={accent} opacity={0.08} />

          <div className="relative z-10 p-6 sm:p-8">
            <Tag color={accent}>✦ Маршрут по beauty-задачам</Tag>

            <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <h2 className={`font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[0.95] ${isDark ? 'text-slate-100' : 'text-[#1a1a1a]'}`}>
                Быстро найти<br />нужное
              </h2>
              <p className={`max-w-xs text-sm leading-6 lg:text-right ${isDark ? 'text-slate-300/80' : 'text-[#1a1a1a]/55'}`}>
                Три направления — переходите прямо к нужному ассортименту.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {cats.map((cat, i) => (
                <Link key={cat.slug} to={`/catalog?category=${cat.slug}`}
                  className={`group relative overflow-hidden rounded-2xl transition hover:-translate-y-1 ${
                    isDark ? 'bg-slate-900 shadow-[0_4px_14px_rgba(2,6,23,0.4)]' : 'bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <img src={cat.image} alt={cat.title}
                      className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1a1a1a]/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <div>
                      <div className="text-base font-bold text-white">{cat.title}</div>
                      <div className="text-[11px] text-white/70 line-clamp-1">{cat.description}</div>
                    </div>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#1a1a1a] transition group-hover:scale-110"
                      style={{ background: accent }}>
                      <FiArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];
}

// ─── Атомарные компоненты ─────────────────────────────────────────────
function Tag({ color, dark, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
      style={{
        background: `${color}20`,
        color: dark ? color : color,
        border: `1px solid ${color}40`,
      }}>
      {children}
    </span>
  );
}

function PillLink({ to, bg, color, border, children, className = '' }) {
  return (
    <Link to={to}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold transition hover:opacity-80 ${className}`}
      style={{
        background: bg,
        color,
        border: border ? `1.5px solid ${color}30` : 'none',
      }}>
      {children}
    </Link>
  );
}

function Circle({ size, top, bottom, left, right, color, opacity }) {
  return (
    <div className="pointer-events-none absolute rounded-full"
      style={{
        width: size, height: size,
        top, bottom, left, right,
        background: color,
        opacity,
        filter: 'blur(40px)',
      }}
    />
  );
}

// ─── Главный компонент ────────────────────────────────────────────────
export default function HeroLookbook({ recommendations = [], discounts = [], formatPrice, siteTexts }) {
  const isDark = useThemeStore((state) => state.isDark);
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const pendingRef = useRef(null);

  const slides = buildSlides({ recommendations, discounts, formatPrice, siteTexts, isDark });

  const goTo = useCallback((next) => {
    if (next === active || fading) return;
    setFading(true);
    pendingRef.current = next;
    setTimeout(() => {
      setActive(next);
      setFading(false);
    }, 380);
  }, [active, fading]);

  const goNext = useCallback(() => goTo((active + 1) % slides.length), [active, goTo, slides.length]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(goNext, INTERVAL);
    return () => clearTimeout(t);
  }, [active, paused, goNext]);

  const current = slides[active];

  return (
    <div
      className="relative dark:[color-scheme:dark]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'scale(0.985)' : 'scale(1)',
          transition: 'opacity 0.38s ease, transform 0.38s ease',
        }}
      >
        {current.content({ accent: current.accent, product: current.product })}
      </div>

      <div className="mt-3 flex items-stretch gap-2.5 overflow-x-auto pb-1">
        {slides.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="group relative flex min-w-[104px] flex-none flex-col items-start overflow-hidden rounded-xl px-3 py-2.5 text-left transition-all sm:min-w-0 sm:flex-1 sm:px-4"
              style={{
                background: isActive ? s.accent : isDark ? '#1f2937' : '#f5f5f5',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isActive ? `0 4px 12px ${s.accent}40` : 'none',
              }}
            >
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10">
                  <div
                    key={active}
                    className="h-full bg-black/20 rounded-r-full"
                    style={{ animation: paused ? 'none' : `lb-progress ${INTERVAL}ms linear forwards` }}
                  />
                </div>
              )}

              <span
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: isActive ? '#fff' : isDark ? '#9ca3af' : '#999' }}
              >
                0{i + 1}
              </span>
              <span
                className="mt-0.5 text-xs font-bold sm:text-sm"
                style={{ color: isActive ? '#fff' : isDark ? '#f3f4f6' : '#1a1a1a' }}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes lb-progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  );
}