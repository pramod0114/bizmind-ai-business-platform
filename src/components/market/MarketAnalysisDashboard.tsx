import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MarketAnalysisData, MarketCompetitor } from '../../types';
import { marketAnalysisService } from '../../services/marketAnalysisService';
import { locationApiService } from '../../services/locationService';
import { planService } from '../../services/planService';
import { PageHeader } from '../common/PageHeader';
import { Card, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';

// Child components
import { MarketSummary } from './MarketSummary';
import { CompetitorMap } from './CompetitorMap';
import { CompetitorList } from './CompetitorList';
import { CompetitorProfile } from './CompetitorProfile';
import { CompetitorDensity } from './CompetitorDensity';
import { CompetitionRisk } from './CompetitionRisk';
import { MarketOpportunity } from './MarketOpportunity';
import { CategoryDistribution } from './CategoryDistribution';
import { DistanceAnalysis } from './DistanceAnalysis';
import { MarketGapAnalysis } from './MarketGapAnalysis';
import { LocationComparison } from './LocationComparison';
import { MarketInsights } from './MarketInsights';
import { DataSourceInfo } from './DataSourceInfo';

import { api } from '../../services/api';

import {
  Compass,
  MapPin,
  Building2,
  Users,
  Navigation,
  Bookmark,
  Share2,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GitCompare,
  X,
  Briefcase,
  Crosshair,
  Trash2,
  ExternalLink,
} from 'lucide-react';

const COMMON_BUSINESS_IDEAS = [
  { value: 'Coffee Shop', label: 'Coffee Shop / Specialty Cafe', category: 'Cafe' },
  { value: 'Restaurant', label: 'Restaurant & Dining Eatery', category: 'Restaurant' },
  { value: 'Salon', label: 'Hair Salon, Beauty & Spa', category: 'Salon & Spa Services' },
  { value: 'Gym', label: 'Gym & Fitness Center', category: 'Gym & Fitness Center' },
  { value: 'Clothing Store', label: 'Clothing Store & Apparel Boutique', category: 'Clothing & Apparel' },
  { value: 'Bakery', label: 'Artisanal Bakery & Patisserie', category: 'Bakery' },
  { value: 'Pharmacy', label: 'Pharmacy & Medical Dispensary', category: 'Pharmacy / Chemist' },
  { value: 'Grocery Store', label: 'Grocery Store & Supermarket', category: 'Supermarket' },
  { value: 'Electronics Store', label: 'Electronics & Home Appliances', category: 'Electronics Store' },
  { value: 'Tuition Center', label: 'Tuition Center & Coaching Academy', category: 'School' },
  { value: 'Mobile Shop', label: 'Mobile Phone & Gadget Shop', category: 'Electronics Store' },
  { value: 'Custom', label: 'Custom Business Idea...', category: 'General' },
];

const QUICK_SEARCH_PICKS = [
  'Sangli, Maharashtra',
  'Vishrambag, Sangli',
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'Pune, Maharashtra',
  'Bandra West, Mumbai',
  'Connaught Place, New Delhi',
];

export const MarketAnalysisDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initial inputs from URL query params (if flowing from Location or Business Plan)
  const initialPlanId = searchParams.get('planId');
  const initialIdea = searchParams.get('idea') || 'Coffee Shop';
  const initialCategory = searchParams.get('category') || 'Cafe';
  const initialLocName = searchParams.get('location') || 'Vishrambag, Sangli';
  const initialLat = parseFloat(searchParams.get('lat') || '16.8524');
  const initialLng = parseFloat(searchParams.get('lng') || '74.5815');
  const initialRadius = parseFloat(searchParams.get('radius') || '2.0');

  // Form states
  const [businessIdeaSelect, setBusinessIdeaSelect] = useState<string>(
    COMMON_BUSINESS_IDEAS.some((i) => i.value === initialIdea) ? initialIdea : 'Custom'
  );
  const [customBusinessIdea, setCustomBusinessIdea] = useState<string>(
    COMMON_BUSINESS_IDEAS.some((i) => i.value === initialIdea) ? '' : initialIdea
  );
  const [businessCategory, setBusinessCategory] = useState<string>(initialCategory);
  const [locationName, setLocationName] = useState<string>(initialLocName);
  const [locationInput, setLocationInput] = useState<string>(initialLocName);
  const [coords, setCoords] = useState<[number, number]>([initialLat, initialLng]);
  const [radiusKm, setRadiusKm] = useState<number>(initialRadius);

  // Current GPS Location Detection state
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Analysis result state
  const [analysisData, setAnalysisData] = useState<MarketAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Saved analyses state & modal
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Selected competitor for profile drawer/modal
  const [selectedCompetitor, setSelectedCompetitor] = useState<MarketCompetitor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeCompetitorId, setActiveCompetitorId] = useState<string | number | null>(null);

  // Location search suggestions state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved analyses on mount
  useEffect(() => {
    loadSavedAnalyses();
  }, []);

  const loadSavedAnalyses = async () => {
    try {
      const data = await marketAnalysisService.list();
      setSavedAnalyses(data || []);
    } catch {
      // ignore
    }
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Execute Analysis
  const runAnalysis = async (
    idea: string,
    category: string,
    lat: number,
    lng: number,
    rKm: number,
    locName: string
  ) => {
    setIsLoading(true);
    setSavedSuccessMessage(null);
    try {
      const data = await marketAnalysisService.calculate({
        businessIdea: idea,
        businessCategory: category,
        latitude: lat,
        longitude: lng,
        radiusKm: rKm,
        locationName: locName,
      });
      setAnalysisData(data);
    } catch (err: any) {
      console.error('Failed to calculate market analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea || 'Coffee Shop' : businessIdeaSelect;
    runAnalysis(finalIdea, businessCategory, coords[0], coords[1], radiusKm, locationName);
  }, []);

  // Handle Idea Change
  const handleIdeaSelectChange = (value: string) => {
    setBusinessIdeaSelect(value);
    const matched = COMMON_BUSINESS_IDEAS.find((i) => i.value === value);
    if (matched && value !== 'Custom') {
      setBusinessCategory(matched.category);
    }
  };

  // Trigger manual analysis run
  const handleAnalyzeClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Retail Venture' : businessIdeaSelect;
    const trimmedLoc = locationInput.trim();

    if (!trimmedLoc) {
      alert('Please enter a target location or city');
      return;
    }

    // If suggestions are active and user submitted, pick top suggestion
    if (suggestions.length > 0) {
      const top = suggestions[0];
      handleSelectLocation(top);
      return;
    }

    // If the input was typed/edited and differs from current locationName, search/geocode it
    if (trimmedLoc !== locationName) {
      setIsSearchingLocation(true);
      try {
        const results = await locationApiService.searchLocations(trimmedLoc);
        if (results && results.length > 0) {
          handleSelectLocation(results[0]);
          return;
        }
      } catch (err) {
        console.warn('Geocoding search failed, proceeding with current coordinates', err);
      } finally {
        setIsSearchingLocation(false);
      }
    }

    setLocationName(trimmedLoc);
    runAnalysis(finalIdea, businessCategory, coords[0], coords[1], radiusKm, trimmedLoc);
  };

  // Change Radius and immediately recalculate without full reload
  const handleRadiusChange = (newRadiusKm: number) => {
    setRadiusKm(newRadiusKm);
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Retail Venture' : businessIdeaSelect;
    runAnalysis(finalIdea, businessCategory, coords[0], coords[1], newRadiusKm, locationName);
  };

  // Use My Current Location (GPS + reverse geocoding with IP fallback)
  const handleUseCurrentLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus('Accessing device GPS...');

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 7000,
            enableHighAccuracy: true,
            maximumAge: 30000,
          });
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords([lat, lng]);
        setLocationStatus('Reverse-geocoding coordinates...');

        const reverse = await locationApiService.reverseGeocode(lat, lng);
        const locName = reverse?.name || reverse?.display_name?.split(',')[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        setLocationName(locName);
        setLocationInput(locName);
        setLocationStatus(`Located: ${locName}`);
        setTimeout(() => setLocationStatus(null), 3500);

        const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
        runAnalysis(finalIdea, businessCategory, lat, lng, radiusKm, locName);
        return;
      } catch (err: any) {
        console.warn('GPS unavailable or denied, attempting IP locate fallback...', err);
      }
    }

    // IP Geolocation fallback
    try {
      setLocationStatus('Detecting via network IP...');
      const ip = await locationApiService.ipLocate();
      if (ip && ip.latitude && ip.longitude) {
        setCoords([ip.latitude, ip.longitude]);
        const locName = ip.name || `${ip.city}, ${ip.country}`;
        setLocationName(locName);
        setLocationInput(locName);
        setLocationStatus(`Located: ${locName}`);
        setTimeout(() => setLocationStatus(null), 3500);

        const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
        runAnalysis(finalIdea, businessCategory, ip.latitude, ip.longitude, radiusKm, locName);
      } else {
        throw new Error('Could not resolve location');
      }
    } catch (err) {
      setLocationStatus('Could not detect location. Please type manually.');
      setTimeout(() => setLocationStatus(null), 4000);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Quick Pick preset place
  const handleQuickPick = async (place: string) => {
    setLocationInput(place);
    setIsSearchingLocation(true);
    try {
      const results = await locationApiService.searchLocations(place);
      if (results && results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        setLocationName(place);
        const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
        runAnalysis(finalIdea, businessCategory, coords[0], coords[1], radiusKm, place);
      }
    } catch {
      setLocationName(place);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Map click handler (click anywhere on map to reposition target)
  const handleMapClick = async (lat: number, lng: number) => {
    setCoords([lat, lng]);
    setIsSearchingLocation(true);
    try {
      const reverse = await locationApiService.reverseGeocode(lat, lng);
      const locName = reverse?.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setLocationName(locName);
      setLocationInput(locName);
      const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
      runAnalysis(finalIdea, businessCategory, lat, lng, radiusKm, locName);
    } catch {
      const coordName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setLocationName(coordName);
      setLocationInput(coordName);
      const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
      runAnalysis(finalIdea, businessCategory, lat, lng, radiusKm, coordName);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Apply to Business Plan handler
  const handleApplyToBusinessPlan = () => {
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'New Business' : businessIdeaSelect;
    const compCount = analysisData?.relevantCompetitorsCount || 0;
    const densityVal = analysisData?.competitorDensity || 0;
    navigate(
      `/business-plans/new?location=${encodeURIComponent(locationName)}&lat=${coords[0]}&lng=${coords[1]}&category=${encodeURIComponent(businessCategory)}&businessName=${encodeURIComponent(finalIdea)}&competitors=${compCount}&density=${densityVal.toFixed(2)}`
    );
  };

  // Save current analysis to database
  const handleSaveAnalysis = async () => {
    if (!analysisData) return;
    setIsSaving(true);
    try {
      const saved = await marketAnalysisService.save({
        businessPlanId: initialPlanId ? Number(initialPlanId) : null,
        businessIdea: analysisData.businessIdea,
        businessCategory: analysisData.businessCategory,
        latitude: analysisData.location.latitude,
        longitude: analysisData.location.longitude,
        radiusKm: analysisData.radiusKm,
        locationName: analysisData.location.name,
        address: analysisData.location.address,
      });
      setAnalysisData(saved);
      setSavedSuccessMessage('Market analysis saved to your business portfolio');
      loadSavedAnalyses();
      setTimeout(() => setSavedSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Failed to save analysis: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a saved analysis
  const handleDeleteSaved = async (id: number | string) => {
    try {
      await api.delete(`/market-analysis/${id}`);
      setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Failed to delete analysis: ${err?.message || 'Unknown error'}`);
    }
  };

  // Load a saved analysis into the active view
  const handleLoadSaved = (item: any) => {
    const locName = item.location_name || item.location?.name || 'Saved Site';
    setLocationName(locName);
    setLocationInput(locName);
    setCoords([item.latitude || item.location?.latitude || coords[0], item.longitude || item.location?.longitude || coords[1]]);
    const rKm = item.radius_km || item.radiusKm || 2.0;
    setRadiusKm(rKm);

    if (item.business_idea || item.businessIdea) {
      const idea = item.business_idea || item.businessIdea;
      const matched = COMMON_BUSINESS_IDEAS.find((i) => i.value === idea);
      if (matched) {
        setBusinessIdeaSelect(idea);
      } else {
        setBusinessIdeaSelect('Custom');
        setCustomBusinessIdea(idea);
      }
    }
    if (item.business_category || item.businessCategory) {
      setBusinessCategory(item.business_category || item.businessCategory);
    }
    setIsSavedModalOpen(false);
    runAnalysis(
      item.business_idea || item.businessIdea || 'Coffee Shop',
      item.business_category || item.businessCategory || 'Cafe',
      item.latitude || item.location?.latitude || coords[0],
      item.longitude || item.location?.longitude || coords[1],
      rKm,
      locName
    );
  };

  // Location search helper
  const handleSearchLocations = (q: string) => {
    setLocationInput(q);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }
    setIsSearchingLocation(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await locationApiService.searchLocations(q.trim());
        setSuggestions(results.slice(0, 5));
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 250);
  };

  const handleClearLocation = () => {
    setLocationInput('');
    setSuggestions([]);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
  };

  const handleSelectLocation = (loc: any) => {
    const chosenName = loc.name || loc.display_name?.split(',')[0] || 'Selected Location';
    setCoords([loc.latitude, loc.longitude]);
    setLocationName(chosenName);
    setLocationInput(chosenName);
    setSuggestions([]);
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
    runAnalysis(finalIdea, businessCategory, loc.latitude, loc.longitude, radiusKm, chosenName);
  };

  const openCompetitorProfile = (competitor: MarketCompetitor) => {
    setSelectedCompetitor(competitor);
    setActiveCompetitorId(competitor.osm_id || competitor.id || null);
    setIsProfileModalOpen(true);
  };

  const focusCompetitorOnMap = (competitor: MarketCompetitor) => {
    setActiveCompetitorId(competitor.osm_id || competitor.id || null);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Market & Competition Intelligence"
        description="Data-derived commercial density, competitor identification, spatial dispersion, and rule-based trade gap analysis."
        badge="Part 6: Market Intelligence"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {initialPlanId && (
              <Link to={`/business-plans/${initialPlanId}`}>
                <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#FFBF24]" />}>
                  Back to Business Plan
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyToBusinessPlan}
              leftIcon={<Briefcase className="w-3.5 h-3.5 text-[#FFBF24]" />}
            >
              Apply to Business Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSavedModalOpen(true)}
              leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#38BDF8]" />}
            >
              Saved Sites ({savedAnalyses.length})
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAnalysis}
              disabled={isSaving || !analysisData}
              leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className="w-3.5 h-3.5" />}
            >
              {isSaving ? 'Saving...' : 'Save Market Analysis'}
            </Button>
          </div>
        }
      />

      {savedSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* TOP CONTROLS & FILTER BAR */}
      <Card className="border-[#27272A] bg-[#1A1A1D]">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <form onSubmit={handleAnalyzeClick} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
            {/* Business Idea Select */}
            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block font-mono">
                Business Idea
              </label>
              <Select
                value={businessIdeaSelect}
                onChange={(e) => handleIdeaSelectChange(e.target.value)}
                options={COMMON_BUSINESS_IDEAS.map((i) => ({ value: i.value, label: i.label }))}
                className="text-xs"
              />
            </div>

            {/* Custom Idea Input (if selected) */}
            {businessIdeaSelect === 'Custom' && (
              <div className="lg:col-span-3 space-y-1">
                <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block font-mono">
                  Custom Name
                </label>
                <Input
                  placeholder="e.g. Specialty Matcha Bar"
                  value={customBusinessIdea}
                  onChange={(e) => setCustomBusinessIdea(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            )}

            {/* Target Location Search */}
            <div
              ref={locationDropdownRef}
              className={`space-y-1 relative ${businessIdeaSelect === 'Custom' ? 'lg:col-span-4' : 'lg:col-span-4'}`}
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block font-mono">
                  Target Location (Area / City / PIN)
                </label>
                {locationStatus && (
                  <span className="text-[10px] text-[#FFBF24] font-mono animate-pulse">
                    {locationStatus}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Input
                  placeholder="Type city or area name..."
                  value={locationInput}
                  onChange={(e) => handleSearchLocations(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#FFBF24]" />}
                  className="text-xs pr-10"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isSearchingLocation && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A1A1AA]" />
                  )}
                  {locationInput && (
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="p-1 text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#27272A] rounded transition-colors cursor-pointer"
                      title="Clear location"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl z-50 overflow-hidden text-xs max-h-60 overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(s)}
                      className="w-full text-left p-2.5 hover:bg-[#27272A] border-b border-[#27272A]/50 last:border-0 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FFBF24] shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-[#F8FAFC] block">{s.name}</span>
                        <span className="text-[10px] text-[#A1A1AA] truncate block">{s.display_name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Analysis Radius with Area calculations */}
            <div className={`space-y-1 ${businessIdeaSelect === 'Custom' ? 'lg:col-span-3' : 'lg:col-span-3'}`}>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block font-mono">
                  Analysis Radius
                </label>
                <span className="text-[10px] text-[#FFBF24] font-mono font-semibold">
                  ~{(Math.PI * radiusKm * radiusKm).toFixed(2)} km²
                </span>
              </div>
              <div className="flex items-center bg-[#111113] p-1 rounded-lg border border-[#27272A] text-xs">
                {[
                  { r: 0.5, label: '500 m' },
                  { r: 1.0, label: '1 km' },
                  { r: 2.0, label: '2 km' },
                  { r: 5.0, label: '5 km' },
                  { r: 10.0, label: '10 km' },
                ].map(({ r, label }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRadiusChange(r)}
                    className={`flex-1 py-1 rounded text-center text-xs font-semibold transition-all cursor-pointer ${
                      radiusKm === r
                        ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm font-bold'
                        : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Analyze Button */}
            <div className="lg:col-span-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-xs"
                leftIcon={isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              >
                {isLoading ? 'Scanning...' : 'Analyze Market'}
              </Button>
            </div>
          </form>

          {/* Current Location + Quick Picks Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#27272A]/70 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isDetectingLocation}
                className="px-2.5 py-1 rounded-lg bg-[#111113] hover:bg-[#202024] border border-[#FFBF24]/40 text-[#FFBF24] font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isDetectingLocation ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5" />
                )}
                <span>{isDetectingLocation ? 'Locating GPS...' : 'Use My Current Location'}</span>
              </button>

              <div className="flex items-center gap-1 text-[10px] text-[#71717A] pl-2 border-l border-[#27272A] flex-wrap">
                <span className="flex items-center gap-1 text-[#A1A1AA]">
                  <Compass className="w-3 h-3 text-[#FFBF24]" /> Quick picks:
                </span>
                {QUICK_SEARCH_PICKS.map((pick) => (
                  <button
                    key={pick}
                    type="button"
                    onClick={() => handleQuickPick(pick)}
                    className="px-2 py-0.5 rounded bg-[#111113] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] border border-[#27272A] transition-colors cursor-pointer"
                  >
                    {pick.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#71717A] flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Google Places & OSM live</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeleton Indicator */}
      {isLoading && !analysisData && (
        <div className="p-12 text-center space-y-3 bg-[#111113] rounded-2xl border border-[#27272A]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFBF24] mx-auto" />
          <h3 className="text-sm font-bold text-[#F8FAFC]">Retrieving OpenStreetMap Spatial Records</h3>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
            Querying public physical establishments within {radiusKm} km of {locationName} and executing competition classifications...
          </p>
        </div>
      )}

      {analysisData && (
        <>
          {/* 4 CORE KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Nearby Businesses"
              value={String(analysisData.totalBusinesses)}
              sublabel={`Across ${analysisData.areaKm2} km² territory`}
              icon={<Building2 className="w-5 h-5" />}
            />
            <StatCard
              label="Relevant Competitors"
              value={String(analysisData.relevantCompetitorsCount)}
              sublabel={`${analysisData.otherBusinessesCount} supporting businesses`}
              icon={<Users className="w-5 h-5 text-[#FFBF24]" />}
            />
            <StatCard
              label="Competitor Density"
              value={`${analysisData.competitorDensity.toFixed(2)}/km²`}
              sublabel="Relevant competitors per sq km"
              icon={<Compass className="w-5 h-5" />}
            />
            <StatCard
              label="Average Competitor Distance"
              value={analysisData.distanceMetrics.averageDistanceFormatted}
              sublabel={`Nearest: ${analysisData.distanceMetrics.nearestDistanceFormatted}`}
              icon={<Navigation className="w-5 h-5 text-[#38BDF8]" />}
            />
          </div>

          {/* EXECUTIVE SUMMARY */}
          <MarketSummary data={analysisData} />

          {/* INTERACTIVE COMPETITOR MAP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFBF24]" />
                Interactive Competitor Spatial Map ({radiusKm} km Radius)
              </span>
              <span className="text-[11px] text-[#A1A1AA]">
                Center: {analysisData.location.name}
              </span>
            </div>
            <CompetitorMap
              center={coords}
              radiusKm={radiusKm}
              locationName={analysisData.location.name}
              competitors={analysisData.competitors}
              otherBusinesses={analysisData.otherBusinesses}
              selectedCompetitorId={activeCompetitorId}
              onSelectCompetitor={openCompetitorProfile}
              onLocationSelect={handleMapClick}
              height="450px"
            />
          </div>

          {/* 2-COLUMN ANALYTICS: CHARTS & RADIAL DISPERSION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryDistribution
              categories={analysisData.categoryDistribution}
              businessIdea={analysisData.businessIdea}
            />

            <DistanceAnalysis
              nearest={analysisData.distanceMetrics.nearestDistanceFormatted}
              farthest={analysisData.distanceMetrics.farthestDistanceFormatted}
              average={analysisData.distanceMetrics.averageDistanceFormatted}
              median={analysisData.distanceMetrics.medianDistanceFormatted}
              relevantCount={analysisData.relevantCompetitorsCount}
              distanceBuckets={analysisData.competitorDistanceBuckets}
            />
          </div>

          {/* DIRECTORY & DETAILED COMPETITOR LIST (ACCESSED IMMEDIATELY BELOW CATEGORY MIX & RADIAL DISPERSION) */}
          <CompetitorList
            competitors={analysisData.competitors}
            otherBusinesses={analysisData.otherBusinesses}
            onSelectCompetitor={openCompetitorProfile}
            onFocusOnMap={focusCompetitorOnMap}
          />

          {/* 3-COLUMN STRUCTURAL TIERS: DENSITY, RISK, OPPORTUNITY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CompetitorDensity
              relevantCompetitors={analysisData.relevantCompetitorsCount}
              radiusKm={analysisData.radiusKm}
              areaKm2={analysisData.areaKm2}
              density={analysisData.competitorDensity}
            />

            <CompetitionRisk
              level={analysisData.competitionRisk.level}
              reason={analysisData.competitionRisk.reason}
              competitorCount={analysisData.relevantCompetitorsCount}
              density={analysisData.competitorDensity}
            />

            <MarketOpportunity
              indicator={analysisData.marketOpportunity.indicator}
              explanation={analysisData.marketOpportunity.explanation}
              totalNearby={analysisData.totalBusinesses}
              relevantCompetitors={analysisData.relevantCompetitorsCount}
            />
          </div>

          {/* MARKET GAP & FACTUAL INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketGapAnalysis
              observations={analysisData.marketGapObservations}
              businessIdea={analysisData.businessIdea}
            />

            <MarketInsights insights={analysisData.insights} />
          </div>

          {/* CROSS-LOCATION COMPARISON BENCHMARK */}
          <LocationComparison
            currentLocationName={analysisData.location.name}
            currentLat={coords[0]}
            currentLng={coords[1]}
            businessIdea={analysisData.businessIdea}
            businessCategory={analysisData.businessCategory}
            radiusKm={analysisData.radiusKm}
          />

          {/* DATA SOURCE & METHODOLOGICAL DISCLOSURES */}
          <DataSourceInfo retrievedAt={analysisData.dataSource.retrievedAt} />

          {/* COMPETITOR PROFILE MODAL */}
          <CompetitorProfile
            competitor={selectedCompetitor}
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            onFocusOnMap={focusCompetitorOnMap}
          />
        </>
      )}

      {/* SAVED SITES MODAL */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#FFBF24]" />
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">Saved Location & Market Analyses</h3>
                  <p className="text-[11px] text-[#A1A1AA]">Your saved geospatial trade analyses</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSavedModalOpen(false)}
                className="p-1 rounded-lg text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {savedAnalyses.length === 0 ? (
                <div className="p-8 text-center text-[#71717A] space-y-1">
                  <Bookmark className="w-8 h-8 mx-auto opacity-30 text-[#A1A1AA]" />
                  <p className="font-semibold text-sm text-[#A1A1AA]">No saved analyses yet</p>
                  <p className="text-[11px]">Click "Save Market Analysis" above to bookmark candidate locations.</p>
                </div>
              ) : (
                savedAnalyses.map((site) => (
                  <div
                    key={site.id}
                    className="p-3.5 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-[#FFBF24]/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F8FAFC] truncate">
                          {site.location_name || site.location?.name || 'Saved Site'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#FFBF24]/10 text-[#FFBF24] font-semibold text-[10px]">
                          {site.business_idea || site.businessIdea || 'Venture'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] mt-1 font-mono">
                        <span>Radius: {site.radius_km || site.radiusKm || 2} km</span>
                        <span>•</span>
                        <span>
                          {site.created_at ? new Date(site.created_at).toLocaleDateString() : 'Saved analysis'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleLoadSaved(site)}
                        className="text-xs h-7 px-3"
                      >
                        Load
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSaved(site.id)}
                        className="p-1.5 text-[#71717A] hover:text-red-400 hover:bg-[#27272A] rounded transition-colors cursor-pointer"
                        title="Delete saved analysis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#27272A] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsSavedModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
