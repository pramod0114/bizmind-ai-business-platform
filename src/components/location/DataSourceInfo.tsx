import React from 'react';
import { Database, Info, MapPin } from 'lucide-react';

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
      <div className={`flex items-center justify-between gap-4 p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#A1A1AA] ${className}`}>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
          <span>
            Data Source: <strong className="text-[#F8FAFC]">Google Maps Platform / Google Places API (New)</strong>
          </span>
        </div>
        <span className="text-[10px] hidden sm:inline text-[#71717A]">
          Fresh place lookups performed live for each location analysis.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FFBF24]" />
          <h5 className="text-xs font-bold text-[#F8FAFC]">Data Source Disclosure &amp; Attribution</h5>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1A1D] text-[#38BDF8] border border-[#38BDF8]/30 font-medium">
          Google Maps Platform
        </span>
      </div>

      <div className="space-y-1 text-xs text-[#A1A1AA]">
        <div>
          Mapping &amp; Visualization: <span className="text-[#F8FAFC] font-medium">Google Maps JavaScript API</span>
        </div>
        <div>
          Business Discovery: <span className="text-[#F8FAFC] font-medium">Google Places API (New) — Nearby Search &amp; Text Search</span>
        </div>
        <div>
          Geocoding &amp; Search: <span className="text-[#F8FAFC] font-medium">Google Geocoding &amp; Places Autocomplete</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#27272A]/50 flex items-start gap-1.5 text-[11px] text-[#A1A1AA] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#FFBF24] shrink-0 mt-0.5" />
        <span>
          Business locations and place information are provided through Google Maps Platform / Google Places. Observed competition metrics and density indicators are calculated from live Google Places API lookups without permanent caching.
        </span>
      </div>
    </div>
  );
};
