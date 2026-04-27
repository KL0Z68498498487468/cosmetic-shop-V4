import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/helpers.js';

const languageOptions = [
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' },
  { value: 'uz', label: 'UZ' }
];

const LanguageSwitcher = ({ className }) => {
  const { i18n, t } = useTranslation();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 dark:border-slate-700 dark:bg-slate-900',
        className
      )}
      aria-label={t('common.language')}
    >
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => i18n.changeLanguage(option.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-bold transition',
            i18n.language === option.value
              ? 'bg-ink text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-roseBrown/75 hover:text-accent dark:text-slate-300'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
