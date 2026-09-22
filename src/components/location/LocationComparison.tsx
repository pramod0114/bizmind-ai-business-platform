import React from 'react';
import { GitCompare, X, AlertCircle, Building2, Users, BarChart2, Shield, Navigation } from 'lucide-react';
import { SavedLocationAnalysis } from '../../types';

export interface LocationComparisonProps {
  locations: SavedLocationAnalysis[];
  onRemoveLocation: (id: number) => void;
  onClose?: () => void;
  className?: string;
}

export const LocationComparison: React.FC<LocationComparisonProps> = ({
  locations = [],
  onRemoveLocation,
  onClose,
  className = '',
}) => {
  if (locations.length < 2) {
    return (
      <div className={`p-6 bg-[#111113] rounded-xl border border-[#27272A] text-center ${className}`}>
        <GitCompare className="w-8 h-8 text-[#FFBF24] mx-auto mb-2" />
        <h4 className="text-sm font-bold text-[#F8FAFC]">Side-by-Side Location Comparison</h4>
        <p className="text-xs text-[#A1A1AA] max-w-md mx-auto mt-1">
          Select at least 2 saved locations (up to 4) using the checkboxes in the Saved Locations portfolio to view a direct analytical comparison.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 bg-[#111113] rounded-xl border border-[#27272A] shadow-xl flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-[#FFBF24]" />
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Multi-Site Analytical Comparison</h3>
            <p className="text-xs text-[#71717A]">
              Comparing {locations.length} candidate sites side-by-side. Factual metrics are shown objectively for your decision criteria.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Responsive Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272A] text-[#71717A] text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 w-44">Site Metric</th>
              {locations.map((loc) => (
                <th key={loc.id} className="py-3 px-3 min-w-[200px] text-[#F8FAFC]">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <div className="font-bold text-sm text-[#FFBF24] truncate">{loc.location_name}</div>
                      <div className="text-[10px] text-[#71717A] truncate max-w-[180px] normal-case">{loc.address}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveLocation(loc.id)}
                      className="text-[#71717A] hover:text-red-400 p-0.5 cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/50">
            {/* Target Idea / Category */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" /> Business Category
              </td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-medium text-[#F8FAFC]">
                  {loc.business_idea || loc.business_category || 'General Commercial'}
                </td>
              ))}
            </tr>

            {/* Radius */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA]">Radius</td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-mono text-[#F8FAFC]">
                  {loc.radius_km || (loc.radius ? loc.radius / 1000 : 2)} km
                </td>
              ))}
            </tr>

            {/* Total Businesses */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#FFBF24]" /> Total POIs in Radius
              </td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-bold text-sm text-[#F8FAFC]">
                  {loc.total_businesses || loc.business_count || 0}
                </td>
              ))}
            </tr>

            {/* Relevant Businesses */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-400" /> Direct Competitors
              </td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-bold text-sm text-red-400">
                  {loc.relevant_businesses || 0}
                </td>
              ))}
            </tr>

            {/* Business Density */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-[#A855F7]" /> Density (POIs/km²)
              </td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-mono font-semibold text-[#F8FAFC]">
                  {loc.business_density !== undefined ? Number(loc.business_density).toFixed(1) : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Average Relevant Distance */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#34D399]" /> Avg Distance to Match
              </td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-mono text-[#F8FAFC]">
                  {loc.average_relevant_distance || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Concentration Level */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA]">Concentration Level</td>
              {locations.map((loc) => {
                const conc = loc.concentration_level || loc.competition_level || 'LOW';
                return (
                  <td key={loc.id} className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1A1A1D] border border-[#27272A] text-[#FFBF24]">
                      {conc}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Opportunity Indicator */}
            <tr className="hover:bg-[#1A1A1D]/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-[#A1A1AA]">Opportunity Indicator</td>
              {locations.map((loc) => (
                <td key={loc.id} className="py-2.5 px-3 font-bold text-[#FFBF24]">
                  {loc.opportunity_score || 70}/100
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-[#1A1A1D] rounded-lg border border-[#27272A] text-xs text-[#A1A1AA] flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
        <span>
          <strong>Objective Evaluation:</strong> BizMind does not label one site as universally superior. A high-density site with many competitors suits businesses thriving on shared foot traffic (like boutique cafes), while a low-density site offers uncontested territory for destination retail or healthcare services.
        </span>
      </div>
    </div>
  );
};
