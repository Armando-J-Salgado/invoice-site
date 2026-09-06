import React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'cash' | 'nequi' | 'transfer' | 'contado' | 'factura';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  const variantStyles = {
    success: 'bg-status-success/15 text-status-success border border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    error: 'bg-status-error/15 text-status-error border border-status-error/30',
    info: 'bg-status-info/15 text-status-info border border-status-info/30',
    neutral: 'bg-surface-card text-text-secondary border border-border-subtle',
    cash: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    nequi: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    transfer: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    contado: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
    factura: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 shrink-0 select-none backdrop-blur-sm',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
