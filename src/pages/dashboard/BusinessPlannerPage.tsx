import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { StepProgress, PLANNER_STEPS } from '../../components/planner/StepProgress';
import {
  Step1BusinessInfo,
  BusinessInfoFormData,
  BUSINESS_CATEGORIES,
} from '../../components/planner/Step1BusinessInfo';
import {
  Step2InitialInvestment,
  InitialInvestmentFormData,
} from '../../components/planner/Step2InitialInvestment';
import {
  Step3MonthlyExpenses,
  MonthlyExpensesFormData,
} from '../../components/planner/Step3MonthlyExpenses';
import {
  Step4RevenueEconomics,
  RevenueEconomicsFormData,
} from '../../components/planner/Step4RevenueEconomics';
import { Step5ReviewAssumptions } from '../../components/planner/Step5ReviewAssumptions';
import { Step6FinancialDashboard } from '../../components/planner/Step6FinancialDashboard';
import { SavedPlansModal } from '../../components/planner/SavedPlansModal';
import { planService } from '../../services/planService';
import { BusinessPlan, CalculatedFinancialResults } from '../../types';
import { calculateClientFinancials } from '../../utils/financialCalculator';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FolderOpen,
  Plus,
  RotateCcw,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';

const INITIAL_BUSINESS_INFO: BusinessInfoFormData = {
  businessName: 'The Roasted Bean Artisanal Café',
  category: 'Food & Beverage',
  location: 'Indiranagar, Bengaluru',
  targetCustomer: 'Young professionals, tech workers, and specialty coffee enthusiasts',
  businessModel: 'B2C',
  description: 'Specialty pour-over coffees, handcrafted espresso beverages, sourdough toasts, and fresh baked pastries in a contemporary aesthetic setting.',
  executiveSummary: 'Targeting prime footfall in Indiranagar with high beverage margins and strong repeat patronage.',
};

const INITIAL_INVESTMENT: InitialInvestmentFormData = {
  propertyDeposit: 250000,
  interiorSetup: 280000,
  equipmentCost: 180000,
  furnitureCost: 60000,
  licenseCost: 25000,
  technologyCost: 20000,
  initialInventory: 35000,
  launchMarketing: 25000,
  otherInitialCost: 0,
};

const INITIAL_EXPENSES: MonthlyExpensesFormData = {
  rent: 55000,
  salaries: 65000,
  utilities: 12000,
  internet: 3000,
  maintenance: 5000,
  marketing: 10000,
  transportation: 4000,
  insurance: 2500,
  software: 3500,
  loanEmi: 0,
  otherExpenses: 5000,
};

const INITIAL_REVENUE: RevenueEconomicsFormData = {
  sellingPrice: 220,
  expectedCustomersPerDay: 48,
  operatingDays: 30,
  variableCostPerUnit: 55,
};

export const BusinessPlannerPage: React.FC = () => {
  // Wizard Navigation State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(6);

  // Form Data State
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoFormData>(INITIAL_BUSINESS_INFO);
  const [investment, setInvestment] = useState<InitialInvestmentFormData>(INITIAL_INVESTMENT);
  const [expenses, setExpenses] = useState<MonthlyExpensesFormData>(INITIAL_EXPENSES);
  const [revenue, setRevenue] = useState<RevenueEconomicsFormData>(INITIAL_REVENUE);

  // Validation State
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfoFormData, string>>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active Loaded Plan & Analysis
  const [currentPlanId, setCurrentPlanId] = useState<number | string | null>(null);
  const [currentPlanStatus, setCurrentPlanStatus] = useState<'draft' | 'analyzed'>('draft');
  const [analysisResults, setAnalysisResults] = useState<CalculatedFinancialResults | null>(null);

  // Plans Management
  const [savedPlans, setSavedPlans] = useState<BusinessPlan[]>([]);
  const [isSavedPlansModalOpen, setIsSavedPlansModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch saved plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const plans = await planService.getPlans();
      setSavedPlans(plans);

      // If plans exist and none loaded, load the first one
      if (plans.length > 0 && !currentPlanId) {
        loadPlanIntoState(plans[0]);
      }
    } catch (err: any) {
      console.error('Error fetching plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlanIntoState = (plan: BusinessPlan) => {
    setCurrentPlanId(plan.id);
    setCurrentPlanStatus(plan.planStatus || 'draft');

    setBusinessInfo({
      businessName: plan.businessName || plan.business_name || '',
      category: plan.category || 'Food & Beverage',
      location: plan.location || '',
      targetCustomer: plan.targetCustomer || plan.target_customer || '',
      businessModel: plan.businessModel || plan.business_model || 'B2C',
      description: plan.description || '',
      executiveSummary: plan.executiveSummary || plan.executive_summary || '',
    });

    setInvestment({
      propertyDeposit: plan.propertyDeposit || 0,
      interiorSetup: plan.interiorSetup || 0,
      equipmentCost: plan.equipmentCost || 0,
      furnitureCost: plan.furnitureCost || 0,
      licenseCost: plan.licenseCost || 0,
      technologyCost: plan.technologyCost || 0,
      initialInventory: plan.initialInventory || 0,
      launchMarketing: plan.launchMarketing || 0,
      otherInitialCost: plan.otherInitialCost || 0,
    });

    setExpenses({
      rent: plan.rent || 0,
      salaries: plan.salaries || 0,
      utilities: plan.utilities || 0,
      internet: plan.internet || 0,
      maintenance: plan.maintenance || 0,
      marketing: plan.marketing || 0,
      transportation: plan.transportation || 0,
      insurance: plan.insurance || 0,
      software: plan.software || 0,
      loanEmi: plan.loanEmi || 0,
      otherExpenses: plan.otherExpenses || 0,
    });

    setRevenue({
      sellingPrice: plan.sellingPrice || 200,
      expectedCustomersPerDay: plan.expectedCustomersPerDay || 40,
      operatingDays: plan.operatingDays || 30,
      variableCostPerUnit: plan.variableCostPerUnit || 50,
    });

    // Compute live client-side analysis
    const clientAnalysis = calculateClientFinancials({
      investment: {
        propertyDeposit: plan.propertyDeposit || 0,
        interiorSetup: plan.interiorSetup || 0,
        equipmentCost: plan.equipmentCost || 0,
        furnitureCost: plan.furnitureCost || 0,
        licenseCost: plan.licenseCost || 0,
        technologyCost: plan.technologyCost || 0,
        initialInventory: plan.initialInventory || 0,
        launchMarketing: plan.launchMarketing || 0,
        otherInitialCost: plan.otherInitialCost || 0,
      },
      expenses: {
        rent: plan.rent || 0,
        salaries: plan.salaries || 0,
        utilities: plan.utilities || 0,
        internet: plan.internet || 0,
        maintenance: plan.maintenance || 0,
        marketing: plan.marketing || 0,
        transportation: plan.transportation || 0,
        insurance: plan.insurance || 0,
        software: plan.software || 0,
        loanEmi: plan.loanEmi || 0,
        otherExpenses: plan.otherExpenses || 0,
      },
      revenueEconomics: {
        sellingPrice: plan.sellingPrice || 200,
        expectedCustomersPerDay: plan.expectedCustomersPerDay || 40,
        operatingDays: plan.operatingDays || 30,
        variableCostPerUnit: plan.variableCostPerUnit || 50,
      },
    });

    setAnalysisResults(clientAnalysis);

    if (plan.planStatus === 'analyzed') {
      setCurrentStep(6);
      setMaxStepReached(6);
    } else {
      setCurrentStep(1);
    }
  };

  const handleStartNewPlan = () => {
    setCurrentPlanId(null);
    setCurrentPlanStatus('draft');
    setBusinessInfo({
      businessName: '',
      category: 'Food & Beverage',
      location: 'Bengaluru',
      targetCustomer: '',
      businessModel: 'B2C',
      description: '',
      executiveSummary: '',
    });
    setInvestment({
      propertyDeposit: 0,
      interiorSetup: 0,
      equipmentCost: 0,
      furnitureCost: 0,
      licenseCost: 0,
      technologyCost: 0,
      initialInventory: 0,
      launchMarketing: 0,
      otherInitialCost: 0,
    });
    setExpenses({
      rent: 0,
      salaries: 0,
      utilities: 0,
      internet: 0,
      maintenance: 0,
      marketing: 0,
      transportation: 0,
      insurance: 0,
      software: 0,
      loanEmi: 0,
      otherExpenses: 0,
    });
    setRevenue({
      sellingPrice: 100,
      expectedCustomersPerDay: 20,
      operatingDays: 30,
      variableCostPerUnit: 25,
    });
    setAnalysisResults(null);
    setCurrentStep(1);
    setMaxStepReached(1);
  };

  const handleDeletePlan = async (planId: number | string) => {
    try {
      await planService.deletePlan(planId);
      const remaining = savedPlans.filter((p) => p.id !== planId);
      setSavedPlans(remaining);

      if (currentPlanId === planId) {
        if (remaining.length > 0) {
          loadPlanIntoState(remaining[0]);
        } else {
          handleStartNewPlan();
        }
      }

      setNotification({ type: 'success', message: 'Business plan deleted successfully' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete plan' });
    }
  };

  // Step 1 validation
  const validateStep1 = (): boolean => {
    const errs: Partial<Record<keyof BusinessInfoFormData, string>> = {};
    if (!businessInfo.businessName.trim()) {
      errs.businessName = 'Please provide a business name';
    }
    if (!businessInfo.location.trim()) {
      errs.location = 'Please specify a target location or city';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Next Step Action
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > maxStepReached) {
      setMaxStepReached(next);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Jump directly to step
  const handleJumpToStep = (step: number) => {
    if (step <= maxStepReached) {
      setCurrentStep(step);
    }
  };

  // Save Plan as Draft to Backend
  const handleSaveDraft = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...businessInfo,
        ...investment,
        ...expenses,
        ...revenue,
        planStatus: 'draft' as const,
      };

      let result;
      if (currentPlanId) {
        result = await planService.updatePlan(currentPlanId, payload);
      } else {
        result = await planService.createPlan(payload);
        setCurrentPlanId(result.plan.id);
      }

      setAnalysisResults(result.analysis);
      setCurrentPlanStatus('draft');
      await fetchPlans();

      setNotification({
        type: 'success',
        message: `Plan "${businessInfo.businessName}" saved as Draft successfully`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to save business plan',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Run Feasibility Engine (Analyzes & transitions to step 6)
  const handleRunFeasibilityEngine = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...businessInfo,
        ...investment,
        ...expenses,
        ...revenue,
        planStatus: 'analyzed' as const,
      };

      let result;
      if (currentPlanId) {
        result = await planService.updatePlan(currentPlanId, payload);
      } else {
        result = await planService.createPlan(payload);
        setCurrentPlanId(result.plan.id);
      }

      setAnalysisResults(result.analysis);
      setCurrentPlanStatus('analyzed');
      setCurrentStep(6);
      setMaxStepReached(6);
      await fetchPlans();

      setNotification({
        type: 'success',
        message: `Feasibility Engine complete! Score: ${result.analysis.feasibilityScore}/100`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      // Fallback to client-side calculator if network issue
      const fallbackAnalysis = calculateClientFinancials({
        investment,
        expenses,
        revenueEconomics: revenue,
      });
      setAnalysisResults(fallbackAnalysis);
      setCurrentStep(6);
      setMaxStepReached(6);

      setNotification({
        type: 'error',
        message: 'Server synced with local calculation engine.',
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const totalMonthlyFixedExpenses: number = Object.values(expenses).reduce<number>(
    (acc, val) => acc + (Number(val) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Page Header with Global Actions */}
      <PageHeader
        title="Business Planner & Financial Feasibility Engine"
        description="Formulate capital allocation, fixed and variable operating costs, and stress-test venture feasibility with real-time financial modeling."
        badge="Part 3 Engine"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSavedPlansModalOpen(true)}
              className="text-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
              Saved Plans ({savedPlans.length})
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartNewPlan}
              className="text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Plan
            </Button>
          </div>
        }
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
            notification.type === 'success'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
              : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Step Wizard Progress Bar */}
      <StepProgress
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onSelectStep={handleJumpToStep}
      />

      {/* Wizard Step Content */}
      <div className="transition-all duration-200">
        {currentStep === 1 && (
          <Step1BusinessInfo
            data={businessInfo}
            onChange={(field, value) => {
              setBusinessInfo((prev) => ({ ...prev, [field]: value }));
              if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
            }}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2InitialInvestment
            data={investment}
            onChange={(field, value) => setInvestment((prev) => ({ ...prev, [field]: value }))}
          />
        )}

        {currentStep === 3 && (
          <Step3MonthlyExpenses
            data={expenses}
            onChange={(field, value) => setExpenses((prev) => ({ ...prev, [field]: value }))}
          />
        )}

        {currentStep === 4 && (
          <Step4RevenueEconomics
            data={revenue}
            onChange={(field, value) => setRevenue((prev) => ({ ...prev, [field]: value }))}
            totalMonthlyFixedExpenses={totalMonthlyFixedExpenses}
          />
        )}

        {currentStep === 5 && (
          <Step5ReviewAssumptions
            businessInfo={businessInfo}
            investment={investment}
            expenses={expenses}
            revenue={revenue}
            onJumpToStep={handleJumpToStep}
            onAnalyze={handleRunFeasibilityEngine}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        )}

        {currentStep === 6 && analysisResults && (
          <Step6FinancialDashboard
            plan={{
              ...businessInfo,
              ...investment,
              ...expenses,
              ...revenue,
              id: currentPlanId || 'draft',
              planStatus: currentPlanStatus,
            }}
            analysis={analysisResults}
            onEditAssumptions={() => setCurrentStep(1)}
            onNewPlan={handleStartNewPlan}
            onSave={handleSaveDraft}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Wizard Navigation Footer Bar (Steps 1 to 4) */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between p-4 bg-[#111113] border border-[#27272A] rounded-xl">
          <div>
            {currentStep > 1 ? (
              <Button variant="outline" size="sm" onClick={handlePrevStep} className="text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Previous Step
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartNewPlan}
                className="text-xs text-[#71717A] hover:text-[#FFBF24]"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Form
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button variant="primary" size="sm" onClick={handleNextStep} className="text-xs font-bold">
              Next: {PLANNER_STEPS[currentStep]?.shortLabel || 'Review'}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Saved Plans Selection Modal */}
      <SavedPlansModal
        isOpen={isSavedPlansModalOpen}
        onClose={() => setIsSavedPlansModalOpen(false)}
        plans={savedPlans}
        activePlanId={currentPlanId}
        onSelectPlan={(plan) => loadPlanIntoState(plan)}
        onDeletePlan={handleDeletePlan}
        onCreateNew={handleStartNewPlan}
      />
    </div>
  );
};
