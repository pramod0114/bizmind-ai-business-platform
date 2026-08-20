import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0B0C] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  };

  const variantClasses = {
    primary:
      'bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] font-semibold shadow-sm focus:ring-[#FFBF24] active:scale-[0.99]',
    secondary:
      'bg-[#1A1A1D] hover:bg-[#27272A] text-[#F8FAFC] border border-[#27272A] focus:ring-[#FFBF24]',
    outline:
      'bg-transparent hover:bg-[#1A1A1D] text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#27272A] focus:ring-[#FFBF24]',
    ghost:
      'bg-transparent hover:bg-[#1A1A1D] text-[#A1A1AA] hover:text-[#F8FAFC] focus:ring-[#FFBF24]',
    danger:
      'bg-[#EF4444] hover:bg-red-600 text-white shadow-sm focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
