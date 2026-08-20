import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[#1A1A1D] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
          <div>
            <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
            {description && (
              <p className="text-xs text-[#A1A1AA] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#27272A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="p-4 bg-[#111113] border-t border-[#27272A] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
