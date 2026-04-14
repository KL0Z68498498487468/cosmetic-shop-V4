import { SwiperSlide } from 'swiper/react';
import { FiArrowRight, FiGift, FiShield, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import ProductCard from '@/components/product/ProductCard/index.jsx';
import ProductQuickView from '@/components/product/ProductQuickView/index.jsx';
import AnimatedSection from '@/components/ui/AnimatedSection/index.jsx';
import Carousel from '@/components/ui/Carousel/index.jsx';
import CountdownTimer from '@/components/ui/CountdownTimer/index.jsx';
import SectionHeading from '@/components/ui/SectionHeading/index.jsx';
import HeroSlider from '@/components/HeroSlider/HeroSlider.jsx';
import { siteTexts } from '@/constants/texts.js';
import useProducts from '@/hooks/useProducts.js';
import { formatPrice } from '@/utils/formatPrice.js';
import { useMemo, useState } from 'react';

const HomePage = () => {
  const { data: products = [] } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const topDay = useMemo(() => products.filter((product) => product.topDay), [products]);
  const topWeek = useMemo(() => products.filter((product) => product.topWeek), [products]);
  const recommendations = useMemo(
    () => [...products].sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 4),
    [products]
  );
  const discounts = useMemo(() => products.filter((product) => product.oldPrice).slice(0, 4), [products]);

  return (
    <>
      <Seo
        title="Lumina Beauty Store"
        description="Премиальный интернет-магазин косметики, парфюмерии и beauty-ритуалов."
      />

      <div className="container-shell py-8 sm:py-10">
        <AnimatedSection className="overflow-hidden rounded-[2.5rem] shadow-soft">
  <HeroSlider
    recommendations={recommendations}
    discounts={discounts}
    formatPrice={formatPrice}
    siteTexts={siteTexts}
  />
</AnimatedSection>

        <div className="mt-20 space-y-20">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Top дня"
              title="Быстро разбирают сегодня"
              description="Товары, которые чаще всего добавляют в корзину прямо сейчас."
              action={
                <Button as={Link} to="/catalog" variant="ghost">
                  Весь каталог <FiArrowRight />
                </Button>
              }
            />
            <div className="mt-8">
              <Carousel>
                {topDay.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </SwiperSlide>
                ))}
              </Carousel>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SectionHeading
              eyebrow="Top недели"
              title="Любимцы покупателей"
              description="Проверенные хиты: от мягкого очищения до парфюма для подарка."
            />
            <div className="mt-8">
              <Carousel>
                {topWeek.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </SwiperSlide>
                ))}
              </Carousel>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SectionHeading
              eyebrow="Персонально"
              title="Рекомендации для вас"
              description="Собрали продукты с высоким рейтингом и самым высоким потенциалом повтора покупки."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="rounded-[2.5rem] bg-gradient-to-r from-ink via-[#2f1d25] to-[#402733] p-8 text-white shadow-soft sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-white/60">
                  Лучшие скидки
                </div>
                <h2 className="mt-4 font-display text-5xl leading-none">
                  До -30% на уход и макияж до конца акции
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
                  Финальные часы весенней акции. Добавили таймер, чтобы успеть забрать бестселлеры
                  по лучшей цене.
                </p>
                <div className="mt-6">
                  <CountdownTimer targetDate="2026-04-14T23:59:59" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {discounts.map((product) => (
                  <div key={product.id} className="rounded-[2rem] bg-white/10 p-4 backdrop-blur">
                    <div className="text-sm text-white/60">{product.brand}</div>
                    <div className="mt-2 text-xl font-semibold">{product.name}</div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="text-lg font-bold">{formatPrice(product.price)}</div>
                      <div className="text-sm text-white/50 line-through">
                        {formatPrice(product.oldPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SectionHeading
              eyebrow="Категории"
              title="Маршрут по вашим beauty-задачам"
              description="Три направления, чтобы быстрее перейти к нужному ассортименту."
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {siteTexts.categories.map((category, index) => (
                <Link
                  key={category.slug}
                  to={`/catalog?category=${category.slug}`}
                  className={`group overflow-hidden rounded-[2rem] p-6 shadow-card transition hover:-translate-y-1 ${
                    index === 1 ? 'bg-mist' : index === 2 ? 'bg-mint' : 'bg-white'
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-72 w-full rounded-[1.6rem] object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold text-ink">{category.title}</div>
                      <div className="mt-2 text-sm text-roseBrown/75">{category.description}</div>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white">
                      <FiArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
};

export default HomePage;
