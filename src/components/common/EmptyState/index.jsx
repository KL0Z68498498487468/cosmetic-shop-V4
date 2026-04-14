import { Link } from 'react-router-dom';
import Button from '@/components/common/Button/index.jsx';

const EmptyState = ({ title, description, actionLabel, actionTo = '/catalog' }) => {
  return (
    <div className="surface-card rounded-[2rem] border-dashed p-10 text-center">
      <h3 className="text-2xl font-semibold text-ink dark:text-slate-100">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-muted">{description}</p>
      {actionLabel ? (
        <Button as={Link} to={actionTo} className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
