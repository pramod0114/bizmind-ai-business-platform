import React from 'react';
import { Filter, Search, ArrowUpDown, Flame, Check } from 'lucide-react';

export interface BusinessFilterState {
  category: string;
  competitorsOnly: boolean;
  sortBy: 'distance_asc' | 'distance_desc' | 'name_asc';
  searchQuery: string;
}

export interface BusinessFiltersProps {
  filters: BusinessFilterState;
  onChangeFilters: (newFilters: BusinessFilterState) => void;
  availableCategories: { category: string; count: number }[];
  totalBusinesses: number;
  competitorCount: number;
  className?: string;
}

const CATEGORY_OPTIONS = [
  { id: 'ALL', label: 'All Businesses' },
  { id: 'Restaurants', label: 'Restaurants' },
  { id: 'Cafés', label: 'Cafés' },
  { id: 'Hotels', label: 'Hotels' },
  { id: 'Retail Shops', label: 'Retail Shops' },
  { id: 'Grocery Stores', label: 'Grocery Stores' },
  { id: 'Pharmacies', label: 'Pharmacies' },
  { id: 'Hospitals', label: 'Hospitals' },
  { id: 'Schools', label: 'Schools' },
  { id: 'Banks', label: 'Banks' },
  { id: 'Gyms', label: 'Gyms' },
  { id: 'Salons', label: 'Salons' },
  { id: 'Bakeries', label: 'Bakeries' },
  { id: 'Clothing Stores', label: 'Clothing Stores' },
  { id: 'Electronics', label: 'Electronics' },
  { id: 'Offices', label: 'Offices' },
  { id: 'Supermarkets', label: 'Supermarkets' },
  { id: 'Other', label: 'Other' },
];

export const BusinessFilters: React.FC<BusinessFiltersProps> = ({
  filters,
  onChangeFilters,
  availableCategories,
  totalBusinesses,
  competitorCount,
  className = '',
}) => {
  const handleCategorySelect = (catId: string) => {
    onChangeFilters({ ...filters, category: catId });
  };

  const handleToggleCompetitors = () => {
    onChangeFilters({ ...filters, competitorsOnly: !filters.competitorsOnly });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, sortBy: e.target.value as BusinessFilterState['sortBy'] });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchQuery: e.target.value });
  };

  return (
    <div className={`flex flex-col gap-3 p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm ${className}`}>
      {/* Top Row: Search Input & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search within list */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Filter businesses by name..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#1A1A1D] border border-[#27272A] focus:border-[#FFBF24] rounded-lg text-xs text-[#F8FAFC] placeholder-[#71717A] focus:outline-none transition-colors"
          />
        </div>

        {/* Competitors Only Toggle & Sort Dropdown */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleCompetitors}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              filters.competitorsOnly
                ? 'bg-red-500/15 border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                : 'bg-[#1A1A1D] border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${filters.competitorsOnly ? 'text-red-400' : 'text-[#71717A]'}`} />
            <span>Competitors Only</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 font-mono">
              {competitorCount}
            </span>
          </button>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 text-[#71717A] pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="pl-8 pr-6 py-1.5 bg-[#1A1A1D] border border-[#27272A] text-xs text-[#F8FAFC] rounded-lg appearance-none focus:outline-none focus:border-[#FFBF24] cursor-pointer"
            >
              <option value="distance_asc">Nearest first</option>
              <option value="distance_desc">Farthest first</option>
              <option value="name_asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-[#27272A]">
        <button
          type="button"
          onClick={() => handleCategorySelect('ALL')}
          className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
            filters.category === 'ALL'
              ? 'bg-[#FFBF24] border-[#FFBF24] text-[#0B0B0C] font-bold'
              : 'bg-[#1A1A1D] border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC]'
          }`}
        >
          All ({totalBusinesses})
        </button>

        {CATEGORY_OPTIONS.filter((c) => c.id !== 'ALL').map((cat) => {
          const matchingCount = availableCategories.find(
            (ac) => ac.category.toLowerCase() === cat.id.toLowerCase()
          )?.count;
          const isSelected = filters.category.toLowerCase() === cat.id.toLowerCase();

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#FFBF24]/15 border-[#FFBF24] text-[#FFBF24] font-semibold'
                  : 'bg-[#1A1A1D] border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC]'
              }`}
            >
              <span>{cat.label}</span>
              {matchingCount !== undefined && matchingCount > 0 && (
                <span className="text-[10px] px-1 rounded bg-[#27272A] text-[#71717A]">
                  {matchingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
