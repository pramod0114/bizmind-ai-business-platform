import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Compass } from 'lucide-react';
import { GeoLocationResult } from '../../types';
import { locationApiService } from '../../services/locationService';

export interface LocationSearchProps {
  onSelectLocation: (location: GeoLocationResult) => void;
  currentLocationName?: string;
  className?: string;
}

const QUICK_SEARCH_EXAMPLES = [
  'Sangli, Maharashtra',
  'Vishrambag, Sangli',
  '416416',
  'Market Yard, Sangli',
  'Miraj',
  'Indiranagar, Bengaluru',
];

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
  currentLocationName = '',
  className = '',
}) => {
  const [query, setQuery] = useState(currentLocationName);
  const [results, setResults] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lastPropLocationRef = useRef(currentLocationName);

  // Sync external location name only if the prop genuinely changed
  useEffect(() => {
    if (currentLocationName && currentLocationName !== lastPropLocationRef.current) {
      lastPropLocationRef.current = currentLocationName;
      setQuery(currentLocationName);
    }
  }, [currentLocationName]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value || value.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await locationApiService.searchLocations(value.trim());
        setResults(data);
        setIsOpen(data.length > 0);
      } catch (err) {
        console.error('Location search failed:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  const handleSelect = (item: GeoLocationResult) => {
    setQuery(item.name || item.display_name);
    setIsOpen(false);
    setResults([]);
    onSelectLocation(item);
  };

  const handleQuickSelect = (exampleQuery: string) => {
    setQuery(exampleQuery);
    setIsSearching(true);
    locationApiService.searchLocations(exampleQuery).then((data) => {
      setIsSearching(false);
      if (data.length > 0) {
        handleSelect(data[0]);
      } else {
        setResults([]);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        handleQuickSelect(query.trim());
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#A1A1AA] pointer-events-none">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FFBF24]" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          id="location-search-input"
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search city, area, address, or PIN code (e.g., Sangli, Maharashtra)"
          className="w-full pl-10 pr-10 py-2.5 bg-[#111113] border border-[#27272A] focus:border-[#FFBF24] rounded-lg text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#FFBF24] transition-all shadow-inner"
        />

        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 p-1 text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] rounded transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Search Suggestions */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
        <span className="text-[#71717A] flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#FFBF24]" /> Quick picks:
        </span>
        {QUICK_SEARCH_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => handleQuickSelect(ex)}
            className="px-2 py-0.5 rounded bg-[#1A1A1D] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] border border-[#27272A] transition-colors cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#111113] border border-[#27272A] rounded-lg shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-[#27272A]/40 backdrop-blur-md">
          {results.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`${item.place_id || idx}-${item.latitude}-${item.longitude}`}
                type="button"
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full px-3.5 py-2.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#FFBF24]/10 text-[#FFBF24]' : 'hover:bg-[#1A1A1D] text-[#F8FAFC]'
                }`}
              >
                <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#FFBF24]' : 'text-[#71717A]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.name || item.display_name.split(',')[0]}</div>
                  <div className="text-xs text-[#71717A] truncate mt-0.5">{item.display_name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1A1A1D] text-[#A1A1AA] border border-[#27272A]">
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </span>
                    {item.type && (
                      <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                        {item.type}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
