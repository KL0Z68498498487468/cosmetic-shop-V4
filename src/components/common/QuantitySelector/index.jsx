const QuantitySelector = ({ value, onChange }) => {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="grid h-10 w-10 place-items-center rounded-full text-lg transition hover:bg-blush"
      >
        -
      </button>
      <span className="min-w-10 text-center font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-10 w-10 place-items-center rounded-full text-lg transition hover:bg-blush"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
