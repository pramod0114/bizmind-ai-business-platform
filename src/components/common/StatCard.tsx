import React, { ReactNode } from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  isPlaceholder?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  trend,
  change,
  isPlaceholder = false,
}) => {
  return (
    <Card hoverEffect className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {value}
            </span>
            {isPlaceholder && (
              <span className="text-[10px] text-[#71717A] font-mono bg-[#111113] border border-[#27272A] px-1.5 py-0.5 rounded">
                Placeholder
              </span>
            )}
          </div>
          {(sublabel || change) && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#A1A1AA]">
              {trend === 'up' && (
                <span className="flex items-center text-[#22C55E] font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {trend === 'down' && (
                <span className="flex items-center text-[#EF4444] font-medium">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {trend === 'neutral' && (
                <span className="flex items-center text-[#A1A1AA] font-medium">
                  <Minus className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {sublabel && <span className="text-[#71717A]">{sublabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
