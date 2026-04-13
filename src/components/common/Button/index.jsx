import { createElement } from 'react';
import { cn } from '@/utils/helpers.js';

const styles = {
  primary:
    'bg-ink text-white shadow-glow hover:bg-accent hover:text-white border-transparent',
  secondary: 'border border-line bg-white/80 text-ink hover:border-accent hover:text-accent',
  ghost: 'border-transparent bg-transparent text-ink hover:bg-white/70',
  soft: 'border border-white/60 bg-blush/70 text-ink hover:bg-blush'
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
        'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]',
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
