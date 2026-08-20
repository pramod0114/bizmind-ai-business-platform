import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-[#A1A1AA]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-[#111113] border rounded-lg px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#71717A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFBF24]/40 focus:border-[#FFBF24] ${
            error ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#27272A]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1A1A1D] text-[#F8FAFC]">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-[11px] text-[#EF4444] font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-[#71717A]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
