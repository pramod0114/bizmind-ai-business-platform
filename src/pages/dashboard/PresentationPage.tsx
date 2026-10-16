/**
 * BizMind – Project Presentation & Technical Architecture Deck
 * Features:
 * - Slide 1: Rajarambapu Institute of Technology (RIT) MCA Capstone Project Technical Report
 * - RIT Logo displayed across all slides
 * - Clean Fullscreen Mode: Displays ONLY the slide, Floating Close (X), and Previous/Next (< >) controls
 * - Slide 8: Real-Time Spatial Radar centered on Uran Islampur Narshhpur Road with live API integration
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  AreaChart as RechartsAreaChart,
  Area,
} from 'recharts';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Download,
  DollarSign,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  Lightbulb,
  X,
  Presentation,
  CheckCircle2,
  Database,
  Compass,
  Radar,
  ShieldCheck,
  Server,
  Code2,
  GraduationCap,
  Users,
  Award,
  FileText,
  FileSpreadsheet,
  GitCompare,
  Sparkles,
  Bookmark,
  ArrowUpRight,
  BarChart3,
  Activity,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { generateBizMindPptx } from '../../services/pptxService';
import { generateAnimatedHtmlPresentation } from '../../services/animatedHtmlExportService';
import {
  SlideAnimationEngine,
  containerStaggerVariants,
  fadeUpVariant,
  popScaleVariant,
  chartRevealVariant,
} from '../../components/presentation/SlideAnimationEngine';
import { LiveLocationIntelligenceDemo } from '../../components/presentation/LiveLocationIntelligenceDemo';
import { RitLogo } from '../../components/common/RitLogo';
import { BusinessPlan } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SlideData {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  notes: string;
  content: (plan?: BusinessPlan | null) => React.ReactNode;
}

// Interactive Animated Prediction Graph Component for Slide 7
const AnimatedPredictionGraph: React.FC = () => {
  const [footfall, setFootfall] = useState<number>(48);

  const curveData = useMemo(() => {
    return [15, 25, 33, 40, 48, 55, 65, 75, 90].map((cust) => {
      const logit = (cust - 33.3) * 0.12;
      const prob = Math.round((1 / (1 + Math.exp(-logit))) * 100);
      return {
        customers: `${cust}`,
        custVal: cust,
        probability: Math.min(99, Math.max(5, prob)),
        breakEven: 50,
      };
    });
  }, []);

  const currentProb = useMemo(() => {
    const logit = (footfall - 33.3) * 0.12;
    return Math.min(99, Math.max(5, Math.round((1 / (1 + Math.exp(-logit))) * 100)));
  }, [footfall]);

  const featureWeights = [
    { name: 'Daily Footfall & Demand Velocity', weight: 32, color: 'bg-[#10B981]' },
    { name: 'Competitor Proximity & Saturation', weight: 24, color: 'bg-[#0EA5E9]' },
    { name: 'Unit Contribution Margin Ratio', weight: 21, color: 'bg-[#FFBF24]' },
    { name: 'Initial CapEx Runway Cushion', weight: 15, color: 'bg-[#8B5CF6]' },
    { name: 'Demographic Spending Density', weight: 8, color: 'bg-[#F43F5E]' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 w-full items-stretch">
      {/* Animated Curve & Live Simulation Panel */}
      <div className="lg:col-span-7 p-3.5 sm:p-4 rounded-xl bg-[#121722] border border-[#1E2433] flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
              <span>Animated Prediction Probability Curve</span>
            </div>
            <div className="text-xs text-[#94A3B8]">
              Success Viability vs Footfall Demand (Sigmoid ML Calibrated Curve)
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#A1A1AA] uppercase block font-mono">Viability Score</span>
            <span className={`text-base font-extrabold ${currentProb >= 70 ? 'text-[#10B981]' : currentProb >= 50 ? 'text-[#FFBF24]' : 'text-[#EF4444]'}`}>
              {currentProb}% {currentProb >= 70 ? 'High' : currentProb >= 50 ? 'Moderate' : 'High Risk'}
            </span>
          </div>
        </div>

        {/* Live Recharts Animated Area Graph */}
        <div className="h-44 sm:h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={curveData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="customers" stroke="#64748B" fontSize={10} tickLine={false} unit="/d" />
              <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} unit="%" tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1D', borderColor: '#27272A', borderRadius: 8, fontSize: 11 }}
                formatter={(val: any) => [`${val}%`, 'Viability Probability']}
                labelFormatter={(lbl) => `Footfall: ${lbl} customers/day`}
              />
              <Area
                type="monotone"
                dataKey="probability"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#predGrad)"
                isAnimationActive={true}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="breakEven"
                stroke="#F59E0B"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Footfall Slider */}
        <div className="p-2.5 rounded-lg bg-[#0E121B] border border-[#1E2433] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A1AA] flex items-center gap-1.5">
              <span>Interactive Footfall Scenario:</span>
              <strong className="text-white font-mono">{footfall} customers/day</strong>
            </span>
            <span className="text-[10px] text-[#FFBF24] font-semibold bg-[#FFBF24]/10 border border-[#FFBF24]/30 px-2 py-0.5 rounded">
              Break-Even: 33.3 / day
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={90}
            step={1}
            value={footfall}
            onChange={(e) => setFootfall(parseInt(e.target.value, 10))}
            className="w-full accent-[#10B981] cursor-pointer h-1.5 bg-[#27272A] rounded-lg"
          />
          <div className="flex justify-between text-[9px] font-mono text-[#64748B]">
            <span>15 (Downturn)</span>
            <span>33 (Break-Even)</span>
            <span>48 (Target Plan)</span>
            <span>90 (Boom)</span>
          </div>
        </div>
      </div>

      {/* Feature Importance & Model Specs */}
      <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-xl bg-[#121722] border border-[#1E2433] flex flex-col justify-between space-y-3">
        <div>
          <div className="text-[10px] font-bold text-[#FFBF24] uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>Random Forest Feature Importance</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-0.5">
            100 Calibrated Decision Trees • Gini Impurity Weights
          </div>
        </div>

        <div className="space-y-2.5">
          {featureWeights.map((f, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-white font-medium truncate max-w-[200px]">{f.name}</span>
                <span className="text-[#94A3B8] font-mono font-bold">{f.weight}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1E2433] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.weight * 3}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`h-full rounded-full ${f.color}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Model Accuracy Metadata */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E2433] text-[10px]">
          <div className="p-2 rounded bg-[#0E121B] border border-[#1E2433]">
            <span className="text-[#64748B] block">Model Accuracy</span>
            <span className="text-white font-bold font-mono">91.4% (5-Fold CV)</span>
          </div>
          <div className="p-2 rounded bg-[#0E121B] border border-[#1E2433]">
            <span className="text-[#64748B] block">AUC-ROC Metric</span>
            <span className="text-[#10B981] font-bold font-mono">0.942 High Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PresentationPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('platform');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
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
      showToast('Downloaded Native PowerPoint (.pptx) with Vector Charts & RIT Branding');
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
      showToast('Downloaded Standalone Animated Deck (.html)');
    } catch (err: any) {
      console.error('Failed to export HTML deck:', err);
      showToast('Export failed: ' + (err?.message || 'Error'));
    }
  };

  // Full comprehensive 9-slide deck starting with official RIT Capstone Report Slide
  const slides: SlideData[] = [
    // SLIDE 1: Official RIT Capstone Technical Report Cover
    {
      id: 1,
      category: '01 / Academic Capstone Technical Report',
      title: 'CAPSTONE PROJECT TECHNICAL REPORT',
      subtitle: 'Rajarambapu Institute of Technology, Rajaramnagar — Department of Computer Applications',
      notes:
        'Official introduction. Presenting the Master of Computer Applications (MCA) Capstone Technical Project: BizMind - AI Business Planner & Success Prediction Platform, under the guidance of Ms. A. R. Patil.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center items-center h-full max-w-4xl mx-auto text-center space-y-4 py-2"
        >
          {/* Header Metadata */}
          <motion.div variants={fadeUpVariant} className="space-y-1">
            <div className="text-xs sm:text-sm font-semibold tracking-wide text-[#94A3B8]">
              Academic Year: <span className="text-white font-bold">2026 – 27</span>
            </div>
            <div className="text-[11px] sm:text-xs text-[#64748B] italic">
              (An Empowered Autonomous Institute, Affiliated to Shivaji University, Kolhapur)
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#F8FAFC] tracking-wide uppercase pt-1">
              RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR
            </div>
            <div className="text-xs sm:text-sm text-[#FFBF24] font-semibold tracking-wider uppercase">
              Department of Computer Applications
            </div>
          </motion.div>

          {/* Official RIT Logo Banner */}
          <motion.div variants={popScaleVariant} className="py-1">
            <RitLogo className="w-56 h-16 sm:w-64 sm:h-20 shadow-xl border border-black/20" />
          </motion.div>

          {/* Project Title */}
          <motion.div variants={fadeUpVariant} className="space-y-1.5 pt-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              &ldquo;<span className="text-[#EF4444]">Biz</span><span className="text-white">Mind</span> &ndash; AI Business Planner &amp; Success Prediction Platform&rdquo;
            </h1>
          </motion.div>

          {/* Guidance & Team Grid */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
            {/* Guide Card */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] text-left space-y-1">
              <div className="text-[10px] font-semibold text-[#FFBF24] uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Under the Guidance of</span>
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                Ms. A. R. Patil
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                Department of Computer Applications, RIT
              </div>
            </motion.div>

            {/* Presented By Team Card */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] text-left space-y-1.5">
              <div className="text-[10px] font-semibold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Presented By (Project Team)</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div>
                  <div className="font-bold text-white">Pramod Rajendra Mahajan</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547047</div>
                </div>
                <div>
                  <div className="font-bold text-white">Harshad Shahaji Patil</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547062</div>
                </div>
                <div>
                  <div className="font-bold text-white">Sakshi Dnyaneshwar Randive</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547048</div>
                </div>
                <div>
                  <div className="font-bold text-white">Rutika Rajesh Deshmukh</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547025</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="text-[10px] font-mono text-[#64748B] pt-1">
            RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR • SANGALI, MAHARASHTRA
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 2: Feature 1 – Business Plans Portfolio & Venture Tracking
    {
      id: 2,
      category: '02 / Feature 1: Business Plans',
      title: 'Business Plans Portfolio & Venture Tracking',
      subtitle: 'Centralized repository for comprehensive business models, financial snapshots, feasibility ratings, and version management.',
      notes:
        'The Business Plans module serves as the command center for entrepreneurs. It allows managing multi-location ventures, reviewing feasibility ratings, tracking CapEx allocations, and cloning plans for rapid scenario testing.',
      content: (plan) => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-4"
        >
          {/* Header Summary Stats */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Active Portfolios</div>
              <div className="text-xl font-bold text-white mt-0.5">2+ Ventures</div>
              <div className="text-[10px] text-[#10B981] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> All Analyzed
              </div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Evaluated CapEx</div>
              <div className="text-xl font-bold text-[#FFBF24] mt-0.5">$2.32M Total</div>
              <div className="text-[10px] text-[#64748B]">Across Coffee &amp; Fitness</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Avg Payback Time</div>
              <div className="text-xl font-bold text-[#38BDF8] mt-0.5">11.9 Months</div>
              <div className="text-[10px] text-[#64748B]">~1.0 Year Capital Return</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Avg Feasibility</div>
              <div className="text-xl font-bold text-[#10B981] mt-0.5">83.0 / 100</div>
              <div className="text-[10px] text-[#10B981]">High Feasibility Tier</div>
            </motion.div>
          </motion.div>

          {/* Business Plans Showcase Cards */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Card 1: Artisanal Cafe */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-3 hover:border-[#FFBF24]/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#FFBF24] uppercase tracking-wider bg-[#FFBF24]/10 border border-[#FFBF24]/20 px-2 py-0.5 rounded">
                    Food &amp; Beverage • B2C
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">The Roasted Bean Artisanal Café</h3>
                  <div className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#38BDF8]" /> Indiranagar, Bengaluru
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-bold">
                  84 / 100
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2433] text-left">
                <div className="p-2 rounded bg-[#0E121B]">
                  <span className="text-[10px] text-[#64748B] block">Initial CapEx</span>
                  <span className="text-xs font-bold text-white font-mono">$875,000</span>
                </div>
                <div className="p-2 rounded bg-[#0E121B]">
                  <span className="text-[10px] text-[#64748B] block">Net Profit/mo</span>
                  <span className="text-xs font-bold text-[#10B981] font-mono">$72,600</span>
                </div>
                <div className="p-2 rounded bg-[#0E121B]">
                  <span className="text-[10px] text-[#64748B] block">Payback</span>
                  <span className="text-xs font-bold text-[#38BDF8] font-mono">12.1 Mos</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-[#94A3B8]">
                <span>Status: <strong className="text-white">Analyzed &amp; Verified</strong></span>
                <span className="text-[#FFBF24] font-medium">Break-Even: 1,000 units/mo</span>
              </div>
            </motion.div>

            {/* Plan Card 2: Fitness Studio */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-3 hover:border-[#38BDF8]/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#38BDF8] uppercase tracking-wider bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded">
                    Fitness &amp; Wellness • Sub
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">Aura High-Intensity &amp; Yoga Studio</h3>
                  <div className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#38BDF8]" /> Bandra West, Mumbai
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-bold">
                  82 / 100
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2433] text-left">
                <div className="p-2 rounded bg-[#0E121B]">
                  <span className="text-[10px] text-[#64748B] block">Initial CapEx</span>
                  <span className="text-xs font-bold text-white font-mono">$1,450,000</span>
                </div>
                <div className="p-2 rounded bg-[#0E121B]">
                  <span className="text-[10px] text-[#64748B] block">Net Profit/mo</span>
                  <span className="text-xs font-bold text-[#10B981] font-mono">$124,000</span>
                </div>
                <div className="p-2 rounded bg-[#0E121B]">
                  <span className="text-[10px] text-[#64748B] block">Payback</span>
                  <span className="text-xs font-bold text-[#38BDF8] font-mono">11.7 Mos</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-[#94A3B8]">
                <span>Status: <strong className="text-white">Analyzed &amp; Verified</strong></span>
                <span className="text-[#38BDF8] font-medium">Break-Even: 80 members/mo</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Module Capabilities Bar */}
          <motion.div variants={fadeUpVariant} className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">
              <strong>Full Lifecycle Support:</strong> Create, Clone, Edit, Financial Deep-Dive, Compare &amp; Native PPTX Export
            </span>
            <span className="text-[#FFBF24] font-semibold text-[11px]">Instant 1-Click Duplication</span>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 3: Feature 2 – Planner Wizard: 6-Step Dynamic Financial Modeling
    {
      id: 3,
      category: '03 / Feature 2: Planner Wizard',
      title: 'Planner Wizard: 6-Step Dynamic Financial Modeling',
      subtitle: 'Step-by-step guided business model architect transforming commercial concepts into mathematically sound ventures.',
      notes:
        'The 6-Step Planner Wizard guides founders through Business Info, Initial Investment (CapEx), Monthly Expenses (OpEx), Revenue & Unit Economics, Assumptions Review, and Feasibility Dashboard with zero manual spreadsheet errors.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-4"
        >
          {/* 6 Step Pipeline Flow */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { num: '01', title: 'Business Profile', desc: 'Category, target demographic, and business model selection (B2C, B2B, Sub)', icon: FileText, color: 'text-sky-400' },
              { num: '02', title: 'Initial CapEx', desc: 'Lease deposit, interior fit-out, machinery, licensing, and IT hardware', icon: DollarSign, color: 'text-[#FFBF24]' },
              { num: '03', title: 'Monthly OpEx', desc: 'Base rent, staffing payroll, utilities, marketing budget, and insurance', icon: Layers, color: 'text-purple-400' },
              { num: '04', title: 'Unit Economics', desc: 'Average ticket price, variable cost per unit, and projected daily customer count', icon: TrendingUp, color: 'text-emerald-400' },
              { num: '05', title: 'Review & Audit', desc: 'Deterministic formulas cross-audit assumptions before dashboard generation', icon: CheckCircle2, color: 'text-amber-400' },
              { num: '06', title: 'Feasibility Matrix', desc: 'Automated break-even volume, payback horizon, and viability scoring', icon: BarChart3, color: 'text-rose-400' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  variants={popScaleVariant}
                  className="p-3 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1.5 hover:border-[#FFBF24]/40 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">{step.num}</span>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                    <p className="text-[10px] text-[#94A3B8] leading-tight mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Key Advantages Grid */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Zero Spreadsheet Dependency</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Replaces fragile Excel formulas with certified deterministic math equations executing real-time in milliseconds.
              </p>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Instant Dynamic Re-Calculation</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Tweak expected customer footfall or unit price; watch break-even volume and payback period recompute in real-time.
              </p>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Automated Feasibility Grade</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Synthesizes operating margin, break-even capacity %, and payback horizon into an empirical score out of 100.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 4: Feature 3 – Financial Feasibility Engine & Break-Even Trajectory
    {
      id: 4,
      category: '04 / Feature 3: Financial Feasibility',
      title: 'Financial Feasibility Engine & Break-Even Trajectory',
      subtitle: 'Deterministic unit economics, CapEx recovery timeline, 12-month compounding cash flow, and multi-scenario solvency.',
      notes:
        'This engine computes exact contribution margins, break-even unit volumes, and 12-month compounding cash curves. Evaluators can see how customer ramp-up crosses the operational cost floor.',
      content: (plan) => {
        const capexData = [
          { name: 'Interior & Build-out', value: 280000, color: '#FFBF24' },
          { name: 'Property Deposit', value: 250000, color: '#38BDF8' },
          { name: 'Equipment & Mach.', value: 180000, color: '#10B981' },
          { name: 'Tech & Licenses', value: 45000, color: '#8B5CF6' },
          { name: 'Launch & Mktg', value: 60000, color: '#F43F5E' },
          { name: 'Initial Inventory', value: 60000, color: '#F59E0B' },
        ];

        const cashFlowData = [
          { month: 'M1', revenue: 158400, expenses: 204600, netProfit: -46200 },
          { month: 'M2', revenue: 205920, expenses: 216480, netProfit: -10560 },
          { month: 'M3', revenue: 253440, expenses: 228360, netProfit: 25080 },
          { month: 'M4', revenue: 285120, expenses: 236280, netProfit: 48840 },
          { month: 'M6', revenue: 316800, expenses: 244200, netProfit: 72600 },
          { month: 'M9', revenue: 332640, expenses: 248160, netProfit: 84480 },
          { month: 'M12', revenue: 348480, expenses: 252120, netProfit: 96360 },
        ];

        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-5xl mx-auto h-full items-center"
          >
            {/* Left: CapEx Donut Breakdown */}
            <motion.div variants={popScaleVariant} className="lg:col-span-5 p-3.5 sm:p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#FFBF24] uppercase tracking-wider">CapEx Allocation</div>
                  <div className="text-xs text-[#94A3B8]">Total Initial Investment: $875,000</div>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">100% Sized</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={capexData} dataKey="value" innerRadius={42} outerRadius={68} paddingAngle={3}>
                      {capexData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1A1A1D', borderColor: '#27272A', borderRadius: 8, fontSize: 11 }}
                      formatter={(val: any) => [`$${val.toLocaleString()}`, 'Investment']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                {capexData.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[#94A3B8] truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: 12-Month Cash Flow & Break-Even Curve */}
            <motion.div variants={popScaleVariant} className="lg:col-span-7 p-3.5 sm:p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">12-Month Compounding Curve</div>
                  <div className="text-xs text-[#94A3B8]">Revenue vs Operating Expenses vs Net Profit</div>
                </div>
                <span className="text-[10px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 px-2 py-0.5 rounded border border-[#FFBF24]/20">Break-Even @ M3</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={cashFlowData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1A1A1D', borderColor: '#27272A', borderRadius: 8, fontSize: 11 }}
                      formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2.5} dot={{ r: 2.5 }} />
                    <Line type="monotone" dataKey="expenses" name="OpEx" stroke="#EF4444" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#38BDF8" strokeWidth={2} dot={{ r: 2 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#1E2433] text-center text-[10px]">
                <div className="p-1.5 rounded bg-[#0E121B]">
                  <span className="text-[#64748B] block">Break-Even Vol</span>
                  <span className="text-white font-bold font-mono">1,000 units/mo</span>
                </div>
                <div className="p-1.5 rounded bg-[#0E121B]">
                  <span className="text-[#64748B] block">Contribution Margin</span>
                  <span className="text-[#10B981] font-bold font-mono">$165 / unit</span>
                </div>
                <div className="p-1.5 rounded bg-[#0E121B]">
                  <span className="text-[#64748B] block">Operating Margin</span>
                  <span className="text-[#38BDF8] font-bold font-mono">22.9%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 5: Feature 4 – Market Analysis & Real-Time Spatial Radar (Using existing Slide 8 Live Spatial Demo)
    {
      id: 5,
      category: '05 / Feature 4: Market Analysis',
      title: 'Market Analysis & Real-Time Spatial Radar',
      subtitle: 'Target Corridor: Uran Islampur Narshhpur Road — Live spatial query connecting Google Places & OpenStreetMap Overpass spatial engines.',
      notes:
        'Live interactive spatial radar centered on Uran Islampur Narshhpur Road (Islampur, Maharashtra). Evaluates real-time business discovery, radius expansion from 500m to 5km, competitor threat scoring, and saturation index.',
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

    // SLIDE 6: Feature 5 – Comparison Engine: Multi-Location & Scenario Benchmarking
    {
      id: 6,
      category: '06 / Feature 5: Comparison Engine',
      title: 'Comparison Engine: Multi-Location & Scenario Benchmarking',
      subtitle: 'Side-by-side empirical decision matrix evaluating prospective locations, pricing variations, and operational cost structures.',
      notes:
        'The Comparison tool enables entrepreneurs to evaluate multiple target sites side-by-side (e.g., Uran Islampur Road vs Rajaramnagar vs Indiranagar), benchmarking competitor density, opportunity scores, and payback periods.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-4"
        >
          {/* 3-Location Benchmark Cards */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Candidate 1: Uran Islampur Road (Winner) */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border-2 border-[#10B981]/50 space-y-3 relative shadow-lg shadow-[#10B981]/10">
              <div className="absolute -top-2.5 right-3 bg-[#10B981] text-[#0B0B0C] text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                Recommended Choice
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#10B981] font-bold uppercase">Candidate A</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Uran Islampur Narshhpur Rd</h3>
                <div className="text-[11px] text-[#94A3B8]">Islampur Commercial Artery</div>
              </div>
              <div className="space-y-1.5 text-xs border-t border-[#1E2433] pt-2">
                <div className="flex justify-between"><span className="text-[#94A3B8]">Opportunity Score:</span> <strong className="text-[#10B981] font-mono">78 / 100</strong></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Competitor Saturation:</span> <span className="text-white font-mono">14 Competitors</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Avg Competitor Dist:</span> <span className="text-white font-mono">340 meters</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Break-Even Period:</span> <strong className="text-[#FFBF24] font-mono">11.4 Months</strong></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Estimated Monthly Rent:</span> <span className="text-white font-mono">$32,000 / mo</span></div>
              </div>
              <div className="p-2 rounded bg-[#10B981]/10 text-[10px] text-[#10B981] font-medium leading-tight">
                Optimal balance: High commuter footfall, lowest saturation per sq km, and fastest payback.
              </div>
            </motion.div>

            {/* Candidate 2: Rajaramnagar */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-3 hover:border-[#38BDF8]/40 transition-colors">
              <div>
                <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase">Candidate B</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Rajaramnagar Campus Hub</h3>
                <div className="text-[11px] text-[#94A3B8]">RIT Educational Corridor</div>
              </div>
              <div className="space-y-1.5 text-xs border-t border-[#1E2433] pt-2">
                <div className="flex justify-between"><span className="text-[#94A3B8]">Opportunity Score:</span> <strong className="text-[#38BDF8] font-mono">71 / 100</strong></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Competitor Saturation:</span> <span className="text-white font-mono">28 Competitors</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Avg Competitor Dist:</span> <span className="text-white font-mono">210 meters</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Break-Even Period:</span> <strong className="text-[#FFBF24] font-mono">12.8 Months</strong></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Estimated Monthly Rent:</span> <span className="text-white font-mono">$38,000 / mo</span></div>
              </div>
              <div className="p-2 rounded bg-[#0E121B] text-[10px] text-[#94A3B8] leading-tight">
                High youth density, moderate snack competition. Good secondary expansion site.
              </div>
            </motion.div>

            {/* Candidate 3: Indiranagar Metropole */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-3 hover:border-[#FFBF24]/40 transition-colors">
              <div>
                <span className="text-[10px] font-mono text-[#FFBF24] font-bold uppercase">Candidate C</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Indiranagar 100ft Road</h3>
                <div className="text-[11px] text-[#94A3B8]">Bengaluru Tier-1 Metropole</div>
              </div>
              <div className="space-y-1.5 text-xs border-t border-[#1E2433] pt-2">
                <div className="flex justify-between"><span className="text-[#94A3B8]">Opportunity Score:</span> <strong className="text-[#FFBF24] font-mono">65 / 100</strong></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Competitor Saturation:</span> <span className="text-rose-400 font-mono">86 Competitors</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Avg Competitor Dist:</span> <span className="text-rose-400 font-mono">85 meters</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Break-Even Period:</span> <strong className="text-white font-mono">15.2 Months</strong></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Estimated Monthly Rent:</span> <span className="text-white font-mono">$95,000 / mo</span></div>
              </div>
              <div className="p-2 rounded bg-[#0E121B] text-[10px] text-[#94A3B8] leading-tight">
                Dense footfall with intense brand rivalry; requires high marketing capital cushion.
              </div>
            </motion.div>
          </motion.div>

          {/* Analytical Decision Takeaway */}
          <motion.div variants={fadeUpVariant} className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">
              <strong>Multi-Criteria Scoring Formula:</strong> Weighted aggregation of Market Gap (35%), Footfall (30%), OpEx Overhead (20%), and Payback Speed (15%).
            </span>
            <span className="text-[#10B981] font-bold font-mono">Variance Delta: +24.8% Feasibility</span>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 7: Feature 6 – Predictions [ML]: Ensemble Viability & Animated Graph
    {
      id: 7,
      category: '07 / Feature 6: ML Predictions',
      title: 'Predictions [ML]: Ensemble Viability & Animated Graph',
      subtitle: 'Calibrated Scikit-Learn Random Forest ensemble with animated probability curves, feature weights, and interactive sensitivity simulation.',
      notes:
        'The Predictions module leverages an ensemble of 100 Random Forest decision trees trained on commercial venture datasets. It predicts overall venture viability, displays dynamic sensitivity curves, and identifies key risk factors.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-full max-w-5xl mx-auto flex flex-col justify-center"
        >
          <AnimatedPredictionGraph />
        </motion.div>
      ),
    },

    // SLIDE 8: Feature 7 – Recommendations: Prescriptive Strategic Action Engine
    {
      id: 8,
      category: '08 / Feature 7: Recommendations',
      title: 'Recommendations: Prescriptive Strategic Action Engine',
      subtitle: 'Algorithmic decision optimization delivering targeted operational, pricing, spatial, and cash buffer improvements.',
      notes:
        'The Recommendations engine analyzes the financial and spatial model to prescribe specific high-impact actions, such as lease negotiations, ticket bundling, and corridor positioning to improve overall viability.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-4"
        >
          {/* 4 Categorized Recommendations */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Action 1: Cost Optimization */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#10B981]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded">
                  OpEx Optimization • High Impact
                </span>
                <span className="text-xs font-mono font-bold text-[#10B981]">-120 Units/mo</span>
              </div>
              <h4 className="text-xs font-bold text-white">Commercial Lease Lock-in &amp; Overhead Trimming</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Negotiate 3-year rent cap with 60-day rent-free fit-out period. Reduces break-even threshold volume by 12% and protects early cash flows.
              </p>
            </motion.div>

            {/* Action 2: Pricing Strategy */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#FFBF24]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#FFBF24] uppercase bg-[#FFBF24]/10 border border-[#FFBF24]/20 px-2 py-0.5 rounded">
                  Pricing &amp; Margin • High Impact
                </span>
                <span className="text-xs font-mono font-bold text-[#FFBF24]">+$30 Margin/Unit</span>
              </div>
              <h4 className="text-xs font-bold text-white">Combo Ticket Bundling Strategy</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Bundle premium pour-overs with artisan sourdough pastries at $260 average ticket size, boosting unit contribution margin from $165 to $195.
              </p>
            </motion.div>

            {/* Action 3: Spatial Positioning */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#38BDF8]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#38BDF8] uppercase bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded">
                  Spatial Capture • Medium Impact
                </span>
                <span className="text-xs font-mono font-bold text-[#38BDF8]">+28% Morning Footfall</span>
              </div>
              <h4 className="text-xs font-bold text-white">Transit Corridor Micro-Frontage</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Situate storefront within 200m of the prime commuter road junction along Uran Islampur Road to capture morning rush-hour commuters.
              </p>
            </motion.div>

            {/* Action 4: Liquidity Buffer */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#8B5CF6]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8B5CF6] uppercase bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-2 py-0.5 rounded">
                  Solvency Cushion • Critical
                </span>
                <span className="text-xs font-mono font-bold text-[#8B5CF6]">2.5 Mos OpEx Buffer</span>
              </div>
              <h4 className="text-xs font-bold text-white">Working Capital Liquidity Safety Net</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Retain $410,000 cash reserve to insulate against initial 60-day customer acquisition ramp-up variability before break-even crossover.
              </p>
            </motion.div>
          </motion.div>

          {/* Projected Overall Outcome */}
          <motion.div variants={fadeUpVariant} className="p-3.5 rounded-xl bg-[#0E121B] border border-[#10B981]/30 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-white">Combined Prescriptive Recommendation Impact</div>
              <div className="text-[11px] text-[#94A3B8]">Estimated feasibility score acceleration upon implementing top recommendations</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#94A3B8]">84/100 → <strong className="text-[#10B981]">92/100 (+8 pts)</strong></span>
              <span className="text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30">Payback -2.1 Mos</span>
            </div>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 9: Project Conclusion – Simple, Real-World Business Decision Platform
    {
      id: 9,
      category: '09 / Project Conclusion',
      title: 'Conclusion & Key Takeaways',
      subtitle: 'How BizMind helps everyday entrepreneurs make smart, confident, and risk-free business decisions.',
      notes:
        'In conclusion, BizMind makes business planning simple, clear, and practical. Entrepreneurs can calculate their costs, find the right location, study nearby competitors, and get simple advice before spending their money.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-4"
        >
          {/* 3 Core Conclusion Pillars */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Pillar 1: Easy Planning */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#FFBF24]/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FFBF24]/15 border border-[#FFBF24]/30 flex items-center justify-center text-[#FFBF24]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Easy Business Planning</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Calculate startup costs, monthly bills, and daily sales goals in minutes without messy spreadsheets or complicated accounting terms.
              </p>
              <div className="text-[10px] font-mono text-[#FFBF24] pt-1">
                Know your profit & break-even point
              </div>
            </motion.div>

            {/* Pillar 2: Smart Location Check */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#38BDF8]/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Smart Location Check</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                See nearby competitors on the map and check customer footfall before renting a shop, helping you avoid overcrowded spots.
              </p>
              <div className="text-[10px] font-mono text-[#38BDF8] pt-1">
                Pick the best spot for your shop
              </div>
            </motion.div>

            {/* Pillar 3: Lower Risk & Practical Advice */}
            <motion.div variants={popScaleVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2 hover:border-[#10B981]/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Practical Success Advice</h3>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Receive clear, easy suggestions on setting product prices, cutting extra expenses, and keeping a cash buffer so your business survives and grows.
              </p>
              <div className="text-[10px] font-mono text-[#10B981] pt-1">
                Save money & avoid beginner mistakes
              </div>
            </motion.div>
          </motion.div>

          {/* Simple Takeaways Summary Strip */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Test First</div>
              <div className="text-base font-bold text-[#10B981] font-mono mt-0.5">Zero Risk</div>
              <div className="text-[10px] text-[#64748B]">Test ideas before spending money</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Clear Answers</div>
              <div className="text-base font-bold text-[#38BDF8] font-mono mt-0.5">Simple Data</div>
              <div className="text-[10px] text-[#64748B]">Easy charts anyone can understand</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Better Decisions</div>
              <div className="text-base font-bold text-[#FFBF24] font-mono mt-0.5">Smart Guidance</div>
              <div className="text-[10px] text-[#64748B]">Practical tips for real-world shops</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">For Everyone</div>
              <div className="text-base font-bold text-purple-400 font-mono mt-0.5">Free & Open</div>
              <div className="text-[10px] text-[#64748B]">Built for students & new founders</div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 10: Attractive Animated Thank You & Project Defense
    {
      id: 10,
      category: '10 / Thank You & Project Defense',
      title: 'THANK YOU!',
      subtitle: 'Questions, Technical Inquiries & Defense Discussion — BizMind AI Business Planning & Location Intelligence Platform',
      notes:
        'Thank the respected evaluators, guide Ms. A. R. Patil, and Department of Computer Applications faculty. The floor is open for project defense questions, technical architectural inquiries, and live system demonstrations.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center items-center h-full max-w-5xl mx-auto text-center space-y-6 py-4"
        >
          {/* Large Hero Title */}
          <motion.div variants={popScaleVariant} className="space-y-3">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-white">
              Thank <span className="bg-gradient-to-r from-[#FFBF24] via-[#F59E0B] to-[#38BDF8] bg-clip-text text-transparent">You!</span>
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] font-medium max-w-2xl mx-auto leading-relaxed">
              We extend our heartfelt gratitude to our project guide <strong className="text-white">Ms. A. R. Patil</strong> and faculty members at <strong className="text-white">Rajarambapu Institute of Technology</strong> for their continuous mentorship, support, and guidance.
            </p>
          </motion.div>

          {/* Centered Presented By Team Card */}
          <motion.div
            variants={popScaleVariant}
            className="w-full max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-[#121722] border border-[#1E2433] space-y-4 hover:border-[#38BDF8]/40 transition-colors shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-wider pb-2.5 border-b border-[#1E2433]">
              <Users className="w-4 h-4 text-[#38BDF8]" />
              <span>Presented By (Project Team)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433] flex items-center justify-between">
                <span className="font-semibold text-white text-xs sm:text-sm">Pramod Rajendra Mahajan</span>
                <span className="text-[11px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/20 px-2 py-0.5 rounded">2547047</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433] flex items-center justify-between">
                <span className="font-semibold text-white text-xs sm:text-sm">Harshad Shahaji Patil</span>
                <span className="text-[11px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/20 px-2 py-0.5 rounded">2547062</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433] flex items-center justify-between">
                <span className="font-semibold text-white text-xs sm:text-sm">Sakshi Dnyaneshwar Randive</span>
                <span className="text-[11px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/20 px-2 py-0.5 rounded">2547048</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0E121B] border border-[#1E2433] flex items-center justify-between">
                <span className="font-semibold text-white text-xs sm:text-sm">Rutika Rajesh Deshmukh</span>
                <span className="text-[11px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/20 px-2 py-0.5 rounded">2547025</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Institutional Banner */}
          <motion.div variants={fadeUpVariant} className="text-[11px] font-mono text-[#64748B] pt-1">
            RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR • SANGALI, MAHARASHTRA • 2026–27
          </motion.div>
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

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error(err));
    }
    setIsFullscreen(false);
  };

  // Sync fullscreen change with document fullscreen event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
        setShowDrawer(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Smooth mouse-wheel and touch-pad scrolling navigation with debounce lock
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Don't hijack if drawer modal is open
      if (showDrawer) return;

      // Allow internal scrolling inside interactive maps or modal lists
      const target = e.target as HTMLElement | null;
      if (target?.closest('.leaflet-container') || target?.closest('.overflow-y-auto') || target?.closest('select')) {
        return;
      }

      // Filter out small jitter
      if (Math.abs(e.deltaY) < 25) return;

      if (isScrollingRef.current) return;

      if (e.deltaY > 0) {
        // Scroll down -> advance to next slide
        isScrollingRef.current = true;
        nextSlide();
      } else if (e.deltaY < 0) {
        // Scroll up -> return to previous slide
        isScrollingRef.current = true;
        prevSlide();
      }

      // 750ms lock prevents rapid skipping and gives animations ample time to play smoothly
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 750);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (showDrawer) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null || showDrawer) return;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      touchStartY.current = null;
      touchStartX.current = null;

      if (isScrollingRef.current) return;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < -45) {
          isScrollingRef.current = true;
          nextSlide();
        } else if (deltaY > 45) {
          isScrollingRef.current = true;
          prevSlide();
        }
      } else {
        if (deltaX < -45) {
          isScrollingRef.current = true;
          nextSlide();
        } else if (deltaX > 45) {
          isScrollingRef.current = true;
          prevSlide();
        }
      }

      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 750);
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [nextSlide, prevSlide, showDrawer]);

  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 7000);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, nextSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`min-h-[calc(100vh-80px)] flex flex-col bg-[#0A0D14] text-white selection:bg-[#FFBF24] selection:text-black ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-[#0A0D14] h-screen w-screen overflow-hidden'
          : 'rounded-2xl border border-[#1E2433] overflow-hidden'
      }`}
    >
      {/* 
        CLEAN FULLSCREEN MODE:
        When isFullscreen is true, completely hide all normal top controllers, buttons, tabs, and export tools.
        Show ONLY the slide, with:
        - Floating close button (X) in top right
        - Floating previous button (<) on left edge
        - Floating next button (>) on right edge
      */}
      {isFullscreen ? (
        <>
          {/* Top Floating Bar in Fullscreen: Just the RIT Logo & Minimal Close X */}
          <div className="absolute top-4 left-6 right-6 z-40 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3">
              <RitLogo className="w-28 h-8 shadow-md" />
              <div className="px-2.5 py-1 rounded-full bg-[#121722]/80 backdrop-blur-md border border-[#1E2433] text-[11px] font-mono text-[#FFBF24]">
                Slide {currentSlide + 1} / {totalSlides}
              </div>
            </div>

            <button
              onClick={exitFullscreen}
              className="pointer-events-auto p-2.5 rounded-full bg-[#121722]/90 hover:bg-[#1E2433] border border-[#27272A] hover:border-[#FFBF24] text-[#A1A1AA] hover:text-white transition-all shadow-xl cursor-pointer group"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform text-[#FFBF24]" />
            </button>
          </div>

          {/* Floating Left Navigation Button (<) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-[#121722]/85 hover:bg-[#1E2433] border border-[#27272A] hover:border-[#FFBF24] text-white transition-all shadow-2xl cursor-pointer group"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 text-[#FFBF24] group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Floating Right Navigation Button (>) */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-[#121722]/85 hover:bg-[#1E2433] border border-[#27272A] hover:border-[#FFBF24] text-white transition-all shadow-2xl cursor-pointer group"
            title="Next Slide (Right Arrow / Space)"
          >
            <ChevronRight className="w-6 h-6 text-[#FFBF24] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      ) : (
        /* Normal Standard Controller Bar */
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#1E2433] bg-[#0E121B]/90 backdrop-blur-md">
          {/* Left: Presentation Branding & RIT Logo */}
          <div className="flex items-center gap-3">
            <RitLogo className="w-24 h-7" />
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-xs font-medium text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>
                Slide {currentSlide + 1} of {totalSlides}
              </span>
            </button>

            <span className="hidden sm:inline text-xs font-mono text-[#64748B] truncate max-w-xs">
              {currentSlideData.category}
            </span>
          </div>

          {/* Center: Venture Feasibility Plan Selector */}
          {plans.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#94A3B8] hidden md:inline">Feasibility Plan:</span>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="bg-[#141824] text-xs text-white border border-[#1E2433] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#FFBF24]"
              >
                <option value="platform">BizMind Project Architecture (Default)</option>
                {plans.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.businessName} ({p.location || 'Local'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Right: Controls & Export */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-[#FFBF24]/20 border-[#FFBF24] text-[#FFBF24]'
                  : 'bg-[#141824] border-[#1E2433] text-[#94A3B8] hover:text-white'
              }`}
              title={isPlaying ? 'Pause Auto-Play (7s)' : 'Auto-Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                showNotes
                  ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                  : 'bg-[#141824] border-[#1E2433] text-[#94A3B8] hover:text-white'
              }`}
              title="Toggle Presenter Speaking Notes"
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-xs font-medium text-white transition-colors cursor-pointer"
              title="Download Standalone Animated HTML Deck"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">HTML</span>
            </button>

            <button
              onClick={handleExportPptx}
              disabled={isExportingPptx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#E5AC20] text-black font-bold text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              title="Download Native PowerPoint (.pptx) with Vector Charts & RIT Branding"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{isExportingPptx ? 'Exporting...' : 'Export PPTX (10p)'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              title="Fullscreen Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Slide Viewport */}
      <div
        className={`relative flex-1 flex flex-col justify-between overflow-hidden ${
          isFullscreen ? 'p-6 sm:p-12 h-full' : 'p-6 sm:p-10'
        }`}
      >
        {/* Slide Header with RIT Branding on EVERY Slide */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-[11px] font-mono text-[#FFBF24] tracking-wider uppercase font-semibold flex items-center gap-2">
              <span>{currentSlideData.category}</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#94A3B8]">RIT Rajaramnagar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {currentSlideData.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-4xl">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* RIT Logo Badge on All Slides */}
          <div className="hidden sm:block shrink-0">
            <RitLogo className="w-24 h-7 shadow-sm" />
          </div>
        </div>

        {/* Slide Body Animated Transition */}
        <div className="flex-1 w-full min-h-[460px] flex items-center justify-center">
          <SlideAnimationEngine currentSlide={currentSlide} slideKey={currentSlide} direction={direction}>
            {currentSlideData.content(selectedPlan)}
          </SlideAnimationEngine>
        </div>

        {/* Presenter Notes Overlay (only in standard view) */}
        {!isFullscreen && showNotes && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#0E121B] border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2.5 animate-fadeIn">
            <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Presenter Speaking Notes: </strong>
              <span>{currentSlideData.notes}</span>
            </div>
          </div>
        )}

        {/* Bottom Navigation & Progress Bar (Hidden in Fullscreen) */}
        {!isFullscreen && (
          <div className="mt-4 pt-4 border-t border-[#1E2433] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Next Slide (Right Arrow / Space)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Slide Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentSlide ? 1 : -1);
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide
                      ? 'w-8 bg-[#FFBF24]'
                      : 'w-2 bg-[#1E2433] hover:bg-[#94A3B8]'
                  }`}
                  title={`Jump to Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#64748B]">
              Slide {currentSlide + 1} of {totalSlides}
            </div>
          </div>
        )}
      </div>

      {/* Slide Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0E121B] border-l border-[#1E2433] h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2433]">
                <div className="flex items-center gap-2">
                  <RitLogo className="w-16 h-5" />
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>10-Slide Deck Index</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2 overflow-y-auto max-h-[75vh]">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setDirection(idx > currentSlide ? 1 : -1);
                      setCurrentSlide(idx);
                      setShowDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                      idx === currentSlide
                        ? 'bg-[#FFBF24]/10 border-[#FFBF24] text-white'
                        : 'bg-[#141824] border-[#1E2433] text-[#94A3B8] hover:bg-[#1A2030] hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#FFBF24]">{s.category}</div>
                    <div className="text-xs font-bold mt-0.5 truncate">{s.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E2433] text-center text-[11px] text-[#64748B]">
              Press Left/Right Arrow keys to navigate
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0E121B] border border-[#FFBF24] text-xs text-white shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#FFBF24] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default PresentationPage;
