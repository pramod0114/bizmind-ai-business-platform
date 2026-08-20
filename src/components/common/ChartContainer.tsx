import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  height?: number | string;
  children: ReactNode;
  isPlaceholder?: boolean;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  actions,
  height = 280,
  children,
  isPlaceholder = false,
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {isPlaceholder && (
              <span className="text-[10px] font-mono bg-[#111113] border border-[#27272A] text-[#71717A] px-1.5 py-0.5 rounded">
                Placeholder Preview
              </span>
            )}
          </div>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </CardHeader>
      <CardContent className="flex-1 w-full" style={{ minHeight: height }}>
        {children}
      </CardContent>
    </Card>
  );
};
