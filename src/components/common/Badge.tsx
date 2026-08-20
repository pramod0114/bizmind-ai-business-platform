import React, { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full tracking-wide uppercase whitespace-nowrap transition-colors';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    default: 'bg-[#1A1A1D] text-[#A1A1AA] border border-[#27272A]',
    primary: 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30 font-semibold',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-semibold',
    warning: 'bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30 font-semibold',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 font-semibold',
    neutral: 'bg-[#111113] text-[#A1A1AA] border border-[#27272A]',
    outline: 'bg-transparent text-[#A1A1AA] border border-[#27272A]',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
