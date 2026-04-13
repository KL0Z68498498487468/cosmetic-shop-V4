import { Link } from 'react-router-dom';
import Button from '@/components/common/Button/index.jsx';

const EmptyState = ({ title, description, actionLabel, actionTo = '/catalog' }) => {
  return (
    <div className="rounded-[2rem] border border-dashed border-line bg-white/80 p-10 text-center shadow-card">
      <h3 className="text-2xl font-semibold text-ink">{title}</h3>
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
