import React from 'react';
import { cn } from '../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-text-secondary">
            {label}
            {props.required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'glass-input w-full px-3.5 py-2.5 text-sm appearance-none min-h-[44px] cursor-pointer pr-10',
              error && 'border-status-error/80 focus:border-status-error focus:ring-status-error/30',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-surface-base text-text-disabled">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-card-solid text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            ▼
          </div>
        </div>
        {error && <span className="text-xs text-status-error font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
