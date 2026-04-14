const QuantitySelector = ({ value, onChange }) => {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="focus-ring grid h-10 w-10 place-items-center rounded-full text-lg transition hover:bg-blush dark:text-slate-100 dark:hover:bg-slate-800"
      >
        -
      </button>
      <span className="min-w-10 text-center font-semibold dark:text-slate-100">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="focus-ring grid h-10 w-10 place-items-center rounded-full text-lg transition hover:bg-blush dark:text-slate-100 dark:hover:bg-slate-800"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
