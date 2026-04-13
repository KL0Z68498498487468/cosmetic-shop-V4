import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumbs = ({ items }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-roseBrown/80">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="transition hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-ink">{item.label}</span>
          )}
          {index !== items.length - 1 ? <FiChevronRight className="text-xs" /> : null}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
