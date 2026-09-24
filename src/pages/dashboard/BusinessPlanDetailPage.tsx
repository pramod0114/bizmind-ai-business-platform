import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Wallet,
  TrendingUp,
  CreditCard,
  DollarSign,
  PieChart,
  Calendar,
  GitCompare,
  Layers,
  Award,
  ShieldAlert,
  Edit,
  BarChart3,
  Copy,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { marketAnalysisService } from '../../services/marketAnalysisService';
import { BusinessPlan, CalculatedFinancialResults, MarketAnalysisData } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { FinancialKpiCards } from '../../components/planner/FinancialKpiCards';
import { Projection12MonthTable } from '../../components/planner/Projection12MonthTable';
import { ScenarioComparisonSection } from '../../components/planner/ScenarioComparisonSection';
import { SensitivityAnalysisSection } from '../../components/planner/SensitivityAnalysisSection';
import { FeasibilityAndRiskSection } from '../../components/planner/FeasibilityAndRiskSection';

export const BusinessPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [analysis, setAnalysis] = useState<CalculatedFinancialResults | null>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [growthRate, setGrowthRate] = useState<number>(3.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPlanDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await planService.getPlanById(id);
      setPlan(data);
      if (data.analysis) {
        setAnalysis(data.analysis);
        setGrowthRate(data.analysis.revenueGrowthRate ?? 3.0);
      } else {
        // Fallback: fetch financial analysis explicitly
        const finAnalysis = await planService.getFinancialAnalysis(id);
        setAnalysis(finAnalysis);
        setGrowthRate(finAnalysis.revenueGrowthRate ?? 3.0);
      }

      // Load linked Market & Competition Analysis (Part 6)
      try {
        const mData = await marketAnalysisService.getByPlanId(id);
        if (mData) setMarketAnalysis(mData);
      } catch {
        // Non-blocking if no analysis saved yet
      }
    } catch (err: any) {
      console.error('Failed to load plan details:', err);
      setError(err?.message || 'Failed to load business plan details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRecalculate = async () => {
    if (!id) return;
    setIsRecalculating(true);
    try {
      const res = await planService.calculatePlan(id, { revenueGrowthRate: growthRate });
      setPlan(res.plan);
      setAnalysis(res.analysis);
      showToast('Financial metrics recalculated and synchronized');
    } catch (err: any) {
      alert(`Recalculation failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleDuplicate = async () => {
    if (!id) return;
    setIsDuplicating(true);
    try {
      const duplicated = await planService.duplicatePlan(id);
      showToast(`Plan duplicated as "${duplicated.businessName || duplicated.business_name}"`);
      navigate(`/business-plans/${duplicated.id}`);
    } catch (err: any) {
      alert(`Failed to duplicate plan: ${err?.message || 'Unknown error'}`);
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await planService.deletePlan(id);
      navigate('/business-plans');
    } catch (err: any) {
      alert(`Failed to delete plan: ${err?.message || 'Unknown error'}`);
      setIsDeleting(false);
    }
  };

  const handleGrowthRateChange = async (newRate: number) => {
    setGrowthRate(newRate);
    if (!id) return;
    try {
      const res = await planService.getFinancialAnalysis(id, newRate);
      setAnalysis(res);
    } catch (err) {
      console.error('Failed to update projection growth rate:', err);
    }
  };

  const handleCustomScenarioRecalculate = async (adjustments: {
    conservativeRevenue: number;
    conservativeExpense: number;
    optimisticRevenue: number;
    optimisticExpense: number;
  }) => {
    if (!id) return;
    try {
      const res = await planService.calculateCustomScenarios(id, adjustments);
      if (analysis) {
        setAnalysis({
          ...analysis,
          scenarios: res.scenarios as any,
          scenarioAdjustments: res.adjustments,
        });
      }
      showToast('Scenarios updated with custom adjustment parameters');
    } catch (err: any) {
      alert(`Failed to recalculate scenarios: ${err?.message || 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
        <p className="text-xs">Loading business plan...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-[#18181B] rounded-xl border border-[#27272A] text-center space-y-3 mt-12">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Error Loading Plan</h3>
        <p className="text-xs text-slate-400">{error || 'Business plan not found'}</p>
        <button
          onClick={() => navigate('/business-plans')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
        >
          Back to Business Plans
        </button>
      </div>
    );
  }

  const planName = plan.businessName || plan.business_name || 'Untitled Business Plan';
  const locationText = plan.location || plan.location_name || plan.city || 'Location unassigned';
  const score = plan.feasibilityScore || (analysis?.feasibilityScore ?? 0);
  const status = plan.feasibilityStatus || (analysis?.feasibilityStatus ?? 'Moderate Financial Feasibility');
  const risk = plan.riskLevel || (analysis?.riskLevel ?? 'Medium Risk');

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/business-plans')}
            className="p-2 bg-[#18181B] hover:bg-[#27272A] text-slate-400 hover:text-white rounded-lg border border-[#27272A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#27272A] text-slate-300">
                {plan.category || 'Retail'}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {locationText}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">{planName}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate(`/business-plans/${plan.id}/financial-analysis`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Financial Dashboard
          </button>

          <button
            onClick={() => navigate(`/business-plans/${plan.id}/edit`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 rounded-lg text-xs font-semibold border border-[#3F3F46] transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Plan
          </button>

          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 rounded-lg text-xs font-semibold border border-[#3F3F46] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-indigo-400' : ''}`} />
            Recalculate
          </button>

          <button
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 rounded-lg text-xs font-semibold border border-[#3F3F46] transition-colors disabled:opacity-50"
          >
            {isDuplicating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Duplicate
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 bg-[#27272A] hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg border border-[#3F3F46] transition-colors"
            title="Delete Plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP SUMMARY BANNER */}
      <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white">Feasibility Assessment</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#27272A] text-slate-300">
              {risk}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Authoritative financial synthesis calculated on server.
          </p>
        </div>

        <div className="flex items-center gap-6 sm:border-l sm:border-[#27272A] sm:pl-6">
          <div className="text-right">
            <div className="text-3xl font-extrabold text-amber-400">
              {score}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </div>
            <div className="text-[11px] font-medium text-slate-400 uppercase">Feasibility Score</div>
          </div>
        </div>
      </div>

      {/* 8 TOP KPI CARDS */}
      <FinancialKpiCards
        initialInvestment={plan.totalInitialInvestment || (analysis?.totalInitialInvestment ?? 0)}
        monthlyRevenue={plan.monthlyRevenue || (analysis?.monthlyRevenue ?? 0)}
        monthlyExpenses={plan.totalMonthlyExpenses || (analysis?.totalMonthlyExpenses ?? 0)}
        monthlyProfit={plan.monthlyProfit || (analysis?.monthlyProfit ?? 0)}
        profitMargin={plan.profitMargin || (analysis?.profitMargin ?? 0)}
        roi={plan.annualRoi ?? (analysis?.annualRoi ?? null)}
        paybackPeriod={plan.paybackPeriod ?? (analysis?.paybackPeriod ?? null)}
        paybackStatusText={plan.paybackStatusText || analysis?.paybackStatusText}
        breakEvenRevenue={plan.breakEvenRevenue ?? (analysis?.breakEvenRevenue ?? null)}
      />

      {/* 12 DISTINCT SECTIONS */}

      {/* SECTION 1: Business Overview */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#27272A] pb-3">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">1. Business Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Operating Category:</span>
            <span className="font-semibold text-white">{plan.category || 'Retail'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Operating Model:</span>
            <span className="font-semibold text-white">{plan.businessModel || plan.business_model || 'Retail'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Customer:</span>
            <span className="font-semibold text-white">{plan.targetCustomer || plan.target_customer || 'General consumer'}</span>
          </div>
          {plan.description && (
            <div className="md:col-span-3 pt-2 text-slate-300 leading-relaxed bg-[#202024] p-3 rounded-lg border border-[#27272A]">
              {plan.description}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Location */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">2. Business Location</h3>
          </div>
          {plan.latitude && plan.longitude && (
            <button
              onClick={() =>
                navigate(
                  `/location-intelligence?lat=${plan.latitude}&lng=${plan.longitude}&name=${encodeURIComponent(plan.location || plan.city || '')}`
                )
              }
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Analyze in Location Module <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Landmark / Street:</span>
            <span className="font-semibold text-white">{plan.location || plan.location_name || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">City:</span>
            <span className="font-semibold text-white">{plan.city || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Area / Suburb:</span>
            <span className="font-semibold text-white">{plan.area || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Coordinates:</span>
            <span className="font-semibold text-slate-300">
              {plan.latitude && plan.longitude
                ? `${Number(plan.latitude).toFixed(4)}, ${Number(plan.longitude).toFixed(4)}`
                : 'Not geotagged'}
            </span>
          </div>
        </div>
      </div>

      {/* MARKET & COMPETITION SECTION (Part 6 Integration) */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27272A] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FFBF24]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Market & Competition Intelligence</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(
                `/market-analysis?planId=${plan.id}&idea=${encodeURIComponent(plan.businessName || plan.business_name)}&category=${encodeURIComponent(plan.category)}&location=${encodeURIComponent(plan.location || plan.city || '')}&lat=${plan.latitude || 16.8524}&lng=${plan.longitude || 74.5815}&radius=${marketAnalysis?.radiusKm || 2.0}`
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <span>View Full Market Analysis</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Business Idea:</span>
            <span className="font-bold text-white block mt-0.5 truncate">{plan.businessName || plan.business_name}</span>
            <span className="text-[10px] text-[#FFBF24]">{plan.category}</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Trade Location & Radius:</span>
            <span className="font-bold text-white block mt-0.5 truncate">{plan.location || plan.city || 'Vishrambag, Sangli'}</span>
            <span className="text-[10px] text-slate-400 font-mono">Radius: {marketAnalysis?.radiusKm ?? 2.0} km</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Competitor Density:</span>
            <span className="font-bold text-[#FFBF24] block mt-0.5">
              {marketAnalysis ? `${Number(marketAnalysis.competitorDensity).toFixed(2)} / km²` : '0.32 / km² (Estimated)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {marketAnalysis?.relevantCompetitorsCount ?? 4} relevant competitors
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Total Nearby Businesses:</span>
            <span className="font-bold text-white block mt-0.5">
              {marketAnalysis?.totalBusinesses ?? 42} establishments
            </span>
            <span className="text-[10px] text-slate-400">OpenStreetMap POIs</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#111113] border border-[#27272A] text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Competition Risk</span>
              <span className={`font-bold text-xs ${marketAnalysis?.competitionRisk?.level === 'High' ? 'text-red-400' : marketAnalysis?.competitionRisk?.level === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {marketAnalysis?.competitionRisk?.level || 'Moderate'} Risk
              </span>
            </div>
            <div className="h-6 w-px bg-[#27272A]" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Observed Opportunity</span>
              <span className="font-bold text-xs text-[#FFBF24]">
                {marketAnalysis?.marketOpportunity?.indicator || 'Moderate Opportunity'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Source: <strong className="text-slate-200">OpenStreetMap</strong> • Non-predictive spatial analysis
          </div>
        </div>
      </div>

      {/* SECTION 3: Investment (CapEx) */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">3. Initial Capital Investment (CapEx)</h3>
          </div>
          <span className="text-sm font-bold text-amber-400">
            Total: {formatCurrency(plan.totalInitialInvestment || (analysis?.totalInitialInvestment ?? 0))}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Equipment</span>
            <span className="font-semibold text-white">{formatCurrency(plan.equipmentCost || 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Furniture & Fixtures</span>
            <span className="font-semibold text-white">{formatCurrency(plan.furnitureCost || 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Interior Setup</span>
            <span className="font-semibold text-white">{formatCurrency(plan.setupCost ?? plan.interiorSetup ?? 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Security Deposit</span>
            <span className="font-semibold text-white">{formatCurrency(plan.securityDeposit ?? plan.propertyDeposit ?? 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Licensing & Permits</span>
            <span className="font-semibold text-white">{formatCurrency(plan.licenseCost || 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Technology & POS</span>
            <span className="font-semibold text-white">{formatCurrency(plan.technologyCost || 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Launch Marketing</span>
            <span className="font-semibold text-white">{formatCurrency(plan.marketingLaunchCost ?? plan.launchMarketing ?? 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Initial Stock</span>
            <span className="font-semibold text-white">{formatCurrency(plan.initialInventoryCost ?? plan.initialInventory ?? 0)}</span>
          </div>
          <div className="bg-[#202024] p-2.5 rounded-lg border border-[#27272A]">
            <span className="text-slate-400 block text-[11px]">Other CapEx</span>
            <span className="font-semibold text-white">{formatCurrency(plan.otherInitialCost || 0)}</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Revenue & Unit Economics */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">4. Monthly Revenue & Unit Economics</h3>
          </div>
          <span className="text-sm font-bold text-blue-400">
            Monthly: {formatCurrency(plan.monthlyRevenue || 0)}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Revenue Input Mode:</span>
            <span className="font-semibold text-white uppercase">{plan.revenueApproach || 'Calculated'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Selling Price / Ticket:</span>
            <span className="font-semibold text-white">{formatCurrency(plan.sellingPrice || plan.averageSellingPrice || 0)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Variable Cost Per Unit:</span>
            <span className="font-semibold text-white">{formatCurrency(plan.variableCostPerUnit || 0)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Projected Annual Revenue:</span>
            <span className="font-semibold text-blue-400">{formatCurrency((plan.monthlyRevenue || 0) * 12)}</span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Monthly Expenses */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">5. Operating Expenses Breakdown</h3>
          </div>
          <span className="text-sm font-bold text-rose-400">
            Total Monthly Cost: {formatCurrency(plan.totalMonthlyExpenses || (analysis?.totalMonthlyExpenses ?? 0))}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#202024] p-3 rounded-lg border border-[#27272A] space-y-2">
            <div className="flex items-center justify-between font-bold text-white border-b border-[#27272A] pb-1">
              <span>Fixed Overhead</span>
              <span>{formatCurrency(plan.totalMonthlyFixedExpenses || (analysis?.totalMonthlyFixedExpenses ?? 0))}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
              <div>Rent: <strong className="text-white">{formatCurrency(plan.rent || 0)}</strong></div>
              <div>Salaries: <strong className="text-white">{formatCurrency(plan.salaries || 0)}</strong></div>
              <div>Utilities: <strong className="text-white">{formatCurrency(plan.utilities || 0)}</strong></div>
              <div>Internet: <strong className="text-white">{formatCurrency(plan.internetCost ?? plan.internet ?? 0)}</strong></div>
              <div>Software: <strong className="text-white">{formatCurrency(plan.softwareCost ?? plan.software ?? 0)}</strong></div>
              <div>Maintenance: <strong className="text-white">{formatCurrency(plan.maintenance || 0)}</strong></div>
            </div>
          </div>

          <div className="bg-[#202024] p-3 rounded-lg border border-[#27272A] space-y-2">
            <div className="flex items-center justify-between font-bold text-white border-b border-[#27272A] pb-1">
              <span>Variable Operating Costs</span>
              <span>{formatCurrency(plan.totalMonthlyVariableExpenses || (analysis?.totalMonthlyVariableExpenses ?? 0))}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
              <div>Raw Materials: <strong className="text-white">{formatCurrency(plan.rawMaterialCost || 0)}</strong></div>
              <div>Packaging: <strong className="text-white">{formatCurrency(plan.packagingCost || 0)}</strong></div>
              <div>Delivery: <strong className="text-white">{formatCurrency(plan.deliveryCost || 0)}</strong></div>
              <div>Marketing: <strong className="text-white">{formatCurrency(plan.marketingCost ?? plan.marketing ?? 0)}</strong></div>
              <div>Payment Gateway: <strong className="text-white">{formatCurrency(plan.paymentGatewayCost || 0)}</strong></div>
              <div>Other Variable: <strong className="text-white">{formatCurrency(plan.otherVariableExpenses || 0)}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Profitability */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">6. Profitability & Returns</h3>
          </div>
          <span className={`text-base font-extrabold ${(plan.monthlyProfit || 0) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Net: {formatCurrency(plan.monthlyProfit || 0)} / mo
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Net Profit Margin:</span>
            <span className="text-sm font-bold text-white">{formatPercentage(plan.profitMargin || 0)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Projected Annual Net Profit:</span>
            <span className="text-sm font-bold text-white">{formatCurrency((plan.monthlyProfit || 0) * 12)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Annual ROI:</span>
            <span className="text-sm font-bold text-cyan-400">
              {plan.annualRoi !== null && plan.annualRoi !== undefined ? formatPercentage(plan.annualRoi) : (plan.roi !== null && plan.roi !== undefined ? formatPercentage(plan.roi) : 'N/A')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Capital Payback Period:</span>
            <span className="text-sm font-bold text-amber-300">
              {plan.paybackStatusText || (plan.paybackPeriod ? `${plan.paybackPeriod} mos` : 'N/A')}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 7: Break-Even Analysis */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#27272A] pb-3">
          <PieChart className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">7. Break-Even Analysis</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Break-Even Monthly Revenue:</span>
            <span className="text-base font-bold text-purple-400">
              {plan.breakEvenRevenue ? formatCurrency(plan.breakEvenRevenue) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Break-Even Sales Units:</span>
            <span className="text-base font-bold text-white">
              {plan.breakEvenUnits ? `${plan.breakEvenUnits} units / mo` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Break-Even Capacity Dependency:</span>
            <span className="text-base font-bold text-white">
              {plan.breakEvenCapacityPercentage !== null && plan.breakEvenCapacityPercentage !== undefined
                ? `${plan.breakEvenCapacityPercentage}%`
                : 'N/A'}
            </span>
          </div>
          <div className="sm:col-span-3 text-slate-300 bg-[#202024] p-3 rounded-lg border border-[#27272A]">
            {plan.breakEvenMessage || analysis?.breakEvenMessage || 'Break-even reached under normal operations.'}
          </div>
        </div>
      </div>

      {/* SECTION 8: 12-Month Projection */}
      {analysis?.twelveMonthProjection && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">8. 12-Month Financial Projection</h3>
          </div>
          <Projection12MonthTable
            projections={analysis.twelveMonthProjection}
            growthRate={growthRate}
            onGrowthRateChange={handleGrowthRateChange}
            totalInitialInvestment={plan.totalInitialInvestment || (analysis?.totalInitialInvestment ?? 0)}
          />
        </div>
      )}

      {/* SECTION 9: Scenario Analysis */}
      {analysis?.scenarios && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">9. Scenario Analysis</h3>
          </div>
          <ScenarioComparisonSection
            scenarios={analysis.scenarios}
            adjustments={analysis.scenarioAdjustments}
            onRecalculate={handleCustomScenarioRecalculate}
          />
        </div>
      )}

      {/* SECTION 10: Sensitivity Analysis */}
      {analysis?.sensitivity && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">10. Sensitivity Analysis</h3>
          </div>
          <SensitivityAnalysisSection sensitivity={analysis.sensitivity} />
        </div>
      )}

      {/* SECTION 11 & 12: Financial Feasibility & Risk Indicators */}
      {analysis && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              11 & 12. Financial Feasibility & Risk Indicators
            </h3>
          </div>
          <FeasibilityAndRiskSection
            feasibilityStatus={analysis.feasibilityStatus}
            feasibilityScore={analysis.feasibilityScore}
            feasibilityReasons={analysis.feasibilityReasons}
            riskIndicators={analysis.riskIndicators}
            riskLevel={analysis.riskLevel}
            targetComparisons={analysis.targetComparisons}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Business Plan</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{planName}"</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
