import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiGift, FiShield, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../common/Button/index.jsx';

const slides = (siteTexts, recommendations, discounts, formatPrice) => [
  // ─── Слайд 1: Главный ───────────────────────────────────────────
  {
    id: 'hero',
    render: () => (
      <div className="relative min-h-[560px] bg-hero-grid px-8 py-12 sm:px-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.35em] text-roseBrown/70">
              {siteTexts.hero.overline}
            </div>
            <h1 className="mt-5 font-display text-5xl leading-none text-ink sm:text-6xl">
              {siteTexts.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-roseBrown/85">
              {siteTexts.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/catalog" size="lg">
                {siteTexts.hero.ctaPrimary}
              </Button>
              <Button as={Link} to="/blog" variant="secondary" size="lg">
                {siteTexts.hero.ctaSecondary}
              </Button>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { icon: <FiTruck />, text: 'Доставка день в день по Ташкенту' },
                { icon: <FiGift />,  text: 'Подарок к заказам от 400 000 сум' },
                { icon: <FiShield />, text: 'Только официальные поставки' },
              ].map((item) => (
                <div key={item.text} className="glass-panel rounded-[1.5rem] p-4 text-sm text-ink">
                  <div className="mb-3 text-accent">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid gap-4 sm:grid-cols-2">
            {recommendations.slice(0, 2).map((product, index) => (
              <div
                key={product.id}
                className={`rounded-[2rem] bg-white/80 p-4 shadow-card ${index === 0 ? 'translate-y-8' : ''}`}
              >
                <img src={product.image} alt={product.name} className="h-56 w-full rounded-[1.5rem] object-cover" />
                <div className="mt-4 text-sm uppercase tracking-[0.25em] text-roseBrown/70">{product.brand}</div>
                <div className="mt-2 text-xl font-semibold text-ink">{product.name}</div>
                <div className="mt-2 text-sm text-roseBrown/75">{formatPrice(product.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ─── Слайд 2: Акция ─────────────────────────────────────────────
  {
    id: 'promo',
    render: () => (
      <div className="relative min-h-[560px] bg-gradient-to-br from-ink via-[#2f1d25] to-[#402733] px-8 py-12 sm:px-12 sm:py-16 flex items-center">
        {/* декоративные круги */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-roseBrown/20 blur-2xl" />

        <div className="relative z-10 w-full grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <div className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
              🔥 Горячие скидки
            </div>
            <h2 className="mt-5 font-display text-5xl leading-none sm:text-6xl">
              До&nbsp;<span className="text-accent">−30%</span><br />на уход<br />и макияж
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Финальные часы весенней акции. Успейте забрать бестселлеры по лучшей цене.
            </p>
            <Button as={Link} to="/catalog" size="lg" className="mt-8">
              Смотреть акции <FiArrowRight />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {discounts.map((product) => (
              <div key={product.id} className="rounded-[2rem] bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <div className="text-xs text-white/50 uppercase tracking-widest">{product.brand}</div>
                <div className="mt-2 text-lg font-semibold text-white leading-snug">{product.name}</div>
                <div className="mt-4 flex items-end gap-3">
                  <div className="text-xl font-bold text-white">{formatPrice(product.price)}</div>
                  <div className="pb-0.5 text-sm text-white/40 line-through">{formatPrice(product.oldPrice)}</div>
                </div>
                <div className="mt-3 inline-block rounded-full bg-accent/80 px-3 py-1 text-xs font-bold text-white">
                  −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ─── Слайд 3: Персональные рекомендации ─────────────────────────
  {
    id: 'picks',
    render: () => (
      <div className="relative min-h-[560px] bg-[#fdf6f0] px-8 py-12 sm:px-12 sm:py-16 flex items-center">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-mist/60 to-transparent" />
        <div className="relative z-10 w-full">
          <div className="text-sm font-bold uppercase tracking-[0.35em] text-roseBrown/60">
            ✦ Персонально для вас
          </div>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">
            Хиты с высоким<br />рейтингом
          </h2>
          <p className="mt-5 max-w-md text-base text-roseBrown/75">
            Продукты, которые покупают снова и снова — проверено нашими клиентами.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {recommendations.slice(0, 4).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block">
                <div className="overflow-hidden rounded-[1.8rem] bg-white shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:shadow-soft">
                  <img src={product.image} alt={product.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-widest text-roseBrown/60">{product.brand}</div>
                    <div className="mt-1 text-sm font-semibold text-ink leading-snug">{product.name}</div>
                    <div className="mt-2 text-sm font-bold text-accent">{formatPrice(product.price)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ─── Слайд 4: Категории / «Маршрут» ─────────────────────────────
  {
    id: 'categories',
    render: () => (
      <div className="relative min-h-[560px] bg-gradient-to-br from-mint/40 via-white to-mist px-8 py-12 sm:px-12 sm:py-16 flex items-center">
        <div className="w-full">
          <div className="text-sm font-bold uppercase tracking-[0.35em] text-roseBrown/60">
            ✦ Категории
          </div>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">
            Маршрут по<br />beauty-задачам
          </h2>
          <p className="mt-5 max-w-md text-base text-roseBrown/75">
            Три направления — быстрый переход к нужному ассортименту.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {siteTexts.categories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/catalog?category=${category.slug}`}
                className={`group relative overflow-hidden rounded-[2rem] p-5 shadow-card transition hover:-translate-y-1 ${
                  index === 1 ? 'bg-mist' : index === 2 ? 'bg-mint' : 'bg-white'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-52 w-full rounded-[1.6rem] object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold text-ink">{category.title}</div>
                    <div className="mt-1 text-sm text-roseBrown/70">{category.description}</div>
                  </div>
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-white shadow-sm">
                    <FiArrowRight size={16} />
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

// ── Dot indicator ────────────────────────────────────────────────────
function Dot({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`transition-all duration-300 rounded-full ${
        active ? 'w-6 h-2.5 bg-ink' : 'w-2.5 h-2.5 bg-ink/25 hover:bg-ink/50'
      }`}
    />
  );
}

// ── Главный компонент ────────────────────────────────────────────────
export default function HeroSlider({ recommendations, discounts, formatPrice, siteTexts }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const allSlides = slides(siteTexts, recommendations, discounts, formatPrice);

  const go = useCallback(
    (index, dir = 'next') => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating, current]
  );

  const prev = () => go((current - 1 + allSlides.length) % allSlides.length, 'prev');
  const next = useCallback(() => go((current + 1) % allSlides.length, 'next'), [current, go, allSlides.length]);

  // автоплей каждые 6 секунд
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const translateClass =
    animating
      ? direction === 'next'
        ? '-translate-x-8 opacity-0'
        : 'translate-x-8 opacity-0'
      : 'translate-x-0 opacity-100';

  return (
    <div className="relative overflow-hidden rounded-[2.5rem]">
      {/* Слайд */}
      <div className={`transition-all duration-400 ease-out ${translateClass}`}>
        {allSlides[current].render()}
      </div>

      {/* Прогресс-бар */}
      <div className="absolute top-0 left-0 h-1 w-full bg-black/10">
        <div
          key={current}
          className="h-full bg-accent/70 rounded-r-full"
          style={{ animation: 'progress 6s linear forwards' }}
        />
      </div>

      {/* Стрелки */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/80 shadow-card backdrop-blur-sm transition hover:bg-white hover:scale-105"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={() => go((current + 1) % allSlides.length, 'next')}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/80 shadow-card backdrop-blur-sm transition hover:bg-white hover:scale-105"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Точки */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {allSlides.map((s, i) => (
          <Dot key={s.id} active={i === current} onClick={() => go(i, i > current ? 'next' : 'prev')} />
        ))}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  );
}