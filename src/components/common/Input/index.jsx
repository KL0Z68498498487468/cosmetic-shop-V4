import { cn } from '@/utils/helpers.js';

const Input = ({ label, error, className, ...props }) => {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">{label}</span> : null}
      <input
        className={cn(
          'focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-roseBrown/60 focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error ? <span className="mt-2 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
};

export default Input;
