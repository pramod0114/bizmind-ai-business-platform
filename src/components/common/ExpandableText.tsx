import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export interface ExpandableTextProps {
  /** Text string to automatically truncate and expand */
  text?: string;
  /** Arbitrary children content to hide until toggled */
  children?: React.ReactNode;
  /** Maximum number of preview characters if using text prop */
  maxChars?: number;
  /** Label for expand action */
  label?: string;
  /** Label for collapse action */
  collapseLabel?: string;
  /** Initial expansion state */
  defaultExpanded?: boolean;
  /** Additional wrapper CSS classes */
  className?: string;
  /** Styling for the toggle button */
  buttonClassName?: string;
}

/**
 * ExpandableText / CollapsibleDisclosure component
 * Keeps dense copy and verbose text hidden by default, expanding with a clean '>' chevron toggle.
 */
export const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  children,
  maxChars = 130,
  label = 'Show more',
  collapseLabel = 'Show less',
  defaultExpanded = false,
  className = '',
  buttonClassName = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (text !== undefined) {
    const isLong = text.length > maxChars;
    if (!isLong) {
      return <p className={`leading-relaxed ${className}`}>{text}</p>;
    }

    return (
      <div className={`space-y-1.5 ${className}`}>
        <p className="leading-relaxed text-inherit">
          {isExpanded ? text : `${text.slice(0, maxChars)}...`}
        </p>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`inline-flex items-center gap-1 text-xs font-semibold text-[#FFBF24] hover:text-[#F59E0B] transition-colors cursor-pointer group focus:outline-none ${buttonClassName}`}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? collapseLabel : label}</span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
              isExpanded ? 'rotate-90' : 'group-hover:translate-x-0.5'
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFBF24] hover:text-[#F59E0B] transition-colors cursor-pointer group focus:outline-none ${buttonClassName}`}
        aria-expanded={isExpanded}
      >
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            isExpanded ? 'rotate-90 text-[#FFBF24]' : 'text-[#A1A1AA] group-hover:text-[#FFBF24] group-hover:translate-x-0.5'
          }`}
        />
        <span>{isExpanded ? collapseLabel : label}</span>
      </button>

      {isExpanded && (
        <div className="pt-1 text-xs md:text-sm text-[#A1A1AA] leading-relaxed animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
