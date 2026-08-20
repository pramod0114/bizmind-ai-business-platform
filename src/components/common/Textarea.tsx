import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-medium text-[#A1A1AA]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-[#111113] border rounded-lg p-3 text-sm text-[#F8FAFC] placeholder-[#71717A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFBF24]/40 focus:border-[#FFBF24] resize-y ${
            error ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#27272A]'
          } ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-[11px] text-[#EF4444] font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-[#71717A]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
