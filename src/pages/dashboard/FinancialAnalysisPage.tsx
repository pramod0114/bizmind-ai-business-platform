import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  RefreshCw,
  ArrowLeft,
  Loader2,
  Calendar,
  Layers,
  GitCompare,
  Award,
  AlertCircle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { BusinessPlan, CalculatedFinancialResults } from '../../types';
import { FinancialKpiCards } from '../../components/planner/FinancialKpiCards';
import { FinancialCharts } from '../../components/planner/FinancialCharts';
import { Projection12MonthTable } from '../../components/planner/Projection12MonthTable';
import { ScenarioComparisonSection } from '../../components/planner/ScenarioComparisonSection';
import { SensitivityAnalysisSection } from '../../components/planner/SensitivityAnalysisSection';
import { FeasibilityAndRiskSection } from '../../components/planner/FeasibilityAndRiskSection';

export const FinancialAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [allPlans, setAllPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | number>(id || '');
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [analysis, setAnalysis] = useState<CalculatedFinancialResults | null>(null);
  const [growthRate, setGrowthRate] = useState<number>(3.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load all user's plans for the top plan-switcher selector
  useEffect(() => {
    planService.getPlans()
      .then((data) => {
        setAllPlans(data || []);
        if (!selectedPlanId && data.length > 0) {
          setSelectedPlanId(data[0].id);
        }
      })
      .catch((err) => console.error('Failed to load plans list:', err));
  }, []);

  // Whenever selectedPlanId changes, load its deep financial analysis
  useEffect(() => {
    if (!selectedPlanId) return;

    setIsLoading(true);
    setError(null);

    Promise.all([
      planService.getPlanById(selectedPlanId),
      planService.getFinancialAnalysis(selectedPlanId, growthRate),
    ])
      .then(([planData, analysisData]) => {
        setPlan(planData);
        setAnalysis(analysisData);
        if (analysisData.revenueGrowthRate !== undefined) {
          setGrowthRate(analysisData.revenueGrowthRate);
        }
      })
      .catch((err: any) => {
        console.error('Failed to load financial analysis:', err);
        setError(err?.message || 'Failed to load financial analysis data');
      })
      .finally(() => setIsLoading(false));
  }, [selectedPlanId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePlanChange = (newPlanId: string) => {
    setSelectedPlanId(newPlanId);
    navigate(`/business-plans/${newPlanId}/financial-analysis`, { replace: true });
  };

  const handleRecalculate = async () => {
    if (!selectedPlanId) return;
    setIsRecalculating(true);
    try {
      const res = await planService.calculatePlan(selectedPlanId, { revenueGrowthRate: growthRate });
      setPlan(res.plan);
      setAnalysis(res.analysis);
      showToast('All financial projections & metrics successfully recalculated');
    } catch (err: any) {
      alert(`Recalculation error: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleGrowthRateChange = async (newRate: number) => {
    setGrowthRate(newRate);
    if (!selectedPlanId) return;
    try {
      const res = await planService.getFinancialAnalysis(selectedPlanId, newRate);
      setAnalysis(res);
    } catch (err) {
      console.error('Failed to update projection with new growth rate:', err);
    }
  };

  const handleCustomScenarioRecalculate = async (adjustments: {
    conservativeRevenue: number;
    conservativeExpense: number;
    optimisticRevenue: number;
    optimisticExpense: number;
  }) => {
    if (!selectedPlanId) return;
    try {
      const res = await planService.calculateCustomScenarios(selectedPlanId, adjustments);
      if (analysis) {
        setAnalysis({
          ...analysis,
          scenarios: res.scenarios as any,
          scenarioAdjustments: res.adjustments,
        });
      }
      showToast('Scenarios customized and updated');
    } catch (err: any) {
      alert(`Custom scenario failed: ${err?.message || 'Unknown error'}`);
    }
  };

  if (isLoading && !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
        <p className="text-xs">Computing financial viability model...</p>
      </div>
    );
  }

  if (error || !plan || !analysis) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-[#18181B] rounded-xl border border-[#27272A] text-center space-y-3 mt-12">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Financial Analysis Error</h3>
        <p className="text-xs text-slate-400">{error || 'Could not load analysis for this business plan.'}</p>
        <button
          onClick={() => navigate('/business-plans')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
        >
          Return to Business Plans
        </button>
      </div>
    );
  }

  const planName = plan.businessName || plan.business_name || 'Untitled Business Plan';

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/business-plans/${plan.id}`)}
            className="p-2 bg-[#18181B] hover:bg-[#27272A] text-slate-400 hover:text-white rounded-lg border border-[#27272A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" />
                Financial Feasibility & Projections
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">{planName}</h1>
          </div>
        </div>

        {/* Plan Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {allPlans.length > 1 && (
            <div className="flex items-center gap-2 bg-[#18181B] px-3 py-1.5 rounded-lg border border-[#27272A]">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedPlanId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                {allPlans.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#18181B] text-white">
                    {p.businessName || p.business_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            Recalculate All
          </button>
        </div>
      </div>

      {/* High-Level KPI Cards */}
      <FinancialKpiCards
        initialInvestment={analysis.totalInitialInvestment}
        monthlyRevenue={analysis.monthlyRevenue}
        monthlyExpenses={analysis.totalMonthlyExpenses}
        monthlyProfit={analysis.monthlyProfit}
        profitMargin={analysis.profitMargin}
        roi={analysis.annualRoi}
        paybackPeriod={analysis.paybackPeriod}
        paybackStatusText={analysis.paybackStatusText}
        breakEvenRevenue={analysis.breakEvenRevenue}
      />

      {/* Interactive Visual Charts (Cash Flow Projections, Break-Even, and Cost Structure) */}
      <FinancialCharts analysis={analysis} />

      {/* 12-Month Detailed Cash Flow & Revenue Projection Table with Growth Rate Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">12-Month Financial Trajectory</h2>
        </div>
        <Projection12MonthTable
          projections={analysis.twelveMonthProjection}
          growthRate={growthRate}
          onGrowthRateChange={handleGrowthRateChange}
          totalInitialInvestment={analysis.totalInitialInvestment}
        />
      </div>

      {/* Scenario Stress-Testing (Conservative vs Expected vs Optimistic) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Scenario Comparison (Stress Testing)</h2>
        </div>
        <ScenarioComparisonSection
          scenarios={analysis.scenarios}
          adjustments={analysis.scenarioAdjustments}
          onRecalculate={handleCustomScenarioRecalculate}
        />
      </div>

      {/* Sensitivity Analysis (±20% variations in Revenue, Costs, and CapEx) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Operating Sensitivity Matrix</h2>
        </div>
        <SensitivityAnalysisSection sensitivity={analysis.sensitivity} />
      </div>

      {/* Feasibility Assessment Score, Rule-Based Drivers & Identified Risk Flags */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Feasibility Scorecard & Risk Factors</h2>
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
    </div>
  );
};
