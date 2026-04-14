import { FiStar } from 'react-icons/fi';

const Rating = ({ value, reviewsCount, size = 'sm' }) => {
  return (
    <div className={`flex items-center gap-2 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
      <div className="flex items-center gap-1 text-gold">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={index < Math.round(value) ? 'fill-current' : ''}
          />
        ))}
      </div>
      <span className="font-semibold text-ink dark:text-slate-100">{value}</span>
      {reviewsCount ? <span className="text-roseBrown/70 dark:text-slate-400">({reviewsCount})</span> : null}
    </div>
  );
};

export default Rating;
