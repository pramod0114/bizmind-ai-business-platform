import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  minHeight?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  minHeight = 'min-h-[280px]',
}) => {
  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 text-center rounded-xl bg-[#111113]/50 border border-[#27272A] border-dashed`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center mb-3.5 text-[#FFBF24]">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-sm md:text-base font-semibold text-[#F8FAFC]">{title}</h4>
      <p className="text-xs md:text-sm text-[#A1A1AA] mt-1 max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
