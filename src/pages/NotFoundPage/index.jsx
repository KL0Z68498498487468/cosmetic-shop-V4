import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button/index.jsx';
import Seo from '@/components/common/Seo/index.jsx';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={`${t('notFoundPage.title')} | Lumina`} />
      <div className="container-shell py-20">
        <div className="surface-card p-12 text-center">
          <div className="font-display text-7xl text-accent">404</div>
          <h1 className="mt-4 text-3xl font-semibold text-ink dark:text-slate-100">{t('notFoundPage.title')}</h1>
          <p className="mt-3 text-muted">{t('notFoundPage.description')}</p>
          <Button as={Link} to="/" className="mt-6">
            {t('common.backHome')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
