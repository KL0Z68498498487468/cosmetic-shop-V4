import { Link } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Button from '@/components/common/Button/index.jsx';

const NotFoundPage = () => {
  return (
    <>
      <Seo title="Страница не найдена | Lumina" />
      <div className="container-shell py-20">
        <div className="surface-card p-12 text-center">
          <div className="font-display text-7xl text-accent">404</div>
          <h1 className="mt-4 text-3xl font-semibold text-ink dark:text-slate-100">Страница не найдена</h1>
          <p className="mt-3 text-muted">Возможно, ссылка устарела или страница была перемещена.</p>
          <Button as={Link} to="/" className="mt-6">
            На главную
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
