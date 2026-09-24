import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Bookmark,
  RotateCw,
  GitCompare,
  Building,
  Check,
  AlertCircle,
  Sparkles,
  Compass,
  Briefcase,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { locationApiService } from '../../services/locationService';
import {
  GeoLocationResult,
  DiscoveredBusiness,
  LocationAnalysisResult,
  SavedLocationAnalysis,
  SavedBusiness,
} from '../../types';

// Modular Location Components
import { LocationSearch } from '../../components/location/LocationSearch';
import { CurrentLocationButton } from '../../components/location/CurrentLocationButton';
import { RadiusSelector } from '../../components/location/RadiusSelector';
import { LocationMap } from '../../components/location/LocationMap';
import { LocationKpiCards } from '../../components/location/LocationKpiCards';
import { BusinessDensityCard } from '../../components/location/BusinessDensityCard';
import { CompetitorAnalysis } from '../../components/location/CompetitorAnalysis';
import { CategoryDistributionChart } from '../../components/location/CategoryDistributionChart';
import { LocationInsights } from '../../components/location/LocationInsights';
import { BusinessFilters, BusinessFilterState } from '../../components/location/BusinessFilters';
import { NearbyBusinessList } from '../../components/location/NearbyBusinessList';
import { SavedLocations } from '../../components/location/SavedLocations';
import { LocationComparison } from '../../components/location/LocationComparison';
import { DataSourceInfo } from '../../components/location/DataSourceInfo';
import { BusinessDetailsModal } from '../../components/location/BusinessDetailsModal';

// Standard Google Places supported categories
const CATEGORY_PRESETS = [
  'Cafe',
  'Restaurant',
  'Bakery',
  'Grocery Store',
  'Supermarket',
  'Clothing Store',
  'Electronics Store',
  'Mobile Phone Store',
  'Pharmacy',
  'Salon',
  'Gym',
  'Hotel',
  'Book Store',
  'Furniture Store',
  'Jewelry Store',
  'Automotive',
  'Education',
  'Healthcare',
  'Other',
];

export const LocationAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paramLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 16.8524;
  const paramLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 74.5815;
  const paramName = searchParams.get('name') || 'Sangli, Maharashtra';

  // Target location state
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([paramLat, paramLng]);
  const [locationName, setLocationName] = useState<string>(paramName);
  const [locationAddress, setLocationAddress] = useState<string>(paramName);
  const [radiusMeters, setRadiusMeters] = useState<number>(2000); // 2 km default
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  // Target business profile state
  const [businessIdea, setBusinessIdea] = useState<string>('Specialty Artisan Cafe & Roastery');
  const [businessCategory, setBusinessCategory] = useState<string>('Cafe');

  // Analysis result state
  const [analysis, setAnalysis] = useState<LocationAnalysisResult | null>(null);
  const [businesses, setBusinesses] = useState<DiscoveredBusiness[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('Finding nearby businesses...');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Selected business for modal
  const [selectedBusiness, setSelectedBusiness] = useState<DiscoveredBusiness | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filter state for business list
  const [filters, setFilters] = useState<BusinessFilterState>({
    category: 'ALL',
    competitorsOnly: false,
    sortBy: 'distance_asc',
    searchQuery: '',
  });

  // Saved analyses and businesses
  const [savedAnalyses, setSavedAnalyses] = useState<SavedLocationAnalysis[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Comparison selection
  const [compareIds, setCompareIds] = useState<number[]>([]);

  // Active section tab: 'analysis' | 'saved' | 'comparison'
  const [activeTab, setActiveTab] = useState<'analysis' | 'saved' | 'comparison'>('analysis');

  const loadingTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Initial load
  useEffect(() => {
    loadAnalysis(selectedCoords[0], selectedCoords[1], radiusMeters);
    loadSavedRecords();
    return () => {
      loadingTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const loadSavedRecords = async () => {
    try {
      const [analyses, savedB] = await Promise.all([
        locationApiService.listLocationAnalyses(),
        locationApiService.listSavedBusinesses(),
      ]);
      setSavedAnalyses(analyses);
      setSavedBusinesses(savedB);
    } catch (err) {
      console.warn('Failed to load saved records:', err);
    }
  };

  const loadAnalysis = async (
    lat: number,
    lng: number,
    radius: number,
    customName?: string,
    customAddr?: string,
    categoryOverride?: string,
    ideaOverride?: string
  ) => {
    setIsLoading(true);
    setAnalysisError(null);
    setLoadingStage('Finding nearby businesses...');

    // Staged progress indicators (Section 35)
    loadingTimerRef.current.forEach(clearTimeout);
    loadingTimerRef.current = [];

    const t1 = setTimeout(() => {
      setLoadingStage('Analyzing competitors...');
    }, 600);
    const t2 = setTimeout(() => {
      setLoadingStage('Preparing location insights...');
    }, 1300);
    loadingTimerRef.current.push(t1, t2);

    const catToUse = categoryOverride !== undefined ? categoryOverride : businessCategory;
    const ideaToUse = ideaOverride !== undefined ? ideaOverride : businessIdea;

    try {
      const areaToUse = customName || locationName || '';
      const analysisPromise = locationApiService.analyzeLocation({
        latitude: lat,
        longitude: lng,
        radius,
        businessName: ideaToUse,
        businessCategory: catToUse,
      });

      const nearbyPromise = locationApiService.getNearbyBusinesses(
        lat,
        lng,
        radius,
        areaToUse,
        catToUse,
        ideaToUse
      );

      const [analysisRes, nearbyRes] = await Promise.all([analysisPromise, nearbyPromise]);

      if (customName) {
        setLocationName(customName);
        if (customAddr) setLocationAddress(customAddr);
      } else if (analysisRes.targetLocation?.name) {
        setLocationName(analysisRes.targetLocation.name);
        setLocationAddress(analysisRes.targetLocation.address);
      }

      setAnalysis(analysisRes);

      const rawBusinesses =
        analysisRes.businesses && analysisRes.businesses.length > 0
          ? analysisRes.businesses
          : nearbyRes.businesses || [];

      // Enhance discovered businesses with direct competitor flag
      const competitorOsmIds = new Set(
        (analysisRes.competition?.directCompetitors || []).map((c) => String(c.osm_id || c.id))
      );

      const enhanced = rawBusinesses.map((b) => {
        const isComp =
          competitorOsmIds.has(String(b.osm_id || b.id)) ||
          Boolean(b.isDirectCompetitor || b.is_direct_competitor);
        return {
          ...b,
          is_direct_competitor: isComp,
          isDirectCompetitor: isComp,
        };
      });

      setBusinesses(enhanced);
    } catch (err: any) {
      console.error('Error running location analysis:', err);
      setAnalysisError(
        err?.message ||
          'Unable to load nearby businesses. Please check your Google Maps API configuration.'
      );
    } finally {
      setIsLoading(false);
      loadingTimerRef.current.forEach(clearTimeout);
    }
  };

  // Location search selection handler
  const handleLocationSelect = (item: GeoLocationResult) => {
    setSelectedCoords([item.latitude, item.longitude]);
    setLocationName(item.name || item.display_name.split(',')[0]);
    setLocationAddress(item.display_name);

    if (item.type === 'current_location') {
      setCurrentLocation([item.latitude, item.longitude]);
    }

    loadAnalysis(item.latitude, item.longitude, radiusMeters, item.name, item.display_name);
  };

  // Map click coordinate handler
  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedCoords([lat, lng]);
    try {
      const reverse = await locationApiService.reverseGeocode(lat, lng);
      if (reverse) {
        setLocationName(reverse.name);
        setLocationAddress(reverse.display_name);
        loadAnalysis(lat, lng, radiusMeters, reverse.name, reverse.display_name);
      } else {
        const coordName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setLocationName(coordName);
        setLocationAddress(coordName);
        loadAnalysis(lat, lng, radiusMeters, coordName, coordName);
      }
    } catch {
      loadAnalysis(lat, lng, radiusMeters);
    }
  };

  // Radius change handler
  const handleRadiusChange = (newRadius: number) => {
    setRadiusMeters(newRadius);
    loadAnalysis(selectedCoords[0], selectedCoords[1], newRadius, locationName, locationAddress);
  };

  // Trigger fresh analysis button click
  const handleAnalyzeLocation = () => {
    loadAnalysis(
      selectedCoords[0],
      selectedCoords[1],
      radiusMeters,
      locationName,
      locationAddress,
      businessCategory,
      businessIdea
    );
  };

  // Save current analysis
  const handleSaveCurrentAnalysis = async () => {
    if (!analysis) return;
    setIsSaving(true);
    try {
      const saved = await locationApiService.saveLocationAnalysis({
        location_name: locationName,
        address: locationAddress,
        latitude: selectedCoords[0],
        longitude: selectedCoords[1],
        business_idea: businessIdea,
        business_category: businessCategory,
        radius_km: radiusMeters / 1000,
        radius: radiusMeters,
        total_businesses: businesses.length,
        business_count: businesses.length,
        relevant_businesses: analysis.competition?.directCompetitorCount || 0,
        business_density: analysis.businessDensityPerKm2,
        average_relevant_distance: analysis.averageRelevantDistance || null,
        concentration_level: analysis.concentrationLevel || 'LOW',
        opportunity_score: analysis.opportunityScore?.overallScore || 70,
        category_summary: analysis.categoryDistribution.reduce((acc, curr) => {
          acc[curr.category] = curr.count;
          return acc;
        }, {} as Record<string, number>),
      });

      setSavedAnalyses((prev) => [saved, ...prev]);
      setSaveSuccessMsg(`Location analysis for "${locationName}" saved to your portfolio.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to save location analysis:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBusiness = async (biz: DiscoveredBusiness) => {
    try {
      const saved = await locationApiService.saveBusiness({
        osm_id: String(biz.osm_id || biz.id),
        business_name: biz.name,
        category: biz.category,
        latitude: biz.latitude,
        longitude: biz.longitude,
        address: biz.address,
        phone: biz.phone,
        website: biz.website,
        opening_hours: biz.opening_hours,
        brand: biz.brand,
        cuisine: biz.cuisine,
        distance_meters: biz.distance_meters,
      });
      setSavedBusinesses((prev) => [saved, ...prev]);
    } catch (err: any) {
      console.error('Failed to save business:', err);
    }
  };

  const handleDeleteAnalysis = async (id: number) => {
    try {
      await locationApiService.deleteLocationAnalysis(id);
      setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
      setCompareIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    }
  };

  const handleLoadSavedAnalysis = (saved: SavedLocationAnalysis) => {
    setSelectedCoords([saved.latitude, saved.longitude]);
    setLocationName(saved.location_name);
    setLocationAddress(saved.address);
    if (saved.radius) setRadiusMeters(saved.radius);
    if (saved.business_category) setBusinessCategory(saved.business_category);
    if (saved.business_idea) setBusinessIdea(saved.business_idea);
    setActiveTab('analysis');
    loadAnalysis(saved.latitude, saved.longitude, saved.radius || 2000, saved.location_name, saved.address);
  };

  const handleToggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], id];
      }
      return [...prev, id];
    });
  };

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((biz) => {
        if (filters.category !== 'ALL') {
          const cat = (biz.category || '').toLowerCase();
          const targetCat = filters.category.toLowerCase();
          if (!cat.includes(targetCat) && !targetCat.includes(cat)) return false;
        }

        if (filters.competitorsOnly && !biz.is_direct_competitor) {
          return false;
        }

        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = (biz.name || '').toLowerCase().includes(q);
          const matchesAddr = (biz.address || '').toLowerCase().includes(q);
          if (!matchesName && !matchesAddr) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'distance_asc') {
          return (a.distance_meters || 0) - (b.distance_meters || 0);
        }
        if (filters.sortBy === 'distance_desc') {
          return (b.distance_meters || 0) - (a.distance_meters || 0);
        }
        if (filters.sortBy === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
      });
  }, [businesses, filters]);

  const availableCategoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    businesses.forEach((b) => {
      const c = b.category || 'Other';
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).map(([category, count]) => ({ category, count }));
  }, [businesses]);

  const savedOsmIdSet = useMemo(() => {
    return new Set(savedBusinesses.map((b) => String(b.osm_id)));
  }, [savedBusinesses]);

  const compareList = useMemo(() => {
    return savedAnalyses.filter((a) => compareIds.includes(a.id));
  }, [savedAnalyses, compareIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeader
            title="Location Intelligence & Geospatial Analytics"
            subtitle="Discover nearby commercial presence, calculate business density, and evaluate transparent competition powered by Google Maps Platform & Google Places API (New)."
          />
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Send to Market Analysis */}
          <button
            type="button"
            onClick={() => {
              navigate(
                `/market-analysis?idea=${encodeURIComponent(businessIdea)}&category=${encodeURIComponent(businessCategory)}&location=${encodeURIComponent(locationName)}&lat=${selectedCoords[0]}&lng=${selectedCoords[1]}&radius=${radiusMeters / 1000}`
              );
            }}
            className="px-3.5 py-2 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open in Market Analysis</span>
          </button>

          {/* Send to Business Planner */}
          <button
            type="button"
            onClick={() => {
              const compCount = analysis?.relevantBusinesses || analysis?.competition?.directCompetitorCount || 0;
              const densityVal = analysis?.businessDensityPerKm2 || 0;
              navigate(
                `/business-plans/new?location=${encodeURIComponent(locationName)}&lat=${selectedCoords[0]}&lng=${selectedCoords[1]}&category=${encodeURIComponent(businessCategory)}&businessName=${encodeURIComponent(businessIdea)}&competitors=${compCount}&density=${densityVal}`
              );
            }}
            className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Apply to Business Plan</span>
          </button>

          <button
            type="button"
            onClick={handleSaveCurrentAnalysis}
            disabled={!analysis || isSaving}
            className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>{isSaving ? 'Saving...' : 'Save Site'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'saved' ? 'analysis' : 'saved')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[#FFBF24]/15 border-[#FFBF24] text-[#FFBF24]'
                : 'bg-[#111113] hover:bg-[#1A1A1D] border-[#27272A] text-[#F8FAFC]'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#A1A1AA]" />
            <span>Saved Sites ({savedAnalyses.length})</span>
          </button>
        </div>
      </div>

      {/* Save Success Notice */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Staged Loading Bar (Section 35) */}
      {isLoading && (
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#FFBF24]/30 shadow-lg flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Loader2 className="w-4 h-4 animate-spin text-[#FFBF24]" />
            <span className="text-xs font-semibold text-[#F8FAFC]">{loadingStage}</span>
          </div>
          <span className="text-[11px] text-[#A1A1AA] font-mono">Google Places (New) live lookup</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272A]">
        <button
          type="button"
          onClick={() => setActiveTab('analysis')}
          className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'analysis'
              ? 'text-[#FFBF24] border-[#FFBF24]'
              : 'text-[#71717A] border-transparent hover:text-[#A1A1AA]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Live Location Analysis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'saved'
              ? 'text-[#FFBF24] border-[#FFBF24]'
              : 'text-[#71717A] border-transparent hover:text-[#A1A1AA]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Sites ({savedAnalyses.length})</span>
        </button>

        {compareIds.length >= 2 && (
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'comparison'
                ? 'text-[#FFBF24] border-[#FFBF24]'
                : 'text-[#71717A] border-transparent hover:text-[#A1A1AA]'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Site Comparison ({compareIds.length})</span>
          </button>
        )}
      </div>

      {/* Main Tab: Live Location Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Top Controls Box: Location Search & Analysis Controls */}
          <div className="p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Location Search Input (Section 5) */}
              <div className="lg:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FFBF24]" />
                  Search Location (Any City, Area, Address or PIN)
                </label>
                <div className="flex items-center gap-2">
                  <LocationSearch
                    onSelectLocation={handleLocationSelect}
                    currentLocationName={locationName}
                    className="flex-1"
                  />
                  <CurrentLocationButton onLocationFound={handleLocationSelect} />
                </div>
              </div>

              {/* Business Idea Context (Section 11) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Enter Your Business Idea
                </label>
                <input
                  type="text"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="e.g. Coffee Shop, Mobile Repair, Bakery"
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#27272A] focus:border-[#FFBF24] rounded-lg text-xs text-[#F8FAFC] focus:outline-none"
                />
              </div>

              {/* Business Category Selection (Section 10) */}
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#27272A] focus:border-[#FFBF24] rounded-lg text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary Analyze Location Button (Section 20) */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={handleAnalyzeLocation}
                  disabled={isLoading}
                  className="w-full py-2 px-3.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Analyzing...' : 'Analyze Location'}</span>
                </button>
              </div>
            </div>

            {/* Radius Selector (Section 9) */}
            <div className="pt-3 border-t border-[#27272A]">
              <RadiusSelector
                selectedRadiusMeters={radiusMeters}
                onChangeRadius={handleRadiusChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Data Source Notice Banner (Section 36) */}
          <DataSourceInfo variant="banner" />

          {/* Analysis Error Message */}
          {analysisError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Analytical KPI Cards */}
          {analysis && <LocationKpiCards analysis={analysis} />}

          {/* Split Main Layout: Map & POIs on Left, Analytical Cards on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Google Map + Discovered Places List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Location Map Container (Section 4) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5 text-[#F8FAFC] font-semibold truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
                    <span className="truncate">{locationName}</span>
                  </div>
                  <span className="text-[#A1A1AA] text-[11px] font-mono">
                    {selectedCoords[0].toFixed(4)}, {selectedCoords[1].toFixed(4)}
                  </span>
                </div>

                <LocationMap
                  center={selectedCoords}
                  radiusMeters={radiusMeters}
                  businesses={filteredBusinesses}
                  targetLocationName={locationName}
                  selectedBusinessId={selectedBusiness?.id}
                  onLocationSelect={handleMapClick}
                  currentLocation={currentLocation}
                  onBusinessSelect={(biz) => {
                    setSelectedBusiness(biz);
                    setIsModalOpen(true);
                  }}
                  onBusinessSave={handleSaveBusiness}
                  height="460px"
                />
              </div>

              {/* Filters for Discovered Places */}
              <BusinessFilters
                filters={filters}
                onChangeFilters={setFilters}
                availableCategories={availableCategoryCounts}
                totalBusinesses={businesses.length}
                competitorCount={analysis?.relevantBusinesses || analysis?.competition?.directCompetitorCount || 0}
              />

              {/* Nearby Business List (Section 14) */}
              <NearbyBusinessList
                businesses={filteredBusinesses}
                onSelectBusiness={(biz) => {
                  setSelectedBusiness(biz);
                  setIsModalOpen(true);
                }}
                onSaveBusiness={handleSaveBusiness}
                savedOsmIds={savedOsmIdSet}
                selectedBusinessId={selectedBusiness?.id}
                onExpandRadius={handleRadiusChange}
                currentRadiusMeters={radiusMeters}
              />
            </div>

            {/* Right 5 Columns: Spatial Intelligence & Analysis Cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* Business Density Card (Section 18) */}
              {analysis && <BusinessDensityCard analysis={analysis} />}

              {/* Competitor Analysis Card (Section 16 & 17) */}
              {analysis && (
                <CompetitorAnalysis
                  analysis={analysis}
                  onSelectBusiness={(biz) => {
                    setSelectedBusiness(biz);
                    setIsModalOpen(true);
                  }}
                />
              )}

              {/* Category Distribution Chart */}
              {analysis && <CategoryDistributionChart analysis={analysis} />}

              {/* Location Insights Engine (Section 19) */}
              {analysis && <LocationInsights analysis={analysis} />}

              {/* Data Source Disclosure Card (Section 36) */}
              <DataSourceInfo variant="card" />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Saved Locations Portfolio */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <SavedLocations
            savedAnalyses={savedAnalyses}
            onLoadAnalysis={handleLoadSavedAnalysis}
            onDeleteAnalysis={handleDeleteAnalysis}
            selectedForCompareIds={compareIds}
            onToggleCompareId={handleToggleCompare}
          />

          {compareIds.length >= 2 && (
            <LocationComparison
              locations={compareList}
              onRemoveLocation={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
              onClose={() => setCompareIds([])}
            />
          )}
        </div>
      )}

      {/* Tab: Multi-Location Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <LocationComparison
            locations={compareList}
            onRemoveLocation={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
            onClose={() => setActiveTab('saved')}
          />
        </div>
      )}

      {/* Business Details Modal */}
      <BusinessDetailsModal
        business={selectedBusiness}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBusiness(null);
        }}
        onSave={handleSaveBusiness}
        isSaved={selectedBusiness ? savedOsmIdSet.has(String(selectedBusiness.osm_id || selectedBusiness.id)) : false}
      />
    </div>
  );
};
