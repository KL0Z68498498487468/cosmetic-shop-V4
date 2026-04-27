import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Seo = ({
  title,
  description,
  image = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=80'
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title || t('seo.defaultTitle');
  const resolvedDescription = description || t('seo.defaultDescription');

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

export default Seo;
