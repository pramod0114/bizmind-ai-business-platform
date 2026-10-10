/**
 * BizMind – Location-First Business Opportunity Recommender
 * 
 * Recommends actionable, high-probability business concepts for a specific
 * physical location, commercial space, or target neighborhood by scanning local
 * competitor saturation, competitor rating flaws, footfall anchors, and ML opportunity scoring.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  recommendationService,
  OpportunityRecommendation,
  AreaVitalitySummary,
  LOCATION_PRESETS,
  LocationPreset,
  RecommendationFilters,
} from '../../services/recommendationService';
import { locationApiService } from '../../services/locationService';
import {
  Sparkles,
  MapPin,
  Search,
  Crosshair,
  Compass,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  DollarSign,
  ArrowRight,
  Calculator,
  Download,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  Target,
  BarChart3,
  Layers,
  Building,
  GraduationCap,
  Store,
  Clock,
  ThumbsUp,
  Award,
  Zap,
  Filter,
  RefreshCw,
  ExternalLink,
  Users,
  Briefcase,
  HelpCircle,
  FileText,
} from 'lucide-react';

const RADIUS_OPTIONS = [
  { label: '500 m (Hyperlocal)', value: 500 },
  { label: '1.0 km (Walking)', value: 1000 },
  { label: '2.0 km (Standard)', value: 2000 },
  { label: '3.0 km (Broad)', value: 3000 },
  { label: '5.0 km (Catchment)', value: 5000 },
];

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();

  // Location search state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tech_park');
  const [locationQuery, setLocationQuery] = useState<string>('Indiranagar, Bengaluru');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 12.9784,
    longitude: 77.6408,
  });
  const [radiusMeters, setRadiusMeters] = useState<number>(2000);

  // Autocomplete
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // GPS state
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Recommendation engine results
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [vitalitySummary, setVitalitySummary] = useState<AreaVitalitySummary | null>(null);
  const [recommendations, setRecommendations] = useState<OpportunityRecommendation[]>([]);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Filter state
  const [filters, setFilters] = useState<RecommendationFilters>({
    budgetBracket: 'ALL',
    riskAppetite: 'ALL',
    sector: 'ALL',
    sortBy: 'PROBABILITY',
  });

  // Modal / Export state
  const [dossierModalRec, setDossierModalRec] = useState<OpportunityRecommendation | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Initial scan on load
  useEffect(() => {
    runRecommendationScan('Indiranagar, Bengaluru', { latitude: 12.9784, longitude: 77.6408 }, 2000);
  }, []);

  const runRecommendationScan = async (
    locName: string,
    locCoords: { latitude: number; longitude: number },
    radMeters: number
  ) => {
    try {
      setIsLoading(true);
      const result = await recommendationService.analyzeLocationOpportunities(locName, locCoords, radMeters);
      setVitalitySummary(result.vitalitySummary);
      setRecommendations(result.recommendations);
      // Auto-expand the #1 top recommendation by default for immediate value
      if (result.recommendations.length > 0) {
        setExpandedCards({ [result.recommendations[0].id]: true });
      }
    } catch (err) {
      console.error('Failed to run opportunity scan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedPresetId(preset.id);
    setLocationQuery(preset.name);
    setCoords({ latitude: preset.latitude, longitude: preset.longitude });
    setRadiusMeters(preset.defaultRadiusMeters);
    setShowSuggestions(false);
    runRecommendationScan(preset.name, { latitude: preset.latitude, longitude: preset.longitude }, preset.defaultRadiusMeters);
  };

  const handleLocationInputChange = (value: string) => {
    setLocationQuery(value);
    setSelectedPresetId('');
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length >= 3) {
      setIsSearchingLocation(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await locationApiService.searchLocations(value);
          setSuggestions(res || []);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsSearchingLocation(false);
        }
      }, 350);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchingLocation(false);
    }
  };

  const handleSelectSuggestion = (sug: any) => {
    const locText = sug.display_name || sug.name || locationQuery;
    const lat = parseFloat(sug.latitude);
    const lng = parseFloat(sug.longitude);
    setLocationQuery(locText);
    setCoords({ latitude: lat, longitude: lng });
    setShowSuggestions(false);
    runRecommendationScan(locText, { latitude: lat, longitude: lng }, radiusMeters);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    setGpsMessage('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ latitude: lat, longitude: lng });
        setSelectedPresetId('');

        try {
          const rev = await locationApiService.reverseGeocode(lat, lng);
          const locName = rev?.display_name || rev?.name || `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          setLocationQuery(locName);
          setGpsMessage(`Location locked: ${locName.split(',')[0]}`);
          runRecommendationScan(locName, { latitude: lat, longitude: lng }, radiusMeters);
        } catch {
          const fallback = `Site (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          setLocationQuery(fallback);
          runRecommendationScan(fallback, { latitude: lat, longitude: lng }, radiusMeters);
        } finally {
          setIsDetectingGps(false);
          setTimeout(() => setGpsMessage(null), 4000);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsMessage(`GPS error: ${err.message}. Please verify device permissions.`);
        setTimeout(() => setGpsMessage(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualScan = () => {
    runRecommendationScan(locationQuery, coords, radiusMeters);
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    recommendations.forEach((r) => {
      next[r.id] = expand;
    });
    setExpandedCards(next);
  };

  // 1-Click Bridge: Run Full ML Prediction
  const handleLaunchMLPrediction = (rec: OpportunityRecommendation) => {
    if (!vitalitySummary) return;
    navigate('/predictions', {
      state: {
        businessIdea: rec.conceptName,
        category: rec.category,
        locationQuery: vitalitySummary.locationName,
        coordinates: vitalitySummary.coordinates,
        radiusMeters: vitalitySummary.radiusKm * 1000,
        financialInputs: {
          initialInvestment: rec.estimatedCapEx,
          expectedMonthlyRevenue: rec.estimatedMonthlyRevenue,
          monthlyFixedExpenses: Math.round(rec.estimatedMonthlyRevenue - rec.estimatedMonthlyProfit - (rec.estimatedMonthlyRevenue * 0.25)),
          estimatedVariableExpenses: Math.round(rec.estimatedMonthlyRevenue * 0.25),
          expectedAverageSellingPrice: rec.financialBreakdown.averageTicketSize,
          expectedCustomersPerDay: rec.financialBreakdown.projectedDailyTransactions,
        },
      },
    });
  };

  // 1-Click Bridge: Add to Financial Feasibility (Business Plan Builder)
  const handleAddToFinancialPlanner = (rec: OpportunityRecommendation) => {
    if (!vitalitySummary) return;
    navigate('/business-plans/new', {
      state: {
        businessName: rec.conceptName,
        category: rec.broadSector === 'Food & Beverage' ? 'Food & Beverage' : rec.broadSector === 'Healthcare & Wellness' ? 'Fitness & Wellness' : 'Retail',
        description: `${rec.tagline}. Tailored to address unmet local demand in ${vitalitySummary.locationName}.`,
        locationName: vitalitySummary.locationName,
        targetCustomer: rec.targetAudienceProfile.personaName,
        initialInvestment: rec.estimatedCapEx,
        equipmentCost: rec.financialBreakdown.equipment,
        setupCost: rec.financialBreakdown.interiorFitout,
        expectedMonthlyRevenue: rec.estimatedMonthlyRevenue,
        sellingPrice: rec.financialBreakdown.averageTicketSize,
        dailyCustomers: rec.financialBreakdown.projectedDailyTransactions,
        latitude: vitalitySummary.coordinates.latitude,
        longitude: vitalitySummary.coordinates.longitude,
      },
    });
  };

  // Export dossier
  const handleDownloadDossierJSON = (rec: OpportunityRecommendation) => {
    if (!vitalitySummary) return;
    const dossierData = {
      platform: 'BizMind AI Business Planning Platform',
      reportType: 'Location-First Business Opportunity Strategic Dossier',
      generatedAt: new Date().toISOString(),
      location: {
        name: vitalitySummary.locationName,
        coordinates: vitalitySummary.coordinates,
        radiusKm: vitalitySummary.radiusKm,
        totalBusinessesDetected: vitalitySummary.totalBusinessesDetected,
        averageCompetitorRating: vitalitySummary.averageCompetitorRating,
      },
      opportunity: rec,
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BizMind_Opportunity_${rec.conceptName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyDossierSummary = (rec: OpportunityRecommendation) => {
    if (!vitalitySummary) return;
    const text = `BIZMIND STRATEGIC OPPORTUNITY DOSSIER
===========================================
Concept: ${rec.conceptName}
Category: ${rec.category} (${rec.broadSector})
Location: ${vitalitySummary.locationName} (Radius: ${vitalitySummary.radiusKm} km)
ML Success Probability: ${rec.successProbability}% | Viability: ${rec.viabilityScore}/100
Estimated CapEx: ${rec.capexFormatted} | Payback: ${rec.paybackFormatted}
Est. Monthly Revenue: ₹${rec.estimatedMonthlyRevenue.toLocaleString()} | Margin: ${rec.netMarginPercentage}%

MARKET GAP PROOF:
${rec.marketGapProof.summary}
- Distance to nearest rival: ${rec.marketGapProof.distanceToNearestCompetitor}
- Target: ${rec.marketGapProof.underservedDemographic}

COMPETITOR EXPLOITABLE FLAW:
${rec.competitorFlawToExploit.weaknessSummary} (Avg local rating: ${rec.competitorFlawToExploit.avgCompetitorRating}★)
Differentiator Advantage: ${rec.competitorFlawToExploit.differentiatorAdvantage}

ROADMAP SUMMARY:
${rec.executionRoadmap.map((s) => `${s.stepNumber}. ${s.phaseTitle} (${s.estimatedWeeks}): ${s.actionDescription}`).join('\n')}
===========================================
Generated via BizMind Location-First Discovery Engine`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Filtered & Sorted Recommendations
  const filteredRecommendations = recommendations.filter((rec) => {
    if (filters.sector !== 'ALL' && rec.broadSector !== filters.sector) return false;
    if (filters.riskAppetite !== 'ALL' && rec.riskTier.toUpperCase() !== filters.riskAppetite) return false;
    if (filters.budgetBracket === 'UNDER_25K' && rec.estimatedCapEx > 600000) return false;
    if (filters.budgetBracket === '25K_75K' && (rec.estimatedCapEx < 600000 || rec.estimatedCapEx > 1000000)) return false;
    if (filters.budgetBracket === '75K_150K' && (rec.estimatedCapEx < 1000000 || rec.estimatedCapEx > 1400000)) return false;
    if (filters.budgetBracket === 'ABOVE_150K' && rec.estimatedCapEx < 1400000) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'PROBABILITY') return b.successProbability - a.successProbability;
    if (filters.sortBy === 'CAPEX_LOW') return a.estimatedCapEx - b.estimatedCapEx;
    if (filters.sortBy === 'PAYBACK_FAST') return a.paybackMonths - b.paybackMonths;
    if (filters.sortBy === 'VIABILITY') return b.viabilityScore - a.viabilityScore;
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Location-First Business Opportunity Recommender"
        description="Don't have an idea yet? Scan any address, commercial storefront, or neighborhood to uncover missing, high-probability business concepts where competitors are failing."
        badge="Autonomous Discovery Engine"
      />

      {/* Control Deck: Search, Radius, Presets, Filters */}
      <Card className="border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-sm">
        <CardContent className="p-5 md:p-6 space-y-5">
          {/* Top Bar: Search Bar, Radius & GPS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Location Autocomplete Input */}
            <div className="lg:col-span-6 relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Target Commercial Location / Address</span>
                <span className="text-[10px] text-cyan-400 font-mono">Geo-Spatial Real-Time</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Enter neighborhood, street address, or commercial hub..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
                {isSearchingLocation && (
                  <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-40 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(sug)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition flex items-start gap-2.5 border-b border-slate-800 last:border-b-0 text-xs text-slate-200"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-100">{sug.name || sug.display_name?.split(',')[0]}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{sug.display_name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Radius Selector */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Scan Radius</span>
                <span className="text-[10px] text-amber-400 font-mono">Catchment Zone</span>
              </label>
              <select
                value={radiusMeters}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setRadiusMeters(val);
                  runRecommendationScan(locationQuery, coords, val);
                }}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              >
                {RADIUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions (GPS & Scan) */}
            <div className="lg:col-span-3 flex items-center gap-2 pt-5 lg:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseCurrentLocation}
                disabled={isDetectingGps}
                className="h-10 px-3 flex-1 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/60 text-xs font-medium text-slate-200"
                title="Detect device GPS coordinates"
              >
                <Crosshair className={`w-3.5 h-3.5 mr-1.5 text-cyan-400 ${isDetectingGps ? 'animate-spin' : ''}`} />
                {isDetectingGps ? 'Detecting...' : 'My Location'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleManualScan}
                disabled={isLoading}
                className="h-10 px-4 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-950/40"
              >
                <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Scanning...' : 'Scan Area'}
              </Button>
            </div>
          </div>

          {/* GPS Feedback Notice */}
          {gpsMessage && (
            <div className="text-xs px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 flex items-center gap-2 animate-fadeIn">
              <Zap className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Location Archetype Presets */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-amber-400" />
              Quick Neighborhood Archetype Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {LOCATION_PRESETS.map((preset) => {
                const isActive = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{preset.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtering & Sorting Controls Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Target Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Industry Sectors</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                <option value="Education & Learning">Education & Learning</option>
                <option value="Services & Tech">Services & Tech</option>
                <option value="Retail & Lifestyle">Retail & Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Budget Bracket</label>
              <select
                value={filters.budgetBracket}
                onChange={(e) => setFilters({ ...filters, budgetBracket: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Any Startup CapEx</option>
                <option value="UNDER_25K">Under ₹6 Lakh (~$7.5k)</option>
                <option value="25K_75K">₹6L - ₹10 Lakh</option>
                <option value="75K_150K">₹10L - ₹14 Lakh</option>
                <option value="ABOVE_150K">Above ₹14 Lakh</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Risk Appetite</label>
              <select
                value={filters.riskAppetite}
                onChange={(e) => setFilters({ ...filters, riskAppetite: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Risk Tiers</option>
                <option value="CONSERVATIVE">Conservative (Low Risk)</option>
                <option value="MODERATE">Moderate (Balanced)</option>
                <option value="AGGRESSIVE">Aggressive (High Yield)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Sort Opportunities</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="PROBABILITY">Highest Success Probability</option>
                <option value="PAYBACK_FAST">Fastest Payback Period</option>
                <option value="CAPEX_LOW">Lowest Initial CapEx</option>
                <option value="VIABILITY">Top Viability Score</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state indicator */}
      {isLoading && (
        <Card className="border border-slate-800 bg-slate-900/40 p-8 text-center animate-pulse">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Analyzing Local Spatial Intelligence...</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Scanning competitor density, footfall anchors, average Google customer satisfaction voids, and algorithmic gap indices for {locationQuery}.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Area Vitality & Big Data Summary Bar */}
      {!isLoading && vitalitySummary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Area Vitality & Spatial Intelligence
              </h2>
              <span className="text-xs text-slate-500 font-normal">
                ({vitalitySummary.locationName} • {vitalitySummary.radiusKm} km radius)
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <button
                onClick={() => toggleExpandAll(true)}
                className="hover:text-cyan-400 transition underline underline-offset-4"
              >
                Expand All Dossiers
              </button>
              <span>•</span>
              <button
                onClick={() => toggleExpandAll(false)}
                className="hover:text-slate-200 transition underline underline-offset-4"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* 4 Big Data Vitality Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Commercial Density */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Commercial Density</span>
                <Store className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-slate-100 font-mono">
                {vitalitySummary.totalBusinessesDetected} <span className="text-xs font-normal text-slate-400">places</span>
              </p>
              <p className="text-[11px] text-cyan-300/90 mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Score: {vitalitySummary.commercialDensityScore}/100 active retail density
              </p>
            </div>

            {/* Card 2: Competitor Rating Void */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Avg Competitor Rating</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-400 font-mono">
                {vitalitySummary.averageCompetitorRating} <span className="text-xs text-slate-400 font-normal">/ 5.0★</span>
              </p>
              <p className="text-[11px] text-amber-300/90 mt-1">
                {vitalitySummary.averageCompetitorRating < 4.0
                  ? '⚠️ High dissatisfaction: service void detected'
                  : 'Moderate satisfaction: differentiation required'}
              </p>
            </div>

            {/* Card 3: Sector Saturation Warning */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Saturated Red Ocean</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-sm font-semibold text-rose-300 line-clamp-1">
                {vitalitySummary.saturatedSectors[0]?.sector || 'Basic FMCG Kiosks'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {vitalitySummary.saturatedSectors[0]?.status || 'Fierce price wars'} — avoid copycat models
              </p>
            </div>

            {/* Card 4: High Demand Blue Ocean */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Top Blue Ocean Void</span>
                <Flame className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-300 line-clamp-1">
                {vitalitySummary.highDemandBlueOceans[0]?.sector || 'Boutique Wellness Studio'}
              </p>
              <p className="text-[11px] text-emerald-400/90 mt-1 line-clamp-1">
                100% unserved demand in this {vitalitySummary.radiusKm} km radius
              </p>
            </div>
          </div>

          {/* Footfall Anchors Banner */}
          {vitalitySummary.footfallAnchors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Detected Footfall Anchors:
                </span>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {vitalitySummary.footfallAnchors.map((anchor, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-1.5"
                    title={anchor.impact}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200">{anchor.type}</span>
                    <span className="text-[10px] text-slate-400">({anchor.distanceMeters}m away)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content: Ranked Business Opportunity Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">
              Ranked Business Opportunities ({filteredRecommendations.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Ordered by ML algorithmic success probability
          </span>
        </div>

        {/* Zero Results State */}
        {!isLoading && filteredRecommendations.length === 0 && (
          <Card className="p-8 text-center border-slate-800">
            <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No opportunities match the selected filters</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the budget bracket or sector filter to view all options.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ budgetBracket: 'ALL', riskAppetite: 'ALL', sector: 'ALL', sortBy: 'PROBABILITY' })}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </Card>
        )}

        {/* List of Opportunity Cards */}
        {!isLoading &&
          filteredRecommendations.map((rec) => {
            const isExpanded = Boolean(expandedCards[rec.id]);

            return (
              <div
                key={rec.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  rec.rank === 1
                    ? 'border-cyan-500/50 bg-gradient-to-b from-slate-900 to-slate-950 shadow-lg shadow-cyan-950/20'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700/80'
                }`}
              >
                {/* Top Banner for #1 Rank */}
                {rec.rank === 1 && (
                  <div className="bg-gradient-to-r from-cyan-500/20 via-amber-500/20 to-cyan-500/20 px-4 py-1.5 border-b border-cyan-500/30 flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      #1 Top Recommended Business Concept for this Location
                    </span>
                    <span className="text-[11px] font-mono text-amber-300">
                      Top Strategic Gap Fit
                    </span>
                  </div>
                )}

                {/* Card Main Summary Header */}
                <div className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Concept Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                          #{rec.rank}
                        </span>
                        <Badge
                          variant={
                            rec.broadSector === 'Food & Beverage'
                              ? 'warning'
                              : rec.broadSector === 'Healthcare & Wellness'
                              ? 'success'
                              : rec.broadSector === 'Education & Learning'
                              ? 'info'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {rec.broadSector}
                        </Badge>
                        <span className="text-xs text-slate-400">• {rec.category}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-800">
                          {rec.suitabilityTag}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition">
                        {rec.conceptName}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400 line-clamp-1">
                        {rec.tagline}
                      </p>
                    </div>

                    {/* Right: Key Quantitative Badges */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* Success Probability Pill */}
                      <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-right">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                          ML Success Odds
                        </div>
                        <div className="text-xl font-extrabold text-emerald-300 font-mono">
                          {rec.successProbability}%
                        </div>
                      </div>

                      {/* CapEx & Payback Metric */}
                      <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-left min-w-[130px]">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Startup CapEx
                        </div>
                        <div className="text-base font-bold text-slate-100 font-mono">
                          {rec.capexFormatted}
                        </div>
                        <div className="text-[10px] text-cyan-400 mt-0.5">
                          Payback: {rec.paybackFormatted}
                        </div>
                      </div>

                      {/* Expand / Collapse Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleExpand(rec.id)}
                        className="h-10 px-3 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>{isExpanded ? 'Hide Dossier' : 'Strategic Dossier'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-cyan-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Summary Snippet: Why it works here */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start md:items-center gap-2 text-slate-300">
                      <span className="font-semibold text-amber-400 shrink-0 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Market Gap Proof:
                      </span>
                      <span className="text-slate-400 line-clamp-1">{rec.marketGapProof.summary}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">
                        Net Margin: <strong className="text-slate-200">{rec.netMarginPercentage}%</strong>
                      </span>
                      <span className="text-slate-700">|</span>
                      <span className="text-[11px] text-slate-400">
                        Space: <strong className="text-slate-200">~{rec.minSqFtRequired} sq ft</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE `>` STRATEGIC DOSSIER & ACTION PLAN */}
                {isExpanded && (
                  <div className="p-5 md:p-6 bg-slate-950/80 border-t border-slate-800 space-y-6 animate-fadeIn">
                    {/* Header inside Dossier */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                          Strategic Opportunity Dossier & 5-Step Execution Roadmap
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyDossierSummary(rec)}
                          className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {copiedNotification ? 'Copied!' : 'Copy Summary'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDossierJSON(rec)}
                          className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
                        >
                          <Download className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                          Export JSON
                        </Button>
                      </div>
                    </div>

                    {/* 3 Pillars Grid: Gap Evidence, Competitor Flaw, Target Audience */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Pillar 1: Market Gap Evidence */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" /> 1. Market Gap Evidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rec.marketGapProof.summary}
                        </p>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-850 text-[11px] space-y-1">
                          <p className="text-slate-400">
                            <strong>Nearest Direct Rival:</strong> {rec.marketGapProof.distanceToNearestCompetitor}
                          </p>
                          <p className="text-slate-400">
                            <strong>Underserved Group:</strong> {rec.marketGapProof.underservedDemographic}
                          </p>
                        </div>
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Unmet Demand Signals:
                          </span>
                          <ul className="text-[11px] text-slate-400 space-y-1">
                            {rec.marketGapProof.unmetDemandSignals.map((sig, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-cyan-400">•</span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Pillar 2: Competitor Flaw to Exploit */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" /> 2. Competitor Rating Flaws
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">
                            Avg {rec.competitorFlawToExploit.avgCompetitorRating}★
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rec.competitorFlawToExploit.weaknessSummary}
                        </p>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-850 space-y-1 text-[11px]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                            Common Local Complaints:
                          </span>
                          {rec.competitorFlawToExploit.commonComplaints.map((c, i) => (
                            <p key={i} className="text-slate-400 flex items-center gap-1">
                              <span className="text-rose-400">✕</span> {c}
                            </p>
                          ))}
                        </div>
                        <div className="pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                            Your Winning Differentiator:
                          </span>
                          <p className="text-[11px] text-slate-300 bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
                            {rec.competitorFlawToExploit.differentiatorAdvantage}
                          </p>
                        </div>
                      </div>

                      {/* Pillar 3: Target Persona & Footfall Anchors */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> 3. Target Audience & Anchors
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200">
                          {rec.targetAudienceProfile.personaName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {rec.targetAudienceProfile.demographics}
                        </p>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-850 space-y-1 text-[11px]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Customer Behavior & Dwell Time:
                          </span>
                          {rec.targetAudienceProfile.behaviorHabits.map((b, i) => (
                            <p key={i} className="text-slate-400 flex items-center gap-1">
                              <span className="text-cyan-400">✔</span> {b}
                            </p>
                          ))}
                        </div>
                        <div className="pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                            Nearby Anchor Synergy:
                          </span>
                          <p className="text-[11px] text-slate-300">
                            {rec.targetAudienceProfile.anchorSynergies[0]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5-Step Execution Roadmap */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          5-Step Practical Execution Roadmap (Zero to Launch)
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          Estimated Go-to-Market: 11 - 13 Weeks
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                        {rec.executionRoadmap.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-cyan-400">Step {step.stepNumber}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{step.estimatedWeeks}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                              {step.phaseTitle}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-3">
                              {step.actionDescription}
                            </p>
                            <div className="pt-1 text-[10px] text-emerald-400/90 font-medium border-t border-slate-800">
                              🎯 {step.keyMilestone}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial CapEx Breakdown & Revenue Projections */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Equipment & Hardware</span>
                          <span className="text-sm font-bold text-slate-200 font-mono">
                            ₹{(rec.financialBreakdown.equipment / 100000).toFixed(1)} Lakh
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Interior & Fitout</span>
                          <span className="text-sm font-bold text-slate-200 font-mono">
                            ₹{(rec.financialBreakdown.interiorFitout / 100000).toFixed(1)} Lakh
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Working Capital Buffer</span>
                          <span className="text-sm font-bold text-slate-200 font-mono">
                            ₹{(rec.financialBreakdown.workingCapital / 100000).toFixed(1)} Lakh
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Net Profit</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono">
                            ₹{rec.estimatedMonthlyProfit.toLocaleString()} / mo
                          </span>
                        </div>
                      </div>

                      {/* 1-Click Seamless Bridges */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                        {/* 1-Click to Business Planner */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToFinancialPlanner(rec)}
                          className="flex-1 md:flex-initial h-9 px-3.5 border-slate-700 hover:border-amber-400/60 hover:bg-amber-950/20 text-xs font-semibold text-amber-300"
                        >
                          <Calculator className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                          Add to Financial Feasibility
                        </Button>

                        {/* 1-Click to ML Prediction */}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleLaunchMLPrediction(rec)}
                          className="flex-1 md:flex-initial h-9 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-950/40"
                        >
                          <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                          Run Full ML Prediction
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Bottom Educational Strategy Card */}
      <Card className="border border-slate-800/80 bg-slate-900/50">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">How Does BizMind Calculate Opportunity Rankings?</p>
              <p className="text-slate-400 mt-0.5">
                Our algorithm combines local competitor density, Google rating dissatisfaction voids, footfall anchor proximity, and CapEx viability to uncover markets with the lowest barriers to entry.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/market-analysis')}
            className="shrink-0 text-xs text-slate-300 hover:text-white"
          >
            Explore Raw Market Density
            <ExternalLink className="w-3 h-3 ml-1.5 text-slate-400" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
