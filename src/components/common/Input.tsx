import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#A1A1AA]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#A1A1AA] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#111113] border rounded-lg py-2 text-sm text-[#F8FAFC] placeholder-[#71717A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFBF24]/40 focus:border-[#FFBF24] ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightIcon ? 'pr-9' : 'pr-3.5'} ${
              error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/40' : 'border-[#27272A]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#A1A1AA] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <span className="text-[11px] text-[#EF4444] font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-[#71717A]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
