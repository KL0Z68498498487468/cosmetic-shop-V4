import Button from '@/components/common/Button/index.jsx';
import { useFilterStore } from '@/store/filterStore.js';

const FilterSidebar = ({ brands, categories = [] }) => {
  const { filters, setFilter, resetFilters } = useFilterStore();

  return (
    <aside className="glass-panel rounded-[2rem] p-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-ink dark:text-slate-100">Фильтры</div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-semibold text-accent"
        >
          Сбросить
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">Категория</div>
          <select
            value={filters.category}
            onChange={(event) => setFilter('category', event.target.value)}
            className="focus-ring h-11 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">Бренд</div>
          <select
            value={filters.brand}
            onChange={(event) => setFilter('brand', event.target.value)}
            className="focus-ring h-11 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Все бренды</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">Цена</div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(event) => setFilter('minPrice', Number(event.target.value))}
              className="focus-ring h-11 rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="От"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(event) => setFilter('maxPrice', Number(event.target.value))}
              className="focus-ring h-11 rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="До"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">Рейтинг от</div>
          <div className="flex gap-2">
            {[0, 4, 4.5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFilter('rating', rating)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  filters.rating === rating
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                }`}
              >
                {rating === 0 ? 'Любой' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm text-ink dark:text-slate-200">
          {[
            { key: 'inStock', label: 'Только в наличии' },
            { key: 'newOnly', label: 'Новинки' },
            { key: 'discountOnly', label: 'Со скидкой' }
          ].map((option) => (
            <label key={option.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filters[option.key]}
                onChange={(event) => setFilter(option.key, event.target.checked)}
              />
              {option.label}
            </label>
          ))}
        </div>

        <Button type="button" variant="secondary" onClick={resetFilters} className="w-full">
          Очистить параметры
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
