import React, { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[#1A1A1D] rounded-xl p-5 md:p-6 backdrop-blur-sm ${
        bordered ? 'border border-[#27272A]' : ''
      } ${
        hoverEffect
          ? 'transition-all duration-200 hover:border-[#3F3F46] hover:shadow-xl hover:shadow-black/60'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-base md:text-lg font-semibold text-[#F8FAFC] tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-xs md:text-sm text-[#A1A1AA] leading-relaxed ${className}`}>{children}</p>;

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`mt-5 pt-4 border-t border-[#27272A] flex items-center justify-between ${className}`}>
    {children}
  </div>
);
