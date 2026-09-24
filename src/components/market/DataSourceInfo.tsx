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
          <span>Data Sources & Methodological Governance</span>
        </div>
        <span className="text-[10px] text-[#A1A1AA] font-mono">
          {retrievedAt ? `Synced: ${new Date(retrievedAt).toLocaleTimeString()}` : 'Live Retrieval'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#A1A1AA]">
        <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1">
          <span className="text-[#F8FAFC] font-semibold block text-[11px]">Primary Geographic Registry</span>
          <p className="text-[11px] leading-relaxed">
            OpenStreetMap & Overpass API. Business data coverage and completeness depend on open spatial records and may vary by city or colony.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1">
          <span className="text-[#F8FAFC] font-semibold block text-[11px]">Commercial Disclosures</span>
          <p className="text-[11px] leading-relaxed">
            • <strong>Pricing</strong>: Public price information is unavailable from public map nodes; never estimated.<br />
            • <strong>Trends</strong>: Historical market trend data is not available from the current data sources.
          </p>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-[#1A1A1D] border border-amber-500/20 text-[11px] text-[#A1A1AA] flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-[#FFBF24] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important</strong>: Competition indicators describe observed spatial listings and do not guarantee business success or failure. Real-world businesses may exist that are not yet cataloged in OpenStreetMap.
        </p>
      </div>
    </div>
  );
};
