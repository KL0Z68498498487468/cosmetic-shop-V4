import { Helmet } from 'react-helmet-async';

const Seo = ({
  title = 'Lumina Beauty Store',
  description = 'Премиальный интернет-магазин косметики, парфюмерии и beauty-товаров.',
  image = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=80'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

export default Seo;
