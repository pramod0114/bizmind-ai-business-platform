import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { MapView } from '../../components/map/MapView';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  MapPin,
  Navigation,
  Search,
  Target,
  Bookmark,
  History,
  RotateCw,
  SlidersHorizontal,
  Store,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Sparkles,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Building,
  Radio,
  Layers,
  Info,
  Layers3,
} from 'lucide-react';
import { locationApiService } from '../../services/locationService';
import {
  GeoLocationResult,
  DiscoveredBusiness,
  LocationAnalysisResult,
  SavedLocationAnalysis,
  SavedBusiness,
} from '../../types';
import { BusinessDetailsModal } from '../../components/location/BusinessDetailsModal';
import { OpportunityScoreCard } from '../../components/location/OpportunityScoreCard';
import { SavedAnalysesModal } from '../../components/location/SavedAnalysesModal';
import { SavedBusinessesModal } from '../../components/location/SavedBusinessesModal';

export const LocationAnalysisPage: React.FC = () => {
  // Target Location State
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([28.6315, 77.2167]); // Default: Connaught Place, New Delhi
  const [locationName, setLocationName] = useState<string>('Connaught Place, New Delhi');
  const [locationAddress, setLocationAddress] = useState<string>('Connaught Place, New Delhi, Delhi, 110001, India');
  const [radius, setRadius] = useState<number>(2000); // Default 2 km

  // Business Profile Context (Part 3 cross-link)
  const [businessName, setBusinessName] = useState<string>('Specialty Artisan Cafe');
  const [businessCategory, setBusinessCategory] = useState<string>('Cafe');

  // Search & Geocoding State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Geolocation state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Analysis & POI State
  const [analysis, setAnalysis] = useState<LocationAnalysisResult | null>(null);
  const [businesses, setBusinesses] = useState<DiscoveredBusiness[]>([]);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Filters for business list
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [businessListSearch, setBusinessListSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'category'>('distance');

  // Modals & Details State
  const [selectedBusiness, setSelectedBusiness] = useState<DiscoveredBusiness | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Saved Analyses & Saved Businesses Modals
  const [isSavedAnalysesOpen, setIsSavedAnalysesOpen] = useState<boolean>(false);
  const [isSavedBusinessesOpen, setIsSavedBusinessesOpen] = useState<boolean>(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedLocationAnalysis[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Quick Preset Locations
  const presetLocations = [
    { name: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167 },
    { name: 'BKC, Mumbai', lat: 19.0657, lng: 72.8687 },
    { name: 'Indiranagar, Bangalore', lat: 12.9784, lng: 77.6408 },
    { name: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341 },
    { name: 'Rajaramnagar, Islampur', lat: 17.0505, lng: 74.2635 },
    { name: 'Financial District, SF', lat: 37.7946, lng: -122.3999 },
  ];

  // 1. Initial Load & Fetch Analysis
  useEffect(() => {
    loadLocationIntelligence(selectedCoords[0], selectedCoords[1], radius);
    loadSavedRecords();
  }, []);

  // 2. Fetch Saved Analyses and Businesses from DB
  const loadSavedRecords = async () => {
    try {
      setIsLoadingSaved(true);
      const [analysesData, businessesData] = await Promise.all([
        locationApiService.listLocationAnalyses(),
        locationApiService.listSavedBusinesses(),
      ]);
      setSavedAnalyses(analysesData);
      setSavedBusinesses(businessesData);
    } catch (err) {
      console.warn('Failed to load saved records:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // 3. Main Intelligence Analysis Pipeline
  const loadLocationIntelligence = async (
    lat: number,
    lng: number,
    rad: number,
    customName?: string
  ) => {
    setIsLoadingAnalysis(true);
    setAnalysisError(null);

    try {
      // Step A: Reverse Geocode if custom name wasn't supplied
      if (!customName) {
        const geoInfo = await locationApiService.reverseGeocode(lat, lng);
        if (geoInfo) {
          setLocationName(geoInfo.name);
          setLocationAddress(geoInfo.display_name);
        } else {
          setLocationName(`Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          setLocationAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      }

      // Step B: Trigger Spatial Analytics
      const result = await locationApiService.analyzeLocation({
        latitude: lat,
        longitude: lng,
        radius: rad,
        businessName,
        businessCategory,
      });

      setAnalysis(result);

      // Step C: Retrieve All POIs
      const nearbyResult = await locationApiService.getNearbyBusinesses(lat, lng, rad);

      // Enhance with competitor tags based on analysis
      const enhancedBusinesses = nearbyResult.businesses.map((b) => {
        const isDirect = result.competition.directCompetitors.some((dc) => dc.osm_id === b.osm_id);
        const isRel = result.competition.relatedBusinesses.some((rb) => rb.osm_id === b.osm_id);
        return {
          ...b,
          isDirectCompetitor: isDirect,
          isRelated: isRel,
        };
      });

      setBusinesses(enhancedBusinesses);
    } catch (err: any) {
      console.error('Location analysis error:', err);
      setAnalysisError(err?.message || 'Failed to fetch OpenStreetMap location intelligence. Please try again.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // 4. Geolocation Trigger ("Use My Current Location")
  const handleUseCurrentLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedCoords([lat, lng]);

        const geo = await locationApiService.reverseGeocode(lat, lng);
        const resolvedName = geo?.name || 'My Current Location';
        const resolvedAddr = geo?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        setLocationName(resolvedName);
        setLocationAddress(resolvedAddr);
        loadLocationIntelligence(lat, lng, radius, resolvedName);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. You can search or click on the map.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        setLocationError(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // 5. Search Nominatim Input Handlers
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await locationApiService.searchLocations(val);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 450);
  };

  const handleSelectSearchResult = (item: GeoLocationResult) => {
    setSearchQuery(item.name);
    setShowSearchDropdown(false);
    setSelectedCoords([item.latitude, item.longitude]);
    setLocationName(item.name);
    setLocationAddress(item.display_name);
    loadLocationIntelligence(item.latitude, item.longitude, radius, item.name);
  };

  // 6. Map Click Handler
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoords([lat, lng]);
    loadLocationIntelligence(lat, lng, radius);
  };

  // 7. Preset Location Handler
  const handleSelectPreset = (preset: { name: string; lat: number; lng: number }) => {
    setSelectedCoords([preset.lat, preset.lng]);
    setLocationName(preset.name);
    loadLocationIntelligence(preset.lat, preset.lng, radius, preset.name);
  };

  // 8. Radius Slider Change Handler
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    loadLocationIntelligence(selectedCoords[0], selectedCoords[1], newRadius, locationName);
  };

  // 9. Save Current Analysis
  const handleSaveAnalysis = async () => {
    if (!analysis) return;
    try {
      const saved = await locationApiService.saveLocationAnalysis({
        location_name: locationName,
        address: locationAddress,
        latitude: selectedCoords[0],
        longitude: selectedCoords[1],
        radius: radius,
        business_count: analysis.totalBusinesses,
        category_summary: analysis.categoryDistribution.reduce(
          (acc, item) => ({ ...acc, [item.category]: item.count }),
          {}
        ),
        competition_level: analysis.competition.competitionLevel,
        opportunity_score: analysis.opportunityScore.overallScore,
        business_name: businessName,
        business_category: businessCategory,
      });

      setSavedAnalyses((prev) => [saved, ...prev]);
      setSaveSuccessNotice('Location analysis saved to your portfolio!');
      setTimeout(() => setSaveSuccessNotice(null), 4000);
    } catch (err: any) {
      alert('Failed to save analysis: ' + (err?.message || 'Error occurred'));
    }
  };

  // 10. Save a Single Business
  const handleSaveBusiness = async (b: DiscoveredBusiness) => {
    try {
      const saved = await locationApiService.saveBusiness({
        osm_id: b.osm_id,
        business_name: b.name,
        category: b.category,
        latitude: b.latitude,
        longitude: b.longitude,
        address: b.address,
        phone: b.phone,
        website: b.website,
        opening_hours: b.opening_hours,
        brand: b.brand,
        cuisine: b.cuisine,
        distance_meters: b.distance_meters,
      });

      setSavedBusinesses((prev) => [saved, ...prev.filter((sb) => sb.osm_id !== saved.osm_id)]);
      setSaveSuccessNotice(`Saved "${b.name}" to bookmarks.`);
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    } catch (err: any) {
      alert('Failed to save business: ' + (err?.message || 'Error occurred'));
    }
  };

  // 11. Load Saved Analysis from Modal
  const handleSelectSavedAnalysis = (saved: SavedLocationAnalysis) => {
    setSelectedCoords([saved.latitude, saved.longitude]);
    setLocationName(saved.location_name);
    setLocationAddress(saved.address);
    setRadius(saved.radius);
    if (saved.business_category) {
      setBusinessCategory(saved.business_category);
    }
    if (saved.business_name) {
      setBusinessName(saved.business_name);
    }
    loadLocationIntelligence(saved.latitude, saved.longitude, saved.radius, saved.location_name);
  };

  const handleDeleteSavedAnalysis = async (id: number) => {
    try {
      await locationApiService.deleteLocationAnalysis(id);
      setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSavedBusiness = async (id: number) => {
    try {
      await locationApiService.deleteSavedBusiness(id);
      setSavedBusinesses((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter & Sort Businesses for Table
  const filteredBusinesses = businesses
    .filter((b) => {
      // Category filter
      if (selectedCategoryFilter === 'COMPETITORS') {
        if (!b.isDirectCompetitor) return false;
      } else if (selectedCategoryFilter !== 'ALL') {
        if (b.broadCategory !== selectedCategoryFilter) return false;
      }

      // Text search
      if (businessListSearch.trim()) {
        const q = businessListSearch.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCategory = b.category.toLowerCase().includes(q);
        const matchesAddress = b.address?.toLowerCase().includes(q) || false;
        return matchesName || matchesCategory || matchesAddress;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance_meters - b.distance_meters;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

  const categoryFilterOptions = [
    'ALL',
    'COMPETITORS',
    'Food & Beverage',
    'Retail',
    'Healthcare',
    'Finance',
    'Automotive',
    'Services',
    'Fitness',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-xs text-[#FFBF24] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#FFBF24]" />
            <span className="font-semibold">{saveSuccessNotice}</span>
          </div>
          <button
            onClick={() => setSaveSuccessNotice(null)}
            className="text-[11px] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Location Intelligence & Geospatial Analytics"
          description="Discover real nearby businesses, quantify competition levels, analyze spatial density, and calculate opportunity scores using OpenStreetMap."
          badge="Live Spatial Engine"
        />

        {/* Global Action Modals Trigger Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="view-saved-analyses-btn"
            onClick={() => setIsSavedAnalysesOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>Saved Analyses ({savedAnalyses.length})</span>
          </button>

          <button
            id="view-saved-businesses-btn"
            onClick={() => setIsSavedBusinessesOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>Bookmarks ({savedBusinesses.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SEARCH, GEOLOCATION & TARGET PROFILE BAR */}
      <Card className="p-4 sm:p-5">
        <div className="space-y-4">
          {/* Top Row: Search Input + Live Geolocation Button */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Live Autocomplete Search Input */}
            <div className="relative lg:col-span-8">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-[#A1A1AA] pointer-events-none" />
                <input
                  id="osm-location-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search any city, neighborhood, market, or PIN code (e.g. Indiranagar Bangalore, BKC Mumbai, 415409)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#18181B] border border-[#27272A] text-xs sm:text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24] transition-all"
                />
                {isSearching && (
                  <div className="absolute right-3.5 w-4 h-4 border-2 border-[#FFBF24] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div
                  id="osm-search-results-dropdown"
                  className="absolute left-0 right-0 mt-1.5 z-30 rounded-xl bg-[#111113] border border-[#27272A] shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  {searchResults.map((item) => (
                    <button
                      key={item.place_id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-3 hover:bg-[#18181B] border-b border-[#27272A]/50 transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <MapPin className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#FFBF24] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#A1A1AA] truncate">
                          {item.display_name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Geolocation Button */}
            <div className="lg:col-span-4 flex items-center gap-2">
              <button
                id="use-current-location-btn"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FFBF24]/10 cursor-pointer disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#0B0B0C] border-t-transparent rounded-full animate-spin"></div>
                    <span>Locating GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              <button
                id="refresh-scan-btn"
                onClick={() => loadLocationIntelligence(selectedCoords[0], selectedCoords[1], radius, locationName)}
                disabled={isLoadingAnalysis}
                className="p-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors cursor-pointer shrink-0"
                title="Refresh Map Scan"
              >
                <RotateCw className={`w-4 h-4 ${isLoadingAnalysis ? 'animate-spin text-[#FFBF24]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Location Error Warning */}
          {locationError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Quick Preset Location Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-[#71717A] uppercase shrink-0">
              Quick Locations:
            </span>
            {presetLocations.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors shrink-0 cursor-pointer ${
                  locationName === preset.name
                    ? 'bg-[#FFBF24]/15 border-[#FFBF24] text-[#FFBF24]'
                    : 'bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] hover:border-[#3F3F46]'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Target Business Customization (Links to Part 3 Feasibility Engine) */}
          <div className="pt-3 border-t border-[#27272A] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">
                Target Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Artisan Cafe & Roastery"
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">
                Planned Industry / Category
              </label>
              <select
                value={businessCategory}
                onChange={(e) => {
                  setBusinessCategory(e.target.value);
                  loadLocationIntelligence(selectedCoords[0], selectedCoords[1], radius, locationName);
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24] cursor-pointer"
              >
                <option value="Cafe">Cafe / Coffee Shop</option>
                <option value="Restaurant">Restaurant / Bistro</option>
                <option value="Bakery">Bakery & Confectionery</option>
                <option value="Grocery">Grocery / Supermarket</option>
                <option value="Clothing">Clothing & Apparel</option>
                <option value="Electronics">Electronics & Gadgets</option>
                <option value="Pharmacy">Pharmacy / Chemist</option>
                <option value="Gym">Gym & Fitness Center</option>
                <option value="Salon">Salon & Wellness Spa</option>
                <option value="Hotel">Hotel / Hospitality</option>
              </select>
            </div>

            {/* Radius Presets */}
            <div className="sm:col-span-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">
                <span>Scan Radius</span>
                <span className="text-[#FFBF24] font-mono">{(radius / 1000).toFixed(1)} km</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[500, 1000, 2000, 3000, 5000].map((rVal) => (
                  <button
                    key={rVal}
                    onClick={() => handleRadiusChange(rVal)}
                    className={`flex-1 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      radius === rVal
                        ? 'bg-[#FFBF24] text-[#0B0B0C]'
                        : 'bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A]'
                    }`}
                  >
                    {rVal >= 1000 ? `${rVal / 1000}k` : `${rVal}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: MAP VIEW + ACTIVE LOCATION METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative">
            <MapView
              center={selectedCoords}
              zoom={14}
              businesses={businesses}
              radiusMeters={radius}
              onLocationSelect={handleMapClick}
              onBusinessSelect={(b) => {
                setSelectedBusiness(b);
                setIsDetailsModalOpen(true);
              }}
              targetLocationName={locationName}
              height="500px"
            />

            {/* Floating Loading Bar */}
            {isLoadingAnalysis && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-[#111113]/90 border border-[#FFBF24]/40 text-xs font-semibold text-[#FFBF24] backdrop-blur-md shadow-2xl flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#FFBF24] border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning OpenStreetMap POIs...</span>
              </div>
            )}
          </div>

          {/* Active Target Banner with Save Button */}
          <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 overflow-hidden">
              <div className="text-[11px] font-bold text-[#FFBF24] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Target Coordinates
              </div>
              <h4 className="text-sm font-bold text-[#F8FAFC] truncate">{locationName}</h4>
              <p className="text-xs text-[#A1A1AA] truncate">{locationAddress}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="save-current-analysis-btn"
                onClick={handleSaveAnalysis}
                className="px-4 py-2 rounded-xl bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#FFBF24]/10 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Opportunity Score & Key Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {analysis ? (
            <OpportunityScoreCard analysis={analysis} />
          ) : (
            <div className="p-8 rounded-2xl bg-[#111113] border border-[#27272A] text-center space-y-2">
              <div className="w-8 h-8 border-2 border-[#FFBF24] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#A1A1AA]">Calculating location opportunity score...</p>
            </div>
          )}

          {/* Spatial Density & Summary Quick Stats */}
          {analysis && (
            <Card className="p-4">
              <CardHeader className="p-0 pb-3 mb-3 border-b border-[#27272A]">
                <CardTitle className="text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Spatial Density & Commercial Footprint
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Total POIs Discovered</span>
                  <span className="font-bold text-[#F8FAFC] font-mono">{analysis.totalBusinesses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Trade Area Coverage</span>
                  <span className="font-bold text-[#F8FAFC] font-mono">{analysis.areaKm2} km²</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Commercial Density</span>
                  <span className="font-bold text-[#FFBF24] font-mono">{analysis.businessDensityPerKm2} / km²</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Direct Competitors</span>
                  <span className="font-bold text-rose-400 font-mono">
                    {analysis.competition.directCompetitorCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Nearest Business</span>
                  <span className="font-semibold text-[#F8FAFC] truncate max-w-[150px]">
                    {analysis.nearestBusiness ? `${analysis.nearestBusiness.name} (${analysis.nearestBusiness.distance_formatted})` : 'None'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* SECTION 3: CATEGORY DISTRIBUTION & CHARTS */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Broad Category Distribution */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-4 border-b border-[#27272A]">
              <CardTitle className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FFBF24]" />
                <span>Sector Category Distribution</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Breakdown of commercial establishments by industry in this {(radius / 1000).toFixed(1)}km zone
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {analysis.broadCategoryDistribution.map((item) => (
                <div key={item.broadCategory} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F8FAFC] font-medium">{item.broadCategory}</span>
                    <span className="font-mono text-[#A1A1AA]">
                      {item.count} establishments ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#18181B] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-[#FFBF24]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Distance Proximity Range Buckets */}
          <Card className="p-5">
            <CardHeader className="p-0 pb-3 mb-4 border-b border-[#27272A]">
              <CardTitle className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#3B82F6]" />
                <span>Proximity Distance Clusters</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Radial distance distribution of businesses from target point
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {analysis.distanceDistribution.map((dist) => {
                const pct = analysis.totalBusinesses > 0 ? Math.round((dist.count / analysis.totalBusinesses) * 100) : 0;
                return (
                  <div key={dist.range} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#F8FAFC] font-medium">{dist.range}</span>
                      <span className="font-mono text-[#A1A1AA]">
                        {dist.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#18181B] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-[#3B82F6]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 4: DISCOVERED BUSINESSES DIRECTORY TABLE */}
      <Card className="p-5">
        <div className="space-y-4">
          {/* Table Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#FFBF24]" />
                <span>Discovered Real Businesses ({filteredBusinesses.length})</span>
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Live points of interest queried directly from OpenStreetMap within {(radius / 1000).toFixed(1)} km
              </p>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Local List Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A]" />
                <input
                  type="text"
                  value={businessListSearch}
                  onChange={(e) => setBusinessListSearch(e.target.value)}
                  placeholder="Filter businesses..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FFBF24]"
                />
              </div>

              {/* Sort By Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24] cursor-pointer"
              >
                <option value="distance">Sort by Distance</option>
                <option value="name">Sort by Name (A-Z)</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categoryFilterOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                    : 'bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#F8FAFC]'
                }`}
              >
                {cat === 'COMPETITORS' ? '⚠️ Competitors Only' : cat}
              </button>
            ))}
          </div>

          {/* Business Table */}
          <div className="overflow-x-auto rounded-xl border border-[#27272A]/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18181B] text-[#A1A1AA] uppercase font-semibold text-[10px] tracking-wider border-b border-[#27272A]">
                <tr>
                  <th className="py-3 px-4">Business Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/50 bg-[#111113]">
                {filteredBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-[#A1A1AA]">
                      {isLoadingAnalysis ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-[#FFBF24] border-t-transparent rounded-full animate-spin"></div>
                          <span>Querying OpenStreetMap spatial nodes...</span>
                        </div>
                      ) : (
                        'No businesses found matching current filter criteria.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredBusinesses.map((b) => {
                    const isSaved = savedBusinesses.some((sb) => String(sb.osm_id) === String(b.osm_id));
                    return (
                      <tr
                        key={b.osm_id}
                        className="hover:bg-[#18181B]/70 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedBusiness(b);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        {/* Name & Competitor badge */}
                        <td className="py-3 px-4 font-semibold text-[#F8FAFC]">
                          <div className="flex items-center gap-2">
                            <span>{b.name}</span>
                            {b.isDirectCompetitor && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                                Competitor
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
                            {b.category}
                          </span>
                        </td>

                        {/* Distance */}
                        <td className="py-3 px-4 font-mono text-[#F8FAFC]">
                          {b.distance_formatted}
                        </td>

                        {/* Address */}
                        <td className="py-3 px-4 text-[#A1A1AA] max-w-xs truncate">
                          {b.address || <span className="text-[#71717A] italic">Not available</span>}
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-4 text-[#A1A1AA]">
                          {b.phone || (b.website ? 'Website available' : <span className="text-[#71717A] italic">Not available</span>)}
                        </td>

                        {/* Action Buttons */}
                        <td
                          className="py-3 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedBusiness(b);
                                setIsDetailsModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded bg-[#27272A]/50 hover:bg-[#27272A] text-[11px] font-medium text-[#F8FAFC] transition-colors cursor-pointer"
                            >
                              Details
                            </button>

                            <button
                              onClick={() => handleSaveBusiness(b)}
                              disabled={isSaved}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                isSaved
                                  ? 'text-emerald-400 cursor-default'
                                  : 'text-[#A1A1AA] hover:text-[#FFBF24] hover:bg-[#27272A]'
                              }`}
                              title={isSaved ? 'Saved in bookmarks' : 'Save business'}
                            >
                              {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Attribution footer */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-[#71717A]">
            <span>Data source: OpenStreetMap Nominatim & Overpass API</span>
            <span className="text-[#FFBF24]">© OpenStreetMap contributors</span>
          </div>
        </div>
      </Card>

      {/* SECTION 5: MODALS */}
      {/* 1. Business Details Modal */}
      <BusinessDetailsModal
        business={selectedBusiness}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBusiness(null);
        }}
        onSave={handleSaveBusiness}
        isSaved={selectedBusiness ? savedBusinesses.some((sb) => String(sb.osm_id) === String(selectedBusiness.osm_id)) : false}
      />

      {/* 2. Saved Analyses Drawer / Modal */}
      <SavedAnalysesModal
        isOpen={isSavedAnalysesOpen}
        onClose={() => setIsSavedAnalysesOpen(false)}
        analyses={savedAnalyses}
        onSelectAnalysis={handleSelectSavedAnalysis}
        onDeleteAnalysis={handleDeleteSavedAnalysis}
        loading={isLoadingSaved}
      />

      {/* 3. Saved Businesses Modal */}
      <SavedBusinessesModal
        isOpen={isSavedBusinessesOpen}
        onClose={() => setIsSavedBusinessesOpen(false)}
        savedBusinesses={savedBusinesses}
        onDeleteSavedBusiness={handleDeleteSavedBusiness}
        loading={isLoadingSaved}
      />
    </div>
  );
};
