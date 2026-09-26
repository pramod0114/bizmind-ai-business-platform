/**
 * BizMind – Machine Learning Success Prediction & Location-Based Opportunity Assessment
 * 
 * Incorporates:
 * 1. Location-Based Business Success Prediction (Google Places API New + Spatial Feasibility)
 * 2. Multi-Location Comparative Evaluation (up to 3 sites)
 * 3. Financial Feasibility Modeling & Break-Even Velocity
 * 4. Preserved Business Plan Financial ML Ensemble Pipeline
 */
import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { GooglePredictionMap } from '../../components/predictions/GooglePredictionMap';
import { LocationComparisonSection } from '../../components/predictions/LocationComparisonSection';
import { SavedPredictionsModal } from '../../components/predictions/SavedPredictionsModal';
import {
  locationPredictionClient,
  LocationPredictionResult,
  CompetitorDetail,
  LocationPredictionFinancialInputs,
} from '../../services/locationPredictionService';
import { planService } from '../../services/planService';
import { api } from '../../services/api';
import { BusinessPlan } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Crosshair,
  TrendingUp,
  Cpu,
  Play,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Search,
  ExternalLink,
  DollarSign,
  Calculator,
  Compass,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  Layers,
  HelpCircle,
  GitCompare,
  SlidersHorizontal,
} from 'lucide-react';

const PRESET_BUSINESS_IDEAS = [
  'Coffee Shop / Specialty Cafe',
  'Restaurant',
  'Clothing Store',
  'Grocery Store',
  'Salon',
  'Pharmacy',
  'Gym',
  'Bakery',
  'Mobile Accessories Shop',
  'Custom Business Idea',
];

const RADIUS_OPTIONS = [
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
];

const POPULAR_LOCATION_PICKS = [
  { name: 'Vishrambag, Sangli', lat: 16.8524, lng: 74.5815 },
  { name: 'Madhavnagar, Sangli', lat: 16.8856, lng: 74.6082 },
  { name: 'Miraj, Maharashtra', lat: 16.8271, lng: 74.6469 },
  { name: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077 },
  { name: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295 },
  { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
];

export const getCategoryFinancialBenchmarks = (categoryName: string): LocationPredictionFinancialInputs => {
  const lower = categoryName.toLowerCase();
  if (lower.includes('coffee') || lower.includes('cafe')) {
    return {
      initialInvestment: 850000,
      monthlyFixedExpenses: 155000,
      expectedMonthlyRevenue: 320000,
      estimatedVariableExpenses: 80000,
      expectedAverageSellingPrice: 220,
      expectedCustomersPerDay: 50,
    };
  }
  if (lower.includes('bakery') || lower.includes('pastry') || lower.includes('cake')) {
    return {
      initialInvestment: 650000,
      monthlyFixedExpenses: 125000,
      expectedMonthlyRevenue: 280000,
      estimatedVariableExpenses: 70000,
      expectedAverageSellingPrice: 180,
      expectedCustomersPerDay: 60,
    };
  }
  if (lower.includes('restaurant') || lower.includes('dine') || lower.includes('food')) {
    return {
      initialInvestment: 1600000,
      monthlyFixedExpenses: 250000,
      expectedMonthlyRevenue: 580000,
      estimatedVariableExpenses: 175000,
      expectedAverageSellingPrice: 450,
      expectedCustomersPerDay: 45,
    };
  }
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('yoga')) {
    return {
      initialInvestment: 1350000,
      monthlyFixedExpenses: 190000,
      expectedMonthlyRevenue: 410000,
      estimatedVariableExpenses: 40000,
      expectedAverageSellingPrice: 2500,
      expectedCustomersPerDay: 15,
    };
  }
  if (lower.includes('pharmacy') || lower.includes('medical') || lower.includes('health')) {
    return {
      initialInvestment: 950000,
      monthlyFixedExpenses: 110000,
      expectedMonthlyRevenue: 390000,
      estimatedVariableExpenses: 220000,
      expectedAverageSellingPrice: 350,
      expectedCustomersPerDay: 40,
    };
  }
  return {
    initialInvestment: 800000,
    monthlyFixedExpenses: 140000,
    expectedMonthlyRevenue: 310000,
    estimatedVariableExpenses: 85000,
    expectedAverageSellingPrice: 320,
    expectedCustomersPerDay: 35,
  };
};

export const PredictionsPage: React.FC = () => {
  const navigate = useNavigate();

  // Navigation mode / tabs: Location-Based Prediction vs Existing Business Plan Ensemble
  const [activeTab, setActiveTab] = useState<'location' | 'plan_ensemble'>('location');

  // Location-Based Form Inputs
  const [selectedIdeaOption, setSelectedIdeaOption] = useState<string>('Coffee Shop / Specialty Cafe');
  const [customIdeaInput, setCustomIdeaInput] = useState<string>('');
  const [targetLocationQuery, setTargetLocationQuery] = useState<string>('Vishrambag, Sangli');
  const [targetCoords, setTargetCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 16.8524,
    longitude: 74.5815,
  });
  const [radiusMeters, setRadiusMeters] = useState<number>(2000);

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const financialInputsRef = useRef<HTMLDivElement | null>(null);

  // Geolocation state
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Optional Financial Inputs
  const [showFinancialInputs, setShowFinancialInputs] = useState(false);
  const [financialInputs, setFinancialInputs] = useState<LocationPredictionFinancialInputs>({
    initialInvestment: 800000,
    expectedMonthlyRevenue: 300000,
    monthlyFixedExpenses: 120000,
    estimatedVariableExpenses: 80000,
    expectedAverageSellingPrice: 250,
    expectedCustomersPerDay: 40,
  });

  // Location Analysis State
  const [analyzingLocation, setAnalyzingLocation] = useState(false);
  const [locationResult, setLocationResult] = useState<LocationPredictionResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorDetail | null>(null);

  // Saved Analysis State
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savingPrediction, setSavingPrediction] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Comparison Drawer / Section
  const [showComparison, setShowComparison] = useState(false);

  // Existing Financial Plan Prediction Pipeline State (Preserved)
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | string>('');
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [predictingPlan, setPredictingPlan] = useState(false);
  const [planPrediction, setPlanPrediction] = useState<any | null>(null);

  // Initial load
  useEffect(() => {
    // 1. Run initial location analysis for default coffee shop in Vishrambag
    handleAnalyzeLocationOpportunity();

    // 2. Load existing business plans for the ensemble model tab
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const userPlans = await planService.getPlans();
        setPlans(userPlans);
        if (userPlans.length > 0) {
          setSelectedPlanId(userPlans[0].id);
          runPlanEnsemblePrediction(userPlans[0]);
        }
      } catch (err) {
        console.error('Failed to load plans for prediction:', err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const getEffectiveBusinessIdea = () => {
    if (selectedIdeaOption === 'Custom Business Idea') {
      return customIdeaInput.trim() || 'Custom Business Idea';
    }
    return selectedIdeaOption;
  };

  // Google Places Autocomplete search & Coordinate detection
  const handleLocationInputChange = (value: string) => {
    setTargetLocationQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // If coordinates like "17.0179, 74.9585" were typed or pasted
    const coordMatch = value.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setTargetCoords({ latitude: lat, longitude: lng });
        setSuggestions([]);
        setShowSuggestions(false);

        // Reverse geocode to resolve human-friendly name
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            const res = await api.get<any>(`/google/geocode/reverse?lat=${lat}&lng=${lng}`);
            if (res.data && (res.data.name || res.data.display_name)) {
              setTargetLocationQuery(res.data.name || res.data.display_name);
            }
          } catch {
            // keep raw coords if resolution offline
          }
        }, 600);
        return;
      }
    }

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearchingLocation(true);
        const res = await api.post<any[]>('/google/autocomplete', {
          input: value,
          latitude: targetCoords.latitude,
          longitude: targetCoords.longitude,
          radius: 50000,
        });
        if (res.data && res.data.length > 0) {
          setSuggestions(res.data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = async (sug: any) => {
    setTargetLocationQuery(sug.description || sug.mainText);
    setShowSuggestions(false);

    try {
      // Geocode selected description
      const res = await api.get<any[]>(`/google/geocode?address=${encodeURIComponent(sug.description || sug.mainText)}`);
      if (res.data && res.data.length > 0) {
        const top = res.data[0];
        setTargetCoords({
          latitude: top.latitude,
          longitude: top.longitude,
        });
      }
    } catch (err) {
      console.error('Failed to geocode suggestion:', err);
    }
  };

  // Live GPS geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsNotice('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingGps(true);
    setGpsNotice('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setTargetCoords({ latitude: lat, longitude: lng });

        try {
          const res = await api.get<any>(`/google/geocode/reverse?lat=${lat}&lng=${lng}`);
          if (res.data) {
            setTargetLocationQuery(res.data.name || res.data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            setGpsNotice(`GPS acquired: ${res.data.name || 'Current Site'}`);
          }
        } catch {
          setTargetLocationQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          setGpsNotice('Coordinates acquired from device.');
        } finally {
          setDetectingGps(false);
          setTimeout(() => setGpsNotice(null), 4000);
        }
      },
      (err) => {
        setDetectingGps(false);
        setGpsNotice(`GPS error: ${err.message}. Please allow location permission.`);
        setTimeout(() => setGpsNotice(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleQuickPickLocation = (pick: { name: string; lat: number; lng: number }) => {
    setTargetLocationQuery(pick.name);
    setTargetCoords({ latitude: pick.lat, longitude: pick.lng });
    setShowSuggestions(false);
  };

  // Trigger Primary Location-Based Analysis
  const handleAnalyzeLocationOpportunity = async (financialsOverride?: LocationPredictionFinancialInputs | unknown) => {
    const businessIdea = getEffectiveBusinessIdea();
    if (!businessIdea) {
      setAnalysisError('Please enter or select a business idea.');
      return;
    }

    try {
      setAnalyzingLocation(true);
      setAnalysisError(null);
      setSaveSuccessNotice(null);
      setSelectedCompetitor(null);

      const isValidFinancials =
        financialsOverride &&
        typeof financialsOverride === 'object' &&
        !('nativeEvent' in (financialsOverride as any)) &&
        !('target' in (financialsOverride as any)) &&
        !('preventDefault' in (financialsOverride as any));

      const payloadFinancials = isValidFinancials
        ? (financialsOverride as LocationPredictionFinancialInputs)
        : (showFinancialInputs ? financialInputs : undefined);

      const result = await locationPredictionClient.analyzeOpportunity({
        businessIdea,
        latitude: targetCoords.latitude,
        longitude: targetCoords.longitude,
        radiusMeters,
        locationName: targetLocationQuery,
        financialInputs: payloadFinancials,
      });

      setLocationResult(result);
      if (result.locationName && !/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(result.locationName.trim())) {
        setTargetLocationQuery(result.locationName);
      } else if (result.formattedAddress && !/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(result.formattedAddress.trim())) {
        setTargetLocationQuery(result.formattedAddress.split(',')[0]);
      }
    } catch (err: any) {
      console.error('Location analysis error:', err);
      setAnalysisError(
        err?.response?.data?.message || err?.message || 'Failed to complete location-based business opportunity analysis.'
      );
    } finally {
      setAnalyzingLocation(false);
    }
  };

  const handleApplyBenchmarksAndAnalyze = (customBenchmarks?: LocationPredictionFinancialInputs) => {
    const currentIdea = getEffectiveBusinessIdea();
    const benchmarks = customBenchmarks || getCategoryFinancialBenchmarks(currentIdea);
    setFinancialInputs(benchmarks);
    setShowFinancialInputs(true);
    handleAnalyzeLocationOpportunity(benchmarks);
  };

  const handleOpenFinancialsAndScroll = () => {
    setShowFinancialInputs(true);
    setTimeout(() => {
      financialInputsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Map Click handler to change location
  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setTargetCoords({ latitude: lat, longitude: lng });
    try {
      const res = await api.get<any>(`/google/geocode/reverse?lat=${lat}&lng=${lng}`);
      if (res.data) {
        setTargetLocationQuery(res.data.name || res.data.display_name);
      } else {
        setTargetLocationQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setTargetLocationQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  // Save Analysis Handler
  const handleSaveAnalysis = async () => {
    if (!locationResult) return;
    try {
      setSavingPrediction(true);
      setSaveSuccessNotice(null);
      await locationPredictionClient.savePrediction(locationResult, showFinancialInputs ? financialInputs : undefined);
      setSaveSuccessNotice('Analysis successfully saved to your profile.');
      setTimeout(() => setSaveSuccessNotice(null), 4000);
    } catch (err: any) {
      console.error('Failed to save analysis:', err);
      setAnalysisError('Failed to save analysis. Please ensure you are logged in.');
    } finally {
      setSavingPrediction(false);
    }
  };

  // Run Existing Plan Ensemble Prediction (Preserved)
  const runPlanEnsemblePrediction = async (planToPredict?: BusinessPlan) => {
    const targetPlan = planToPredict || plans.find((p) => String(p.id) === String(selectedPlanId));
    if (!targetPlan) return;

    try {
      setPredictingPlan(true);
      const res = await api.post<any>('/predictions/predict', {
        totalInitialInvestment: targetPlan.totalInitialInvestment,
        totalMonthlyFixedExpenses: targetPlan.totalMonthlyFixedExpenses,
        monthlyRevenue: targetPlan.monthlyRevenue,
        monthlyProfit: targetPlan.monthlyProfit,
        profitMargin: targetPlan.profitMargin,
        paybackPeriodMonths: targetPlan.paybackPeriodMonths,
        breakEvenUnits: targetPlan.breakEvenUnits,
        category: targetPlan.category,
      });
      if (res.data) {
        setPlanPrediction(res.data);
      }
    } catch (err) {
      console.error('Plan prediction error:', err);
    } finally {
      setPredictingPlan(false);
    }
  };

  const currentPlan = plans.find((p) => String(p.id) === String(selectedPlanId));

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <PageHeader
        title="Machine Learning Success Prediction"
        description="Dual-engine decision support: Evaluate location-based competitor density and market feasibility, alongside calibrated SME ensemble models."
        badge="BizMind AI Engine"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />}
              onClick={() => setIsSavedModalOpen(true)}
            >
              Saved Analyses
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<GitCompare className="w-3.5 h-3.5 text-[#38BDF8]" />}
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide Comparison' : 'Compare 3 Locations'}
            </Button>
          </div>
        }
      />

      {/* Navigation Pills to switch or focus */}
      <div className="flex items-center gap-2 border-b border-[#27272A] pb-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'location'
              ? 'bg-[#FFBF24] text-[#0B0B0C] font-extrabold shadow-sm'
              : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#18181B]'
          }`}
        >
          <MapPin className="w-4 h-4 stroke-[2.5]" />
          <span>Location-Based Success Prediction</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-[#0B0B0C]">New</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plan_ensemble')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'plan_ensemble'
              ? 'bg-[#FFBF24] text-[#0B0B0C] font-extrabold shadow-sm'
              : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#18181B]'
          }`}
        >
          <Cpu className="w-4 h-4 stroke-[2.5]" />
          <span>Financial Plan Ensemble ML</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#27272A] text-[#A1A1AA]">Plan-Linked</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: LOCATION-BASED BUSINESS SUCCESS PREDICTION                     */}
      {/* ========================================================================= */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          {/* USER INPUT CARD */}
          <Card className="border-[#FFBF24]/30 bg-gradient-to-b from-[#18181B] to-[#111113] shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse" />
                    <CardTitle className="text-lg text-[#F8FAFC]">
                      Location-Based Business Success Prediction
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-[#A1A1AA]">
                    Evaluate a business idea in a selected location using nearby business data, competition analysis,
                    financial feasibility, and available predictive models.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/30 px-2.5 py-1 rounded-lg">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Google Places Platform (New)</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Row 1: Business Idea + Target Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Business Idea Selector & Custom Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FFBF24]" />
                    <span>Business Idea</span>
                  </label>
                  <select
                    value={selectedIdeaOption}
                    onChange={(e) => setSelectedIdeaOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0C] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24] font-medium"
                  >
                    {PRESET_BUSINESS_IDEAS.map((idea) => (
                      <option key={idea} value={idea}>
                        {idea}
                      </option>
                    ))}
                  </select>

                  {selectedIdeaOption === 'Custom Business Idea' && (
                    <Input
                      value={customIdeaInput}
                      onChange={(e) => setCustomIdeaInput(e.target.value)}
                      placeholder="Type custom business idea (e.g. Specialty Pet Cafe, Organic Health Store)"
                      className="text-xs mt-1.5"
                    />
                  )}
                </div>

                {/* 2. Target Location Input + Suggestions */}
                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
                      <span>Target Location (City / Locality / PIN)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={detectingGps}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFBF24] hover:text-[#F59E0B] transition-colors cursor-pointer"
                    >
                      <Crosshair className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
                      <span>{detectingGps ? 'Locating...' : 'Use My Location'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      value={targetLocationQuery}
                      onChange={(e) => handleLocationInputChange(e.target.value)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      placeholder="Search city, area, landmark, or PIN code..."
                      leftIcon={<Search className="w-3.5 h-3.5 text-[#A1A1AA]" />}
                      className="text-xs pr-8"
                    />
                    {isSearchingLocation && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFBF24]" />
                      </div>
                    )}

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl bg-[#111113] border border-[#27272A] shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                        {suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSuggestion(sug)}
                            className="w-full px-3 py-2 text-left text-xs text-[#F8FAFC] hover:bg-[#1A1A1D] hover:text-[#FFBF24] border-b border-[#27272A]/50 last:border-b-0 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#FFBF24] shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold block">{sug.mainText || sug.description}</span>
                              {sug.secondaryText && (
                                <span className="text-[10px] text-[#71717A] block truncate">{sug.secondaryText}</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {gpsNotice && (
                    <span className="text-[10px] font-mono text-emerald-400 block animate-fadeIn">{gpsNotice}</span>
                  )}
                </div>
              </div>

              {/* Quick Picks for Location */}
              <div className="flex items-center gap-1.5 text-xs text-[#71717A] flex-wrap">
                <span className="text-[#A1A1AA] text-[11px] font-semibold flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#FFBF24]" /> Quick picks:
                </span>
                {POPULAR_LOCATION_PICKS.map((pick) => (
                  <button
                    key={pick.name}
                    type="button"
                    onClick={() => handleQuickPickLocation(pick)}
                    className="px-2 py-0.5 rounded-md bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] border border-[#27272A] text-[11px] transition-colors cursor-pointer"
                  >
                    {pick.name.split(',')[0]}
                  </button>
                ))}
              </div>

              {/* Row 2: Analysis Radius Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>Analysis Radius:</span>
                  <span className="text-[#FFBF24] font-bold">{(radiusMeters / 1000).toFixed(1)} km</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {RADIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRadiusMeters(opt.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        radiusMeters === opt.value
                          ? 'bg-[#FFBF24] text-[#0B0B0C] border-[#FFBF24] shadow-sm'
                          : 'bg-[#0B0B0C] text-[#A1A1AA] hover:text-[#F8FAFC] border-[#27272A] hover:bg-[#18181B]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Optional Financial Inputs Accordion */}
              <div ref={financialInputsRef} className="rounded-xl border border-[#27272A] bg-[#0B0B0C] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowFinancialInputs(!showFinancialInputs)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#FFBF24]" />
                    <span className="text-xs font-bold text-[#F8FAFC]">Optional Financial Inputs</span>
                    <Badge variant="warning">Optional for pure location assessment</Badge>
                  </div>
                  {showFinancialInputs ? (
                    <ChevronUp className="w-4 h-4 text-[#A1A1AA]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                  )}
                </button>

                {showFinancialInputs && (
                  <div className="p-4 border-t border-[#27272A] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#18181B] border border-[#27272A]">
                      <p className="text-[11px] text-[#A1A1AA]">
                        Entering financial assumptions unlocks break-even velocity, margin sensitivity, and calibrated ML success probability.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const benchmarks = getCategoryFinancialBenchmarks(getEffectiveBusinessIdea());
                          setFinancialInputs(benchmarks);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-[#FFBF24] text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Load Benchmark Values</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#A1A1AA] uppercase font-mono block mb-1">
                          Estimated Initial Investment (₹ / $)
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.initialInvestment || ''}
                          onChange={(e) =>
                            setFinancialInputs({
                              ...financialInputs,
                              initialInvestment: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 800000"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#A1A1AA] uppercase font-mono block mb-1">
                          Expected Monthly Revenue (₹ / $)
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.expectedMonthlyRevenue || ''}
                          onChange={(e) =>
                            setFinancialInputs({
                              ...financialInputs,
                              expectedMonthlyRevenue: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 300000"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#A1A1AA] uppercase font-mono block mb-1">
                          Monthly Fixed Expenses (Rent, Staff)
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.monthlyFixedExpenses || ''}
                          onChange={(e) =>
                            setFinancialInputs({
                              ...financialInputs,
                              monthlyFixedExpenses: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 120000"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#A1A1AA] uppercase font-mono block mb-1">
                          Estimated Variable Expenses (COGS)
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.estimatedVariableExpenses || ''}
                          onChange={(e) =>
                            setFinancialInputs({
                              ...financialInputs,
                              estimatedVariableExpenses: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 80000"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#A1A1AA] uppercase font-mono block mb-1">
                          Expected Average Selling Price
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.expectedAverageSellingPrice || ''}
                          onChange={(e) =>
                            setFinancialInputs({
                              ...financialInputs,
                              expectedAverageSellingPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 250"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#A1A1AA] uppercase font-mono block mb-1">
                          Expected Daily Customers
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.expectedCustomersPerDay || ''}
                          onChange={(e) =>
                            setFinancialInputs({
                              ...financialInputs,
                              expectedCustomersPerDay: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="e.g. 40"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {analysisError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-[#71717A]">
                  Coordinates: {targetCoords.latitude.toFixed(4)}, {targetCoords.longitude.toFixed(4)} • Analysis
                  boundary: {(radiusMeters / 1000).toFixed(1)} km
                </span>
                <Button
                  onClick={() => handleAnalyzeLocationOpportunity()}
                  disabled={analyzingLocation}
                  leftIcon={
                    analyzingLocation ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0B0B0C]" />
                    ) : (
                      <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    )
                  }
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#FFBF24] to-[#F59E0B] text-[#0B0B0C] font-extrabold hover:brightness-105 shadow-md shadow-[#FFBF24]/20"
                >
                  {analyzingLocation ? 'Evaluating Google Places Opportunity...' : 'Analyze Business Opportunity'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ===================================================================== */}
          {/* RESULTS DASHBOARD                                                     */}
          {/* ===================================================================== */}
          {locationResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. PREDICTION & FEASIBILITY SUMMARY BANNER */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* A. Success Probability or Unvalidated Notice */}
                <div className="md:col-span-2 p-5 rounded-xl bg-[#111113] border border-[#27272A] relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] font-mono">
                        Business Success Probability
                      </span>
                      {locationResult.predictionAssessment.mlModelValidated ? (
                        <Badge variant="success">Validated Ensemble</Badge>
                      ) : (
                        <Badge variant="warning">Rule-Based Assessment</Badge>
                      )}
                    </div>

                    {locationResult.predictionAssessment.mlModelValidated &&
                    locationResult.predictionAssessment.successProbability !== null ? (
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-extrabold text-[#FFBF24]">
                            {locationResult.predictionAssessment.successProbability}%
                          </span>
                          <span className="text-xs text-[#A1A1AA]">
                            Confidence: {locationResult.predictionAssessment.confidenceScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                          {locationResult.predictionAssessment.modelNotice}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-1">
                        <div className="p-3 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-[#FFBF24] text-xs font-semibold flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Prediction unavailable — insufficient validated data.</span>
                        </div>
                        <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                          {locationResult.predictionAssessment.modelNotice}
                        </p>
                        <div className="pt-1 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleApplyBenchmarksAndAnalyze()}
                            disabled={analyzingLocation}
                            className="px-3 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Unlock ML Success Prediction (Load Benchmarks)</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenFinancialsAndScroll}
                            className="px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#27272A] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3 h-3 text-[#FFBF24]" />
                            <span>Enter Custom Inputs</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs">
                    <span className="text-[#71717A]">Assessed Risk Classification:</span>
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded ${
                        locationResult.predictionAssessment.riskTier === 'LOW'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : locationResult.predictionAssessment.riskTier === 'MODERATE'
                          ? 'bg-amber-500/10 text-[#FFBF24]'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {locationResult.predictionAssessment.riskTier} RISK
                    </span>
                  </div>
                </div>

                {/* B. Feasibility Grade & Score */}
                <StatCard
                  label="Location Feasibility Score"
                  value={`${locationResult.predictionAssessment.feasibilityAssessment.scoreOutOf100}/100`}
                  sublabel={locationResult.predictionAssessment.feasibilityAssessment.feasibilityGrade}
                  icon={<Sparkles className="w-5 h-5 text-[#FFBF24]" />}
                />

                {/* C. Competitor Saturation Tier */}
                <StatCard
                  label="Relevant Competitors"
                  value={String(locationResult.competitorMetrics.relevantCompetitorCount)}
                  sublabel={`${locationResult.competitorMetrics.competitorDensityPerSqKm}/km² density (${locationResult.marketAnalysis.concentrationLevel})`}
                  icon={<Building2 className="w-5 h-5 text-[#38BDF8]" />}
                />
              </div>

              {/* SAVE & PLANNER CONTINUATION TOOLBAR */}
              <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A1A1AA]">
                    Site: <strong className="text-[#F8FAFC]">{locationResult.locationName}</strong> for{' '}
                    <strong className="text-[#FFBF24]">{locationResult.businessIdea}</strong>
                  </span>
                  {saveSuccessNotice && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {saveSuccessNotice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveAnalysis}
                    disabled={savingPrediction}
                    leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />}
                  >
                    {savingPrediction ? 'Saving...' : 'Save Analysis'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/business-planner?idea=${encodeURIComponent(
                          locationResult.businessIdea
                        )}&location=${encodeURIComponent(locationResult.locationName)}&lat=${
                          locationResult.coordinates.latitude
                        }&lng=${locationResult.coordinates.longitude}`
                      )
                    }
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Continue to Business Planner
                  </Button>
                </div>
              </div>

              {/* 2. GOOGLE MAPS PLATFORM & COMPETITOR OVERVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pure Google Maps Component (NO Leaflet/OSM) */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FFBF24]" />
                      <span>Interactive Google Map & Competitor Pins</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#71717A]">
                      Radius: {(locationResult.radiusMeters / 1000).toFixed(1)} km
                    </span>
                  </div>

                  <GooglePredictionMap
                    center={locationResult.coordinates}
                    radiusMeters={locationResult.radiusMeters}
                    competitors={locationResult.competitorMetrics.competitors}
                    locationName={locationResult.locationName}
                    onLocationSelect={handleMapLocationSelect}
                    selectedCompetitorId={selectedCompetitor?.id}
                    onSelectCompetitor={(comp) => setSelectedCompetitor(comp)}
                    height="440px"
                  />
                </div>

                {/* Spatial Dispersion & Distance Breakdown */}
                <div className="space-y-4">
                  <Card className="border-[#27272A] bg-[#111113]">
                    <CardHeader>
                      <CardTitle className="text-sm">Distance Distribution</CardTitle>
                      <CardDescription className="text-xs">
                        Direct competitor distance from target site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#A1A1AA]">&lt; 500 m (Walking Buffer)</span>
                          <span className="text-[#F8FAFC] font-bold font-mono">
                            {locationResult.competitorMetrics.distanceDistribution.within500m}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                          <div
                            className={`h-full ${
                              locationResult.competitorMetrics.distanceDistribution.within500m === 0
                                ? 'bg-emerald-400'
                                : 'bg-[#EF4444]'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                locationResult.competitorMetrics.distanceDistribution.within500m * 25
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#A1A1AA]">500 m - 1 km</span>
                          <span className="text-[#F8FAFC] font-bold font-mono">
                            {locationResult.competitorMetrics.distanceDistribution.between500mAnd1km}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                          <div
                            className="h-full bg-[#FFBF24]"
                            style={{
                              width: `${Math.min(
                                100,
                                locationResult.competitorMetrics.distanceDistribution.between500mAnd1km * 25
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#A1A1AA]">1 km - 2 km</span>
                          <span className="text-[#F8FAFC] font-bold font-mono">
                            {locationResult.competitorMetrics.distanceDistribution.between1kmAnd2km}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                          <div
                            className="h-full bg-[#38BDF8]"
                            style={{
                              width: `${Math.min(
                                100,
                                locationResult.competitorMetrics.distanceDistribution.between1kmAnd2km * 25
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#27272A] space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#71717A]">Nearest Competitor:</span>
                          <span className="font-bold text-[#FFBF24] font-mono">
                            {locationResult.competitorMetrics.nearestCompetitorDistanceFormatted}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#71717A]">Average Distance:</span>
                          <span className="font-bold text-[#F8FAFC] font-mono">
                            {locationResult.competitorMetrics.averageCompetitorDistanceFormatted}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  <Card className="border-[#27272A] bg-[#111113]">
                    <CardHeader>
                      <CardTitle className="text-sm">Observed Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(locationResult.competitorMetrics.categoryDistribution).map(([cat, count]) => (
                          <span
                            key={cat}
                            className="px-2 py-1 rounded-lg bg-[#0B0B0C] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-center gap-1.5"
                          >
                            <span>{cat}</span>
                            <span className="font-mono font-bold text-[#FFBF24]">{count}</span>
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 3. BUSINESS OPPORTUNITY & RISK ASSESSMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Favorable Indicators */}
                <Card className="border-[#27272A] bg-[#111113]">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Favorable Opportunity Indicators</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {locationResult.marketAnalysis.favorableIndicators.map((ind, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-[#F8FAFC]">
                        • {ind}
                      </div>
                    ))}
                    {locationResult.marketAnalysis.observedMarketGaps.map((gap, idx) => (
                      <div
                        key={`gap-${idx}`}
                        className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-medium"
                      >
                        ★ Observed Gap: {gap}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Potential Challenges & Risks */}
                <Card className="border-[#27272A] bg-[#111113]">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Potential Challenges & Unresolved Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {locationResult.marketAnalysis.potentialChallenges.map((chal, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] text-xs text-[#F8FAFC]">
                        • {chal}
                      </div>
                    ))}
                    {locationResult.marketAnalysis.unresolvedQuestions.map((q, idx) => (
                      <div
                        key={`q-${idx}`}
                        className="p-3 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-xs text-[#FFBF24]"
                      >
                        ? {q}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 4. FINANCIAL FEASIBILITY (CALCULATED ESTIMATES VS USER ASSUMPTIONS) */}
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#FFBF24]" />
                        <span>Financial Feasibility & Sensitivity Modeling</span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Calculated unit economics, break-even velocity, and 3-tier sensitivity scenarios
                      </CardDescription>
                    </div>
                    {locationResult.financialFeasibility.hasFinancialData ? (
                      <Badge variant="success">Assumptions Modeled</Badge>
                    ) : (
                      <Badge variant="warning">Financial Assumptions Deferred</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {locationResult.financialFeasibility.hasFinancialData ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-[#0B0B0C] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] block font-mono">PROJECTED PROFIT MARGIN</span>
                          <span className="text-lg font-bold text-[#FFBF24]">
                            {locationResult.financialFeasibility.profitMargin}%
                          </span>
                          <span className="text-[10px] text-[#A1A1AA] block">Net Margin</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0B0B0C] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] block font-mono">BREAK-EVEN HORIZON</span>
                          <span className="text-lg font-bold text-emerald-400">
                            {locationResult.financialFeasibility.breakEvenPeriodMonths ?? 'N/A'} Months
                          </span>
                          <span className="text-[10px] text-[#A1A1AA] block">Capital Payback</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0B0B0C] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] block font-mono">ESTIMATED MONTHLY PROFIT</span>
                          <span className="text-lg font-bold text-[#F8FAFC]">
                            ₹{locationResult.financialFeasibility.expectedMonthlyProfit.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#A1A1AA] block">Revenue - Expenses</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0B0B0C] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] block font-mono">ANNUALIZED ROI</span>
                          <span className="text-lg font-bold text-purple-400">
                            {locationResult.financialFeasibility.annualizedRoi ?? 'N/A'}%
                          </span>
                          <span className="text-[10px] text-[#A1A1AA] block">1-Year Return</span>
                        </div>
                      </div>

                      {/* 3 Sensitivity Scenarios */}
                      <div className="pt-2">
                        <h4 className="text-xs font-bold text-[#F8FAFC] uppercase font-mono mb-2">
                          Sensitivity Scenarios:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Conservative */}
                          <div className="p-3.5 rounded-lg bg-[#0B0B0C] border border-rose-500/30 space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-rose-400">
                              <span>Conservative (-20% Rev)</span>
                              <span>{locationResult.financialFeasibility.scenarios.conservative.margin}% Margin</span>
                            </div>
                            <p className="text-[11px] text-[#A1A1AA]">
                              Monthly Profit: ₹
                              {locationResult.financialFeasibility.scenarios.conservative.profit.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-[#71717A]">
                              Payback: {locationResult.financialFeasibility.scenarios.conservative.breakEvenMonths ?? 'N/A'}{' '}
                              Months
                            </p>
                          </div>

                          {/* Base */}
                          <div className="p-3.5 rounded-lg bg-[#0B0B0C] border border-[#FFBF24]/40 space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-[#FFBF24]">
                              <span>Base Target</span>
                              <span>{locationResult.financialFeasibility.scenarios.base.margin}% Margin</span>
                            </div>
                            <p className="text-[11px] text-[#A1A1AA]">
                              Monthly Profit: ₹
                              {locationResult.financialFeasibility.scenarios.base.profit.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-[#71717A]">
                              Payback: {locationResult.financialFeasibility.scenarios.base.breakEvenMonths ?? 'N/A'} Months
                            </p>
                          </div>

                          {/* Optimistic */}
                          <div className="p-3.5 rounded-lg bg-[#0B0B0C] border border-emerald-500/30 space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-emerald-400">
                              <span>Optimistic (+20% Rev)</span>
                              <span>{locationResult.financialFeasibility.scenarios.optimistic.margin}% Margin</span>
                            </div>
                            <p className="text-[11px] text-[#A1A1AA]">
                              Monthly Profit: ₹
                              {locationResult.financialFeasibility.scenarios.optimistic.profit.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-[#71717A]">
                              Payback: {locationResult.financialFeasibility.scenarios.optimistic.breakEvenMonths ?? 'N/A'}{' '}
                              Months
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-[#0B0B0C] border border-[#27272A] space-y-4">
                      <div className="w-12 h-12 rounded-full bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-center mx-auto text-[#FFBF24]">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[#F8FAFC] font-bold">No Financial Assumptions Provided</p>
                        <p className="text-[11px] text-[#A1A1AA] max-w-lg mx-auto leading-relaxed">
                          Pure location analysis assesses competitor density and footfall. Financial feasibility (profit margins, capital break-even, and ML success probability) requires investment and expense estimates.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApplyBenchmarksAndAnalyze()}
                          disabled={analyzingLocation}
                          className="px-4 py-2 rounded-xl bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Auto-Fill Industry Benchmarks & Compute Feasibility</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenFinancialsAndScroll}
                          className="px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-[#F8FAFC] border border-[#27272A] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFBF24]" />
                          <span>Enter Custom Financials</span>
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 5. RECOMMENDATIONS & ACTION PLAN */}
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFBF24]" />
                    <span>Evidence-Based Action Plan & Strategic Recommendations</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Tactical steps tied to retrieved competitor density and financial thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {locationResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#F8FAFC]">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 6. COMPETITOR DIRECTORY TABLE */}
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">Nearby Commercial Establishments</CardTitle>
                      <CardDescription className="text-xs">
                        Retrieved via Google Places Platform live search
                      </CardDescription>
                    </div>
                    <span className="text-xs text-[#A1A1AA] font-mono">
                      {locationResult.competitorMetrics.competitors.length} venues found
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-xl border border-[#27272A]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#18181B] text-[#A1A1AA] uppercase font-mono text-[10px] border-b border-[#27272A]">
                        <tr>
                          <th className="p-3">Business Name</th>
                          <th className="p-3">Classification</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Distance</th>
                          <th className="p-3">Address</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272A] bg-[#111113]">
                        {locationResult.competitorMetrics.competitors.map((comp) => (
                          <tr
                            key={comp.id}
                            className={`hover:bg-[#18181B] transition-colors ${
                              selectedCompetitor?.id === comp.id ? 'bg-[#FFBF24]/10' : ''
                            }`}
                          >
                            <td className="p-3 font-bold text-[#F8FAFC]">{comp.name}</td>
                            <td className="p-3">
                              {comp.isDirectCompetitor ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
                                  Direct Competitor
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-400">
                                  Related Venue
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-[#A1A1AA]">{comp.category}</td>
                            <td className="p-3 font-mono text-[#FFBF24]">{comp.distanceFormatted}</td>
                            <td className="p-3 text-[#71717A] max-w-xs truncate">{comp.address || '—'}</td>
                            <td className="p-3">
                              <a
                                href={comp.googleMapsUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[#FFBF24] hover:underline font-semibold"
                              >
                                Maps <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Data Limitations Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0C] border border-[#27272A] text-[11px] text-[#71717A] space-y-1">
                <span className="font-bold text-[#A1A1AA] block">Data Governance & Attribution:</span>
                {locationResult.marketAnalysis.dataLimitations.map((lim, idx) => (
                  <p key={idx}>• {lim}</p>
                ))}
              </div>
            </div>
          )}

          {/* MULTI-LOCATION COMPARISON DRAWER / SECTION */}
          {showComparison && (
            <LocationComparisonSection
              businessIdea={getEffectiveBusinessIdea()}
              radiusMeters={radiusMeters}
              financialInputs={showFinancialInputs ? financialInputs : undefined}
              initialLocationA={{
                name: targetLocationQuery,
                latitude: targetCoords.latitude,
                longitude: targetCoords.longitude,
              }}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: EXISTING FINANCIAL PLAN ENSEMBLE ML MODEL (PRESERVED)           */}
      {/* ========================================================================= */}
      {activeTab === 'plan_ensemble' && (
        <div className="space-y-6">
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#FFBF24]" />
                    <span>Business Plan Financial Feasibility Model</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Inference engine evaluating capital adequacy, burn rate resilience, and break-even velocity
                    directly from saved business plan financials.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {plans.length > 0 && (
                    <select
                      value={selectedPlanId}
                      onChange={(e) => {
                        setSelectedPlanId(e.target.value);
                        const p = plans.find((item) => String(item.id) === e.target.value);
                        if (p) runPlanEnsemblePrediction(p);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0B0B0C] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.businessName || p.business_name}
                        </option>
                      ))}
                    </select>
                  )}

                  <Button
                    size="sm"
                    leftIcon={
                      predictingPlan ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )
                    }
                    onClick={() => runPlanEnsemblePrediction()}
                    disabled={predictingPlan || plans.length === 0}
                  >
                    {predictingPlan ? 'Running Model...' : 'Re-Run Model'}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loadingPlans ? (
                <div className="p-8 text-center text-xs text-[#A1A1AA]">Loading user business plans...</div>
              ) : plans.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <FileSpreadsheet className="w-8 h-8 text-[#FFBF24] mx-auto opacity-50" />
                  <p className="text-xs text-[#F8FAFC] font-bold">No Business Plans Created Yet</p>
                  <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
                    Create your first business plan to supply financial balance sheet metrics to the ensemble predictor.
                  </p>
                  <Link to="/business-planner">
                    <Button size="sm">Create Business Plan</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      label="Ensemble Probability"
                      value={planPrediction ? `${planPrediction.successProbability}%` : '...'}
                      sublabel="Calibrated ML inference"
                      icon={<Sparkles className="w-5 h-5 text-[#FFBF24]" />}
                    />
                    <StatCard
                      label="Model Confidence"
                      value={planPrediction ? `${planPrediction.confidenceScore}%` : '...'}
                      sublabel="Cross-validated score"
                      icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
                    />
                    <StatCard
                      label="Assessed Risk Tier"
                      value={planPrediction?.riskTier || 'LOW'}
                      sublabel="Burn rate & capital volatility"
                      icon={<ShieldAlert className="w-5 h-5 text-blue-400" />}
                    />
                    <StatCard
                      label="Active Model"
                      value="Random Forest"
                      sublabel="Gradient Boosting Ensemble"
                      icon={<Cpu className="w-5 h-5 text-purple-400" />}
                    />
                  </div>

                  {/* Feature Weights & Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="p-4 rounded-xl bg-[#0B0B0C] border border-[#27272A] space-y-3">
                        <span className="text-xs font-bold text-[#F8FAFC] block">
                          Feature Contributions for {currentPlan?.businessName || currentPlan?.business_name}:
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                            <span className="text-[10px] text-[#71717A] block">Capital Adequacy</span>
                            <span className="text-base font-bold text-[#F8FAFC]">
                              {planPrediction?.features?.capitalAdequacyRatio}x
                            </span>
                            <span className="text-[10px] text-emerald-400 block">Runway vs Burn</span>
                          </div>

                          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                            <span className="text-[10px] text-[#71717A] block">Break-Even Horizon</span>
                            <span className="text-base font-bold text-[#F8FAFC]">
                              {planPrediction?.features?.breakEvenHorizonMonths} Mo
                            </span>
                            <span className="text-[10px] text-emerald-400 block">Payback Velocity</span>
                          </div>

                          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                            <span className="text-[10px] text-[#71717A] block">Margin Resilience</span>
                            <span className="text-base font-bold text-[#F8FAFC]">
                              {planPrediction?.features?.operatingMarginScore}/100
                            </span>
                            <span className="text-[10px] text-[#FFBF24] block">Buffer Score</span>
                          </div>
                        </div>

                        {/* Feature Weights Bar List */}
                        <div className="pt-3 border-t border-[#27272A] space-y-2">
                          {planPrediction?.featureImportance?.map((feat: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-[#A1A1AA]">{feat.name}</span>
                                <span className="text-[#F8FAFC] font-semibold">
                                  {(feat.weight * 100).toFixed(0)}% weight
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                                <div
                                  className={`h-full ${
                                    feat.impact === 'Positive'
                                      ? 'bg-emerald-400'
                                      : feat.impact === 'Neutral'
                                      ? 'bg-[#FFBF24]'
                                      : 'bg-rose-400'
                                  }`}
                                  style={{ width: `${feat.weight * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#0B0B0C] border border-[#27272A] space-y-2">
                        <span className="text-xs font-bold text-[#F8FAFC] block">Model Governance</span>
                        <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                          Calibrated on historical SME balance sheet survival datasets across retail, food service, and
                          consumer services.
                        </p>
                        <div className="pt-2">
                          <Link to="/business-plans">
                            <Button size="sm" variant="outline" className="w-full">
                              View All Business Plans
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAVED PREDICTIONS MODAL */}
      <SavedPredictionsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onSelectPrediction={(saved) => {
          setActiveTab('location');
          setSelectedIdeaOption(saved.business_idea || 'Coffee Shop / Specialty Cafe');
          setTargetLocationQuery(saved.location_name || 'Saved Site');
          setTargetCoords({
            latitude: saved.latitude,
            longitude: saved.longitude,
          });
          setRadiusMeters(saved.radius_meters || 2000);

          if (saved.financial_inputs) {
            setFinancialInputs(saved.financial_inputs);
            setShowFinancialInputs(true);
          }

          setLocationResult({
            id: saved.id,
            businessIdea: saved.business_idea,
            businessCategory: saved.business_category,
            locationName: saved.location_name,
            formattedAddress: saved.formatted_address,
            coordinates: { latitude: saved.latitude, longitude: saved.longitude },
            radiusMeters: saved.radius_meters,
            competitorMetrics: saved.competitor_metrics,
            marketAnalysis: saved.market_analysis,
            financialFeasibility: saved.financial_feasibility,
            predictionAssessment: saved.prediction_assessment,
            recommendations: saved.recommendations,
            timestamp: saved.created_at,
          });
        }}
      />
    </div>
  );
};
