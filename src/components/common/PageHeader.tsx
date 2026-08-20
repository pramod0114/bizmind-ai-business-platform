import React, { ReactNode } from 'react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  badgeVariant = 'primary',
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#27272A]">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            {title}
          </h1>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        <p className="text-xs md:text-sm text-[#A1A1AA] mt-1 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
