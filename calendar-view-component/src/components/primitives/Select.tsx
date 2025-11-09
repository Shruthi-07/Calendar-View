import React from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Select an option',
  className,
  disabled,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="select-wrapper">
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
          error ? 'border-error-500' : 'border-neutral-300',
          disabled && 'bg-neutral-100 cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
    </div>
  );
};

export default Select;