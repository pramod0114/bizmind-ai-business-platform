/**
 * BizMind – Elite Motion Slideshow & Pitch Deck Player (8 Core Slides)
 * Features:
 * - Fluid Framer Motion slide animation engine with choreographed entrances
 * - Live interactive Recharts vector charts embedded in slides matching the PowerPoint file
 * - Live interactive Geospatial Location Intelligence Demo with Leaflet Map & Radar Simulator
 * - Real Microsoft PowerPoint (.pptx) download with native editable vector charts
 * - Standalone Offline Animated HTML Deck download (100% active animations anywhere)
 * - Fullscreen stage mode, auto-play presenter timer, transition style selector, and speaker notes
 * - Dynamic data binding with saved business plans
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Download,
  Printer,
  FileSpreadsheet,
  Cpu,
  MapPin,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  BarChart3,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building,
  DollarSign,
  PieChart,
  Presentation,
  Volume2,
  HelpCircle,
  X,
  Share2,
  Compass,
  RefreshCw,
  Sliders,
  Palette,
  FileCode,
  Flame,
  Target,
  Radar,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { planService } from '../../services/planService';
import { generateBizMindPptx } from '../../services/pptxService';
import { generateAnimatedHtmlPresentation } from '../../services/animatedHtmlExportService';
import {
  SlideAnimationEngine,
  AnimationPreset,
  TransitionType,
  containerStaggerVariants,
  fadeUpVariant,
  popScaleVariant,
  chartRevealVariant,
} from '../../components/presentation/SlideAnimationEngine';
import { LiveLocationIntelligenceDemo } from '../../components/presentation/LiveLocationIntelligenceDemo';
import { BusinessPlan } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface SlideData {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  notes: string;
  content: (plan?: BusinessPlan | null, theme?: 'gold' | 'cyan' | 'emerald') => React.ReactNode;
}

export const PresentationPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('platform');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [animPreset, setAnimPreset] = useState<AnimationPreset>('smooth');
  const [transitionType, setTransitionType] = useState<TransitionType>('slide');
  const [showAnimSettings, setShowAnimSettings] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [theme, setTheme] = useState<'gold' | 'cyan' | 'emerald'>('gold');
  const [isExportingPptx, setIsExportingPptx] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<any>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const userPlans = await planService.getPlans();
        setPlans(userPlans || []);
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const selectedPlan = plans.find((p) => String(p.id) === selectedPlanId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    try {
      await generateBizMindPptx(selectedPlan);
      showToast('Downloaded Native PowerPoint (.pptx) with Vector Charts & Slide Transitions!');
    } catch (err: any) {
      console.error('Failed to export PPTX:', err);
      showToast('Export failed: ' + (err?.message || 'Error'));
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleExportHtml = () => {
    try {
      generateAnimatedHtmlPresentation(selectedPlan);
      showToast('Downloaded Standalone Animated Deck (HTML)!');
    } catch (err: any) {
      console.error('Failed to export HTML deck:', err);
      showToast('Export failed: ' + (err?.message || 'Error'));
    }
  };

  // Theme colors
  const themeColors = {
    gold: { accent: '#FFBF24', hover: '#F59E0B', text: 'text-[#FFBF24]', border: 'border-[#FFBF24]', bg: 'bg-[#FFBF24]/10' },
    cyan: { accent: '#38BDF8', hover: '#0284C7', text: 'text-sky-400', border: 'border-sky-400', bg: 'bg-sky-500/10' },
    emerald: { accent: '#10B981', hover: '#059669', text: 'text-emerald-400', border: 'border-emerald-400', bg: 'bg-emerald-500/10' },
  }[theme];

  // 8 High-Impact Structured Presentation Slides
  const slides: SlideData[] = [
    // SLIDE 1: Hero Cover & Platform Overview
    {
      id: 1,
      category: 'Venture Pitch Deck • 01 of 08',
      title: selectedPlan ? selectedPlan.businessName : 'BIZMIND AI PLATFORM',
      subtitle: selectedPlan
        ? `Comprehensive Venture Feasibility & Geospatial Market Validation Dossier for ${selectedPlan.location || 'Target Corridor'}`
        : 'Enterprise Location Intelligence, Financial Feasibility Modeling & Calibrated ML Success Regressor',
      notes:
        'Welcome investors and stakeholders. BizMind is the next-generation decision intelligence platform that eliminates small business failure through empirical geospatial indexing and mathematical unit economics.',
      content: (plan) => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-6"
        >
          <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full flex items-center gap-1.5 ${themeColors.text} ${themeColors.bg} border ${themeColors.border}`}>
              <Sparkles className="w-3.5 h-3.5" />
              Decision Intelligence v2.4
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Production Validated
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full">
              8-Page Executive Summary
            </span>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {plan ? plan.businessName : 'Where Spatial Demographics Meet Financial Precision.'}
            </h1>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-3xl">
              {plan
                ? plan.description ||
                  `Strategic market analysis and financial feasibility modeling for ${plan.category} in ${plan.location}.`
                : 'Enabling entrepreneurs, venture funds, and franchise operators to stress-test unit economics, map micro-radius competitor clustering, and forecast venture viability with calibrated machine learning.'}
            </p>
          </motion.div>

          {/* 4 Core Pillars */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { title: 'Deterministic Financials', sub: 'Unit economics & break-even calculus', icon: DollarSign, color: 'text-[#FFBF24]', border: 'hover:border-[#FFBF24]/50' },
              { title: 'Spatial Radar', sub: 'Google Places & OSM Overpass radii', icon: MapPin, color: 'text-sky-400', border: 'hover:border-sky-400/50' },
              { title: 'Stress Testing', sub: 'Conservative, base & optimistic cases', icon: TrendingUp, color: 'text-emerald-400', border: 'hover:border-emerald-400/50' },
              { title: 'Predictive ML', sub: 'XGBoost & Random Forest ensembles', icon: Cpu, color: 'text-purple-400', border: 'hover:border-purple-400/50' },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} variants={popScaleVariant} className={`p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] ${p.border} transition-colors space-y-1`}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span className="text-xs font-bold text-white">{p.title}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">{p.sub}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1E2433]">
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#FFBF24] uppercase">CapEx Investment</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$875,000'}
              </div>
              <div className="text-[10px] text-[#64748B]">Total launch capital</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-sky-400 uppercase">Fixed Burn (OpEx)</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {plan ? `${formatCurrency(plan.totalMonthlyFixedExpenses || 0)}/mo` : '$165,000 / mo'}
              </div>
              <div className="text-[10px] text-[#64748B]">Monthly overhead</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-emerald-400 uppercase">Projected Net Margin</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">
                {plan ? formatPercentage(plan.profitMargin || 0) : '22.9% Net'}
              </div>
              <div className="text-[10px] text-[#64748B]">After COGS & expenses</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-purple-400 uppercase">Payback Timeline</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {plan ? `${plan.paybackPeriodMonths || 12.1} Mo` : '12.1 Months'}
              </div>
              <div className="text-[10px] text-[#64748B]">Capital recovery window</div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 2: The Core Problem: Why 90% of Startups Collapse
    {
      id: 2,
      category: 'Market Friction & Need • 02 of 08',
      title: 'The $1.3T Startup Failure Epidemic: Why 90% of New Ventures Collapse',
      subtitle: 'Entrepreneurs fail not from poor products, but from preventable blind spots in site selection and static financial spreadsheets',
      notes:
        'Explain the core problem: 42% of startups fail from misjudged location demand and saturation; 29% run out of cash due to primitive spreadsheets. BizMind transforms guesswork into mathematical certainty.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 max-w-5xl mx-auto my-auto"
        >
          <motion.div variants={fadeUpVariant} className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                num: '42%',
                title: 'No Market Demand & Site Saturation',
                problem: 'Signing commercial leases based on surface foot-traffic impressions rather than empirical competitor clustering and local purchasing power.',
                solution: 'BizMind Solution: Micro-radius isochrone spatial indexing (500m to 5km) and demand gap analysis.',
                tag: 'FATAL SITE SELECTION',
                color: 'text-rose-500',
                border: 'border-rose-500/30',
              },
              {
                num: '29%',
                title: 'Premature Cash Depletion & Burnout',
                problem: 'Static spreadsheets fail to model footfall ramp-up drag and variable cost spikes, exhausting cash reserves before achieving break-even.',
                solution: 'BizMind Solution: Dynamic 12-month compounding cash curves and 3-month working capital safety buffers.',
                tag: 'RUNWAY EXHAUSTION',
                color: 'text-amber-500',
                border: 'border-amber-500/30',
              },
              {
                num: '23%',
                title: 'Distorted Pricing & Omitted COGS',
                problem: 'Setting price points without granular contribution margins, inventory spoilage, card transaction fees, or utility escalations.',
                solution: 'BizMind Solution: Unit economics breakdown with per-customer contribution margin calculus.',
                tag: 'MARGIN EROSION',
                color: 'text-sky-400',
                border: 'border-sky-400/30',
              },
              {
                num: '19%',
                title: 'Blind to Undetected Competitor Clusters',
                problem: 'Failing to track nearby complementary vs direct rivals, allowing aggressive local competitors to capture prime customer corridors.',
                solution: 'BizMind Solution: Live dual-engine spatial radar (Google Places + OSM Overpass) tracking all rivals.',
                tag: 'MARKET BLINDSPOT',
                color: 'text-purple-400',
                border: 'border-purple-400/30',
              },
            ].map((pc, idx) => (
              <motion.div key={idx} variants={popScaleVariant} className={`p-4 rounded-xl bg-[#121722] border ${pc.border} space-y-2 hover:border-white/30 transition-colors`}>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl sm:text-3xl font-black ${pc.color}`}>{pc.num}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0A0D14] text-white/80 border border-[#27272A]">
                    {pc.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{pc.title}</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{pc.problem}</p>
                <div className="p-2 rounded-lg bg-[#0A0D14] border border-[#1E2433] text-[11px] text-emerald-400 font-medium">
                  {pc.solution}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Transformation Summary */}
          <motion.div variants={fadeUpVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#FFBF24]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBF24] animate-pulse"></span>
              <span className="font-bold text-white">The BizMind Paradigm Shift:</span>
              <span className="text-[#94A3B8]">From subjective spreadsheet guesswork to empirical algorithmic decision intelligence.</span>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#FFBF24]/10 text-[#FFBF24] font-bold shrink-0">
              Zero Intuition Leaps
            </span>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 3: Startup CapEx Outlay & Working Capital (Animated Donut Chart)
    {
      id: 3,
      category: 'Capital Allocation • 03 of 08',
      title: 'Startup Capital Allocation & Working Capital Reserves',
      subtitle: 'Native vector distribution of initial capital expenditure and essential operating safety runway',
      notes:
        'Walk through initial capital allocation. Emphasize that the 3-month working capital buffer ensures business survival during the initial customer ramp-up period.',
      content: (plan) => {
        const capexData = [
          { name: 'Property Deposit', value: plan?.propertyDeposit || 250000, color: '#FFBF24' },
          { name: 'Interior Setup & Fitout', value: plan?.interiorSetup || 280000, color: '#38BDF8' },
          { name: 'Equipment & Machinery', value: plan?.equipmentCost || 180000, color: '#10B981' },
          { name: 'Initial Inventory', value: plan?.initialInventory || 35000, color: '#A855F7' },
          { name: 'Technology & POS', value: plan?.technologyCost || 20000, color: '#F43F5E' },
          { name: 'Launch Marketing', value: plan?.launchMarketing || 25000, color: '#F59E0B' },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            <motion.div variants={chartRevealVariant} className="h-80 w-full p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>CapEx Allocation Breakdown</span>
                <span className="text-[10px] text-[#FFBF24] font-mono">Animated Recharts</span>
              </div>
              <ResponsiveContainer width="100%" height="88%">
                <RechartsPieChart>
                  <Pie
                    data={capexData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={900}
                  >
                    {capexData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={containerStaggerVariants} className="space-y-3">
              {[
                { title: 'Total Startup Capital (CapEx)', val: plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$790,000', sub: 'Comprehensive fixed capital requirement for turnkey launch', color: 'text-[#FFBF24]' },
                { title: '3-Month Working Capital Safety Buffer', val: plan ? formatCurrency((plan.totalMonthlyFixedExpenses || 165000) * 3) : '$495,000', sub: 'Critical cash cushion to absorb initial ramp-up volatility', color: 'text-sky-400' },
                { title: 'Equipment & Tangible Assets', val: plan ? formatCurrency(plan.equipmentCost || 180000) : '$180,000', sub: 'Depreciable commercial machinery and physical fitout value', color: 'text-emerald-400' },
              ].map((item, i) => (
                <motion.div key={i} variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                  <div className="text-xs text-[#94A3B8] font-medium">{item.title}</div>
                  <div className={`text-2xl font-bold ${item.color}`}>{item.val}</div>
                  <div className="text-xs text-[#64748B]">{item.sub}</div>
                </motion.div>
              ))}

              <div className="p-3 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/20 text-xs text-[#FFBF24]">
                <strong>Capital Safeguard:</strong> BizMind checks that working capital covers at least 90 days of fixed expenses before validating any plan.
              </div>
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 4: 12-Month Cash Flow & Break-Even Trajectory (Animated Line Chart)
    {
      id: 4,
      category: 'Financial Trajectory • 04 of 08',
      title: '12-Month Financial Trajectory: Compounding Revenue vs. Expense Baseline',
      subtitle: 'Dynamic growth curve visualizing customer ramp-up crossing the operational expense floor to achieve cash neutrality',
      notes:
        'Point out month-by-month compounding growth. The break-even intersection occurs in month 3, generating positive operating cash flow thereafter.',
      content: (plan) => {
        const baseRev = plan?.monthlyRevenue || 316800;
        const baseExp = plan?.totalMonthlyExpenses || 244200;
        const lineData = [
          { month: 'M1', revenue: Math.round(baseRev * 0.75), expenses: Math.round(baseExp * 0.95) },
          { month: 'M2', revenue: Math.round(baseRev * 0.82), expenses: Math.round(baseExp * 0.97) },
          { month: 'M3 (Break-Even)', revenue: Math.round(baseRev * 0.92), expenses: Math.round(baseExp * 0.98) },
          { month: 'M4', revenue: Math.round(baseRev * 0.98), expenses: Math.round(baseExp * 1.0) },
          { month: 'M5', revenue: Math.round(baseRev * 1.04), expenses: Math.round(baseExp * 1.01) },
          { month: 'M6', revenue: Math.round(baseRev * 1.10), expenses: Math.round(baseExp * 1.02) },
          { month: 'M7', revenue: Math.round(baseRev * 1.15), expenses: Math.round(baseExp * 1.03) },
          { month: 'M8', revenue: Math.round(baseRev * 1.20), expenses: Math.round(baseExp * 1.04) },
          { month: 'M9', revenue: Math.round(baseRev * 1.25), expenses: Math.round(baseExp * 1.05) },
          { month: 'M10', revenue: Math.round(baseRev * 1.29), expenses: Math.round(baseExp * 1.06) },
          { month: 'M11', revenue: Math.round(baseRev * 1.33), expenses: Math.round(baseExp * 1.07) },
          { month: 'M12', revenue: Math.round(baseRev * 1.38), expenses: Math.round(baseExp * 1.08) },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            <motion.div variants={chartRevealVariant} className="lg:col-span-2 h-80 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>12-Month Compounding Trajectory</span>
                <span className="text-[10px] text-emerald-400 font-mono">Crossing Month 3</span>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsLineChart data={lineData}>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  <Line type="monotone" dataKey="revenue" name="Monthly Gross Revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} animationDuration={1000} />
                  <Line type="monotone" dataKey="expenses" name="Total Monthly Expenses" stroke="#F43F5E" strokeWidth={2} strokeDasharray="5 5" animationDuration={800} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={containerStaggerVariants} className="space-y-3">
              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Break-Even Sales Volume</div>
                <div className="text-2xl font-bold text-[#FFBF24]">
                  {plan ? `${plan.breakEvenUnits || 1000} Units` : '1,000 Units'}
                </div>
                <div className="text-xs text-[#64748B]">Monthly minimum units to break even</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Break-Even Revenue Floor</div>
                <div className="text-2xl font-bold text-sky-400">
                  {plan ? formatCurrency(plan.breakEvenRevenue || 220000) : '$220,000 / mo'}
                </div>
                <div className="text-xs text-[#64748B]">Cash-neutral revenue threshold</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Capacity Demand Buffer</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {plan ? `${(100 - (plan.breakEvenCapacityPercentage || 69.4)).toFixed(1)}% Buffer` : '30.6% Buffer'}
                </div>
                <div className="text-xs text-[#64748B]">Protection against demand swings</div>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 5: Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis (Animated Clustered Bar Chart)
    {
      id: 5,
      category: 'Risk & Sensitivity • 05 of 08',
      title: 'Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis',
      subtitle: 'Rigorous empirical modeling proving solvency under severe market contraction and peak upside',
      notes:
        'Review the 3 stress cases. Even in the Conservative case with 20% lower footfall and 5% inflation, the business maintains a safe runway with zero capital impairment.',
      content: (plan) => {
        const baseRev = plan?.monthlyRevenue || 316800;
        const baseExp = plan?.totalMonthlyExpenses || 244200;
        const scenarioData = [
          {
            scenario: 'Conservative (-20%)',
            Revenue: Math.round(baseRev * 0.8),
            Expenses: Math.round(baseExp * 1.05),
            Profit: Math.round(baseRev * 0.8 - baseExp * 1.05),
          },
          {
            scenario: 'Base Case (Target)',
            Revenue: baseRev,
            Expenses: baseExp,
            Profit: Math.round(baseRev - baseExp),
          },
          {
            scenario: 'Optimistic (+20%)',
            Revenue: Math.round(baseRev * 1.2),
            Expenses: Math.round(baseExp * 1.1),
            Profit: Math.round(baseRev * 1.2 - baseExp * 1.1),
          },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            <motion.div variants={chartRevealVariant} className="lg:col-span-2 h-80 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Scenario Stress Comparison</span>
                <span className="text-[10px] text-sky-400 font-mono">Revenue vs Expenses vs Profit</span>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsBarChart data={scenarioData}>
                  <XAxis dataKey="scenario" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  <Bar dataKey="Revenue" fill="#38BDF8" radius={[4, 4, 0, 0]} animationDuration={800} />
                  <Bar dataKey="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="Profit" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={1200} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={containerStaggerVariants} className="space-y-3">
              {[
                { title: 'Conservative Case (-20% Footfall)', body: 'Footfall drops by 20% while costs inflate by 5%. Cash reserves absorb the slowdown with zero insolvency.', color: 'border-rose-500/40', badge: 'Solvent' },
                { title: 'Base Target Case (Standard Plan)', body: 'Expected steady-state yielding healthy net margins and full initial capital payback in 12.1 months.', color: 'border-[#FFBF24]/50', badge: 'Target' },
                { title: 'Optimistic Case (+20% Expansion)', body: 'High customer repeat frequency yields 29.3% net margin, accelerating payback to 8.5 months.', color: 'border-emerald-500/40', badge: 'Peak Upside' },
              ].map((item, idx) => (
                <motion.div key={idx} variants={popScaleVariant} className={`p-3.5 rounded-xl bg-[#121722] border ${item.color} space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0D14] text-white/80 border border-[#27272A]">{item.badge}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 6: Geospatial Location Intelligence & Competitor Clustering Methodology
    {
      id: 6,
      category: 'Geospatial Methodology • 06 of 08',
      title: 'Geospatial Intelligence: Micro-Radius Competitor Indexing',
      subtitle: 'Transforming physical geography into competitive dominance via isochrone dispersion and spatial algorithms',
      notes:
        'Discuss spatial intelligence: Isochrone radius bands, differentiation between direct competitors and traffic-driving complementary businesses.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 max-w-5xl mx-auto my-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Isochrone Radius Banding',
                body: 'Calculates competitor density across 500m (walkshed), 1km (neighborhood core), 2km (primary trade area), and 5km (vehicular reach) to evaluate real catchment pull.',
                stat: '500m - 5km Dynamic Radii',
                accent: 'text-sky-400',
              },
              {
                num: '02',
                title: 'Footfall Synergy vs Rivalry',
                body: 'Differentiates zero-sum direct competitors (splitting category spend) from complementary hubs (transit stations, offices, colleges, retail anchors) that drive pedestrian traffic.',
                stat: 'Synergy Scoring Algorithm',
                accent: 'text-[#FFBF24]',
              },
              {
                num: '03',
                title: 'White-Space Gap Discovery',
                body: 'Highlights high-density residential and commercial corridors where specific consumer offerings (e.g. specialty coffee, organic health) are completely unserved.',
                stat: 'Opportunity Score Index (0-100)',
                accent: 'text-emerald-400',
              },
            ].map((gm, idx) => (
              <motion.div key={idx} variants={popScaleVariant} className="p-5 rounded-2xl bg-[#121722] border border-[#1E2433] flex flex-col justify-between h-72 hover:border-[#FFBF24]/40 transition-colors">
                <div>
                  <span className={`text-3xl font-black ${gm.accent}`}>{gm.num}</span>
                  <h4 className="text-base font-bold text-white mt-2">{gm.title}</h4>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{gm.body}</p>
                </div>
                <div className="pt-3 border-t border-[#1E2433]">
                  <span className="text-[11px] px-2.5 py-1 rounded bg-[#1E2433] text-white font-medium">
                    {gm.stat}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Spatial Pipeline Architecture Ribbon */}
          <motion.div variants={fadeUpVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-bold text-white">Dual-Data Spatial Pipeline:</span>
              <span className="text-[#94A3B8]">Google Places API (New) + OpenStreetMap Overpass spatial queries with sub-20ms spatial caching.</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              Sub-20ms Latency
            </span>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 7: LIVE DEMO: Real-Time Location Intelligence Engine (Interactive Map & Simulator)
    {
      id: 7,
      category: 'Live Spatial Demo • 07 of 08',
      title: 'LIVE DEMO: Real-Time Location Intelligence & Spatial Radar',
      subtitle: 'Interactive geospatial simulator — select hotspot corridors, toggle radius rings, and inspect real-time competitor clustering',
      notes:
        'Live interactive demonstration. Show stakeholders how the presenter can switch corridors (Indiranagar, Connaught Place, Bandra, etc.), adjust radii, trigger radar sweeps, and inspect nearby rivals live.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-full max-w-5xl mx-auto flex flex-col justify-center"
        >
          <LiveLocationIntelligenceDemo />
        </motion.div>
      ),
    },

    // SLIDE 8: Machine Learning Success Regressor, Responsible AI & Transformation Scorecard
    {
      id: 8,
      category: 'Predictive AI & Outcomes • 08 of 08',
      title: 'Machine Learning Success Regressor & Transformation Scorecard',
      subtitle: 'Dual-engine AI validation (Random Forest & XGBoost) with Responsible AI governance and proven business outcomes',
      notes:
        'Conclude the pitch deck. Review the empirical feature attribution (Footfall Density 32%, Capital Adequacy 26%), the Responsible AI safety guardrail, and the proven business transformation outcomes.',
      content: () => {
        const featureData = [
          { feature: 'Footfall Density', weight: 32 },
          { feature: 'Capital Adequacy', weight: 26 },
          { feature: 'Competitor Proximity', weight: 21 },
          { feature: 'Target Demographic Income', weight: 14 },
          { feature: 'Seasonality Index', weight: 7 },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            {/* Left: ML Feature Weights & Responsible AI */}
            <div className="space-y-4">
              <motion.div variants={chartRevealVariant} className="h-64 p-3.5 rounded-2xl bg-[#121722] border border-[#1E2433]">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>ML Feature Attribution Weights (%)</span>
                  <span className="text-[10px] text-purple-400 font-mono">XGBoost & Random Forest</span>
                </div>
                <ResponsiveContainer width="100%" height="86%">
                  <RechartsBarChart layout="vertical" data={featureData}>
                    <XAxis type="number" stroke="#64748B" fontSize={10} domain={[0, 40]} />
                    <YAxis type="category" dataKey="feature" stroke="#64748B" fontSize={10} width={135} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Importance Weight']}
                      contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="weight" fill="#FFBF24" radius={[0, 4, 4, 0]} animationDuration={900} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1 text-xs">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Responsible AI Policy & Validation Guardrails
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  BizMind strictly prevents hallucinated confidence. Success probabilities are rendered <strong>ONLY</strong> when historical data for the specific category and region is calibrated. In sparse areas, it falls back to transparent rule-based scoring.
                </p>
              </motion.div>
            </div>

            {/* Right: Transformation Scorecard & Vision */}
            <motion.div variants={containerStaggerVariants} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { stat: '85%', label: 'Planning Time Saved', detail: 'Accelerates business planning from 4 weeks to under an hour of structured modeling.', color: 'text-[#FFBF24]' },
                  { stat: '3.4x', label: 'Higher Capital Efficiency', detail: 'Prevents premature burnout by accurately sizing fixed reserves before signing commercial leases.', color: 'text-sky-400' },
                  { stat: '94%', label: 'Loan Approval Readiness', detail: 'Produces bank-ready financial projections accepted by commercial lenders and angels.', color: 'text-emerald-400' },
                  { stat: '< 20ms', label: 'Real-Time Spatial Queries', detail: 'Instantaneous competitor mapping and radius density retrieval via optimized geospatial APIs.', color: 'text-purple-400' },
                ].map((sc, idx) => (
                  <motion.div key={idx} variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                    <div className={`text-2xl sm:text-3xl font-black ${sc.color}`}>{sc.stat}</div>
                    <div className="text-xs font-bold text-white">{sc.label}</div>
                    <p className="text-[10px] text-[#94A3B8] leading-tight">{sc.detail}</p>
                  </motion.div>
                ))}
              </div>

              {/* Strategic Horizon */}
              <motion.div variants={fadeUpVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FFBF24]" />
                  <span>Strategic Roadmap: Enterprise Multi-Unit Expansion</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Phase 1 (Core Engine) and Phase 2 (Scenario MLOps) are in active deployment. Phase 3 expands to multi-location franchise portfolios, wholesale supplier bidding, and commercial lease optimization.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      },
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1 < totalSlides ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 >= 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Autoplay
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 7000);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`min-h-[calc(100vh-5rem)] flex flex-col bg-[#0A0D14] text-[#F8FAFC] select-none ${
        isFullscreen ? 'p-6 fixed inset-0 z-50 overflow-hidden' : 'rounded-2xl border border-[#1E2433]'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-semibold rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="px-6 py-4 border-b border-[#1E2433] bg-[#0E121B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-center text-[#FFBF24] shadow-sm">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>BizMind Project Pitch Deck</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2433] text-[#FFBF24] font-bold">
                Slide {currentSlide + 1} of {totalSlides}
              </span>
            </div>
            <div className="text-[11px] text-[#94A3B8] truncate max-w-xs sm:max-w-md">
              {slide.category} • {slide.title}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {plans.length > 0 && (
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#121722] border border-[#1E2433] text-xs font-medium text-white focus:outline-none focus:border-[#FFBF24]"
            >
              <option value="platform">Platform Overview Deck</option>
              {plans.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  Plan: {p.businessName}
                </option>
              ))}
            </select>
          )}

          {/* Animation Settings Pill */}
          <button
            onClick={() => setShowAnimSettings((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showAnimSettings
                ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                : 'border-[#1E2433] hover:bg-[#121722] text-[#94A3B8] hover:text-white'
            }`}
            title="Configure Framer Motion transitions"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Motion Engine</span>
          </button>

          <button
            onClick={() => setShowDrawer((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-lg border border-[#1E2433] hover:bg-[#121722] text-xs font-medium text-[#94A3B8] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Overview grid (8 Slides)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">8 Slides</span>
          </button>

          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showNotes
                ? 'bg-[#FFBF24]/10 border-[#FFBF24] text-[#FFBF24]'
                : 'border-[#1E2433] hover:bg-[#121722] text-[#94A3B8] hover:text-white'
            }`}
            title="Toggle Speaker Notes"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'border-[#1E2433] hover:bg-[#121722] text-[#94A3B8] hover:text-white'
            }`}
            title="Auto-play slideshow"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto'}</span>
          </button>

          {/* Download Animated Deck (HTML) */}
          <button
            onClick={handleExportHtml}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Download Standalone 8-Page Animated Deck (HTML)"
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Animated HTML</span>
            <span className="sm:hidden">HTML</span>
          </button>

          {/* Export PPTX Button */}
          <button
            onClick={handleExportPptx}
            disabled={isExportingPptx}
            className="px-3.5 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0A0D14] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            title="Download Native PowerPoint (.pptx) 8 Pages with Vector Charts & Slide Transitions"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPptx ? 'Exporting...' : 'Export PPTX (8p)'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-[#1E2433] hover:bg-[#121722] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-[#1E2433] hover:bg-[#121722] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Animation Engine Configuration Panel */}
      {showAnimSettings && (
        <div className="px-6 py-3 border-b border-[#1E2433] bg-[#0c0f16] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8] font-semibold">Transition:</span>
              {(['slide', 'fade', 'zoom', 'flip'] as TransitionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTransitionType(t)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-all cursor-pointer ${
                    transitionType === t
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-[#181D29] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8] font-semibold">Physics Engine:</span>
              {(['smooth', 'spring', 'cinematic'] as AnimationPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setAnimPreset(p)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-all cursor-pointer ${
                    animPreset === p
                      ? 'bg-[#FFBF24] text-[#0A0D14] font-bold shadow-sm'
                      : 'bg-[#181D29] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#64748B]">
            Powered by Framer Motion Orchestrator • 8 Choreographed Slides with Spring Dynamics
          </div>
        </div>
      )}

      {/* Progress Bar (8 segments) */}
      <div className="w-full h-1 bg-[#121722] flex">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-full flex-1 transition-all duration-300 border-r border-[#0A0D14] ${
              i <= currentSlide
                ? 'bg-gradient-to-r from-[#FFBF24] to-[#F59E0B]'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Slide Canvas Area */}
      <div className="flex-1 relative flex flex-col justify-between p-6 sm:p-10 overflow-y-auto">
        <SlideAnimationEngine
          currentSlide={currentSlide}
          direction={direction}
          preset={animPreset}
          transitionType={transitionType}
        >
          {/* Slide Header */}
          <div className="space-y-1 mb-4">
            <span className={`text-xs font-bold uppercase tracking-widest ${themeColors.text}`}>
              {slide.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">{slide.subtitle}</p>
          </div>

          {/* Slide Dynamic Body */}
          <div className="flex-1 flex flex-col justify-center py-2">
            {slide.content(selectedPlan, theme)}
          </div>

          {/* Slide Footer */}
          <div className="pt-4 border-t border-[#1E2433] flex items-center justify-between text-xs text-[#64748B] mt-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFBF24]"></span>
              <span>BizMind • AI Business Planning & Decision Intelligence Platform</span>
            </span>
            <span className="font-mono text-[#FFBF24] font-bold">
              Page {currentSlide + 1} of {totalSlides}
            </span>
          </div>
        </SlideAnimationEngine>

        {/* Floating Slide Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#121722]/80 hover:bg-[#1E2433] border border-[#1E2433] text-white shadow-xl backdrop-blur transition-all cursor-pointer group z-20"
          title="Previous slide (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 text-[#94A3B8] group-hover:text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#121722]/80 hover:bg-[#1E2433] border border-[#1E2433] text-white shadow-xl backdrop-blur transition-all cursor-pointer group z-20"
          title="Next slide (Right Arrow or Space)"
        >
          <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white" />
        </button>
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div className="px-6 py-4 border-t border-[#1E2433] bg-[#0E121B] animate-fade-in flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#FFBF24] shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Presenter Notes & Talk Track (Slide {currentSlide + 1} of {totalSlides})
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{slide.notes}</p>
          </div>
          <button
            onClick={() => setShowNotes(false)}
            className="text-[#64748B] hover:text-white text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide Thumbnails Drawer (8 Slides) */}
      {showDrawer && (
        <div className="p-4 border-t border-[#1E2433] bg-[#0E121B] overflow-x-auto">
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                  setShowDrawer(false);
                }}
                className={`p-2.5 rounded-xl border text-left shrink-0 w-48 transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-[#121722] border-[#FFBF24] shadow-md ring-1 ring-[#FFBF24]'
                    : 'bg-[#121722]/60 border-[#1E2433] hover:border-[#252D3F]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#FFBF24]">Page {idx + 1} of 8</span>
                  <span className="text-[#64748B] truncate max-w-20">{s.category.split('•')[0]}</span>
                </div>
                <div className="text-xs font-semibold text-white mt-1 truncate">{s.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Keyboard Hint Bar */}
      <div className="px-6 py-2.5 bg-[#080A10] border-t border-[#1E2433] flex items-center justify-between text-[11px] text-[#64748B]">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#121722] border border-[#1E2433] font-mono text-[10px] text-white mr-1">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-[#121722] border border-[#1E2433] font-mono text-[10px] text-white mr-1">
              →
            </kbd>
            Navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#121722] border border-[#1E2433] font-mono text-[10px] text-white mr-1">
              Space
            </kbd>
            Next
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#121722] border border-[#1E2433] font-mono text-[10px] text-white mr-1">
              F
            </kbd>
            Fullscreen
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#FFBF24] font-semibold">8 Comprehensive Project Slides</span>
          <span>•</span>
          <span className="text-emerald-400">Live Spatial Map Demo Included</span>
          <span>•</span>
          <span>Native PPTX & Standalone HTML</span>
        </div>
      </div>
    </div>
  );
};
