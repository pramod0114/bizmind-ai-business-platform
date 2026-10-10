import React, { useState } from 'react';
import { LocationComparisonItem } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { GitCompare, Plus, Trash2, Loader2, Info, MapPin, ChevronRight } from 'lucide-react';
import { marketAnalysisService } from '../../services/marketAnalysisService';

interface LocationComparisonProps {
  currentLocationName: string;
  currentLat: number;
  currentLng: number;
  businessIdea: string;
  businessCategory: string;
  radiusKm: number;
  className?: string;
  defaultExpanded?: boolean;
}

export const LocationComparison: React.FC<LocationComparisonProps> = ({
  currentLocationName,
  currentLat,
  currentLng,
  businessIdea,
  businessCategory,
  radiusKm,
  className = '',
  defaultExpanded = false,
}) => {
  const [locations, setLocations] = useState<Array<{ name: string; latitude: number; longitude: number }>>([
    { name: currentLocationName, latitude: currentLat, longitude: currentLng },
    { name: 'Sangli Market Yard', latitude: 16.865, longitude: 74.57 },
    { name: 'Miraj High Street', latitude: 16.828, longitude: 74.646 },
  ]);

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [comparisons, setComparisons] = useState<LocationComparisonItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocLat, setNewLocLat] = useState('');
  const [newLocLng, setNewLocLng] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const runComparison = async () => {
    setIsLoading(true);
    setIsExpanded(true);
    try {
      const res = await marketAnalysisService.compare({
        businessIdea,
        businessCategory,
        radiusKm,
        locations,
      });
      setComparisons(res.comparisons);
    } catch (err: any) {
      alert(`Failed to compare locations: ${err?.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(newLocLat);
    const lng = parseFloat(newLocLng);
    if (!newLocName || isNaN(lat) || isNaN(lng)) {
      alert('Please provide a valid location name and decimal coordinates.');
      return;
    }
    if (locations.length >= 4) {
      alert('Maximum 4 locations can be compared simultaneously.');
      return;
    }
    setLocations([...locations, { name: newLocName.trim(), latitude: lat, longitude: lng }]);
    setNewLocName('');
    setNewLocLat('');
    setNewLocLng('');
    setShowAddForm(false);
  };

  const removeLocation = (index: number) => {
    if (locations.length <= 1) return;
    setLocations(locations.filter((_, i) => i !== index));
    setComparisons(null);
  };

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27272A] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Cross-Location Commercial Comparison</CardTitle>
          </div>
          <CardDescription>
            Multi-point spatial benchmarking across candidate trade zones ({radiusKm} km radius).
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {isExpanded && !showAddForm && locations.length < 4 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Candidate
            </Button>
          )}

          <Button
            size="sm"
            onClick={runComparison}
            disabled={isLoading}
            leftIcon={isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
          >
            {isLoading ? 'Benchmarking...' : 'Execute Comparison'}
          </Button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 bg-[#27272A] hover:bg-[#3F3F46] rounded-lg text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3F3F46]"
            title={isExpanded ? 'Collapse comparison tool' : 'View candidate details & comparison'}
          >
            <span>{isExpanded ? 'Hide' : 'Details'}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-[#FFBF24] transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Compact preview of locations when collapsed */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#A1A1AA] text-[11px] font-mono mr-1">Locations ({locations.length}/4):</span>
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#F8FAFC]"
            >
              <MapPin className="w-3 h-3 text-[#FFBF24]" />
              <span className="font-semibold">{loc.name}</span>
              {isExpanded && locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(idx)}
                  className="text-[#71717A] hover:text-red-400 p-0.5 cursor-pointer ml-1"
                  title="Remove location"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Expanded Content: Add Form & Benchmark Results */}
        {isExpanded && (
          <div className="space-y-4 animate-in fade-in duration-150 pt-1">
            {/* Add Custom Location Form */}
            {showAddForm && (
              <form onSubmit={handleAddLocation} className="p-3 bg-[#111113] rounded-xl border border-[#27272A] space-y-3">
                <span className="font-semibold text-[#F8FAFC] block text-xs">Add Benchmark Candidate</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Location Name"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    required
                    className="text-xs"
                  />
                  <Input
                    placeholder="Latitude (e.g. 16.852)"
                    value={newLocLat}
                    onChange={(e) => setNewLocLat(e.target.value)}
                    required
                    type="number"
                    step="any"
                    className="text-xs"
                  />
                  <Input
                    placeholder="Longitude (e.g. 74.581)"
                    value={newLocLng}
                    onChange={(e) => setNewLocLng(e.target.value)}
                    required
                    type="number"
                    step="any"
                    className="text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Add to Comparison
                  </Button>
                </div>
              </form>
            )}

            {/* Benchmark Table Results */}
            {comparisons ? (
              <div className="overflow-x-auto rounded-xl border border-[#27272A]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#111113] text-[#A1A1AA] border-b border-[#27272A]">
                      <th className="py-2.5 px-4 font-semibold">Evaluation Metric</th>
                      {comparisons.map((c, idx) => (
                        <th key={idx} className="py-2.5 px-4 font-bold text-[#F8FAFC]">
                          {c.locationName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272A] bg-[#18181B]">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Total Nearby Establishments</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4 font-mono">
                          {c.totalBusinesses}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Direct Competitors Identified</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4 font-mono font-bold text-[#FFBF24]">
                          {c.relevantCompetitors}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Spatial Density (per km²)</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4 font-mono">
                          {c.density.toFixed(2)}/km²
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Average Distance to Competitor</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4 font-mono">
                          {c.averageDistanceFormatted}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Nearest Direct Competitor</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4 font-mono text-[#38BDF8]">
                          {c.nearestDistanceFormatted}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Competition Risk Tier</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4">
                          <Badge
                            variant={
                              c.competitionRisk === 'Low'
                                ? 'success'
                                : c.competitionRisk === 'Moderate'
                                ? 'warning'
                                : 'error'
                            }
                            size="sm"
                          >
                            {c.competitionRisk}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-[#A1A1AA]">Observed Market Opportunity</td>
                      {comparisons.map((c, idx) => (
                        <td key={idx} className="py-2.5 px-4 font-medium text-[#FFBF24]">
                          {c.marketOpportunity}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-[#A1A1AA] bg-[#111113] rounded-xl border border-[#27272A] space-y-1.5">
                <Info className="w-5 h-5 text-[#FFBF24] mx-auto" />
                <p>
                  Click <strong className="text-white">"Execute Comparison"</strong> to generate a side-by-side empirical benchmark table across your candidate locations.
                </p>
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Neutral Evaluation:</strong> The system displays factual variances between locations without declaring a singular "best" choice. Entrepreneurs should weigh footfall, rental affordability, and supply logistics alongside competitor counts.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
