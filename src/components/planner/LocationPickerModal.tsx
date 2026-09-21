import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Check, X, Loader2 } from 'lucide-react';
import { locationService } from '../../services/locationService';

interface SelectedLocation {
  location_name: string;
  city: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: SelectedLocation) => void;
  currentLocationName?: string;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocationName = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(currentLocationName);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<any[]>([]);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load saved businesses to pick from
      locationService.getSavedBusinesses().then((data) => {
        setSavedBusinesses(data || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use Nominatim forward geocode
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data || []);
    } catch (err) {
      console.error('Failed to geocode location:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectNominatim = (item: any) => {
    const address = item.address || {};
    const city = address.city || address.town || address.village || address.state_district || address.state || '';
    const area = address.suburb || address.neighbourhood || address.residential || address.road || '';
    const locName = item.display_name.split(',')[0] || item.display_name;

    onSelectLocation({
      location_name: locName,
      city: city,
      area: area,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    });
    onClose();
  };

  const handleSelectSaved = (saved: any) => {
    onSelectLocation({
      location_name: saved.business_name || saved.address || 'Selected Location',
      city: saved.address ? saved.address.split(',').slice(-2, -1)[0]?.trim() || '' : '',
      area: saved.address ? saved.address.split(',')[0]?.trim() || '' : '',
      latitude: Number(saved.latitude),
      longitude: Number(saved.longitude),
    });
    onClose();
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
          );
          const data = await res.json();
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.state || '';
          const area = address.suburb || address.neighbourhood || address.road || '';
          const locName = data.display_name
            ? data.display_name.split(',')[0]
            : `Location (${lat != null ? Number(lat).toFixed(4) : '0.0000'}, ${lon != null ? Number(lon).toFixed(4) : '0.0000'})`;

          onSelectLocation({
            location_name: locName,
            city,
            area,
            latitude: lat,
            longitude: lon,
          });
          onClose();
        } catch {
          onSelectLocation({
            location_name: `Current Location (${lat != null ? Number(lat).toFixed(4) : '0.0000'}, ${lon != null ? Number(lon).toFixed(4) : '0.0000'})`,
            city: '',
            area: '',
            latitude: lat,
            longitude: lon,
          });
          onClose();
        } finally {
          setIsDetectingGps(false);
        }
      },
      () => {
        setIsDetectingGps(false);
        alert('Could not detect location. Please type an address in the search box.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Select Business Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & GPS Button */}
        <div className="space-y-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, area, or market (e.g. Koramangala, Bengaluru)..."
                className="w-full bg-[#27272A] text-white pl-9 pr-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 rounded-lg text-xs font-medium border border-[#3F3F46] transition-colors"
          >
            {isDetectingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Detect Current Location (GPS)</span>
          </button>
        </div>

        {/* Results / Suggestions List */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[160px] max-h-[300px] pr-1">
          {suggestions.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Search Results:
              </span>
              <div className="space-y-1.5">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectNominatim(item)}
                    className="w-full text-left p-2.5 rounded-lg bg-[#27272A]/70 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-[#3F3F46] transition-colors flex items-start justify-between group"
                  >
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-indigo-300">
                        {item.display_name.split(',')[0]}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {item.display_name}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Previously Saved Locations from Location Module */}
          {savedBusinesses.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Saved Locations from Location Module:
              </span>
              <div className="space-y-1.5">
                {savedBusinesses.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectSaved(b)}
                    className="w-full text-left p-2.5 rounded-lg bg-[#27272A]/70 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-[#3F3F46] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-indigo-300">
                        {b.business_name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {b.address || `${b.category} • Lat: ${b.latitude != null ? Number(b.latitude).toFixed(4) : '0.0000'}, Lon: ${b.longitude != null ? Number(b.longitude).toFixed(4) : '0.0000'}`}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.length === 0 && savedBusinesses.length === 0 && !isSearching && (
            <div className="text-center py-8 text-xs text-slate-500">
              Type a location above or click "Detect Current Location" to fetch geographical coordinates and details.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#27272A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
