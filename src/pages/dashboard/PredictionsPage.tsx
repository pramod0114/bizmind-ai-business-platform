/**
 * BizMind – Machine Learning Success Prediction & Location-Based Opportunity Assessment
 * 
 * Incorporates:
 * 1. Location-Based Business Success Prediction (Google Places API New + Spatial Feasibility)
 * 2. Multi-Location Comparative Evaluation (up to 3 sites)
 * 3. Financial Feasibility Modeling & Break-Even Velocity
 * 4. Preserved Business Plan Financial ML Ensemble Pipeline
 * 5. Clean, collapsible details architecture with `>` expanders
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
  ChevronRight,
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
  BarChart3,
  Target,
  PieChart,
  Store,
  Eye,
  EyeOff,
  Activity,
  Award,
} from 'lucide-react';

const POPULAR_BUSINESS_IDEAS = [
  'Coffee Shop / Specialty Cafe',
  'Restaurant & Dine-in',
  'Bakery & Pastry Shop',
  'Gym & Fitness Studio',
  'Clothing & Fashion Boutique',
  'Grocery & Supermarket',
  'Pharmacy & Medical Store',
  'Salon & Beauty Spa',
  'Mobile & Tech Store',
];

const RADIUS_OPTIONS = [
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
];

const POPULAR_LOCATION_PICKS = [
  { name: 'Vishrambag, Sangli', lat: 16.8524, lng: 74.5815 },
  { name: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077 },
  { name: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295 },
  { name: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
  { name: 'Madhavnagar, Sangli', lat: 16.8856, lng: 74.6082 },
];

export const getCategoryFinancialBenchmarks = (categoryName: string): LocationPredictionFinancialInputs => {
  const lower = (categoryName || '').toLowerCase();
  if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('tea')) {
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
  if (lower.includes('restaurant') || lower.includes('dine') || lower.includes('food') || lower.includes('kitchen')) {
    return {
      initialInvestment: 1600000,
      monthlyFixedExpenses: 250000,
      expectedMonthlyRevenue: 580000,
      estimatedVariableExpenses: 175000,
      expectedAverageSellingPrice: 450,
      expectedCustomersPerDay: 45,
    };
  }
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout') || lower.includes('crossfit')) {
    return {
      initialInvestment: 1400000,
      monthlyFixedExpenses: 220000,
      expectedMonthlyRevenue: 450000,
      estimatedVariableExpenses: 50000,
      expectedAverageSellingPrice: 2500,
      expectedCustomersPerDay: 8,
    };
  }
  if (lower.includes('pharmacy') || lower.includes('medical') || lower.includes('chemist') || lower.includes('health')) {
    return {
      initialInvestment: 900000,
      monthlyFixedExpenses: 120000,
      expectedMonthlyRevenue: 420000,
      estimatedVariableExpenses: 210000,
      expectedAverageSellingPrice: 350,
      expectedCustomersPerDay: 45,
    };
  }
  if (lower.includes('cloth') || lower.includes('fashion') || lower.includes('boutique') || lower.includes('apparel')) {
    return {
      initialInvestment: 950000,
      monthlyFixedExpenses: 140000,
      expectedMonthlyRevenue: 360000,
      estimatedVariableExpenses: 110000,
      expectedAverageSellingPrice: 1200,
      expectedCustomersPerDay: 12,
    };
  }
  if (lower.includes('salon') || lower.includes('spa') || lower.includes('beauty') || lower.includes('parlour')) {
    return {
      initialInvestment: 700000,
      monthlyFixedExpenses: 130000,
      expectedMonthlyRevenue: 290000,
      estimatedVariableExpenses: 45000,
      expectedAverageSellingPrice: 650,
      expectedCustomersPerDay: 18,
    };
  }
  if (lower.includes('grocer') || lower.includes('supermarket') || lower.includes('mart')) {
    return {
      initialInvestment: 1100000,
      monthlyFixedExpenses: 160000,
      expectedMonthlyRevenue: 520000,
      estimatedVariableExpenses: 290000,
      expectedAverageSellingPrice: 450,
      expectedCustomersPerDay: 45,
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

  // Navigation mode: Location-Based Prediction vs Business Plan Ensemble
  const [activeTab, setActiveTab] = useState<'location' | 'plan_ensemble'>('location');

  // Business Name & Location Search state
  const [businessNameInput, setBusinessNameInput] = useState<string>('Coffee Shop');
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

  // Geolocation state
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Optional Financial Inputs toggle
  const [showFinancialInputs, setShowFinancialInputs] = useState(false);
  const [financialInputs, setFinancialInputs] = useState<LocationPredictionFinancialInputs>(() =>
    getCategoryFinancialBenchmarks('Coffee Shop')
  );

  // Location Analysis State
  const [analyzingLocation, setAnalyzingLocation] = useState(false);
  const [locationResult, setLocationResult] = useState<LocationPredictionResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorDetail | null>(null);

  // Saved Analysis State
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savingPrediction, setSavingPrediction] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Multi-Location Comparison Drawer
  const [showComparison, setShowComparison] = useState(false);

  // Collapsible Details State with `>` expanders
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    competitors: false,
    market: false,
    financials: false,
    mlFeatures: false,
    directory: false,
    recommendations: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllSections = (expand: boolean) => {
    setOpenSections({
      competitors: expand,
      market: expand,
      financials: expand,
      mlFeatures: expand,
      directory: expand,
      recommendations: expand,
    });
  };

  const allSectionsOpen = Object.values(openSections).every(Boolean);

  // Business Plan Financial ML Ensemble Pipeline State (Preserved)
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | string>('');
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [predictingPlan, setPredictingPlan] = useState(false);
  const [planPrediction, setPlanPrediction] = useState<any | null>(null);

  // Initial load
  useEffect(() => {
    // 1. Run initial location analysis for default coffee shop in Vishrambag
    handleAnalyzeOpportunity();

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

  // Update benchmark values when business name changes
  const handleSelectBusinessIdea = (idea: string) => {
    setBusinessNameInput(idea);
    const benchmarks = getCategoryFinancialBenchmarks(idea);
    setFinancialInputs(benchmarks);
  };

  // Google Places Autocomplete search
  const handleLocationInputChange = (value: string) => {
    setTargetLocationQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    const coordMatch = value.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      setTargetCoords({ latitude: lat, longitude: lng });
      setShowSuggestions(false);
      return;
    }

    if (value.trim().length >= 3) {
      setIsSearchingLocation(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await api.get<any[]>(`/google/places/autocomplete?input=${encodeURIComponent(value.trim())}`);
          if (res.data && res.data.length > 0) {
            setSuggestions(res.data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
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

  const handleSelectSuggestion = async (sug: any) => {
    const locText = sug.description || sug.mainText;
    setTargetLocationQuery(locText);
    setShowSuggestions(false);

    try {
      const res = await api.get<any[]>(`/google/geocode?address=${encodeURIComponent(locText)}`);
      if (res.data && res.data.length > 0) {
        const top = res.data[0];
        setTargetCoords({
          latitude: top.latitude,
          longitude: top.longitude,
        });
      }
    } catch (err) {
      console.warn('Geocode suggestion error:', err);
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

  // Primary ML Prediction Execution
  const handleAnalyzeOpportunity = async (customFinancials?: LocationPredictionFinancialInputs) => {
    const businessIdea = businessNameInput.trim();
    if (!businessIdea) {
      setAnalysisError('Please enter a business name or idea.');
      return;
    }

    try {
      setAnalyzingLocation(true);
      setAnalysisError(null);
      setSaveSuccessNotice(null);
      setSelectedCompetitor(null);

      // Pass user-edited financials if toggled or specified, otherwise undefined (backend automatically computes tailored industry benchmarks)
      const payloadFinancials = customFinancials || (showFinancialInputs ? financialInputs : undefined);

      const result = await locationPredictionClient.analyzeOpportunity({
        businessIdea,
        latitude: targetCoords.latitude,
        longitude: targetCoords.longitude,
        radiusMeters,
        locationName: targetLocationQuery,
        financialInputs: payloadFinancials,
      });

      setLocationResult(result);

      // Keep location name clean
      if (result.locationName && !/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(result.locationName.trim())) {
        setTargetLocationQuery(result.locationName);
      } else if (result.formattedAddress && !/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(result.formattedAddress.trim())) {
        setTargetLocationQuery(result.formattedAddress.split(',')[0]);
      }
    } catch (err: any) {
      console.error('Location analysis error:', err);
      setAnalysisError(
        err?.response?.data?.message || err?.message || 'Failed to complete machine learning success prediction.'
      );
    } finally {
      setAnalyzingLocation(false);
    }
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

  // Run Plan Ensemble Prediction (Preserved)
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
        description="Predictive AI decision engine evaluating Google Maps competitor big data, spatial footfall clusters, and calibrated SME economics."
        badge="BizMind ML Engine"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />}
              onClick={() => setIsSavedModalOpen(true)}
            >
              Saved Predictions
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

      {/* Navigation Pills to switch tabs */}
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
          <Activity className="w-4 h-4 stroke-[2.5]" />
          <span>Location & Competitor ML Predictor</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-[#0B0B0C]">Active</span>
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
      {/* SECTION A: LOCATION & COMPETITOR ML PREDICTOR                             */}
      {/* ========================================================================= */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          {/* SEARCH & INPUT CARD - CLEAN & STREAMLINED */}
          <Card className="border-[#FFBF24]/30 bg-gradient-to-b from-[#18181B] to-[#111113] shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <CardTitle className="text-base sm:text-lg text-[#F8FAFC]">
                      AI Location Success Prediction
                    </CardTitle>
                    <Badge variant="success" size="sm">Working Mode</Badge>
                  </div>
                  <CardDescription className="text-xs text-[#A1A1AA]">
                    Enter any business name and site. BizMind mines live Google Places data and generates an instant ML prediction.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/30 px-2.5 py-1 rounded-lg shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Google Places Platform (Live)</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {/* Row 1: Business Name Input + Location Input */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* 1. Business Name / Concept Input */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#FFBF24]" />
                      <span>Business Name / Concept</span>
                    </span>
                    <span className="text-[10px] text-[#71717A] lowercase font-normal">any brand or idea</span>
                  </label>
                  <Input
                    value={businessNameInput}
                    onChange={(e) => setBusinessNameInput(e.target.value)}
                    placeholder="e.g. Starbucks, Specialty Cafe, Pramod Bakery, FitZone Gym..."
                    className="text-xs"
                  />

                  {/* Quick Preset Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-semibold text-[#71717A]">Quick Ideas:</span>
                    {POPULAR_BUSINESS_IDEAS.slice(0, 5).map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => handleSelectBusinessIdea(idea)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                          businessNameInput.toLowerCase() === idea.toLowerCase()
                            ? 'bg-[#FFBF24]/20 border-[#FFBF24] text-[#FFBF24]'
                            : 'bg-[#111113] border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] hover:border-[#3F3F46]'
                        }`}
                      >
                        {idea.split('/')[0].split('&')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Location Input */}
                <div className="md:col-span-6 space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
                      <span>Target Location (City / Locality)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={detectingGps}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFBF24] hover:text-[#F59E0B] transition-colors cursor-pointer"
                    >
                      <Crosshair className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
                      <span>{detectingGps ? 'Locating...' : 'My Location'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      value={targetLocationQuery}
                      onChange={(e) => handleLocationInputChange(e.target.value)}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      placeholder="Search city, area, landmark, or PIN..."
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
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl bg-[#111113] border border-[#27272A] shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
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

                  {/* Quick City Picks */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                    <span className="font-semibold text-[#71717A]">Quick Sites:</span>
                    {POPULAR_LOCATION_PICKS.slice(0, 4).map((pick) => (
                      <button
                        key={pick.name}
                        type="button"
                        onClick={() => handleQuickPickLocation(pick)}
                        className="px-1.5 py-0.5 rounded bg-[#111113] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] hover:border-[#3F3F46] transition-colors cursor-pointer"
                      >
                        {pick.name.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Radius Selector & Run ML Prediction Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#27272A]">
                {/* Radius Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#A1A1AA] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#FFBF24]" /> Radius:
                  </span>
                  <div className="flex items-center gap-1 bg-[#0B0B0C] p-1 rounded-lg border border-[#27272A]">
                    {RADIUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRadiusMeters(opt.value)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          radiusMeters === opt.value
                            ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm'
                            : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Prediction Button */}
                <Button
                  onClick={() => handleAnalyzeOpportunity()}
                  disabled={analyzingLocation}
                  leftIcon={
                    analyzingLocation ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0B0B0C]" />
                    ) : (
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    )
                  }
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#FFBF24] to-[#F59E0B] text-[#0B0B0C] font-extrabold hover:brightness-105 shadow-md shadow-[#FFBF24]/20 cursor-pointer"
                >
                  {analyzingLocation ? 'Computing ML Success Prediction...' : 'Run ML Success Prediction'}
                </Button>
              </div>

              {/* Row 3: Optional Financial Customizer with `>` toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFinancialInputs(!showFinancialInputs)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FFBF24] font-medium transition-colors cursor-pointer group"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>Customize Unit Economics (Optional)</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showFinancialInputs ? 'rotate-90 text-[#FFBF24]' : 'group-hover:translate-x-0.5'
                    }`}
                  />
                  <span className="text-[10px] text-[#71717A]">(Auto-benchmarked by default)</span>
                </button>

                {showFinancialInputs && (
                  <div className="mt-3 p-4 rounded-xl bg-[#0B0B0C] border border-[#27272A] space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                      <span className="text-xs font-bold text-[#F8FAFC]">Financial Modeling Parameters</span>
                      <button
                        type="button"
                        onClick={() => {
                          const bench = getCategoryFinancialBenchmarks(businessNameInput);
                          setFinancialInputs(bench);
                        }}
                        className="text-[11px] font-bold text-[#FFBF24] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset to Industry Benchmarks
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      <div>
                        <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 truncate">
                          Initial Capital (₹/$)
                        </label>
                        <Input
                          type="number"
                          value={financialInputs.initialInvestment || ''}
                          onChange={(e) =>
                            setFinancialInputs({ ...financialInputs, initialInvestment: parseFloat(e.target.value) || 0 })
                          }
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 truncate">
                          Monthly Revenue (₹/$)
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
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 truncate">
                          Fixed Rent/Staff (₹/$)
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
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 truncate">
                          Variable Cost (COGS)
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
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 truncate">
                          Avg Ticket Price
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
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1 truncate">
                          Daily Customers
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
            </CardContent>
          </Card>

          {/* ===================================================================== */}
          {/* RESULTS: WORKING ML PREDICTION EXECUTIVE DASHBOARD                    */}
          {/* ===================================================================== */}
          {locationResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. HERO ML PREDICTION SCORECARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18181B] via-[#141416] to-[#111113] border border-[#FFBF24]/40 shadow-xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Probabilities & Assessment */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        ML Ensemble Active (Working Mode)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-[#FFBF24] text-xs font-mono">
                        {locationResult.businessCategory}
                      </span>
                      <span className="text-xs text-[#A1A1AA]">
                        Site: <strong className="text-[#F8FAFC]">{locationResult.locationName}</strong>
                      </span>
                    </div>

                    <div className="flex items-baseline gap-4 flex-wrap">
                      <div>
                        <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block">
                          Predicted Success Probability
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFBF24] to-[#F59E0B]">
                            {locationResult.predictionAssessment.successProbability ?? 75}%
                          </span>
                          <Badge variant="success" size="sm">
                            {locationResult.predictionAssessment.confidenceScore ?? 88}% Confidence
                          </Badge>
                        </div>
                      </div>

                      <div className="border-l border-[#27272A] pl-4 space-y-1">
                        <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block">Risk Classification</span>
                        <span
                          className={`inline-block font-extrabold font-mono text-sm px-2.5 py-0.5 rounded ${
                            locationResult.predictionAssessment.riskTier === 'LOW'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : locationResult.predictionAssessment.riskTier === 'MODERATE'
                              ? 'bg-amber-500/15 text-[#FFBF24] border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {locationResult.predictionAssessment.riskTier} RISK
                        </span>
                      </div>

                      <div className="border-l border-[#27272A] pl-4 space-y-1">
                        <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block">Feasibility Score</span>
                        <div className="text-sm font-extrabold text-[#F8FAFC]">
                          {locationResult.predictionAssessment.feasibilityAssessment.scoreOutOf100}/100 •{' '}
                          <span className="text-[#FFBF24]">
                            {locationResult.predictionAssessment.feasibilityAssessment.feasibilityGrade}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#A1A1AA] max-w-2xl leading-relaxed">
                      {locationResult.predictionAssessment.modelNotice}
                    </p>
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveAnalysis}
                      disabled={savingPrediction}
                      leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#FFBF24]" />}
                    >
                      {savingPrediction ? 'Saving...' : 'Save Prediction'}
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
                      className="bg-[#FFBF24] text-[#0B0B0C] hover:bg-[#F59E0B]"
                    >
                      Build Full Business Plan
                    </Button>
                  </div>
                </div>

                {saveSuccessNotice && (
                  <div className="mt-3 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveSuccessNotice}</span>
                  </div>
                )}
              </div>

              {/* 2. CORE STAT KPI ROW */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Local Competitors"
                  value={String(locationResult.competitorMetrics.relevantCompetitorCount)}
                  sublabel={`${locationResult.competitorMetrics.competitorDensityPerSqKm}/km² (${locationResult.marketAnalysis.concentrationLevel})`}
                  icon={<Building2 className="w-5 h-5 text-[#38BDF8]" />}
                />
                <StatCard
                  label="Walking Zone (<500m)"
                  value={String(locationResult.competitorMetrics.distanceDistribution.within500m)}
                  sublabel="Pedestrian rivals"
                  icon={<MapPin className="w-5 h-5 text-[#FFBF24]" />}
                />
                <StatCard
                  label="Footfall Clusters"
                  value={String(locationResult.competitorMetrics.relatedBusinessesCount)}
                  sublabel="Synergy establishments"
                  icon={<Store className="w-5 h-5 text-emerald-400" />}
                />
                <StatCard
                  label="Nearest Competitor"
                  value={locationResult.competitorMetrics.nearestCompetitorDistanceFormatted}
                  sublabel={`Avg: ${locationResult.competitorMetrics.averageCompetitorDistanceFormatted}`}
                  icon={<Compass className="w-5 h-5 text-purple-400" />}
                />
              </div>

              {/* 3. INTERACTIVE GOOGLE MAP (LIVE PINS & RADIUS) */}
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FFBF24]" />
                      <span>Interactive Google Map & Spatial Competitor Pins</span>
                    </CardTitle>
                    <span className="text-[11px] font-mono text-[#A1A1AA]">
                      Radius: {(locationResult.radiusMeters / 1000).toFixed(1)} km • Click pin for details
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <GooglePredictionMap
                    center={locationResult.coordinates}
                    radiusMeters={locationResult.radiusMeters}
                    competitors={locationResult.competitorMetrics.competitors}
                    locationName={locationResult.locationName}
                    onLocationSelect={handleMapLocationSelect}
                    selectedCompetitorId={selectedCompetitor?.id}
                    onSelectCompetitor={(comp) => {
                      setSelectedCompetitor(comp);
                      setOpenSections((prev) => ({ ...prev, directory: true }));
                    }}
                    height="420px"
                  />
                </CardContent>
              </Card>

              {/* ================================================================= */}
              {/* 4. EXPANDABLE DETAILS HUB WITH `>` EXPANDERS                      */}
              {/* "when user click then user see that details and make it working"   */}
              {/* ================================================================= */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#FFBF24]" />
                      <span>In-Depth Predictive Analytics & Big Data Breakdown</span>
                    </h3>
                    <p className="text-xs text-[#71717A]">
                      Click any category (<span className="text-[#FFBF24] font-bold">&gt;</span>) to expand detailed competitor dispersion, unit economics, and market gaps.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAllSections(!allSectionsOpen)}
                    className="text-xs font-bold text-[#FFBF24] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {allSectionsOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{allSectionsOpen ? 'Collapse All' : 'Expand All Details'}</span>
                  </button>
                </div>

                {/* ACCORDION ITEM 1: COMPETITOR BIG DATA & DISTANCE DISPERSION */}
                <div className="rounded-xl border border-[#27272A] bg-[#111113] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSection('competitors')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC]">Competitor Big Data & Spatial Dispersion</div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          {locationResult.competitorMetrics.relevantCompetitorCount} rivals within {(locationResult.radiusMeters / 1000).toFixed(1)} km • Nearest: {locationResult.competitorMetrics.nearestCompetitorDistanceFormatted}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#A1A1AA] hidden sm:inline">
                        {openSections.competitors ? 'Hide Details' : 'View Proximity Breakdown'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FFBF24] group-hover:border-[#FFBF24]">
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSections.competitors ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {openSections.competitors && (
                    <div className="p-4 border-t border-[#27272A] bg-[#0E0E10] space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#A1A1AA]">&lt; 500 m (Walking Catchment)</span>
                            <span className="font-bold font-mono text-[#F8FAFC]">
                              {locationResult.competitorMetrics.distanceDistribution.within500m}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                            <div
                              className={`h-full ${
                                locationResult.competitorMetrics.distanceDistribution.within500m === 0
                                  ? 'bg-emerald-400'
                                  : 'bg-rose-400'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  locationResult.competitorMetrics.distanceDistribution.within500m * 30
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-[#71717A]">Immediate pedestrian direct rivals</p>
                        </div>

                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#A1A1AA]">500 m – 1.0 km (Inner Ring)</span>
                            <span className="font-bold font-mono text-[#F8FAFC]">
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
                          <p className="text-[10px] text-[#71717A]">Short drive or 10-min transit zone</p>
                        </div>

                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#A1A1AA]">1.0 km – 2.0 km (Outer Ring)</span>
                            <span className="font-bold font-mono text-[#F8FAFC]">
                              {locationResult.competitorMetrics.distanceDistribution.between1kmAnd2km}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                            <div
                              className="h-full bg-[#38BDF8]"
                              style={{
                                width: `${Math.min(
                                  100,
                                  locationResult.competitorMetrics.distanceDistribution.between1kmAnd2km * 20
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-[#71717A]">Broader catchment commercial cluster</p>
                        </div>
                      </div>

                      {/* Category Breakdown */}
                      <div className="pt-2">
                        <span className="text-xs font-bold text-[#F8FAFC] block mb-2">
                          Observed Nearby Establishments by Category:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(locationResult.competitorMetrics.categoryDistribution).map(([cat, count]) => (
                            <span
                              key={cat}
                              className="px-2.5 py-1 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#A1A1AA] flex items-center gap-1.5"
                            >
                              <span>{cat}</span>
                              <span className="font-mono font-bold text-[#FFBF24]">{count}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION ITEM 2: MARKET OPPORTUNITIES & RISK INDICATORS */}
                <div className="rounded-xl border border-[#27272A] bg-[#111113] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSection('market')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC]">Market Opportunities & Strategic Risk Signals</div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          {locationResult.marketAnalysis.favorableIndicators.length} positive signals • {locationResult.marketAnalysis.potentialChallenges.length} risk challenges
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#A1A1AA] hidden sm:inline">
                        {openSections.market ? 'Hide Details' : 'View Opportunity Signals'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSections.market ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {openSections.market && (
                    <div className="p-4 border-t border-[#27272A] bg-[#0E0E10] space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Favorable */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Favorable Growth Drivers
                          </span>
                          <div className="space-y-1.5">
                            {locationResult.marketAnalysis.favorableIndicators.map((ind, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#F8FAFC]">
                                ✓ {ind}
                              </div>
                            ))}
                            {locationResult.marketAnalysis.observedMarketGaps.map((gap, idx) => (
                              <div key={`gap-${idx}`} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                                ★ Market Whitespace: {gap}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Challenges */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Potential Obstacles & Questions
                          </span>
                          <div className="space-y-1.5">
                            {locationResult.marketAnalysis.potentialChallenges.map((chal, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#F8FAFC]">
                                ⚠ {chal}
                              </div>
                            ))}
                            {locationResult.marketAnalysis.unresolvedQuestions.map((q, idx) => (
                              <div key={`q-${idx}`} className="p-2.5 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-xs text-[#FFBF24]">
                                ? {q}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION ITEM 3: FINANCIAL UNIT ECONOMICS & SCENARIOS */}
                <div className="rounded-xl border border-[#27272A] bg-[#111113] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSection('financials')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-center text-[#FFBF24] shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC]">Financial Unit Economics & Sensitivity Scenarios</div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          Net Margin: {locationResult.financialFeasibility.profitMargin}% • Payback: {locationResult.financialFeasibility.breakEvenPeriodMonths ?? 'N/A'} mo • ROI: {locationResult.financialFeasibility.annualizedRoi ?? 'N/A'}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#A1A1AA] hidden sm:inline">
                        {openSections.financials ? 'Hide Details' : 'View Financial Projections'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSections.financials ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {openSections.financials && (
                    <div className="p-4 border-t border-[#27272A] bg-[#0E0E10] space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] uppercase font-mono block">Estimated Startup Capital</span>
                          <span className="text-base font-bold text-[#F8FAFC]">
                            ₹{locationResult.financialFeasibility.initialInvestment.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] uppercase font-mono block">Expected Monthly Revenue</span>
                          <span className="text-base font-bold text-[#FFBF24]">
                            ₹{locationResult.financialFeasibility.expectedMonthlyRevenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] uppercase font-mono block">Projected Monthly Profit</span>
                          <span className="text-base font-bold text-emerald-400">
                            ₹{locationResult.financialFeasibility.expectedMonthlyProfit.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
                          <span className="text-[10px] text-[#71717A] uppercase font-mono block">Capital Payback Horizon</span>
                          <span className="text-base font-bold text-purple-400">
                            {locationResult.financialFeasibility.breakEvenPeriodMonths ?? 'N/A'} Months
                          </span>
                        </div>
                      </div>

                      {/* 3 Sensitivity Scenarios */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-[#F8FAFC] block">
                          Sensitivity Scenarios (Stress-Tested):
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-[#111113] border border-rose-500/30 space-y-1">
                            <div className="flex justify-between font-bold text-rose-400">
                              <span>Conservative (-20% Rev)</span>
                              <span>{locationResult.financialFeasibility.scenarios.conservative.margin}% Margin</span>
                            </div>
                            <p className="text-[11px] text-[#A1A1AA]">
                              Profit: ₹{locationResult.financialFeasibility.scenarios.conservative.profit.toLocaleString()}/mo
                            </p>
                            <p className="text-[10px] text-[#71717A]">
                              Payback: {locationResult.financialFeasibility.scenarios.conservative.breakEvenMonths ?? 'N/A'} mo
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-[#111113] border border-[#FFBF24]/40 space-y-1">
                            <div className="flex justify-between font-bold text-[#FFBF24]">
                              <span>Base Target</span>
                              <span>{locationResult.financialFeasibility.scenarios.base.margin}% Margin</span>
                            </div>
                            <p className="text-[11px] text-[#A1A1AA]">
                              Profit: ₹{locationResult.financialFeasibility.scenarios.base.profit.toLocaleString()}/mo
                            </p>
                            <p className="text-[10px] text-[#71717A]">
                              Payback: {locationResult.financialFeasibility.scenarios.base.breakEvenMonths ?? 'N/A'} mo
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-[#111113] border border-emerald-500/30 space-y-1">
                            <div className="flex justify-between font-bold text-emerald-400">
                              <span>Optimistic (+20% Rev)</span>
                              <span>{locationResult.financialFeasibility.scenarios.optimistic.margin}% Margin</span>
                            </div>
                            <p className="text-[11px] text-[#A1A1AA]">
                              Profit: ₹{locationResult.financialFeasibility.scenarios.optimistic.profit.toLocaleString()}/mo
                            </p>
                            <p className="text-[10px] text-[#71717A]">
                              Payback: {locationResult.financialFeasibility.scenarios.optimistic.breakEvenMonths ?? 'N/A'} mo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION ITEM 4: ML ENSEMBLE FEATURE WEIGHTS */}
                <div className="rounded-xl border border-[#27272A] bg-[#111113] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSection('mlFeatures')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC]">ML Ensemble Feature Importance & Weights</div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          Explainability of score: Saturation, footfall synergy, margin resilience, and walking buffer
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#A1A1AA] hidden sm:inline">
                        {openSections.mlFeatures ? 'Hide Details' : 'View ML Weights'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSections.mlFeatures ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {openSections.mlFeatures && (
                    <div className="p-4 border-t border-[#27272A] bg-[#0E0E10] space-y-3 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {locationResult.predictionAssessment.feasibilityAssessment.keyFactors.map((fact, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#F8FAFC]">{fact.name}</span>
                              <Badge
                                variant={fact.impact === 'Positive' ? 'success' : fact.impact === 'Neutral' ? 'warning' : 'danger'}
                                size="sm"
                              >
                                {fact.score}/100 • {fact.impact}
                              </Badge>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                              <div
                                className={`h-full ${
                                  fact.impact === 'Positive'
                                    ? 'bg-emerald-400'
                                    : fact.impact === 'Neutral'
                                    ? 'bg-[#FFBF24]'
                                    : 'bg-rose-400'
                                }`}
                                style={{ width: `${fact.score}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{fact.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION ITEM 5: NEARBY COMMERCIAL ESTABLISHMENTS DIRECTORY */}
                <div className="rounded-xl border border-[#27272A] bg-[#111113] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSection('directory')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-center text-[#FFBF24] shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC]">
                          Nearby Commercial Establishments Directory ({locationResult.competitorMetrics.competitors.length} Venues)
                        </div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          Full list of retrieved places from Google Places API (New) live endpoints
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#A1A1AA] hidden sm:inline">
                        {openSections.directory ? 'Hide Details' : 'View Venue Table'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSections.directory ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {openSections.directory && (
                    <div className="p-4 border-t border-[#27272A] bg-[#0E0E10] space-y-3 animate-fadeIn">
                      <div className="overflow-x-auto rounded-xl border border-[#27272A]">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#18181B] text-[#A1A1AA] uppercase font-mono text-[10px] border-b border-[#27272A]">
                            <tr>
                              <th className="p-3">Business Name</th>
                              <th className="p-3">Classification</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Distance</th>
                              <th className="p-3">Address</th>
                              <th className="p-3">Maps</th>
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
                                      Synergy Hub
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
                                    View <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION ITEM 6: ACTION PLAN & RECOMMENDATIONS */}
                <div className="rounded-xl border border-[#27272A] bg-[#111113] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSection('recommendations')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181B] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC]">Strategic Execution Checklist & Recommendations</div>
                        <div className="text-[11px] text-[#A1A1AA]">
                          {locationResult.recommendations.length} tactical action steps based on local competition data
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#A1A1AA] hidden sm:inline">
                        {openSections.recommendations ? 'Hide Details' : 'View Action Steps'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSections.recommendations ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {openSections.recommendations && (
                    <div className="p-4 border-t border-[#27272A] bg-[#0E0E10] space-y-2.5 animate-fadeIn">
                      {locationResult.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#F8FAFC]">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Data Limitations Disclaimer Footer */}
              <div className="p-3 rounded-xl bg-[#0B0B0C] border border-[#27272A] text-[11px] text-[#71717A] space-y-1">
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
              businessIdea={businessNameInput.trim() || 'Business Venture'}
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
      {/* SECTION B: BUSINESS PLAN ENSEMBLE ML MODEL (PRESERVED)                     */}
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
          setBusinessNameInput(saved.business_idea || 'Coffee Shop');
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
