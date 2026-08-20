import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  minHeight?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load content',
  message,
  onRetry,
  minHeight = 'min-h-[220px]',
}) => {
  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center p-6 text-center rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30`}
    >
      <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center mb-3 text-[#EF4444]">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-[#F8FAFC]">{title}</h4>
      <p className="text-xs text-[#EF4444]/90 mt-1 max-w-md">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
};
