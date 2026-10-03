/**
 * BizMind – Elite Motion Slideshow & Pitch Deck Player
 * Features:
 * - Fluid Framer Motion slide animation engine with choreographed entrances
 * - Live interactive Recharts vector charts embedded in slides matching the PowerPoint file
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

  // 12 Choreographed Presentation Slides
  const slides: SlideData[] = [
    // Slide 1: Hero Cover
    {
      id: 1,
      category: 'Investor Pitch Deck',
      title: selectedPlan ? selectedPlan.businessName : 'BIZMIND AI PLATFORM',
      subtitle: selectedPlan
        ? `Comprehensive Venture Feasibility & Geospatial Market Validation Dossier for ${selectedPlan.location || 'Target Corridor'}`
        : 'Enterprise Geospatial Intelligence, Unit Economics Modeling & ML Venture Success Regressor',
      notes:
        'Welcome investors and stakeholders. BizMind is the unified decision intelligence platform that eliminates business failure through empirical geospatial indexing and mathematical unit economics.',
      content: (plan) => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-8"
        >
          <motion.div variants={fadeUpVariant} className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full flex items-center gap-1.5 ${themeColors.text} ${themeColors.bg} border ${themeColors.border}`}>
              <Sparkles className="w-3.5 h-3.5" />
              Decision Intelligence v2.4
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              Production Validated
            </span>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {plan ? plan.businessName : 'Where Spatial Demographics Meet Financial Precision.'}
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed max-w-3xl">
              {plan
                ? plan.description ||
                  `Strategic market analysis and financial feasibility modeling for ${plan.category} in ${plan.location}.`
                : 'Enabling entrepreneurs, venture funds, and franchise operators to stress-test unit economics, map micro-radius competitor clustering, and forecast success with calibrated machine learning.'}
            </p>
          </motion.div>

          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1E2433]">
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] hover:border-[#FFBF24]/50 transition-colors">
              <div className="text-xs font-semibold text-[#FFBF24] uppercase">CapEx Investment</div>
              <div className="text-2xl font-bold text-white mt-1">
                {plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$875,000'}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">Total launch capital</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] hover:border-sky-400/50 transition-colors">
              <div className="text-xs font-semibold text-sky-400 uppercase">Fixed Burn (OpEx)</div>
              <div className="text-2xl font-bold text-white mt-1">
                {plan ? `${formatCurrency(plan.totalMonthlyFixedExpenses || 0)}/mo` : '$165,000 / mo'}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">Recurring overhead</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] hover:border-emerald-400/50 transition-colors">
              <div className="text-xs font-semibold text-emerald-400 uppercase">Projected Net Margin</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {plan ? formatPercentage(plan.profitMargin || 0) : '22.9% Net'}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">After fixed & variable COGS</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] hover:border-purple-400/50 transition-colors">
              <div className="text-xs font-semibold text-purple-400 uppercase">Payback Timeline</div>
              <div className="text-2xl font-bold text-white mt-1">
                {plan ? `${plan.paybackPeriodMonths || 12.1} Mo` : '12.1 Months'}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">Recoup investment</div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 2: CapEx Donut Chart
    {
      id: 2,
      category: 'CapEx Breakdown',
      title: 'Startup Capital Allocation & Investment Structure',
      subtitle: 'Native vector distribution of initial capital expenditure and working capital reserves',
      notes:
        'Walk through the initial capital allocation. The 3-month working capital buffer ensures survival during footfall ramp-up.',
      content: (plan) => {
        const capexData = [
          { name: 'Property Deposit', value: plan?.propertyDeposit || 250000, color: '#FFBF24' },
          { name: 'Interior Setup', value: plan?.interiorSetup || 280000, color: '#38BDF8' },
          { name: 'Equipment Cost', value: plan?.equipmentCost || 180000, color: '#10B981' },
          { name: 'Initial Inventory', value: plan?.initialInventory || 35000, color: '#A855F7' },
          { name: 'Technology Setup', value: plan?.technologyCost || 20000, color: '#F43F5E' },
          { name: 'Launch Marketing', value: plan?.launchMarketing || 25000, color: '#F59E0B' },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto my-auto"
          >
            <motion.div variants={chartRevealVariant} className="h-80 w-full p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                CapEx Allocation (Vector Doughnut Engine)
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsPieChart>
                  <Pie
                    data={capexData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
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

            <motion.div variants={containerStaggerVariants} className="space-y-4">
              {[
                { title: 'Total Startup Outlay', val: plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$790,000', sub: 'Comprehensive fixed CapEx requirement', color: 'text-[#FFBF24]' },
                { title: 'Working Capital Reserve', val: plan ? formatCurrency((plan.totalMonthlyFixedExpenses || 165000) * 3) : '$495,000', sub: '3-month buffer to absorb footfall ramp-up', color: 'text-sky-400' },
                { title: 'Equipment & Infrastructure', val: plan ? formatCurrency(plan.equipmentCost || 180000) : '$180,000', sub: 'Commercial assets with depreciation buffer', color: 'text-emerald-400' },
              ].map((item, i) => (
                <motion.div key={i} variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                  <div className="text-xs text-[#94A3B8] font-medium">{item.title}</div>
                  <div className={`text-2xl font-bold ${item.color}`}>{item.val}</div>
                  <div className="text-xs text-[#64748B]">{item.sub}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      },
    },

    // Slide 3: The 4 Failure Vectors
    {
      id: 3,
      category: 'Market Need & Friction',
      title: 'The $1.3T Failure Epidemic: Why 90% of Startups Collapse',
      subtitle: 'Entrepreneurs fail not from lack of ambition, but from preventable blind spots in site selection and capital modeling',
      notes:
        'Explain the core problem: 42% of startups fail from misjudged market demand and site saturation; 29% run out of cash due to primitive spreadsheets.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto my-auto"
        >
          {[
            { num: '42%', title: 'No Market Demand & Site Saturation', desc: 'Committing to long-term commercial leases based on surface foot-traffic impressions rather than competitor clustering and target purchasing power.', tag: 'FATAL LOCATION' },
            { num: '29%', title: 'Premature Cash Depletion', desc: 'Spreadsheets fail to calculate customer ramp-up drag and variable cost spikes, exhausting cash reserves before achieving break-even.', tag: 'CASH RUNWAY' },
            { num: '23%', title: 'Pricing & Unit Economics Distortion', desc: 'Setting retail price points without accounting for exact contribution margins, spoilage, merchant processing fees, and utility overhead.', tag: 'MARGIN EROSION' },
            { num: '19%', title: 'Outcompeted by Hidden Rivals', desc: 'Failing to track nearby complementary vs direct rivals, allowing aggressive local competitors to capture prime customer footfall corridors.', tag: 'MARKET SHARE' },
          ].map((pc, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className="p-5 rounded-xl bg-[#121722] border border-rose-500/30 space-y-2 hover:border-rose-500/60 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-rose-500">{pc.num}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {pc.tag}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{pc.title}</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{pc.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 4: Enterprise Architecture
    {
      id: 4,
      category: 'Technical Blueprint',
      title: 'Unified Platform Architecture: Built for Scale & Low Latency',
      subtitle: 'Engineered with clean separation of concerns, high throughput, and zero-downtime ACID fallbacks',
      notes:
        'Highlight the 4 distinct tiers: React 19 SPA, Node.js API gateway, Python FastAPI ML microservice, and spatial engine.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 max-w-5xl mx-auto my-auto"
        >
          {[
            { tier: 'TIER 01: PRESENTATION & CLIENT', name: 'React 19 + TypeScript + Vite + Tailwind', desc: 'Responsive SPA, motion transitions, dark Leaflet/OSM GIS renderer, interactive Recharts dashboard.', color: 'border-[#FFBF24]', text: 'text-[#FFBF24]' },
            { tier: 'TIER 02: API GATEWAY & LOGIC', name: 'Node.js 22 + Express + JWT Authentication', desc: 'Deterministic financial formulas, RBAC authorization, ACID in-memory fallback, REST microservices.', color: 'border-sky-400', text: 'text-sky-400' },
            { tier: 'TIER 03: GEOSPATIAL INTELLIGENCE', name: 'Google Places (New) + OpenStreetMap Overpass', desc: 'Isochrone radius dispersion (500m to 5km), footfall synergy proxies, white-space gap detection.', color: 'border-emerald-400', text: 'text-emerald-400' },
            { tier: 'TIER 04: ML PREDICTIVE PIPELINE', name: 'Python FastAPI + XGBoost + Scikit-Learn', desc: 'Sub-20ms inference latency, Random Forest & XGBoost ensembles, calibrated Responsible AI validation.', color: 'border-purple-400', text: 'text-purple-400' },
          ].map((at, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className={`p-4 rounded-xl bg-[#121722] border-l-4 ${at.color} border border-[#1E2433] flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${at.text}`}>{at.tier}</div>
                <div className="text-sm font-bold text-white mt-0.5">{at.name}</div>
              </div>
              <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">{at.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 5: 6-Stage Process Workflow
    {
      id: 5,
      category: 'Process Workflow',
      title: 'The 6-Stage Guided Planning Methodology',
      subtitle: 'From initial business idea to bank-ready financial projections and location validation',
      notes:
        'Walk through the 6 stages. Each stage is validated automatically before moving to the next.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto my-auto"
        >
          {[
            { step: '01', title: 'Business Identity', sub: 'Category, target demographic, B2B/B2C model, and location corridor.' },
            { step: '02', title: 'CapEx Outlay', sub: 'Itemized setup: deposits, fit-outs, equipment, licenses, initial inventory.' },
            { step: '03', title: 'OpEx Fixed Burn', sub: 'Rent, payroll, utilities, marketing, maintenance, insurance, loan EMI.' },
            { step: '04', title: 'Unit Economics', sub: 'Ticket size, daily customer volume, operating days, variable COGS.' },
            { step: '05', title: 'Assumptions Review', sub: 'Validation checks, sensitivity buffers, and scenario stress testing.' },
            { step: '06', title: 'Live KPI Dashboard', sub: 'Break-even units, payback period, annual ROI, and cash projections.' },
          ].map((ps, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className="p-5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#FFBF24]/40 transition-colors">
              <span className="text-2xl font-black text-[#FFBF24]">{ps.step}</span>
              <h4 className="text-base font-bold text-white">{ps.title}</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{ps.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 6: 12-Month Line Chart
    {
      id: 6,
      category: 'Financial Modeling',
      title: '12-Month Financial Trajectory: Compounding Revenue vs. Expenses',
      subtitle: 'Live trajectory curve showing revenue ramp-up crossing the fixed expense baseline to establish cash neutrality',
      notes:
        'Point out the month-by-month compounding growth. The break-even intersection occurs in month 3, providing positive cash flow thereafter.',
      content: (plan) => {
        const baseRev = plan?.monthlyRevenue || 316800;
        const baseExp = plan?.totalMonthlyExpenses || 244200;
        const lineData = [
          { month: 'M1', revenue: Math.round(baseRev * 0.75), expenses: Math.round(baseExp * 0.95) },
          { month: 'M2', revenue: Math.round(baseRev * 0.82), expenses: Math.round(baseExp * 0.97) },
          { month: 'M3', revenue: Math.round(baseRev * 0.90), expenses: Math.round(baseExp * 0.98) },
          { month: 'M4', revenue: Math.round(baseRev * 0.96), expenses: Math.round(baseExp * 1.0) },
          { month: 'M5', revenue: Math.round(baseRev * 1.02), expenses: Math.round(baseExp * 1.01) },
          { month: 'M6', revenue: Math.round(baseRev * 1.08), expenses: Math.round(baseExp * 1.02) },
          { month: 'M7', revenue: Math.round(baseRev * 1.14), expenses: Math.round(baseExp * 1.03) },
          { month: 'M8', revenue: Math.round(baseRev * 1.19), expenses: Math.round(baseExp * 1.04) },
          { month: 'M9', revenue: Math.round(baseRev * 1.24), expenses: Math.round(baseExp * 1.05) },
          { month: 'M10', revenue: Math.round(baseRev * 1.28), expenses: Math.round(baseExp * 1.06) },
          { month: 'M11', revenue: Math.round(baseRev * 1.32), expenses: Math.round(baseExp * 1.07) },
          { month: 'M12', revenue: Math.round(baseRev * 1.36), expenses: Math.round(baseExp * 1.08) },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            <motion.div variants={chartRevealVariant} className="lg:col-span-2 h-80 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                12-Month Cash Flow Trajectory (Framer Vector Line)
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsLineChart data={lineData}>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  <Line type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} animationDuration={1000} />
                  <Line type="monotone" dataKey="expenses" name="Total Expenses" stroke="#F43F5E" strokeWidth={2} strokeDasharray="5 5" animationDuration={800} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={containerStaggerVariants} className="space-y-4">
              <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Break-Even Sales Volume</div>
                <div className="text-2xl font-bold text-[#FFBF24]">
                  {plan ? `${plan.breakEvenUnits || 1000} Units` : '1,000 Units'}
                </div>
                <div className="text-xs text-[#64748B]">Monthly minimum units to break even</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Break-Even Revenue</div>
                <div className="text-2xl font-bold text-sky-400">
                  {plan ? formatCurrency(plan.breakEvenRevenue || 220000) : '$220,000'}
                </div>
                <div className="text-xs text-[#64748B]">Cash-neutral revenue threshold</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Capacity Buffer</div>
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

    // Slide 7: Scenario Clustered Bar Chart
    {
      id: 7,
      category: 'Risk & Sensitivity',
      title: 'Stress-Testing: Scenario Comparison & Downside Protection',
      subtitle: 'Comparative matrix demonstrating solvency across Conservative (-20%), Base, and Optimistic (+20%) scenarios',
      notes:
        'Review the 3 stress cases. Even in the Conservative case with 20% lower footfall, the business maintains a safe runway.',
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
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Monthly Performance Under Stress (Framer Clustered Bar)
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
                { title: 'Conservative Case (-20%)', body: 'Footfall drops by 20% while costs inflate by 5%. Cash reserves absorb the slowdown with zero insolvency.', color: 'border-rose-500/40' },
                { title: 'Base Target Case', body: 'Expected steady-state yielding 22.9% net margin and full initial capital payback in 12.1 months.', color: 'border-[#FFBF24]/50' },
                { title: 'Optimistic Case (+20%)', body: 'High customer repeat frequency yields 29.3% net margin, accelerating payback to 8.5 months.', color: 'border-emerald-500/40' },
              ].map((item, idx) => (
                <motion.div key={idx} variants={popScaleVariant} className={`p-3.5 rounded-xl bg-[#121722] border ${item.color} space-y-1`}>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      },
    },

    // Slide 8: Geospatial Intelligence
    {
      id: 8,
      category: 'Spatial Intelligence',
      title: 'Geospatial Competitor Density & White-Space Discovery',
      subtitle: 'Indexing target locations with micro-radius competitor clustering and footfall synergy scores',
      notes:
        'Discuss spatial intelligence: Isochrone radius bands, differentiation between direct competitors and traffic-driving complementary businesses.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto my-auto"
        >
          {[
            { num: '01', title: 'Isochrone Radius Banding', body: 'Calculates competitor density across 500m, 1km, 2km, and 5km bands to evaluate pedestrian accessibility and vehicular retail draw.', stat: '500m - 5km Dynamic Radii', accent: 'text-sky-400' },
            { num: '02', title: 'Footfall Synergy vs Rivalry', body: 'Differentiates direct competitors (dividing category spend) from complementary hubs (transit, offices, retail anchors) that drive footfall.', stat: 'Synergy Score Algorithm', accent: 'text-[#FFBF24]' },
            { num: '03', title: 'White-Space Gap Discovery', body: 'Highlights high-density residential and commercial pockets where specific consumer offerings are completely unserved.', stat: 'Opportunity Score Index', accent: 'text-emerald-400' },
          ].map((gm, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className="p-6 rounded-2xl bg-[#121722] border border-[#1E2433] flex flex-col justify-between h-80 hover:border-[#FFBF24]/40 transition-colors">
              <div>
                <span className={`text-3xl font-black ${gm.accent}`}>{gm.num}</span>
                <h4 className="text-lg font-bold text-white mt-3">{gm.title}</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{gm.body}</p>
              </div>
              <div className="pt-4 border-t border-[#1E2433]">
                <span className="text-xs px-3 py-1 rounded bg-[#1E2433] text-white font-medium">
                  {gm.stat}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 9: ML Feature Importance Bar Chart
    {
      id: 9,
      category: 'Predictive Modeling',
      title: 'Machine Learning Engine: Feature Weights & Validation Guards',
      subtitle: 'Ensemble model (XGBoost + Random Forest) evaluating venture survival risk tiers with calibrated validation guards',
      notes:
        'Explain the empirical feature attribution: Footfall Density 32%, Capital Adequacy 26%, Proximity 21%. Emphasize the Responsible AI validation guard.',
      content: () => {
        const featureData = [
          { feature: 'Footfall Density', weight: 32 },
          { feature: 'Capital Adequacy', weight: 26 },
          { feature: 'Competitor Proximity', weight: 21 },
          { feature: 'Demographic Income', weight: 14 },
          { feature: 'Seasonality Index', weight: 7 },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            <motion.div variants={chartRevealVariant} className="h-80 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                ML Feature Attribution Weights (%)
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsBarChart layout="vertical" data={featureData}>
                  <XAxis type="number" stroke="#64748B" fontSize={11} domain={[0, 40]} />
                  <YAxis type="category" dataKey="feature" stroke="#64748B" fontSize={11} width={130} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Weight']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="weight" fill="#FFBF24" radius={[0, 4, 4, 0]} animationDuration={900} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="p-6 rounded-2xl bg-[#121722] border border-[#1E2433] space-y-4">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                RESPONSIBLE AI GOVERNANCE
              </div>
              <h4 className="text-lg font-bold text-white">Validation Guards & Safety Policy</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                BizMind strictly avoids false confidence or hallucinations. Success probability percentages are displayed <strong>ONLY</strong> when empirical training data for the specific category and region is statistically calibrated.
              </p>
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                If data is insufficient for a niche venture, BizMind reports:
                <br />
                <code className="text-[#FFBF24] font-semibold mt-1 block">
                  "Prediction unavailable — insufficient validated data"
                </code>
                and automatically falls back to transparent rule-based feasibility scoring.
              </div>
            </motion.div>
          </motion.div>
        );
      },
    },

    // Slide 10: Administrative MLOps & Telemetry
    {
      id: 10,
      category: 'Operations & Quality',
      title: 'Administrative MLOps & Production Telemetry',
      subtitle: 'Real-time telemetry, model drift detection, and automated retraining pipelines',
      notes:
        'Detail the administrative oversight: ~14ms inference latency, 91.8% validated accuracy, and comprehensive audit logs.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto my-auto"
        >
          {[
            { title: 'Inference Latency', val: '14.2ms', sub: 'Average response time', desc: 'Ultra-fast sub-20ms inference enables immediate metric updates inside the financial wizard.', color: 'text-sky-400' },
            { title: 'Model Accuracy', val: '91.8%', sub: 'Validated F1: 0.894', desc: 'Ensemble model evaluated against multi-year municipal small business survival registries.', color: 'text-emerald-400' },
            { title: 'Audit Trail', val: '100% ACID', sub: 'Tamper-evident logs', desc: 'Granular administrative logs of plan updates, role changes, and dataset modifications.', color: 'text-[#FFBF24]' },
          ].map((om, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className="p-6 rounded-2xl bg-[#121722] border border-[#1E2433] flex flex-col justify-between h-80">
              <div>
                <div className="text-xs font-bold text-[#94A3B8] uppercase">{om.title}</div>
                <div className={`text-4xl font-extrabold mt-2 ${om.color}`}>{om.val}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{om.sub}</div>
                <p className="text-xs text-[#94A3B8] mt-4 leading-relaxed">{om.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 11: Real-World ROI & Transformation Scorecard
    {
      id: 11,
      category: 'Value Realization',
      title: 'Transformation Scorecard: Proven Business Outcomes',
      subtitle: 'Proven outcomes delivered to entrepreneurs, analysts, and lending partners',
      notes:
        'Review the proven business impact: 85% planning time reduction, 3.4x capital efficiency, and 94% loan approval readiness.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-6 max-w-5xl mx-auto my-auto"
        >
          {[
            { stat: '85%', label: 'Planning Time Compressed', detail: 'Accelerates business plan formulation from 3-4 weeks to under an hour of structured, data-driven modeling.', color: 'text-[#FFBF24]' },
            { stat: '3.4x', label: 'Higher Capital Efficiency', detail: 'Prevents premature burnout by accurately sizing fixed reserves and working capital before leasing commercial space.', color: 'text-sky-400' },
            { stat: '94%', label: 'Loan & Pitch Readiness', detail: 'Produces institutional-grade financial projections and location dossiers accepted by lenders, landlords, and angels.', color: 'text-emerald-400' },
            { stat: '< 20ms', label: 'Real-Time Spatial Queries', detail: 'Instantaneous competitor mapping and radius density retrieval via optimized geospatial APIs.', color: 'text-purple-400' },
          ].map((sc, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className="p-6 rounded-2xl bg-[#121722] border border-[#1E2433] space-y-2">
              <div className={`text-4xl sm:text-5xl font-black ${sc.color}`}>{sc.stat}</div>
              <div className="text-base font-bold text-white">{sc.label}</div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{sc.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 12: Roadmap & Strategic Vision
    {
      id: 12,
      category: 'The Vision Ahead',
      title: 'Strategic Roadmap & Next Horizons',
      subtitle: 'From single-location planning to enterprise multi-unit franchise intelligence',
      notes:
        'Conclude with the roadmap: Multi-unit franchise intelligence, supplier wholesale bidding, and global commercial lease datasets.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto my-auto"
        >
          {[
            { phase: 'PHASE 01: COMPLETED', title: 'Core Engine & Spatial Mapping', items: ['6-stage financial wizard with unit economics', 'Google Places & OSM Overpass engines', 'XGBoost success prediction prototype', 'Role-based User & Admin consoles'], active: false },
            { phase: 'PHASE 02: ACTIVE DEPLOYMENT', title: 'Scenario & MLOps Pipeline', items: ['Sensitivity stress-testing & break-even models', 'Multi-scenario financial forecasting', 'Admin MLOps telemetry & retraining', 'One-click native PowerPoint (.pptx) generator'], active: true },
            { phase: 'PHASE 03: FUTURE EXPANSION', title: 'Enterprise Multi-Unit Expansion', items: ['Multi-location franchise portfolio modeling', 'AI supplier procurement & wholesale bidding', 'Commercial lease intelligence & footfall sensors', 'Global demographic data feeds'], active: false },
          ].map((rp, idx) => (
            <motion.div key={idx} variants={popScaleVariant} className={`p-6 rounded-2xl bg-[#121722] border ${rp.active ? 'border-[#FFBF24]' : 'border-[#1E2433]'} flex flex-col justify-between h-96`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${rp.active ? 'text-[#FFBF24]' : 'text-[#64748B]'}`}>
                  {rp.phase}
                </span>
                <h4 className="text-base font-bold text-white mt-2">{rp.title}</h4>
                <ul className="mt-4 space-y-2 text-xs text-[#94A3B8]">
                  {rp.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFBF24] shrink-0 mt-1.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {rp.active && (
                <div className="pt-4 border-t border-[#1E2433]">
                  <span className="text-[10px] font-semibold text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/30 px-2.5 py-1 rounded-full">
                    Active Deployment
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ),
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
              <span>BizMind Motion Pitch Deck</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E2433] text-[#FFBF24] font-bold">
                {currentSlide + 1} / {totalSlides}
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
            title="Overview grid"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Slides</span>
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
            title="Download Standalone Animated Deck (Runs in browser with 100% active animations, offline)"
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Download Animated HTML</span>
            <span className="sm:hidden">Animated</span>
          </button>

          {/* Export PPTX Button */}
          <button
            onClick={handleExportPptx}
            disabled={isExportingPptx}
            className="px-3.5 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0A0D14] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            title="Download Microsoft PowerPoint (.pptx) with Vector Charts & Slide Transitions"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPptx ? 'Exporting...' : 'Export PPTX'}</span>
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
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
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
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
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
            Powered by Framer Motion Orchestrator • Choreographed Stagger & Spring Physics
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[#121722]">
        <div
          className="h-full bg-gradient-to-r from-[#FFBF24] via-[#F59E0B] to-sky-400 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Canvas Area */}
      <div className="flex-1 relative flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        <SlideAnimationEngine
          currentSlide={currentSlide}
          direction={direction}
          preset={animPreset}
          transitionType={transitionType}
        >
          {/* Slide Header */}
          <div className="space-y-1 mb-6">
            <span className={`text-xs font-bold uppercase tracking-widest ${themeColors.text}`}>
              {slide.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">{slide.subtitle}</p>
          </div>

          {/* Slide Dynamic Body */}
          <div className="flex-1 flex flex-col justify-center py-4">
            {slide.content(selectedPlan, theme)}
          </div>

          {/* Slide Footer */}
          <div className="pt-6 border-t border-[#1E2433] flex items-center justify-between text-xs text-[#64748B] mt-6">
            <span>BizMind • AI Business Planning & Decision Intelligence</span>
            <span className="font-mono text-[#FFBF24] font-bold">
              {currentSlide + 1} of {totalSlides}
            </span>
          </div>
        </SlideAnimationEngine>

        {/* Floating Slide Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#121722]/80 hover:bg-[#1E2433] border border-[#1E2433] text-white shadow-xl backdrop-blur transition-all cursor-pointer group"
          title="Previous slide (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 text-[#94A3B8] group-hover:text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#121722]/80 hover:bg-[#1E2433] border border-[#1E2433] text-white shadow-xl backdrop-blur transition-all cursor-pointer group"
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
              Presenter Notes & Talk Track
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

      {/* Slide Thumbnails Drawer */}
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
                className={`p-2.5 rounded-xl border text-left shrink-0 w-44 transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-[#121722] border-[#FFBF24] shadow-md ring-1 ring-[#FFBF24]'
                    : 'bg-[#121722]/60 border-[#1E2433] hover:border-[#252D3F]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#FFBF24]">Slide {idx + 1}</span>
                  <span className="text-[#64748B] truncate max-w-16">{s.category}</span>
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
          <span className="text-[#FFBF24]">🔥 Framer Motion Engine Active</span>
          <span>•</span>
          <span>Native PowerPoint & Standalone Animated HTML Available</span>
        </div>
      </div>
    </div>
  );
};
