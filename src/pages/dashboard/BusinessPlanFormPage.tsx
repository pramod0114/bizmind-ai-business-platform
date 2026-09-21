import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Wallet,
  TrendingUp,
  CreditCard,
  Target,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { LocationPickerModal } from '../../components/planner/LocationPickerModal';
import { calculateClientFinancials } from '../../utils/financialCalculator';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const CATEGORIES = [
  'Food & Beverage',
  'Retail',
  'Healthcare & Pharmacy',
  'Technology & IT',
  'Education & Coaching',
  'Fitness & Wellness',
  'Automotive & Repairs',
  'Professional Services',
  'Beauty & Personal Care',
  'Entertainment & Leisure',
  'Other',
];

const BUSINESS_MODELS = [
  'Brick & Mortar Retail',
  'Quick Service Restaurant (QSR)',
  'Dine-in Restaurant / Cafe',
  'Cloud Kitchen / Delivery Only',
  'Professional Service Agency',
  'Healthcare / Clinic',
  'Subscription / Membership',
  'Direct-to-Consumer (D2C)',
  'Franchise Outlet',
  'Hybrid (Physical + Online)',
];

export const BusinessPlanFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // FORM STATE
  // Section A
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [businessModel, setBusinessModel] = useState(BUSINESS_MODELS[0]);
  const [targetCustomer, setTargetCustomer] = useState('');

  // Section B
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Section C - Investment
  const [equipmentCost, setEquipmentCost] = useState<number>(150000);
  const [furnitureCost, setFurnitureCost] = useState<number>(75000);
  const [setupCost, setSetupCost] = useState<number>(100000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(120000);
  const [licenseCost, setLicenseCost] = useState<number>(25000);
  const [technologyCost, setTechnologyCost] = useState<number>(30000);
  const [marketingLaunchCost, setMarketingLaunchCost] = useState<number>(40000);
  const [initialInventoryCost, setInitialInventoryCost] = useState<number>(100000);
  const [otherInitialCost, setOtherInitialCost] = useState<number>(20000);

  // Section D - Revenue
  const [revenueApproach, setRevenueApproach] = useState<'direct' | 'calculated'>('calculated');
  const [expectedMonthlySales, setExpectedMonthlySales] = useState<number>(250000);
  const [sellingPrice, setSellingPrice] = useState<number>(250);
  const [expectedCustomersPerDay, setExpectedCustomersPerDay] = useState<number>(40);
  const [operatingDays, setOperatingDays] = useState<number>(30);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(90);
  const [otherRevenue, setOtherRevenue] = useState<number>(0);

  // Section E - Expenses
  // Fixed
  const [rent, setRent] = useState<number>(35000);
  const [salaries, setSalaries] = useState<number>(55000);
  const [utilities, setUtilities] = useState<number>(12000);
  const [internetCost, setInternetCost] = useState<number>(2500);
  const [softwareCost, setSoftwareCost] = useState<number>(3000);
  const [insurance, setInsurance] = useState<number>(2000);
  const [loanEmi, setLoanEmi] = useState<number>(0);
  const [maintenance, setMaintenance] = useState<number>(4000);
  const [otherFixedExpenses, setOtherFixedExpenses] = useState<number>(3500);

  // Variable
  const [variableExpenseMode, setVariableExpenseMode] = useState<'itemized' | 'percentage'>('itemized');
  const [variableExpensePercentage, setVariableExpensePercentage] = useState<number>(35);
  const [rawMaterialCost, setRawMaterialCost] = useState<number>(45000);
  const [inventoryMonthlyCost, setInventoryMonthlyCost] = useState<number>(15000);
  const [packagingCost, setPackagingCost] = useState<number>(6000);
  const [deliveryCost, setDeliveryCost] = useState<number>(4000);
  const [paymentGatewayCost, setPaymentGatewayCost] = useState<number>(2500);
  const [salesCommission, setSalesCommission] = useState<number>(0);
  const [marketingCost, setMarketingCost] = useState<number>(10000);
  const [otherVariableExpenses, setOtherVariableExpenses] = useState<number>(3000);

  // Section F - Targets & Assumptions
  const [targetMonthlyProfit, setTargetMonthlyProfit] = useState<number>(60000);
  const [targetRoi, setTargetRoi] = useState<number>(45);
  const [targetPaybackPeriod, setTargetPaybackPeriod] = useState<number>(18);
  const [targetProfitMargin, setTargetProfitMargin] = useState<number>(25);
  const [revenueGrowthRate, setRevenueGrowthRate] = useState<number>(3.0);

  // Load existing plan if in edit mode
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    planService.getPlanById(id)
      .then((plan) => {
        setBusinessName(plan.businessName || plan.business_name || '');
        setCategory(plan.category || CATEGORIES[0]);
        setDescription(plan.description || '');
        setBusinessModel(plan.businessModel || plan.business_model || BUSINESS_MODELS[0]);
        setTargetCustomer(plan.targetCustomer || plan.target_customer || '');

        setLocationName(plan.location || plan.location_name || '');
        setCity(plan.city || '');
        setArea(plan.area || '');
        setLatitude(plan.latitude ?? null);
        setLongitude(plan.longitude ?? null);

        // Investment
        setEquipmentCost(Number(plan.equipmentCost || 0));
        setFurnitureCost(Number(plan.furnitureCost || 0));
        setSetupCost(Number(plan.setupCost ?? plan.interiorSetup ?? 0));
        setSecurityDeposit(Number(plan.securityDeposit ?? plan.propertyDeposit ?? 0));
        setLicenseCost(Number(plan.licenseCost || 0));
        setTechnologyCost(Number(plan.technologyCost || 0));
        setMarketingLaunchCost(Number(plan.marketingLaunchCost ?? plan.launchMarketing ?? 0));
        setInitialInventoryCost(Number(plan.initialInventoryCost ?? plan.initialInventory ?? 0));
        setOtherInitialCost(Number(plan.otherInitialCost || 0));

        // Revenue
        setRevenueApproach(plan.revenueApproach || (plan.expectedMonthlySales ? 'direct' : 'calculated'));
        setExpectedMonthlySales(Number(plan.expectedMonthlySales || plan.monthlyRevenue || 0));
        setSellingPrice(Number(plan.sellingPrice || plan.averageSellingPrice || 0));
        setExpectedCustomersPerDay(Number(plan.expectedCustomersPerDay || 0));
        setOperatingDays(Number(plan.operatingDays || 30));
        setVariableCostPerUnit(Number(plan.variableCostPerUnit || 0));
        setOtherRevenue(Number(plan.otherRevenue || 0));

        // Expenses
        setRent(Number(plan.rent || 0));
        setSalaries(Number(plan.salaries || 0));
        setUtilities(Number(plan.utilities || 0));
        setInternetCost(Number(plan.internetCost ?? plan.internet ?? 0));
        setSoftwareCost(Number(plan.softwareCost ?? plan.software ?? 0));
        setInsurance(Number(plan.insurance || 0));
        setLoanEmi(Number(plan.loanEmi || 0));
        setMaintenance(Number(plan.maintenance || 0));
        setOtherFixedExpenses(Number(plan.otherFixedExpenses ?? plan.otherExpenses ?? 0));

        // Variable
        if (plan.variableExpensePercentage !== undefined && plan.variableExpensePercentage > 0) {
          setVariableExpenseMode('percentage');
          setVariableExpensePercentage(Number(plan.variableExpensePercentage));
        } else {
          setVariableExpenseMode('itemized');
        }
        setRawMaterialCost(Number(plan.rawMaterialCost || 0));
        setInventoryMonthlyCost(Number(plan.inventoryMonthlyCost || 0));
        setPackagingCost(Number(plan.packagingCost || 0));
        setDeliveryCost(Number(plan.deliveryCost || 0));
        setPaymentGatewayCost(Number(plan.paymentGatewayCost || 0));
        setSalesCommission(Number(plan.salesCommission || 0));
        setMarketingCost(Number(plan.marketingCost ?? plan.marketing ?? 0));
        setOtherVariableExpenses(Number(plan.otherVariableExpenses || 0));

        // Targets
        if (plan.targetMonthlyProfit) setTargetMonthlyProfit(Number(plan.targetMonthlyProfit));
        if (plan.targetRoi) setTargetRoi(Number(plan.targetRoi));
        if (plan.targetPaybackPeriod) setTargetPaybackPeriod(Number(plan.targetPaybackPeriod));
        if (plan.targetProfitMargin) setTargetProfitMargin(Number(plan.targetProfitMargin));
        if (plan.revenueGrowthRate) setRevenueGrowthRate(Number(plan.revenueGrowthRate));
      })
      .catch((err) => {
        console.error('Failed to load plan for editing:', err);
        setErrorMessage('Failed to load business plan details.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // LIVE CLIENT CALCULATION
  const liveResults = useMemo(() => {
    return calculateClientFinancials({
      investment: {
        equipmentCost,
        furnitureCost,
        setupCost,
        securityDeposit,
        licenseCost,
        technologyCost,
        marketingLaunchCost,
        initialInventoryCost,
        otherInitialCost,
      },
      expenses: {
        rent,
        salaries,
        utilities,
        internetCost,
        softwareCost,
        insurance,
        loanEmi,
        maintenance,
        otherFixedExpenses,
        rawMaterialCost,
        inventoryMonthlyCost,
        packagingCost,
        deliveryCost,
        paymentGatewayCost,
        salesCommission,
        marketingCost,
        otherVariableExpenses,
        variableExpensePercentage: variableExpenseMode === 'percentage' ? variableExpensePercentage : undefined,
        variableExpenseMode,
      },
      revenueEconomics: {
        revenueApproach,
        expectedMonthlySales,
        directMonthlyRevenue: expectedMonthlySales,
        sellingPrice,
        averageSellingPrice: sellingPrice,
        expectedCustomersPerDay,
        operatingDays,
        variableCostPerUnit,
        otherRevenue,
      },
      targets: {
        targetMonthlyProfit,
        targetRoi,
        targetPaybackPeriod,
        targetProfitMargin,
      },
      revenueGrowthRate,
    });
  }, [
    equipmentCost,
    furnitureCost,
    setupCost,
    securityDeposit,
    licenseCost,
    technologyCost,
    marketingLaunchCost,
    initialInventoryCost,
    otherInitialCost,
    rent,
    salaries,
    utilities,
    internetCost,
    softwareCost,
    insurance,
    loanEmi,
    maintenance,
    otherFixedExpenses,
    rawMaterialCost,
    inventoryMonthlyCost,
    packagingCost,
    deliveryCost,
    paymentGatewayCost,
    salesCommission,
    marketingCost,
    otherVariableExpenses,
    variableExpenseMode,
    variableExpensePercentage,
    revenueApproach,
    expectedMonthlySales,
    sellingPrice,
    expectedCustomersPerDay,
    operatingDays,
    variableCostPerUnit,
    otherRevenue,
    targetMonthlyProfit,
    targetRoi,
    targetPaybackPeriod,
    targetProfitMargin,
    revenueGrowthRate,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setErrorMessage('Please provide a Business Name.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      businessName: businessName.trim(),
      category,
      description: description.trim(),
      businessModel,
      targetCustomer: targetCustomer.trim(),
      location: locationName.trim(),
      location_name: locationName.trim(),
      city: city.trim(),
      area: area.trim(),
      latitude,
      longitude,

      // Investment
      equipmentCost,
      furnitureCost,
      setupCost,
      interiorSetup: setupCost,
      securityDeposit,
      propertyDeposit: securityDeposit,
      licenseCost,
      technologyCost,
      marketingLaunchCost,
      launchMarketing: marketingLaunchCost,
      initialInventoryCost,
      initialInventory: initialInventoryCost,
      otherInitialCost,

      // Expenses
      rent,
      salaries,
      utilities,
      internetCost,
      internet: internetCost,
      softwareCost,
      software: softwareCost,
      insurance,
      loanEmi,
      maintenance,
      otherFixedExpenses,
      otherExpenses: otherFixedExpenses,

      variableExpenseMode,
      variableExpensePercentage: variableExpenseMode === 'percentage' ? variableExpensePercentage : undefined,
      rawMaterialCost,
      inventoryMonthlyCost,
      packagingCost,
      deliveryCost,
      paymentGatewayCost,
      salesCommission,
      marketingCost,
      marketing: marketingCost,
      otherVariableExpenses,

      // Revenue
      revenueApproach,
      expectedMonthlySales,
      directMonthlyRevenue: expectedMonthlySales,
      sellingPrice,
      averageSellingPrice: sellingPrice,
      expectedCustomersPerDay,
      operatingDays,
      variableCostPerUnit,
      otherRevenue,

      // Targets
      targetMonthlyProfit,
      targetRoi,
      targetPaybackPeriod,
      targetProfitMargin,
      revenueGrowthRate,

      planStatus: 'analyzed' as const,
    };

    try {
      if (isEditing && id) {
        await planService.updatePlan(id, payload);
        navigate(`/business-plans/${id}`);
      } else {
        const created = await planService.createPlan(payload);
        navigate(`/business-plans/${created.plan.id}`);
      }
    } catch (err: any) {
      console.error('Failed to save business plan:', err);
      setErrorMessage(err?.message || 'Failed to save business plan. Please check all fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSaving(false);
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

  return (
    <div className="space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(isEditing && id ? `/business-plans/${id}` : '/business-plans')}
            className="p-2 bg-[#18181B] hover:bg-[#27272A] text-slate-400 hover:text-white rounded-lg border border-[#27272A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? `Edit Business Plan: ${businessName || 'Untitled'}` : 'Create New Business Plan'}
            </h1>
            <p className="text-xs text-slate-400">
              Configure initial CapEx, unit economics, recurring overhead, and financial feasibility targets
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION A: Basic Business Information */}
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#27272A] pb-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Section A: Basic Business Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Artisan Roast Cafe & Bakery"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Industry Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Operating Model
              </label>
              <select
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value)}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              >
                {BUSINESS_MODELS.map((bm) => (
                  <option key={bm} value={bm}>
                    {bm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Customer Segment
              </label>
              <input
                type="text"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                placeholder="e.g. Urban professionals aged 22-40, remote workers"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Concept & Executive Summary
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of value proposition, competitive advantages, and core offerings..."
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: Location */}
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272A] pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Section B: Business Location
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors w-fit"
            >
              <MapPin className="w-3.5 h-3.5" />
              Choose from Location Module / Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location Name / Landmark
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. 100ft Road, Koramangala 4th Block"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Area / Suburb
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Koramangala"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Latitude Coordinates
              </label>
              <input
                type="number"
                step="any"
                value={latitude ?? ''}
                onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g. 12.9352"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Longitude Coordinates
              </label>
              <input
                type="number"
                step="any"
                value={longitude ?? ''}
                onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g. 77.6245"
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: Initial Investment Inputs */}
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Section C: Initial Investment (CapEx)
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Initial CapEx:</span>
              <span className="text-base font-bold text-amber-400">
                {formatCurrency(liveResults.totalInitialInvestment)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Equipment Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                value={equipmentCost}
                onChange={(e) => setEquipmentCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Furniture & Fixtures (₹)
              </label>
              <input
                type="number"
                min="0"
                value={furnitureCost}
                onChange={(e) => setFurnitureCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Interior & Shop Setup (₹)
              </label>
              <input
                type="number"
                min="0"
                value={setupCost}
                onChange={(e) => setSetupCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Security Deposit / Property (₹)
              </label>
              <input
                type="number"
                min="0"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Licensing & Permits (₹)
              </label>
              <input
                type="number"
                min="0"
                value={licenseCost}
                onChange={(e) => setLicenseCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technology & POS Setup (₹)
              </label>
              <input
                type="number"
                min="0"
                value={technologyCost}
                onChange={(e) => setTechnologyCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Launch Marketing & Signage (₹)
              </label>
              <input
                type="number"
                min="0"
                value={marketingLaunchCost}
                onChange={(e) => setMarketingLaunchCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Stock / Inventory (₹)
              </label>
              <input
                type="number"
                min="0"
                value={initialInventoryCost}
                onChange={(e) => setInitialInventoryCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Other Initial Capital (₹)
              </label>
              <input
                type="number"
                min="0"
                value={otherInitialCost}
                onChange={(e) => setOtherInitialCost(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION D: Monthly Revenue & Unit Economics */}
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Section D: Monthly Revenue & Unit Economics
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Projected Monthly Revenue:</span>
              <span className="text-base font-bold text-blue-400">
                {formatCurrency(liveResults.monthlyRevenue)}
              </span>
            </div>
          </div>

          {/* Revenue Approach Switch */}
          <div className="flex items-center gap-4 bg-[#202024] p-3 rounded-lg border border-[#27272A]">
            <span className="text-xs font-semibold text-slate-300">Revenue Input Approach:</span>
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="radio"
                name="revenueApproach"
                value="calculated"
                checked={revenueApproach === 'calculated'}
                onChange={() => setRevenueApproach('calculated')}
                className="accent-indigo-500"
              />
              Calculated from Unit Economics (Customers × Price)
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="radio"
                name="revenueApproach"
                value="direct"
                checked={revenueApproach === 'direct'}
                onChange={() => setRevenueApproach('direct')}
                className="accent-indigo-500"
              />
              Direct Monthly Revenue Target
            </label>
          </div>

          {revenueApproach === 'direct' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Monthly Sales Revenue (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={expectedMonthlySales}
                  onChange={(e) => setExpectedMonthlySales(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Average Selling Price per Ticket/Item (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Variable Cost Per Unit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Average Selling Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Customers / Units Per Day
                </label>
                <input
                  type="number"
                  min="0"
                  value={expectedCustomersPerDay}
                  onChange={(e) => setExpectedCustomersPerDay(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operating Days Per Month
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={operatingDays}
                  onChange={(e) => setOperatingDays(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Variable Cost Per Unit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION E: Monthly Expenses (Fixed & Variable) */}
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Section E: Monthly Operating Expenses
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Monthly Expenses:</span>
              <span className="text-base font-bold text-rose-400">
                {formatCurrency(liveResults.totalMonthlyExpenses)}
              </span>
            </div>
          </div>

          {/* E1: Fixed Expenses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 border-b border-[#27272A]/70 pb-1">
              <span>Fixed Overhead Expenses</span>
              <span className="text-slate-300">
                Subtotal: {formatCurrency(liveResults.totalMonthlyFixedExpenses)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Staff Salaries & Payroll (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={salaries}
                  onChange={(e) => setSalaries(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Utilities (Power, Water) (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={utilities}
                  onChange={(e) => setUtilities(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Internet & Telecom (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={internetCost}
                  onChange={(e) => setInternetCost(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Software & Subscriptions (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={softwareCost}
                  onChange={(e) => setSoftwareCost(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Insurance (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loan EMI / Repayment (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={loanEmi}
                  onChange={(e) => setLoanEmi(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Maintenance & Repairs (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maintenance}
                  onChange={(e) => setMaintenance(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Other Fixed Overheads (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={otherFixedExpenses}
                  onChange={(e) => setOtherFixedExpenses(Number(e.target.value))}
                  className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* E2: Variable Expenses */}
          <div className="space-y-3 pt-4 border-t border-[#27272A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold uppercase text-slate-400 border-b border-[#27272A]/70 pb-1">
              <div className="flex items-center gap-3">
                <span>Variable Costs</span>
                <div className="flex items-center gap-2 font-normal lowercase">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="varMode"
                      value="itemized"
                      checked={variableExpenseMode === 'itemized'}
                      onChange={() => setVariableExpenseMode('itemized')}
                      className="accent-indigo-500"
                    />
                    Itemized Line Items
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="varMode"
                      value="percentage"
                      checked={variableExpenseMode === 'percentage'}
                      onChange={() => setVariableExpenseMode('percentage')}
                      className="accent-indigo-500"
                    />
                    % of Monthly Revenue
                  </label>
                </div>
              </div>
              <span className="text-slate-300">
                Subtotal: {formatCurrency(liveResults.totalMonthlyVariableExpenses)}
              </span>
            </div>

            {variableExpenseMode === 'percentage' ? (
              <div className="max-w-sm">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Variable Cost as % of Revenue
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={variableExpensePercentage}
                    onChange={(e) => setVariableExpensePercentage(Number(e.target.value))}
                    className="w-24 bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500 font-bold"
                  />
                  <span className="text-xs text-slate-400">%</span>
                  <span className="text-xs text-slate-400">
                    = {formatCurrency((liveResults.monthlyRevenue * variableExpensePercentage) / 100)} / mo
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Raw Materials (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={rawMaterialCost}
                    onChange={(e) => setRawMaterialCost(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Inventory (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={inventoryMonthlyCost}
                    onChange={(e) => setInventoryMonthlyCost(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Packaging (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery / Logistics (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={deliveryCost}
                    onChange={(e) => setDeliveryCost(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Gateway Fees (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={paymentGatewayCost}
                    onChange={(e) => setPaymentGatewayCost(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sales Commission (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={salesCommission}
                    onChange={(e) => setSalesCommission(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ongoing Marketing (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={marketingCost}
                    onChange={(e) => setMarketingCost(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Other Variable Costs (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={otherVariableExpenses}
                    onChange={(e) => setOtherVariableExpenses(Number(e.target.value))}
                    className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION F: Target / Assumption Settings */}
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#27272A] pb-3">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Section F: Targets & Projection Assumptions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Monthly Profit (₹)
              </label>
              <input
                type="number"
                min="0"
                value={targetMonthlyProfit}
                onChange={(e) => setTargetMonthlyProfit(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Annual ROI (%)
              </label>
              <input
                type="number"
                min="0"
                value={targetRoi}
                onChange={(e) => setTargetRoi(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Payback Period (Mos)
              </label>
              <input
                type="number"
                min="1"
                value={targetPaybackPeriod}
                onChange={(e) => setTargetPaybackPeriod(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Profit Margin (%)
              </label>
              <input
                type="number"
                min="0"
                value={targetProfitMargin}
                onChange={(e) => setTargetProfitMargin(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Growth Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                value={revenueGrowthRate}
                onChange={(e) => setRevenueGrowthRate(Number(e.target.value))}
                className="w-full bg-[#27272A] text-white px-3 py-2 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* STICKY LIVE SUMMARY BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#18181B]/95 backdrop-blur-md border-t border-[#3F3F46] p-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Live Metrics */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">CapEx</span>
                <span className="font-bold text-white">
                  {formatCurrency(liveResults.totalInitialInvestment)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Revenue</span>
                <span className="font-bold text-blue-400">
                  {formatCurrency(liveResults.monthlyRevenue)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Expenses</span>
                <span className="font-bold text-rose-400">
                  {formatCurrency(liveResults.totalMonthlyExpenses)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Net Profit</span>
                <span
                  className={`font-bold ${
                    liveResults.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(liveResults.monthlyProfit)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Margin</span>
                <span className="font-bold text-white">
                  {formatPercentage(liveResults.profitMargin)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Score</span>
                <span className="font-bold text-amber-400">
                  {liveResults.feasibilityScore}/100
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                type="button"
                onClick={() => navigate(isEditing && id ? `/business-plans/${id}` : '/business-plans')}
                className="px-4 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-slate-300 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEditing ? 'Update Business Plan' : 'Save & Analyze Business Plan'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        currentLocationName={locationName}
        onSelectLocation={(loc) => {
          setLocationName(loc.location_name);
          if (loc.city) setCity(loc.city);
          if (loc.area) setArea(loc.area);
          if (loc.latitude !== null) setLatitude(loc.latitude);
          if (loc.longitude !== null) setLongitude(loc.longitude);
        }}
      />
    </div>
  );
};
