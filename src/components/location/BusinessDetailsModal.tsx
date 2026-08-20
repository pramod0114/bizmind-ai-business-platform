import React from 'react';
import { X, MapPin, Phone, Globe, Clock, ExternalLink, Bookmark, Check, ShieldAlert, Store, Tag } from 'lucide-react';
import { DiscoveredBusiness } from '../../types';

interface BusinessDetailsModalProps {
  business: DiscoveredBusiness | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (business: DiscoveredBusiness) => void;
  isSaved?: boolean;
}

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  business,
  isOpen,
  onClose,
  onSave,
  isSaved = false,
}) => {
  if (!isOpen || !business) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="business-details-modal"
        className="relative w-full max-w-lg rounded-2xl bg-[#111113] border border-[#27272A] p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#27272A]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
                {business.broadCategory}
              </span>
              {business.isDirectCompetitor && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Direct Competitor
                </span>
              )}
              <span className="text-xs text-[#A1A1AA] font-mono">
                {business.distance_formatted} from target
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC] leading-snug">{business.name}</h3>
            <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>{business.category}</span>
              {business.cuisine && <span className="text-[#A1A1AA]">• Cuisine: {business.cuisine}</span>}
            </p>
          </div>

          <button
            id="close-business-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-3.5 text-sm">
          {/* Address */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#18181B] border border-[#27272A]/60">
            <MapPin className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Address</div>
              <div className="text-xs text-[#F8FAFC]">
                {business.address || <span className="text-[#71717A] italic">Not available in OpenStreetMap data</span>}
              </div>
              <div className="text-[11px] font-mono text-[#71717A]">
                Coordinates: {business.latitude.toFixed(5)}, {business.longitude.toFixed(5)}
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone */}
            <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/60 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Phone</div>
                <div className="text-xs text-[#F8FAFC] truncate">
                  {business.phone ? (
                    <a href={`tel:${business.phone}`} className="hover:underline text-[#3B82F6]">
                      {business.phone}
                    </a>
                  ) : (
                    <span className="text-[#71717A] italic">Not available</span>
                  )}
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/60 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Hours</div>
                <div className="text-xs text-[#F8FAFC] truncate">
                  {business.opening_hours || <span className="text-[#71717A] italic">Not available</span>}
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/60 flex items-start gap-2.5 sm:col-span-2">
              <Globe className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <div className="overflow-hidden w-full">
                <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Website</div>
                <div className="text-xs text-[#F8FAFC] truncate">
                  {business.website ? (
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-[#8B5CF6] flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{business.website}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[#71717A] italic">Not available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metadata Attributes */}
          <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/60 space-y-2">
            <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#FFBF24]" /> Spatial Metadata
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#71717A]">OSM ID: </span>
                <span className="font-mono text-[#F8FAFC]">{business.osm_id}</span>
              </div>
              <div>
                <span className="text-[#71717A]">Brand / Operator: </span>
                <span className="text-[#F8FAFC]">{business.brand || business.operator || 'Not available'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#27272A] flex items-center justify-between gap-3">
          <a
            href={`https://www.openstreetmap.org/${business.osm_id.replace('_', '/')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#A1A1AA] hover:text-[#FFBF24] flex items-center gap-1 transition-colors"
          >
            <span>View on OpenStreetMap</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-[#F8FAFC] transition-colors cursor-pointer"
            >
              Close
            </button>

            {onSave && (
              <button
                id="modal-save-business-btn"
                onClick={() => onSave(business)}
                disabled={isSaved}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] font-bold shadow-lg shadow-[#FFBF24]/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" /> Save Business
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
