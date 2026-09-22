import React from 'react';
import { Database, Info, ExternalLink } from 'lucide-react';

export interface DataSourceInfoProps {
  className?: string;
  variant?: 'banner' | 'card';
}

export const DataSourceInfo: React.FC<DataSourceInfoProps> = ({
  className = '',
  variant = 'card',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center justify-between gap-4 p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#71717A] ${className}`}>
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#FFBF24]" />
          <span>
            Data Source: <strong className="text-[#A1A1AA]">OpenStreetMap Nominatim &amp; Overpass API</strong>
          </span>
        </div>
        <span className="text-[10px] hidden sm:inline text-[#71717A]">
          Community-maintained. Coverage and completeness may vary by location.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FFBF24]" />
          <h5 className="text-xs font-bold text-[#F8FAFC]">Data Source &amp; Accuracy Transparency</h5>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1D] text-[#A1A1AA] border border-[#27272A]">
          Open Data
        </span>
      </div>

      <div className="space-y-1 text-xs text-[#A1A1AA]">
        <div>
          Location Geocoding: <span className="text-[#F8FAFC] font-medium">OpenStreetMap / Nominatim</span>
        </div>
        <div>
          Nearby Place POIs: <span className="text-[#F8FAFC] font-medium">OpenStreetMap / Overpass API</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#27272A]/50 flex items-start gap-1.5 text-[11px] text-[#71717A] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#FFBF24] shrink-0 mt-0.5" />
        <span>
          Coverage and completeness may vary by location. OpenStreetMap data is community-maintained and may not contain every real-world business in rapidly developing neighborhoods.
        </span>
      </div>
    </div>
  );
};
