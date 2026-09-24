import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Flame,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Tag,
} from 'lucide-react';
import { DiscoveredBusiness } from '../../types';

export interface NearbyBusinessListProps {
  businesses: DiscoveredBusiness[];
  onSelectBusiness?: (business: DiscoveredBusiness) => void;
  onSaveBusiness?: (business: DiscoveredBusiness) => void;
  savedOsmIds?: Set<string | number>;
  selectedBusinessId?: string | number | null;
  onExpandRadius?: (newRadius: number) => void;
  currentRadiusMeters?: number;
  className?: string;
}

export const NearbyBusinessList: React.FC<NearbyBusinessListProps> = ({
  businesses = [],
  onSelectBusiness,
  onSaveBusiness,
  savedOsmIds = new Set(),
  selectedBusinessId = null,
  onExpandRadius,
  currentRadiusMeters = 2000,
  className = '',
}) => {
  const [savingId, setSavingId] = useState<string | number | null>(null);

  const handleSave = async (e: React.MouseEvent, biz: DiscoveredBusiness) => {
    e.stopPropagation();
    if (!onSaveBusiness) return;
    const bizKey = biz.id || biz.osm_id;
    setSavingId(bizKey);
    try {
      await onSaveBusiness(biz);
    } finally {
      setSavingId(null);
    }
  };

  if (businesses.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-[#111113] rounded-xl border border-[#27272A] text-center ${className}`}>
        <div className="w-12 h-12 rounded-full bg-[#1A1A1D] flex items-center justify-center text-[#71717A] mb-3">
          <Building2 className="w-6 h-6 text-[#FFBF24]" />
        </div>
        <h4 className="text-sm font-bold text-[#F8FAFC]">No businesses found</h4>
        <p className="text-xs text-[#A1A1AA] max-w-sm mt-1 mb-4">
          No businesses were found for this category within the selected radius. Try expanding the radius or repositioning the target location.
        </p>
        {onExpandRadius && (
          <div className="flex items-center gap-2">
            {currentRadiusMeters < 2000 && (
              <button
                type="button"
                onClick={() => onExpandRadius(2000)}
                className="px-3 py-1.5 rounded-lg bg-[#1A1A1D] hover:bg-[#27272A] text-xs font-semibold text-[#FFBF24] border border-[#27272A] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Expand to 2 km</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentRadiusMeters < 5000 && (
              <button
                type="button"
                onClick={() => onExpandRadius(5000)}
                className="px-3 py-1.5 rounded-lg bg-[#FFBF24]/10 hover:bg-[#FFBF24]/20 text-xs font-semibold text-[#FFBF24] border border-[#FFBF24]/30 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Expand to 5 km</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-[#71717A] px-1">
        <span>Showing {businesses.length} places (Google Places API)</span>
        <span>Sorted by proximity</span>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#27272A]">
        {businesses.map((biz) => {
          const bizKey = biz.id || biz.osm_id;
          const isSelected = selectedBusinessId !== null && String(bizKey) === String(selectedBusinessId);
          const isSaved = savedOsmIds.has(biz.osm_id) || savedOsmIds.has(String(biz.osm_id));
          const isCompetitor = biz.is_direct_competitor || biz.isDirectCompetitor;
          const isRelated = biz.isRelated;

          const googleMapsLink =
            (biz as any).googleMapsUri ||
            `https://www.google.com/maps/search/?api=1&query=${biz.latitude},${biz.longitude}`;

          const statusText = (biz as any).businessStatus
            ? (biz as any).businessStatus.replace('_', ' ')
            : null;

          return (
            <div
              key={`${biz.osm_id}-${biz.name}`}
              onClick={() => onSelectBusiness && onSelectBusiness(biz)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FFBF24]/10 border-[#FFBF24] shadow-[0_0_14px_rgba(255,191,36,0.18)]'
                  : 'bg-[#111113] hover:bg-[#151518] border-[#27272A] hover:border-[#3F3F46]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-[#F8FAFC] truncate">{biz.name}</span>

                    {/* Competitor Classification Badge */}
                    {isCompetitor ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
                        <Flame className="w-3 h-3 text-red-400" /> Potential Competitor
                      </span>
                    ) : isRelated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        Related Business
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#1A1A1D] text-[#A1A1AA] border border-[#27272A]">
                        Other Business
                      </span>
                    )}

                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#1A1A1D] text-[#FFBF24] border border-[#27272A] font-medium capitalize">
                      {biz.category || 'Commercial'}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#71717A]" />
                    <span className="truncate">{biz.address || 'Address not available'}</span>
                  </div>

                  {/* Distance, Status & Google Maps Link */}
                  <div className="flex items-center gap-4 text-xs text-[#A1A1AA] mt-2 flex-wrap">
                    <span className="font-semibold text-[#FFBF24]">
                      {biz.distance_formatted || `${Math.round(biz.distance_meters || 0)} m`}
                    </span>

                    {statusText && (
                      <span className="capitalize text-[11px] text-[#A1A1AA] bg-[#18181B] px-1.5 py-0.5 rounded border border-[#27272A]">
                        {statusText.toLowerCase()}
                      </span>
                    )}

                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[#38BDF8] hover:text-[#7DD3FC] hover:underline font-medium"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Bookmark / Save Action */}
                <button
                  type="button"
                  onClick={(e) => handleSave(e, biz)}
                  disabled={savingId === biz.id}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                    isSaved
                      ? 'bg-[#FFBF24]/15 border-[#FFBF24] text-[#FFBF24]'
                      : 'bg-[#1A1A1D] border-[#27272A] text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#27272A]'
                  }`}
                  title={isSaved ? 'Saved to shortlist' : 'Save business'}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-[#A1A1AA]" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
