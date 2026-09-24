import React, { useState, useMemo } from 'react';
import { MarketCompetitor } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  Info,
  Globe,
  Phone,
  Clock,
} from 'lucide-react';

interface CompetitorListProps {
  competitors: MarketCompetitor[];
  otherBusinesses?: MarketCompetitor[];
  onSelectCompetitor: (competitor: MarketCompetitor) => void;
  onFocusOnMap?: (competitor: MarketCompetitor) => void;
  className?: string;
}

export const CompetitorList: React.FC<CompetitorListProps> = ({
  competitors = [],
  otherBusinesses = [],
  onSelectCompetitor,
  onFocusOnMap,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'competitors' | 'other' | 'all'>('competitors');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance_asc' | 'distance_desc' | 'name_asc'>('distance_asc');
  const [distanceFilter, setDistanceFilter] = useState<string>('all');

  // Combine items based on active tab
  const rawList = useMemo(() => {
    if (tab === 'competitors') return competitors;
    if (tab === 'other') return otherBusinesses;
    return [...competitors, ...otherBusinesses];
  }, [tab, competitors, otherBusinesses]);

  // Extract unique categories for filter
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    rawList.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return [
      { value: 'all', label: 'All Categories' },
      ...Array.from(set).map((c) => ({ value: c, label: c })),
    ];
  }, [rawList]);

  // Filter and Sort
  const filteredBusinesses = useMemo(() => {
    let result = [...rawList];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.address && b.address.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Distance filter
    if (distanceFilter === '500m') {
      result = result.filter((b) => b.distance_meters <= 500);
    } else if (distanceFilter === '1km') {
      result = result.filter((b) => b.distance_meters <= 1000);
    } else if (distanceFilter === '2km') {
      result = result.filter((b) => b.distance_meters <= 2000);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance_asc') return a.distance_meters - b.distance_meters;
      if (sortBy === 'distance_desc') return b.distance_meters - a.distance_meters;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [rawList, searchQuery, selectedCategory, distanceFilter, sortBy]);

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27272A] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Competitor & Commercial Establishment Directory</CardTitle>
          </div>
          <CardDescription>
            Interactive directory of actual establishments discovered from Google Places & OpenStreetMap.
          </CardDescription>
        </div>

        {/* Segmented Tabs */}
        <div className="flex items-center bg-[#111113] p-1 rounded-lg border border-[#27272A] text-xs">
          <button
            type="button"
            onClick={() => setTab('competitors')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              tab === 'competitors'
                ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            Direct Competitors ({competitors.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('other')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              tab === 'other'
                ? 'bg-[#38BDF8] text-[#0B0B0C] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            Other POIs ({otherBusinesses.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              tab === 'all'
                ? 'bg-[#27272A] text-[#F8FAFC]'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            All ({competitors.length + otherBusinesses.length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <Input
            placeholder="Search by business name or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#A1A1AA]" />}
            className="text-xs"
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
            className="text-xs"
          />

          <Select
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Distances' },
              { value: '500m', label: 'Within 500 m' },
              { value: '1km', label: 'Within 1 km' },
              { value: '2km', label: 'Within 2 km' },
            ]}
            className="text-xs"
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            options={[
              { value: 'distance_asc', label: 'Sort: Nearest First' },
              { value: 'distance_desc', label: 'Sort: Farthest First' },
              { value: 'name_asc', label: 'Sort: Business Name (A-Z)' },
            ]}
            className="text-xs"
          />
        </div>

        {/* Business Table / Cards */}
        {filteredBusinesses.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#111113] border border-[#27272A] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#18181B] flex items-center justify-center text-[#71717A] mx-auto">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">No businesses match the active filters</h4>
            <p className="text-[11px] text-[#A1A1AA]">
              {tab === 'competitors' && competitors.length === 0
                ? 'No potentially relevant businesses were returned by the selected data source in this radius. Try increasing the analysis radius.'
                : 'Try adjusting your search query, distance filter, or category filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#27272A]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111113] text-[#A1A1AA] border-b border-[#27272A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Business Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Proximity</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3">Available Info</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] bg-[#18181B]">
                {filteredBusinesses.map((b) => (
                  <tr
                    key={b.osm_id || b.id || b.name}
                    className="hover:bg-[#202024] transition-colors group cursor-pointer"
                    onClick={() => onSelectCompetitor(b)}
                  >
                    <td className="py-2.5 px-3 font-semibold text-[#F8FAFC]">
                      <div className="flex items-center gap-1.5">
                        {b.isDirectCompetitor !== false ? (
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" title="Direct Competitor" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0" title="Nearby POI" />
                        )}
                        <span className="group-hover:text-[#FFBF24] transition-colors">{b.name}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#111113] border border-[#27272A] text-[11px] text-slate-300">
                        {b.category}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[#FFBF24] font-medium whitespace-nowrap">
                      {b.distance_formatted}
                    </td>

                    <td className="py-2.5 px-3 text-[#A1A1AA] max-w-xs truncate" title={b.address || 'Not available'}>
                      {b.address || <span className="text-[#71717A] italic">Not available</span>}
                    </td>

                    <td className="py-2.5 px-3 text-[#A1A1AA]">
                      <div className="flex items-center gap-2">
                        {b.phone && <Phone className="w-3.5 h-3.5 text-[#22C55E]" title={`Phone: ${b.phone}`} />}
                        {b.website && <Globe className="w-3.5 h-3.5 text-[#38BDF8]" title={`Website: ${b.website}`} />}
                        {b.opening_hours && <Clock className="w-3.5 h-3.5 text-[#FFBF24]" title={`Hours: ${b.opening_hours}`} />}
                        {!b.phone && !b.website && !b.opening_hours && (
                          <span className="text-[10px] text-[#71717A] italic">Basic listing</span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {onFocusOnMap && (
                          <button
                            type="button"
                            onClick={() => onFocusOnMap(b)}
                            className="p-1.5 hover:bg-[#27272A] rounded text-[#A1A1AA] hover:text-[#FFBF24] transition-colors"
                            title="Focus on Map"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectCompetitor(b)}
                          className="px-2 py-1 bg-[#27272A] hover:bg-[#3F3F46] rounded text-[11px] font-medium text-[#F8FAFC] flex items-center gap-1 transition-colors"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
