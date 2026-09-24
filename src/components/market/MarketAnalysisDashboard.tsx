import React, { useState, useEffect } from 'react';
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
  const [coords, setCoords] = useState<[number, number]>([initialLat, initialLng]);
  const [radiusKm, setRadiusKm] = useState<number>(initialRadius);

  // Analysis result state
  const [analysisData, setAnalysisData] = useState<MarketAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Selected competitor for profile drawer/modal
  const [selectedCompetitor, setSelectedCompetitor] = useState<MarketCompetitor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeCompetitorId, setActiveCompetitorId] = useState<string | number | null>(null);

  // Location search suggestions state
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

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
  const handleAnalyzeClick = (e: React.FormEvent) => {
    e.preventDefault();
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Retail Venture' : businessIdeaSelect;
    runAnalysis(finalIdea, businessCategory, coords[0], coords[1], radiusKm, locationName);
  };

  // Change Radius and immediately recalculate without full reload
  const handleRadiusChange = (newRadiusKm: number) => {
    setRadiusKm(newRadiusKm);
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Retail Venture' : businessIdeaSelect;
    runAnalysis(finalIdea, businessCategory, coords[0], coords[1], newRadiusKm, locationName);
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
      setTimeout(() => setSavedSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Failed to save analysis: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Location search helper
  const handleSearchLocations = async (q: string) => {
    setLocationQuery(q);
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSearchingLocation(true);
    try {
      const results = await locationApiService.searchLocations(q);
      setSuggestions(results.slice(0, 5));
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectLocation = (loc: any) => {
    setCoords([loc.latitude, loc.longitude]);
    setLocationName(loc.name || loc.display_name.split(',')[0]);
    setLocationQuery('');
    setSuggestions([]);
    const finalIdea = businessIdeaSelect === 'Custom' ? customBusinessIdea.trim() || 'Coffee Shop' : businessIdeaSelect;
    runAnalysis(finalIdea, businessCategory, loc.latitude, loc.longitude, radiusKm, loc.name);
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
          <div className="flex items-center gap-2">
            {initialPlanId && (
              <Link to={`/business-plans/${initialPlanId}`}>
                <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#FFBF24]" />}>
                  Back to Business Plan
                </Button>
              </Link>
            )}
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
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleAnalyzeClick} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
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
            <div className={`space-y-1 relative ${businessIdeaSelect === 'Custom' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block font-mono">
                Target Location (Area / City)
              </label>
              <div className="relative">
                <Input
                  placeholder="Type city or area name..."
                  value={locationQuery || locationName}
                  onChange={(e) => handleSearchLocations(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#FFBF24]" />}
                  className="text-xs"
                />
                {isSearchingLocation && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A1A1AA] absolute right-3 top-3" />
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
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

            {/* Radius Selector Pills */}
            <div className={`space-y-1 ${businessIdeaSelect === 'Custom' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block font-mono">
                Analysis Radius
              </label>
              <div className="flex items-center bg-[#111113] p-1 rounded-lg border border-[#27272A] text-xs">
                {[0.5, 1.0, 2.0, 5.0].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRadiusChange(r)}
                    className={`flex-1 py-1 rounded text-center text-xs font-semibold transition-all cursor-pointer ${
                      radiusKm === r
                        ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm'
                        : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {r >= 1 ? `${r} km` : `${r * 1000} m`}
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

          {/* DIRECTORY & DETAILED COMPETITOR LIST */}
          <CompetitorList
            competitors={analysisData.competitors}
            otherBusinesses={analysisData.otherBusinesses}
            onSelectCompetitor={openCompetitorProfile}
            onFocusOnMap={focusCompetitorOnMap}
          />

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
    </div>
  );
};
