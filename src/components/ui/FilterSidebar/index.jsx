import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/index.jsx';
import { useFilterStore } from '@/store/filterStore.js';

const FilterSidebar = ({ brands, categories = [] }) => {
  const { t } = useTranslation();
  const { filters, setFilter, resetFilters } = useFilterStore();

  return (
    <aside className="glass-panel rounded-[2rem] p-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-ink dark:text-slate-100">{t('common.filters')}</div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-semibold text-accent"
        >
          {t('common.reset')}
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">{t('common.category')}</div>
          <select
            value={filters.category}
            onChange={(event) => setFilter('category', event.target.value)}
            className="focus-ring h-11 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">{t('common.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">{t('common.brand')}</div>
          <select
            value={filters.brand}
            onChange={(event) => setFilter('brand', event.target.value)}
            className="focus-ring h-11 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">{t('common.allBrands')}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">{t('common.price')}</div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(event) => setFilter('minPrice', Number(event.target.value))}
              className="focus-ring h-11 rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder={t('common.from')}
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(event) => setFilter('maxPrice', Number(event.target.value))}
              className="focus-ring h-11 rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder={t('common.to')}
            />
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">{t('common.ratingFrom')}</div>
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
                {rating === 0 ? t('common.any') : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm text-ink dark:text-slate-200">
          {[
            { key: 'inStock', label: t('common.inStockOnly') },
            { key: 'newOnly', label: t('common.newOnly') },
            { key: 'discountOnly', label: t('common.discountOnly') }
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
          {t('common.clearFilters')}
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
