import React from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-brand-accent/40 active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2.5 rounded-xl gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 min-h-[52px]',
    };

    const variantStyles = {
      primary:
        'glass-button-primary text-white font-semibold',
      secondary:
        'glass-button-secondary text-text-primary hover:text-white',
      accent:
        'bg-brand-accent text-surface-base font-semibold hover:bg-brand-primary-light shadow-md shadow-brand-accent/20',
      danger:
        'bg-status-error/20 border border-status-error/40 text-status-error hover:bg-status-error/30 hover:border-status-error focus:ring-status-error/40',
      ghost:
        'text-text-secondary hover:text-text-primary hover:bg-surface-card bg-transparent border-transparent',
      outline:
        'border border-border-medium text-text-primary hover:bg-surface-card hover:border-brand-accent/50',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'sm' ? 'sm' : 'md'} />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
