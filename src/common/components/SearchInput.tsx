import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
}) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      leftIcon={<Search size={18} />}
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer"
          >
            <X size={16} />
          </button>
        ) : undefined
      }
    />
  );
};
