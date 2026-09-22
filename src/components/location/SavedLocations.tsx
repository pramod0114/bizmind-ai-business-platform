import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Download,
  Calendar,
  Building2,
  Target,
  CheckSquare,
  Square,
  FileSpreadsheet,
  FileText,
  Loader2,
} from 'lucide-react';
import { SavedLocationAnalysis } from '../../types';
import { locationApiService } from '../../services/locationService';

export interface SavedLocationsProps {
  savedAnalyses: SavedLocationAnalysis[];
  onLoadAnalysis: (analysis: SavedLocationAnalysis) => void;
  onDeleteAnalysis: (id: number | string) => void;
  selectedForCompareIds: number[];
  onToggleCompareId: (id: number) => void;
  className?: string;
}

export const SavedLocations: React.FC<SavedLocationsProps> = ({
  savedAnalyses = [],
  onLoadAnalysis,
  onDeleteAnalysis,
  selectedForCompareIds = [],
  onToggleCompareId,
  className = '',
}) => {
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this saved location analysis?')) return;
    setDeletingId(id);
    try {
      await onDeleteAnalysis(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = (analysis: SavedLocationAnalysis) => {
    const rows = [
      ['Metric', 'Value'],
      ['Location Name', analysis.location_name],
      ['Address', analysis.address],
      ['Coordinates', `${analysis.latitude}, ${analysis.longitude}`],
      ['Business Idea', analysis.business_idea || analysis.business_name || 'N/A'],
      ['Category', analysis.business_category || 'N/A'],
      ['Radius (km)', analysis.radius_km || (analysis.radius ? analysis.radius / 1000 : 2)],
      ['Total Businesses', analysis.total_businesses || analysis.business_count || 0],
      ['Relevant Businesses', analysis.relevant_businesses || 0],
      ['Business Density', analysis.business_density || 0],
      ['Average Distance', analysis.average_relevant_distance || 'N/A'],
      ['Concentration Level', analysis.concentration_level || analysis.competition_level || 'N/A'],
      ['Saved Date', new Date(analysis.created_at).toLocaleString()],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((x) => `"${x}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bizmind_location_${analysis.location_name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = (analysis: SavedLocationAnalysis) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `location_analysis_${analysis.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (savedAnalyses.length === 0) {
    return (
      <div className={`p-8 bg-[#111113] rounded-xl border border-[#27272A] text-center ${className}`}>
        <Bookmark className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
        <h4 className="text-sm font-bold text-[#F8FAFC]">No saved locations yet</h4>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Perform a location analysis and click "Save Location Analysis" to track, revisit, or compare multiple sites.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#FFBF24]" />
          <h4 className="text-sm font-bold text-[#F8FAFC]">Saved Location Portfolio</h4>
        </div>
        <span className="text-xs text-[#71717A] font-mono">
          {savedAnalyses.length} saved
        </span>
      </div>

      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#27272A]">
        {savedAnalyses.map((item) => {
          const isSelectedForCompare = selectedForCompareIds.includes(item.id);
          const radKm = item.radius_km || (item.radius ? item.radius / 1000 : 2);
          const totalB = item.total_businesses || item.business_count || 0;
          const relB = item.relevant_businesses || 0;
          const conc = item.concentration_level || item.competition_level || 'LOW';

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all ${
                isSelectedForCompare
                  ? 'bg-[#FFBF24]/10 border-[#FFBF24]'
                  : 'bg-[#151518] hover:bg-[#1A1A1D] border-[#27272A]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                {/* Compare Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleCompareId(item.id)}
                  className="mt-0.5 text-[#A1A1AA] hover:text-[#FFBF24] cursor-pointer"
                  title="Select for comparison"
                >
                  {isSelectedForCompare ? (
                    <CheckSquare className="w-4 h-4 text-[#FFBF24]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#71717A]" />
                  )}
                </button>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#F8FAFC] truncate">
                      {item.location_name}
                    </span>
                    {(item.business_idea || item.business_category) && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1A1D] text-[#FFBF24] border border-[#27272A]">
                        {item.business_idea || item.business_category}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#71717A] truncate mt-0.5">{item.address}</div>

                  <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] mt-2 flex-wrap">
                    <span>Radius: <strong className="text-[#F8FAFC]">{radKm} km</strong></span>
                    <span>Total: <strong className="text-[#F8FAFC]">{totalB}</strong></span>
                    <span>Relevant: <strong className="text-[#F8FAFC]">{relB}</strong></span>
                    <span>Conc: <strong className="text-[#FFBF24]">{conc}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onLoadAnalysis(item)}
                    className="p-1.5 rounded bg-[#1A1A1D] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] border border-[#27272A] transition-colors cursor-pointer"
                    title="Load onto map"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportCSV(item)}
                    className="p-1.5 rounded bg-[#1A1A1D] hover:bg-[#27272A] text-[#A1A1AA] hover:text-emerald-400 border border-[#27272A] transition-colors cursor-pointer"
                    title="Export CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded bg-[#1A1A1D] hover:bg-red-500/20 text-[#71717A] hover:text-red-400 border border-[#27272A] transition-colors cursor-pointer"
                    title="Delete"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
