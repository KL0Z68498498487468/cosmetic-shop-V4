import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Seo from '@/components/common/Seo/index.jsx';

const DeliveryPage = () => {
  const { t } = useTranslation();
  const options = t('deliveryPage.options', { returnObjects: true });

  return (
    <>
      <Seo title={`${t('common.delivery')} | Lumina`} />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.delivery') }]} />
        <div className="surface-card mt-6 p-8">
          <h1 className="section-title">{t('deliveryPage.title')}</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {options.map((item) => (
              <div key={item.title} className="rounded-[2rem] bg-pearl p-6 dark:bg-slate-800">
                <div className="text-xl font-semibold text-ink dark:text-slate-100">{item.title}</div>
                <p className="mt-3 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryPage;
