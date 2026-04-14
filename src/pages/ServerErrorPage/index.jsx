import { Link } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Button from '@/components/common/Button/index.jsx';

const ServerErrorPage = () => {
  return (
    <>
      <Seo title="Ошибка сервера | Lumina" />
      <div className="container-shell py-20">
        <div className="surface-card p-12 text-center">
          <div className="font-display text-7xl text-accent">500</div>
          <h1 className="mt-4 text-3xl font-semibold text-ink dark:text-slate-100">Что-то пошло не так</h1>
          <p className="mt-3 text-muted">Попробуйте обновить страницу или вернуться на главную.</p>
          <Button as={Link} to="/" className="mt-6">
            Вернуться на главную
          </Button>
        </div>
      </div>
    </>
  );
};

export default ServerErrorPage;
