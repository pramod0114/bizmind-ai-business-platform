import React from 'react';
import { X, Bookmark, MapPin, Phone, Globe, Trash2, ExternalLink } from 'lucide-react';
import { SavedBusiness } from '../../types';

interface SavedBusinessesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBusinesses: SavedBusiness[];
  onDeleteSavedBusiness: (id: number) => void;
  loading?: boolean;
}

export const SavedBusinessesModal: React.FC<SavedBusinessesModalProps> = ({
  isOpen,
  onClose,
  savedBusinesses,
  onDeleteSavedBusiness,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="saved-businesses-modal"
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#111113] border border-[#27272A] p-6 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272A] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Saved Businesses / Bookmarks</h3>
              <p className="text-xs text-[#A1A1AA]">
                Discovered competitors and reference businesses pinned from OpenStreetMap
              </p>
            </div>
          </div>

          <button
            id="close-saved-businesses-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#A1A1AA] flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#FFBF24] border-t-transparent rounded-full animate-spin"></div>
              <span>Loading bookmarked businesses...</span>
            </div>
          ) : savedBusinesses.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A1A1AA] space-y-2">
              <Bookmark className="w-8 h-8 text-[#71717A] mx-auto opacity-50" />
              <p className="font-semibold text-[#F8FAFC]">No saved businesses yet</p>
              <p className="text-[11px] text-[#71717A] max-w-xs mx-auto">
                Click "Save" on any discovered business in the map or list to bookmark it here.
              </p>
            </div>
          ) : (
            savedBusinesses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]/70 hover:border-[#FFBF24]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#F8FAFC]">{item.business_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
                      {item.category}
                    </span>
                    {item.cuisine && (
                      <span className="text-[11px] text-[#A1A1AA] font-medium">
                        • {item.cuisine}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#A1A1AA] line-clamp-1">
                    {item.address || 'Address: Not available'}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#71717A] pt-1 flex-wrap">
                    {item.distance_meters !== null && (
                      <span>
                        Distance: <strong>{item.distance_meters < 1000 ? `${item.distance_meters} m` : `${(item.distance_meters / 1000).toFixed(1)} km`}</strong>
                      </span>
                    )}
                    {item.phone && (
                      <span className="flex items-center gap-1 text-[#3B82F6]">
                        <Phone className="w-3 h-3" />
                        {item.phone}
                      </span>
                    )}
                    {item.website && (
                      <a
                        href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#8B5CF6] hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#27272A]">
                  <a
                    href={`https://www.openstreetmap.org/${String(item.osm_id).replace('_', '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#27272A]/40 hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] transition-colors cursor-pointer"
                    title="View on OSM"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onDeleteSavedBusiness(item.id)}
                    className="p-2 rounded-lg bg-[#27272A]/40 hover:bg-rose-500/20 text-[#A1A1AA] hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove Saved Business"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#27272A] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-[#F8FAFC] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
