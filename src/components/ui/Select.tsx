import React, { useId } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  placeholder,
  fullWidth = true,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={clsx(
            'w-full border rounded-lg px-3 py-2 text-sm bg-white text-foreground appearance-none pr-10',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-school-600 focus:border-school-600',
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-border hover:border-muted-foreground',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};

export default Select;
