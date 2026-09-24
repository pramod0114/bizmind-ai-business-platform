import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Target,
  Bookmark,
  RotateCw,
  GitCompare,
  Building,
  Check,
  AlertCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ShieldCheck,
  Layers,
  Compass,
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

// Reusable Location Modular Components (Section 33)
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

const CATEGORY_PRESETS = [
  'Café',
  'Restaurant',
  'Grocery Store',
  'Retail Shop',
  'Pharmacy',
  'Bakery',
  'Gym',
  'Hospital',
  'Hotel',
  'Clothing Store',
  'Supermarket',
];

export const LocationAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paramLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 16.8524;
  const paramLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 74.5815;
  const paramName = searchParams.get('name') || 'Sangli, Maharashtra';

  // Target location state (defaults to Sangli, Maharashtra as requested in context)
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([paramLat, paramLng]);
  const [locationName, setLocationName] = useState<string>(paramName);
  const [locationAddress, setLocationAddress] = useState<string>(paramName);
  const [radiusMeters, setRadiusMeters] = useState<number>(2000); // 2 km default

  // Target business profile state
  const [businessIdea, setBusinessIdea] = useState<string>('Specialty Artisan Cafe & Roastery');
  const [businessCategory, setBusinessCategory] = useState<string>('Café');

  // Analysis result state
  const [analysis, setAnalysis] = useState<LocationAnalysisResult | null>(null);
  const [businesses, setBusinesses] = useState<DiscoveredBusiness[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [showComparison, setShowComparison] = useState<boolean>(false);

  // Active section tab: 'analysis' | 'saved' | 'comparison'
  const [activeTab, setActiveTab] = useState<'analysis' | 'saved' | 'comparison'>('analysis');

  // Initial load
  useEffect(() => {
    loadAnalysis(selectedCoords[0], selectedCoords[1], radiusMeters);
    loadSavedRecords();
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
    categoryOverride?: string
  ) => {
    setIsLoading(true);
    setAnalysisError(null);

    const catToUse = categoryOverride !== undefined ? categoryOverride : businessCategory;
    try {
      const areaToUse = customName || locationName || '';
      const analysisPromise = locationApiService.analyzeLocation({
        latitude: lat,
        longitude: lng,
        radius,
        businessName: businessIdea,
        businessCategory: catToUse,
      });

      const nearbyPromise = locationApiService.getNearbyBusinesses(lat, lng, radius, areaToUse);
      const [analysisRes, nearbyRes] = await Promise.all([analysisPromise, nearbyPromise]);

      if (customName) {
        setLocationName(customName);
        if (customAddr) setLocationAddress(customAddr);
      } else if (analysisRes.targetLocation?.name) {
        setLocationName(analysisRes.targetLocation.name);
        setLocationAddress(analysisRes.targetLocation.address);
      }

      setAnalysis(analysisRes);

      // Prefer businesses returned directly from spatial analysis for 100% sync
      const rawBusinesses =
        analysisRes.businesses && analysisRes.businesses.length > 0
          ? analysisRes.businesses
          : nearbyRes.businesses || [];

      // Enhance discovered businesses with direct competitor flag
      const competitorOsmIds = new Set(
        (analysisRes.competition?.directCompetitors || []).map((c) => String(c.osm_id))
      );

      const enhanced = rawBusinesses.map((b) => {
        const isComp = competitorOsmIds.has(String(b.osm_id)) || Boolean(b.isDirectCompetitor);
        return {
          ...b,
          is_direct_competitor: isComp,
          isDirectCompetitor: isComp,
        };
      });

      setBusinesses(enhanced);
    } catch (err: any) {
      console.error('Error running location analysis:', err);
      setAnalysisError(err?.message || 'Unable to retrieve location analysis from OpenStreetMap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Location search selection handler
  const handleLocationSelect = (item: GeoLocationResult) => {
    setSelectedCoords([item.latitude, item.longitude]);
    setLocationName(item.name || item.display_name.split(',')[0]);
    setLocationAddress(item.display_name);
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

  // Trigger analysis rerun with updated business idea/category
  const handleRerunAnalysis = () => {
    loadAnalysis(selectedCoords[0], selectedCoords[1], radiusMeters, locationName, locationAddress);
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
        radius_km: analysis.radiusKm || radiusMeters / 1000,
        total_businesses: analysis.totalBusinesses || 0,
        relevant_businesses: analysis.relevantBusinesses || analysis.competition?.directCompetitorCount || 0,
        business_density: analysis.businessDensity || analysis.businessDensityPerKm2 || 0,
        average_relevant_distance: analysis.averageRelevantDistance || 'N/A',
        concentration_level: analysis.concentrationLevel || 'Low concentration',
        radius: radiusMeters,
        business_count: analysis.totalBusinesses || 0,
        category_summary: (analysis.categoryDistribution || []).reduce<Record<string, number>>((acc, item) => {
          acc[item.category] = item.count;
          return acc;
        }, {}),
        competition_level: analysis.competition?.competitionLevel || 'LOW',
        opportunity_score: analysis.opportunityScore?.overallScore || 70,
        business_name: businessIdea,
      });

      setSavedAnalyses((prev) => [saved, ...prev.filter((a) => a.id !== saved.id)]);
      setSaveSuccessMsg('Location analysis successfully saved to your portfolio!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      alert('Failed to save analysis: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  // Save single business bookmark
  const handleSaveBusiness = async (biz: DiscoveredBusiness) => {
    try {
      const saved = await locationApiService.saveBusiness({
        osm_id: biz.osm_id,
        business_name: biz.name,
        category: biz.category || 'Commercial',
        latitude: biz.latitude,
        longitude: biz.longitude,
        address: biz.address,
        phone: biz.phone,
        website: biz.website,
        distance_meters: biz.distance_meters,
      });
      setSavedBusinesses((prev) => [saved, ...prev.filter((b) => b.osm_id !== saved.osm_id)]);
    } catch (err) {
      console.warn('Failed to save business:', err);
    }
  };

  // Delete saved analysis
  const handleDeleteAnalysis = async (id: number | string) => {
    try {
      await locationApiService.deleteLocationAnalysis(id);
      setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
      setCompareIds((prev) => prev.filter((cid) => cid !== id));
    } catch (err) {
      console.warn('Failed to delete analysis:', err);
    }
  };

  // Load saved analysis onto map
  const handleLoadSavedAnalysis = (saved: SavedLocationAnalysis) => {
    setSelectedCoords([saved.latitude, saved.longitude]);
    setLocationName(saved.location_name);
    setLocationAddress(saved.address);
    if (saved.business_idea) setBusinessIdea(saved.business_idea);
    if (saved.business_category) setBusinessCategory(saved.business_category);
    const rad = saved.radius || (saved.radius_km ? saved.radius_km * 1000 : 2000);
    setRadiusMeters(rad);
    loadAnalysis(saved.latitude, saved.longitude, rad, saved.location_name, saved.address);
    setActiveTab('analysis');
  };

  // Toggle compare selection
  const handleToggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        alert('You can compare up to 4 locations side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Filter and sort businesses for list display
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((biz) => {
        // Category filter
        if (filters.category !== 'ALL') {
          const cat = (biz.category || '').toLowerCase();
          const targetCat = filters.category.toLowerCase();
          if (!cat.includes(targetCat) && !targetCat.includes(cat)) return false;
        }

        // Competitors only
        if (filters.competitorsOnly && !biz.is_direct_competitor) {
          return false;
        }

        // Search query
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

  // Categories count list for filter bar
  const availableCategoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    businesses.forEach((b) => {
      const c = b.category || 'Other';
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).map(([category, count]) => ({ category, count }));
  }, [businesses]);

  const savedOsmIdSet = useMemo(() => {
    return new Set(savedBusinesses.map((b) => b.osm_id));
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
            subtitle="Discover nearby commercial presence, measure commercial density, and analyze transparent competitor concentration powered by OpenStreetMap."
          />
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
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
            <span>Market Analysis (Part 6)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveCurrentAnalysis}
            disabled={!analysis || isSaving}
            className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>{isSaving ? 'Saving...' : 'Save Analysis'}</span>
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
            <span>Saved Portfolio ({savedAnalyses.length})</span>
          </button>

          {compareIds.length >= 2 && (
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className="px-3.5 py-2 rounded-lg bg-[#FFBF24]/10 hover:bg-[#FFBF24]/20 border border-[#FFBF24]/30 text-[#FFBF24] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Sites ({compareIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Success Notice */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
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
          <span>Live Spatial Analysis</span>
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
          <span>Saved Locations ({savedAnalyses.length})</span>
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

      {/* Main Tab: Live Spatial Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Top Controls Box */}
          <div className="p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Location Search Input */}
              <div className="lg:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FFBF24]" />
                  Target Location
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

              {/* Business Idea Context */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Business Idea Name
                </label>
                <input
                  type="text"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="e.g. Specialty Artisan Cafe"
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#27272A] focus:border-[#FFBF24] rounded-lg text-xs text-[#F8FAFC] focus:outline-none"
                />
              </div>

              {/* Business Category Selection */}
              <div className="lg:col-span-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                    Category Match
                  </label>
                  <button
                    type="button"
                    onClick={handleRerunAnalysis}
                    disabled={isLoading}
                    className="text-[10px] text-[#FFBF24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <select
                  value={businessCategory}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setBusinessCategory(newCat);
                    loadAnalysis(
                      selectedCoords[0],
                      selectedCoords[1],
                      radiusMeters,
                      locationName,
                      locationAddress,
                      newCat
                    );
                  }}
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#27272A] focus:border-[#FFBF24] rounded-lg text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Radius Selector */}
            <div className="pt-3 border-t border-[#27272A]">
              <RadiusSelector
                selectedRadiusMeters={radiusMeters}
                onChangeRadius={handleRadiusChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Data Source Notice Banner */}
          <DataSourceInfo variant="banner" />

          {/* Analysis Error Message if any */}
          {analysisError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Analytical KPI Cards (Section 9) */}
          {analysis && <LocationKpiCards analysis={analysis} />}

          {/* Split Main Layout: Map & POIs on Left, Analytical Cards on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Interactive Map + Discovered POI List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Location Map (Section 5 & 6) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5 text-[#F8FAFC] font-semibold truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
                    <span className="truncate">{locationName}</span>
                  </div>
                  <span className="text-[#71717A] text-[11px]">
                    Coordinates: {selectedCoords[0].toFixed(4)}, {selectedCoords[1].toFixed(4)}
                  </span>
                </div>

                <LocationMap
                  center={selectedCoords}
                  radiusMeters={radiusMeters}
                  businesses={filteredBusinesses}
                  targetLocationName={locationName}
                  selectedBusinessId={selectedBusiness?.id}
                  onLocationSelect={handleMapClick}
                  onBusinessSelect={(biz) => {
                    setSelectedBusiness(biz);
                    setIsModalOpen(true);
                  }}
                  onBusinessSave={handleSaveBusiness}
                  height="450px"
                />
              </div>

              {/* Filters for Discovered Businesses (Section 7) */}
              <BusinessFilters
                filters={filters}
                onChangeFilters={setFilters}
                availableCategories={availableCategoryCounts}
                totalBusinesses={businesses.length}
                competitorCount={analysis?.relevantBusinesses || analysis?.competition?.directCompetitorCount || 0}
              />

              {/* Structured Nearby Businesses List (Section 8) */}
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
              {/* Business Density Card (Section 10) */}
              {analysis && <BusinessDensityCard analysis={analysis} />}

              {/* Competitor Analysis Card (Section 11 & 12) */}
              {analysis && (
                <CompetitorAnalysis
                  analysis={analysis}
                  onSelectBusiness={(biz) => {
                    setSelectedBusiness(biz);
                    setIsModalOpen(true);
                  }}
                />
              )}

              {/* Category Distribution Chart (Section 13) */}
              {analysis && <CategoryDistributionChart analysis={analysis} />}

              {/* Location Insights Engine (Section 14) */}
              {analysis && <LocationInsights analysis={analysis} />}

              {/* Data Source Transparency Card (Section 18) */}
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
        isSaved={selectedBusiness ? savedOsmIdSet.has(selectedBusiness.osm_id) : false}
      />
    </div>
  );
};
