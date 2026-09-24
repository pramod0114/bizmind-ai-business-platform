import React from 'react';
import { Info, AlertCircle, ShieldCheck } from 'lucide-react';

interface DataSourceInfoProps {
  retrievedAt?: string;
  className?: string;
}

export const DataSourceInfo: React.FC<DataSourceInfoProps> = ({ retrievedAt, className = '' }) => {
  return (
    <div className={`p-4 rounded-xl bg-[#111113] border border-[#27272A] space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
          <ShieldCheck className="w-4 h-4 text-[#FFBF24]" />
          <span>Data Sources &amp; Methodological Governance</span>
        </div>
        <span className="text-[10px] text-[#A1A1AA] font-mono">
          {retrievedAt ? `Synced: ${new Date(retrievedAt).toLocaleTimeString()}` : 'Live Google Places Lookup'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#A1A1AA]">
        <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1">
          <span className="text-[#F8FAFC] font-semibold block text-[11px]">Primary Location &amp; Places Provider</span>
          <p className="text-[11px] leading-relaxed">
            Google Maps Platform / Google Places API (New) — Nearby Search &amp; Text Search. Live API lookups with no permanent caching of place records.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1">
          <span className="text-[#F8FAFC] font-semibold block text-[11px]">Commercial Disclosures</span>
          <p className="text-[11px] leading-relaxed">
            • <strong>Pricing &amp; Revenue</strong>: Commercial revenue and sales figures are not fabricated.<br />
            • <strong>Density</strong>: Business density reflects observed establishments per square kilometer within the chosen radius.
          </p>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-[#1A1A1D] border border-amber-500/20 text-[11px] text-[#A1A1AA] flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-[#FFBF24] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important</strong>: Business locations and place information are provided through Google Maps Platform / Google Places. Competition indicators describe observed spatial listings and do not guarantee business success or customer demand.
        </p>
      </div>
    </div>
  );
};
