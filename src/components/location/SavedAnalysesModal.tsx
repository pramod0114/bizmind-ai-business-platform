import React from 'react';
import { X, History, MapPin, Calendar, ArrowRight, Trash2, ShieldCheck, Target } from 'lucide-react';
import { SavedLocationAnalysis } from '../../types';

interface SavedAnalysesModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyses: SavedLocationAnalysis[];
  onSelectAnalysis: (analysis: SavedLocationAnalysis) => void;
  onDeleteAnalysis: (id: number) => void;
  loading?: boolean;
}

export const SavedAnalysesModal: React.FC<SavedAnalysesModalProps> = ({
  isOpen,
  onClose,
  analyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="saved-analyses-modal"
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#111113] border border-[#27272A] p-6 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272A] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Saved Location Analyses</h3>
              <p className="text-xs text-[#A1A1AA]">
                Re-load previous spatial scans and competition assessments
              </p>
            </div>
          </div>

          <button
            id="close-saved-analyses-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved Analyses */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#A1A1AA] flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#FFBF24] border-t-transparent rounded-full animate-spin"></div>
              <span>Loading saved location records...</span>
            </div>
          ) : analyses.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A1A1AA] space-y-2">
              <MapPin className="w-8 h-8 text-[#71717A] mx-auto opacity-50" />
              <p className="font-semibold text-[#F8FAFC]">No saved location analyses yet</p>
              <p className="text-[11px] text-[#71717A] max-w-xs mx-auto">
                Scan any location on the map and click "Save Analysis" to build your portfolio.
              </p>
            </div>
          ) : (
            analyses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]/70 hover:border-[#FFBF24]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#F8FAFC]">{item.location_name}</span>
                    {item.business_category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
                        {item.business_category}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.competition_level === 'LOW'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.competition_level === 'MEDIUM'
                          ? 'bg-[#FFBF24]/10 text-[#FFBF24]'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {item.competition_level} Competition
                    </span>
                  </div>

                  <p className="text-xs text-[#A1A1AA] line-clamp-1">{item.address}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#71717A] pt-1">
                    <span>
                      Radius: <strong>{((Number(item.radius) || 0) / 1000).toFixed(1)} km</strong>
                    </span>
                    <span>•</span>
                    <span>
                      POIs: <strong>{item.business_count}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-[#FFBF24]" />
                      Opportunity Score: <strong className="text-[#FFBF24]">{item.opportunity_score}/100</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#27272A]">
                  <button
                    onClick={() => {
                      onSelectAnalysis(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Load Scan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteAnalysis(item.id)}
                    className="p-1.5 rounded-lg bg-[#27272A]/40 hover:bg-rose-500/20 text-[#A1A1AA] hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Saved Analysis"
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
