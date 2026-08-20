import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  description?: string;
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  description = 'Connecting to BizMind backend intelligence service',
  minHeight = 'min-h-[260px]',
}) => {
  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 text-center rounded-xl bg-[#111113]/60 border border-[#27272A]`}
    >
      <div className="w-10 h-10 rounded-full bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-center mb-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#FFBF24]" />
      </div>
      <h4 className="text-sm font-semibold text-[#F8FAFC]">{message}</h4>
      {description && <p className="text-xs text-[#A1A1AA] mt-1 max-w-sm">{description}</p>}
    </div>
  );
};
