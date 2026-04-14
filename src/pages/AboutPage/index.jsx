import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import AnimatedSection from '@/components/ui/AnimatedSection/index.jsx';

const AboutPage = () => {
  return (
    <>
      <Seo title="О нас | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'О нас' }]} />
        <AnimatedSection className="surface-card mt-6 p-8">
          <h1 className="section-title">О бренде Lumina</h1>
          <p className="mt-5 max-w-3xl text-muted">
            Lumina появился как цифровой beauty-бутик для тех, кто ценит осмысленный ассортимент,
            честный сервис и красивый пользовательский опыт. Мы соединяем селективные бренды,
            любимые хиты и понятную навигацию, чтобы выбор был быстрым и приятным.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              'Курируем ассортимент, а не перегружаем каталог случайными позициями.',
              'Работаем только с официальными поставками и понятными условиями возврата.',
              'Делаем магазин комфортным и с телефона, и с большого экрана.'
            ].map((item) => (
              <div key={item} className="rounded-[2rem] bg-pearl p-6 text-sm leading-6 text-ink dark:bg-slate-800 dark:text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </>
  );
};

export default AboutPage;
