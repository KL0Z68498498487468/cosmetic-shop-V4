import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/ui/AnimatedSection/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Seo from '@/components/common/Seo/index.jsx';

const AboutPage = () => {
  const { t } = useTranslation();
  const points = t('aboutPage.points', { returnObjects: true });

  return (
    <>
      <Seo title={`${t('common.about')} | Lumina`} />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.about') }]} />
        <AnimatedSection className="surface-card mt-6 p-8">
          <h1 className="section-title">{t('aboutPage.title')}</h1>
          <p className="mt-5 max-w-3xl text-muted">
            {t('aboutPage.body')}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {points.map((item) => (
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
