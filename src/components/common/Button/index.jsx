import { createElement } from 'react';
import { cn } from '@/utils/helpers.js';

const styles = {
  primary:
    'border-transparent bg-ink text-white shadow-glow hover:bg-accent hover:text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-accent dark:hover:text-white',
  secondary:
    'border border-line bg-white/80 text-ink hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-accent dark:hover:text-accent',
  ghost:
    'border-transparent bg-transparent text-ink hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-800/70',
  soft:
    'border border-white/60 bg-blush/70 text-ink hover:bg-blush dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
};

const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  as: Component = 'button',
  ...props
}) => {
  const sizeClass =
    size === 'sm'
      ? 'h-10 px-4 text-sm'
      : size === 'lg'
        ? 'h-14 px-7 text-base'
        : 'h-12 px-5 text-sm';

  return createElement(
    Component,
    {
      className: cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60',
        sizeClass,
        styles[variant],
        className
      ),
      ...props
    },
    <>
      {icon}
      {children}
    </>
  );
};

export default Button;
